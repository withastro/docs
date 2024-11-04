import enNav from './en/nav';
import type { allLanguages } from './languages';

export type UILanguageKeys = keyof typeof allLanguages;

type NavDictionaryKeys = (typeof enNav)[number]['key'];
export type NavDict = Array<
	{
		text: string;
		key: NavDictionaryKeys;
		labelIsTranslated: boolean;
		isFallback?: boolean;
	} & (
		| { slug: string }
		| { header: true; nested?: boolean; collapsed?: boolean; type: 'learn' | 'api' }
	)
>;

/**
 * Helper to type check and process a dictionary of navigation menu translations.
 * Converts it to an array matching the English menu’s sorting with English items used as fallback entries.
 */
export const NavDictionary = (dict: Partial<Record<NavDictionaryKeys, string>>) => {
	const orderedDictionary: NavDict = [];
	for (const enEntry of enNav) {
		const text = dict[enEntry.key] || enEntry.text;
		orderedDictionary.push({ ...enEntry, text, labelIsTranslated: !!dict[enEntry.key] });
	}
	return orderedDictionary;
};
