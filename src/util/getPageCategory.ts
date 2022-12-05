// TODO: Move this data to our i18n system to support localized category labels.
const defaultCategory = 'Learn';
const categories = [
	['tutorial/', 'Tutorials'],
	['reference/', 'Reference'],
	['guides/deploy/', 'Deploy Guides'],
	['guides/integrations-guide/', 'Integration Guides'],
	['reference/errors/', 'Error Reference'],
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
