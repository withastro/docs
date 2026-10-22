import { MAIN_BRANCH } from './config.ts';
import type { Repository } from './repository.ts';

const MODES = { dryRun: 'dry-run', mainOnly: 'main-only', all: 'all' } as const;

/**
 * The modes of the bot, from the most cautious:
 * - `dry-run`: only comments with the umbrella a PR would join, or why not.
 * - `main-only`: acts on PRs shipping to `main`, dry run for the others.
 * - `all`: acts on every PR.
 */
export type Mode = (typeof MODES)[keyof typeof MODES];

const ALL_MODES: Mode[] = Object.values(MODES);

/** What the bot runs with, whether it handles a PR or refreshes umbrellas. */
export interface QueueOptions {
	/**
	 * The docs repository as `github-actions[bot]`: reads the PR, posts dry-run
	 * comments, and submits merge-block reviews.
	 */
	actions: Repository;
	/** The docs repository as the bot account: joins, refuses, and refreshes. */
	bot: Repository;
	/** `withastro/astro`, read for its release PRs. */
	framework: Repository;
	mode: Mode;
}

/** Reads `MODE`, a dry run when it isn't set. */
export function parseMode(value: string = MODES.dryRun): Mode {
	const mode = ALL_MODES.find((candidate) => candidate === value);
	if (!mode) throw new Error(`Unknown MODE: ${value}. Expected one of: ${ALL_MODES.join(', ')}.`);
	return mode;
}

/** Whether the bot changes PRs shipping to `target`, rather than a dry run. */
export function isLiveFor(mode: Mode, target: string): boolean {
	return mode === MODES.all || (mode === MODES.mainOnly && target === MAIN_BRANCH);
}

/**
 * Whether the bot token is required. Without it, merges would go through
 * `GITHUB_TOKEN`, and the umbrella PR would stop getting CI.
 */
export function needsBotToken(mode: Mode, shouldWrite: boolean): boolean {
	return mode !== MODES.dryRun && shouldWrite;
}
