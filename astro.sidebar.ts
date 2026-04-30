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
	// Tutorial tab
	group('tutorial', {
		items: [
			'tutorial/0-introduction',
			'tutorial/1-setup',
			'tutorial/2-pages',
			'tutorial/3-components',
			'tutorial/4-layouts',
			'tutorial/5-astro-api',
			'tutorial/6-islands',
		],
	}),

	// Guide tab
	group('guides', {
		items: [
			group('guides.welcome', {
				items: ['concepts/why-astro', 'concepts/islands', 'astro-courses'],
			}),
			group('guides.newProject', {
				items: ['install-and-setup', 'basics/project-structure', 'develop-and-build'],
			}),
			group('guides.config', {
				items: [
					'guides/configuring-astro',
					'editor-setup',
					'guides/typescript',
					'guides/environment-variables',
					'guides/integrations',
					'guides/build-with-ai',
					'guides/dev-toolbar',
				],
			}),
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
				items: [
					'guides/on-demand-rendering',
					'guides/server-islands',
					'guides/actions',
					'guides/sessions',
				],
			}),
			group('guides.upgrade', {
				items: [
					'upgrade-astro',
					group('guides.upgrade.major', {
						collapsed: true,
						items: [
							'guides/upgrade-to/v6',
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
			group('guides.migrate', {
				collapsed: true,
				autogenerate: { directory: 'guides/migrate-to-astro' },
			}),
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
					'reference/modules/astro-app',
					'reference/modules/astro-assets',
					'reference/modules/astro-config',
					'reference/modules/astro-content',
					'reference/modules/astro-env',
					'reference/modules/astro-i18n',
					'reference/modules/astro-middleware',
					'reference/modules/astro-static-paths',
					'reference/modules/astro-transitions',
					'reference/modules/astro-zod',
				],
			}),
			group('reference.other', {
				items: [
					'reference/integrations-reference',
					'reference/adapter-reference',
					'reference/renderer-reference',
					'reference/content-loader-reference',
					'reference/image-service-reference',
					'reference/dev-toolbar-app-reference',
					'reference/session-driver-reference',
					'reference/font-provider-reference',
					'reference/container-reference',
					'reference/programmatic-reference',
				],
			}),
			group('reference.experimental', {
				items: [
					'reference/experimental-flags',
					'reference/experimental-flags/route-caching',
					'reference/experimental-flags/client-prerender',
					'reference/experimental-flags/content-intellisense',
					'reference/experimental-flags/chrome-devtools-workspace',
					'reference/experimental-flags/svg-optimization',
					'reference/experimental-flags/queued-rendering',
					'reference/experimental-flags/rust-compiler',
					'reference/experimental-flags/logger',
				],
			}),
			'reference/legacy-flags',
			'reference/error-reference',
		],
	}),

	// Ecosystem tab
	group('ecosystem', {
		items: [
			group('ecosystem.integrations.ui', {
				collapsed: true,
				items: [
					'guides/integrations-guide/alpinejs',
					'guides/integrations-guide/preact',
					'guides/integrations-guide/react',
					'guides/integrations-guide/solid-js',
					'guides/integrations-guide/svelte',
					'guides/integrations-guide/vue',
				],
			}),
			group('ecosystem.integrations.adapters', {
				collapsed: true,
				items: [
					'guides/integrations-guide/cloudflare',
					'guides/integrations-guide/netlify',
					'guides/integrations-guide/node',
					'guides/integrations-guide/vercel',
				],
			}),
			group('ecosystem.integrations.other', {
				collapsed: true,
				items: [
					'guides/integrations-guide/db',
					'guides/integrations-guide/markdoc',
					'guides/integrations-guide/mdx',
					'guides/integrations-guide/partytown',
					'guides/integrations-guide/sitemap',
				],
			}),
			group('ecosystem.deployment', {
				collapsed: true,
				autogenerate: { directory: 'guides/deploy' },
			}),
			group('ecosystem.cms', {
				collapsed: true,
				autogenerate: { directory: 'guides/cms' },
			}),
			group('ecosystem.backend', {
				collapsed: true,
				autogenerate: { directory: 'guides/backend' },
			}),
			group('ecosystem.media', {
				collapsed: true,
				autogenerate: { directory: 'guides/media' },
			}),
			'guides/ecommerce',
			'guides/authentication',
			'guides/testing',
		],
	}),
] satisfies StarlightUserConfig['sidebar'];
