import path from 'node:path';
import type { TutorialEntry } from '~/content/config';
import { stripLangFromSlug } from '~/util';
import { groupPagesByLang } from './groupPagesByLang';

/** Get a full list of pages for the tutorial in the current language, falling back to English if not available. */
export function getTutorialPages(allPages: TutorialEntry[], lang: string) {
	const pagesByLang = groupPagesByLang(allPages);
	/** Pages */
	const pages = pagesByLang['en']
		.map((englishPage) => {
			const enSlug = stripLangFromSlug(englishPage.slug);
			const langPage = pagesByLang[lang]?.find((page) => stripLangFromSlug(page.slug) === enSlug);
			return {
				...(langPage || englishPage),
				isFallback: !langPage,
			};
		})
		.sort((a, b) => {
			const aPath = path.parse(a.id);
			const bPath = path.parse(b.id);
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
export function getTutorialUnits(tutorialPages: TutorialEntry[]) {
	return tutorialPages.reduce((units, page) => {
		if (page.data.unitTitle) {
			units.push({
				title: page.data.unitTitle,
				lessons: [page],
			});
		} else {
			units.at(-1)?.lessons.push(page);
		}
		return units;
	}, [] as { title: string; lessons: typeof tutorialPages }[]);
}
