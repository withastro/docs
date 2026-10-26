import type { GitHubClient, WriteMethod } from './client.ts';
import { isNotFound } from './error.ts';
import type { CompareResponse, PullRequestResponse } from './types.ts';

/**
 * A GitHub repository, read and changed through a client: the requests of
 * `GitHubClient` with paths relative to the repository, and the operations
 * the bot runs on any repository.
 */
export class Repository {
	readonly name: string;
	readonly owner: string;
	#client: GitHubClient;

	/**
	 * Binds a client to a repository.
	 *
	 * @param {GitHubClient} client - The client, with its token.
	 * @param {string} name - The repository, as `<owner>/<name>`.
	 */
	constructor(client: GitHubClient, name: string) {
		this.#client = client;
		this.name = name;
		[this.owner] = name.split('/');
	}

	get<T>(path: string): Promise<T> {
		return this.#client.get<T>(this.#url(path));
	}

	/**
	 * Reads an endpoint whose resource may not exist.
	 *
	 * @param {string} path - The endpoint, relative to the repository.
	 * @returns {Promise<T | undefined>} The JSON answer, or `undefined` when
	 *   GitHub answers that the resource doesn't exist.
	 */
	async find<T>(path: string): Promise<T | undefined> {
		try {
			return await this.get<T>(path);
		} catch (error) {
			if (isNotFound(error)) return undefined;
			throw error;
		}
	}

	getAll<T, R = T[]>(path: string, pick?: (data: R) => T[]): Promise<T[]> {
		return this.#client.getAll<T, R>(this.#url(path), pick);
	}

	poll<T>(path: string, options: { isReady: (data: T) => boolean; attempts: number }): Promise<T> {
		return this.#client.poll<T>(this.#url(path), options);
	}

	write<T>(method: WriteMethod, path: string, body?: unknown): Promise<T | undefined> {
		return this.#client.write<T>(method, this.#url(path), body);
	}

	/**
	 * Lists the open PRs of the repository, every page of them.
	 *
	 * @param {object} [filter] - Which open PRs to keep.
	 * @param {string} [filter.head] - The branch the PRs come from, in this
	 *   repository.
	 * @param {string} [filter.base] - The branch the PRs merge into.
	 * @returns {Promise<PullRequestResponse[]>} The open PRs.
	 */
	listOpenPullRequests({ head, base }: { head?: string; base?: string } = {}): Promise<
		PullRequestResponse[]
	> {
		const filters = [
			'state=open',
			// GitHub reads a head without an owner as no filter at all.
			...(head === undefined ? [] : [`head=${this.owner}:${head}`]),
			...(base === undefined ? [] : [`base=${base}`]),
		];
		return this.getAll<PullRequestResponse>(`pulls?${filters.join('&')}`);
	}

	/**
	 * Compares two branches of the repository.
	 *
	 * @param {string} base - The branch to compare with.
	 * @param {string} head - The branch compared to `base`.
	 * @returns {Promise<CompareResponse>} The commits of `head` missing in
	 *   `base`, and their count.
	 */
	compareBranches(base: string, head: string): Promise<CompareResponse> {
		return this.get<CompareResponse>(`compare/${base}...${head}`);
	}

	/**
	 * Counts the commits of a branch that aren't in another.
	 *
	 * @param {string} base - The branch to compare with.
	 * @param {string} head - The branch whose commits are counted.
	 * @returns {Promise<number>} The number of commits of `head` missing in
	 *   `base`.
	 */
	async countCommitsAhead(base: string, head: string): Promise<number> {
		const { ahead_by } = await this.compareBranches(base, head);
		return ahead_by;
	}

	/**
	 * Gets the commit a branch points to.
	 *
	 * @param {string} branch - The branch name.
	 * @returns {Promise<string | undefined>} The commit SHA, or `undefined` when
	 *   the branch doesn't exist.
	 */
	async getBranchSha(branch: string): Promise<string | undefined> {
		const ref = await this.find<{ object: { sha: string } }>(`git/ref/heads/${branch}`);
		return ref?.object.sha;
	}

	/**
	 * Comments on a PR.
	 *
	 * @param {number} prNumber - The number of the PR.
	 * @param {string} body - The comment, in Markdown.
	 */
	async postComment(prNumber: number, body: string) {
		await this.write('POST', `issues/${prNumber}/comments`, { body });
	}

	/**
	 * Adds labels to a PR. The labels it already has stay.
	 *
	 * @param {number} prNumber - The number of the PR.
	 * @param {string[]} labels - The labels to add.
	 */
	async addLabels(prNumber: number, labels: string[]) {
		await this.write('POST', `issues/${prNumber}/labels`, { labels });
	}

	/**
	 * Removes a label from a PR. A label that is already gone is fine.
	 *
	 * @param {number} prNumber - The number of the PR.
	 * @param {string} label - The label to remove.
	 */
	async removeLabel(prNumber: number, label: string) {
		try {
			await this.write('DELETE', `issues/${prNumber}/labels/${label}`);
		} catch (error) {
			if (!isNotFound(error)) throw error;
		}
	}

	/**
	 * Whether a user can write to the repository, from their permission on it.
	 *
	 * @param {string} user - The login of the user.
	 * @returns {Promise<boolean>} `true` for the admin, maintain and write
	 *   permissions. `false` for a user who isn't a collaborator.
	 */
	async canWrite(user: string): Promise<boolean> {
		const answer = await this.find<{ permission: string }>(`collaborators/${user}/permission`);
		// The legacy `permission` field maps `maintain` to `write`,
		// and `triage` to `read`.
		return answer?.permission === 'admin' || answer?.permission === 'write';
	}

	#url(path: string): string {
		return `repos/${this.name}/${path}`;
	}
}
