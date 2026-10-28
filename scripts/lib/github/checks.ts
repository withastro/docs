import * as shape from './shape.ts';

const COMPLETED_CHECK_RUN_STATUS = 'completed';
/** The conclusions GitHub accepts for a check required by branch protection. */
const PASSING_CONCLUSIONS = ['success', 'neutral', 'skipped'];

export const CHECK_STATES = {
	pending: 'pending',
	success: 'success',
	failure: 'failure',
} as const;

export type CheckState = (typeof CHECK_STATES)[keyof typeof CHECK_STATES];

const COMMIT_STATUS_STATES = ['error', 'failure', 'pending', 'success'] as const;

type CommitStatusState = (typeof COMMIT_STATUS_STATES)[number];

const CHECK_STATES_BY_COMMIT_STATUS_STATE: Record<CommitStatusState, CheckState> = {
	error: CHECK_STATES.failure,
	failure: CHECK_STATES.failure,
	pending: CHECK_STATES.pending,
	success: CHECK_STATES.success,
};

/** A check run or a commit status, with GitHub's states reduced to the outcome. */
export type Check = { name: string; state: CheckState };

const checkRunShape = shape.object({
	name: shape.string,
	status: shape.string,
	conclusion: shape.nullable(shape.string),
});

const commitStatusShape = shape.object({
	context: shape.string,
	state: shape.oneOf(COMMIT_STATUS_STATES),
});

export const checkRunListShape = shape.object({
	total_count: shape.number,
	check_runs: shape.list(checkRunShape),
});

export const combinedStatusShape = shape.object({
	total_count: shape.number,
	statuses: shape.list(commitStatusShape),
});

type CheckRun = shape.Infer<typeof checkRunShape>;
type CheckRunList = shape.Infer<typeof checkRunListShape>;
type CommitStatus = shape.Infer<typeof commitStatusShape>;
type CombinedStatus = shape.Infer<typeof combinedStatusShape>;

/**
 * Reduces the check runs and the commit statuses of a commit to their outcomes.
 *
 * A check run that has not completed is pending. A completed one passes with
 * the conclusions branch protection accepts, and fails with any other,
 * including conclusions GitHub adds later.
 *
 * @param {CheckRunList} checkRunList - The check runs of the commit.
 * @param {CombinedStatus} combinedStatus - The commit statuses of the commit.
 * @param {string} ref - The ref of the commit, for the error.
 * @returns {Check[]} The check runs, then the commit statuses.
 * @throws {Error} When a list has more than one page.
 */
export function toChecks(
	checkRunList: CheckRunList,
	combinedStatus: CombinedStatus,
	ref: string
): Check[] {
	const checkRuns = checkRunList.check_runs;
	const { statuses } = combinedStatus;
	ensureSinglePage(checkRuns, checkRunList.total_count, `check runs on ${ref}`);
	ensureSinglePage(statuses, combinedStatus.total_count, `statuses on ${ref}`);

	return [...checkRuns.map(toCheckFromRun), ...statuses.map(toCheckFromStatus)];
}

function ensureSinglePage(items: unknown[], totalCount: number, itemsName: string) {
	if (totalCount > items.length) {
		throw new Error(`Found ${totalCount} ${itemsName}, but one page only holds ${items.length}.`);
	}
}

function toCheckFromRun({ name, status, conclusion }: CheckRun): Check {
	if (status !== COMPLETED_CHECK_RUN_STATUS) return { name, state: CHECK_STATES.pending };
	const isPassing = conclusion !== null && PASSING_CONCLUSIONS.includes(conclusion);
	return { name, state: isPassing ? CHECK_STATES.success : CHECK_STATES.failure };
}

function toCheckFromStatus({ context, state }: CommitStatus): Check {
	return { name: context, state: CHECK_STATES_BY_COMMIT_STATUS_STATE[state] };
}
