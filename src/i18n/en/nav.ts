/**
 * This configures the navigation sidebar.
 * All other languages follow this ordering/structure and will fall back to
 * English for any entries they haven’t translated.
 *
 * - All entries MUST include `text` and `key`
 * - The first entry MUST be a heading
 * - Heading entries MUST include `header: true` and `type`
 * - Heading entries MAY include `nested: true` to move that heading and following links under the previous unnested heading
 * - Heading entries MAY include `collapsed: true` to mark it and its children as collapsed by default
 * - Link entries MUST include `slug` (which excludes the language code)
 *
 * For translators:
 *
 * Copy the English `key` value unchanged and translate only the `text` into your language:
 *
 * `src/i18n/en/nav.ts`: `{ text: 'Getting Started', slug: 'getting-started', key: 'getting-started' },`
 * `src/i18n/ja/nav.ts`: `'getting-started': 'はじめに',`
 */

export default [
	{ text: 'Welcome, World!', header: true, type: 'learn', key: 'welcomeWorld' },
	{ text: 'Upgrade to v5-beta', slug: '/guides/upgrade-to/v5/', key: '/guides/upgrade-to/v5/' },
	{ text: 'Getting Started', slug: 'getting-started', key: 'getting-started' },
	{ text: 'Installation and Setup', slug: 'install-and-setup', key: 'install-and-setup' },
	{ text: 'Deploy Your Site', slug: 'guides/deploy', key: 'guides/deploy' },
	{ text: 'Migrate to Astro', slug: 'guides/migrate-to-astro', key: 'guides/migrate-to-astro' },
	{ text: 'Tutorial: Build a Blog', slug: 'tutorial/0-introduction', key: 'blog-tutorial' },

	{ text: 'Core Concepts', header: true, type: 'learn', key: 'coreConcepts' },
	{ text: 'Why Astro?', slug: 'concepts/why-astro', key: 'concepts/why-astro' },
	{ text: 'Astro Islands', slug: 'concepts/islands', key: 'concepts/islands' },

	{ text: 'Learn the Basics', header: true, type: 'learn', key: 'basics' },
	{ text: 'Project Structure', slug: 'basics/project-structure', key: 'basics/project-structure' },
	{ text: 'Components', slug: 'basics/astro-components', key: 'basics/astro-components' },
	{ text: 'Pages', slug: 'basics/astro-pages', key: 'basics/astro-pages' },
	{ text: 'Layouts', slug: 'basics/layouts', key: 'basics/layouts' },
	{ text: 'Astro Template Syntax', slug: 'basics/astro-syntax', key: 'basics/astro-syntax' },
	{ text: 'Imports', slug: 'guides/imports', key: 'guides/imports' },
	{ text: 'Integrations', slug: 'guides/integrations-guide', key: 'guides/integrations-guide' },

	{ text: 'Manage your Content', header: true, type: 'learn', key: 'work-content' },
	{ text: 'Markdown', slug: 'guides/markdown-content', key: 'guides/markdown-content' },
	{ text: 'Content collections', slug: 'guides/content-collections', key: 'guides/content-collections' },
	{ text: 'Connect a CMS', slug: 'guides/cms', key: 'guides/cms' },
	{ text: 'Add an RSS feed', slug: 'guides/rss', key: 'guides/rss' },

	{ text: 'Routes and Navigation', header: true, type: 'learn', key: 'routes' },
	{ text: 'Routing', slug: 'guides/routing', key: 'guides/routing' },
	{ text: 'Endpoints', slug: 'guides/endpoints', key: 'guides/endpoints' },
	{ text: 'Actions', slug: 'guides/actions', key: 'guides/actions' },
	{ text: 'Prefetch', slug: 'guides/prefetch', key: 'guides/prefetch' },
	{ text: 'Middleware', slug: 'guides/middleware', key: 'guides/middleware' },
	{
		text: 'Internationalization',
		slug: 'guides/internationalization',
		key: 'guides/internationalization',
	},
	{ text: 'View Transitions', slug: 'guides/view-transitions', key: 'guides/view-transitions' },
	{ text: 'Server Islands', slug: 'guides/server-islands', key: 'guides/server-islands' },
	{ text: 'On-demand rendering', slug: 'guides/on-demand-rendering', key: 'guides/on-demand-rendering' },

	{ text: 'Assets', header: true, type: 'learn', key: 'assets' },
	{ text: 'CSS & Styling', slug: 'guides/styling', key: 'guides/styling' },
	{ text: 'Images', slug: 'guides/images', key: 'guides/images' },
	{ text: 'Fonts', slug: 'guides/fonts', key: 'guides/fonts' },
	{
		text: 'Syntax Highlighting',
		slug: 'guides/syntax-highlighting',
		key: 'guides/syntax-highlighting',
	},
	{ text: 'Connect Hosted Media or DAM', slug: 'guides/media', key: 'guides/media' },

	{ text: 'Connect Your Data', header: true, type: 'learn', key: 'data' },
	{ text: 'Data Fetching', slug: 'guides/data-fetching', key: 'guides/data-fetching' },
	{ text: 'Astro DB', slug: 'guides/astro-db', key: 'guides/astro-db' },
	{ text: 'Add Backend Services', slug: 'guides/backend', key: 'guides/backend' },
	{ text: 'E-commerce', slug: 'guides/ecommerce', key: 'guides/ecommerce' },
	{ text: 'Authentication', slug: 'guides/authentication', key: 'guides/authentication' },
	{
		text: 'Environment Variables',
		slug: 'guides/environment-variables',
		key: 'guides/environment-variables',
	},

	{ text: 'Client-Side Interactivity', header: true, type: 'learn', key: 'clientSide' },
	{
		text: 'UI Frameworks',
		slug: 'guides/framework-components',
		key: 'guides/framework-components',
	},
	{
		text: 'Scripts & Event Handling',
		slug: 'guides/client-side-scripts',
		key: 'guides/client-side-scripts',
	},

	{ text: 'Maintain Your Project', header: true, type: 'learn', key: 'maintain' },
	{ text: 'Upgrade Astro', slug: 'upgrade-astro', key: 'upgrade-astro' },
	{ text: 'Testing', slug: 'guides/testing', key: 'guides/testing' },
	{ text: 'Troubleshooting', slug: 'guides/troubleshooting', key: 'guides/troubleshooting' },

	{ text: 'Recipes and Resources', header: true, type: 'learn', key: 'communityResources' },

	{ text: 'How-to Recipes', slug: 'recipes', key: 'recipes' },
	{
		text: 'Community Resources',
		slug: 'community-resources/content',
		key: 'community-resources/content',
	},

	{ text: 'Reference', header: true, type: 'api', key: 'reference' },
	{
		text: 'Configuration',
		slug: 'reference/configuration-reference',
		key: 'reference/configuration-reference',
	},

	{ text: 'Astro CLI', slug: 'reference/cli-reference', key: 'reference/cli-reference' },
	{
		text: 'Directives Reference',
		slug: 'reference/directives-reference',
		key: 'reference/directives-reference',
	},
	{ text: 'TypeScript Reference', slug: 'guides/typescript', key: 'guides/typescript' },
	{ text: 'Error Reference', slug: 'reference/error-reference', key: 'reference/error-reference' },

	{ text: 'Astro API Reference', header: true, type: 'api', key: 'api-reference' },
	{ text: 'Astro Runtime API', slug: 'reference/api-reference', key: 'reference/api-reference' },
	{
		text: 'astro:actions',
		slug: 'reference/modules/astro-actions',
		key: 'reference/modules/astro-actions',
	},
	{
		text: 'astro:assets',
		slug: 'reference/modules/astro-assets',
		key: 'reference/modules/astro-assets',
	},
	{
		text: 'astro:content',
		slug: 'reference/modules/astro-content',
		key: 'reference/modules/astro-content',
	},
	{
		text: 'astro:env',
		slug: 'reference/modules/astro-env',
		key: 'reference/modules/astro-env',
	},
	{ text: 'astro:i18n', slug: 'reference/modules/astro-i18n', key: 'reference/modules/astro-i18n' },
	{
		text: 'astro:middleware',
		slug: 'reference/modules/astro-middleware',
		key: 'reference/modules/astro-middleware',
	},
	{
		text: 'astro:transitions',
		slug: 'reference/modules/astro-transitions',
		key: 'reference/modules/astro-transitions',
	},

	{ text: 'Other Development APIs', header: true, type: 'api', key: 'dev' },
	{
		text: 'Integrations API',
		slug: 'reference/integrations-reference',
		key: 'reference/integrations-reference',
	},
	{ text: 'Adapter API', slug: 'reference/adapter-reference', key: 'reference/adapter-reference' },
	{
		text: 'Image Service API',
		slug: 'reference/image-service-reference',
		key: 'reference/image-service-reference',
	},
	{
		text: 'Dev Toolbar App API',
		slug: 'reference/dev-toolbar-app-reference',
		key: 'reference/dev-toolbar-app-reference',
	},
	{
		text: 'Content Loader API',
		slug: 'reference/content-loader-reference',
		key: 'reference/content-loader-reference',
	},
	{
		text: 'Container API (Experimental)',
		slug: 'reference/container-reference',
		key: 'reference/container-reference',
	},

	// { text: 'Configuration', header: true, type: 'learn', key: 'configuration' },
	// {
	// 	text: 'The Astro Config File',
	// 	slug: 'guides/configuring-astro',
	// 	key: 'guides/configuring-astro',
	// },
	// { text: 'TypeScript', slug: 'guides/typescript', key: 'guides/typescript' },
	// { text: 'Import Aliases', slug: 'guides/aliases', key: 'guides/aliases' },
	// {
	// 	text: 'Environment Variables',
	// 	slug: 'guides/environment-variables',
	// 	key: 'guides/environment-variables',
	// },
] satisfies NavEntry[];

type NavEntry = {
	/** The visible label for this link or heading. */
	text: string;
	/**
	 * A unique key for this entry. Used in translation files to provide a translation for this entry’s label.
	 * Often the same as `slug` for links (but doesn’t have to be).
	 */
	key: string;
} & (
	| {
			/** The content collection slug for this page *without* the language code. */
			slug: string;
	  }
	| {
			/** Marks this entry as a group heading and starts a new group. */
			header: true;
			/** Whether this group is in the learn or API category (currently unused). */
			type: 'learn' | 'api';
			/** Whether this group should be nested inside the preceding group. */
			nested?: boolean;
			/** Whether this group should be collapsed by default. */
			collapsed?: boolean;
	  }
);
