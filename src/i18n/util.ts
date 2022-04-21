import type { AstroGlobal } from 'astro';
import { DocSearchTranslation, UIDict, UIDictionaryKeys, NavDict } from './checks';
import { getLanguageFromURL } from '../util';

/**
 * Convert the map of modules returned by `import.meta.globEager` to an object
 * mapping the language code from each module’s filepath to the module’s default export.
 */
function mapDefaultExports<T>(modules: Record<string, { default: T }>) {
	const exportMap: Record<string, T> = {};
	for (const [path, module] of Object.entries(modules)) {
		const [_dot, lang] = path.split('/');
		exportMap[lang] = module.default;
	}
	return exportMap;
}

/** If a nav entry’s slug is not found, mark it as needing fallback content. */
function markFallbackNavEntries(translations: Record<string, NavDict>) {
	const markdownPaths = new Set(Object.keys(import.meta.glob('../pages/**/*.md')));
	for (const [lang, nav] of Object.entries(translations)) {
		for (const entry of nav) {
			if ('header' in entry) continue;
			if (!markdownPaths.has(`../pages/${lang}/${entry.slug}.md`)) {
				entry.isFallback = true;
			}
		}
	}
	return translations;
}

const translations = mapDefaultExports<UIDict>(import.meta.globEager('./*/ui.ts'));
const docsearchTranslations = mapDefaultExports<DocSearchTranslation>(import.meta.globEager('./*/docsearch.ts'));
const navTranslations = markFallbackNavEntries(mapDefaultExports<NavDict>(import.meta.globEager('./*/nav.ts')));

const fallbackLang = 'en';

/** Returns a dictionary of strings for use with DocSearch. */
export function getDocSearchStrings(Astro: AstroGlobal): DocSearchTranslation {
	const lang = getLanguageFromURL(Astro.canonicalURL.pathname) || fallbackLang;
	// A shallow merge is sufficient here as most of the actual fallbacks are provided by DocSearch.
	return { ...docsearchTranslations[fallbackLang], ...docsearchTranslations[lang] };
}

/** Get the navigation sidebar content for the current language. */
export function getNav(Astro: AstroGlobal): NavDict {
	const lang = getLanguageFromURL(Astro.canonicalURL.pathname) || fallbackLang;
	return navTranslations[lang];
}

/** Get a map of navigation sidebar content for all languages keyed by language code. */
export function getAllNavs() {
	return navTranslations;
}

/**
 * Create a helper function for getting translated strings.
 *
 * Within an Astro component, prefer the `UIString` component,
 * which only needs the key as it has access to the global Astro object.
 *
 * However, you can’t pass an Astro component as a prop to a framework component,
 * so this function creates a look-up method to get the string instead:
 *
 * @example
 * ---
 * import { useTranslations } from '~/i18n/util.ts';
 * const t = useTranslations(Astro);
 * ---
 * <FrameworkComponent label={t('articleNav.nextPage')} />
 */
export function useTranslations(Astro: Readonly<AstroGlobal>): (key: UIDictionaryKeys) => string | undefined {
	const lang = getLanguageFromURL(Astro.canonicalURL.pathname) || 'en';
	return function getTranslation(key: UIDictionaryKeys) {
		const str = translations[lang]?.[key] || translations[fallbackLang][key];
		if (str === undefined) console.error(`Missing translation for “${key}” in “${lang}”.`);
		return str;
	};
}
