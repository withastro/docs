/**
 * Formats a list of PRs.
 *
 * @param {number[]} prNumbers - The numbers of the PRs.
 * @returns {string} The PRs as `#1, #2`, or `none` for an empty list.
 */
export function formatPrNumbers(prNumbers: number[]): string {
	return prNumbers.map((prNumber) => `#${prNumber}`).join(', ') || 'none';
}
