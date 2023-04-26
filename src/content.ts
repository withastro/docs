import { getCollection } from 'astro:content';
import {
	createIsLangEntry,
	isEnglishEntry,
	isRecipeEntry,
	isTutorialEntry,
} from './content/config';

const isKoreanEntry = createIsLangEntry('de');

export const allPages = await getCollection('docs', (entry) => {
	if (import.meta.env.PUBLIC_TWO_LANG) {
		return isEnglishEntry(entry) || isKoreanEntry(entry);
	} else {
		return true;
	}
});
export const tutorialPages = allPages.filter(isTutorialEntry);
export const recipePages = allPages.filter(isRecipeEntry);
export const englishPages = allPages.filter(isEnglishEntry);
