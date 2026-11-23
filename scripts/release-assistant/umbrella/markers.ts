const REGEXP_SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\]/g;

/**
 * Renders a marker: a hidden line of Markdown that records a value for later runs.
 *
 * @param {string} name - What the marker records, unique in the text.
 * @param {string} value - The value, without spaces.
 * @returns {string} The line, as an HTML comment.
 */
export function renderMarker(name: string, value: string): string {
	return `<!-- ${name}=${value} -->`;
}

/**
 * Reads the value of a marker written by `renderMarker`.
 *
 * @param {string} name - What the marker records.
 * @param {string | null} markdown - The text holding the marker on a line of its own.
 * @returns {string | null} The value, or `null` without the marker.
 */
export function readMarker(name: string, markdown: string | null): string | null {
	const escapedName = name.replaceAll(REGEXP_SPECIAL_CHARACTERS, '\\$&');
	const marker = new RegExp(`^<!-- ${escapedName}=(\\S*) -->$`, 'm');
	return markdown?.match(marker)?.[1] ?? null;
}
