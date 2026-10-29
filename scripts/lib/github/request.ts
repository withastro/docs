import * as shape from './shape.ts';

const API_URL = 'https://api.github.com';
const API_VERSION = '2026-03-10';
const USER_AGENT = 'astro-docs/1.0';
export const MAX_PAGE_SIZE = 100;
const NO_CONTENT_STATUS = 204;
const NOT_FOUND_STATUS = 404;
const NEXT_PAGE_LINK = /<([^>]+)>;\s*rel="next"/;

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

type RequestOptions = {
	token: string;
	method: HttpMethod;
	/** The endpoint, starting with a slash, with its query string if any. */
	path: string;
	body?: Record<string, unknown>;
};

type GitHubErrorOptions = {
	/** What failed, with the details GitHub gave. */
	message: string;
	status: number;
	apiMessage: string;
};

/** An error answer from the GitHub API. */
export class GitHubError extends Error {
	/** The HTTP status of the response. */
	readonly status: number;
	/** The `message` field of GitHub's error body, or the status text. */
	readonly apiMessage: string;

	/**
	 * @param {GitHubErrorOptions} options - What failed, and how GitHub answered.
	 */
	constructor({ message, status, apiMessage }: GitHubErrorOptions) {
		super(message);
		this.name = 'GitHubError';
		this.status = status;
		this.apiMessage = apiMessage;
	}

	/** Whether GitHub answered that the resource does not exist. */
	get isNotFound(): boolean {
		return this.status === NOT_FOUND_STATUS;
	}
}

/**
 * Sends a request to the GitHub REST API, and reads its response with a shape.
 *
 * @param {RequestOptions} options - What to send, and where.
 * @param {shape.Shape<T>} responseShape - The expected shape of the body. A response without
 * content reads as `undefined`.
 * @returns {Promise<T>} A copy of the body with only the fields of the shape.
 * @throws {GitHubError} When GitHub answers with an error status.
 * @throws {Error} When a successful response is not JSON.
 * @throws {Error} When the body does not match the shape.
 */
export async function sendRequest<T>(
	options: RequestOptions,
	responseShape: shape.Shape<T>
): Promise<T> {
	const url = new URL(options.path, API_URL);
	const response = await sendToUrl(url, options);
	return readBody(response, responseShape, formatRequestLine(options.method, url));
}

/**
 * Gets every item of a paginated list from the GitHub REST API.
 *
 * Requests the largest page size, then follows the `next` links one page after
 * the other.
 *
 * @param {Pick<RequestOptions, 'token' | 'path'>} options - Where the list is.
 * @param {shape.Shape<T>} itemShape - The expected shape of each item.
 * @returns {Promise<T[]>} The items of all pages, in order, each with only the fields of the shape.
 * @throws {GitHubError} When GitHub answers with an error status.
 * @throws {Error} When a page is not a JSON list.
 * @throws {Error} When an item does not match the shape.
 */
export async function getAllPages<T>(
	options: Pick<RequestOptions, 'token' | 'path'>,
	itemShape: shape.Shape<T>
): Promise<T[]> {
	const items: T[] = [];
	let url: URL | null = getFirstPageUrl(options.path);

	while (url) {
		const response = await sendToUrl(url, { ...options, method: 'GET' });
		items.push(...(await readBody(response, shape.list(itemShape), formatRequestLine('GET', url))));
		url = getNextPageUrl(response);
	}

	return items;
}

async function sendToUrl(url: URL, { token, method, body }: Omit<RequestOptions, 'path'>) {
	const response = await fetch(url.href, {
		method,
		body: body ? JSON.stringify(body) : undefined,
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			'User-Agent': USER_AGENT,
			'X-GitHub-Api-Version': API_VERSION,
		},
	});

	if (!response.ok) {
		const { apiMessage, details } = await readErrorBody(response);
		throw new GitHubError({
			message: `${formatRequestLine(method, url)} failed with ${response.status}: ${details}`,
			status: response.status,
			apiMessage,
		});
	}

	return response;
}

/** The method and the path of a request, without its query, to name it in errors. */
function formatRequestLine(method: HttpMethod, url: URL) {
	return `${method} ${url.pathname}`;
}

async function readBody<T>(
	response: Response,
	bodyShape: shape.Shape<T>,
	requestLine: string
): Promise<T> {
	const body = await readJsonBody(response, requestLine);
	try {
		return bodyShape(body, '');
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		throw new Error(`Unexpected response from ${requestLine}: ${reason}`, { cause: error });
	}
}

async function readJsonBody(response: Response, requestLine: string): Promise<unknown> {
	if (response.status === NO_CONTENT_STATUS) return undefined;

	const contentType = response.headers.get('Content-Type');
	if (!contentType?.includes('application/json')) {
		throw new Error(`Expected a JSON response from ${requestLine}, got ${contentType}.`);
	}

	return response.json();
}

/** Reads the message and the validation errors GitHub sends with an error status. */
async function readErrorBody(response: Response) {
	const body: unknown = await response.json().catch(() => null);
	if (!shape.isRecord(body) || typeof body.message !== 'string') {
		return { apiMessage: response.statusText, details: response.statusText };
	}

	const errors = Array.isArray(body.errors) ? body.errors.map(formatValidationError) : [];
	return { apiMessage: body.message, details: [body.message, ...errors].join('; ') };
}

function formatValidationError(error: unknown) {
	return shape.isRecord(error) && typeof error.message === 'string'
		? error.message
		: JSON.stringify(error);
}

function getFirstPageUrl(path: string) {
	const url = new URL(path, API_URL);
	url.searchParams.set('per_page', String(MAX_PAGE_SIZE));
	return url;
}

function getNextPageUrl(response: Response) {
	const nextUrl = response.headers.get('Link')?.match(NEXT_PAGE_LINK)?.[1];
	return nextUrl ? new URL(nextUrl) : null;
}
