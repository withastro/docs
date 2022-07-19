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
	{ text: 'Sharing State', slug: 'core-concepts/sharing-state', key: 'core-concepts/sharing-state' },

	{ text: 'Reference', header: true, type: 'learn', key: 'reference' },
	{ text: 'Configuration', slug: 'reference/configuration-reference', key: 'reference/configuration-reference' },
	{ text: 'CLI', slug: 'reference/cli-reference', key: 'reference/cli-reference' },
	{ text: 'Runtime API', slug: 'reference/api-reference', key: 'reference/api-reference' },
	{ text: 'Integrations API', slug: 'reference/integrations-reference', key: 'reference/integrations-reference' },
	{ text: 'Adapter API', slug: 'reference/adapter-reference', key: 'reference/adapter-reference' },
	{ text: 'Template Directives', slug: 'reference/directives-reference', key: 'reference/directives-reference' },
	{ text: 'NPM Package Format', slug: 'guides/publish-to-npm', key: 'guides/publish-to-npm' },

	{ text: 'Tutorial', header: true, type: 'tutorial', key: 'tut/0' },
	{ text: '0.0. Introduction', slug: 'tutorial/0-introduction', key: 'tut/0/0' },
	{ text: '0.1. Background Knowledge', slug: 'tutorial/0-introduction/1', key: 'tut/0/1' },

	// { text: 'Setup', header: true, type: 'tutorial', key: 'tut/1' },
	{ text: '1.0. Setup', slug: 'tutorial/1-setup', key: 'tut/1/0' },
	{ text: '1.1. Create a new project', slug: 'tutorial/1-setup/1', key: 'tut/1/1' },
	{ text: '1.2. Connect to GitHub / Netlify', slug: 'tutorial/1-setup/2', key: 'tut/1/2' },

	// { text: 'Astro Pages', header: true, type: 'tutorial', key: 'tut/2' },
	{ text: '2.0. Astro Pages', slug: 'tutorial/2-astro-pages', key: 'tut/2/0' },
	{ text: '2.1. About Page', slug: 'tutorial/2-astro-pages/1', key: 'tut/2/1' },
	{ text: '2.2. Astro Script', slug: 'tutorial/2-astro-pages/2', key: 'tut/2/2' },
	{ text: '2.3. Astro Script 2', slug: 'tutorial/2-astro-pages/3', key: 'tut/2/3' },
	{ text: '2.4. Astro Style Tag', slug: 'tutorial/2-astro-pages/4', key: 'tut/2/4' },

	// { text: 'Astro Components', header: true, type: 'tutorial', key: 'tut/3' },
	{ text: '3.0. Astro Components', slug: 'tutorial/3-components', key: 'tut/3/0' },
	{ text: '3.1. Navigation Component', slug: 'tutorial/3-components/1', key: 'tut/3/1' },
	{ text: '3.2. Component Props', slug: 'tutorial/3-components/2', key: 'tut/3/2' },
	{ text: '3.3. Layout Component', slug: 'tutorial/3-components/3', key: 'tut/3/3' },

	// { text: 'Markdown Blog Posts', header: true, type: 'tutorial', key: 'tut/4' },
	{ text: '4.0. Markdown Blog Posts', slug: 'tutorial/4-markdown', key: 'tut/4/0' },
	{ text: '4.1. Create a Blog Post', slug: 'tutorial/4-markdown/1', key: 'tut/4/1' },
	{ text: '4.2. Using Markdown Frontmatter', slug: 'tutorial/4-markdown/2', key: 'tut/4/2' },
	{ text: '4.3. Adding Blog Pages', slug: 'tutorial/4-markdown/3', key: 'tut/4/3' },

	// { text: 'Using the API', header: true, type: 'tutorial', key: 'tut/5' },
	{ text: '5.0. Using Astro’s API', slug: 'tutorial/5-astro-api', key: 'tut/5/0' },
	{ text: '5.1. Using Astro.glob()', slug: 'tutorial/5-astro-api/1', key: 'tut/5/1' },
	{ text: '5.2. Dynamic Routing', slug: 'tutorial/5-astro-api/2', key: 'tut/5/2' },
	{ text: '5.3. Tag Index Page', slug: 'tutorial/5-astro-api/3', key: 'tut/5/3' },
	{ text: '5.4. RSS Feed', slug: 'tutorial/5-astro-api/4', key: 'tut/5/4' },

	// { text: 'Interactivity', header: true, type: 'tutorial', key: 'tut/6' },
	{ text: '6.0. Interactivity', slug: 'tutorial/6-interactivity', key: 'tut/6/0' },
	{ text: '6.1. Theme Toggle', slug: 'tutorial/6-interactivity/1', key: 'tut/6/1' },
	{ text: '6.2. Responsive Nav', slug: 'tutorial/6-interactivity/2', key: 'tut/6/2' },
	{ text: '6.3. UI Frameworks', slug: 'tutorial/6-interactivity/3', key: 'tut/6/3' },
] as const;
