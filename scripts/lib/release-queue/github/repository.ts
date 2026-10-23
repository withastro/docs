import type { GitHubClient, WriteMethod } from './client.ts';
import { GitHubError } from './error.ts';
import type { CompareResponse } from './types.ts';

/**
 * A GitHub repository, read and changed through a client. Its methods are
 * those of `GitHubClient`, with paths relative to the repository.
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

	#url(path: string): string {
		return `repos/${this.name}/${path}`;
	}
}

/**
 * Compares two branches of a repository.
 *
 * @param {Repository} repo - The repository of both branches.
 * @param {string} base - The branch to compare with.
 * @param {string} head - The branch compared to `base`.
 * @returns {Promise<CompareResponse>} The commits of `head` missing in `base`.
 */
export function compareBranches(
	repo: Repository,
	base: string,
	head: string
): Promise<CompareResponse> {
	return repo.get<CompareResponse>(`compare/${base}...${head}`);
}

/**
 * Removes a label from a PR. A label that is already gone is fine.
 *
 * @param {Repository} repo - The repository of the PR.
 * @param {number} prNumber - The number of the PR.
 * @param {string} label - The label to remove.
 */
export async function removeLabel(repo: Repository, prNumber: number, label: string) {
	try {
		await repo.write('DELETE', `issues/${prNumber}/labels/${label}`);
	} catch (error) {
		if (!(error instanceof GitHubError && error.status === 404)) throw error;
	}
}
