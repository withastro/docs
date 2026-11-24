import { defineConfig, sharpImageService } from 'astro/config';
import { makeLocalesConfig } from './config/locales';
import { makeSidebar } from './config/sidebar';
import { rehypeAutolink } from './plugins/rehype-autolink';
import { rehypeIntentLinks } from './plugins/rehype-intent-links';
import { rehypeTasklistEnhancer } from './plugins/rehype-tasklist-enhancer';
import { remarkFallbackLang } from './plugins/remark-fallback-lang';
import { elementIds } from './integrations/elementIds';
import { sitemap } from './integrations/sitemap';
import rehypeSlug from 'rehype-slug';
import remarkSmartypants from 'remark-smartypants';
import starlight from '@astrojs/starlight';
import tailwind from '@astrojs/tailwind';
import json5Plugin from 'vite-plugin-json5';
import { builtinModules } from 'module';

const site = 'https://docs.prosopo.io/';

const allExternal = [
	...builtinModules,
	...builtinModules.map((m) => `node:${m}`)
]

export default defineConfig({
	site,

	integrations: [
		starlight({
			title: 'Prosopo Docs',

			customCss: ['./src/styles/custom.css', './src/styles/brand.css'],
			components: {
				EditLink: './src/components/starlight/EditLink.astro',
				Head: './src/components/starlight/Head.astro',
				MarkdownContent: './src/components/starlight/MarkdownContent.astro',
				TableOfContents: './src/components/starlight/TableOfContents.astro',
				PageSidebar: './src/components/starlight/PageSidebar.astro',
				SiteTitle: './src/components/starlight/SiteTitle.astro',
				Search: './src/components/starlight/Search.astro',
				Sidebar: './src/components/starlight/Sidebar.astro',
				ThemeProvider: './src/components/starlight/ThemeProvider.astro',
				ThemeSelect: './src/components/starlight/ThemeSelect.astro',
			},
			editLink: {
				baseUrl: 'https://github.com/prosopo/docs/edit/main',
			},
			defaultLocale: 'en',
			locales: makeLocalesConfig(),
			sidebar: makeSidebar(),
			social: {
				github: 'https://github.com/prosopo/captcha',
				discord: 'https://discord.gg/dwQx2w9Tgm',
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
			configFiles: ['./tailwind.config.mjs'],
		}),
		sitemap(),
		elementIds(),
	],
	trailingSlash: 'always',
	build: { assets: '_assets' },
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
			rehypeIntentLinks(),
		],
	},
	image: {
		service: sharpImageService(),
	},
	experimental: {
		contentCollectionCache: false,
		directRenderScript: true,
	},
	vite: {
		plugins: [
			json5Plugin(),
			{
				name: 'raw-jsonc-loader',
				transform(code, id) {
					// Handle .jsonc files (with or without ?raw suffix)
					if (id.includes('.jsonc')) {
						const json = JSON.stringify(code)
							.replace(/\u2028/g, '\\u2028')
							.replace(/\u2029/g, '\\u2029');
						return {
							code: `export default ${json}`,
							map: null
						};
					}
					return null;
				}
			}
		],
		optimizeDeps: {
			esbuildOptions: {
				loader: {
					'.jsonc': 'text',
				},
			},
		},
		ssr: {
			noExternal: ['@astrojs/starlight'],
			esbuild: {
				options: {
					loader: {
						'.jsonc': 'text',
					},
				},
			},
		},
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
