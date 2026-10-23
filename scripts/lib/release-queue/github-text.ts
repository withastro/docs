// The text the bot reads from GitHub and writes to it.

import { FRAMEWORK_REPO } from './config.ts';

/**
 * Replaces the `\r\n` line endings GitHub keeps from a description or review
 * edited in the browser with `\n`.
 *
 * @param {string} text - A description or a review body read from GitHub.
 * @returns {string} The text with `\n` line endings only.
 */
export function normalizeLineEndings(text: string): string {
	return text.replaceAll('\r\n', '\n');
}

/**
 * Writes a reference to a PR of the framework repository, which GitHub turns
 * into a link.
 *
 * @param {number} prNumber - The number of the framework PR.
 * @returns {string} The reference, such as `withastro/astro#18459`.
 */
export function formatFrameworkReference(prNumber: number): string {
	return `${FRAMEWORK_REPO}#${prNumber}`;
}
