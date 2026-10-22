import { setTimeout } from 'node:timers/promises';
import { GitHubError } from './github-error.ts';

const API_URL = 'https://api.github.com';
const API_VERSION = '2022-11-28';
const USER_AGENT = 'astro-docs/1.0';
const PAGE_SIZE = 100;
const POLL_DELAY_MS = 2000;

export type WriteMethod = 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/** An error body from GitHub. A validation error details it in `errors`. */
interface ErrorBody {
	message?: string;
	errors?: (string | { message?: string })[];
}

/**
 * A minimal GitHub REST client. Callers declare the shape of the answers they
 * read, which isn't checked: the API version is pinned, and the queries map
 * each answer to the types the bot works with.
 */
export class GitHubClient {
	#token: string;
	#pollDelayMs: number;

	constructor(token: string, { pollDelayMs = POLL_DELAY_MS } = {}) {
		this.#token = token;
		this.#pollDelayMs = pollDelayMs;
	}

	/** Gets `path`, relative to the API root. */
	get<T>(path: string): Promise<T> {
		return this.#request<T>('GET', path);
	}

	/**
	 * Gets `path` until `isReady` accepts the answer, or the attempts run out,
	 * for data GitHub computes in the background. Returns the last answer.
	 */
	async poll<T>(
		path: string,
		{ isReady, attempts }: { isReady: (data: T) => boolean; attempts: number }
	): Promise<T> {
		for (let attempt = 1; ; attempt++) {
			const data = await this.get<T>(path);
			if (isReady(data) || attempt >= attempts) return data;
			await setTimeout(this.#pollDelayMs);
		}
	}

	/**
	 * Gets every page of a list endpoint.
	 *
	 * @param {string} path - The endpoint, relative to the API root.
	 * @param {(data: R) => T[]} [pick] - Extracts the items when the endpoint
	 *   wraps them in an object.
	 */
	async getAll<T, R = T[]>(
		path: string,
		pick: (data: R) => T[] = (data) => data as T[]
	): Promise<T[]> {
		const items: T[] = [];
		const separator = path.includes('?') ? '&' : '?';
		for (let page = 1; ; page++) {
			const pageItems = pick(
				await this.get<R>(`${path}${separator}per_page=${PAGE_SIZE}&page=${page}`)
			);
			items.push(...pageItems);
			if (pageItems.length < PAGE_SIZE) return items;
		}
	}

	/**
	 * Sends a request that changes GitHub. Resolves to `undefined` when GitHub
	 * answers without a body (204), or when the writes are only printed
	 * (`PrintingGitHubClient`).
	 */
	async write<T>(method: WriteMethod, path: string, body?: unknown): Promise<T | undefined> {
		return this.#request<T>(method, path, body);
	}

	async #request<T>(method: string, path: string, body?: unknown): Promise<T> {
		const response = await fetch(`${API_URL}/${path}`, {
			method,
			headers: {
				Accept: 'application/vnd.github+json',
				Authorization: `Bearer ${this.#token}`,
				'User-Agent': USER_AGENT,
				'X-GitHub-Api-Version': API_VERSION,
			},
			body: body === undefined ? undefined : JSON.stringify(body),
		});

		if (response.status === 204) return undefined as T;
		// Error pages from a proxy (e.g. a 502) are HTML.
		const isJson = response.headers.get('content-type')?.includes('application/json');
		const data = isJson ? await response.json() : await response.text();
		if (!response.ok) {
			const reason = (isJson && getErrorReason(data)) || response.statusText;
			throw new GitHubError({
				status: response.status,
				githubReason: reason,
				request: `${method} ${path}`,
			});
		}
		if (!isJson) throw new Error(`${method} ${path} answered ${response.status} without JSON.`);
		return data;
	}
}

/**
 * Gets the reason of an error body, with its details: a 422 only says
 * "Validation Failed" in `message`.
 */
function getErrorReason(body: ErrorBody | null): string | undefined {
	// A proxy could answer JSON that isn't an object.
	if (typeof body !== 'object' || !body?.message) return undefined;
	const errors = Array.isArray(body.errors) ? body.errors : [];
	const details = errors
		.map((error) => (typeof error === 'string' ? error : error?.message))
		.filter((detail) => detail !== undefined);
	return details.length > 0 ? `${body.message}: ${details.join('; ')}` : body.message;
}
