import AstroSitemap from '@astrojs/sitemap';
import type { AstroIntegration } from 'astro';
import { allLanguages } from '../../src/languages';
import { localesConfig } from '../../config/locales';

/** Set matching our `/[lang]/something.astro` redirect routes. */
const blocklist = new Set([
	...allLanguages.map((lang) => `/${lang}/`),
	...allLanguages.map((lang) => `/${lang}/install/`),
	...allLanguages.map((lang) => `/${lang}/tutorial/`),
]);

/** Match a pathname starting with “lighthouse” or one of our language tags. */
const ValidRouteRE = new RegExp(`^/(lighthouse|${allLanguages.join('|')})/`);

/** Test a pathname is not in our blocklist and starts with a valid prefix. */
const isValidPath = (path: string) => !blocklist.has(path) && ValidRouteRE.test(path);

/** Get a preconfigured instance of the `@astrojs/sitemap` integration. */
export function sitemap(): AstroIntegration {
	return AstroSitemap({
		filter: (page) => isValidPath(new URL(page).pathname),
		i18n: {
			defaultLocale: 'en',
			locales: Object.fromEntries(
				Object.entries(localesConfig).map(([lang, config]) => [lang, config.lang])
			),
		},
	});
}
