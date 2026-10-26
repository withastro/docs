import {
	FRAMEWORK_REPO,
	LUNARIA_DIRECTIVE,
	LUNARIA_DIRECTIVE_DOCS,
	MERGE_BLOCK_REVIEWER_LOGIN,
	RELEASE_TITLE_PREFIX,
	TRANSLATIONS_LABEL,
} from '../config.ts';
import { normalizeLineEndings, wrapInCode } from '../formats/markdown.ts';
import type { Repository } from '../github/repository.ts';
import type { ReviewResponse } from '../github/types.ts';
import { formatFrameworkReference } from '../release/release.ts';
import { parseReleaseMarker } from './body.ts';
import type { UmbrellaPullRequest } from './queries.ts';

/** A review of an umbrella PR, with its body. */
interface SubmittedReview extends ReviewResponse {
	id: number;
	body: string;
}

/**
 * Writes the body of the merge-block review: the checklist a maintainer goes
 * through before merging an umbrella PR with `openPullRequests` still on its
 * branch, and the dismissal that lifts the block.
 */
function formatMergeBlockBody(umbrella: UmbrellaPullRequest, openPullRequests: number[]): string {
	const items = [
		describeReleaseItem(umbrella),
		describeBranchItem(umbrella, openPullRequests),
		describeLunariaItem(),
	];
	const checklist = items.map((item) => `- [ ] ${item}`).join('\n');
	return `**Before merging**, check:\n\n${checklist}\n\nThen dismiss this review. The release queue requests changes again if more docs PRs join.`;
}

function describeReleaseItem(umbrella: UmbrellaPullRequest): string {
	const releasePrNumber = parseReleaseMarker(umbrella.body);
	return releasePrNumber === undefined
		? `The ${wrapInCode(RELEASE_TITLE_PREFIX)} PR of ${wrapInCode(FRAMEWORK_REPO)} this umbrella ships with is merged.`
		: `${formatFrameworkReference(releasePrNumber)} is merged.`;
}

function describeBranchItem(
	{ branch, base }: UmbrellaPullRequest,
	openPullRequests: number[]
): string {
	if (openPullRequests.length === 0) return `No open PR targets ${wrapInCode(branch)}.`;
	const list = openPullRequests.map((prNumber) => `#${prNumber}`).join(', ');
	return `These PRs still target ${wrapInCode(branch)}: ${list}. Merge them into the umbrella, or change their base to ${wrapInCode(base)} and update them after the umbrella is merged.`;
}

/**
 * Describes the Lunaria directive to add when the umbrella has the
 * translations label.
 *
 * The item names the label instead of reading it: `pr-labeler.yml` adds it
 * after the merge, with `GITHUB_TOKEN`, which doesn't trigger this workflow.
 */
function describeLunariaItem(): string {
	return `If the umbrella has the ${wrapInCode(TRANSLATIONS_LABEL)} label, add a [Lunaria directive](${LUNARIA_DIRECTIVE_DOCS}) to the commit body in the merge dialog. For example: ${wrapInCode(LUNARIA_DIRECTIVE)}.`;
}

/**
 * Lists the reviews of an umbrella PR.
 *
 * @param {Repository} repo - The docs repository.
 * @param {number} umbrellaNumber - The number of the umbrella PR.
 * @returns {Promise<SubmittedReview[]>} The reviews in chronological order,
 *   with `\n` line endings in their bodies.
 */
async function listUmbrellaReviews(
	repo: Repository,
	umbrellaNumber: number
): Promise<SubmittedReview[]> {
	const reviews = await repo.getAll<SubmittedReview>(`pulls/${umbrellaNumber}/reviews`);
	return reviews.map((review) => ({ ...review, body: normalizeLineEndings(review.body) }));
}

/**
 * Lists the open PRs that target a branch.
 *
 * @param {Repository} repo - The docs repository.
 * @param {string} branch - The base of the PRs, such as an umbrella branch.
 * @returns {Promise<number[]>} The numbers of the open PRs.
 */
async function listOpenPullRequestsTargeting(repo: Repository, branch: string): Promise<number[]> {
	const pullRequests = await repo.listOpenPullRequests({ base: branch });
	return pullRequests.map(({ number }) => number);
}

/**
 * Finds the bot's review that still requests changes: a dismissal changes its
 * state.
 */
function findActiveReview(reviews: SubmittedReview[]): SubmittedReview | undefined {
	return reviews.findLast(
		({ user, state }) => user?.login === MERGE_BLOCK_REVIEWER_LOGIN && state === 'CHANGES_REQUESTED'
	);
}

/**
 * Keeps the merge-block review of an umbrella PR up to date.
 *
 * Updates the active review when there is one. Otherwise, submits a new one
 * when `shouldBlock` is set.
 *
 * @param {Repository} repo - The docs repository, through `GITHUB_TOKEN`.
 * @param {UmbrellaPullRequest} umbrella - The umbrella PR, as refreshed.
 * @param {object} options - When to block the merge again.
 * @param {boolean} options.shouldBlock - Whether to submit a review when none
 *   is active.
 */
export async function syncMergeBlockReview(
	repo: Repository,
	umbrella: UmbrellaPullRequest,
	{ shouldBlock }: { shouldBlock: boolean }
) {
	const [reviews, openPullRequests] = await Promise.all([
		listUmbrellaReviews(repo, umbrella.number),
		listOpenPullRequestsTargeting(repo, umbrella.branch),
	]);
	const body = formatMergeBlockBody(umbrella, openPullRequests);
	const active = findActiveReview(reviews);
	if (active) {
		if (active.body !== body) {
			await repo.write('PUT', `pulls/${umbrella.number}/reviews/${active.id}`, { body });
		}
	} else if (shouldBlock) {
		await repo.write('POST', `pulls/${umbrella.number}/reviews`, {
			event: 'REQUEST_CHANGES',
			body,
		});
	}
}
