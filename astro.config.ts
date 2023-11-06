import starlight from '@astrojs/starlight';
import preact from '@astrojs/preact';
import { defineConfig } from 'astro/config';
import { makeLocalesConfig } from './config/locales';
import { makeSidebar } from './config/sidebar';

import rehypeSlug from 'rehype-slug';
import remarkSmartypants from 'remark-smartypants';

import { astroDocsExpressiveCode } from './integrations/expressive-code';
import { rehypeOptimizeStatic } from './plugins/rehype-optimize-static';
import { rehypeTasklistEnhancer } from './plugins/rehype-tasklist-enhancer';
import { remarkFallbackLang } from './plugins/remark-fallback-lang';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.astro.build/',
	integrations: [
		preact({ compat: true }),
		astroDocsExpressiveCode(),
		starlight({
			title: 'Docs',
			logo: {
				light: './src/assets/astro-logo-light.svg',
				dark: './src/assets/astro-logo-dark.svg',
				alt: 'Astro',
			},
			defaultLocale: 'en',
			locales: makeLocalesConfig(),
			sidebar: makeSidebar(),
			social: {
				github: 'https://github.com/withastro/astro',
				discord: 'https://astro.build/chat',
			},
		}),
	],
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
			// Collapse static parts of the hast to html
			rehypeOptimizeStatic,
		],
	},
});
