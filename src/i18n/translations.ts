import type { SIDEBAR } from '../config';
type LanguagesInUse = keyof typeof SIDEBAR;

const en = {
	// Left Sidebar tab headings
	learnTab: 'Learn',
	apiTab: 'API',
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
