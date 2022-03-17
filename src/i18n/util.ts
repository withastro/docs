import type { AstroGlobal } from 'astro';
import { getLanguageFromURL } from '../util';
import { translations } from './translations';

const fallbackLang = 'en';

type Keys = keyof typeof translations[typeof fallbackLang];

export function getLanguageString(key: Keys, lang = 'en'): string | undefined {
	return translations[lang]?.[key] || translations[fallbackLang][key];
}

/**
 * Get a UI string to pass to a framework component.
 * 
 * Within an Astro component, prefer the `UIString` component,
 * which only needs the key as it has access to the global Astro object.
 * 
 * However, you can’t pass an Astro component as a prop to a framework component,
 * so this function is provided to get the string instead:
 * 
 * @example
 * <FrameworkComponent label={getUIString('new', Astro)} />
 */
export function getUIString(key: Keys, Astro: Readonly<AstroGlobal>) {
	const lang = getLanguageFromURL(Astro.request.canonicalURL.pathname);
	return getLanguageString(key, lang);
}
