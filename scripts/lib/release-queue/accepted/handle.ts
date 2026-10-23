import { ACCEPTED_LABEL, FRAMEWORK_STABLE_BRANCH } from '../config.ts';
import { removeLabel, type Repository } from '../github/repository.ts';
import { isLiveFor } from '../modes.ts';
import { getReleasePullRequest } from '../release/queries.ts';
import { getStableRelease, type StableRelease } from '../release/release.ts';
import type { RunContext } from '../run-context.ts';
import { getUmbrellaBase, STABLE_UMBRELLA_BRANCH } from '../umbrella/branch.ts';
import { getUmbrellaHeading } from '../umbrella/heading.ts';
import { syncMergeBlockReview } from '../umbrella/merge-block.ts';
import { findOpenUmbrella, getUmbrella, type Umbrella } from '../umbrella/queries.ts';
import { refreshUmbrella } from '../umbrella/refresh.ts';
import { getSettledStableUmbrella } from '../umbrella/state.ts';
import { joinUmbrella } from './join.ts';
import {
	formatDryRunJoinComment,
	formatDryRunRefusalComment,
	formatJoinComment,
	formatRefusalComment,
	formatUnopenedJoinComment,
	type MessageContext,
} from './messages.ts';
import {
	canWrite,
	getPullRequest,
	getReadiness,
	postComment,
	type PullRequest,
} from './queries.ts';
import {
	decideJoin,
	wouldRetargetFromStable,
	type Decision,
	type RefusedDecision,
	type Route,
} from './routing.ts';

/**
 * A docs PR labeled as accepted, with the release it ships with and the
 * decision on it.
 */
interface AcceptedPullRequest<D extends Decision = Decision> {
	pr: PullRequest;
	release: StableRelease;
	decision: D;
}

type JoinDecision = Extract<Decision, { status: 'join' }>;

/**
 * Joins a docs PR labeled as accepted to its umbrella, refuses it, or
 * comments on it as a dry run.
 *
 * @param {RunContext} run - The repositories and the mode of the run.
 * @param {number} prNumber - The number of the docs PR.
 * @param {string} [labelSender] - Who added the label. Without it, the write
 *   access check is skipped, as in a local run.
 */
export async function handleAcceptedPullRequest(
	run: RunContext,
	prNumber: number,
	labelSender?: string
) {
	if (!(await isSenderAllowed(run.actions, labelSender))) return;

	const accepted = await readAcceptedPullRequest(run, prNumber);
	const { pr, release, decision } = accepted;
	console.info(JSON.stringify({ pr: pr.url, release, decision }, null, 2));
	if (!isLiveFor(run.mode, getUmbrellaBase(pr.base))) {
		await commentDryRun(run, accepted);
	} else if (decision.status === 'refuse') {
		await refuse(run, { ...accepted, decision });
	} else {
		await joinAndAnnounce(run, { ...accepted, decision });
	}
}

/** Whether `labelSender` can write to the repository, like maintainers do. */
async function isSenderAllowed(
	repo: Repository,
	labelSender: string | undefined
): Promise<boolean> {
	if (labelSender === undefined) {
		console.info('No label sender: skipping the write access check.');
		return true;
	}
	if (await canWrite(repo, labelSender)) return true;
	console.info(`Ignored: ${labelSender} can't write to ${repo.name}.`);
	return false;
}

/**
 * Reads a docs PR with what decides its join: its readiness, the next stable
 * release, and the settled stable umbrella.
 */
async function readAcceptedPullRequest(
	{ actions, framework }: RunContext,
	prNumber: number
): Promise<AcceptedPullRequest> {
	const pr = await getPullRequest(actions, prNumber);
	const [readiness, releasePullRequest] = await Promise.all([
		getReadiness(actions, pr),
		getReleasePullRequest(framework, FRAMEWORK_STABLE_BRANCH),
	]);
	const release = getStableRelease(releasePullRequest);
	const settledStableUmbrella = wouldRetargetFromStable(pr)
		? await getSettledStableUmbrella({ docs: actions, framework }, release)
		: undefined;
	const decision = decideJoin(pr, readiness, { release, settledStableUmbrella });
	return { pr, release, decision };
}

async function commentDryRun(run: RunContext, { pr, release, decision }: AcceptedPullRequest) {
	if (decision.status === 'join') {
		const umbrella = await findOrPlanUmbrella(run, decision.route, release);
		await postComment(run.actions, pr.number, formatDryRunJoinComment(decision.route, umbrella));
		return;
	}
	const context = await getMessageContext(run, decision, release);
	await postComment(run.actions, pr.number, formatDryRunRefusalComment(decision, context));
}

async function refuse(
	run: RunContext,
	{ pr, release, decision }: AcceptedPullRequest<RefusedDecision>
) {
	const context = await getMessageContext(run, decision, release);
	// Removed first, so the comment is true once posted.
	await removeLabel(run.bot, pr.number, ACCEPTED_LABEL);
	await postComment(run.bot, pr.number, formatRefusalComment(decision, context));
}

/** Joins the PR to its umbrella, then says how it went on the PR. */
async function joinAndAnnounce(run: RunContext, accepted: AcceptedPullRequest<JoinDecision>) {
	const { pr, release, decision } = accepted;
	const { route } = decision;
	const { title } = getUmbrellaHeading(route.umbrellaBase, release);
	const result = await joinUmbrella(run.bot, { pr, route, umbrellaTitle: title });

	switch (result.status) {
		case 'joined':
			await announceJoin(run, accepted, result.umbrella);
			return;
		case 'refused': {
			const refused: RefusedDecision = { status: 'refuse', route, refusals: [result.refusal] };
			await refuse(run, { ...accepted, decision: refused });
			return;
		}
		case 'unopened':
			await postComment(run.bot, pr.number, formatUnopenedJoinComment(route, result));
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
	{ actions, bot, framework }: RunContext,
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
async function findOrPlanUmbrella(
	{ actions }: RunContext,
	route: Route,
	release: StableRelease
): Promise<Umbrella> {
	const openUmbrella = await findOpenUmbrella(actions, route.umbrellaBranch);
	if (openUmbrella) return { status: 'open', number: openUmbrella.number };
	return { status: 'planned', title: getUmbrellaHeading(route.umbrellaBase, release).title };
}

async function getMessageContext(
	run: RunContext,
	decision: RefusedDecision,
	release: StableRelease
): Promise<MessageContext> {
	const [umbrella, stableUmbrella] = await Promise.all([
		decision.route && findOrPlanUmbrella(run, decision.route, release),
		findStableUmbrellaToMove(run.actions, decision),
	]);
	return { umbrella, stableUmbrella };
}

/**
 * Finds the open stable umbrella that a maintainer moves to the prerelease
 * branch before a major, when the decision refuses a PR for that major.
 */
async function findStableUmbrellaToMove(
	repo: Repository,
	decision: RefusedDecision
): Promise<{ number: number } | undefined> {
	if (!decision.refusals.some((refusal) => refusal.code === 'major-on-stable')) return undefined;
	const stableUmbrella = await findOpenUmbrella(repo, STABLE_UMBRELLA_BRANCH);
	return stableUmbrella && { number: stableUmbrella.number };
}
