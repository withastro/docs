import { isRecord, parseJson } from './json.ts';

export type Action = { type: 'handle'; prNumber: number } | { type: 'refresh' };

/**
 * Chooses what a run does, from an explicit signal: a refresh of the open
 * umbrellas (`workflow_dispatch`, or `--refresh` locally), or a PR to handle
 * (`--pr`, or the PR of the `labeled` event). A missing or invalid PR number
 * is an error, not a refresh.
 */
export function chooseAction({
	pr,
	refresh = false,
	eventName,
	eventPullRequest,
}: {
	pr?: string | undefined;
	refresh?: boolean | undefined;
	eventName?: string | undefined;
	eventPullRequest?: number | undefined;
}): Action {
	const shouldRefresh = refresh || eventName === 'workflow_dispatch';
	if (shouldRefresh && pr !== undefined) throw new Error('Pass --pr or --refresh, not both.');
	if (shouldRefresh) return { type: 'refresh' };

	const value = pr ?? eventPullRequest?.toString();
	if (value === undefined) throw new Error('No PR to handle: pass --pr <number>.');
	// Only digits: `Number()` would also read `1e3`, `0x10` or ` 7 `.
	if (!/^\d+$/.test(value) || Number(value) === 0) {
		throw new Error(`Invalid PR number: ${value}. Pass --pr <number>.`);
	}
	return { type: 'handle', prNumber: Number(value) };
}

/** What a run reads from the event of GitHub Actions. */
export interface RunEvent {
	pullRequest?: number | undefined;
	/** Who added the label. */
	sender?: string | undefined;
}

/**
 * Reads the PR number and the sender from the event file at `path`. A
 * `workflow_dispatch` event has neither.
 */
export function parseEvent(json: string, path: string): RunEvent {
	const event = parseJson(json, `The event in ${path}`);
	if (!isRecord(event)) throw new Error(`The event in ${path} isn't an object.`);
	return {
		pullRequest: readPullRequestNumber(event.pull_request, path),
		sender: readSenderLogin(event.sender, path),
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
