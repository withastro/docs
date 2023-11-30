import { OGImageRoute } from 'astro-og-canvas';
import { allPages } from '~/content';
import { rtlLanguages } from '~/i18n/languages';
import { getLangFromSlug } from '~/util';

/** Paths for all of our Markdown content we want to generate OG images for. */
const paths = process.env.SKIP_OG ? [] : allPages;

/** An object mapping file paths to file metadata. */
const pages = Object.fromEntries(paths.map(({ id, slug, data }) => [id, { data, slug }]));

export const { getStaticPaths, GET } = OGImageRoute({
	param: 'path',

	pages,

	getImageOptions: async (_, { data, slug }: (typeof pages)[string]) => {
		return {
			title: data.title,
			description: data.description,
			dir: rtlLanguages.has(getLangFromSlug(slug)) ? 'rtl' : 'ltr',
			logo: {
				path: './src/docs-logo.png',
				size: [300],
			},
			border: { color: [154, 82, 243], width: 32, side: 'inline-start' },
			padding: 80,
			bgGradient: [
				[26, 27, 34],
				[48, 40, 79],
			],
			font: {
				title: {
					size: 78,
					families: [
						'Inter',
						'Noto Sans',
						'Noto Sans Arabic',
						'Noto Sans SC',
						'Noto Sans TC',
						'Noto Sans JP',
						'Noto Sans KR',
					],
					weight: 'Normal',
					color: [255, 255, 255],
				},
				description: {
					size: 42,
					lineHeight: 1.2,
					families: [
						'Inter',
						'Noto Sans',
						'Noto Sans Arabic',
						'Noto Sans SC',
						'Noto Sans TC',
						'Noto Sans JP',
						'Noto Sans KR',
					],
					weight: 'Normal',
					color: [191, 193, 201],
				},
			},
			fonts: [
				'./src/pages/open-graph/_fonts/inter/inter-400-normal.ttf',
				'./src/pages/open-graph/_fonts/noto-sans/chinese-simplified-400-normal.otf',
				'./src/pages/open-graph/_fonts/noto-sans/chinese-traditional-400-normal.otf',
				'./src/pages/open-graph/_fonts/noto-sans/japanese-400-normal.ttf',
				'./src/pages/open-graph/_fonts/noto-sans/arabic-400-normal.ttf',
				'./src/pages/open-graph/_fonts/noto-sans/korean-400-normal.otf',
			],
		};
	},
});
