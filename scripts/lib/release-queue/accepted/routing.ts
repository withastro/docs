import {
	ALL_RELEASE_LABELS,
	DOCS_STABLE_BRANCH,
	RELEASE_LABELS,
	RELEASE_TYPES,
	type ReleaseLabel,
} from '../config.ts';
import type { StableRelease } from '../release/release.ts';
import { getUmbrellaBase, getUmbrellaBranch, isUmbrellaBranch } from '../umbrella/branch.ts';
import type { SettledUmbrella } from '../umbrella/state.ts';
import type { DocsPullRequest } from './queries.ts';
import type { Readiness } from './readiness.ts';

export interface Route {
	umbrellaBase: string;
	umbrellaBranch: string;
	label: ReleaseLabel;
	/** Whether the base of the docs PR must change to the umbrella branch. */
	shouldRetarget: boolean;
}

/** What `decideJoin` needs besides the PR. */
interface DecisionContext {
	release: StableRelease;
	settledStableUmbrella?: SettledUmbrella | undefined;
}

/** The details of each refusal, by code. */
interface RefusalDetails {
	closed: Record<never, never>;
	umbrella: Record<never, never>;
	draft: Record<never, never>;
	'no-release-label': Record<never, never>;
	'several-release-labels': { labels: ReleaseLabel[] };
	mismatch: { base: string; label: ReleaseLabel };
	'major-on-stable': { frameworkVersion?: string | undefined };
	'settled-umbrella': SettledUmbrella;
	'not-approved': Record<never, never>;
	'changes-requested': { reviewers: string[] };
	'failing-checks': { checks: string[] };
	'pending-checks': { checks: string[] };
	'missing-checks': { checks: string[] };
	conflict: Record<never, never>;
	// Found when joining: see `JoinRefusal`.
	'umbrella-conflict': { branch: string };
	/** The umbrella branch has commits but no open umbrella PR. */
	'stale-umbrella-branch': { branch: string };
	'merge-failed': { reason: string };
}

export type RefusalCode = keyof RefusalDetails;

/** A reason not to merge a docs PR. Without a code, any refusal. */
export type Refusal<Code extends RefusalCode = RefusalCode> = {
	[C in Code]: { code: C } & RefusalDetails[C];
}[Code];

/** The refusals found only while joining, once `decideJoin` approved the PR. */
export type JoinRefusal = Refusal<'umbrella-conflict' | 'stale-umbrella-branch' | 'merge-failed'>;

/**
 * A docs PR joins `route`, or is refused. A refused PR keeps its route when
 * routing succeeded: comments use it to name the umbrella.
 */
export type Decision =
	| { status: 'join'; route: Route }
	| { status: 'refuse'; route?: Route; refusals: Refusal[] };

export type RefusedDecision = Extract<Decision, { status: 'refuse' }>;

/** The route of a docs PR, or the refusal that leaves it without one. */
type Routing = { status: 'routed'; route: Route } | { status: 'refused'; refusal: Refusal };

/**
 * Whether the bot would change the base of an open docs PR from the stable
 * branch to the stable umbrella branch.
 *
 * @param {DocsPullRequest} pr - The docs PR.
 * @returns {boolean} `true` for an open PR against the stable branch.
 */
export function wouldRetargetFromStable(pr: DocsPullRequest): boolean {
	return pr.state === 'open' && pr.base === DOCS_STABLE_BRANCH;
}

/**
 * Decides whether a docs PR joins an umbrella, and which one.
 *
 * @param {DocsPullRequest} pr - The docs PR labeled as accepted.
 * @param {Readiness} readiness - Its reviews, checks, and mergeability.
 * @param {DecisionContext} context - The next release, and the settled stable
 *   umbrella if there is one.
 * @returns {Decision} The route to join, or every refusal at once. A closed
 *   PR or an umbrella PR gets only that refusal.
 */
export function decideJoin(
	pr: DocsPullRequest,
	readiness: Readiness,
	context: DecisionContext
): Decision {
	if (pr.state !== 'open') return { status: 'refuse', refusals: [{ code: 'closed' }] };
	if (isUmbrellaBranch(pr.head)) return { status: 'refuse', refusals: [{ code: 'umbrella' }] };

	const routing = getRoute(pr, context);
	const refusals: Refusal[] = [
		...(pr.isDraft ? [{ code: 'draft' } as const] : []),
		...(routing.status === 'refused' ? [routing.refusal] : []),
		...getReadinessRefusals(readiness),
	];

	if (routing.status === 'refused') return { status: 'refuse', refusals };
	if (refusals.length > 0) return { status: 'refuse', route: routing.route, refusals };
	return { status: 'join', route: routing.route };
}

const refuseRoute = (refusal: Refusal): Routing => ({ status: 'refused', refusal });

function getRoute(
	pr: DocsPullRequest,
	{ release, settledStableUmbrella }: DecisionContext
): Routing {
	const labels = ALL_RELEASE_LABELS.filter((label) => pr.labels.includes(label));
	if (labels.length === 0) return refuseRoute({ code: 'no-release-label' });
	if (labels.length > 1) return refuseRoute({ code: 'several-release-labels', labels });
	const [label] = labels;

	const umbrellaBase = getUmbrellaBase(pr.base);
	// A PR against an umbrella branch, to fix something already merged in it.
	const shouldRetarget = !isUmbrellaBranch(pr.base);

	// Nothing marks a prerelease branch: any base but the stable branch is one.
	const isMajor = label === RELEASE_LABELS.major;
	const isStableTarget = umbrellaBase === DOCS_STABLE_BRANCH;
	if (isMajor === isStableTarget) return refuseRoute({ code: 'mismatch', base: pr.base, label });
	// Every feature on the stable branch of the framework now ships in the
	// major, documented on a prerelease branch.
	if (isStableTarget && release.type === RELEASE_TYPES.major) {
		return refuseRoute({ code: 'major-on-stable', frameworkVersion: release.frameworkVersion });
	}
	if (settledStableUmbrella && wouldRetargetFromStable(pr)) {
		return refuseRoute({ code: 'settled-umbrella', ...settledStableUmbrella });
	}

	const umbrellaBranch = getUmbrellaBranch(umbrellaBase);
	return { status: 'routed', route: { umbrellaBase, umbrellaBranch, label, shouldRetarget } };
}

function getReadinessRefusals(readiness: Readiness): Refusal[] {
	const refusals: Refusal[] = [];
	if (!readiness.isApproved) refusals.push({ code: 'not-approved' });
	if (readiness.changesRequestedBy.length > 0) {
		refusals.push({ code: 'changes-requested', reviewers: readiness.changesRequestedBy });
	}
	if (readiness.failingChecks.length > 0) {
		refusals.push({ code: 'failing-checks', checks: readiness.failingChecks });
	}
	if (readiness.pendingChecks.length > 0) {
		refusals.push({ code: 'pending-checks', checks: readiness.pendingChecks });
	}
	if (readiness.missingChecks.length > 0) {
		refusals.push({ code: 'missing-checks', checks: readiness.missingChecks });
	}
	if (readiness.isMergeable === false) refusals.push({ code: 'conflict' });
	return refusals;
}
