import type { ModalTranslations } from '@docsearch/react';
import enNav from './en/nav';
import enTutorialNav from './en/tutorial-nav';
import type enUI from './en/ui';

export type UIDictionaryKeys = keyof typeof enUI;
export type UIDict = Partial<typeof enUI>;

/** Helper to type check a dictionary of UI string translations. */
export const UIDictionary = (dict: Partial<typeof enUI>) => dict;

type TutorialNavDictionaryKeys = typeof enTutorialNav[number]['key'];
export type TutorialNavDict = Array<
	{
		text: string;
		key: TutorialNavDictionaryKeys;
		isFallback?: boolean;
	} & ({ slug: string } | { header: true; type: 'tutorial' })
>;

/**
 * Helper to type check and process a dictionary of tutorial navigation translations.
 * Converts it to an array matching the English menu’s sorting with English items used as fallback entries.
 */
export const TutorialNavDictionary = (dict: Partial<Record<TutorialNavDictionaryKeys, string>>) => {
	const orderedDictionary: TutorialNavDict = [];
	for (const enEntry of enTutorialNav) {
		const text = dict[enEntry.key] || enEntry.text;
		orderedDictionary.push({ ...enEntry, text });
	}
	return orderedDictionary;
};

type NavDictionaryKeys = typeof enNav[number]['key'];
export type NavDict = Array<
	{
		text: string;
		key: NavDictionaryKeys;
		isFallback?: boolean;
	} & ({ slug: string } | { header: true; type: 'learn' | 'api' })
>;

/**
 * Helper to type check and process a dictionary of navigation menu translations.
 * Converts it to an array matching the English menu’s sorting with English items used as fallback entries.
 */
export const NavDictionary = (dict: Partial<Record<NavDictionaryKeys, string>>) => {
	const orderedDictionary: NavDict = [];
	for (const enEntry of enNav) {
		const text = dict[enEntry.key] || enEntry.text;
		orderedDictionary.push({ ...enEntry, text });
	}
	return orderedDictionary;
};

export interface DocSearchTranslation {
	// These two keys are Astro-specific and apply to the search box in the header.
	button?: string;
	shortcutLabel?: string;
	// Search box placeholder text within the DocSearch modal.
	placeholder?: string;
	// This object follows DocSearch's translation.modal format.
	// See: https://docsearch.algolia.com/docs/api/#translations
	modal?: ModalTranslations;
}

/** Helper to type check a dictionary of DocSearch string translations. */
export const DocSearchDictionary = (dict: DocSearchTranslation) => dict;
