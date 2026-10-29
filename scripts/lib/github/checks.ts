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

export const checkRunListShape = singlePage(
	shape.object({ total_count: shape.number, check_runs: shape.list(checkRunShape) }),
	'check_runs'
);

export const combinedStatusShape = singlePage(
	shape.object({ total_count: shape.number, statuses: shape.list(commitStatusShape) }),
	'statuses'
);

type CheckRun = shape.Infer<typeof checkRunShape>;
type CheckRunList = shape.Infer<typeof checkRunListShape>;
type CommitStatus = shape.Infer<typeof commitStatusShape>;
type CombinedStatus = shape.Infer<typeof combinedStatusShape>;

/**
 * Creates a shape that refuses a list response with more items than its page
 * holds.
 *
 * GitHub sends some lists in a field, with the size of the whole list in
 * `total_count`.
 *
 * @param {shape.Shape<T>} listShape - The shape of the response.
 * @param {K} itemsKey - The field that holds the items.
 * @returns {shape.Shape<T>} A shape reading the response when all its items fit in one page.
 */
function singlePage<K extends string, T extends { total_count: number } & Record<K, unknown[]>>(
	listShape: shape.Shape<T>,
	itemsKey: K
): shape.Shape<T> {
	return (value, path) => {
		const list = listShape(value, path);
		const itemCount = list[itemsKey].length;
		if (list.total_count > itemCount) {
			const holds = `\`${itemsKey}\` holds ${itemCount} of ${list.total_count} items`;
			throw new Error(`${holds}, the others are on later pages.`);
		}
		return list;
	};
}

/**
 * Reduces the check runs and the commit statuses of a commit to their outcomes.
 *
 * A check run that has not completed is pending. A completed one passes with
 * the conclusions branch protection accepts, and fails with any other,
 * including conclusions GitHub adds later.
 *
 * @param {CheckRunList} checkRunList - The check runs of the commit.
 * @param {CombinedStatus} combinedStatus - The commit statuses of the commit.
 * @returns {Check[]} The check runs, then the commit statuses.
 */
export function toChecks(checkRunList: CheckRunList, combinedStatus: CombinedStatus): Check[] {
	return [
		...checkRunList.check_runs.map(toCheckFromRun),
		...combinedStatus.statuses.map(toCheckFromStatus),
	];
}

function toCheckFromRun({ name, status, conclusion }: CheckRun): Check {
	if (status !== COMPLETED_CHECK_RUN_STATUS) return { name, state: CHECK_STATES.pending };
	const isPassing = conclusion !== null && PASSING_CONCLUSIONS.includes(conclusion);
	return { name, state: isPassing ? CHECK_STATES.success : CHECK_STATES.failure };
}

function toCheckFromStatus({ context, state }: CommitStatus): Check {
	return { name: context, state: CHECK_STATES_BY_COMMIT_STATUS_STATE[state] };
}
