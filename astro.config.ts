import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import { defineConfig } from 'astro/config';

import AutoImport from 'astro-auto-import';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkGFM from 'remark-gfm';
import remarkSmartypants from 'remark-smartypants';

import { asideAutoImport, astroAsides } from './integrations/astro-asides';
import { astroCodeSnippets, codeSnippetAutoImport } from './integrations/astro-code-snippets';
import { astroSpoilers, spoilerAutoImport } from './integrations/astro-spoilers';
import { sitemap } from './integrations/sitemap';
import { autolinkConfig } from './plugins/rehype-autolink-config';
import { rehypeTasklistEnhancer } from './plugins/rehype-tasklist-enhancer';
import { remarkFallbackLang } from './plugins/remark-fallback-lang';
import { backgroundPrimary, foregroundPrimary, tokens } from './syntax-highlighting-theme';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.astro.build/',
	integrations: [
		AutoImport({
			imports: [asideAutoImport, codeSnippetAutoImport, spoilerAutoImport],
		}),
		preact({ compat: true }),
		sitemap(),
		astroAsides(),
		astroSpoilers(),
		astroCodeSnippets(),
		mdx(),
	],
	markdown: {
		syntaxHighlight: 'shiki',
		shikiConfig: {
			theme: {
				name: 'Star gazer',
				type: 'dark',
				settings: tokens,
				fg: foregroundPrimary,
				bg: backgroundPrimary,
			},
		},
		remarkPlugins: [
			// These are here because setting custom plugins disables the default plugins
			remarkGFM,
			[remarkSmartypants, { dashes: false }],
			// Add our custom plugin that marks links to fallback language pages
			remarkFallbackLang(),
		],
		rehypePlugins: [
			rehypeSlug,
			// This adds links to headings
			[rehypeAutolinkHeadings, autolinkConfig],
			// Tweak GFM task list syntax
			rehypeTasklistEnhancer(),
		],
	},
});
