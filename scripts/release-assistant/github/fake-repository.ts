import type { Check } from './checks.ts';
import { GitHubError } from './errors.ts';
import type {
	Comparison,
	CreatedPullRequest,
	NewPullRequest,
	PullRequest,
	PullRequestChanges,
	PullRequestDetails,
	Repository,
	SquashMergeOptions,
} from './repository.ts';
import type { ReviewState } from './reviews.ts';

export const FAKE_REPOSITORY_NAME = 'example-org/docs';
export const MAINTAINER = 'example-maintainer';
/** The number the fake repository gives to the pull requests it creates. */
export const CREATED_PR_NUMBER = 1000;

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

export type FakeRepositoryState = {
	pullRequests?: PullRequestDetails[];
	/** The current review state of each reviewer, by login, as GitHub counts it. */
	reviewStatesByPrNumber?: Record<number, Record<string, ReviewState>>;
	/** Users with write access. */
	maintainers?: string[];
	checksByRef?: Record<string, Check[]>;
	/** The SHA at the head of each branch. */
	branchShas?: Record<string, string>;
	/** The text of each file, by `<ref>:<path>`. */
	files?: Record<string, string>;
	/** The comparison of two branches, by `<base>...<head>`. */
	comparisons?: Record<string, Comparison>;
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

	constructor({
		pullRequests = [],
		reviewStatesByPrNumber = {},
		maintainers = [MAINTAINER],
		checksByRef = {},
		branchShas = { main: 'sha-main' },
		files = {},
		comparisons = {},
	}: FakeRepositoryState) {
		this.#state = {
			pullRequests,
			reviewStatesByPrNumber,
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

	async getOpenPullRequestsFromBranch(branch: string): Promise<PullRequest[]> {
		return this.#state.pullRequests.filter(
			({ head }) => head.ref === branch && head.repo?.full_name === this.fullName
		);
	}

	async getPullRequest(prNumber: number): Promise<PullRequestDetails> {
		const pullRequest = await this.findPullRequest(prNumber);
		if (!pullRequest) {
			throw new GitHubError({
				message: `GET /repos/${FAKE_REPOSITORY_NAME}/pulls/${prNumber} failed with 404: Not Found`,
				status: 404,
				apiMessage: 'Not Found',
			});
		}
		return pullRequest;
	}

	async findPullRequest(prNumber: number): Promise<PullRequestDetails | null> {
		return this.#state.pullRequests.find(({ number }) => number === prNumber) ?? null;
	}

	/** Asks for the pull request again when GitHub had not checked it yet, without waiting. */
	async waitForMergeability(
		pullRequest: Pick<PullRequestDetails, 'number' | 'mergeable'>
	): Promise<boolean | null> {
		if (pullRequest.mergeable !== null) return pullRequest.mergeable;
		return (await this.getPullRequest(pullRequest.number)).mergeable;
	}

	async getLatestReviewStates(prNumber: number): Promise<Map<string, ReviewState>> {
		return new Map(Object.entries(this.#state.reviewStatesByPrNumber[prNumber] ?? {}));
	}

	async hasWriteAccess(login: string): Promise<boolean> {
		return this.#state.maintainers.includes(login);
	}

	async getChecks(sha: string): Promise<Check[]> {
		return this.#state.checksByRef[sha] ?? [];
	}

	async getFileContent(path: string, ref: string): Promise<string | null> {
		return this.#state.files[`${ref}:${path}`] ?? null;
	}

	async getBranchSha(branch: string): Promise<string | null> {
		return this.#state.branchShas[branch] ?? null;
	}

	async compare(base: string, head: string): Promise<Comparison> {
		return this.#state.comparisons[`${base}...${head}`] ?? { commits: [] };
	}

	async createBranch(branch: string, sha: string): Promise<void> {
		this.writes.push({ method: 'createBranch', args: [branch, sha] });
	}

	async createPullRequest(pullRequest: NewPullRequest): Promise<CreatedPullRequest> {
		this.writes.push({ method: 'createPullRequest', args: [pullRequest] });
		return { number: CREATED_PR_NUMBER };
	}

	async updatePullRequest(prNumber: number, changes: PullRequestChanges): Promise<void> {
		this.writes.push({ method: 'updatePullRequest', args: [prNumber, changes] });
	}

	async squashMergePullRequest(prNumber: number, options: SquashMergeOptions): Promise<void> {
		this.writes.push({ method: 'squashMergePullRequest', args: [prNumber, options] });
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
