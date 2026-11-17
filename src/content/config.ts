import { type CollectionEntry, defineCollection } from 'astro:content';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro/zod';

export const isEnglishEntry = (entry: CollectionEntry<'docs'>): boolean =>
	entry.slug.startsWith('en/');

export const collections = {
	docs: defineCollection({
		schema: docsSchema({
			extend: z.object({
				intent: z.record(z.number().min(0).max(1)).optional(),
			}),
		}),
	}),
};
