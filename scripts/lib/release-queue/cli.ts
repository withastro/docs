import { isRecord, parseJson } from './formats/json.ts';
import type { LabeledPullRequest } from './handle-accepted.ts';

/** A positive integer, written with digits only. */
const PR_NUMBER = /^[1-9]\d*$/;

type Action = ({ type: 'handle' } & LabeledPullRequest) | { type: 'refresh' };

/**
 * Chooses what a run does. A `workflow_dispatch` event, or
 * `--preview-refresh` in a local run, refreshes the open umbrellas. Otherwise,
 * the run handles a PR. For the PR and its sender, a flag wins over the event.
 *
 * @param {object} signals - The flags and the event of the run.
 * @param {string} [signals.pr] - The value of `--pr`.
 * @param {string} [signals.sender] - The value of `--sender`.
 * @param {boolean} [signals.isRefreshRequested] - Whether
 *   `--preview-refresh` was passed.
 * @param {string} [signals.eventName] - The event that triggered the run.
 * @param {number} [signals.eventPullRequest] - The PR of that event.
 * @param {string} [signals.eventSender] - Who triggered that event.
 * @param {boolean} [signals.isSenderRequired] - Whether the write access
 *   check must run, as in GitHub Actions.
 * @returns {Action} The refresh, or the PR to handle with who labeled it.
 * @throws {Error} When both a PR and a refresh are asked for, when the PR
 *   number is missing or invalid, or when a required sender is missing.
 */
export function chooseAction({
	pr,
	sender,
	isRefreshRequested = false,
	eventName,
	eventPullRequest,
	eventSender,
	isSenderRequired = false,
}: {
	pr?: string | undefined;
	sender?: string | undefined;
	isRefreshRequested?: boolean | undefined;
	eventName?: string | undefined;
	eventPullRequest?: number | undefined;
	eventSender?: string | undefined;
	isSenderRequired?: boolean | undefined;
}): Action {
	const shouldRefresh = isRefreshRequested || eventName === 'workflow_dispatch';
	if (shouldRefresh && pr !== undefined)
		throw new Error('Pass --pr or --preview-refresh, not both.');
	if (shouldRefresh) return { type: 'refresh' };

	const rawPrNumber = pr ?? eventPullRequest?.toString();
	if (rawPrNumber === undefined) throw new Error('No PR to handle: pass --pr <number>.');
	// Digits only: `Number()` would also read `1e3`, `0x10` or ` 7 `.
	if (!PR_NUMBER.test(rawPrNumber)) {
		throw new Error(`Invalid PR number: ${rawPrNumber}. Pass --pr <number>.`);
	}

	const labelSender = sender ?? eventSender;
	if (labelSender === undefined && isSenderRequired) {
		throw new Error('The event has no sender: the write access check needs one.');
	}
	return { type: 'handle', prNumber: Number(rawPrNumber), labelSender };
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
 * @returns {RunEvent} What the event holds.
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
