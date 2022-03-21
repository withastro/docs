import { tokens } from './syntax-highlighting-theme';
import type { AstroUserConfig } from 'astro';
import type { AstroMarkdownOptions } from '@astrojs/markdown-remark';

const config: AstroUserConfig = {
	buildOptions: {
		site: 'https://docs.astro.build/',
	},
	markdownOptions: {
		render: [
			'@astrojs/markdown-remark',
			{
				syntaxHighlight: 'shiki',
				shikiConfig: {
					theme: {
						name: 'Star gazer',
						type: 'dark',
						settings: tokens,
					},
				},
			} as AstroMarkdownOptions,
		],
	},
	renderers: [
		// Our main renderer for frontend components
		'@astrojs/renderer-preact',
		// Needed for Algolia search component
		'@astrojs/renderer-react',
	],
};

export default config;
