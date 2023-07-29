import starlight from '@astrojs/starlight';
import preact from '@astrojs/preact';
import { defineConfig } from 'astro/config';
import { makeLocalesConfig } from './config/locales';
import { makeSidebar } from './config/sidebar';

import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkSmartypants from 'remark-smartypants';

import { astroDocsExpressiveCode } from './integrations/expressive-code';
import { rehypei18nAutolinkHeadings } from './plugins/rehype-i18n-autolink-headings';
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
			title: 'Astro Docs',
			defaultLocale: 'en',
			locales: makeLocalesConfig(),
			sidebar: makeSidebar(),
		}),
	],
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
			// [rehypeAutolinkHeadings, autolinkConfig],
			// Tweak GFM task list syntax
			rehypeTasklistEnhancer(),
			// Translates the autolink headings anchors
			rehypei18nAutolinkHeadings(),
			// Collapse static parts of the hast to html
			rehypeOptimizeStatic,
		],
	},
});
