/** Whether a parsed JSON value is an object, and not an array. */
export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Parses `json`, or throws an error that names the `source` of it. */
export function parseJson(json: string, source: string): unknown {
	try {
		return JSON.parse(json);
	} catch (error) {
		throw new Error(`${source} isn't valid JSON.`, { cause: error });
	}
}
