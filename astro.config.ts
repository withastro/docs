import { tokens } from './syntax-highlighting-theme';
import type { AstroUserConfig } from 'astro';

// @ts-check
const config: AstroUserConfig = {
	buildOptions: {
		site: 'https://docs.astro.build/',
	},
	// TODO: Enable Shiki!
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
						fg: '#d8dee9',
						bg: '#312749',
					},
				},
			},
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
