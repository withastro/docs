import { z } from 'astro/zod';

export const AstroDocsI18nSchema = z
	.object({
		'a11y.sectionLink': z.string(),
		// Site settings
		'site.title': z.string(),
		// Left Sidebar
		'leftSidebar.sponsoredBy': z.string(),
		// Footer
		'footer.community': z.string(),
		'footer.contribute': z.string(),
		'footer.translatePage': z.string(),
		'footer.sponsor': z.string(),
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
		// Media Guides vocabulary
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
		// Upgrade guide
		'upgrade.implementationPR': z.string(),

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
	.partial();
