import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { defineCollection, z, type CollectionEntry } from 'astro:content';
import { file } from 'astro/loaders';
import { AstroDocsI18nSchema } from './content/i18n-schema';
import { logoKeys } from './data/logos';

export const baseSchema = z.object({
	type: z.literal('base').optional().default('base'),
	i18nReady: z.boolean().default(false),
	githubURL: z.string().url().optional(),
	hasREADME: z.boolean().optional(),
	// Extends Starlight’s default `hero` schema with custom fields.
	hero: z
		.object({
			facepile: z.object({
				tagline: z.string(),
				linkText: z.string(),
				link: z.string(),
			}),
		})
		.optional(),
});

// Third-party guide schemas (deploy, backend, cms, media)
export const deploySchema = baseSchema.extend({
	type: z.literal('deploy'),
	logo: z.enum(logoKeys),
	supports: z.array(z.enum(['static', 'ssr'])),
});

export const backendSchema = baseSchema.extend({
	type: z.literal('backend'),
	stub: z.boolean().default(false),
	logo: z.enum(logoKeys),
});

export const cmsSchema = baseSchema.extend({
	type: z.literal('cms'),
	stub: z.boolean().default(false),
	logo: z.enum(logoKeys),
	featuredListing: z
		.object({
			tagline: z.string().min(30).max(160),
		})
		.optional(),
});

export const mediaSchema = baseSchema.extend({
	type: z.literal('media'),
	stub: z.boolean().default(false),
	logo: z.enum(logoKeys),
});

// Our other schemas (integration, migration, tutorial, recipe)
export const integrationSchema = baseSchema.extend({
	type: z.literal('integration'),
	title: z
		.string()
		.refine(
			(title) => title.startsWith('@astrojs/'),
			'"title" must start with "@astrojs/" for integration docs.'
		),
	category: z.enum(['renderer', 'adapter', 'other']),
	githubIntegrationURL: z.string().url(),
});

export const migrationSchema = baseSchema.extend({
	type: z.literal('migration'),
	framework: z.string(),
	stub: z.boolean().default(false),
});

export const tutorialSchema = baseSchema.extend({
	type: z.literal('tutorial'),
	unitTitle: z.string().optional(),
});

export const recipeSchema = baseSchema.extend({
	type: z.literal('recipe'),
	description: z.string(),
	altTitle: z.string().optional(),
});

export const docsCollectionSchema = z.union([
	baseSchema,
	backendSchema,
	cmsSchema,
	integrationSchema,
	mediaSchema,
	migrationSchema,
	tutorialSchema,
	deploySchema,
	recipeSchema,
]);

const contributorSchema = z.object({
	id: z.number(),
	login: z.string(),
});

export type DocsEntryData = z.infer<typeof docsCollectionSchema>;

export type DocsEntryType = DocsEntryData['type'];

export type DocsEntry<T extends DocsEntryType> = CollectionEntry<'docs'> & {
	data: Extract<DocsEntryData, { type: T }>;
};

export function createIsDocsEntry<T extends DocsEntryType>(type: T) {
	return (entry: CollectionEntry<'docs'>): entry is DocsEntry<T> => entry.data.type === type;
}

export type DeployEntry = DocsEntry<'deploy'>;

export type BackendEntry = DocsEntry<'backend'>;

export type CmsEntry = DocsEntry<'cms'>;

export type IntegrationEntry = DocsEntry<'integration'>;

export type MigrationEntry = DocsEntry<'migration'>;

export type TutorialEntry = DocsEntry<'tutorial'>;

export type RecipeEntry = DocsEntry<'recipe'>;

export type IntegrationCategory = z.infer<typeof integrationSchema>['category'];

export const isBackendEntry = createIsDocsEntry('backend');

export const isCmsEntry = createIsDocsEntry('cms');

export const isDeployEntry = createIsDocsEntry('deploy');

export const isIntegrationEntry = createIsDocsEntry('integration');

export const isTutorialEntry = createIsDocsEntry('tutorial');

export const isMediaEntry = createIsDocsEntry('media');

export const isMigrationEntry = createIsDocsEntry('migration');

export const isRecipeEntry = createIsDocsEntry('recipe');

export function createIsLangEntry(lang: string) {
	return (entry: CollectionEntry<'docs'>): boolean => entry.id.startsWith(lang + '/');
}

export const isEnglishEntry = createIsLangEntry('en');
export const isKoreanEntry = createIsLangEntry('ko');

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({ extend: docsCollectionSchema }),
	}),
	i18n: defineCollection({
		loader: i18nLoader(),
		schema: i18nSchema({ extend: AstroDocsI18nSchema }),
	}),
	// Contributors to the docs repo, updated weekly, sorted number of commits in descending order.
	contributors: defineCollection({
		loader: file('src/data/contributors.json'),
		schema: contributorSchema,
	}),
	// Latest versions of official Astro npm packages.
	packages: defineCollection({
		loader: async () => {
			const packages = [
				'@astrojs/alpinejs',
				'@astrojs/cloudflare',
				'@astrojs/db',
				'@astrojs/markdoc',
				'@astrojs/mdx',
				'@astrojs/netlify',
				'@astrojs/node',
				'@astrojs/partytown',
				'@astrojs/preact',
				'@astrojs/react',
				'@astrojs/rss',
				'@astrojs/sitemap',
				'@astrojs/solid-js',
				'@astrojs/svelte',
				'@astrojs/vercel',
				'@astrojs/vue',
				'astro',
			];
			// See https://github.com/antfu/fast-npm-meta
			const url = `https://npm.antfu.dev/${packages.join('+')}`;
			const data = await fetch(url).then((res) => res.json());
			return data.map((pkg: any) => ({ id: pkg.name, version: pkg.version }));
		},
		schema: z.object({ version: z.string() }),
	}),
	astroContributors: defineCollection({
		loader: async () => {
			const { data } = await fetch('https://astro.badg.es/api/v1/top-contributors.json').then(
				(res) => res.json()
			);
			return data.map((contributor: any) => ({ id: contributor.username, ...contributor }));
		},
		schema: z.object({ avatar_url: z.string() }),
	}),
};
