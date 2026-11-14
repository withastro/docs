import { setTimeout } from 'node:timers/promises';
import type { getOctokit } from '@actions/github';
import { toChecks, type Check } from './checks.ts';
import { GitHubError, orNullWhenNotFound, send } from './errors.ts';
import {
	isDecisiveReviewState,
	type Review,
	type ReviewState,
	type ReviewUpdate,
} from './reviews.ts';

/** The client `actions/github-script` gives its script. */
export type Octokit = ReturnType<typeof getOctokit>;

/** A repository, as GitHub Actions names it in `context.repo`. */
export type RepositoryName = { owner: string; repo: string };

/** GitHub's message when the label to remove is not on the issue or pull request. */
const MISSING_LABEL_MESSAGE = 'Label does not exist';
/** The largest page GitHub sends. */
const MAX_PAGE_SIZE = 100;
/** The permissions that allow pushing. The endpoint reports the maintain role as `write`. */
const WRITE_PERMISSIONS = ['admin', 'write'];
const FILE_CONTENT_TYPE = 'file';
/** The encoding of file contents up to 1 MB. Larger files come without their content. */
const FILE_CONTENT_ENCODING = 'base64';
const MERGEABILITY_RETRY_COUNT = 5;
const MERGEABILITY_RETRY_DELAY_MS = 2000;
const SQUASH_MERGE_METHOD = 'squash';
const REQUEST_CHANGES_EVENT = 'REQUEST_CHANGES';

/** The fields of a pull request the release assistant reads, as GitHub names them. */
export type PullRequest = {
	number: number;
	title: string;
	body: string | null;
	draft?: boolean;
	head: {
		ref: string;
		sha: string;
		/** `null` when the repository of the head branch was deleted. */
		repo: { full_name: string } | null;
	};
	base: { ref: string };
	labels: { name: string }[];
};

/**
 * A pull request with its merge state. GitHub sends the merge state only for a
 * single pull request, not in lists.
 */
export type PullRequestDetails = PullRequest & {
	/**
	 * `null` until GitHub has checked the pull request for conflicts. The first
	 * request for the pull request starts that check.
	 */
	mergeable: boolean | null;
	merged: boolean;
};

/** The commits of a branch that its base lacks. */
export type Comparison = {
	/** At most 250 commits, oldest first. */
	commits: { sha: string; commit: { message: string } }[];
};

/** The number of a pull request the release assistant opened. */
export type CreatedPullRequest = Pick<PullRequest, 'number'>;

export type NewPullRequest = {
	title: string;
	/** The branch to merge. */
	head: string;
	/** The branch to merge into. */
	base: string;
	body: string;
};

export type PullRequestChanges = {
	title?: string;
	/** The branch to merge into. */
	base?: string;
	body?: string;
};

export type SquashMergeOptions = {
	expectedHeadSha: string;
	commitTitle?: string;
};

type RepositoryOptions = {
	/** Waits between two requests that poll GitHub. */
	wait?: (delayMs: number) => Promise<void>;
};

/** Reads and changes a GitHub repository through an Octokit client. */
export class GitHubRepository {
	/** As `owner/repo`. */
	readonly fullName: string;
	readonly #octokit: Octokit;
	readonly #name: RepositoryName;
	readonly #wait: (delayMs: number) => Promise<void>;

	/**
	 * @param {Octokit} octokit - The client, authenticated with the token that acts on the repository.
	 * @param {RepositoryName} name - The owner and the name of the repository.
	 * @param {RepositoryOptions} [options] - How to wait between two requests that poll GitHub.
	 */
	constructor(
		octokit: Octokit,
		name: RepositoryName,
		{ wait = setTimeout }: RepositoryOptions = {}
	) {
		this.fullName = `${name.owner}/${name.repo}`;
		this.#octokit = octokit;
		this.#name = name;
		this.#wait = wait;
	}

	/**
	 * Gets all the open pull requests, newest first, drafts included.
	 *
	 * @returns {Promise<PullRequest[]>} The open pull requests.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async getOpenPullRequests(): Promise<PullRequest[]> {
		return send(() =>
			this.#octokit.paginate(this.#octokit.rest.pulls.list, {
				...this.#name,
				state: 'open',
				per_page: MAX_PAGE_SIZE,
			})
		);
	}

	/**
	 * Gets a pull request.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @returns {Promise<PullRequestDetails>} The pull request, whatever its state.
	 * @throws {GitHubError} When GitHub answers with an error status (e.g. a missing pull request).
	 */
	async getPullRequest(prNumber: number): Promise<PullRequestDetails> {
		const { data } = await send(() =>
			this.#octokit.rest.pulls.get({ ...this.#name, pull_number: prNumber })
		);
		return data;
	}

	/**
	 * Gets a pull request that may not exist.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @returns {Promise<PullRequestDetails | null>} The pull request, or `null` when GitHub answers "Not Found" (e.g. a missing pull request or repository).
	 * @throws {GitHubError} When GitHub answers with an error status other than "Not Found".
	 */
	async findPullRequest(prNumber: number): Promise<PullRequestDetails | null> {
		return orNullWhenNotFound(() => this.getPullRequest(prNumber));
	}

	/**
	 * Gets the open pull requests from a branch of the repository's owner,
	 * newest first. GitHub filters by owner and branch, so a fork's branch with
	 * the same name is left out.
	 *
	 * @param {string} branch - The name of the head branch.
	 * @returns {Promise<PullRequest[]>} The open pull requests from the branch.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async getOpenPullRequestsFromBranch(branch: string): Promise<PullRequest[]> {
		return send(() =>
			this.#octokit.paginate(this.#octokit.rest.pulls.list, {
				...this.#name,
				state: 'open',
				head: `${this.#name.owner}:${branch}`,
				per_page: MAX_PAGE_SIZE,
			})
		);
	}

	/**
	 * Gets whether a pull request can be merged without conflicts.
	 *
	 * GitHub checks in the background after the first request for the pull
	 * request, so its `mergeable` is `null` until then. This asks again, a few
	 * times, a few seconds apart.
	 *
	 * @param {Pick<PullRequestDetails, 'number' | 'mergeable'>} pullRequest - The pull request, as last read.
	 * @returns {Promise<boolean | null>} Whether it can be merged, or `null` when GitHub took too long to check.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async waitForMergeability(
		pullRequest: Pick<PullRequestDetails, 'number' | 'mergeable'>
	): Promise<boolean | null> {
		let { mergeable } = pullRequest;
		for (let retry = 0; mergeable === null && retry < MERGEABILITY_RETRY_COUNT; retry++) {
			await this.#wait(MERGEABILITY_RETRY_DELAY_MS);
			({ mergeable } = await this.getPullRequest(pullRequest.number));
		}
		return mergeable;
	}

	/**
	 * Gets all the reviews of a pull request, oldest first.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @returns {Promise<Review[]>} The reviews, pending ones included.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async getReviews(prNumber: number): Promise<Review[]> {
		return send(() =>
			this.#octokit.paginate(this.#octokit.rest.pulls.listReviews, {
				...this.#name,
				pull_number: prNumber,
				per_page: MAX_PAGE_SIZE,
			})
		);
	}

	/**
	 * Gets the current review state of each reviewer of a pull request.
	 *
	 * A reviewer's latest approval, change request, or dismissal is their state.
	 * Comments and pending reviews change nothing. The reviews of a deleted
	 * account are left out.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @returns {Promise<Map<string, ReviewState>>} The state of each reviewer, by login.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async getLatestReviewStates(prNumber: number): Promise<Map<string, ReviewState>> {
		const statesByLogin = new Map<string, ReviewState>();
		for (const { user, state } of await this.getReviews(prNumber)) {
			if (user && isDecisiveReviewState(state)) statesByLogin.set(user.login, state);
		}
		return statesByLogin;
	}

	/**
	 * Tells whether a user can push to the repository.
	 *
	 * @param {string} login - The login of the user.
	 * @returns {Promise<boolean>} `true` for the write, maintain, and admin roles. `false` for a user GitHub does not find.
	 * @throws {GitHubError} When GitHub answers with an error status other than "Not Found".
	 */
	async hasWriteAccess(login: string): Promise<boolean> {
		const response = await orNullWhenNotFound(() =>
			this.#octokit.rest.repos.getCollaboratorPermissionLevel({ ...this.#name, username: login })
		);
		return response !== null && WRITE_PERMISSIONS.includes(response.data.permission);
	}

	/**
	 * Gets the checks of a commit: its check runs, its commit statuses, then its
	 * workflow runs waiting for approval. Only the latest run of each check counts.
	 *
	 * @param {string} sha - The SHA of the commit, usually the head SHA of a PR.
	 * @returns {Promise<Check[]>} The checks with their outcome.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 * @throws {Error} When the commit has more statuses than one page.
	 */
	async getChecks(sha: string): Promise<Check[]> {
		const [checkRuns, combinedStatus, waitingRuns] = await Promise.all([
			send(() =>
				this.#octokit.paginate(this.#octokit.rest.checks.listForRef, {
					...this.#name,
					ref: sha,
					per_page: MAX_PAGE_SIZE,
				})
			),
			send(() =>
				this.#octokit.rest.repos.getCombinedStatusForRef({
					...this.#name,
					ref: sha,
					per_page: MAX_PAGE_SIZE,
				})
			),
			send(() =>
				this.#octokit.paginate(this.#octokit.rest.actions.listWorkflowRunsForRepo, {
					...this.#name,
					head_sha: sha,
					status: 'action_required',
					per_page: MAX_PAGE_SIZE,
				})
			),
		]);
		// The combined status has one status per context, without the links to later pages.
		const { statuses, total_count } = combinedStatus.data;
		if (total_count > statuses.length) {
			throw new Error(
				`Could not read every status of ${sha} in ${this.fullName}: ${total_count} statuses, ${MAX_PAGE_SIZE} per page.`
			);
		}
		return toChecks(checkRuns, statuses, waitingRuns);
	}

	/**
	 * Gets the text of a file, decoded as UTF-8.
	 *
	 * @param {string} path - The file path in the repository, without a leading slash.
	 * @param {string} ref - The SHA, branch, or tag to read the file from.
	 * @returns {Promise<string | null>} The text, or `null` when GitHub answers "Not Found" (e.g. a missing file, ref, or repository).
	 * @throws {GitHubError} When GitHub answers with an error status other than "Not Found".
	 * @throws {Error} When the path is a directory.
	 * @throws {Error} When the file is too large to come with its content.
	 */
	async getFileContent(path: string, ref: string): Promise<string | null> {
		const response = await orNullWhenNotFound(() =>
			this.#octokit.rest.repos.getContent({ ...this.#name, path, ref })
		);
		if (response === null) return null;

		const { data } = response;
		if (Array.isArray(data) || data.type !== FILE_CONTENT_TYPE) {
			throw new Error(`${path} on ${ref} in ${this.fullName} is not a file.`);
		}
		if (!('encoding' in data) || data.encoding !== FILE_CONTENT_ENCODING) {
			throw new Error(
				`${path} on ${ref} in ${this.fullName} is too large to come with its content.`
			);
		}
		return Buffer.from(data.content, FILE_CONTENT_ENCODING).toString('utf8');
	}

	/**
	 * Gets the commit at the head of a branch.
	 *
	 * @param {string} branch - The name of the branch, without `refs/heads/`.
	 * @returns {Promise<string | null>} The SHA of the commit, or `null` when GitHub answers "Not Found" (e.g. a missing branch).
	 * @throws {GitHubError} When GitHub answers with an error status other than "Not Found".
	 */
	async getBranchSha(branch: string): Promise<string | null> {
		const response = await orNullWhenNotFound(() =>
			this.#octokit.rest.git.getRef({ ...this.#name, ref: `heads/${branch}` })
		);
		return response && response.data.object.sha;
	}

	/**
	 * Compares two branches of the repository.
	 *
	 * @param {string} base - The branch to compare with.
	 * @param {string} head - The branch compared to `base`.
	 * @returns {Promise<Comparison>} The commits of `head` missing in `base`.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async compare(base: string, head: string): Promise<Comparison> {
		const { data } = await send(() =>
			this.#octokit.rest.repos.compareCommitsWithBasehead({
				...this.#name,
				basehead: `${base}...${head}`,
			})
		);
		return data;
	}

	/**
	 * Creates a branch.
	 *
	 * @param {string} branch - The name of the branch, without `refs/heads/`.
	 * @param {string} sha - The commit the branch starts at.
	 * @throws {GitHubError} When GitHub answers with an error status (e.g. an existing branch).
	 */
	async createBranch(branch: string, sha: string): Promise<void> {
		await send(() =>
			this.#octokit.rest.git.createRef({ ...this.#name, ref: `refs/heads/${branch}`, sha })
		);
	}

	/**
	 * Opens a pull request.
	 *
	 * @param {NewPullRequest} pullRequest - The pull request to open.
	 * @returns {Promise<CreatedPullRequest>} The number of the new pull request.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async createPullRequest(pullRequest: NewPullRequest): Promise<CreatedPullRequest> {
		const { data } = await send(() =>
			this.#octokit.rest.pulls.create({ ...this.#name, ...pullRequest })
		);
		return data;
	}

	/**
	 * Changes the title, the base branch, or the description of a pull request.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @param {PullRequestChanges} changes - The fields to change. Omitted fields stay as they are.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async updatePullRequest(prNumber: number, changes: PullRequestChanges): Promise<void> {
		await send(() =>
			this.#octokit.rest.pulls.update({ ...this.#name, pull_number: prNumber, ...changes })
		);
	}

	/**
	 * Squash-merges a pull request, if its head is still the expected commit.
	 *
	 * The expected head is usually the one whose checks passed, so a commit
	 * pushed after them is not merged.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @param {SquashMergeOptions} options - The expected head, and the title of the commit.
	 * @throws {GitHubError} When GitHub refuses the merge, for example when the head changed.
	 */
	async squashMergePullRequest(
		prNumber: number,
		{ expectedHeadSha, commitTitle }: SquashMergeOptions
	): Promise<void> {
		await send(() =>
			this.#octokit.rest.pulls.merge({
				...this.#name,
				pull_number: prNumber,
				merge_method: SQUASH_MERGE_METHOD,
				sha: expectedHeadSha,
				commit_title: commitTitle,
			})
		);
	}

	/**
	 * Adds labels to a pull request, keeping the labels it already has.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @param {readonly string[]} labels - The names of the labels.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async addLabels(prNumber: number, labels: readonly string[]): Promise<void> {
		await send(() =>
			this.#octokit.rest.issues.addLabels({
				...this.#name,
				issue_number: prNumber,
				labels: [...labels],
			})
		);
	}

	/**
	 * Submits a review requesting changes, which blocks the merge when the base
	 * branch requires approvals. The token's account can't be the author of
	 * the pull request.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @param {string} body - Why the pull request can't be merged, in Markdown.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async requestChanges(prNumber: number, body: string): Promise<void> {
		await send(() =>
			this.#octokit.rest.pulls.createReview({
				...this.#name,
				pull_number: prNumber,
				event: REQUEST_CHANGES_EVENT,
				body,
			})
		);
	}

	/**
	 * Changes the text of a review.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @param {ReviewUpdate} update - The review to change, and its new text.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async updateReview(prNumber: number, { reviewId, body }: ReviewUpdate): Promise<void> {
		await send(() =>
			this.#octokit.rest.pulls.updateReview({
				...this.#name,
				pull_number: prNumber,
				review_id: reviewId,
				body,
			})
		);
	}

	/**
	 * Removes a label from a pull request. This also succeeds when the pull
	 * request does not have it.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @param {string} label - The name of the label.
	 * @throws {GitHubError} When GitHub answers with an error status (e.g. a missing pull request).
	 */
	async removeLabel(prNumber: number, label: string): Promise<void> {
		try {
			await send(() =>
				this.#octokit.rest.issues.removeLabel({
					...this.#name,
					issue_number: prNumber,
					name: label,
				})
			);
		} catch (error) {
			if (!isMissingLabel(error)) throw error;
		}
	}

	/**
	 * Comments on a pull request.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @param {string} body - The comment, in Markdown.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async createComment(prNumber: number, body: string): Promise<void> {
		await send(() =>
			this.#octokit.rest.issues.createComment({ ...this.#name, issue_number: prNumber, body })
		);
	}
}

/**
 * The public members of `GitHubRepository`. Another class can implement this
 * type, but not `GitHubRepository` itself, which has private fields.
 */
export type Repository = Pick<GitHubRepository, keyof GitHubRepository>;

/**
 * Tells whether a pull request has a label.
 *
 * @param {Pick<PullRequest, 'labels'>} pullRequest - The pull request, or an object with labels.
 * @param {string} label - The name of the label.
 * @returns {boolean} `true` when one of the labels has this name.
 */
export function hasLabel(pullRequest: Pick<PullRequest, 'labels'>, label: string): boolean {
	return pullRequest.labels.some(({ name }) => name === label);
}

function isMissingLabel(error: unknown) {
	return (
		error instanceof GitHubError && error.isNotFound && error.apiMessage === MISSING_LABEL_MESSAGE
	);
}
