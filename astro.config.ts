import { defineConfig, sharpImageService } from 'astro/config';
import { makeLocalesConfig } from './config/locales';
import { makeSidebar } from './config/sidebar';
import { rehypeAutolink } from './plugins/rehype-autolink';
import { rehypeTasklistEnhancer } from './plugins/rehype-tasklist-enhancer';
import { remarkFallbackLang } from './plugins/remark-fallback-lang';
import { sitemap } from './integrations/sitemap';
import rehypeSlug from 'rehype-slug';
import remarkSmartypants from 'remark-smartypants';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import json5Plugin from 'vite-plugin-json5'
import { builtinModules } from 'module';

/* https://vercel.com/docs/projects/environment-variables/system-environment-variables#system-environment-variables */
const VERCEL_PREVIEW_SITE =
	process.env.VERCEL_ENV !== 'production' &&
	process.env.VERCEL_URL &&
	`https://${process.env.VERCEL_URL}`;

const site = VERCEL_PREVIEW_SITE || 'https://docs.prosopo.io/';

const allExternal = [
	...builtinModules,
	...builtinModules.map((m) => `node:${m}`)
]

// https://astro.build/config
export default defineConfig({
	site,

	integrations: [
		starlight({
			title: 'Docs',

			customCss: ['./src/styles/custom.css', './src/styles/tailwind.css'],
			components: {
				EditLink: './src/components/starlight/EditLink.astro',
				Head: './src/components/starlight/Head.astro',
				Hero: './src/components/starlight/Hero.astro',
				MarkdownContent: './src/components/starlight/MarkdownContent.astro',
				MobileTableOfContents: './src/components/starlight/MobileTableOfContents.astro',
				TableOfContents: './src/components/starlight/TableOfContents.astro',
				PageSidebar: './src/components/starlight/PageSidebar.astro',
				Pagination: './src/components/starlight/Pagination.astro',
				SiteTitle: './src/components/starlight/SiteTitle.astro',
				Search: './src/components/starlight/Search.astro',
				Sidebar: './src/components/starlight/Sidebar.astro',
				PageTitle: './src/components/starlight/PageTitle.astro',
			},
			editLink: {
				baseUrl: 'https://github.com/prosopo/docs/edit/main',
			},
			defaultLocale: 'en',
			locales: makeLocalesConfig(),
			sidebar: makeSidebar(),
			social: {
				github: 'https://github.com/prosopo/captcha',
				discord: 'https://discord.gg/3nMYAHecZT',
			},
			pagefind: false,
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
		}),
		tailwind({
			// Disable the default base styles:
			applyBaseStyles: false,
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
	vite: {

		plugins: [json5Plugin()],
		build: {
			modulePreload: { polyfill: true },
			rollupOptions: {
				external: [
					'fsevents',
					...allExternal
				],
			}
		}
	}
});
