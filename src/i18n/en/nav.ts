/**
 * This configures the navigation sidebar.
 * All other languages follow this ordering/structure and will fall back to
 * English for any entries they haven’t translated.
 *
 * - All entries MUST include `text` and `key`
 * - Heading entries MUST include `header: true` and `type`
 * - Link entries MUST include `slug` (which excludes the language code)
 */
export default [
	{ text: 'Start Here', header: true, type: 'learn', key: 'startHere' },
	{ text: 'Getting Started', slug: 'getting-started', key: 'getting-started' },
	{ text: 'Installation', slug: 'install/auto', key: 'install' },
	{ text: 'Editor Setup', slug: 'editor-setup', key: 'editor-setup' },
	{ text: 'Upgrade to v3', slug: 'guides/upgrade-to/v3', key: 'guides/upgrade-to/v3' },

	{ text: 'Core Concepts', header: true, type: 'learn', key: 'coreConcepts' },
	{ text: 'Why Astro?', slug: 'concepts/why-astro', key: 'concepts/why-astro' },
	{ text: 'Islands', slug: 'concepts/islands', key: 'concepts/islands' },
	{ text: 'SSR vs. SSG', slug: 'concepts/ssr-vs-ssg', key: 'concepts/ssr-vs-ssg' },

	{ text: 'Tutorials', header: true, type: 'learn', key: 'tutorials' },
	{ text: 'Build a Blog', slug: 'tutorial/0-introduction', key: 'blog-tutorial' },
	{
		text: 'Extend with Content Collections',
		slug: 'tutorials/add-content-collections',
		key: 'add-collections-tutorial',
	},
	{
		text: 'Extend with View Transitions',
		slug: 'tutorials/add-view-transitions',
		key: 'add-transitions-tutorial',
	},
	// { text: 'Thinking with Islands', slug: 'tutorial/0-introduction', key: 'island-tutorial' },

	{ text: 'Basics', header: true, type: 'learn', key: 'basics' },

	{
		text: 'Project Structure',
		slug: 'core-concepts/project-structure',
		key: 'core-concepts/project-structure',
	},
	{
		text: 'Components',
		slug: 'core-concepts/astro-components',
		key: 'core-concepts/astro-components',
	},
	{ text: 'Pages', slug: 'core-concepts/astro-pages', key: 'core-concepts/astro-pages' },
	{ text: 'Layouts', slug: 'core-concepts/layouts', key: 'core-concepts/layouts' },
	{
		text: 'Astro Template Syntax',
		slug: 'core-concepts/astro-syntax',
		key: 'core-concepts/astro-syntax',
	},

	{ text: 'Built-ins', header: true, type: 'learn', key: 'builtins' },
	{
		text: 'Content Collections',
		slug: 'guides/content-collections',
		key: 'guides/content-collections',
	},
	{
		text: 'View Transitions',
		slug: 'guides/view-transitions',
		key: 'guides/view-transitions',
	},
	{
		text: 'Prefetch',
		slug: 'guides/prefetch',
		key: 'guides/prefetch',
	},

	{ text: 'Add-ons', header: true, type: 'learn', key: 'addons' },
	{ text: 'Add integrations', slug: 'guides/integrations-guide', key: 'guides/integrations-guide' },
	{
		text: 'UI Frameworks',
		slug: 'core-concepts/framework-components',
		key: 'core-concepts/framework-components',
	},
	{
		text: 'SSR Adapters',
		slug: 'guides/server-side-rendering',
		key: 'guides/server-side-rendering',
	},

	{ text: 'Recipes', header: true, type: 'learn', key: 'examples' },
	{ text: 'Migrate to Astro', slug: 'guides/migrate-to-astro', key: 'guides/migrate-to-astro' },
	{ text: 'Connect a CMS', slug: 'guides/cms', key: 'guides/cms' },
	{ text: 'Add backend services', slug: 'guides/backend', key: 'guides/backend' },
	{ text: 'Deploy your site', slug: 'guides/deploy', key: 'guides/deploy' },
	{ text: 'More recipes', slug: 'recipes', key: 'guides/recipes' },

	{ text: 'Guides', header: true, type: 'learn', key: 'features' },
	{ text: 'Routing', slug: 'core-concepts/routing', key: 'core-concepts/routing' },
	{ text: 'Markdown', slug: 'guides/markdown-content', key: 'guides/markdown-content' },
	{
		text: 'Scripts & Event Handling',
		slug: 'guides/client-side-scripts',
		key: 'guides/client-side-scripts',
	},
	{ text: 'CSS & Styling', slug: 'guides/styling', key: 'guides/styling' },
	{ text: 'Images', slug: 'guides/images', key: 'guides/images' },
	{ text: 'Fonts', slug: 'guides/fonts', key: 'guides/fonts' },
	{ text: 'Imports', slug: 'guides/imports', key: 'guides/imports' },
	{ text: 'Endpoints', slug: 'core-concepts/endpoints', key: 'core-concepts/endpoints' },
	{ text: 'Data Fetching', slug: 'guides/data-fetching', key: 'guides/data-fetching' },
	{
		text: 'Internationalization',
		slug: 'guides/internationalization',
		key: 'guides/internationalization',
	},
	{ text: 'Embedded SPAs', slug: 'concepts/embedded-web-apps', key: 'concepts/embedded-web-apps' },
	{ text: 'Middleware', slug: 'guides/middleware', key: 'guides/middleware' },
	{ text: 'Testing', slug: 'guides/testing', key: 'guides/testing' },
	{ text: 'Troubleshooting', slug: 'guides/troubleshooting', key: 'guides/troubleshooting' },

	{ text: 'Configuration', header: true, type: 'learn', key: 'configuration' },
	{
		text: 'The Astro Config File',
		slug: 'guides/configuring-astro',
		key: 'guides/configuring-astro',
	},
	{ text: 'TypeScript', slug: 'guides/typescript', key: 'guides/typescript' },
	{ text: 'Import Aliases', slug: 'guides/aliases', key: 'guides/aliases' },
	{
		text: 'Environment Variables',
		slug: 'guides/environment-variables',
		key: 'guides/environment-variables',
	},

	{ text: 'Reference', header: true, type: 'api', key: 'reference' },
	{
		text: 'Configuration',
		slug: 'reference/configuration-reference',
		key: 'reference/configuration-reference',
	},
	{ text: 'Runtime API', slug: 'reference/api-reference', key: 'reference/api-reference' },
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
		text: 'Dev Overlay Plugin API',
		slug: 'reference/dev-overlay-plugin-reference',
		key: 'reference/dev-overlay-plugin-reference',
	},
	{
		text: 'Template Directives',
		slug: 'reference/directives-reference',
		key: 'reference/directives-reference',
	},
	{ text: 'The Astro CLI', slug: 'reference/cli-reference', key: 'reference/cli-reference' },
	{
		text: 'Error Reference',
		slug: 'reference/error-reference',
		key: 'reference/error-reference',
	},
	{ text: 'NPM Package Format', slug: 'reference/publish-to-npm', key: 'guides/publish-to-npm' },
] as const;
