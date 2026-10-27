import type { PullRequestDetails } from '../lib/github/repository.ts';

export const FAKE_REPOSITORY_NAME = 'example-org/docs';

type PullRequestFixture = {
	number?: number;
	baseBranch?: string;
	headBranch?: string;
	/** `null` for a deleted fork. Defaults to the fake repository. */
	headRepository?: string | null;
	labels?: string[];
};

type Write = { method: string; args: unknown[] };

/**
 * Builds a pull request with sensible defaults, for tests.
 *
 * @param {PullRequestFixture} fixture - The fields that matter to the test.
 * @returns {PullRequestDetails} The pull request.
 */
export function buildPullRequest({
	number = 1,
	baseBranch = 'main',
	headBranch = 'docs-feature',
	headRepository = FAKE_REPOSITORY_NAME,
	labels = [],
}: PullRequestFixture = {}): PullRequestDetails {
	return {
		number,
		title: `Document feature ${number}`,
		body: null,
		html_url: `https://github.com/${FAKE_REPOSITORY_NAME}/pull/${number}`,
		draft: false,
		user: { login: 'example-user' },
		head: {
			ref: headBranch,
			sha: `sha-${number}`,
			repo: headRepository === null ? null : { full_name: headRepository },
		},
		base: { ref: baseBranch },
		labels: labels.map((name) => ({ name })),
		mergeable: true,
		merged: false,
	};
}

/** An in-memory repository for tests: it serves the pull requests it holds and records writes. */
export class FakeRepository {
	readonly fullName = FAKE_REPOSITORY_NAME;
	readonly writes: Write[] = [];
	#pullRequests: PullRequestDetails[];

	/**
	 * @param {PullRequestDetails[]} pullRequests - The pull requests of the repository.
	 */
	constructor(pullRequests: PullRequestDetails[]) {
		this.#pullRequests = pullRequests;
	}

	async getPullRequest(prNumber: number): Promise<PullRequestDetails> {
		const pullRequest = this.#pullRequests.find(({ number }) => number === prNumber);
		if (!pullRequest) throw new Error(`The fake repository has no pull request #${prNumber}.`);
		return pullRequest;
	}

	async createComment(prNumber: number, body: string): Promise<void> {
		this.writes.push({ method: 'createComment', args: [prNumber, body] });
	}
}
