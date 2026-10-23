/** An error answer from the GitHub API. */
export class GitHubError extends Error {
	name = 'GitHubError';
	readonly status: number;
	readonly githubReason: string;

	/**
	 * Creates the error of a failed request.
	 *
	 * @param {object} answer - The failed request and GitHub's answer.
	 * @param {number} answer.status - The HTTP status of the answer.
	 * @param {string} answer.githubReason - The reason GitHub gives, with its
	 *   details.
	 * @param {string} answer.request - The method and the path of the request.
	 */
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
