import type { GitHubClient } from './github.ts';
import { MAIN_BRANCH } from './routing.ts';

/**
 * - `dry-run`: only comments with the umbrella a PR would join, or why not.
 * - `main-only`: acts on PRs shipping to `main`, dry run for the others.
 * - `all`: acts on every PR.
 */
export const MODES = ['dry-run', 'main-only', 'all'] as const;

export type Mode = (typeof MODES)[number];

/** What the bot runs with, whether it handles a PR or refreshes umbrellas. */
export interface QueueOptions {
	/**
	 * Reads the PR and the release PR, and posts dry-run comments, as
	 * `github-actions[bot]`.
	 */
	actionsClient: GitHubClient;
	/** Joins, refuses, and refreshes as the bot account, reads included. */
	botClient: GitHubClient;
	repo: string;
	mode: Mode;
}

export function parseMode(value = 'dry-run'): Mode {
	const mode = MODES.find((candidate) => candidate === value);
	if (!mode) throw new Error(`Unknown MODE: ${value}. Expected one of: ${MODES.join(', ')}.`);
	return mode;
}

/** Whether the bot changes PRs shipping to `target`, rather than a dry run. */
export function isLiveFor(mode: Mode, target: string): boolean {
	return mode === 'all' || (mode === 'main-only' && target === MAIN_BRANCH);
}

/**
 * Whether the bot token is required. Without it, merges would go through
 * `GITHUB_TOKEN`, and the umbrella PR would stop getting CI.
 */
export function needsBotToken(mode: Mode, shouldWrite: boolean): boolean {
	return mode !== 'dry-run' && shouldWrite;
}
