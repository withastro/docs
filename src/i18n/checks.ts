import type { DocSearchModalProps } from '@docsearch/react';
import type en from './en/translations';

export type UIDictionaryKeys = keyof typeof en;

/** Helper to type check a dictionary of UI string translations. */
export const UIDictionary = (dict: Partial<typeof en>) => dict;

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
