import type { DocSearchModalProps } from '@docsearch/react';
import enNav from './en/nav';
import type enUI from './en/ui';

export type UIDictionaryKeys = keyof typeof enUI;
export type UIDict = Partial<typeof enUI>;

/** Helper to type check a dictionary of UI string translations. */
export const UIDictionary = (dict: Partial<typeof enUI>) => dict;

type NavEntry = { text: string } & ({ header: true; type: 'learn' | 'api' } | { slug: string });
type NavDictionaryKeys = typeof enNav[number]['key'];
export type NavDict = Array<NavEntry & { key: NavDictionaryKeys; isFallback?: boolean }>;

/**
 * Helper to type check and process a dictionary of navigation menu translations.
 * Converts it to an array matching the English menu’s sorting with English items used as fallback entries.
 */
export const NavDictionary = (dict: Partial<Record<NavDictionaryKeys, NavEntry>>) => {
	const orderedDictionary: NavDict = [];
	for (const entry of enNav) {
		const { key } = entry;
		orderedDictionary.push(dict[key] ? { ...dict[key], key } : entry);
	}
	return orderedDictionary;
};

export interface DocSearchTranslation {
	// These two keys are Astro-specific and apply to the search box in the header.
	button?: string;
	shortcutLabel?: string;
	// Search box placeholder text within the DocSearch modal.
	placeholder?: string;
	// This object follows DocSearch's translation format.
	// See: https://docsearch.algolia.com/docs/api/#translations
	translations?: Partial<DocSearchModalProps['translations']>;
}

/** Helper to type check a dictionary of DocSearch string translations. */
export const DocSearchDictionary = (dict: DocSearchTranslation) => dict;
