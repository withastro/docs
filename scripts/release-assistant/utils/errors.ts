/**
 * Gets the message of what was thrown.
 *
 * @param {unknown} error - What was thrown.
 * @returns {string} The message of an `Error`, or the value as a string.
 */
export function describeError(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}
