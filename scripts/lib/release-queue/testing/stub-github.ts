import type { TestContext } from 'node:test';
import { isRecord } from '../formats/json.ts';
import { GitHubClient, PrintingGitHubClient } from '../github/client.ts';
import { Repository } from '../github/repository.ts';
import { REPO } from './fixtures.ts';

const API_URL = 'https://api.github.com/';

/** A request that changes GitHub, as tests compare them. */
export interface Write {
	method: string;
	path: string;
	body?: unknown;
}

/**
 * Reads the text of a write that sends one, such as a comment, a review, or a
 * PR description.
 */
export function readBody(write: Write | undefined): string {
	const body = write?.body;
	if (isRecord(body) && typeof body.body === 'string') return body.body;
	throw new Error(`No body text in the write: ${JSON.stringify(write)}`);
}

export interface Call extends Write {
	/** The token of the client that sent the request. */
	token: string;
}

/** An error response, or an `Error` that makes `fetch` reject. */
export type Failure = { status: number; message: string; errors?: unknown[] } | Error;

export interface StubOptions {
	/**
	 * Answers to GET requests, by path, without the paging parameters. Other
	 * paths answer with a 404. A function is called on each request, for
	 * answers that change over time. Lists must have fewer than 100 items: the
	 * stub answers one page (paging is tested in `github/client.test.ts`).
	 */
	getResponses?: Record<string, unknown>;
	/** JSON answers to writes, by `<method> <path>`. Others answer with a 204. */
	writeResults?: Record<string, unknown>;
	/**
	 * Failures of writes, by `<method> <path>`, or by
	 * `<method> <path> <JSON body>` to fail only the write with that body.
	 */
	writeFailures?: Record<string, Failure>;
}

export const json = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json; charset=utf-8' },
	});

/** Keeps `body` only when there is one, so `deepEqual` can omit it. */
const toWrite = (method: string, path: string, body: unknown): Write =>
	body === undefined ? { method, path } : { method, path, body };

/** Splits the paging parameters that `getAll` adds from the path. */
function parseUrl(url: string): { path: string; page: number } {
	const [pathname, query] = url.slice(API_URL.length).split('?');
	const params = query?.split('&') ?? [];
	const page = params.find((param) => param.startsWith('page='))?.slice('page='.length);
	const rest = params.filter((param) => !/^(per_)?page=/.test(param));
	return {
		path: rest.length > 0 ? `${pathname}?${rest.join('&')}` : pathname,
		page: Number(page ?? 1),
	};
}

/**
 * Replaces `fetch`, for the length of the test, with a GitHub API answering
 * from fixed data, and records every request.
 */
export function stubGitHub(
	t: TestContext,
	{ getResponses = {}, writeResults = {}, writeFailures = {} }: StubOptions = {}
) {
	const calls: Call[] = [];

	t.mock.method(globalThis, 'fetch', async (url: string, init: RequestInit = {}) => {
		const method = init.method ?? 'GET';
		const { path, page } = parseUrl(url);
		const token = new Headers(init.headers).get('authorization')?.replace('Bearer ', '') ?? '';
		const body = typeof init.body === 'string' ? JSON.parse(init.body) : undefined;
		calls.push({ ...toWrite(method, path, body), token });

		if (method === 'GET') {
			if (page > 1) throw new Error(`The stub answers one page: shorten the list of ${path}.`);
			if (!(path in getResponses)) return json({ message: 'Not Found' }, 404);
			const response = getResponses[path];
			return json(typeof response === 'function' ? response() : response);
		}
		const key = `${method} ${path}`;
		const failure = writeFailures[`${key} ${JSON.stringify(body)}`] ?? writeFailures[key];
		if (failure instanceof Error) throw failure;
		if (failure) return json({ message: failure.message, errors: failure.errors }, failure.status);
		return key in writeResults ? json(writeResults[key]) : new Response(null, { status: 204 });
	});

	const writesBy = (token?: string): Write[] =>
		calls
			.filter((call) => call.method !== 'GET' && (token === undefined || call.token === token))
			.map((call) => toWrite(call.method, call.path, call.body));

	return {
		calls,
		/** The writes, without their token, in order. */
		get writes() {
			return writesBy();
		},
		/** The writes of the client using `token`. */
		writesBy,
		countReads: (path: string) =>
			calls.filter((call) => call.method === 'GET' && call.path === path).length,
		/** A client of the stubbed API, which doesn't wait between polls. */
		client: (token = 'token') => new GitHubClient(token, { pollDelayMs: 0 }),
		/** A repository of the stubbed API, which doesn't wait between polls. */
		repository: (name = REPO, { token = 'token', shouldPrintWrites = false } = {}) => {
			const Client = shouldPrintWrites ? PrintingGitHubClient : GitHubClient;
			return new Repository(new Client(token, { pollDelayMs: 0 }), name);
		},
	};
}
