import type { AstroGlobal } from 'astro';
import { allPages } from '../content';
import type { NavDict } from '../i18n/translation-checkers';
import { fallbackLang, navTranslations } from '../i18n/util';
import { getLanguageFromURL, stripLangFromSlug } from '../util';
import { groupPagesByLang } from './groupPagesByLang';

const pagesByLang = groupPagesByLang(allPages);

/** Map of language tags to a `Set` of slugs that exist for that language. */
const slugsByLang: Record<string, Set<string>> = Object.fromEntries(
	Object.entries(pagesByLang).map(([lang, pages]) => [
		lang,
		new Set(pages.map(({ slug }) => stripLangFromSlug(slug))),
	])
);

/** If a nav entry’s slug is not found, mark it as needing fallback content. */
async function markFallbackNavEntries(lang: string, nav: NavDict) {
	const slugs = slugsByLang[lang];
	for (const entry of nav) {
		if ('header' in entry) continue;
		if (!(slugs.has(entry.slug) || slugs.has(entry.slug + '/index'))) {
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
