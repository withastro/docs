import type { GetStaticPathsItem } from 'astro';
import { type CollectionEntry, getCollection } from 'astro:content';
import config from 'virtual:starlight/user-config';

export type GlossaryEntry = CollectionEntry<'glossary'>

export interface Terminology {
	/**
	 * The terminology slug used in heading anchors.
	 */
	slug: string;
	/**
	 * Translated terminology for the current locale.
	 */
	term?: string;
	/**
	 * The terminology in the default locale.
	 */
	defaultTerm: string;
	/**
	 * The content collection entry for the terminology.
	 */
	entry: GlossaryEntry;
}

export interface Route {
	terms: Terminology[];
	locale: { dir: 'rtl' | 'ltr', locale: string, lang?: string };
	[key: string]: unknown;
}

interface Path extends GetStaticPathsItem {
	params: { locale: string };
	props: Route;
}

const glossaryEntries: GlossaryEntry[] = (await getCollection('glossary')) ?? [];

function getTermsPerLocale(locale: string, defaultTerms: { slug: string, entry: GlossaryEntry }[]): Terminology[] {
	const termMap = Object.fromEntries(glossaryEntries
		.filter(entry => entry.slug.startsWith(locale))
		.map(entry => ([entry.slug.substring(locale.length + 1), entry])));

	return defaultTerms.map(({ slug, entry: defaultEntry }) => {
		// If the term exists in the current locale, use it.
		if (slug in termMap) {
			const entry = termMap[slug];
			return {
				slug,
				term: entry.data.title,
				defaultTerm: defaultEntry.data.title,
				entry
			};
		}
		// Otherwise, use the default term definition.
		return {
			slug,
			term: undefined,
			defaultTerm: defaultEntry.data.title,
			entry: defaultEntry
		};
	});
}

function getPaths(): Path[] {
	const locales = config.isMultilingual
		? Object.entries(config.locales).map(([code, locale]) => ({ locale: code, ...locale }))
		: [{ ...config.defaultLocale, locale: 'en' }];

	const defaultLocale = config.defaultLocale.locale || 'en';

	const defaultTerms = glossaryEntries
		.filter(entry => entry.slug.startsWith(defaultLocale))
		.map(entry => ({ slug: entry.slug.substring(defaultLocale.length + 1), entry }));

	return locales.map(locale => ({
		params: { locale: locale.locale },
		props: { locale, terms: getTermsPerLocale(locale.locale, defaultTerms) }
	}));
}

export const paths = getPaths();
