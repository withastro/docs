import starlight from '@astrojs/starlight';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { defineConfig, sharpImageService } from 'astro/config';
import { makeLocalesConfig } from './config/locales';

import rehypeSlug from 'rehype-slug';
import remarkSmartypants from 'remark-smartypants';

import { sidebar } from './astro.sidebar';
import { sitemap } from './integrations/sitemap';
import { starlightPluginAutolinkHeadings } from './plugins/rehype-autolink';
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
			sidebar,
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
			plugins: [starlightPluginAutolinkHeadings()],
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
