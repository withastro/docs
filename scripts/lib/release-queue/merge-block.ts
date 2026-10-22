import {
	FRAMEWORK_REPO,
	LUNARIA_DIRECTIVE,
	LUNARIA_DIRECTIVE_DOCS,
	RELEASE_TITLE_PREFIX,
	REVIEWER_LOGIN,
	TRANSLATIONS_LABEL,
} from './config.ts';
import { formatFrameworkReference } from './github-links.ts';
import type { ReviewResponse } from './github-types.ts';
import type { Repository } from './repository.ts';
import { normalizeLineEndings } from './text.ts';
import { parseReleaseMarker } from './umbrella-body.ts';
import type { OpenUmbrella } from './umbrella-queries.ts';

interface SubmittedReview extends ReviewResponse {
	id: number;
	body: string;
}

/**
 * Writes the body of the merge-block review: the checklist a maintainer goes
 * through before merging an umbrella PR with `openPullRequests` still on its
 * branch, and the dismissal that lifts the block.
 */
function formatMergeBlockBody(umbrella: OpenUmbrella, openPullRequests: number[]): string {
	const items = [
		describeReleaseItem(umbrella),
		describeBranchItem(umbrella, openPullRequests),
		describeLunariaItem(),
	];
	const checklist = items.map((item) => `- [ ] ${item}`).join('\n');
	return `**Before merging**, check:\n\n${checklist}\n\nThen dismiss this review. The release queue requests changes again if more docs PRs join.`;
}

function describeReleaseItem(umbrella: OpenUmbrella): string {
	const releasePullRequest = parseReleaseMarker(umbrella.body);
	return releasePullRequest === undefined
		? `The \`${RELEASE_TITLE_PREFIX}\` PR of \`${FRAMEWORK_REPO}\` this umbrella ships with is merged.`
		: `${formatFrameworkReference(releasePullRequest)} is merged.`;
}

function describeBranchItem({ branch, target }: OpenUmbrella, openPullRequests: number[]): string {
	if (openPullRequests.length === 0) return `No open PR targets \`${branch}\`.`;
	const list = openPullRequests.map((prNumber) => `#${prNumber}`).join(', ');
	return `These PRs still target \`${branch}\`: ${list}. Merge them into the umbrella, or change their base to \`${target}\` and update them after the umbrella is merged.`;
}

/**
 * Names the `i18n` label instead of reading it: `pr-labeler.yml` adds it after
 * the merge, with `GITHUB_TOKEN`, which doesn't trigger this workflow.
 */
function describeLunariaItem(): string {
	return `If the umbrella has the \`${TRANSLATIONS_LABEL}\` label, the commit body has a [Lunaria directive](${LUNARIA_DIRECTIVE_DOCS}), for example \`${LUNARIA_DIRECTIVE}\`. The squash commit body is empty by default: add it in the merge dialog.`;
}

/**
 * Finds the bot's review that still requests changes: a dismissal changes its
 * state.
 */
function findActiveReview(reviews: SubmittedReview[]): SubmittedReview | undefined {
	return reviews.findLast(
		({ user, state }) => user?.login === REVIEWER_LOGIN && state === 'CHANGES_REQUESTED'
	);
}

/**
 * Keeps the merge-block review of an umbrella PR up to date. Updates the
 * active review when there is one. Otherwise, submits a new one when
 * `shouldBlock`: after a join, as a dismissed review no longer covers the PRs
 * that joined since.
 */
export async function syncMergeBlockReview(
	repo: Repository,
	umbrella: OpenUmbrella,
	{ shouldBlock }: { shouldBlock: boolean }
) {
	const [reviews, openPullRequests] = await Promise.all([
		repo.getAll<SubmittedReview>(`pulls/${umbrella.number}/reviews`),
		repo.getAll<{ number: number }>(`pulls?state=open&base=${umbrella.branch}`),
	]);
	const body = formatMergeBlockBody(
		umbrella,
		openPullRequests.map(({ number }) => number)
	);
	const active = findActiveReview(reviews);
	if (active) {
		if (normalizeLineEndings(active.body) !== body) {
			await repo.write('PUT', `pulls/${umbrella.number}/reviews/${active.id}`, { body });
		}
	} else if (shouldBlock) {
		await repo.write('POST', `pulls/${umbrella.number}/reviews`, {
			event: 'REQUEST_CHANGES',
			body,
		});
	}
}
