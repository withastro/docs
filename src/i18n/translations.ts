import type { SIDEBAR } from '../config';
type LanguagesInUse = keyof typeof SIDEBAR;

const en = {
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
