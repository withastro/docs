export const REPO = 'withastro/docs';

const pullRequest = {
	number: 7,
	title: 'Document the new option',
	html_url: `https://github.com/${REPO}/pull/7`,
	state: 'open',
	draft: false,
	mergeable: true as boolean | null,
	merge_commit_sha: null as string | null,
	base: { ref: 'main' },
	head: {
		ref: 'feat/option',
		sha: 'head-sha',
		repo: { full_name: REPO } as { full_name: string } | null,
	},
	labels: [] as { name: string }[],
	body: null as string | null,
};

/** A `GET /pulls/7` answer: an open docs PR against `main`, mergeable. */
export function pullRequestResponse(overrides: Partial<typeof pullRequest> = {}) {
	return { ...pullRequest, ...overrides };
}

/**
 * A `GET /pulls/<number>` answer for the open umbrella PR into `target`, with
 * `merge-on-release`.
 */
export function umbrellaResponse({
	target = 'main',
	...overrides
}: { target?: string } & Partial<typeof pullRequest> = {}) {
	return pullRequestResponse({
		number: 42,
		title: `[ci] release ${target} docs`,
		html_url: `https://github.com/${REPO}/pull/42`,
		base: { ref: target },
		head: { ref: `release-queue/${target}`, sha: 'umbrella-sha', repo: { full_name: REPO } },
		labels: [{ name: 'merge-on-release' }],
		...overrides,
	});
}
