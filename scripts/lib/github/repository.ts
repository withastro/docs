import { isCheckRunList, isCombinedStatus, toChecks, type Check } from './checks.ts';
import {
	ensureShape,
	isBoolean,
	isNumber,
	isOneOf,
	isString,
	listOf,
	orNull,
	shapeOf,
	type Guard,
} from './guards.ts';
import {
	getAllPages,
	GitHubError,
	MAX_PAGE_SIZE,
	sendRequest,
	type HttpMethod,
} from './request.ts';

/** `owner/repo`, where neither part is made only of dots, so the endpoint stays in `/repos`. */
const REPOSITORY_FULL_NAME = /^(?!\.+\/)[\w.-]+\/(?!\.+$)[\w.-]+$/;
/** The permissions that allow pushing. The endpoint reports the maintain role as `write`. */
const WRITE_PERMISSIONS = ['admin', 'write'];
/** Segments that change the endpoint: dot segments resolve, and an empty one drops a level. */
const UNSAFE_SEGMENTS = ['', '.', '..'];
const REQUEST_CHANGES_EVENT = 'REQUEST_CHANGES';
/** GitHub's message when the label to remove is not on the issue or pull request. */
const MISSING_LABEL_MESSAGE = 'Label does not exist';

export const REVIEW_STATES = {
	approved: 'APPROVED',
	changesRequested: 'CHANGES_REQUESTED',
	commented: 'COMMENTED',
	dismissed: 'DISMISSED',
	pending: 'PENDING',
} as const;

export type ReviewState = (typeof REVIEW_STATES)[keyof typeof REVIEW_STATES];

export const MERGE_METHODS = {
	merge: 'merge',
	rebase: 'rebase',
	squash: 'squash',
} as const;

export type MergeMethod = (typeof MERGE_METHODS)[keyof typeof MERGE_METHODS];

type User = { login: string };

export type Review = {
	id: number;
	/** `null` when the account was deleted. */
	user: User | null;
	state: ReviewState;
	/** The head commit when the review was submitted. */
	commit_id: string | null;
};

export type PullRequest = {
	number: number;
	title: string;
	body: string | null;
	html_url: string;
	draft: boolean;
	/** `null` when the account was deleted. */
	user: User | null;
	head: { ref: string; sha: string };
	base: { ref: string };
	labels: { name: string }[];
};

export type NewPullRequest = {
	title: string;
	/** The branch to merge. */
	head: string;
	/** The branch to merge into. */
	base: string;
	body: string;
};

export type CreatedPullRequest = Pick<PullRequest, 'number' | 'html_url'>;

export type PullRequestChanges = {
	/** The branch to merge into. */
	base?: string;
	body?: string;
};

export type MergeOptions = {
	method: MergeMethod;
	expectedHeadSha: string;
};

export type Comparison = {
	ahead_by: number;
	/** At most 250 commits, oldest first. */
	commits: { sha: string; commit: { message: string } }[];
};

type RepositoryRequest = {
	method: HttpMethod;
	/** The endpoint inside the repository, starting with a slash. */
	path: string;
	body?: Record<string, unknown>;
};

const isUser = shapeOf<User>({ login: isString });

const isReview = shapeOf<Review>({
	id: isNumber,
	user: orNull(isUser),
	state: isOneOf(Object.values(REVIEW_STATES)),
	commit_id: orNull(isString),
});

const isPullRequest = shapeOf<PullRequest>({
	number: isNumber,
	title: isString,
	body: orNull(isString),
	html_url: isString,
	draft: isBoolean,
	user: orNull(isUser),
	head: shapeOf({ ref: isString, sha: isString }),
	base: shapeOf({ ref: isString }),
	labels: listOf(shapeOf({ name: isString })),
});

const isCreatedPullRequest = shapeOf<CreatedPullRequest>({
	number: isNumber,
	html_url: isString,
});

const isComparison = shapeOf<Comparison>({
	ahead_by: isNumber,
	commits: listOf(shapeOf({ sha: isString, commit: shapeOf({ message: isString }) })),
});

const isPermission = shapeOf<{ permission: string }>({ permission: isString });

type RepositoryOptions = {
	/** As `owner/repo`. */
	fullName: string;
	token: string;
};

/**
 * A GitHub repository, read and changed through the GitHub REST API.
 *
 * Each write method sends a single request and reads nothing before it, so a
 * subclass can override the writes to log them instead, for a dry run.
 */
export class GitHubRepository {
	readonly fullName: string;
	#token: string;
	#endpoint: string;

	/**
	 * @param {RepositoryOptions} options - The repository and the token to act on it with.
	 * @throws {Error} When the name is not `owner/repo`.
	 * @throws {Error} When the token is empty.
	 */
	constructor({ fullName, token }: RepositoryOptions) {
		if (!REPOSITORY_FULL_NAME.test(fullName)) {
			throw new Error(`Expected a repository name like "owner/repo", got "${fullName}".`);
		}
		if (!token) throw new Error(`GitHubRepository needs a token to act on ${fullName}.`);

		this.fullName = fullName;
		this.#token = token;
		this.#endpoint = `/repos/${fullName}`;
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
		const reviews = await this.#getList(`/pulls/${prNumber}/reviews`, isReview);
		return reviews.map(toReview);
	}

	/**
	 * Gets all the open pull requests, newest first.
	 *
	 * @returns {Promise<PullRequest[]>} The open pull requests, drafts included.
	 * @throws {GitHubError} When GitHub answers with an error status.
	 * @throws {Error} When a pull request does not have the expected shape.
	 */
	async getOpenPullRequests(): Promise<PullRequest[]> {
		const pullRequests = await this.#getList('/pulls?state=open', isPullRequest);
		return pullRequests.map(toPullRequest);
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
		const commitPath = `/commits/${encodeRef(ref)}`;
		const [checkRunList, combinedStatus] = await Promise.all([
			this.#get(`${commitPath}/check-runs?per_page=${MAX_PAGE_SIZE}`, isCheckRunList),
			this.#get(`${commitPath}/status?per_page=${MAX_PAGE_SIZE}`, isCombinedStatus),
		]);

		return toChecks(checkRunList, combinedStatus, ref);
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
		const comparison = await this.#get(
			`/compare/${encodeRef(base)}...${encodeRef(head)}`,
			isComparison
		);
		return toComparison(comparison);
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
		try {
			const { permission } = await this.#get(
				`/collaborators/${encodePathSegment(login)}/permission`,
				isPermission
			);
			return WRITE_PERMISSIONS.includes(permission);
		} catch (error) {
			if (error instanceof GitHubError && error.isNotFound) return false;
			throw error;
		}
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
		const { number, html_url } = await this.#request(
			{ method: 'POST', path: '/pulls', body: pullRequest },
			isCreatedPullRequest
		);
		return { number, html_url };
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
	 * Changes the base branch or the description of a pull request.
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
	 * @param {MergeOptions} options - The merge method and the expected head SHA.
	 * @throws {GitHubError} When GitHub refuses the merge, for example when the head changed.
	 */
	async mergePullRequest(
		prNumber: number,
		{ method, expectedHeadSha }: MergeOptions
	): Promise<void> {
		await this.#send({
			method: 'PUT',
			path: `/pulls/${prNumber}/merge`,
			body: { merge_method: method, sha: expectedHeadSha },
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

	async #get<T>(path: string, guard: Guard<T>): Promise<T> {
		return this.#request({ method: 'GET', path }, guard);
	}

	async #getList<T>(path: string, guard: Guard<T>): Promise<T[]> {
		const endpoint = `${this.#endpoint}${path}`;
		const items = await getAllPages({ token: this.#token, path: endpoint });
		return ensureShape(items, listOf(guard), `GET ${endpoint}`);
	}

	async #request<T>(request: RepositoryRequest, guard: Guard<T>): Promise<T> {
		const endpoint = `${this.#endpoint}${request.path}`;
		const response = await sendRequest({ ...request, token: this.#token, path: endpoint });
		return ensureShape(response, guard, `${request.method} ${endpoint}`);
	}

	async #send(request: RepositoryRequest): Promise<void> {
		const endpoint = `${this.#endpoint}${request.path}`;
		await sendRequest({ ...request, token: this.#token, path: endpoint });
	}
}

/** Encodes each segment of a ref, keeping its slashes, so the ref cannot change the endpoint. */
function encodeRef(ref: string) {
	return ref.split('/').map(encodePathSegment).join('/');
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

function isMissingLabel(error: unknown) {
	return (
		error instanceof GitHubError && error.isNotFound && error.apiMessage === MISSING_LABEL_MESSAGE
	);
}

function toUser(user: User | null): User | null {
	return user && { login: user.login };
}

function toReview({ id, user, state, commit_id }: Review): Review {
	return { id, user: toUser(user), state, commit_id };
}

function toPullRequest(pullRequest: PullRequest): PullRequest {
	const { number, title, body, html_url, draft, user, head, base, labels } = pullRequest;
	return {
		number,
		title,
		body,
		html_url,
		draft,
		user: toUser(user),
		head: { ref: head.ref, sha: head.sha },
		base: { ref: base.ref },
		labels: labels.map(({ name }) => ({ name })),
	};
}

function toComparison({ ahead_by, commits }: Comparison): Comparison {
	return {
		ahead_by,
		commits: commits.map(({ sha, commit }) => ({ sha, commit: { message: commit.message } })),
	};
}
