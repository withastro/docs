import type { CollectionEntry } from 'astro:content';

export function getLanguageFromURL(pathname: string) {
	const langCodeMatch = pathname.match(/\/([a-z]{2}-?[a-z]{0,2})\//);
	return langCodeMatch ? langCodeMatch[1] : 'en';
}

/** Remove \ and / from beginning of string */
export function removeLeadingSlash(path: string) {
	return path.replace(/^[/\\]+/, '');
}

/** Remove \ and / from end of string */
export function removeTrailingSlash(path: string) {
	return path.replace(/[/\\]+$/, '');
}

/** Get a page’s slug, without the language prefix (e.g. `'/en/migrate'` => `'migrate'`). */
export const splitSlugFromLang = (slug: CollectionEntry<'docs'>['slug']) => {
	const splitAtSlash = slug.split('/');
	const lang = splitAtSlash[0];
	const slugWithoutLang = splitAtSlash.slice(1).join('/');
	return { lang, slug: slugWithoutLang };
};

/** Remove the subpage segment of a URL string */
export function removeSubpageSegment(path: string) {
	// Include new pages with subpages as part of this regex.
	const regex = /(?:install|deploy|integrations-guide|tutorial|migrate-to-astro|cms)\//;
	const matches = regex.exec(path);

	if (matches) {
		const matchIndex = matches.index;
		// Get the first slash index after the main page path segment.
		const slashIndex = path.slice(matchIndex).indexOf('/') + matchIndex;
		return path.slice(0, slashIndex);
	}
	return path;
}
