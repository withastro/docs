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
 * Sends a request to the GitHub REST API.
 *
 * @param {RequestOptions} options - The token, the method, the endpoint, and the body to send.
 * @returns {Promise<unknown>} The parsed JSON body, or `undefined` for a response without content.
 * @throws {GitHubError} When GitHub answers with an error status.
 * @throws {Error} When a successful response is not JSON.
 */
export async function sendRequest(options: RequestOptions): Promise<unknown> {
	const url = new URL(options.path, API_URL);
	const response = await sendToUrl(url, options);
	return readJsonBody(response, `${options.method} ${url.pathname}`);
}

/**
 * Gets every item of a paginated list from the GitHub REST API.
 *
 * Requests the largest page size, then follows the `next` links one page after
 * the other.
 *
 * @param {Pick<RequestOptions, 'token' | 'path'>} options - The token and the endpoint of the list.
 * @returns {Promise<unknown[]>} The items of all pages, in order.
 * @throws {GitHubError} When GitHub answers with an error status.
 * @throws {Error} When a page is not a JSON list.
 */
export async function getAllPages(options: Pick<RequestOptions, 'token' | 'path'>) {
	const items: unknown[] = [];
	let url: URL | null = getFirstPageUrl(options.path);

	while (url) {
		const requestLine = `GET ${url.pathname}`;
		const response = await sendToUrl(url, { ...options, method: 'GET' });
		const body = await readJsonBody(response, requestLine);
		const page = shape.parseResponse(body, shape.list(shape.unknown), requestLine);
		items.push(...page);
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
			message: `${method} ${url.pathname} failed with ${response.status}: ${details}`,
			status: response.status,
			apiMessage,
		});
	}

	return response;
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
