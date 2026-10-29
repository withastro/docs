/**
 * Keeps the items an async predicate accepts, in their order. Checks every item at once.
 *
 * @param {readonly T[]} items - The items to filter.
 * @param {(item: T) => Promise<boolean>} predicate - Tells whether to keep an item.
 * @returns {Promise<T[]>} The items the predicate accepted.
 * @template T - The type of the items.
 */
export async function filterAsync<T>(
	items: readonly T[],
	predicate: (item: T) => Promise<boolean>
): Promise<T[]> {
	const isKeptFlags = await Promise.all(items.map((item) => predicate(item)));
	return items.filter((_, index) => isKeptFlags[index]);
}
