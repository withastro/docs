import { CHECK_STATES, type Check } from '../lib/github/checks.ts';
import {
	REVIEW_STATES,
	type Comparison,
	type CreatedPullRequest,
	type MergeOptions,
	type NewPullRequest,
	type PullRequestChanges,
	type PullRequestDetails,
	type Repository,
	type Review,
	type ReviewState,
	type ReviewUpdate,
} from '../lib/github/repository.ts';
import { GitHubError } from '../lib/github/request.ts';
import { RELEASE_TYPES, type ReleaseType } from './config.ts';
import type { FrameworkRelease } from './framework-release.ts';

export const FAKE_REPOSITORY_NAME = 'example-org/docs';
/** The branches of the umbrella of the stable docs branch. */
export const MAIN_BRANCHES = { head: 'release-queue/main', base: 'main' };
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

type ReleaseFixture = {
	prNumber?: number;
	/** As `name@version`, such as `@astrojs/node@10.0.1`. */
	versions?: string[];
	type?: ReleaseType;
};

type FakeRepositoryState = {
	pullRequests?: PullRequestDetails[];
	reviewsByPrNumber?: Record<number, Review[]>;
	/** The current review state of each reviewer, by login, as GitHub counts it. */
	reviewStatesByPrNumber?: Record<number, Record<string, ReviewState>>;
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
 * Builds a release of the framework, for tests.
 *
 * @param {ReleaseFixture} fixture - The fields that matter to the test.
 * @returns {FrameworkRelease} The release.
 */
export function buildRelease({
	prNumber = 100,
	versions = [],
	type = RELEASE_TYPES.patch,
}: ReleaseFixture = {}): FrameworkRelease {
	const packages = versions.map((packageVersion) => {
		const separatorIndex = packageVersion.lastIndexOf('@');
		return {
			name: packageVersion.slice(0, separatorIndex),
			version: packageVersion.slice(separatorIndex + 1),
		};
	});
	return { prNumber, packages, type };
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
		reviewStatesByPrNumber: { [pullRequest.number]: { [MAINTAINER]: REVIEW_STATES.approved } },
		checksByRef: { [pullRequest.head.sha]: [{ name: 'build', state: CHECK_STATES.success }] },
	};
}

/** An in-memory repository for tests: it serves the state it was given and records writes. */
export class FakeRepository implements Repository {
	readonly fullName = FAKE_REPOSITORY_NAME;
	readonly writes: Write[] = [];
	#state: Required<FakeRepositoryState>;

	/**
	 * @param {FakeRepositoryState} state - The pull requests, reviews, maintainers, checks, and branches.
	 */
	constructor({
		pullRequests = [],
		reviewsByPrNumber = {},
		reviewStatesByPrNumber = {},
		maintainers = [MAINTAINER],
		checksByRef = {},
		branchShas = { main: 'sha-main' },
		files = {},
		comparisons = {},
	}: FakeRepositoryState) {
		this.#state = {
			pullRequests,
			reviewsByPrNumber,
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

	async getOpenPullRequestsFromBranch(branch: string): Promise<PullRequestDetails[]> {
		return this.#state.pullRequests.filter(
			({ head }) => head.ref === branch && head.repo?.full_name === this.fullName
		);
	}

	async getPullRequest(prNumber: number): Promise<PullRequestDetails> {
		const pullRequest = await this.findPullRequest(prNumber);
		if (!pullRequest) {
			throw new GitHubError({
				message: `GET /pulls/${prNumber} failed with 404: Not Found`,
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

	async getReviews(prNumber: number): Promise<Review[]> {
		return this.#state.reviewsByPrNumber[prNumber] ?? [];
	}

	async getLatestReviewStates(prNumber: number): Promise<Map<string, ReviewState>> {
		return new Map(Object.entries(this.#state.reviewStatesByPrNumber[prNumber] ?? {}));
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

	async requestChanges(prNumber: number, body: string): Promise<void> {
		this.writes.push({ method: 'requestChanges', args: [prNumber, body] });
	}

	async updateReview(prNumber: number, update: ReviewUpdate): Promise<void> {
		this.writes.push({ method: 'updateReview', args: [prNumber, update] });
	}
}

/**
 * Creates the context of a run on fake repositories, for tests.
 *
 * @param {FakeRepository} docs - The docs repository.
 * @param {FakeRepository} [astro] - The framework repository. Defaults to an empty one.
 * @returns The context, and the lines it logged.
 */
export function createContext(docs: FakeRepository, astro = new FakeRepository({})) {
	const logs: string[] = [];
	const log = (message: string) => logs.push(message);
	const reviewer = new FakeRepository({});
	return { context: { docs, astro, reviewer, log, jobName: 'release-queue' }, logs };
}
