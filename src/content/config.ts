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
			extend: z
				.object({
					'a11y.sectionLink': z.string(),
					// Site settings
					'site.title': z.string(),
					// Left Sidebar
					'leftSidebar.sponsoredBy': z.string(),
					// Right Sidebar
					'rightSidebar.community': z.string(),
					'rightSidebar.joinDiscord': z.string(),
					'rightSidebar.contribute': z.string(),
					'rightSidebar.translatePage': z.string(),
					// Footer
					'footer.privacyPolicy': z.string(),
					// Used in `<Since>`: Added in: v0.24.0 [NEW]
					'since.addedIn': z.string(),
					'since.new': z.string(),
					'since.beta': z.string(),
					// Installation Guide
					'install.autoTab': z.string(),
					'install.manualTab': z.string(),
					// `<DeployGuidesNav>` vocabulary
					'deploy.sectionTitle': z.string(),
					'deploy.altSectionTitle': z.string(),
					'deploy.ssrTag': z.string(),
					'deploy.staticTag': z.string(),
					// CMS Guides vocabulary
					'cms.navTitle': z.string(),
					// Media Guides voccabulary
					'media.navTitle': z.string(),
					// Migration Guides vocabulary
					'migration.navTitle': z.string(),
					// `<RecipeLinks>` vocabulary
					'recipesLink.singular': z.string(),
					'recipesLink.plural': z.string(),
					// 404 Page
					'404.title': z.string(),
					'404.content': z.string(),
					'404.linkText': z.string(),
					// Integrations vocabulary
					'integrations.changelog': z.string(),
					'integrations.footerTitle': z.string(),
					'integrations.renderers': z.string(),
					'integrations.adapters': z.string(),
					'integrations.others': z.string(),
					'integrations.more': z.string(),
					// Checklist component
					'checklist.or': z.string(),
					// Multiple Choice component
					'multipleChoice.defaultCorrect': z.string(),
					'multipleChoice.defaultIncorrect': z.string(),
					'multipleChoice.submitLabel': z.string(),
					// Tutorial Progress
					'progress.todo': z.string(),
					'progress.done': z.string(),
					// Tutorial Navigation
					'tutorial.trackerLabel': z.string(),
					'tutorial.unit': z.string(),
					// Tutorial
					'tutorial.getReady': z.string(),
					// Feedback Fish widget
					'feedback.button': z.string(),
					'feedback.a11yLabel': z.string(),
					'feedback.formTitle': z.string(),
					'feedback.categoryGroupLabel': z.string(),
					'feedback.issue': z.string(),
					'feedback.createIssue': z.string(),
					'feedback.createIssue.description': z.string(),
					'feedback.sendFeedback': z.string(),
					'feedback.sendFeedback.description': z.string(),
					'feedback.idea': z.string(),
					'feedback.other': z.string(),
					'feedback.messageA11yLabel': z.string(),
					'feedback.placeholder': z.string(),
					'feedback.submit': z.string(),
					'feedback.close': z.string(),
					'feedback.success': z.string(),
					// Code snippet vocabulary
					'expressiveCode.terminalWindowFallbackTitle': z.string(),
					'expressiveCode.copyButtonTooltip': z.string(),
					'expressiveCode.copyButtonCopied': z.string(),
					// Backend Guides vocabulary
					'backend.navTitle': z.string(),
					// Starlight banner
					'starlight.title': z.string(),
					'starlight.description': z.string(),
					// `<StudioHeading>` component
					'studioHeading.label': z.string(),

					// DocSearch component strings
					// These two keys are Astro Docs-specific and apply to the search box in the header.
					'docsearch.button': z.string(),
					'docsearch.shortcutLabel': z.string(),
					// Search box placeholder text within the DocSearch modal.
					'docsearch.placeholder': z.string(),
					// SEARCH BOX
					'docsearch.modal.searchBox.resetButtonTitle': z.string(),
					'docsearch.modal.searchBox.resetButtonAriaLabel': z.string(),
					'docsearch.modal.searchBox.cancelButtonText': z.string(),
					'docsearch.modal.searchBox.cancelButtonAriaLabel': z.string(),
					'docsearch.modal.searchBox.searchInputLabel': z.string(),
					// START SCREEN
					'docsearch.modal.startScreen.recentSearchesTitle': z.string(),
					'docsearch.modal.startScreen.noRecentSearchesText': z.string(),
					'docsearch.modal.startScreen.saveRecentSearchButtonTitle': z.string(),
					'docsearch.modal.startScreen.removeRecentSearchButtonTitle': z.string(),
					'docsearch.modal.startScreen.favoriteSearchesTitle': z.string(),
					'docsearch.modal.startScreen.removeFavoriteSearchButtonTitle': z.string(),
					// ERROR SCREEN
					'docsearch.modal.errorScreen.titleText': z.string(),
					'docsearch.modal.errorScreen.helpText': z.string(),
					// FOOTER
					'docsearch.modal.footer.selectText': z.string(),
					'docsearch.modal.footer.selectKeyAriaLabel': z.string(),
					'docsearch.modal.footer.navigateText': z.string(),
					'docsearch.modal.footer.navigateUpKeyAriaLabel': z.string(),
					'docsearch.modal.footer.navigateDownKeyAriaLabel': z.string(),
					'docsearch.modal.footer.closeText': z.string(),
					'docsearch.modal.footer.closeKeyAriaLabel': z.string(),
					'docsearch.modal.footer.searchByText': z.string(),
					// NO RESULTS SCREEN
					'docsearch.modal.noResultsScreen.noResultsText': z.string(),
					'docsearch.modal.noResultsScreen.suggestedQueryText': z.string(),
					'docsearch.modal.noResultsScreen.reportMissingResultsText': z.string(),
					'docsearch.modal.noResultsScreen.reportMissingResultsLinkText': z.string(),
				})
				.partial(),
		}),
	}),
};
