import type { AstroGlobal } from 'astro';
import { getLanguageFromURL } from '../util';
import { translations } from './translations';

const fallbackLang = 'en';

export type Keys = keyof typeof translations[typeof fallbackLang];

function getLanguageString(key: Keys, lang = 'en'): string | undefined {
	return translations[lang]?.[key] || translations[fallbackLang][key];
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
export function useTranslations(Astro: Readonly<AstroGlobal>): (key: Keys) => string | undefined {
	const lang = getLanguageFromURL(Astro.canonicalURL.pathname);
	return function getTranslation(key: Keys) {
		return getLanguageString(key, lang);
	};
}
