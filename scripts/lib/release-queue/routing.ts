import type { Readiness } from './readiness.ts';
import type { MainRelease } from './release.ts';

export const ACCEPTED_LABEL = 'accepted';
export const UMBRELLA_PREFIX = 'release-queue/';
export const RELEASE_LABELS = ['patch-release', 'minor-release', 'major-release'] as const;

export type ReleaseLabel = (typeof RELEASE_LABELS)[number];

export interface DocsPullRequest {
	state: string;
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

/** The details of each refusal, by code. */
interface RefusalDetails {
	closed: unknown;
	umbrella: unknown;
	draft: unknown;
	'no-release-label': unknown;
	'several-release-labels': { labels: ReleaseLabel[] };
	mismatch: { base: string; label: ReleaseLabel };
	'major-on-main': { astroVersion?: string | undefined };
	'not-approved': unknown;
	'changes-requested': { reviewers: string[] };
	'failing-checks': { checks: string[] };
	'pending-checks': { checks: string[] };
	'missing-checks': { checks: string[] };
	conflict: unknown;
}

export type RefusalCode = keyof RefusalDetails;

/** A reason not to merge a docs PR. Without a code, any refusal. */
export type Refusal<Code extends RefusalCode = RefusalCode> = {
	[C in Code]: { code: C } & RefusalDetails[C];
}[Code];

/** The docs PR joins `route` when there are no refusals. */
export interface Decision {
	route?: Route;
	refusals: Refusal[];
}

/**
 * Decides whether a docs PR joins an umbrella, and which one. Returns every
 * refusal at once, except for a closed PR or an umbrella PR. Returns the route
 * even with readiness refusals: comments use it to name the umbrella.
 */
export function decide(pr: DocsPullRequest, readiness: Readiness, release: MainRelease): Decision {
	if (pr.state !== 'open') return { refusals: [{ code: 'closed' }] };
	if (pr.head.startsWith(UMBRELLA_PREFIX)) return { refusals: [{ code: 'umbrella' }] };

	const refusals: Refusal[] = [];
	if (pr.isDraft) refusals.push({ code: 'draft' });

	const route = getRoute(pr, release);
	if ('code' in route) refusals.push(route);

	refusals.push(...getReadinessRefusals(readiness));

	return 'code' in route ? { refusals } : { route, refusals };
}

function getRoute(pr: DocsPullRequest, release: MainRelease): Route | Refusal {
	const labels = RELEASE_LABELS.filter((label) => pr.labels.includes(label));
	if (labels.length === 0) return { code: 'no-release-label' };
	if (labels.length > 1) return { code: 'several-release-labels', labels };
	const [label] = labels;

	// A PR against an umbrella branch, to fix something already merged in it.
	const shouldRetarget = !pr.base.startsWith(UMBRELLA_PREFIX);
	const target = shouldRetarget ? pr.base : pr.base.slice(UMBRELLA_PREFIX.length);

	// Nothing marks a prerelease branch: any base other than `main` is one.
	const isMajor = label === 'major-release';
	const isMainTarget = target === 'main';
	if (isMajor === isMainTarget) return { code: 'mismatch', base: pr.base, label };
	// Every feature on `main` in `withastro/astro` now ships in the major,
	// documented on a prerelease branch.
	if (isMainTarget && release.type === 'major') {
		return { code: 'major-on-main', astroVersion: release.astroVersion };
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
