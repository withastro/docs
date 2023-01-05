// TODO: Move this data to our i18n system to support localized category labels.
const defaultCategory = 'Learn';

// Order is important here. Pages are tested to see if they *start* with one of
// these paths and will return early when one matches. This means more specific
// paths need to be earlier in the array, e.g. `reference/errors/` before `reference/`.
const categories = [
	['guides/deploy/', 'Deploy Guides'],
	['guides/integrations-guide/', 'Integration Guides'],
	['reference/errors/', 'Error Reference'],
	['reference/', 'Reference'],
	['tutorial/', 'Tutorials'],
] as const;

/**
 * @param url URL for the current page.
 * @returns The category for the current page as used by Algolia DocSearch to group search results.
 */
export function getPageCategory(url: URL) {
	const langAgnosticPath = url.pathname.replace(/\/\w\w(-\w\w)?\//, '');
	for (const [path, label] of categories) {
		if (langAgnosticPath.startsWith(path)) return label;
	}
	return defaultCategory;
}
