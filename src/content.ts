import { getCollection } from 'astro:content';
import { isEnglishEntry, isTutorialEntry } from './content/config';

export const allPages = await getCollection('docs');
export const tutorialPages = allPages.filter(isTutorialEntry);
export const englishPages = allPages.filter(isEnglishEntry);
