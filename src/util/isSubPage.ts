import type { CollectionEntry } from 'astro:content';
import { englishPages } from '~/content';
import { getPageCategory } from './getPageCategory';

/** Remove the sub-page segment of a URL string */
export function removeSubPageSegment(path: string) {
	// Include new pages with sub-pages as part of this regex.
	const regex =
		/(?:install|deploy|integrations-guide|tutorial|migrate-to-astro|recipes|cms|media|backend)\//;
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
	Tutorials: 'tutorial/0-introduction',
};

/** Map of page slugs to the slug of their parent page. */
const parentIndex: Record<string, string> = {
	'editor-setup': 'install-and-setup',
	'guides/dev-toolbar': 'install-and-setup',
	'guides/server-side-rendering': 'guides/integrations-guide',
};

/** Slugs of pages that appear at the top level even though they are in a sub-category. */
const topLevelExceptions = ['recipes/studio'];

/**
 * Test if `currentPage` is considered a sub-page of `parentSlug`.
 * @param currentPage The full slug for the current page, e.g. `'en/guides/rss'`
 * @param parentSlug The language-less slug for the parent to test against e.g. `'guides/content-collections'`
 */
export function isSubPage(currentPage: string, parentSlug: string): boolean {
	// Test: is this page a known, top-level page? Don’t match its parent.
	for (const slug of topLevelExceptions) {
		const currentIsExceptionPage = currentPage.endsWith('/' + slug);
		const parentIsExceptionPage = parentSlug === slug;
		if (
			(parentIsExceptionPage && !currentIsExceptionPage) ||
			(currentIsExceptionPage && !parentIsExceptionPage)
		) {
			return false;
		}
	}

	// Test: is there a known parent page hardcoded for this page?
	const currentSlug = currentPage.split('/').slice(1).join('/');
	if (parentIndex[currentSlug] === parentSlug) {
		return true;
	}
	// Test: do the two pages share a base URL segment?
	if (removeSubPageSegment(currentPage).endsWith(removeSubPageSegment(parentSlug))) {
		return true;
	}
	// Test: is there a known parent page for this page category?
	const category = getPageCategory({ pathname: '/' + currentPage + '/' });
	if (categoryIndex[category] === parentSlug) {
		return true;
	}
	// Test: is there a known parent page for this page type?
	const type = englishPages.find(({ slug }) => slug === currentPage)?.data.type;
	if (type && typeIndexes[type] === parentSlug) {
		return true;
	}
	return false;
}
