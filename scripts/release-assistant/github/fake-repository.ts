import { GitHubError } from './errors.ts';
import type { PullRequestDetails, Repository } from './repository.ts';

export const FAKE_REPOSITORY_NAME = 'example-org/docs';

type PullRequestFixture = {
	number?: number;
	baseBranch?: string;
	headBranch?: string;
	/** `null` for a deleted fork. */
	headRepository?: string | null;
	labels?: string[];
	body?: string | null;
	isDraft?: boolean;
	mergeable?: boolean | null;
	isMerged?: boolean;
};

type FakeRepositoryState = {
	pullRequests?: PullRequestDetails[];
};

type Write = { method: string; args: unknown[] };

/**
 * Builds a pull request with sensible defaults.
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
	body = null,
	isDraft = false,
	mergeable = true,
	isMerged = false,
}: PullRequestFixture = {}): PullRequestDetails {
	return {
		number,
		title: `Document feature ${number}`,
		body,
		draft: isDraft,
		head: {
			ref: headBranch,
			sha: `sha-${number}`,
			repo: headRepository === null ? null : { full_name: headRepository },
		},
		base: { ref: baseBranch },
		labels: labels.map((name) => ({ name })),
		mergeable,
		merged: isMerged,
	};
}

/** An in-memory repository for tests. It serves the state it was given, and records writes. */
export class FakeRepository implements Repository {
	readonly fullName = FAKE_REPOSITORY_NAME;
	readonly writes: Write[] = [];
	#state: Required<FakeRepositoryState>;

	constructor({ pullRequests = [] }: FakeRepositoryState) {
		this.#state = { pullRequests };
	}

	async getOpenPullRequests(): Promise<PullRequestDetails[]> {
		return this.#state.pullRequests;
	}

	async getPullRequest(prNumber: number): Promise<PullRequestDetails> {
		const pullRequest = this.#state.pullRequests.find(({ number }) => number === prNumber);
		if (!pullRequest) {
			throw new GitHubError({
				message: `GET /repos/${FAKE_REPOSITORY_NAME}/pulls/${prNumber} failed with 404: Not Found`,
				status: 404,
				apiMessage: 'Not Found',
			});
		}
		return pullRequest;
	}

	async removeLabel(prNumber: number, label: string): Promise<void> {
		this.writes.push({ method: 'removeLabel', args: [prNumber, label] });
	}

	async createComment(prNumber: number, body: string): Promise<void> {
		this.writes.push({ method: 'createComment', args: [prNumber, body] });
	}
}
