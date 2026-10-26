import type { PullRequestResponse } from '../github/types.ts';

export const REPO = 'withastro/docs';

const pullRequest: PullRequestResponse = {
	number: 7,
	title: 'Document the new option',
	html_url: `https://github.com/${REPO}/pull/7`,
	state: 'open',
	draft: false,
	mergeable: true,
	base: { ref: 'main' },
	head: { ref: 'feat/option', sha: 'head-sha', repo: { full_name: REPO } },
	labels: [],
	body: null,
};

/** A `GET /pulls/7` answer: an open docs PR against `main`, mergeable. */
export function pullRequestResponse(
	overrides: Partial<PullRequestResponse> = {}
): PullRequestResponse {
	return { ...pullRequest, ...overrides };
}

/**
 * A `GET /pulls/<number>` answer for the open umbrella PR into `umbrellaBase`,
 * with `merge-on-release`.
 */
export function umbrellaResponse({
	umbrellaBase = 'main',
	...overrides
}: { umbrellaBase?: string } & Partial<PullRequestResponse> = {}): PullRequestResponse {
	return pullRequestResponse({
		number: 42,
		title: `[ci] release ${umbrellaBase} docs`,
		html_url: `https://github.com/${REPO}/pull/42`,
		base: { ref: umbrellaBase },
		head: { ref: `release-queue/${umbrellaBase}`, sha: 'umbrella-sha', repo: { full_name: REPO } },
		labels: [{ name: 'merge-on-release' }],
		...overrides,
	});
}

/**
 * The GET answer for the commits of the umbrella branch of `umbrellaBase`: the
 * squash commit of #7.
 */
export const umbrellaCommitResponses = (umbrellaBase = 'main') => ({
	[`repos/${REPO}/compare/${umbrellaBase}...release-queue/${umbrellaBase}`]: {
		ahead_by: 1,
		commits: [{ commit: { message: 'Document the new option (#7)\n\nDetails.' } }],
	},
});

/**
 * The GET answers of the merge-block review of umbrella `number`: no review
 * yet, and no open PR on its branch.
 */
export const emptyMergeBlockResponses = (number: number, umbrellaBase = 'main') => ({
	[`repos/${REPO}/pulls/${number}/reviews`]: [],
	[`repos/${REPO}/pulls?state=open&base=release-queue/${umbrellaBase}`]: [],
});
