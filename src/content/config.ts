import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { defineCollection, z, type CollectionEntry } from 'astro:content';

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

export const deploySchema = baseSchema.extend({
	type: z.literal('deploy'),
});

export const backendSchema = baseSchema.extend({
	type: z.literal('backend'),
	stub: z.boolean().default(false),
	service: z.string(),
});

export const cmsSchema = baseSchema.extend({
	type: z.literal('cms'),
	stub: z.boolean().default(false),
	service: z.string(),
});

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

export const mediaSchema = baseSchema.extend({
	type: z.literal('media'),
	stub: z.boolean().default(false),
	service: z.string(),
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

export const isIntegrationEntry = createIsDocsEntry('integration');

export const isTutorialEntry = createIsDocsEntry('tutorial');

export const isMediaEntry = createIsDocsEntry('media');

export const isMigrationEntry = createIsDocsEntry('migration');

export const isRecipeEntry = createIsDocsEntry('recipe');

export function createIsLangEntry(lang: string) {
	return (entry: CollectionEntry<'docs'>): boolean => entry.slug.startsWith(lang + '/');
}

export const isEnglishEntry = createIsLangEntry('en');
export const isKoreanEntry = createIsLangEntry('ko');

export const collections = {
	docs: defineCollection({ schema: docsSchema({ extend: docsCollectionSchema }) }),
	i18n: defineCollection({
		type: 'data',
		schema: i18nSchema({
			extend: z.object({
				'a11y.sectionLink': z.string().optional(),
				// Site settings
				'site.title': z.string().optional(),
				// Left Sidebar
				'leftSidebar.sponsoredBy': z.string().optional(),
				// Right Sidebar
				'rightSidebar.community': z.string().optional(),
				'rightSidebar.joinDiscord': z.string().optional(),
				'rightSidebar.contribute': z.string().optional(),
				'rightSidebar.translatePage': z.string().optional(),
				// Footer
				'footer.privacyPolicy': z.string().optional(),
				// Used in `<Since>`: Added in: v0.24.0 [NEW]
				'since.addedIn': z.string().optional(),
				'since.new': z.string().optional(),
				'since.beta': z.string().optional(),
				// Installation Guide
				'install.autoTab': z.string().optional(),
				'install.manualTab': z.string().optional(),
				// `<DeployGuidesNav>` vocabulary
				'deploy.sectionTitle': z.string().optional(),
				'deploy.altSectionTitle': z.string().optional(),
				'deploy.ssrTag': z.string().optional(),
				'deploy.staticTag': z.string().optional(),
				// CMS Guides vocabulary
				'cms.navTitle': z.string().optional(),
				// Media Guides voccabulary
				'media.navTitle': z.string().optional(),
				// Migration Guides vocabulary
				'migration.navTitle': z.string().optional(),
				// `<RecipeLinks>` vocabulary
				'recipesLink.singular': z.string().optional(),
				'recipesLink.plural': z.string().optional(),
				// 404 Page
				'404.title': z.string().optional(),
				'404.content': z.string().optional(),
				'404.linkText': z.string().optional(),
				// Integrations vocabulary
				'integrations.changelog': z.string().optional(),
				'integrations.footerTitle': z.string().optional(),
				'integrations.renderers': z.string().optional(),
				'integrations.adapters': z.string().optional(),
				'integrations.others': z.string().optional(),
				'integrations.more': z.string().optional(),
				// Checklist component
				'checklist.or': z.string().optional(),
				// Multiple Choice component
				'multipleChoice.defaultCorrect': z.string().optional(),
				'multipleChoice.defaultIncorrect': z.string().optional(),
				'multipleChoice.submitLabel': z.string().optional(),
				// Tutorial Progress
				'progress.todo': z.string().optional(),
				'progress.done': z.string().optional(),
				// Tutorial Navigation
				'tutorial.trackerLabel': z.string().optional(),
				'tutorial.unit': z.string().optional(),
				// Tutorial
				'tutorial.getReady': z.string().optional(),
				// Feedback Fish widget
				'feedback.button': z.string().optional(),
				'feedback.a11yLabel': z.string().optional(),
				'feedback.formTitle': z.string().optional(),
				'feedback.categoryGroupLabel': z.string().optional(),
				'feedback.issue': z.string().optional(),
				'feedback.createIssue': z.string().optional(),
				'feedback.createIssue.description': z.string().optional(),
				'feedback.sendFeedback': z.string().optional(),
				'feedback.sendFeedback.description': z.string().optional(),
				'feedback.idea': z.string().optional(),
				'feedback.other': z.string().optional(),
				'feedback.messageA11yLabel': z.string().optional(),
				'feedback.placeholder': z.string().optional(),
				'feedback.submit': z.string().optional(),
				'feedback.close': z.string().optional(),
				'feedback.success': z.string().optional(),
				// Code snippet vocabulary
				'expressiveCode.terminalWindowFallbackTitle': z.string().optional(),
				'expressiveCode.copyButtonTooltip': z.string().optional(),
				'expressiveCode.copyButtonCopied': z.string().optional(),
				// Backend Guides vocabulary
				'backend.navTitle': z.string().optional(),
				// Starlight banner
				'starlight.title': z.string().optional(),
				'starlight.description': z.string().optional(),
				// `<StudioHeading>` component
				'studioHeading.label': z.string().optional(),
			}),
		}),
	}),
};
