import { joinUmbrella } from './join.ts';
import { syncMergeBlockReview } from './merge-block.ts';
import {
	formatDryRunJoinComment,
	formatDryRunRefusalComment,
	formatJoinComment,
	formatRefusalComment,
	formatUnopenedJoinComment,
	type MessageContext,
} from './messages.ts';
import { isLiveFor, type QueueOptions } from './modes.ts';
import {
	canWrite,
	getPullRequest,
	getReadiness,
	getReleasePullRequest,
	postComment,
	removeLabel,
	type PullRequest,
} from './queries.ts';
import { refreshUmbrella } from './refresh.ts';
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
	usesSettledUmbrella,
} from './routing.ts';
import { findOpenUmbrella, getUmbrella } from './umbrella-queries.ts';
import { getSettledMainUmbrella } from './umbrella-state.ts';
import { getUmbrellaHeading, type Umbrella } from './umbrella.ts';

/**
 * Processes a docs PR labeled `accepted`: reads the PR, the release PR of
 * `withastro/astro` and the state of the `main` umbrella, decides, then
 * comments as a dry run, refuses, or joins.
 *
 * @param sender Who added the label. Without one, the write access check is
 * skipped.
 */
export async function handleAcceptedPullRequest(
	options: QueueOptions,
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
	const release = getMainRelease(releasePullRequest);
	const target = getTarget(pr.base);
	const settledMainUmbrella = usesSettledUmbrella(pr)
		? await getSettledMainUmbrella(actionsClient, repo, release)
		: undefined;
	const decision = decide(pr, readiness, { release, settledMainUmbrella });
	console.info(JSON.stringify({ pr: pr.url, readiness, release, decision }, null, 2));

	if (!isLiveFor(options.mode, target)) {
		await commentDryRun(options, number, decision, release);
	} else if (decision.status === 'refuse') {
		await refuse(options, number, decision, release);
	} else {
		await join(options, pr, decision.route, release);
	}
}

async function commentDryRun(
	options: QueueOptions,
	number: number,
	decision: Decision,
	release: MainRelease
) {
	const { actionsClient, repo } = options;
	if (decision.status === 'join') {
		const umbrella = await findUmbrella(options, decision.route, release);
		await postComment(
			actionsClient,
			repo,
			number,
			formatDryRunJoinComment(decision.route, umbrella)
		);
		return;
	}
	const context = await getMessageContext(options, decision, release);
	await postComment(actionsClient, repo, number, formatDryRunRefusalComment(decision, context));
}

async function refuse(
	options: QueueOptions,
	number: number,
	decision: RefusedDecision,
	release: MainRelease
) {
	const { botClient, repo } = options;
	const context = await getMessageContext(options, decision, release);
	// Removed first, so the comment is true once posted.
	await removeLabel(botClient, repo, number, ACCEPTED_LABEL);
	await postComment(botClient, repo, number, formatRefusalComment(decision, context));
}

async function join(options: QueueOptions, pr: PullRequest, route: Route, release: MainRelease) {
	const { actionsClient, botClient, repo } = options;
	const { title } = getUmbrellaHeading(route.target, release);
	const result = await joinUmbrella(botClient, repo, pr, route, title);

	switch (result.status) {
		case 'joined': {
			const { umbrella } = result;
			await postComment(botClient, repo, pr.number, formatJoinComment(route, umbrella));
			// Without a number, the umbrella creation was only printed.
			if ('number' in umbrella) {
				const openUmbrella = await getUmbrella(botClient, repo, umbrella.number);
				const refreshed = await refreshUmbrella(botClient, repo, openUmbrella, release);
				await syncMergeBlockReview(actionsClient, repo, refreshed, { shouldBlock: true });
			}
			return;
		}
		case 'refused': {
			const decision: RefusedDecision = { status: 'refuse', route, refusals: [result.refusal] };
			await refuse(options, pr.number, decision, release);
			return;
		}
		case 'unopened':
			await postComment(botClient, repo, pr.number, formatUnopenedJoinComment(route, result));
			// The PR is merged, but a maintainer needs to open the umbrella PR.
			throw new Error(
				`#${pr.number} was merged into ${route.umbrellaBranch}, but the umbrella PR couldn't be opened.`,
				{ cause: result.error }
			);
		default: {
			const unknown: never = result;
			throw new Error(`Unknown join result: ${JSON.stringify(unknown)}`);
		}
	}
}

/** Finds the open umbrella PR of `route`, or names the one to create. */
async function findUmbrella(
	{ actionsClient, repo }: QueueOptions,
	route: Route,
	release: MainRelease
): Promise<Umbrella> {
	const openUmbrella = await findOpenUmbrella(actionsClient, repo, route.umbrellaBranch);
	if (openUmbrella) return { number: openUmbrella.number };
	return { title: getUmbrellaHeading(route.target, release).title };
}

async function getMessageContext(
	options: QueueOptions,
	decision: RefusedDecision,
	release: MainRelease
): Promise<MessageContext> {
	const context: MessageContext = {};
	if (decision.route) context.umbrella = await findUmbrella(options, decision.route, release);
	if (decision.refusals.some((refusal) => refusal.code === 'major-on-main')) {
		const { actionsClient, repo } = options;
		const mainUmbrella = await findOpenUmbrella(
			actionsClient,
			repo,
			`${UMBRELLA_PREFIX}${MAIN_BRANCH}`
		);
		if (mainUmbrella) context.mainUmbrella = { number: mainUmbrella.number };
	}
	return context;
}
