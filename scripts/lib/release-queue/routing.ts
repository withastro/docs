import {
	ALL_RELEASE_LABELS,
	MAIN_BRANCH,
	RELEASE_LABELS,
	UMBRELLA_PREFIX,
	type ReleaseLabel,
} from './config.ts';
import type { PullRequestState } from './github-types.ts';
import type { Readiness } from './readiness.ts';
import type { MainRelease } from './release.ts';

export interface DocsPullRequest {
	state: PullRequestState;
	isDraft: boolean;
	base: string;
	head: string;
	labels: string[];
}

export interface Route {
	/** The branch the umbrella PR merges into. */
	target: string;
	umbrellaBranch: string;
	label: ReleaseLabel;
	/** Whether the base of the docs PR must change to the umbrella branch. */
	shouldRetarget: boolean;
}

/**
 * The open `main` umbrella once the release PR it ships with is merged, until
 * the umbrella itself is merged.
 */
export interface SettledUmbrella {
	number: number;
	/** The merged release PR of `withastro/astro`. */
	releasePullRequest: number;
}

/** What `decideJoin` needs besides the PR. */
export interface DecisionContext {
	release: MainRelease;
	settledMainUmbrella?: SettledUmbrella | undefined;
}

/** The details of each refusal, by code. */
interface RefusalDetails {
	closed: Record<never, never>;
	umbrella: Record<never, never>;
	draft: Record<never, never>;
	'no-release-label': Record<never, never>;
	'several-release-labels': { labels: ReleaseLabel[] };
	mismatch: { base: string; label: ReleaseLabel };
	'major-on-main': { astroVersion?: string | undefined };
	'settled-umbrella': SettledUmbrella;
	'not-approved': Record<never, never>;
	'changes-requested': { reviewers: string[] };
	'failing-checks': { checks: string[] };
	'pending-checks': { checks: string[] };
	'missing-checks': { checks: string[] };
	conflict: Record<never, never>;
	// Found when joining (see `JoinRefusal`).
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

/** Whether `branch` is an umbrella branch, by its reserved prefix. */
export function isUmbrellaBranch(branch: string): boolean {
	return branch.startsWith(UMBRELLA_PREFIX);
}

/**
 * Whether the bot would retarget this open PR from `main`: the only PRs a
 * settled `main` umbrella refuses. A PR against the umbrella branch says it
 * belongs to that umbrella. The handler reads the settled state only for
 * these PRs.
 */
export function isRetargetedFromMain(pr: DocsPullRequest): boolean {
	return pr.state === 'open' && pr.base === MAIN_BRANCH;
}

/** Gets the branch a docs PR ships to: its base, or its umbrella's base. */
export function getTarget(base: string): string {
	return isUmbrellaBranch(base) ? base.slice(UMBRELLA_PREFIX.length) : base;
}

/**
 * Decides whether a docs PR joins an umbrella, and which one. Returns every
 * refusal at once, except for a closed PR or an umbrella PR.
 */
export function decideJoin(
	pr: DocsPullRequest,
	readiness: Readiness,
	context: DecisionContext
): Decision {
	if (pr.state !== 'open') return { status: 'refuse', refusals: [{ code: 'closed' }] };
	if (isUmbrellaBranch(pr.head)) return { status: 'refuse', refusals: [{ code: 'umbrella' }] };

	const refusals: Refusal[] = [];
	if (pr.isDraft) refusals.push({ code: 'draft' });

	const route = getRoute(pr, context);
	if ('code' in route) refusals.push(route);

	refusals.push(...getReadinessRefusals(readiness));

	if ('code' in route) return { status: 'refuse', refusals };
	if (refusals.length > 0) return { status: 'refuse', route, refusals };
	return { status: 'join', route };
}

function getRoute(
	pr: DocsPullRequest,
	{ release, settledMainUmbrella }: DecisionContext
): Route | Refusal {
	const labels = ALL_RELEASE_LABELS.filter((label) => pr.labels.includes(label));
	if (labels.length === 0) return { code: 'no-release-label' };
	if (labels.length > 1) return { code: 'several-release-labels', labels };
	const [label] = labels;

	const target = getTarget(pr.base);
	// A PR against an umbrella branch, to fix something already merged in it.
	const shouldRetarget = !isUmbrellaBranch(pr.base);

	// Nothing marks a prerelease branch: any base other than `main` is one.
	const isMajor = label === RELEASE_LABELS.major;
	const isMainTarget = target === MAIN_BRANCH;
	if (isMajor === isMainTarget) return { code: 'mismatch', base: pr.base, label };
	// Every feature on `main` in `withastro/astro` now ships in the major,
	// documented on a prerelease branch.
	if (isMainTarget && release.type === 'major') {
		return { code: 'major-on-main', astroVersion: release.astroVersion };
	}
	if (settledMainUmbrella && isRetargetedFromMain(pr)) {
		return { code: 'settled-umbrella', ...settledMainUmbrella };
	}

	return { target, umbrellaBranch: UMBRELLA_PREFIX + target, label, shouldRetarget };
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
