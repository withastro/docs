import type {
	CheckConclusion,
	CheckRunResponse,
	CommitStatusResponse,
	ReviewResponseState,
} from './github-types.ts';

export interface Review {
	user: string;
	state: ReviewResponseState;
}

export type ReviewState = Extract<ReviewResponseState, 'APPROVED' | 'CHANGES_REQUESTED'>;

export interface Readiness {
	/** At least one reviewer with write access approved the PR. */
	isApproved: boolean;
	/** Reviewers with write access whose latest review requests changes. */
	changesRequestedBy: string[];
	failingChecks: string[];
	pendingChecks: string[];
	/** Required checks not reported on the PR. */
	missingChecks: string[];
	/** `null` while GitHub hasn't computed it yet. */
	isMergeable: boolean | null;
}

/**
 * Gets the latest review state of each reviewer, from `reviews` in the
 * chronological order of the GitHub API. Comments don't replace an earlier
 * state. A dismissed review clears it: an earlier review from the same
 * reviewer doesn't count again.
 */
export function getLatestReviewStates(reviews: Review[]): Map<string, ReviewState> {
	const states = new Map<string, ReviewState>();
	for (const { user, state } of reviews) {
		if (state === 'APPROVED' || state === 'CHANGES_REQUESTED') states.set(user, state);
		else if (state === 'DISMISSED') states.delete(user);
	}
	return states;
}

/**
 * Classifies the latest review states the way the `main` ruleset counts them:
 * only reviewers with write access approve or block a PR.
 */
export function classifyReviewers(
	states: Map<string, ReviewState>,
	writers: Set<string>
): Pick<Readiness, 'isApproved' | 'changesRequestedBy'> {
	const reviewersWith = (state: ReviewState) =>
		[...states]
			.filter(([user, reviewState]) => reviewState === state && writers.has(user))
			.map(([user]) => user);
	return {
		isApproved: reviewersWith('APPROVED').length > 0,
		changesRequestedBy: reviewersWith('CHANGES_REQUESTED'),
	};
}

const SUCCESSFUL_CONCLUSIONS = new Set<CheckConclusion>(['success', 'neutral', 'skipped']);

/**
 * Lists the required checks of a commit that are failing, pending, or missing.
 * A check is missing when it isn't reported, for example while the workflow
 * runs of a first-time contributor wait for approval.
 */
export function classifyChecks(
	required: string[],
	checkRuns: CheckRunResponse[],
	statuses: CommitStatusResponse[]
): Pick<Readiness, 'failingChecks' | 'pendingChecks' | 'missingChecks'> {
	const failing = new Set<string>();
	const pending = new Set<string>();
	const reported = new Set<string>();

	for (const run of checkRuns) {
		reported.add(run.name);
		if (run.status !== 'completed') pending.add(run.name);
		else if (!run.conclusion || !SUCCESSFUL_CONCLUSIONS.has(run.conclusion)) failing.add(run.name);
	}
	for (const status of statuses) {
		reported.add(status.context);
		if (status.state === 'pending') pending.add(status.context);
		else if (status.state !== 'success') failing.add(status.context);
	}

	return {
		failingChecks: required.filter((check) => failing.has(check)),
		pendingChecks: required.filter((check) => pending.has(check)),
		missingChecks: required.filter((check) => !reported.has(check)),
	};
}
