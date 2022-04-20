import type { AstroGlobal } from 'astro';
import { DocSearchTranslation, UIDictionaryKeys } from './checks';
import { getLanguageFromURL } from '../util';

const translations = Object.entries(import.meta.globEager('./*/translations.ts')).reduce((acc, [path, module]) => {
	if (module.default) {
		const lang = path.split('/')[1];
		acc[lang] = module.default;
	}
	return acc;
}, {} as Record<string, Record<UIDictionaryKeys, string>>);

const fallbackLang = 'en';

function getLanguageString(key: UIDictionaryKeys, lang = 'en'): string | undefined {
	const str = translations[lang]?.[key] || translations[fallbackLang][key];
	if (str === undefined) console.error(`Missing translation for “${key}” in “${lang}”.`);
	return str;
}

const docsearchTranslations = Object.entries(import.meta.globEager('./*/docsearch.ts')).reduce((acc, [path, module]) => {
	if (module.default) {
		const lang = path.split('/')[1];
		acc[lang] = module.default;
	}
	return acc;
}, {} as Record<string, DocSearchTranslation>);

/** Returns a dictionary of strings for use with DocSearch. */
export function getDocSearchStrings(Astro: AstroGlobal): DocSearchTranslation {
	const lang = getLanguageFromURL(Astro.canonicalURL.pathname) || fallbackLang;
	// A shallow merge is sufficient here as most of the actual fallbacks are provided by DocSearch.
	return { ...docsearchTranslations[fallbackLang], ...docsearchTranslations[lang] };
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
	const lang = getLanguageFromURL(Astro.canonicalURL.pathname);
	return function getTranslation(key: UIDictionaryKeys) {
		return getLanguageString(key, lang);
	};
}
