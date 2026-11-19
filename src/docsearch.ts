import type { DocSearchClientOptions } from '@astrojs/starlight-docsearch';

export default {
	appId: '7AFBU8EPJU',
	apiKey: '4440670147c44d744fd8da35ff652518',
	indices: [
		{
			name: 'astro',
			searchParameters: {
				facetFilters: [[`lang:${location.pathname.split('/')[1]}`]],
				attributesToHighlight: ['hierarchy.lvl0'],
			},
		},
	],
	insights: true,
	getMissingResultsUrl: ({ query }: { query: string }) =>
		`https://github.com/withastro/docs/issues/new?title=Missing+results+for+query+%22${encodeURIComponent(
			query
		)}%22`,
	transformItems: (items) => {
		return items.map((item) => {
			// We transform the absolute URL into a relative URL to
			// work better on localhost, preview URLS.
			const url = new URL(item.url);
			if (url.hash === '#_top') url.hash = '';
			return {
				...item,
				url: url.href.replace(url.origin, ''),
			};
		});
	},
} satisfies DocSearchClientOptions;
