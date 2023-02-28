import type { CollectionEntry } from 'astro:content';

export function getLanguageFromURL(pathname: string) {
	const langCodeMatch = pathname.match(/\/([a-z]{2}-?[a-z]{0,2})\//);
	return langCodeMatch ? langCodeMatch[1] : 'en';
}

/** Remove \ and / from beginning of string */
export function removeLeadingSlash(path: string) {
	return path.replace(/^[/\\]+/, '');
}

/** Remove \ and / from end of string */
export function removeTrailingSlash(path: string) {
	return path.replace(/[/\\]+$/, '');
}

/** Get a page’s slug, without the language prefix (e.g. `'en/migrate'` => `'migrate'`). */
export const stripLangFromSlug = (slug: CollectionEntry<'docs'>['slug']) =>
	slug.split('/').slice(1).join('/');

/** Get a page’s lang tag from its slug (e.g. `'en/migrate'` => `'en'`). */
export const getLangFromSlug = (slug: CollectionEntry<'docs'>['slug']) => slug.split('/')[0];

type mainPagesKeys = CollectionEntry<'docs'>['data']['type'];

type mainPages = {
	[Key in mainPagesKeys]?: string;
};

/** Get a page's main page from its type/category (e.g. `type: cms` -> `'guides/cms'` ) */
export function getCategoryMainPage(category: mainPagesKeys) {
	const mainPagesFromCategories: mainPages = {
		cms: 'guides/cms',
		install: 'install/auto',
		integration: 'guides/integrations-guide',
		tutorial: 'tutorial/0-introduction/',
		migration: 'guides/migrate-to-astro',
		recipe: 'recipes',
		deploy: 'guides/deploy',
		error: 'reference/error-reference'
	};

	return mainPagesFromCategories[category];
}
