import type { CollectionEntry } from 'astro:content';

export const groupPagesByLang = <T extends CollectionEntry<'docs'>>(pages: T[]) =>
	pages.reduce((pages, page) => {
		const lang = page.slug.split('/')[0];
		if (!pages[lang]) pages[lang] = [];
		pages[lang].push(page);
		return pages;
	}, {} as { [lang: string]: T[] });
