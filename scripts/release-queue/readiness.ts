import { CHECK_STATES, type Check } from '../lib/github/checks.ts';
import {
	REVIEW_STATES,
	type PullRequestDetails,
	type Repository,
} from '../lib/github/repository.ts';
import type { ReleaseQueueContext } from './run.ts';

type ReadinessContext = Pick<ReleaseQueueContext, 'docs' | 'jobName'>;

/** What decides whether a docs PR can be merged. Reviews count only from maintainers. */
export type Readiness = {
	isDraft: boolean;
	isApprovedByMaintainer: boolean;
	hasChangesRequestedByMaintainer: boolean;
	/** `null` when GitHub took too long to check for conflicts. */
	isMergeable: boolean | null;
	hasFailingChecks: boolean;
	hasPendingChecks: boolean;
};

/**
 * Reads what decides whether a docs PR can be merged.
 *
 * Can take a few seconds while GitHub checks the PR for conflicts.
 *
 * @param {ReadinessContext} context - The docs repository, and the job to leave out of the checks.
 * @param {PullRequestDetails} pullRequest - The docs PR.
 * @returns {Promise<Readiness>} The state of the PR, its reviews, and its checks.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
export async function readReadiness(
	{ docs, jobName }: ReadinessContext,
	pullRequest: PullRequestDetails
): Promise<Readiness> {
	const [maintainerReviewStates, isMergeable, checks] = await Promise.all([
		getMaintainerReviewStates(docs, pullRequest.number),
		docs.waitForMergeability(pullRequest),
		getChecksOfOtherJobs({ docs, jobName }, pullRequest.head.sha),
	]);

	return {
		isDraft: pullRequest.draft,
		isApprovedByMaintainer: maintainerReviewStates.includes(REVIEW_STATES.approved),
		hasChangesRequestedByMaintainer: maintainerReviewStates.includes(
			REVIEW_STATES.changesRequested
		),
		isMergeable,
		hasFailingChecks: checks.some(({ state }) => state === CHECK_STATES.failure),
		hasPendingChecks: checks.some(({ state }) => state === CHECK_STATES.pending),
	};
}

/** Gets the review state of each maintainer, dismissed reviews excluded. */
async function getMaintainerReviewStates(docs: Repository, prNumber: number) {
	const latestStates = await docs.getLatestReviewStates(prNumber);
	const activeReviews = [...latestStates].filter(([, state]) => state !== REVIEW_STATES.dismissed);
	const reviewerWriteAccesses = await Promise.all(
		activeReviews.map(([login]) => docs.hasWriteAccess(login))
	);
	return activeReviews.filter((_, index) => reviewerWriteAccesses[index]).map(([, state]) => state);
}

async function getChecksOfOtherJobs(
	{ docs, jobName }: ReadinessContext,
	ref: string
): Promise<Check[]> {
	const checks = await docs.getChecks(ref);
	return checks.filter(({ name }) => name !== jobName);
}
