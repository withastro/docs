export const REPO = 'withastro/docs';

const pullRequest = {
	number: 7,
	title: 'Document the new option',
	html_url: `https://github.com/${REPO}/pull/7`,
	state: 'open',
	draft: false,
	mergeable: true as boolean | null,
	base: { ref: 'main' },
	head: { ref: 'feat/option', sha: 'head-sha' },
	labels: [] as { name: string }[],
	body: null as string | null,
};

/** A `GET /pulls/7` answer: an open docs PR against `main`, mergeable. */
export function pullRequestResponse(overrides: Partial<typeof pullRequest> = {}) {
	return { ...pullRequest, ...overrides };
}
