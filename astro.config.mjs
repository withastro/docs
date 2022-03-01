// @ts-check
export default /** @type {import('astro').AstroUserConfig} */ ({
	buildOptions: {
		site: 'https://docs.astro.build/',
	},
	markdownOptions: {
		render: [
		  '@astrojs/markdown-remark',
		  {
			syntaxHighlight: 'shiki',
			shikiConfig: {},
		  },
		],
	  },
	renderers: [
		// Our main renderer for frontend components
		'@astrojs/renderer-preact',
		// Needed for Algolia search component
		'@astrojs/renderer-react',
	],
});
