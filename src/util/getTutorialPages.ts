import type { MarkdownInstance } from 'astro';
import path from 'node:path';
import { groupPagesByLang } from './groupPagesByLang';

/** Get a page’s slug, without the language prefix (e.g. `'/en/migrate'` => `'migrate'`). */
const slugFromUrl = (url: string) => url.split('/').slice(2).join('/');

/** Get a full list of pages for the tutorial in the current language, falling back to English if not available. */
export function getTutorialPages(
	allPages: MarkdownInstance<{ title: string; sectionTitle?: string }>[],
	lang: string
) {
	const pagesWithSlug = allPages.map((page) => ({ ...page, slug: slugFromUrl(page.url!) }));
	const pagesByLang = groupPagesByLang(pagesWithSlug);
	/** Pages */
	const pages = pagesByLang['en']
		.map((englishPage) => {
			const langPage = pagesByLang[lang]?.find((page) => page.slug === englishPage.slug);
			return {
				...(langPage || englishPage),
				isFallback: !langPage,
			};
		})
		.sort((a, b) => {
			const aPath = path.parse(a.file);
			const bPath = path.parse(b.file);
			if (aPath.dir < bPath.dir) return -1;
			if (aPath.dir > bPath.dir) return 1;
			if (aPath.name === 'index') return -1;
			return aPath.name < bPath.name ? -1 : aPath.name > bPath.name ? 1 : 0;
		});
	return pages;
}
