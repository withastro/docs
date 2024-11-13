import type { StarlightUserConfig } from '@astrojs/starlight/types';

export const sidebar = [
	{
		label: 'Start',
		items: [
			'getting-started',
			{
				label: 'Welcome, World!',
				items: ['concepts/why-astro', 'concepts/islands', 'tutorial/0-introduction'],
			},
			{
				label: 'Start a new project',
				items: ['install-and-setup', 'basics/project-structure'],
			},
			{
				label: 'Configuration',
				items: [
					'guides/configuring-astro',
					'editor-setup',
					'guides/typescript',
					'guides/environment-variables',
					'guides/dev-toolbar',
				],
			},
			{
				label: 'Migrate to Astro',
				collapsed: true,
				autogenerate: { directory: 'guides/migrate-to-astro' },
			},
		],
	},
	{
		label: 'Guides and Recipes',
		items: [
			{
				label: 'Work with components',
				items: [
					'basics/astro-components',
					'guides/imports',
					'basics/astro-syntax',
					'reference/directives-reference',
				],
			},
			{
				label: 'Add content to your site',
				items: [
					'guides/markdown-content',
					'guides/content-collections',
					'guides/images',
					'guides/data-fetching',
					'guides/astro-db',
				],
			},
			{
				label: 'Build your UI',
				items: [
					'basics/layouts',
					'guides/styling',
					'guides/fonts',
					'guides/client-side-scripts',
					'guides/framework-components',
				],
			},
			{
				label: 'Routing and Navigation',
				items: [
					'basics/astro-pages',
					'guides/routing',
					'guides/endpoints',
					'guides/middleware',
					'guides/internationalization',
					'guides/prefetch',
					'guides/view-transitions',
				],
			},
			{
				label: 'Server rendering',
				items: ['guides/on-demand-rendering', 'guides/server-islands', 'guides/actions'],
			},
			{
				label: 'Upgrade',
				items: [
					'upgrade-astro',
					{
						label: 'Content management systems',
						collapsed: true,
						autogenerate: { directory: 'guides/upgrade-to' },
					},
				],
			},
			'guides/troubleshooting',
			{
				label: 'How-to recipes',
				collapsed: true,
				autogenerate: { directory: 'recipes' },
			},
		],
	},
	{
		label: 'Reference',
		items: [
			{
				label: 'Configuration',
				items: ['reference/configuration-reference'],
			},
			{
				label: 'Runtime API',
				items: [
					'reference/api-reference',
					'reference/modules/astro-actions',
					'reference/modules/astro-assets',
					'reference/modules/astro-content',
					'reference/modules/astro-env',
					'reference/modules/astro-i18n',
					'reference/modules/astro-middleware',
					'reference/modules/astro-transitions',
				],
			},
			{
				label: 'CLI',
				items: ['reference/cli-reference'],
			},
			{
				label: 'Errors',
				items: [
					'reference/error-reference',
					{
						label: 'Error messages',
						collapsed: true,
						autogenerate: { directory: 'reference/errors' },
					},
				],
			},
			{
				label: 'Other Development APIs',
				items: [
					'reference/integrations-reference',
					'reference/adapter-reference',
					'reference/content-loader-reference',
					'reference/image-service-reference',
					'reference/dev-toolbar-app-reference',
					'reference/container-reference',
				],
			},
		],
	},
	{
		label: 'Integrations',
		items: [
			'guides/integrations-guide',
			{
				label: 'UI frameworks',
				items: [
					'guides/integrations-guide/alpinejs',
					'guides/integrations-guide/preact',
					'guides/integrations-guide/react',
					'guides/integrations-guide/solid-js',
					'guides/integrations-guide/svelte',
					'guides/integrations-guide/vue',
				],
			},
			{
				label: 'Adapters',
				items: [
					'guides/integrations-guide/cloudflare',
					'guides/integrations-guide/netlify',
					'guides/integrations-guide/node',
					'guides/integrations-guide/vercel',
				],
			},
			{
				label: 'Other official integrations',
				items: [
					'guides/integrations-guide/db',
					'guides/integrations-guide/markdoc',
					'guides/integrations-guide/mdx',
					'guides/integrations-guide/partytown',
					'guides/integrations-guide/sitemap',
					'guides/integrations-guide/tailwind',
				],
			},
			'reference/publish-to-npm',
		],
	},
	{
		label: 'Third-party services',
		items: [
			{
				label: 'Deployment Guides',
				collapsed: true,
				autogenerate: { directory: 'guides/deploy' },
			},
			{
				label: 'Content management systems',
				collapsed: true,
				autogenerate: { directory: 'guides/cms' },
			},
			{
				label: 'Backend services',
				collapsed: true,
				autogenerate: { directory: 'guides/backend' },
			},
			{
				label: 'Hosted media & DAM',
				collapsed: true,
				autogenerate: { directory: 'guides/media' },
			},
			'guides/ecommerce',
			'guides/authentication',
			'guides/testing',
		],
	},
] satisfies StarlightUserConfig['sidebar'];
