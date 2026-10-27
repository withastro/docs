import { setTimeout as wait } from 'node:timers/promises';
import { CHECK_STATES, type Check } from '../lib/github/checks.ts';
import {
	REVIEW_STATES,
	type GitHubRepository,
	type PullRequestDetails,
	type Review,
	type ReviewState,
} from '../lib/github/repository.ts';
import { MERGEABILITY_RETRY_COUNT, MERGEABILITY_RETRY_DELAY_MS } from './config.ts';
import { REFUSAL_REASONS, type RefusalReason } from './decision.ts';

/** The review states that replace a reviewer's earlier ones. A comment changes nothing. */
const DECISIVE_REVIEW_STATES: ReviewState[] = [
	REVIEW_STATES.approved,
	REVIEW_STATES.changesRequested,
	REVIEW_STATES.dismissed,
];

type ReadinessRepository = Pick<
	GitHubRepository,
	'getPullRequest' | 'getReviews' | 'hasWriteAccess' | 'getChecks'
>;

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

const READINESS_PROBLEMS: [RefusalReason, (readiness: Readiness) => boolean][] = [
	[REFUSAL_REASONS.draft, ({ isDraft }) => isDraft],
	[REFUSAL_REASONS.changesRequested, (readiness) => readiness.hasChangesRequestedByMaintainer],
	[REFUSAL_REASONS.missingApproval, ({ isApprovedByMaintainer }) => !isApprovedByMaintainer],
	[REFUSAL_REASONS.mergeConflict, ({ isMergeable }) => isMergeable === false],
	[REFUSAL_REASONS.unknownMergeability, ({ isMergeable }) => isMergeable === null],
	[REFUSAL_REASONS.failingChecks, ({ hasFailingChecks }) => hasFailingChecks],
	[REFUSAL_REASONS.pendingChecks, ({ hasPendingChecks }) => hasPendingChecks],
];

/**
 * Reads what decides whether a docs PR can be merged.
 *
 * Asks for the PR again while GitHub checks it for conflicts.
 *
 * @param {ReadinessRepository} docs - The docs repository.
 * @param {PullRequestDetails} pullRequest - The docs PR.
 * @param {string | null} jobName - The job running the release queue, left out of the checks
 * since it runs on the PR. `null` outside GitHub Actions.
 * @returns {Promise<Readiness>} The state of the PR, its reviews, and its checks.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
export async function readReadiness(
	docs: ReadinessRepository,
	pullRequest: PullRequestDetails,
	jobName: string | null
): Promise<Readiness> {
	const [maintainerReviewStates, isMergeable, checks] = await Promise.all([
		getMaintainerReviewStates(docs, pullRequest.number),
		waitForMergeability(docs, pullRequest),
		getChecksOfOtherJobs(docs, pullRequest.head.sha, jobName),
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

/**
 * Finds what prevents a docs PR from being merged.
 *
 * @param {Readiness} readiness - The state of the PR, its reviews, and its checks.
 * @returns {RefusalReason[]} Every problem, or an empty list when the PR can be merged.
 */
export function findReadinessProblems(readiness: Readiness): RefusalReason[] {
	return READINESS_PROBLEMS.filter(([, isProblem]) => isProblem(readiness)).map(
		([reason]) => reason
	);
}

/** Gets the latest decisive state of each maintainer's reviews, dismissed ones excluded. */
async function getMaintainerReviewStates(docs: ReadinessRepository, prNumber: number) {
	const latestStates = getLatestReviewStates(await docs.getReviews(prNumber));
	const activeReviews = [...latestStates].filter(([, state]) => state !== REVIEW_STATES.dismissed);
	const reviewerWriteAccesses = await Promise.all(
		activeReviews.map(([login]) => docs.hasWriteAccess(login))
	);
	return activeReviews.filter((_, index) => reviewerWriteAccesses[index]).map(([, state]) => state);
}

function getLatestReviewStates(reviews: Review[]) {
	const statesByLogin = new Map<string, ReviewState>();
	for (const { user, state } of reviews) {
		if (user && DECISIVE_REVIEW_STATES.includes(state)) statesByLogin.set(user.login, state);
	}
	return statesByLogin;
}

async function waitForMergeability(docs: ReadinessRepository, pullRequest: PullRequestDetails) {
	let { mergeable } = pullRequest;
	for (let retry = 0; mergeable === null && retry < MERGEABILITY_RETRY_COUNT; retry++) {
		await wait(MERGEABILITY_RETRY_DELAY_MS);
		({ mergeable } = await docs.getPullRequest(pullRequest.number));
	}
	return mergeable;
}

async function getChecksOfOtherJobs(
	docs: ReadinessRepository,
	ref: string,
	jobName: string | null
): Promise<Check[]> {
	const checks = await docs.getChecks(ref);
	return checks.filter(({ name }) => name !== jobName);
}
