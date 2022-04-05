import { tokens, foregroundPrimary, backgroundPrimary } from './syntax-highlighting-theme';
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.astro.build/',
	integrations: [preact(), react()],
	markdown: {
		// @ts-expect-error This will be fixed by https://github.com/withastro/astro/pull/2970
		mode: 'mdx',
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
		rehypePlugins: [
			// These are here because setting custom plugins disables the defualt plugins
			'rehype-slug',
			'remark-smartypants',
			'remark-gfm',
			// This adds links to headings
			[
				'rehype-autolink-headings',
				{
					properties: {
						class: 'heading-fragment-link',
						title: 'Permalink to this heading',
					},
					behavior: 'append',
					content: { type: 'text', value: '¶' },
				},
			],
		],
	},
});
