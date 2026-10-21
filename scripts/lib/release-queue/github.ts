import { setTimeout } from 'node:timers/promises';

const PAGE_SIZE = 100;
const POLL_DELAY_MS = 2000;

export class GitHubError extends Error {
	name = 'GitHubError';
	readonly status: number;
	/** The reason GitHub gives, without the request. */
	readonly reason: string;

	constructor({ status, reason, request }: { status: number; reason: string; request: string }) {
		super(`${request} failed (${status}): ${reason}`);
		this.status = status;
		this.reason = reason;
	}
}

type WriteMethod = 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/** An error body from GitHub. A validation error details it in `errors`. */
interface ErrorBody {
	message?: string;
	errors?: (string | { message?: string })[];
}

/**
 * A minimal GitHub REST client. It can print the requests that change GitHub
 * instead of sending them.
 */
export class GitHubClient {
	#token: string;
	#shouldPrintWrites: boolean;
	#pollDelayMs: number;

	constructor(token: string, { shouldPrintWrites = false, pollDelayMs = POLL_DELAY_MS } = {}) {
		this.#token = token;
		this.#shouldPrintWrites = shouldPrintWrites;
		this.#pollDelayMs = pollDelayMs;
	}

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
	 * @param pick Extracts the items when the endpoint wraps them in an object.
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
	 * Sends a request that changes GitHub. Resolves to `undefined` when the
	 * request was only printed, or when GitHub answers without a body (204).
	 */
	async write<T>(method: WriteMethod, path: string, body?: unknown): Promise<T | undefined> {
		if (this.#shouldPrintWrites) {
			console.info(`[print] ${method} ${path}`);
			if (body) console.info(JSON.stringify(body, null, 2));
			return undefined;
		}
		return this.#request<T>(method, path, body);
	}

	async #request<T>(method: string, path: string, body?: unknown): Promise<T> {
		const res = await fetch(`https://api.github.com/${path}`, {
			method,
			headers: {
				Accept: 'application/vnd.github+json',
				Authorization: `Bearer ${this.#token}`,
				'User-Agent': 'astro-docs/1.0',
				'X-GitHub-Api-Version': '2022-11-28',
			},
			body: body === undefined ? undefined : JSON.stringify(body),
		});

		if (res.status === 204) return undefined as T;
		// Error pages from a proxy (e.g. a 502) are HTML.
		const isJson = res.headers.get('content-type')?.includes('application/json');
		const data = isJson ? await res.json() : await res.text();
		if (!res.ok) {
			const reason = (isJson && getErrorReason(data)) || res.statusText;
			throw new GitHubError({ status: res.status, reason, request: `${method} ${path}` });
		}
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
