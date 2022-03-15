import type { SIDEBAR } from '../config';
type LanguagesInUse = keyof typeof SIDEBAR;
const checkLanguages = <T extends Record<LanguagesInUse, Record<string, string>>>(config: T): T => config;

export const translations = checkLanguages({
	en: {
		addedIn: 'Added in:',
		new: 'New',
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
});
