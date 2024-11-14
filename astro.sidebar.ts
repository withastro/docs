import type { StarlightUserConfig } from '@astrojs/starlight/types';
import { group } from './config/sidebar';

/**
 * Starlight sidebar configuration object for the global site sidebar.
 *
 * - Top-level groups become tabs.
 * - Use the `group()` utility function to define groups. This uses labels from our
 *   `src/content/nav/*.ts` files instead of defining labels and translations inline.
 *
 */
export const sidebar = [
	// Start tab
	group('start', {
		items: [
			'getting-started',
			group('start.welcome', {
				items: ['concepts/why-astro', 'concepts/islands', 'tutorial/0-introduction'],
			}),
			group('start.newProject', {
				items: ['install-and-setup', 'basics/project-structure'],
			}),
			group('start.config', {
				items: [
					'guides/configuring-astro',
					'editor-setup',
					'guides/typescript',
					'guides/environment-variables',
					'guides/dev-toolbar',
				],
			}),
			group('start.migrate', {
				collapsed: true,
				autogenerate: { directory: 'guides/migrate-to-astro' },
			}),
		],
	}),

	// Guides tab
	group('guides', {
		items: [
			group('guides.routing', {
				items: [
					'basics/astro-pages',
					'guides/routing',
					'guides/endpoints',
					'guides/middleware',
					'guides/internationalization',
					'guides/prefetch',
					'guides/view-transitions',
				],
			}),
			group('guides.ui', {
				items: [
					'basics/astro-components',
					'basics/astro-syntax',
					'basics/layouts',
					'guides/styling',
					'guides/fonts',
					'guides/client-side-scripts',
					'guides/framework-components',
				],
			}),
			group('guides.content', {
				items: [
					'guides/markdown-content',
					'guides/content-collections',
					'guides/images',
					'guides/data-fetching',
					'guides/astro-db',
				],
			}),
			group('guides.serverRendering', {
				items: ['guides/on-demand-rendering', 'guides/server-islands', 'guides/actions'],
			}),
			group('guides.upgrade', {
				items: [
					'upgrade-astro',
					group('guides.upgrade.major', {
						collapsed: true,
						autogenerate: { directory: 'guides/upgrade-to' },
					}),
				],
			}),
			'guides/troubleshooting',
			group('guides.recipes', { collapsed: true, autogenerate: { directory: 'recipes' } }),
		],
	}),

	// Reference tab
	group('reference', {
		items: [
			group('reference.configuration', {
				items: ['reference/configuration-reference'],
			}),
			group('reference.runtime', {
				items: [
					'reference/api-reference',
					'reference/directives-reference',
					'guides/imports',
					'reference/modules/astro-actions',
					'reference/modules/astro-assets',
					'reference/modules/astro-content',
					'reference/modules/astro-env',
					'reference/modules/astro-i18n',
					'reference/modules/astro-middleware',
					'reference/modules/astro-transitions',
				],
			}),
			group('reference.cli', {
				items: ['reference/cli-reference'],
			}),
			group('reference.errors', {
				items: [
					'reference/error-reference',
					group('reference.errors.messages', {
						collapsed: true,
						autogenerate: { directory: 'reference/errors' },
					}),
				],
			}),
			group('reference.other', {
				items: [
					'reference/integrations-reference',
					'reference/adapter-reference',
					'reference/content-loader-reference',
					'reference/image-service-reference',
					'reference/dev-toolbar-app-reference',
					'reference/container-reference',
				],
			}),
		],
	}),

	// Integrations tab
	group('integrations', {
		items: [
			'guides/integrations-guide',
			group('integrations.ui', {
				items: [
					'guides/integrations-guide/alpinejs',
					'guides/integrations-guide/preact',
					'guides/integrations-guide/react',
					'guides/integrations-guide/solid-js',
					'guides/integrations-guide/svelte',
					'guides/integrations-guide/vue',
				],
			}),
			group('integrations.adapters', {
				items: [
					'guides/integrations-guide/cloudflare',
					'guides/integrations-guide/netlify',
					'guides/integrations-guide/node',
					'guides/integrations-guide/vercel',
				],
			}),
			group('integrations.other', {
				items: [
					'guides/integrations-guide/db',
					'guides/integrations-guide/markdoc',
					'guides/integrations-guide/mdx',
					'guides/integrations-guide/partytown',
					'guides/integrations-guide/sitemap',
					'guides/integrations-guide/tailwind',
				],
			}),
			'reference/publish-to-npm',
		],
	}),

	// Third-party services tab
	group('thirdParty', {
		items: [
			group('thirdParty.deployment', {
				collapsed: true,
				autogenerate: { directory: 'guides/deploy' },
			}),
			group('thirdParty.cms', {
				collapsed: true,
				autogenerate: { directory: 'guides/cms' },
			}),
			group('thirdParty.backend', {
				collapsed: true,
				autogenerate: { directory: 'guides/backend' },
			}),
			group('thirdParty.media', {
				collapsed: true,
				autogenerate: { directory: 'guides/media' },
			}),
			'guides/ecommerce',
			'guides/authentication',
			'guides/testing',
		],
	}),
] satisfies StarlightUserConfig['sidebar'];
