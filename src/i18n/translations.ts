import type { SIDEBAR } from '../config';
type LanguagesInUse = keyof typeof SIDEBAR;

const en = {
	'a11y.skipLink': 'Skip to Content',
	'navbar.a11yTitle': 'Top Navigation',
	// Site settings
	'site.title': 'Astro Documentation',
	'site.description': 'Build faster websites with less client-side Javascript.',
	'site.og.imageSrc': '/default-og-image.png?v=1',
	'site.og.imageAlt': 'astro logo on a starry expanse of space, with a purple saturn-like planet floating in the right foreground',
	// Left Sidebar
	'leftSidebar.a11yTitle': 'Site Navigation',
	'leftSidebar.learnTab': 'Learn',
	'leftSidebar.referenceTab': 'Reference',
	'leftSidebar.noTranslations': 'No Translations Found',
	'leftSidebar.viewInEnglish': 'View in English',
	// Right Sidebar
	'rightSidebar.a11yTitle': 'Table of Contents',
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
	// `<ContributorList>` fallback text
	'contributors.seeAll': 'See all contributors',
};

const checkLanguages = <T extends Record<LanguagesInUse, Partial<typeof en>>>(config: T): T => config;

export const translations = checkLanguages({
	en,
	de: {
		'leftSidebar.learnTab': 'Lernen',
		'leftSidebar.referenceTab': 'Referenz',
		'rightSidebar.onThisPage': 'Auf dieser Seite',
		'rightSidebar.overview': 'Überblick',
		'rightSidebar.more': 'Mehr',
		'rightSidebar.editPage': 'Bearbeite diese Seite',
		'rightSidebar.translatePage': 'Übersetze diese Seite',
		'rightSidebar.joinCommunity': 'Trete unserer Community bei',
		'articleNav.nextPage': 'Nächste Seite',
		'articleNav.prevPage': 'Zurück',
		'since.addedIn': 'Hinzugefügt in:',
		'since.new': 'Neu',
		'contributors.seeAll': 'Alle Mitwirkenden ansehen',
	},
	nl: {},
	'pt-BR': {},
	fi: {},
	es: {},
	'zh-CN': {},
	'zh-TW': {},
	bg: {},
	fr: {},
	bn: {},
	kr: {},
	ar: {
		'leftSidebar.learnTab': 'تَعلَم',
		'leftSidebar.referenceTab': 'مرجع',
		'rightSidebar.onThisPage': 'في الصفحة الحالية',
		'rightSidebar.overview': 'نظرة عامة',
		'rightSidebar.more': 'المزيد',
		'rightSidebar.editPage': 'عدل هذه الصفحة',
		'rightSidebar.translatePage': 'ترجم هذه الصفحة',
		'rightSidebar.joinCommunity': 'انضم إلى مُجتمعنا',
		'articleNav.nextPage': 'الصفحة التالية',
		'articleNav.prevPage': 'عودة',
		'since.addedIn': 'أُضيفت في:',
		'since.new': 'جديدة',
	},
	da: {},
	ja: {},
	ru: {},
	it: {},
	pl: {},
	hu: {},
});
