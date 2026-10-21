export type Action = { type: 'handle'; number: number } | { type: 'refresh' };

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
	return { type: 'handle', number: Number(value) };
}
