import starlight from '@astrojs/starlight';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { defineConfig, sharpImageService } from 'astro/config';
import { makeLocalesConfig } from './config/locales';

import rehypeSlug from 'rehype-slug';
import remarkSmartypants from 'remark-smartypants';

import { sitemap } from './integrations/sitemap';
import { rehypeAutolink } from './plugins/rehype-autolink';
import { rehypeTasklistEnhancer } from './plugins/rehype-tasklist-enhancer';
import { remarkFallbackLang } from './plugins/remark-fallback-lang';

/* https://docs.netlify.com/configure-builds/environment-variables/#read-only-variables */
const NETLIFY_PREVIEW_SITE = process.env.CONTEXT !== 'production' && process.env.DEPLOY_PRIME_URL;

const site = NETLIFY_PREVIEW_SITE || 'https://docs.astro.build/';

// https://astro.build/config
export default defineConfig({
	site,
	integrations: [
		starlight({
			title: 'Docs',
			customCss: ['./src/styles/custom.css'],
			expressiveCode: {
				plugins: [pluginCollapsibleSections()],
			},
			components: {
				EditLink: './src/components/starlight/EditLink.astro',
				Head: './src/components/starlight/Head.astro',
				Hero: './src/components/starlight/Hero.astro',
				MarkdownContent: './src/components/starlight/MarkdownContent.astro',
				MobileTableOfContents: './src/components/starlight/MobileTableOfContents.astro',
				TableOfContents: './src/components/starlight/TableOfContents.astro',
				PageSidebar: './src/components/starlight/PageSidebar.astro',
				Pagination: './src/components/starlight/Pagination.astro',
				Footer: './src/components/starlight/Footer.astro',
				SiteTitle: './src/components/starlight/SiteTitle.astro',
				// Search: './src/components/starlight/Search.astro',
				Sidebar: './src/components/starlight/Sidebar.astro',
				MobileMenuFooter: './src/components/starlight/MobileMenuFooter.astro',
				PageTitle: './src/components/starlight/PageTitle.astro',
			},
			editLink: {
				baseUrl: 'https://github.com/withastro/docs/edit/5.0.0-beta',
			},
			defaultLocale: 'en',
			locales: makeLocalesConfig(),
			sidebar: [
				{
					label: 'Start',
					items: [
						'getting-started',						
						{
							label: 'Welcome, World!',
							items: [
								'concepts/why-astro',
								'concepts/islands',
								'tutorial/0-introduction',
							],
						},
						{
							label: 'Start a new project',
							items: [
								'install-and-setup',
								'basics/project-structure',
							],
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
							items: [
								'guides/on-demand-rendering',
								'guides/server-islands',
								'guides/actions',
							],
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
							items: [
								'reference/configuration-reference',
							],
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
							items: [
								'reference/cli-reference',
							],
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
			],
			social: {
				github: 'https://github.com/withastro/astro',
				discord: 'https://astro.build/chat',
			},
			// pagefind: false,
			head: [
				// Add ICO favicon fallback for Safari.
				{
					tag: 'link',
					attrs: {
						rel: 'icon',
						href: '/favicon.ico',
						sizes: '32x32',
					},
				},
			],
			disable404Route: true,
		}),
		sitemap(),
	],
	trailingSlash: 'always',
	scopedStyleStrategy: 'where',
	compressHTML: false,
	markdown: {
		// Override with our own config
		smartypants: false,
		remarkPlugins: [
			[remarkSmartypants, { dashes: false }],
			// Add our custom plugin that marks links to fallback language pages
			remarkFallbackLang(),
		],
		rehypePlugins: [
			rehypeSlug,
			// This adds links to headings
			...rehypeAutolink(),
			// Tweak GFM task list syntax
			rehypeTasklistEnhancer(),
		],
	},
	image: {
		domains: ['avatars.githubusercontent.com'],
		service: sharpImageService(),
	},
	experimental: {
		contentCollectionCache: false,
		directRenderScript: true,
	},
});
