import { i18nStrings } from './data';

const fallbackLang = 'en';

type Lang = keyof typeof i18nStrings;
type Keys = keyof typeof i18nStrings[Lang];

export function getLanguageString(key: Keys, lang = 'en'): string | undefined {
	const langStrings = i18nStrings[lang] || i18nStrings[fallbackLang];
	return langStrings[key];
}
