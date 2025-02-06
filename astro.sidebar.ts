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
				items: ['install-and-setup', 'basics/project-structure', 'develop-and-build'],
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
					'basics/layouts',
					'guides/styling',
					'guides/fonts',
					'guides/syntax-highlighting',
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
						items: [
							'guides/upgrade-to/v5',
							'guides/upgrade-to/v4',
							'guides/upgrade-to/v3',
							'guides/upgrade-to/v2',
							'guides/upgrade-to/v1',
						],
					}),
				],
			}),
			'guides/troubleshooting',
			group('guides.recipes', { collapsed: true, autogenerate: { directory: 'recipes' } }),
			'contribute',
		],
	}),

	// Reference tab
	group('reference', {
		items: [
			group('reference.syntax', {
				items: ['reference/astro-syntax', 'reference/directives-reference'],
			}),
			'reference/configuration-reference',
			'reference/cli-reference',
			'guides/imports',
			'reference/routing-reference',
			group('reference.runtime', {
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
			}),
			group('reference.other', {
				items: [
					'reference/integrations-reference',
					'reference/adapter-reference',
					'reference/content-loader-reference',
					'reference/image-service-reference',
					'reference/dev-toolbar-app-reference',
					'reference/container-reference',
					'reference/programmatic-reference',
				],
			}),
			group('reference.experimental', {
				items: [
					'reference/experimental-flags',
					'reference/experimental-flags/responsive-images',
					'reference/experimental-flags/svg',
					'reference/experimental-flags/client-prerender',
					'reference/experimental-flags/content-intellisense',
					'reference/experimental-flags/sessions',
					'reference/experimental-flags/serialized-configuration',
				],
			}),
			'reference/legacy-flags',
			'reference/error-reference',
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
