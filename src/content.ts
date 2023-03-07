import { getCollection } from 'astro:content';
import { isEnglishEntry, isRecipeEntry, isTutorialEntry } from './content/config';

export const allPages = await getCollection('docs');
export const tutorialPages = allPages.filter(isTutorialEntry);
export const recipePages = allPages.filter(isRecipeEntry);
export const englishPages = allPages.filter(isEnglishEntry);
