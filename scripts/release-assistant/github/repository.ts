import type { getOctokit } from '@actions/github';
import { GitHubError, send } from './errors.ts';

/** The client `actions/github-script` gives its script. */
export type Octokit = ReturnType<typeof getOctokit>;

/** A repository, as GitHub Actions names it in `context.repo`. */
export type RepositoryName = { owner: string; repo: string };

/** GitHub's message when the label to remove is not on the issue or pull request. */
const MISSING_LABEL_MESSAGE = 'Label does not exist';
/** The largest page GitHub sends. */
const MAX_PAGE_SIZE = 100;

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

/** Reads and changes a GitHub repository through an Octokit client. */
export class GitHubRepository {
	/** As `owner/repo`. */
	readonly fullName: string;
	readonly #octokit: Octokit;
	readonly #name: RepositoryName;

	/**
	 * @param {Octokit} octokit - The client, authenticated with the token that acts on the repository.
	 * @param {RepositoryName} name - The owner and the name of the repository.
	 */
	constructor(octokit: Octokit, name: RepositoryName) {
		this.fullName = `${name.owner}/${name.repo}`;
		this.#octokit = octokit;
		this.#name = name;
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
