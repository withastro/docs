import { getOctokit } from '@actions/github';
import type { Octokit } from './repository.ts';

/** A response GitHub would send, with a status and a JSON body. */
type FakeResponse = { status: number; body?: unknown };

/** A request Octokit sent, as `METHOD /path?query`, with its JSON body. */
type SentRequest = { route: string; body: unknown };

/**
 * Creates a real Octokit client whose requests reach a fake GitHub.
 *
 * @param {Record<string, FakeResponse>} responses - The response to each request, by `METHOD /path?query`. Other requests get a 404.
 * @returns {{ octokit: Octokit; requests: SentRequest[] }} The client, and the requests it sent, in order.
 */
export function createFakeOctokit(responses: Record<string, FakeResponse>): {
	octokit: Octokit;
	requests: SentRequest[];
} {
	const requests: SentRequest[] = [];
	const fetch = async (url: string, init: RequestInit) => {
		const { pathname, search } = new URL(url);
		const route = `${init.method} ${decodeURIComponent(pathname)}${search}`;
		requests.push({ route, body: init.body ? JSON.parse(String(init.body)) : undefined });

		const { status, body } = responses[route] ?? { status: 404, body: { message: 'Not Found' } };
		return new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: { 'content-type': 'application/json' },
		});
	};
	return { octokit: getOctokit('fake-token', { request: { fetch } }), requests };
}
