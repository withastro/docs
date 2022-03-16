import type { SIDEBAR } from '../config';
type LanguagesInUse = keyof typeof SIDEBAR;

const en = {
	// Left Sidebar tab headings
	learnTab: 'Learn',
	apiTab: 'API',
	// Right Sidebar
	onThisPage: 'On this page',
	overview: 'Overview',
	more: 'More',
	editPage: 'Edit this page',
	translatePage: 'Translate this page',
	joinCommunity: 'Join our community',
	// Used in previous/next page links at the bottom of pages
	nextPage: 'Next Page',
	prevPage: 'Back',
	// Used in `<Since>`: Added in: v0.24.0 [NEW]
	addedIn: 'Added in:',
	new: 'New',
};

const checkLanguages = <T extends Record<LanguagesInUse, Partial<typeof en>>>(config: T): T => config;

export const translations = checkLanguages({
	en,
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
});
