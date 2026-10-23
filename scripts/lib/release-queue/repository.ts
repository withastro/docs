import type { GitHubClient, WriteMethod } from './github.ts';
import type { Mode } from './modes.ts';

/** The docs repository, and the framework repository for its release PRs. */
export interface Repositories {
	docs: Repository;
	framework: Repository;
}

/** What the bot runs with, whether it handles a PR or refreshes umbrellas. */
export interface QueueOptions {
	/**
	 * The docs repository through `GITHUB_TOKEN`: reads the PR, posts dry-run
	 * comments, and submits merge-block reviews.
	 */
	actions: Repository;
	/** The docs repository as the bot account: joins, refuses, and refreshes. */
	bot: Repository;
	/** The framework repository, read for its release PRs. */
	framework: Repository;
	mode: Mode;
}

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
