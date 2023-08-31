import { OGImageRoute } from 'astro-og-canvas';
import { allPages } from '~/content';
import { rtlLanguages } from '~/i18n/languages';
import { getLanguageFromURL } from '~/util';

/** Paths for all of our Markdown content we want to generate OG images for. */
const paths = process.env.SKIP_OG ? [] : allPages;

/** An object mapping file paths to file metadata. */
const pages = Object.fromEntries(paths.map(({ id, slug, data }) => [id, { data, slug }]));

export const { getStaticPaths, get: GET } = OGImageRoute({
	param: 'path',

	pages,

	getImageOptions: async (_, { data, slug }: (typeof pages)[string]) => {
		return {
			title: data.title,
			description: data.description,
			dir: rtlLanguages.has(getLanguageFromURL(slug)) ? 'rtl' : 'ltr',
			logo: {
				path: './src/docs-logo.png',
				size: [400],
			},
			border: { color: [255, 93, 1], width: 20, side: 'inline-start' },
			bgGradient: [
				[42, 35, 62],
				[23, 20, 36],
			],
			font: {
				title: {
					size: 78,
					families: [
						'Work Sans',
						'Noto Sans Black',
						'Noto Sans Arabic',
						'Noto Sans SC Black',
						'Noto Sans TC Black',
						'Noto Sans JP Black',
						'Noto Sans KR Black',
					],
					weight: 'ExtraBold',
				},
				description: {
					size: 45,
					lineHeight: 1.25,
					families: [
						'Work Sans',
						'Noto Sans',
						'Noto Sans Arabic',
						'Noto Sans SC',
						'Noto Sans TC',
						'Noto Sans JP',
						'Noto Sans KR',
					],
					weight: 'Normal',
				},
			},
			fonts: [
				'https://github.com/withastro/docs/raw/temp-fonts-cdn/src/pages/open-graph/_fonts/work-sans/latin-400-normal.ttf',
				'https://github.com/withastro/docs/raw/temp-fonts-cdn/src/pages/open-graph/_fonts/work-sans/latin-800-normal.ttf',

				'https://github.com/withastro/docs/raw/temp-fonts-cdn/src/pages/open-graph/_fonts/noto-sans/cyrillic-400-normal.ttf',
				'https://github.com/withastro/docs/raw/temp-fonts-cdn/src/pages/open-graph/_fonts/noto-sans/cyrillic-900-normal.ttf',

				'https://github.com/withastro/docs/raw/temp-fonts-cdn/src/pages/open-graph/_fonts/noto-sans/chinese-simplified-400-normal.otf',
				'https://github.com/withastro/docs/raw/temp-fonts-cdn/src/pages/open-graph/_fonts/noto-sans/chinese-simplified-900-normal.otf',

				'https://github.com/withastro/docs/raw/temp-fonts-cdn/src/pages/open-graph/_fonts/noto-sans/chinese-traditional-400-normal.otf',
				'https://github.com/withastro/docs/raw/temp-fonts-cdn/src/pages/open-graph/_fonts/noto-sans/chinese-traditional-900-normal.otf',

				'https://github.com/withastro/docs/raw/temp-fonts-cdn/src/pages/open-graph/_fonts/noto-sans/japanese-400-normal.ttf',
				'https://github.com/withastro/docs/raw/temp-fonts-cdn/src/pages/open-graph/_fonts/noto-sans/japanese-900-normal.ttf',

				'https://github.com/withastro/docs/raw/temp-fonts-cdn/src/pages/open-graph/_fonts/noto-sans/arabic-400-normal.ttf',
				'https://github.com/withastro/docs/raw/temp-fonts-cdn/src/pages/open-graph/_fonts/noto-sans/arabic-800-normal.ttf',

				'https://github.com/withastro/docs/raw/temp-fonts-cdn/src/pages/open-graph/_fonts/noto-sans/korean-400-normal.otf',
				'https://github.com/withastro/docs/raw/temp-fonts-cdn/src/pages/open-graph/_fonts/noto-sans/korean-900-normal.otf',
			],
		};
	},
});
