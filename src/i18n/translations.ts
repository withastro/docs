import type { SIDEBAR } from '../config';
type LanguagesInUse = keyof typeof SIDEBAR;

const en = {
	// Left Sidebar tab headings
	'leftSidebar.learnTab': 'Learn',
	'leftSidebar.referenceTab': 'Reference',
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
};

const checkLanguages = <T extends Record<LanguagesInUse, Partial<typeof en>>>(config: T): T => config;

export const translations = checkLanguages({
	en,
	de: {},
	nl: {},
	'pt-BR': {
		'leftSidebar.learnTab': 'Aprenda',
		'leftSidebar.referenceTab': 'Referência',
		'rightSidebar.onThisPage': 'Nesta página',
		'rightSidebar.overview': 'Visão geral',
		'rightSidebar.more': 'Mais',
		'rightSidebar.editPage': 'Edite esta página',
		'rightSidebar.translatePage': 'Traduza esta página',
		'rightSidebar.joinCommunity': 'Junte-se à comunidade',
		'articleNav.nextPage': 'Próxima página',
		'articleNav.prevPage': 'Página anterior',
		'since.addedIn': 'Adicionado em:',
		'since.new': 'Novo',
	},
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
