import type { GitHubClient } from './github.ts';
import type { ReviewResponse } from './queries.ts';
import type { OpenUmbrella } from './umbrella-queries.ts';
import { parseReleaseMarker } from './umbrella.ts';

/**
 * Who submits the review: `GITHUB_TOKEN`. The bot account opens the umbrella
 * PR, and GitHub doesn't let the author of a PR review it.
 */
const REVIEWER = 'github-actions[bot]';

/**
 * The label `pr-labeler.yml` adds when translations change. It comes after
 * the merge that brings them, with `GITHUB_TOKEN`, which doesn't trigger this
 * workflow: the checklist can't wait for it, so it names it.
 */
const TRANSLATIONS_LABEL = 'i18n';

const LUNARIA_DIRECTIVE = '@lunaria-track:src/content/docs/en/**.mdx';
const LUNARIA_DIRECTIVE_DOCS = 'https://lunaria.dev/guides/tracking/#triggering-changes-per-file';

interface SubmittedReview extends ReviewResponse {
	id: number;
	body: string;
}

/**
 * Writes the checklist a maintainer goes through before merging an umbrella
 * PR, then dismisses the review that holds it.
 *
 * @param openPullRequests PRs that still target the umbrella branch.
 */
export function getMergeBlockBody(umbrella: OpenUmbrella, openPullRequests: number[]): string {
	const releasePullRequest = parseReleaseMarker(umbrella.body);
	const items = [
		releasePullRequest === undefined
			? 'The `[ci] release` PR of `withastro/astro` this umbrella ships with is merged.'
			: `withastro/astro#${releasePullRequest} is merged.`,
		openPullRequests.length === 0
			? `No open PR targets \`${umbrella.branch}\`.`
			: `These PRs still target \`${umbrella.branch}\`: ${openPullRequests.map((number) => `#${number}`).join(', ')}. Merge them into the umbrella, or change their base to \`${umbrella.target}\` and update them after the umbrella is merged.`,
		`If the umbrella has the \`${TRANSLATIONS_LABEL}\` label, the commit body has a [Lunaria directive](${LUNARIA_DIRECTIVE_DOCS}), for example \`${LUNARIA_DIRECTIVE}\`. The squash commit body is empty by default: add it in the merge dialog.`,
	];
	const checklist = items.map((item) => `- [ ] ${item}`).join('\n');
	return `**Before merging**, check:\n\n${checklist}\n\nThen dismiss this review. The release queue requests changes again if more docs PRs join.`;
}

/**
 * Keeps the merge-block review of an umbrella PR up to date. Updates the
 * active review when there is one. Otherwise, submits a new one when
 * `shouldBlock`: after a join, as a dismissed review no longer covers the PRs
 * that joined since.
 */
export async function syncMergeBlockReview(
	gh: GitHubClient,
	repo: string,
	umbrella: OpenUmbrella,
	{ shouldBlock }: { shouldBlock: boolean }
) {
	const [reviews, openPullRequests] = await Promise.all([
		gh.getAll<SubmittedReview>(`repos/${repo}/pulls/${umbrella.number}/reviews`),
		gh.getAll<{ number: number }>(`repos/${repo}/pulls?state=open&base=${umbrella.branch}`),
	]);
	const body = getMergeBlockBody(
		umbrella,
		openPullRequests.map(({ number }) => number)
	);

	// A dismissed review changes its state to `DISMISSED`.
	const active = reviews.findLast(
		({ user, state }) => user?.login === REVIEWER && state === 'CHANGES_REQUESTED'
	);
	if (active) {
		if (active.body.replaceAll('\r\n', '\n') !== body) {
			await gh.write('PUT', `repos/${repo}/pulls/${umbrella.number}/reviews/${active.id}`, {
				body,
			});
		}
		return;
	}
	if (shouldBlock) {
		await gh.write('POST', `repos/${repo}/pulls/${umbrella.number}/reviews`, {
			event: 'REQUEST_CHANGES',
			body,
		});
	}
}
