import { getOctokit } from '@actions/github';
import type { Octokit } from './repository.ts';

/**
 * A response GitHub would send, with a status, a JSON body, and headers such
 * as `link` for the next page.
 */
type FakeResponse = { status: number; body?: unknown; headers?: Record<string, string> };

/** A request Octokit sent, as `METHOD /path?query`, with its JSON body. */
type SentRequest = { route: string; body: unknown };

/**
 * Creates a real Octokit client whose requests reach a fake GitHub.
 *
 * A route given a list of responses answers with each in turn, then repeats
 * the last.
 *
 * @param {Record<string, FakeResponse | FakeResponse[]>} responses - The response to each request, by `METHOD /path?query`. Other requests get a 404.
 * @returns {{ octokit: Octokit; requests: SentRequest[] }} The client, and the requests it sent, in order.
 */
export function createFakeOctokit(responses: Record<string, FakeResponse | FakeResponse[]>): {
	octokit: Octokit;
	requests: SentRequest[];
} {
	const requests: SentRequest[] = [];
	const fetch = async (url: string, init: RequestInit) => {
		const { pathname, search } = new URL(url);
		const route = `${init.method} ${decodeURIComponent(pathname)}${search}`;
		requests.push({ route, body: init.body ? JSON.parse(String(init.body)) : undefined });

		const sentCount = requests.filter((request) => request.route === route).length;
		const { status, body, headers } = pickResponse(responses[route], sentCount);
		const response = new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: { 'content-type': 'application/json', ...headers },
		});
		// As `fetch` sets it. Octokit reads it to paginate.
		Object.defineProperty(response, 'url', { value: url });
		return response;
	};
	return { octokit: getOctokit('fake-token', { request: { fetch } }), requests };
}

/** Picks the response to the nth request of a route, counted from 1. */
function pickResponse(
	response: FakeResponse | FakeResponse[] | undefined,
	sentCount: number
): FakeResponse {
	if (!response) return { status: 404, body: { message: 'Not Found' } };
	if (!Array.isArray(response)) return response;
	return response[Math.min(sentCount, response.length) - 1];
}
