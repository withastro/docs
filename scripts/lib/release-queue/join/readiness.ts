import type {
	CheckConclusion,
	CheckRunResponse,
	CommitStatusResponse,
	ReviewResponseState,
} from '../github/types.ts';

export interface Review {
	user: string;
	state: ReviewResponseState;
}

type ReviewState = Extract<ReviewResponseState, 'APPROVED' | 'CHANGES_REQUESTED'>;

export interface Readiness {
	/** At least one reviewer with write access approved the PR. */
	isApproved: boolean;
	/** Reviewers with write access whose latest review requests changes. */
	changesRequestedBy: string[];
	failingChecks: string[];
	pendingChecks: string[];
	/** Required checks not reported on the PR. */
	missingChecks: string[];
}

type ClassifiedReviewers = Pick<Readiness, 'isApproved' | 'changesRequestedBy'>;
type ClassifiedChecks = Pick<Readiness, 'failingChecks' | 'pendingChecks' | 'missingChecks'>;

/**
 * Gets the latest review state of each reviewer.
 *
 * A comment keeps the earlier state of its reviewer. A dismissed review clears
 * the state, and an earlier review from the same reviewer no longer counts.
 *
 * @param {Review[]} reviews - The reviews, in the chronological order of the
 *   GitHub API.
 * @returns {Map<string, ReviewState>} The latest approval or change request,
 *   by reviewer.
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
 * Classifies the latest review states the way the ruleset of the stable branch
 * counts them: only reviewers with write access approve or block a PR.
 *
 * @param {Map<string, ReviewState>} states - The latest state by reviewer.
 * @param {Set<string>} writers - The reviewers with write access.
 * @returns {ClassifiedReviewers} Whether a writer approved, and the writers
 *   who request changes.
 */
export function classifyReviewers(
	states: Map<string, ReviewState>,
	writers: Set<string>
): ClassifiedReviewers {
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

/** A check reported on a commit, by a check run or a commit status. */
export interface Check {
	name: string;
	state: 'pending' | 'failing' | 'passing';
}

/**
 * Reads the state of a check run. A neutral or skipped run passes.
 *
 * @param {CheckRunResponse} checkRun - A check run of the commit.
 * @returns {Check} The check, by the name of the run.
 */
export function readCheckRun({ name, status, conclusion }: CheckRunResponse): Check {
	if (status !== 'completed') return { name, state: 'pending' };
	const isSuccessful = conclusion !== null && SUCCESSFUL_CONCLUSIONS.has(conclusion);
	return { name, state: isSuccessful ? 'passing' : 'failing' };
}

/**
 * Reads the state of a commit status. An error fails, like a failure.
 *
 * @param {CommitStatusResponse} status - A commit status.
 * @returns {Check} The check, by the context of the status.
 */
export function readCommitStatus({ context, state }: CommitStatusResponse): Check {
	if (state === 'pending') return { name: context, state: 'pending' };
	return { name: context, state: state === 'success' ? 'passing' : 'failing' };
}

/**
 * Lists the required checks of a commit that are failing, pending, or missing.
 *
 * A check is missing when it isn't reported, for example while the workflow
 * runs of a first-time contributor wait for approval.
 *
 * @param {string[]} required - The names of the required checks.
 * @param {Check[]} checks - The checks reported on the commit.
 * @returns {ClassifiedChecks} The required checks in each state.
 */
export function classifyChecks(required: string[], checks: Check[]): ClassifiedChecks {
	const namesIn = (state: Check['state']) =>
		new Set(checks.filter((check) => check.state === state).map(({ name }) => name));
	const failing = namesIn('failing');
	const pending = namesIn('pending');
	const reported = new Set(checks.map(({ name }) => name));
	return {
		failingChecks: required.filter((name) => failing.has(name)),
		pendingChecks: required.filter((name) => pending.has(name)),
		missingChecks: required.filter((name) => !reported.has(name)),
	};
}
