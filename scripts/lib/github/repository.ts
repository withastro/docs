import { setTimeout } from 'node:timers/promises';
import { checkRunListShape, combinedStatusShape, toChecks, type Check } from './checks.ts';
import {
	getAllPages,
	GitHubError,
	MAX_PAGE_SIZE,
	sendRequest,
	type HttpMethod,
} from './request.ts';
import * as shape from './shape.ts';

/** `owner/repo`, where neither part is made only of dots, so the endpoint stays in `/repos`. */
const REPOSITORY_FULL_NAME = /^(?!\.+\/)[\w.-]+\/(?!\.+$)[\w.-]+$/;
/** The permissions that allow pushing. The endpoint reports the maintain role as `write`. */
const WRITE_PERMISSIONS = ['admin', 'write'];
/** Segments that change the endpoint: dot segments resolve, and an empty one drops a level. */
const UNSAFE_SEGMENTS = ['', '.', '..'];
const REQUEST_CHANGES_EVENT = 'REQUEST_CHANGES';
/** GitHub's message when the label to remove is not on the issue or pull request. */
const MISSING_LABEL_MESSAGE = 'Label does not exist';
const FILE_CONTENT_TYPE = 'file';
/** The encoding of file contents up to 1 MB. Larger files come without their content. */
const FILE_CONTENT_ENCODING = 'base64';
const MERGEABILITY_RETRY_COUNT = 5;
const MERGEABILITY_RETRY_DELAY_MS = 2000;

export const REVIEW_STATES = {
	approved: 'APPROVED',
	changesRequested: 'CHANGES_REQUESTED',
	commented: 'COMMENTED',
	dismissed: 'DISMISSED',
	pending: 'PENDING',
} as const;

export type ReviewState = (typeof REVIEW_STATES)[keyof typeof REVIEW_STATES];

/** The review states that replace a reviewer's earlier ones. */
const DECISIVE_REVIEW_STATES: ReviewState[] = [
	REVIEW_STATES.approved,
	REVIEW_STATES.changesRequested,
	REVIEW_STATES.dismissed,
];

export const MERGE_METHODS = {
	merge: 'merge',
	rebase: 'rebase',
	squash: 'squash',
} as const;

export type MergeMethod = (typeof MERGE_METHODS)[keyof typeof MERGE_METHODS];

const userShape = shape.object({ login: shape.string });

const reviewShape = shape.object({
	id: shape.number,
	/** `null` when the account was deleted. */
	user: shape.nullable(userShape),
	state: shape.oneOf(Object.values(REVIEW_STATES)),
	/** The text of the review, in Markdown. Empty when the reviewer wrote none. */
	body: shape.string,
	/** The head commit when the review was submitted. */
	commit_id: shape.nullable(shape.string),
});

const pullRequestFieldShapes = {
	number: shape.number,
	title: shape.string,
	body: shape.nullable(shape.string),
	html_url: shape.string,
	draft: shape.boolean,
	/** `null` when the account was deleted. */
	user: shape.nullable(userShape),
	head: shape.object({
		ref: shape.string,
		sha: shape.string,
		/** `null` when the repository of the head branch was deleted. */
		repo: shape.nullable(shape.object({ full_name: shape.string })),
	}),
	base: shape.object({ ref: shape.string }),
	labels: shape.list(shape.object({ name: shape.string })),
};

const pullRequestShape = shape.object(pullRequestFieldShapes);

const pullRequestDetailsShape = shape.object({
	...pullRequestFieldShapes,
	/**
	 * `null` until GitHub has checked the pull request for conflicts. The first
	 * request for the pull request starts that check.
	 */
	mergeable: shape.nullable(shape.boolean),
	merged: shape.boolean,
});

const createdPullRequestShape = shape.object({ number: shape.number, html_url: shape.string });

const comparisonShape = shape.object({
	ahead_by: shape.number,
	/** At most 250 commits, oldest first. */
	commits: shape.list(
		shape.object({ sha: shape.string, commit: shape.object({ message: shape.string }) })
	),
});

const permissionShape = shape.object({ permission: shape.string });

const branchRefShape = shape.object({ object: shape.object({ sha: shape.string }) });

const fileContentShape = shape.object({
	type: shape.oneOf([FILE_CONTENT_TYPE]),
	encoding: shape.oneOf([FILE_CONTENT_ENCODING]),
	content: shape.string,
});

export type Review = shape.Infer<typeof reviewShape>;

export type PullRequest = shape.Infer<typeof pullRequestShape>;

/** A pull request with the fields only the endpoint for a single pull request sends. */
export type PullRequestDetails = shape.Infer<typeof pullRequestDetailsShape>;

export type CreatedPullRequest = shape.Infer<typeof createdPullRequestShape>;

export type Comparison = shape.Infer<typeof comparisonShape>;

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

export type MergeOptions = {
	method: MergeMethod;
	expectedHeadSha: string;
	/** Defaults to the title the repository settings give. */
	commitTitle?: string;
};

export type ReviewUpdate = {
	reviewId: number;
	/** The new text, in Markdown. */
	body: string;
};

type RepositoryRequest = {
	method: HttpMethod;
	/** The endpoint inside the repository, starting with a slash. */
	path: string;
	body?: Record<string, unknown>;
};

export type RepositoryOptions = {
	/** As `owner/repo`. */
	fullName: string;
	token: string;
	/** Waits between two requests that poll GitHub. Defaults to a timer. */
	wait?: (delayMs: number) => Promise<void>;
};

/**
 * A GitHub repository, read and changed through the GitHub REST API.
 *
 * Each write method sends a single request and reads nothing before it, so a
 * subclass can override the writes to log them instead, for a dry run.
 */
export class GitHubRepository {
	readonly fullName: string;
	#owner: string;
	#token: string;
	#endpoint: string;
	#wait: (delayMs: number) => Promise<void>;

	/**
	 * @param {RepositoryOptions} options - How to reach the repository.
	 * @throws {Error} When the name is not `owner/repo`.
	 * @throws {Error} When the token is empty.
	 */
	constructor({ fullName, token, wait = setTimeout }: RepositoryOptions) {
		if (!REPOSITORY_FULL_NAME.test(fullName)) {
			throw new Error(`Expected a repository name like "owner/repo", got "${fullName}".`);
		}
		if (!token) throw new Error(`GitHubRepository needs a token to act on ${fullName}.`);

		this.fullName = fullName;
		[this.#owner] = fullName.split('/');
		this.#token = token;
		this.#endpoint = `/repos/${fullName}`;
		this.#wait = wait;
	}

	/**
	 * Gets all the reviews of a pull request, oldest first.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @returns {Promise<Review[]>} The reviews, pending ones included.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 * @throws {Error} When a review does not have the expected shape.
	 */
	async getReviews(prNumber: number): Promise<Review[]> {
		return this.#getList(`/pulls/${prNumber}/reviews`, reviewShape);
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
	 * @throws {Error} When a review does not have the expected shape.
	 */
	async getLatestReviewStates(prNumber: number): Promise<Map<string, ReviewState>> {
		const statesByLogin = new Map<string, ReviewState>();
		for (const { user, state } of await this.getReviews(prNumber)) {
			if (user && DECISIVE_REVIEW_STATES.includes(state)) statesByLogin.set(user.login, state);
		}
		return statesByLogin;
	}

	/**
	 * Gets all the open pull requests, newest first.
	 *
	 * @returns {Promise<PullRequest[]>} The open pull requests, drafts included.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 * @throws {Error} When a pull request does not have the expected shape.
	 */
	async getOpenPullRequests(): Promise<PullRequest[]> {
		return this.#getList('/pulls?state=open', pullRequestShape);
	}

	/**
	 * Gets the open pull requests from a repository's owner branch, newest first.
	 *
	 * GitHub filters by owner and branch, so a fork's branch with the same name
	 * is left out.
	 *
	 * @param {string} branch - The name of the head branch.
	 * @returns {Promise<PullRequest[]>} The open pull requests from the branch.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 * @throws {Error} When a pull request does not have the expected shape.
	 */
	async getOpenPullRequestsFromBranch(branch: string): Promise<PullRequest[]> {
		const head = encodeURIComponent(`${this.#owner}:${branch}`);
		return this.#getList(`/pulls?state=open&head=${head}`, pullRequestShape);
	}

	/**
	 * Gets a pull request.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @returns {Promise<PullRequestDetails>} The pull request, whatever its state.
	 * @throws {GitHubError} When GitHub answers with an error status (e.g. a missing pull request).
	 * @throws {Error} When the pull request does not have the expected shape.
	 */
	async getPullRequest(prNumber: number): Promise<PullRequestDetails> {
		return this.#get(`/pulls/${prNumber}`, pullRequestDetailsShape);
	}

	/**
	 * Gets a pull request that may not exist.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @returns {Promise<PullRequestDetails | null>} The pull request, or `null`
	 * when GitHub answers "Not Found" (e.g. a missing pull request or repository).
	 * @throws {GitHubError} When GitHub answers with an error status other than "Not Found".
	 * @throws {Error} When the pull request does not have the expected shape.
	 */
	async findPullRequest(prNumber: number): Promise<PullRequestDetails | null> {
		return this.#getOrNull(`/pulls/${prNumber}`, pullRequestDetailsShape);
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
	 * @throws {Error} When the pull request does not have the expected shape.
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
	 * Gets the checks of a commit: its check runs, then its commit statuses.
	 *
	 * Only the latest run of each check counts.
	 *
	 * @param {string} ref - The SHA, branch, or tag of the commit, usually the head SHA of a PR.
	 * @returns {Promise<Check[]>} The checks with their outcome.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 * @throws {Error} When the ref has an unsafe path segment.
	 * @throws {Error} When a response does not have the expected shape.
	 * @throws {Error} When a list has more than one page.
	 */
	async getChecks(ref: string): Promise<Check[]> {
		const commitPath = `/commits/${encodePathSegments(ref)}`;
		const [checkRunList, combinedStatus] = await Promise.all([
			this.#get(`${commitPath}/check-runs?per_page=${MAX_PAGE_SIZE}`, checkRunListShape),
			this.#get(`${commitPath}/status?per_page=${MAX_PAGE_SIZE}`, combinedStatusShape),
		]);

		ensureSinglePage(
			{ items: checkRunList.check_runs, totalCount: checkRunList.total_count },
			`check runs on ${ref}`
		);
		ensureSinglePage(
			{ items: combinedStatus.statuses, totalCount: combinedStatus.total_count },
			`statuses on ${ref}`
		);
		return toChecks(checkRunList, combinedStatus);
	}

	/**
	 * Compares two branches of the repository.
	 *
	 * @param {string} base - The branch to compare with.
	 * @param {string} head - The branch compared to `base`.
	 * @returns {Promise<Comparison>} The commits of `head` missing in `base`, with their count.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 * @throws {Error} When a branch has an unsafe path segment.
	 * @throws {Error} When the comparison does not have the expected shape.
	 */
	async compare(base: string, head: string): Promise<Comparison> {
		return this.#get(
			`/compare/${encodePathSegments(base)}...${encodePathSegments(head)}`,
			comparisonShape
		);
	}

	/**
	 * Tells whether a user can push to the repository.
	 *
	 * @param {string} login - The login of the user.
	 * @returns {Promise<boolean>} `true` for the write, maintain, and admin roles.
	 * @throws {GitHubError} When GitHub answers with an error status other than "Not Found".
	 * @throws {Error} When the login is an unsafe path segment.
	 * @throws {Error} When the permission does not have the expected shape.
	 */
	async hasWriteAccess(login: string): Promise<boolean> {
		const collaborator = await this.#getOrNull(
			`/collaborators/${encodePathSegment(login)}/permission`,
			permissionShape
		);
		return collaborator !== null && WRITE_PERMISSIONS.includes(collaborator.permission);
	}

	/**
	 * Gets the text of a file.
	 *
	 * @param {string} path - The file path in the repository, without a leading slash.
	 * @param {string} ref - The SHA, branch, or tag to read the file from.
	 * @returns {Promise<string | null>} The file text, decoded as UTF-8, or `null` when GitHub answers "Not Found" (e.g. a missing file, ref, or repository).
	 * @throws {GitHubError} When GitHub answers with an error status other than "Not Found".
	 * @throws {Error} When the path has an unsafe path segment.
	 * @throws {Error} When the path is not a file.
	 * @throws {Error} When the file is larger than 1 MB.
	 */
	async getFileContent(path: string, ref: string): Promise<string | null> {
		const file = await this.#getOrNull(
			`/contents/${encodePathSegments(path)}?ref=${encodeURIComponent(ref)}`,
			fileContentShape
		);
		return file && Buffer.from(file.content, FILE_CONTENT_ENCODING).toString('utf8');
	}

	/**
	 * Gets the commit at the head of a branch.
	 *
	 * @param {string} branch - The name of the branch, without `refs/heads/`.
	 * @returns {Promise<string | null>} The SHA of the commit, or `null` when GitHub answers "Not Found" (e.g. a missing branch or repository).
	 * @throws {GitHubError} When GitHub answers with an error status other than "Not Found".
	 * @throws {Error} When the branch has an unsafe path segment.
	 * @throws {Error} When the ref does not have the expected shape.
	 */
	async getBranchSha(branch: string): Promise<string | null> {
		const branchRef = await this.#getOrNull(
			`/git/ref/heads/${encodePathSegments(branch)}`,
			branchRefShape
		);
		return branchRef && branchRef.object.sha;
	}

	/**
	 * Opens a pull request.
	 *
	 * @param {NewPullRequest} pullRequest - The pull request to open.
	 * @returns {Promise<CreatedPullRequest>} The number and the URL of the new pull request.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 * @throws {Error} When the created pull request does not have the expected shape.
	 */
	async createPullRequest(pullRequest: NewPullRequest): Promise<CreatedPullRequest> {
		return this.#request(
			{ method: 'POST', path: '/pulls', body: pullRequest },
			createdPullRequestShape
		);
	}

	/**
	 * Creates a branch.
	 *
	 * @param {string} branch - The name of the branch, without `refs/heads/`.
	 * @param {string} sha - The commit the branch starts at.
	 * @throws {GitHubError} When GitHub answers with an error status (e.g. an existing branch).
	 */
	async createBranch(branch: string, sha: string): Promise<void> {
		await this.#send({
			method: 'POST',
			path: '/git/refs',
			body: { ref: `refs/heads/${branch}`, sha },
		});
	}

	/**
	 * Adds labels to a pull request, keeping the labels it already has.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @param {readonly string[]} labels - The names of the labels.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async addLabels(prNumber: number, labels: readonly string[]): Promise<void> {
		await this.#send({ method: 'POST', path: `/issues/${prNumber}/labels`, body: { labels } });
	}

	/**
	 * Removes a label from a pull request. This also succeeds when the pull
	 * request does not have it.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @param {string} label - The name of the label.
	 * @throws {GitHubError} When GitHub answers with an error status (e.g. a missing pull request).
	 * @throws {Error} When the label is an unsafe path segment.
	 */
	async removeLabel(prNumber: number, label: string): Promise<void> {
		try {
			await this.#send({
				method: 'DELETE',
				path: `/issues/${prNumber}/labels/${encodePathSegment(label)}`,
			});
		} catch (error) {
			if (!isMissingLabel(error)) throw error;
		}
	}

	/**
	 * Changes the title, the base branch, or the description of a pull request.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @param {PullRequestChanges} changes - The fields to change. Omitted fields stay as they are.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async updatePullRequest(prNumber: number, changes: PullRequestChanges): Promise<void> {
		await this.#send({ method: 'PATCH', path: `/pulls/${prNumber}`, body: changes });
	}

	/**
	 * Merges a pull request, if its head is still the expected commit.
	 *
	 * The expected head is usually the one whose checks passed, so a commit
	 * pushed after them is not merged.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @param {MergeOptions} options - How to merge.
	 * @throws {GitHubError} When GitHub refuses the merge, for example when the head changed.
	 */
	async mergePullRequest(
		prNumber: number,
		{ method, expectedHeadSha, commitTitle }: MergeOptions
	): Promise<void> {
		await this.#send({
			method: 'PUT',
			path: `/pulls/${prNumber}/merge`,
			body: { merge_method: method, sha: expectedHeadSha, commit_title: commitTitle },
		});
	}

	/**
	 * Comments on a pull request.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @param {string} body - The comment, in Markdown.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async createComment(prNumber: number, body: string): Promise<void> {
		await this.#send({ method: 'POST', path: `/issues/${prNumber}/comments`, body: { body } });
	}

	/**
	 * Submits a review requesting changes, which blocks the merge when the base
	 * branch requires approvals.
	 *
	 * The token's account cannot be the author of the pull request.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @param {string} body - Why the pull request cannot be merged, in Markdown.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async requestChanges(prNumber: number, body: string): Promise<void> {
		await this.#send({
			method: 'POST',
			path: `/pulls/${prNumber}/reviews`,
			body: { event: REQUEST_CHANGES_EVENT, body },
		});
	}

	/**
	 * Changes the text of a review, keeping its state.
	 *
	 * The token's account must be the author of the review.
	 *
	 * @param {number} prNumber - The number of the pull request.
	 * @param {ReviewUpdate} update - The review to change, and its new text.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 */
	async updateReview(prNumber: number, { reviewId, body }: ReviewUpdate): Promise<void> {
		await this.#send({
			method: 'PUT',
			path: `/pulls/${prNumber}/reviews/${reviewId}`,
			body: { body },
		});
	}

	async #get<T>(path: string, responseShape: shape.Shape<T>): Promise<T> {
		return this.#request({ method: 'GET', path }, responseShape);
	}

	/** Gets a resource, or `null` when GitHub answers "Not Found". */
	async #getOrNull<T>(path: string, responseShape: shape.Shape<T>): Promise<T | null> {
		try {
			return await this.#get(path, responseShape);
		} catch (error) {
			if (error instanceof GitHubError && error.isNotFound) return null;
			throw error;
		}
	}

	async #getList<T>(path: string, itemShape: shape.Shape<T>): Promise<T[]> {
		const endpoint = `${this.#endpoint}${path}`;
		const items = await getAllPages({ token: this.#token, path: endpoint });
		return shape.parseResponse(items, shape.list(itemShape), `GET ${endpoint}`);
	}

	async #request<T>(request: RepositoryRequest, responseShape: shape.Shape<T>): Promise<T> {
		const endpoint = `${this.#endpoint}${request.path}`;
		const response = await sendRequest({ ...request, token: this.#token, path: endpoint });
		return shape.parseResponse(response, responseShape, `${request.method} ${endpoint}`);
	}

	async #send(request: RepositoryRequest): Promise<void> {
		const endpoint = `${this.#endpoint}${request.path}`;
		await sendRequest({ ...request, token: this.#token, path: endpoint });
	}
}

/**
 * The `GitHubRepository` public methods and fields, without its private fields.
 *
 * A class with private fields only matches its own instances. A test fake
 * should implement this type instead.
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

/**
 * Encodes each segment of a ref or a file path, keeping its slashes, so it
 * cannot change the endpoint.
 */
function encodePathSegments(path: string) {
	return path.split('/').map(encodePathSegment).join('/');
}

/**
 * Encodes one segment of a URL path, so it cannot change the endpoint.
 *
 * @param {string} segment - The text to put between two slashes of the path.
 * @returns {string} The encoded segment.
 * @throws {Error} When the segment is empty, `.`, or `..`.
 */
function encodePathSegment(segment: string) {
	if (UNSAFE_SEGMENTS.includes(segment)) {
		throw new Error(`Cannot use "${segment}" as a segment of a URL path.`);
	}
	return encodeURIComponent(segment);
}

/** A page of a list, with the size of the whole list. */
type CountedPage = { items: unknown[]; totalCount: number };

function ensureSinglePage({ items, totalCount }: CountedPage, itemsName: string) {
	if (totalCount > items.length) {
		throw new Error(`Found ${totalCount} ${itemsName}, but one page only holds ${items.length}.`);
	}
}

function isMissingLabel(error: unknown) {
	return (
		error instanceof GitHubError && error.isNotFound && error.apiMessage === MISSING_LABEL_MESSAGE
	);
}
