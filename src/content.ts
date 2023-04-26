import { getCollection } from 'astro:content';
import { isEnglishEntry, isRecipeEntry, isTutorialEntry } from './content/config';

export const allPages = await getAllPages();
export const tutorialPages = allPages.filter(isTutorialEntry);
export const recipePages = allPages.filter(isRecipeEntry);
export const englishPages = allPages.filter(isEnglishEntry);

async function getAllPages() {
	const pages = await getCollection('docs');

	if (import.meta.env.PUBLIC_ONLY_EN) {
		return pages.filter(isEnglishEntry);
	} else {
		return pages;
	}
}
