/**
 * Map of language codes to a written out language name.
 * Used to populate the language switcher in the navbar.
 */
const languages: Record<string, string> = import.meta.env.PUBLIC_TWO_LANG
	? // Build for two languages only to speed up Astro's smoke tests
	  {
			en: 'English',
			ko: '한국어',
	  }
	: {
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
	  };

export default languages;

export const rtlLanguages = new Set(['ar']);
