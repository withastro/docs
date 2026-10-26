/**
 * Whether a value is an object whose fields can be read, and not `null` or an
 * array.
 *
 * @param {unknown} value - The value to check, such as parsed JSON.
 * @returns {boolean} `true` for an object.
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Parses a JSON text.
 *
 * @param {string} json - The text to parse.
 * @param {string} source - What the text is, to name it in the error.
 * @returns {unknown} The parsed value, to validate before use.
 * @throws {Error} When the text isn't valid JSON, with the parse error as its
 *   cause.
 */
export function parseJson(json: string, source: string): unknown {
	try {
		return JSON.parse(json);
	} catch (error) {
		throw new Error(`${source} isn't valid JSON.`, { cause: error });
	}
}
