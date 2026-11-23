import { TRIGGER_CHECK_NAME, TRIGGER_WORKFLOW_NAME } from '../config.ts';
import { CHECK_STATES, type Check } from '../github/checks.ts';
import type { PullRequestDetails, Repository } from '../github/repository.ts';
import { REVIEW_STATES } from '../github/reviews.ts';
import type { ReleaseAssistantContext } from '../run.ts';
import { filterAsync } from '../utils/filter-async.ts';

type ReadinessContext = Pick<ReleaseAssistantContext, 'docs'>;

/** What decides whether a docs PR can be merged. Reviews count only from maintainers. */
export type Readiness = {
	isDraft: boolean;
	isApprovedByMaintainer: boolean;
	hasChangesRequestedByMaintainer: boolean;
	/** `null` when GitHub took too long to check for conflicts. */
	isMergeable: boolean | null;
	hasFailingChecks: boolean;
	hasPendingChecks: boolean;
	hasChecksAwaitingApproval: boolean;
};

/**
 * Reads the readiness of a docs PR.
 *
 * Can take a few seconds while GitHub checks the PR for conflicts.
 *
 * @param {ReadinessContext} context - The docs repository.
 * @param {PullRequestDetails} pullRequest - The docs PR.
 * @returns {Promise<Readiness>} The state of the PR, its reviews, and its checks.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
export async function readReadiness(
	{ docs }: ReadinessContext,
	pullRequest: PullRequestDetails
): Promise<Readiness> {
	const [maintainerReviewStates, isMergeable, checks] = await Promise.all([
		getMaintainerReviewStates(docs, pullRequest.number),
		docs.waitForMergeability(pullRequest),
		getOtherChecks(docs, pullRequest.head.sha),
	]);

	return {
		isDraft: pullRequest.draft ?? false,
		isApprovedByMaintainer: maintainerReviewStates.includes(REVIEW_STATES.approved),
		hasChangesRequestedByMaintainer: maintainerReviewStates.includes(
			REVIEW_STATES.changesRequested
		),
		isMergeable,
		hasFailingChecks: checks.some(({ state }) => state === CHECK_STATES.failure),
		hasPendingChecks: checks.some(({ state }) => state === CHECK_STATES.pending),
		hasChecksAwaitingApproval: checks.some(({ state }) => state === CHECK_STATES.awaitingApproval),
	};
}

/** Gets the review state of each maintainer. Dismissed reviews don't count. */
async function getMaintainerReviewStates(docs: Repository, prNumber: number) {
	const latestStates = await docs.getLatestReviewStates(prNumber);
	const activeReviews = [...latestStates].filter(([, state]) => state !== REVIEW_STATES.dismissed);
	const maintainerReviews = await filterAsync(activeReviews, ([login]) =>
		docs.hasWriteAccess(login)
	);
	return maintainerReviews.map(([, state]) => state);
}

/**
 * Gets the checks of a commit, except the ones of the release assistant's
 * trigger. The trigger tests nothing. Its check run has the name of its job,
 * and its run waiting for approval has the name of its workflow.
 */
async function getOtherChecks(docs: Repository, sha: string): Promise<Check[]> {
	const checks = await docs.getChecks(sha);
	return checks.filter(({ name }) => name !== TRIGGER_CHECK_NAME && name !== TRIGGER_WORKFLOW_NAME);
}
