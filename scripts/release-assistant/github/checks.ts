const COMPLETED_CHECK_RUN_STATUS = 'completed';
/** The conclusions GitHub accepts for a check required by branch protection. */
const PASSING_CONCLUSIONS = ['success', 'neutral', 'skipped'];

export const CHECK_STATES = {
	pending: 'pending',
	success: 'success',
	failure: 'failure',
	awaitingApproval: 'awaiting-approval',
} as const;

export type CheckState = (typeof CHECK_STATES)[keyof typeof CHECK_STATES];

const CHECK_STATES_BY_COMMIT_STATUS_STATE: Record<string, CheckState> = {
	error: CHECK_STATES.failure,
	failure: CHECK_STATES.failure,
	pending: CHECK_STATES.pending,
	success: CHECK_STATES.success,
};

/** A check run, a commit status, or a workflow run, with GitHub's states reduced to the outcome. */
export type Check = { name: string; state: CheckState };

/** The fields of a check run the release assistant reads, as GitHub names them. */
export type CheckRun = { name: string; status: string; conclusion: string | null };

/** The fields of a commit status the release assistant reads, as GitHub names them. */
export type CommitStatus = { context: string; state: string };

/** The fields of a workflow run the release assistant reads, as GitHub names them. */
export type WorkflowRun = { name?: string | null; path: string };

/**
 * Reduces the check runs, the commit statuses, and the workflow runs waiting
 * for approval of a commit to their outcomes.
 *
 * A check run is pending until it completes, then passes only with a
 * conclusion branch protection accepts. Unknown conclusions and commit status
 * states fail.
 *
 * On a PR from a fork, a workflow run can wait for a maintainer's approval. It
 * has no check run until then, so it counts as a check of its own, named after
 * its workflow.
 *
 * @param {CheckRun[]} checkRuns - The check runs of the commit.
 * @param {CommitStatus[]} statuses - The commit statuses of the commit.
 * @param {WorkflowRun[]} waitingRuns - The workflow runs of the commit waiting for approval.
 * @returns {Check[]} The check runs, the commit statuses, then the waiting workflow runs.
 */
export function toChecks(
	checkRuns: CheckRun[],
	statuses: CommitStatus[],
	waitingRuns: WorkflowRun[]
): Check[] {
	return [
		...checkRuns.map(toCheckFromRun),
		...statuses.map(toCheckFromStatus),
		...waitingRuns.map(toCheckFromWaitingRun),
	];
}

function toCheckFromRun({ name, status, conclusion }: CheckRun): Check {
	if (status !== COMPLETED_CHECK_RUN_STATUS) return { name, state: CHECK_STATES.pending };
	const isPassing = conclusion !== null && PASSING_CONCLUSIONS.includes(conclusion);
	return { name, state: isPassing ? CHECK_STATES.success : CHECK_STATES.failure };
}

function toCheckFromStatus({ context, state }: CommitStatus): Check {
	return {
		name: context,
		state: CHECK_STATES_BY_COMMIT_STATUS_STATE[state] ?? CHECK_STATES.failure,
	};
}

function toCheckFromWaitingRun({ name, path }: WorkflowRun): Check {
	return { name: name ?? path, state: CHECK_STATES.awaitingApproval };
}
