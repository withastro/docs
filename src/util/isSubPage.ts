import { getPageCategory } from './getPageCategory';
import { stripLangFromSlug } from './path-utils';

/**
 * Map of category names to the parent page for the category.
 * Pages in these categories are not visible in the sidebar, so we highlight the parent instead.
 */
const categoryParents: Partial<Record<ReturnType<typeof getPageCategory>, string>> = {
	'Error Reference': 'reference/error-reference',
};

/**
 * Test if `currentPage` is considered a sub-page of `parentSlug`.
 * @param currentPage The full slug for the current page, e.g. `'en/guides/rss'`
 * @param parentSlug The language-less slug for the parent to test against e.g. `'guides/content-collections'`
 */
export function isSubPage(currentPage: string, parentSlug: string): boolean {
	// Test: is there a known parent page for this page category?
	const category = getPageCategory({ pathname: '/' + currentPage + '/' });
	if (categoryParents[category] === parentSlug) return true;

	// For tutorial pages, highlight the parent unit page.
	// e.g. 'en/tutorial/3-components/2' should highlight 'tutorial/3-components'
	const slug = stripLangFromSlug(currentPage);
	if (slug.startsWith('tutorial/')) {
		const parts = slug.split('/');
		// Build the unit slug: 'tutorial/{unit}'
		const unitSlug = parts.slice(0, 2).join('/');
		return parentSlug === unitSlug;
	}

	return false;
}
