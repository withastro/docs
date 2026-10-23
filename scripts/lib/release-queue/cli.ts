import { isRecord, parseJson } from './github/json.ts';

/** A positive integer, written with digits only. */
const PR_NUMBER = /^[1-9]\d*$/;

export type Action = { type: 'handle'; prNumber: number } | { type: 'refresh' };

/**
 * Chooses what a run does, from an explicit signal.
 *
 * A `workflow_dispatch` event, or `isRefreshRequested` in a local run,
 * refreshes the open umbrellas. Otherwise, the run handles `pr`, or the PR of
 * the event.
 *
 * @param {object} signals - The flags and the event of the run.
 * @param {string} [signals.pr] - The value of `--pr`.
 * @param {boolean} [signals.isRefreshRequested] - Whether `--refresh` was
 *   passed.
 * @param {string} [signals.eventName] - The event that triggered the run.
 * @param {number} [signals.eventPullRequest] - The PR of that event.
 * @returns {Action} The refresh, or the PR to handle.
 * @throws {Error} When both a PR and a refresh are asked for, or when the PR
 *   number is missing or invalid.
 */
export function chooseAction({
	pr,
	isRefreshRequested = false,
	eventName,
	eventPullRequest,
}: {
	pr?: string | undefined;
	isRefreshRequested?: boolean | undefined;
	eventName?: string | undefined;
	eventPullRequest?: number | undefined;
}): Action {
	const shouldRefresh = isRefreshRequested || eventName === 'workflow_dispatch';
	if (shouldRefresh && pr !== undefined) throw new Error('Pass --pr or --refresh, not both.');
	if (shouldRefresh) return { type: 'refresh' };

	const value = pr ?? eventPullRequest?.toString();
	if (value === undefined) throw new Error('No PR to handle: pass --pr <number>.');
	// Digits only: `Number()` would also read `1e3`, `0x10` or ` 7 `.
	if (!PR_NUMBER.test(value)) throw new Error(`Invalid PR number: ${value}. Pass --pr <number>.`);
	return { type: 'handle', prNumber: Number(value) };
}

/** What a run reads from the event of GitHub Actions. */
export interface RunEvent {
	pullRequest?: number | undefined;
	labelSender?: string | undefined;
}

/**
 * Reads the PR number and the login of who added the label from an event.
 *
 * @param {string} json - The content of the event file.
 * @param {string} path - The path of the event file, for the errors.
 * @returns {RunEvent} What the event holds. A `workflow_dispatch` event has
 *   neither field.
 * @throws {Error} When the event isn't a JSON object, or a field is malformed.
 */
export function parseEvent(json: string, path: string): RunEvent {
	const event = parseJson(json, `The event in ${path}`);
	if (!isRecord(event)) throw new Error(`The event in ${path} isn't an object.`);
	return {
		pullRequest: readPullRequestNumber(event.pull_request, path),
		labelSender: readSenderLogin(event.sender, path),
	};
}

function readPullRequestNumber(pullRequest: unknown, path: string): number | undefined {
	if (pullRequest === undefined) return undefined;
	if (isRecord(pullRequest) && Number.isInteger(pullRequest.number)) {
		return Number(pullRequest.number);
	}
	throw new Error(`The event in ${path} has no number in \`pull_request\`.`);
}

function readSenderLogin(sender: unknown, path: string): string | undefined {
	if (sender === undefined) return undefined;
	if (isRecord(sender) && typeof sender.login === 'string') return sender.login;
	throw new Error(`The event in ${path} has no login in \`sender\`.`);
}
