import type { CollectionEntry } from 'astro:content';
import { englishPages } from '~/content';
import { getPageCategory } from './getPageCategory';

/** Remove the sub-page segment of a URL string */
export function removeSubPageSegment(path: string) {
	// Include new pages with sub-pages as part of this regex.
	const regex = /(?:install|deploy|integrations-guide|tutorial|migrate-to-astro|recipes|cms)\//;
	const matches = regex.exec(path);

	if (matches) {
		const matchIndex = matches.index;
		// Get the first slash index after the main page path segment.
		const slashIndex = path.slice(matchIndex).indexOf('/') + matchIndex;
		return path.slice(0, slashIndex);
	}
	return path;
}

const typeIndexes: Partial<Record<CollectionEntry<'docs'>['data']['type'], string>> = {
	recipe: 'recipes',
};

const categoryIndex: Partial<Record<ReturnType<typeof getPageCategory>, string>> = {
	'Error Reference': 'reference/error-reference',
};

/**
 * Test if `currentPage` is considered a sub-page of `parentSlug`.
 * @param currentPage The full slug for the current page, e.g. `'en/guides/rss'`
 * @param parentSlug The language-less slug for the parent to test against e.g. `'guides/content-collections'`
 */
export function isSubPage(currentPage: string, parentSlug: string): boolean {
	// Test 1: do the two pages share a base URL segment?
	if (removeSubPageSegment(currentPage).endsWith(removeSubPageSegment(parentSlug))) {
		return true;
	}
	// Test 2: is there a known parent page for this page category?
	const category = getPageCategory({ pathname: '/' + currentPage + '/' });
	if (categoryIndex[category] === parentSlug) {
		return true;
	}
	// Test 3: is there a known parent page for this page type?
	const type = englishPages.find(({ slug }) => slug === currentPage)?.data.type;
	if (type && typeIndexes[type] === parentSlug) {
		return true;
	}
	return false;
}
