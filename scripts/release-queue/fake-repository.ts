import { CHECK_STATES, type Check } from '../lib/github/checks.ts';
import {
	REVIEW_STATES,
	type Comparison,
	type CreatedPullRequest,
	type MergeOptions,
	type NewPullRequest,
	type PullRequestChanges,
	type PullRequestDetails,
	type Review,
	type ReviewState,
} from '../lib/github/repository.ts';

export const FAKE_REPOSITORY_NAME = 'example-org/docs';
export const MAINTAINER = 'example-maintainer';
/** The number the fake repository gives to the pull requests it creates. */
export const CREATED_PR_NUMBER = 1000;

type PullRequestFixture = {
	number?: number;
	baseBranch?: string;
	headBranch?: string;
	/** `null` for a deleted fork. Defaults to the fake repository. */
	headRepository?: string | null;
	labels?: string[];
	body?: string | null;
	isDraft?: boolean;
	mergeable?: boolean | null;
	isMerged?: boolean;
};

type FakeRepositoryState = {
	pullRequests?: PullRequestDetails[];
	reviewsByPrNumber?: Record<number, Review[]>;
	/** Users with write access. Defaults to `MAINTAINER`. */
	maintainers?: string[];
	checksByRef?: Record<string, Check[]>;
	/** The SHA at the head of each branch. Defaults to the stable branch only. */
	branchShas?: Record<string, string>;
	/** The text of each file, by `<ref>:<path>`. */
	files?: Record<string, string>;
	/** The comparison of two branches, by `<base>...<head>`. Defaults to no commits. */
	comparisons?: Record<string, Comparison>;
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
	body = null,
	isDraft = false,
	mergeable = true,
	isMerged = false,
}: PullRequestFixture = {}): PullRequestDetails {
	return {
		number,
		title: `Document feature ${number}`,
		body,
		html_url: `https://github.com/${FAKE_REPOSITORY_NAME}/pull/${number}`,
		draft: isDraft,
		user: { login: 'example-user' },
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

/**
 * Builds a review, for tests.
 *
 * @param {string | null} login - The reviewer, or `null` for a deleted account.
 * @param {ReviewState} state - The state of the review.
 * @returns {Review} The review.
 */
export function buildReview(login: string | null, state: ReviewState): Review {
	return { id: 1, user: login === null ? null : { login }, state, commit_id: 'sha-1', body: '' };
}

/**
 * Builds the state of a docs PR that can join its umbrella.
 *
 * @param {PullRequestDetails} pullRequest - The pull request.
 * @returns {FakeRepositoryState} The state of the repository holding it.
 */
export function buildReadyState(pullRequest: PullRequestDetails): FakeRepositoryState {
	return {
		pullRequests: [pullRequest],
		reviewsByPrNumber: { [pullRequest.number]: [buildReview(MAINTAINER, REVIEW_STATES.approved)] },
		checksByRef: { [pullRequest.head.sha]: [{ name: 'build', state: CHECK_STATES.success }] },
	};
}

/** An in-memory repository for tests: it serves the state it was given and records writes. */
export class FakeRepository {
	readonly fullName = FAKE_REPOSITORY_NAME;
	readonly writes: Write[] = [];
	#state: Required<FakeRepositoryState>;

	/**
	 * @param {FakeRepositoryState} state - The pull requests, reviews, maintainers, checks, and branches.
	 */
	constructor({
		pullRequests = [],
		reviewsByPrNumber = {},
		maintainers = [MAINTAINER],
		checksByRef = {},
		branchShas = { main: 'sha-main' },
		files = {},
		comparisons = {},
	}: FakeRepositoryState) {
		this.#state = {
			pullRequests,
			reviewsByPrNumber,
			maintainers,
			checksByRef,
			branchShas,
			files,
			comparisons,
		};
	}

	async getOpenPullRequests(): Promise<PullRequestDetails[]> {
		return this.#state.pullRequests;
	}

	async getOpenPullRequestsFromBranch(branch: string): Promise<PullRequestDetails[]> {
		return this.#state.pullRequests.filter(
			({ head }) => head.ref === branch && head.repo?.full_name === this.fullName
		);
	}

	async getPullRequest(prNumber: number): Promise<PullRequestDetails> {
		const pullRequest = this.#state.pullRequests.find(({ number }) => number === prNumber);
		if (!pullRequest) throw new Error(`The fake repository has no pull request #${prNumber}.`);
		return pullRequest;
	}

	async getReviews(prNumber: number): Promise<Review[]> {
		return this.#state.reviewsByPrNumber[prNumber] ?? [];
	}

	async hasWriteAccess(login: string): Promise<boolean> {
		return this.#state.maintainers.includes(login);
	}

	async getChecks(ref: string): Promise<Check[]> {
		return this.#state.checksByRef[ref] ?? [];
	}

	async compare(base: string, head: string): Promise<Comparison> {
		return this.#state.comparisons[`${base}...${head}`] ?? { ahead_by: 0, commits: [] };
	}

	async getFileContent(path: string, ref: string): Promise<string | null> {
		return this.#state.files[`${ref}:${path}`] ?? null;
	}

	async getBranchSha(branch: string): Promise<string | null> {
		return this.#state.branchShas[branch] ?? null;
	}

	async createBranch(branch: string, sha: string): Promise<void> {
		this.writes.push({ method: 'createBranch', args: [branch, sha] });
	}

	async createPullRequest(pullRequest: NewPullRequest): Promise<CreatedPullRequest> {
		this.writes.push({ method: 'createPullRequest', args: [pullRequest] });
		return {
			number: CREATED_PR_NUMBER,
			html_url: `https://github.com/${FAKE_REPOSITORY_NAME}/pull/${CREATED_PR_NUMBER}`,
		};
	}

	async updatePullRequest(prNumber: number, changes: PullRequestChanges): Promise<void> {
		this.writes.push({ method: 'updatePullRequest', args: [prNumber, changes] });
	}

	async mergePullRequest(prNumber: number, options: MergeOptions): Promise<void> {
		this.writes.push({ method: 'mergePullRequest', args: [prNumber, options] });
	}

	async addLabels(prNumber: number, labels: readonly string[]): Promise<void> {
		this.writes.push({ method: 'addLabels', args: [prNumber, labels] });
	}

	async removeLabel(prNumber: number, label: string): Promise<void> {
		this.writes.push({ method: 'removeLabel', args: [prNumber, label] });
	}

	async createComment(prNumber: number, body: string): Promise<void> {
		this.writes.push({ method: 'createComment', args: [prNumber, body] });
	}
}
