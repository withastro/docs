import { getCollection } from 'astro:content';
import {
	createIsLangEntry,
	isEnglishEntry,
	isRecipeEntry,
	isTutorialEntry,
} from './content/config';

export const allPages = await getAllPages();
export const tutorialPages = allPages.filter(isTutorialEntry);
export const recipePages = allPages.filter(isRecipeEntry);
export const englishPages = allPages.filter(isEnglishEntry);

async function getAllPages() {
	const pages = await getCollection('docs');

	// Build for two languages only to speed up Astro's smoke tests
	if (import.meta.env.PUBLIC_TWO_LANG) {
		const isDeutschEntry = createIsLangEntry('de');
		return pages.filter((entry) => {
			return isEnglishEntry(entry) || isDeutschEntry(entry);
		});
	} else {
		return pages;
	}
}
