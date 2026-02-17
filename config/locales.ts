import type { StarlightUserConfig } from '@astrojs/starlight/types';

/**
 * Starlight i18n configuration.
 * @see https://starlight.astro.build/reference/configuration/#locales
 */
export const localesConfig = {
	en: { label: 'English', lang: 'en', dir: 'ltr' },
	ru: { label: 'Русский', lang: 'ru', dir: 'ltr' },

} satisfies StarlightUserConfig['locales'];

/** The only two languages to build to speed up Astro's smoke tests. */
const twoLanguages: (keyof typeof localesConfig)[] = ['en', 'ru'];

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
