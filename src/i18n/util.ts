import { translations } from './translations';

const fallbackLang = 'en';

type Keys = keyof typeof translations[typeof fallbackLang];

export function getLanguageString(key: Keys, lang = 'en'): string | undefined {
	return translations[lang]?.[key] || translations[fallbackLang][key];
}
