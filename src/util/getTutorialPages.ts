import type { MarkdownInstance } from 'astro';
import path from 'node:path';
import { groupPagesByLang } from './groupPagesByLang';

type TutorialPage = MarkdownInstance<{ title: string; unitTitle?: string }>;

/** Get a page’s slug, without the language prefix (e.g. `'/en/migrate'` => `'migrate'`). */
const slugFromUrl = (url: string) => url.split('/').slice(2).join('/');

/** Get a full list of pages for the tutorial in the current language, falling back to English if not available. */
export function getTutorialPages(allPages: TutorialPage[], lang: string) {
	const pagesWithSlug = allPages.map((page) => ({ ...page, slug: slugFromUrl(page.url!) }));
	const pagesByLang = groupPagesByLang(pagesWithSlug);
	/** Pages */
	const pages = pagesByLang['en']
		.map((englishPage) => {
			const langPage = pagesByLang[lang]?.find((page) => page.slug === englishPage.slug);
			return {
				...(langPage || englishPage),
				isFallback: !langPage,
			};
		})
		.sort((a, b) => {
			const aPath = path.parse(a.file);
			const bPath = path.parse(b.file);
			// Directories are numbered so pages in different directories can be sorted easily.
			if (aPath.dir < bPath.dir) return -1;
			if (aPath.dir > bPath.dir) return 1;
			// Index files should come first within a directory.
			if (aPath.name === 'index') return -1;
			if (bPath.name === 'index') return 1;
			// Other files within a directory are numbered and sorted ascending.
			return aPath.name < bPath.name ? -1 : aPath.name > bPath.name ? 1 : 0;
		});
	return pages;
}

/** Turn a flat list of tutorial pages into a hierarchical array of units and lessons. */
export function getTutorialUnits(tutorialPages: ReturnType<typeof getTutorialPages>) {
	return tutorialPages.reduce((units, page) => {
		if (page.frontmatter.unitTitle) {
			units.push({
				title: page.frontmatter.unitTitle,
				lessons: [page],
			});
		} else {
			units.at(-1)?.lessons.push(page);
		}
		return units;
	}, [] as { title: string; lessons: typeof tutorialPages }[]);
}
