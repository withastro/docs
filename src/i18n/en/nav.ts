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
	{ text: 'Migration Guide', slug: 'migrate', key: 'migrate' },
	// REMOVE "Built with Astro": (Move into astro.build)
	{ text: 'Built with Astro', slug: 'integrations/integrations', key: 'integrations/integrations' },
	{ text: 'Astro vs. X', slug: 'comparing-astro-vs-other-tools', key: 'comparing-astro-vs-other-tools' },

	{ text: 'Core Concepts', header: true, type: 'learn', key: 'coreConcepts' },
	// ADD: Why Astro?
	{ text: 'Partial Hydration', slug: 'core-concepts/partial-hydration', key: 'core-concepts/partial-hydration' },
	{ text: 'Sharing State', slug: 'core-concepts/sharing-state', key: 'core-concepts/sharing-state' },

	{ text: 'Basics', header: true, type: 'learn', key: 'basics' },
	{ text: 'Project Structure', slug: 'core-concepts/project-structure', key: 'core-concepts/project-structure' },
	{ text: 'Components', slug: 'core-concepts/astro-components', key: 'core-concepts/astro-components' },
	{ text: 'Pages', slug: 'core-concepts/astro-pages', key: 'core-concepts/astro-pages' },
	{ text: 'Layouts', slug: 'core-concepts/layouts', key: 'core-concepts/layouts' },
	{ text: 'Markdown', slug: 'guides/markdown-content', key: 'guides/markdown-content' },
	{ text: 'Routing', slug: 'core-concepts/routing', key: 'core-concepts/routing' },
	{ text: 'Static Assets', slug: 'guides/imports', key: 'guides/imports' },
	{ text: 'Troubleshooting', slug: 'guides/troubleshooting', key: 'guides/troubleshooting' },
	{ text: 'Deploy', slug: 'guides/deploy', key: 'guides/deploy' },


	{ text: 'Features', header: true, type: 'learn', key: 'features' },
	{ text: 'Configuring Astro', slug: 'guides/configuring-astro', key: 'guides/configuring-astro' },
	{ text: 'CSS & Styling', slug: 'guides/styling', key: 'guides/styling' },
	{ text: 'Data Fetching', slug: 'guides/data-fetching', key: 'guides/data-fetching' },
	{ text: 'Environment Variables', slug: 'guides/environment-variables', key: 'guides/environment-variables' },
	{ text: 'Import Aliases', slug: 'guides/aliases', key: 'guides/aliases' },
	{ text: 'Integrations', slug: 'guides/integrations-guide', key: 'guides/integrations-guide' },
	{ text: 'RSS', slug: 'guides/rss', key: 'guides/rss' },
	{ text: 'Server-side Rendering (SSR)', slug: 'guides/server-side-rendering', key: 'guides/server-side-rendering' },
	{ text: 'TypeScript', slug: 'guides/typescript', key: 'guides/typescript' },
	{ text: 'UI Frameworks', slug: 'core-concepts/framework-components', key: 'core-concepts/framework-components' },

	{ text: 'Reference', header: true, type: 'api', key: 'reference' },
	{ text: 'Configuration', slug: 'reference/configuration-reference', key: 'reference/configuration-reference' },
	{ text: 'CLI', slug: 'reference/cli-reference', key: 'reference/cli-reference' },
	{ text: 'Runtime API', slug: 'reference/api-reference', key: 'reference/api-reference' },
	{ text: 'Integrations API', slug: 'reference/integrations-reference', key: 'reference/integrations-reference' },
	{ text: 'Adapter API', slug: 'reference/adapter-reference', key: 'reference/adapter-reference' },
	{ text: 'Template Directives', slug: 'reference/directives-reference', key: 'reference/directives-reference' },
	{ text: 'NPM Package Format', slug: 'guides/publish-to-npm', key: 'guides/publish-to-npm' },
] as const;
