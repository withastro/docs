const NOT_FOUND_STATUS = 404;

type GitHubErrorOptions = {
	/** The request that failed, with GitHub's reason. */
	message: string;
	status: number;
	apiMessage: string;
	reason?: string;
	/** Octokit's error, when there is one. */
	cause?: unknown;
};

/** GitHub answered with an error status. */
export class GitHubError extends Error {
	readonly status: number;
	/** The `message` field of GitHub's error body, or the error message. */
	readonly apiMessage: string;
	/**
	 * GitHub's reason: its message, then the message of each error it lists,
	 * such as why a pull request can't be opened.
	 */
	readonly reason: string;

	constructor({ message, status, apiMessage, reason = apiMessage, cause }: GitHubErrorOptions) {
		super(message, { cause });
		this.name = 'GitHubError';
		this.status = status;
		this.apiMessage = apiMessage;
		this.reason = reason;
	}

	/** Whether GitHub answered that the resource does not exist. */
	get isNotFound(): boolean {
		return this.status === NOT_FOUND_STATUS;
	}
}

/**
 * Sends a request, and turns Octokit's error for an error status into a
 * `GitHubError`.
 *
 * @param {() => Promise<T>} request - The Octokit call.
 * @returns {Promise<T>} Octokit's response.
 * @throws {GitHubError} When GitHub answers with an error status.
 */
export async function send<T>(request: () => Promise<T>): Promise<T> {
	try {
		return await request();
	} catch (error) {
		throw toGitHubError(error);
	}
}

/**
 * Reads Octokit's `RequestError` by its fields: the class `actions/github-script`
 * bundles is not the one a local run imports.
 */
function toGitHubError(error: unknown) {
	if (error instanceof GitHubError) return error;
	if (!(error instanceof Error) || !('status' in error) || typeof error.status !== 'number') {
		return error;
	}

	const body = readErrorBody(error);
	const apiMessage = body?.message ?? error.message;
	const reason = [apiMessage, ...(body?.listedErrors ?? [])].join('; ');
	const requestLine = readRequestLine(error);
	return new GitHubError({
		message: requestLine ? `${requestLine} failed with ${error.status}: ${reason}` : error.message,
		status: error.status,
		apiMessage,
		reason,
		cause: error,
	});
}

/** Reads GitHub's message, and the message of each error it lists, as in a 422. */
function readErrorBody(error: Error) {
	const data = readField(readField(error, 'response'), 'data');
	const message = readField(data, 'message');
	if (typeof message !== 'string') return null;

	const errors = readField(data, 'errors');
	return { message, listedErrors: Array.isArray(errors) ? errors.map(formatListedError) : [] };
}

function formatListedError(error: unknown) {
	if (typeof error === 'string') return error;
	const message = readField(error, 'message');
	return typeof message === 'string' ? message : JSON.stringify(error);
}

/** Reads the method and the path of the request that failed, as `PUT /repos/…/merge`. */
function readRequestLine(error: Error) {
	const request = readField(error, 'request');
	const method = readField(request, 'method');
	const url = readField(request, 'url');
	if (typeof method !== 'string' || typeof url !== 'string') return null;
	return `${method} ${new URL(url).pathname}`;
}

function readField(value: unknown, field: string): unknown {
	return value !== null && typeof value === 'object' ? Reflect.get(value, field) : undefined;
}
