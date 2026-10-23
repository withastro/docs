import { setTimeout } from 'node:timers/promises';
import { GitHubError } from './error.ts';
import { isRecord, parseJson } from './json.ts';

const API_URL = 'https://api.github.com';
const API_VERSION = '2022-11-28';
const USER_AGENT = 'astro-docs/1.0';
const PAGE_SIZE = 100;
const POLL_DELAY_MS = 2000;

export type WriteMethod = 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/**
 * A minimal GitHub REST client.
 *
 * Callers declare the shape of the answers they read, which isn't checked:
 * the API version is pinned, and the queries map each answer to the types the
 * bot works with.
 */
export class GitHubClient {
	#token: string;
	#pollDelayMs: number;

	/**
	 * Creates a client that authenticates with a token.
	 *
	 * @param {string} token - The token sent with each request.
	 * @param {object} [options] - How the client waits.
	 * @param {number} [options.pollDelayMs] - The delay between two reads of
	 *   `poll`. Two seconds by default.
	 */
	constructor(token: string, { pollDelayMs = POLL_DELAY_MS } = {}) {
		this.#token = token;
		this.#pollDelayMs = pollDelayMs;
	}

	/**
	 * Reads an endpoint.
	 *
	 * @param {string} path - The endpoint, relative to the API root.
	 * @returns {Promise<T>} The JSON answer.
	 * @throws {GitHubError} When GitHub answers with an error.
	 */
	get<T>(path: string): Promise<T> {
		return this.#request<T>('GET', path);
	}

	/**
	 * Reads an endpoint until its answer is ready, for data GitHub computes in
	 * the background.
	 *
	 * @param {string} path - The endpoint, relative to the API root.
	 * @param {object} options - When to stop.
	 * @param {(data: T) => boolean} options.isReady - Whether an answer is ready.
	 * @param {number} options.attempts - How many times to read at most.
	 * @returns {Promise<T>} The first ready answer, or the last one once the
	 *   attempts run out.
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
	 * @returns {Promise<T[]>} The items of every page.
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
	 * Sends a request that changes GitHub.
	 *
	 * @param {WriteMethod} method - The HTTP method.
	 * @param {string} path - The endpoint, relative to the API root.
	 * @param {unknown} [body] - The JSON body of the request.
	 * @returns {Promise<T | undefined>} The JSON answer. `undefined` when GitHub
	 *   answers without a body, or when `PrintingGitHubClient` only prints the
	 *   request.
	 * @throws {GitHubError} When GitHub answers with an error.
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

		const request = `${method} ${path}`;
		if (response.status === 204) return undefined as T;
		// Error pages from a proxy, such as a 502, are HTML.
		const isJson = response.headers.get('content-type')?.includes('application/json');
		const text = await response.text();
		if (!response.ok) {
			const reason = (isJson && getErrorReason(text)) || response.statusText;
			throw new GitHubError({ status: response.status, githubReason: reason, request });
		}
		if (!isJson) throw new Error(`${request} answered ${response.status} without JSON.`);
		return parseJson(text, request) as T;
	}
}

/**
 * A GitHub client that prints the requests that change GitHub instead of
 * sending them, for local runs. Reads still go to GitHub.
 */
export class PrintingGitHubClient extends GitHubClient {
	override async write<T>(
		method: WriteMethod,
		path: string,
		body?: unknown
	): Promise<T | undefined> {
		console.info(`[print] ${method} ${path}`);
		if (body) console.info(JSON.stringify(body, null, 2));
		return undefined;
	}
}

/**
 * Gets the reason of an error body, with its details: a 422 only says
 * "Validation Failed" in `message`, and details it in `errors`.
 */
function getErrorReason(text: string): string | undefined {
	const body = parseErrorBody(text);
	if (!isRecord(body) || typeof body.message !== 'string' || !body.message) return undefined;
	const errors = Array.isArray(body.errors) ? body.errors : [];
	const details = errors
		.map((error: unknown) => (typeof error === 'string' ? error : readErrorMessage(error)))
		.filter((detail) => detail !== undefined);
	return details.length > 0 ? `${body.message}: ${details.join('; ')}` : body.message;
}

/** Parses an error body. A malformed one has no reason to read. */
function parseErrorBody(text: string): unknown {
	try {
		return JSON.parse(text);
	} catch {
		return undefined;
	}
}

function readErrorMessage(error: unknown): string | undefined {
	return isRecord(error) && typeof error.message === 'string' ? error.message : undefined;
}
