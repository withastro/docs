// The Markdown text of PR descriptions, comments and reviews.

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
