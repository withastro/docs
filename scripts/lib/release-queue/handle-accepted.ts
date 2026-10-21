import type { GitHubClient } from './github.ts';
import { joinUmbrella } from './join.ts';
import {
	formatDryRunJoinComment,
	formatDryRunRefusalComment,
	formatIncompleteJoinComment,
	formatJoinComment,
	formatRefusalComment,
	type MessageContext,
} from './messages.ts';
import {
	canWrite,
	findOpenPullRequest,
	getPullRequest,
	getReadiness,
	getReleasePullRequest,
	postComment,
	removeLabel,
	type PullRequest,
} from './queries.ts';
import { getMainRelease, type MainRelease } from './release.ts';
import {
	ACCEPTED_LABEL,
	decide,
	getTarget,
	MAIN_BRANCH,
	UMBRELLA_PREFIX,
	type Decision,
	type RefusedDecision,
	type Route,
} from './routing.ts';
import { getUmbrellaReleaseLabel, getUmbrellaTitle, type Umbrella } from './umbrella.ts';

/**
 * - `dry-run`: only comments with the umbrella a PR would join, or why not.
 * - `main-only`: acts on PRs shipping to `main`, dry run for the others.
 * - `all`: acts on every PR.
 */
export const MODES = ['dry-run', 'main-only', 'all'] as const;

export type Mode = (typeof MODES)[number];

/**
 * Whether the bot token is required. Without it, merges would go through
 * `GITHUB_TOKEN`, and the umbrella PR would stop getting CI.
 */
export function needsBotToken(mode: Mode, shouldWrite: boolean): boolean {
	return mode !== 'dry-run' && shouldWrite;
}

export interface HandleOptions {
	/**
	 * Reads the PR and the release PR, and posts dry-run comments, as
	 * `github-actions[bot]`.
	 */
	actionsClient: GitHubClient;
	/** Joins and refuses PRs as the bot account, reads included. */
	botClient: GitHubClient;
	repo: string;
	mode: Mode;
}

/**
 * Processes a docs PR labeled `accepted`: reads the PR and the release PR of
 * `withastro/astro`, decides, then comments as a dry run, refuses, or joins.
 *
 * @param sender Who added the label. Without one, the write access check is
 * skipped.
 */
export async function handleAcceptedPullRequest(
	options: HandleOptions,
	number: number,
	sender?: string
) {
	const { actionsClient, repo } = options;
	if (sender === undefined) {
		console.info('No sender: skipping the write access check.');
	} else if (!(await canWrite(actionsClient, repo, sender))) {
		console.info(`Ignored: ${sender} can't write to ${repo}.`);
		return;
	}

	const pr = await getPullRequest(actionsClient, repo, number);
	const [readiness, releasePullRequest] = await Promise.all([
		getReadiness(actionsClient, repo, pr),
		getReleasePullRequest(actionsClient),
	]);
	const mainRelease = getMainRelease(releasePullRequest?.versions);
	const decision = decide(pr, readiness, mainRelease);
	console.info(JSON.stringify({ pr: pr.url, readiness, mainRelease, decision }, null, 2));

	if (!isLiveFor(options.mode, getTarget(pr.base))) {
		await commentDryRun(options, number, decision, mainRelease);
	} else if (decision.status === 'refuse') {
		await refuse(options, number, decision, mainRelease);
	} else {
		await join(options, pr, decision.route, mainRelease);
	}
}

/** Whether the bot changes PRs shipping to `target`, rather than a dry run. */
function isLiveFor(mode: Mode, target: string): boolean {
	return mode === 'all' || (mode === 'main-only' && target === MAIN_BRANCH);
}

async function commentDryRun(
	options: HandleOptions,
	number: number,
	decision: Decision,
	mainRelease: MainRelease
) {
	const { actionsClient, repo } = options;
	if (decision.status === 'join') {
		const umbrella = await findUmbrella(options, decision.route, mainRelease);
		await postComment(
			actionsClient,
			repo,
			number,
			formatDryRunJoinComment(decision.route, umbrella)
		);
		return;
	}
	const context = await getMessageContext(options, decision, mainRelease);
	await postComment(actionsClient, repo, number, formatDryRunRefusalComment(decision, context));
}

async function refuse(
	options: HandleOptions,
	number: number,
	decision: RefusedDecision,
	mainRelease: MainRelease
) {
	const { botClient, repo } = options;
	const context = await getMessageContext(options, decision, mainRelease);
	// Removed first, so the comment is true once posted.
	await removeLabel(botClient, repo, number, ACCEPTED_LABEL);
	await postComment(botClient, repo, number, formatRefusalComment(decision, context));
}

async function join(
	options: HandleOptions,
	pr: PullRequest,
	route: Route,
	mainRelease: MainRelease
) {
	const { botClient, repo } = options;
	const result = await joinUmbrella(botClient, repo, pr, route, {
		title: getUmbrellaTitle(route.target, mainRelease.astroVersion),
		releaseLabel: getUmbrellaReleaseLabel(route.target, mainRelease.type),
	});

	switch (result.status) {
		case 'joined':
			await postComment(botClient, repo, pr.number, formatJoinComment(route, result.umbrella));
			return;
		case 'refused': {
			const decision: RefusedDecision = { status: 'refuse', route, refusals: [result.refusal] };
			await refuse(options, pr.number, decision, mainRelease);
			return;
		}
		default: {
			await postComment(botClient, repo, pr.number, formatIncompleteJoinComment(route, result));
			// The PR is merged, but a maintainer needs to finish the join.
			const missing =
				result.status === 'unopened'
					? "the umbrella PR couldn't be opened"
					: "the labels of the umbrella PR couldn't be set";
			throw new Error(`#${pr.number} was merged into ${route.umbrellaBranch}, but ${missing}.`, {
				cause: result.error,
			});
		}
	}
}

/** Finds the open umbrella PR of `route`, or names the one to create. */
async function findUmbrella(
	{ actionsClient, repo }: HandleOptions,
	route: Route,
	mainRelease: MainRelease
): Promise<Umbrella> {
	const openUmbrella = await findOpenPullRequest(actionsClient, repo, route.umbrellaBranch);
	if (openUmbrella) return { number: openUmbrella.number };
	return { title: getUmbrellaTitle(route.target, mainRelease.astroVersion) };
}

async function getMessageContext(
	options: HandleOptions,
	decision: RefusedDecision,
	mainRelease: MainRelease
): Promise<MessageContext> {
	const context: MessageContext = {};
	if (decision.route) context.umbrella = await findUmbrella(options, decision.route, mainRelease);
	if (decision.refusals.some((refusal) => refusal.code === 'major-on-main')) {
		const { actionsClient, repo } = options;
		const mainUmbrella = await findOpenPullRequest(
			actionsClient,
			repo,
			`${UMBRELLA_PREFIX}${MAIN_BRANCH}`
		);
		if (mainUmbrella) context.mainUmbrella = { number: mainUmbrella.number };
	}
	return context;
}
