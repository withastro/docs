import type { StarlightUserConfig } from '@astrojs/starlight/types';

/**
 * Starlight i18n configuration.
 * @see https://starlight.astro.build/reference/configuration/#locales
 */
export const localesConfig = {
	en: { label: 'English', lang: 'en', dir: 'ltr' },
	de: { label: 'Deutsch', lang: 'de', dir: 'ltr' },
	'pt-br': { label: 'Português do Brasil', lang: 'pt-BR', dir: 'ltr' },
	es: { label: 'Español', lang: 'es', dir: 'ltr' },
	'zh-cn': { label: '简体中文', lang: 'zh-CN', dir: 'ltr' },
	'zh-tw': { label: '正體中文', lang: 'zh-TW', dir: 'ltr' },
	fr: { label: 'Français', lang: 'fr', dir: 'ltr' },
	hi: { label: 'हिन्दी', lang: 'hi', dir: 'ltr' },
	ar: { label: 'العربية', lang: 'ar', dir: 'rtl' },
	ja: { label: '日本語', lang: 'ja', dir: 'ltr' },
	ko: { label: '한국어', lang: 'ko', dir: 'ltr' },
	pl: { label: 'Polski', lang: 'pl', dir: 'ltr' },
	ru: { label: 'Русский', lang: 'ru', dir: 'ltr' },
	it: { label: 'Italiano', lang: 'it', dir: 'ltr' },
} satisfies StarlightUserConfig['locales'];

/** The only two languages to build to speed up Astro's smoke tests. */
const twoLanguages: (keyof typeof localesConfig)[] = ['en', 'ko'];

/** Starlight i18n configuration used for Astro's smoke tests. */
export const twoLocalesConfig = Object.fromEntries(
	twoLanguages.map(function (lang) {
		const localeConfig = localesConfig?.[lang];
		if (!localeConfig) {
			throw new Error(
				`The locale config for Astro smoke tests is referencing a non-existent language: "${lang}"`
			);
		}
		return [lang, localeConfig];
	})
);
