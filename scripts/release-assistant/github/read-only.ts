import type { Octokit } from './repository.ts';

/** The methods that only read. Octokit sends every page of a list with `GET`. */
const READ_METHODS = ['GET', 'HEAD'];
/**
 * Makes an Octokit client read-only. It sends reads, and logs each write as
 * `Read-only: <METHOD> <path> <JSON body>` instead of sending it.
 *
 * @param {Octokit} octokit - The client to make read-only.
 * @param {(message: string) => void} log - Receives one line for each write.
 */
export function addReadOnlyHook(octokit: Octokit, log: (message: string) => void): void {
	octokit.hook.wrap('request', async (request, options) => {
		if (READ_METHODS.includes(options.method)) return request(options);

		const { method, url, body } = octokit.request.endpoint(options);
		const { pathname } = new URL(url);
		log(`Read-only: ${method} ${pathname} ${JSON.stringify(body ?? null)}`);
		return { status: 200, url, headers: {}, data: {} };
	});
}
