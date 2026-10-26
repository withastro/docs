import { DOCS_STABLE_BRANCH } from './config.ts';

const MODES = { dryRun: 'dry-run', stableOnly: 'stable-only', all: 'all' } as const;

/**
 * The modes of the bot:
 * - `dry-run`: only comments with the umbrella a PR would join, or why not.
 * - `stable-only`: acts on PRs shipping to the stable branch, dry run for the
 *   others.
 * - `all`: acts on every PR.
 */
export type Mode = (typeof MODES)[keyof typeof MODES];

const ALL_MODES: Mode[] = Object.values(MODES);

/**
 * Reads the bot mode.
 *
 * @param {string} [value] - A `MODE` value. Defaults to dry run.
 * @returns {Mode} The resolved mode.
 * @throws {Error} When `value` isn't a valid mode.
 */
export function parseMode(value: string = MODES.dryRun): Mode {
	const mode = ALL_MODES.find((candidate) => candidate === value);
	if (!mode) throw new Error(`Unknown MODE: ${value}. Expected one of: ${ALL_MODES.join(', ')}.`);
	return mode;
}

/**
 * Whether the mode lets the bot act on the PRs shipping to a branch: join,
 * refuse, and refresh them, instead of a dry run.
 *
 * @param {Mode} mode - The bot mode.
 * @param {string} umbrellaBase - The branch the umbrella PR merges into.
 * @returns {boolean} `true` when the bot acts on these PRs.
 */
export function canActOn(mode: Mode, umbrellaBase: string): boolean {
	return mode === MODES.all || (mode === MODES.stableOnly && umbrellaBase === DOCS_STABLE_BRANCH);
}

/**
 * Whether the bot only comments, without changing PRs.
 *
 * @param {Mode} mode - The bot mode.
 * @returns {boolean} `true` in a dry run.
 */
export function isDryRun(mode: Mode): boolean {
	return mode === MODES.dryRun;
}
