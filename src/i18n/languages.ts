/**
 * Map of language codes to a written out language name.
 * Used to populate the language switcher in the navbar.
 */
export default {
	en: 'English',
	de: 'Deutsch',
	'pt-br': 'Português do Brasil',
	es: 'Español',
	'zh-cn': '简体中文',
	'zh-tw': '正體中文',
	fr: 'Français',
	ar: 'العربية',
	ja: '日本語',
	ko: '한국어',
	pl: 'Polski',
	ru: 'Русский',
} as const;

export const rtlLanguages = new Set(['ar']);
