const PAGE_SIZE = 100;

export class GitHubError extends Error {
	name = 'GitHubError';
	readonly status: number;

	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

type WriteMethod = 'POST';

/**
 * A minimal GitHub REST client. It can print the requests that change GitHub
 * instead of sending them.
 */
export class GitHubClient {
	#token: string;
	#shouldPrintWrites: boolean;

	constructor(token: string, { shouldPrintWrites = false } = {}) {
		this.#token = token;
		this.#shouldPrintWrites = shouldPrintWrites;
	}

	get<T>(path: string): Promise<T> {
		return this.#request<T>('GET', path);
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
			const message = isJson ? data?.message : res.statusText;
			throw new GitHubError(res.status, `${method} ${path} failed (${res.status}): ${message}`);
		}
		return data;
	}
}
