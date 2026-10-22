/**
 * Replaces the `\r\n` line endings GitHub keeps from a description or review
 * edited in the browser with `\n`.
 */
export function normalizeLineEndings(text: string): string {
	return text.replaceAll('\r\n', '\n');
}
