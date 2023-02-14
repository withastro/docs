import type { AstroGlobal } from 'astro';
import { getCollection } from 'astro:content';
import type { NavDict } from '../i18n/translation-checkers';
import { fallbackLang, navTranslations } from '../i18n/util';
import { getLanguageFromURL, stripLangFromSlug } from '../util';

/** If a nav entry’s slug is not found, mark it as needing fallback content. */
async function markFallbackNavEntries(lang: string, nav: NavDict) {
	const markdownSlugs = new Set(
		(await getCollection('docs', (entry) => entry.slug.startsWith(lang))).map((entry) =>
			stripLangFromSlug(entry.slug)
		)
	);

	for (const entry of nav) {
		if ('header' in entry) continue;
		if (!(markdownSlugs.has(entry.slug) || markdownSlugs.has(entry.slug + '/index'))) {
			entry.isFallback = true;
		}
	}
	return nav;
}

/** Get the navigation sidebar content for the current language. */
export async function getNav(Astro: AstroGlobal): Promise<NavDict> {
	const lang = getLanguageFromURL(Astro.url.pathname) || fallbackLang;
	return await markFallbackNavEntries(lang, navTranslations[lang]);
}
