import { GitHubClient, type WriteMethod } from './client.ts';

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
