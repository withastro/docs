/**
 * An error answer from the GitHub API. `githubReason` is the reason GitHub
 * gives, with its details.
 */
export class GitHubError extends Error {
	name = 'GitHubError';
	readonly status: number;
	readonly githubReason: string;

	constructor({
		status,
		githubReason,
		request,
	}: {
		status: number;
		githubReason: string;
		request: string;
	}) {
		super(`${request} failed (${status}): ${githubReason}`);
		this.status = status;
		this.githubReason = githubReason;
	}
}
