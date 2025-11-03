import type { GetStaticPaths } from 'astro';
import { localesConfig, twoLocalesConfig } from '../config/locales';

/** The current Starlight i18n configuration depending if we are running smoke tests or not. */
const currentLocalesConfig = process.env.PUBLIC_TWO_LANG ? twoLocalesConfig : localesConfig;

/** An array of all language currently configured. */
export const allLanguages = Object.keys(currentLocalesConfig);

/** The pages to generate for `/[lang]/` dynamic routes. */
export const getStaticPaths: GetStaticPaths = () => {
	return allLanguages.map((lang) => ({ params: { lang } }));
};

/** A set of all RTL languages currently configured. */
export const rtlLanguages = new Set(
	Object.entries(currentLocalesConfig)
		.filter(([, config]) => config.dir === 'rtl')
		.map(([lang]) => lang)
);
