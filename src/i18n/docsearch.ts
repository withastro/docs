import type { DocSearchModalProps } from '@docsearch/react';
import type { SIDEBAR } from '../config';
type LanguagesInUse = keyof typeof SIDEBAR;

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

export const docsearchTranslations: Record<LanguagesInUse, DocSearchTranslation> = {
	en: {
		button: 'Search',
		placeholder: 'Search docs',
		shortcutLabel: 'Press / to search',
		translations: {},
	},
	de: {},
	nl: {},
	fi: {},
	es: {},
	'zh-CN': {},
	'zh-TW': {},
	bg: {},
	fr: {},
	bn: {},
	kr: {},
	ar: {},
	da: {},
	ja: {},
	ru: {},
	it: {},
	pl: {},
	hu: {},
};
