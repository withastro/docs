import type { MarkdownInstance } from 'astro';

export const groupPagesByLang = <T extends MarkdownInstance<Record<string, unknown>>>(pages: T[]) =>
	pages.reduce((pages, page) => {
		if (!page.url) {
			throw new Error('No `url` for page: ' + page.file);
		}
		const lang = page.url.split('/')[1];
		if (!pages[lang]) pages[lang] = [];
		pages[lang].push(page);
		return pages;
	}, {} as { [lang: string]: T[] });
