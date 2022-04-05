import type { SIDEBAR } from '../config';
type LanguagesInUse = keyof typeof SIDEBAR;

const en = {
	'a11y.skipLink': 'Skip to Content',
	// Site settings
	'site.title': 'Astro Documentation',
	'site.description': 'Build faster websites with less client-side Javascript.',
	// Left Sidebar
	'leftSidebar.learnTab': 'Learn',
	'leftSidebar.referenceTab': 'Reference',
	'leftSidebar.noTranslations': 'No Translations Found',
	'leftSidebar.viewInEnglish': 'View in English',
	// Right Sidebar
	'rightSidebar.onThisPage': 'On this page',
	'rightSidebar.overview': 'Overview',
	'rightSidebar.more': 'More',
	'rightSidebar.editPage': 'Edit this page',
	'rightSidebar.translatePage': 'Translate this page',
	'rightSidebar.joinCommunity': 'Join our community',
	// Used in previous/next page links at the bottom of pages
	'articleNav.nextPage': 'Next Page',
	'articleNav.prevPage': 'Back',
	// Used in `<Since>`: Added in: v0.24.0 [NEW]
	'since.addedIn': 'Added in:',
	'since.new': 'New',
	// Installation Guide
	'install.autoTab': 'Automatic CLI',
	'install.manualTab': 'Manual Setup',
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
