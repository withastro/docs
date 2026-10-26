import type { GitHubClient, WriteMethod } from './client.ts';
import { GitHubError } from './error.ts';
import type { CompareResponse } from './types.ts';

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
		try {
			const { object } = await this.get<{ object: { sha: string } }>(`git/ref/heads/${branch}`);
			return object.sha;
		} catch (error) {
			if (error instanceof GitHubError && error.status === 404) return undefined;
			throw error;
		}
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
	 * Removes a label from a PR. A label that is already gone is fine.
	 *
	 * @param {number} prNumber - The number of the PR.
	 * @param {string} label - The label to remove.
	 */
	async removeLabel(prNumber: number, label: string) {
		try {
			await this.write('DELETE', `issues/${prNumber}/labels/${label}`);
		} catch (error) {
			if (!(error instanceof GitHubError && error.status === 404)) throw error;
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
		try {
			const { permission } = await this.get<{ permission: string }>(
				`collaborators/${user}/permission`
			);
			// The legacy `permission` field maps `maintain` to `write`,
			// and `triage` to `read`.
			return permission === 'admin' || permission === 'write';
		} catch (error) {
			if (error instanceof GitHubError && error.status === 404) return false;
			throw error;
		}
	}

	#url(path: string): string {
		return `repos/${this.name}/${path}`;
	}
}
