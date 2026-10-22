import { ACCEPTED_LABEL, FRAMEWORK_MAIN_BRANCH, MAIN_UMBRELLA_BRANCH } from './config.ts';
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
import type { Repository } from './repository.ts';
import {
	decideJoin,
	getTarget,
	type Decision,
	type RefusedDecision,
	type Route,
	isRetargetedFromMain,
} from './routing.ts';
import { getUmbrellaHeading, type Umbrella } from './umbrella-heading.ts';
import { findOpenUmbrella, getUmbrella } from './umbrella-queries.ts';
import { getSettledMainUmbrella } from './umbrella-state.ts';

/**
 * A docs PR labeled `accepted`, with the release it ships with and the
 * decision on it.
 */
interface AcceptedPullRequest<D extends Decision = Decision> {
	pr: PullRequest;
	release: MainRelease;
	decision: D;
}

type JoinDecision = Extract<Decision, { status: 'join' }>;

/**
 * Handles a docs PR labeled `accepted`: comments on it as a dry run, refuses
 * it, or joins it to its umbrella.
 *
 * @param {QueueOptions} options - The repositories and the mode of the run.
 * @param {number} prNumber - The number of the docs PR.
 * @param {string} [sender] - Who added the label. Without it, the write
 *   access check is skipped, as in a local run.
 */
export async function handleAcceptedPullRequest(
	options: QueueOptions,
	prNumber: number,
	sender?: string
) {
	if (!(await isSenderAllowed(options.actions, sender))) return;

	const accepted = await readAcceptedPullRequest(options, prNumber);
	const { pr, release, decision } = accepted;
	console.info(JSON.stringify({ pr: pr.url, release, decision }, null, 2));
	if (!isLiveFor(options.mode, getTarget(pr.base))) {
		await commentDryRun(options, accepted);
	} else if (decision.status === 'refuse') {
		await refuse(options, { ...accepted, decision });
	} else {
		await joinAndAnnounce(options, { ...accepted, decision });
	}
}

/** Whether `sender` can write to the repository, like maintainers do. */
async function isSenderAllowed(repo: Repository, sender: string | undefined): Promise<boolean> {
	if (sender === undefined) {
		console.info('No sender: skipping the write access check.');
		return true;
	}
	if (await canWrite(repo, sender)) return true;
	console.info(`Ignored: ${sender} can't write to ${repo.name}.`);
	return false;
}

/**
 * Reads the PR, the release PR of `withastro/astro` and the state of the
 * `main` umbrella, then decides.
 */
async function readAcceptedPullRequest(
	{ actions, framework }: QueueOptions,
	prNumber: number
): Promise<AcceptedPullRequest> {
	const pr = await getPullRequest(actions, prNumber);
	const [readiness, releasePullRequest] = await Promise.all([
		getReadiness(actions, pr),
		getReleasePullRequest(framework, FRAMEWORK_MAIN_BRANCH),
	]);
	const release = getMainRelease(releasePullRequest);
	const settledMainUmbrella = isRetargetedFromMain(pr)
		? await getSettledMainUmbrella({ docs: actions, framework }, release)
		: undefined;
	const decision = decideJoin(pr, readiness, { release, settledMainUmbrella });
	return { pr, release, decision };
}

async function commentDryRun(
	options: QueueOptions,
	{ pr, release, decision }: AcceptedPullRequest
) {
	if (decision.status === 'join') {
		const umbrella = await findUmbrella(options, decision.route, release);
		await postComment(
			options.actions,
			pr.number,
			formatDryRunJoinComment(decision.route, umbrella)
		);
		return;
	}
	const context = await getMessageContext(options, decision, release);
	await postComment(options.actions, pr.number, formatDryRunRefusalComment(decision, context));
}

async function refuse(
	options: QueueOptions,
	{ pr, release, decision }: AcceptedPullRequest<RefusedDecision>
) {
	const context = await getMessageContext(options, decision, release);
	// Removed first, so the comment is true once posted.
	await removeLabel(options.bot, pr.number, ACCEPTED_LABEL);
	await postComment(options.bot, pr.number, formatRefusalComment(decision, context));
}

/** Joins the PR to its umbrella, then says how it went on the PR. */
async function joinAndAnnounce(options: QueueOptions, accepted: AcceptedPullRequest<JoinDecision>) {
	const { pr, release, decision } = accepted;
	const { route } = decision;
	const { title } = getUmbrellaHeading(route.target, release);
	const result = await joinUmbrella(options.bot, { pr, route, umbrellaTitle: title });

	switch (result.status) {
		case 'joined':
			await announceJoin(options, accepted, result.umbrella);
			return;
		case 'refused': {
			const refused: RefusedDecision = { status: 'refuse', route, refusals: [result.refusal] };
			await refuse(options, { ...accepted, decision: refused });
			return;
		}
		case 'unopened':
			await postComment(options.bot, pr.number, formatUnopenedJoinComment(route, result));
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

/**
 * Comments on the PR that joined `umbrella`, then refreshes the umbrella and
 * blocks its merge until a maintainer checks it.
 */
async function announceJoin(
	{ actions, bot, framework }: QueueOptions,
	{ pr, release, decision }: AcceptedPullRequest<JoinDecision>,
	umbrella: Umbrella
) {
	await postComment(bot, pr.number, formatJoinComment(decision.route, umbrella));
	// A planned umbrella was only printed.
	if (umbrella.status === 'planned') return;
	const openUmbrella = await getUmbrella(bot, umbrella.number);
	const refreshed = await refreshUmbrella({ docs: bot, framework }, openUmbrella, release);
	await syncMergeBlockReview(actions, refreshed, { shouldBlock: true });
}

/** Finds the open umbrella PR of `route`, or names the one to create. */
async function findUmbrella(
	{ actions }: QueueOptions,
	route: Route,
	release: MainRelease
): Promise<Umbrella> {
	const openUmbrella = await findOpenUmbrella(actions, route.umbrellaBranch);
	if (openUmbrella) return { status: 'open', number: openUmbrella.number };
	return { status: 'planned', title: getUmbrellaHeading(route.target, release).title };
}

async function getMessageContext(
	options: QueueOptions,
	decision: RefusedDecision,
	release: MainRelease
): Promise<MessageContext> {
	const context: MessageContext = {};
	if (decision.route) context.umbrella = await findUmbrella(options, decision.route, release);
	if (decision.refusals.some((refusal) => refusal.code === 'major-on-main')) {
		const mainUmbrella = await findOpenUmbrella(options.actions, MAIN_UMBRELLA_BRANCH);
		if (mainUmbrella) context.mainUmbrella = { number: mainUmbrella.number };
	}
	return context;
}
