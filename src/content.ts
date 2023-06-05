import { getCollection } from 'astro:content';
import {
	createIsLangEntry,
	isEnglishEntry,
	isRecipeEntry,
	isTutorialEntry,
} from './content/config';

const isKoreanEntry = createIsLangEntry('ko');

export const allPages = await getCollection('docs', (entry) => {
	if (import.meta.env.PUBLIC_TWO_LANG) {
		// Build for two languages only to speed up Astro's smoke tests
		return isEnglishEntry(entry) || isKoreanEntry(entry);
	} else {
		return true;
	}
});
export const tutorialPages = allPages.filter(isTutorialEntry);
export const recipePages = allPages.filter(isRecipeEntry);
export const englishPages = allPages.filter(isEnglishEntry);
