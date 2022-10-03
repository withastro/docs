import { OGImageRoute } from 'astro-og-canvas';
import { getLanguageFromURL } from '../../util';
import { rtlLanguages } from '../../i18n/languages';

export const { getStaticPaths, get } = OGImageRoute({
	param: 'path',

	pages: await import.meta.glob('/src/pages/**/*.md'),

	getImageOptions: async (_, mod) => {
		const page = await mod();
		return {
			title: page.frontmatter.title,
			description: page.frontmatter.description,
			dir: rtlLanguages.has(getLanguageFromURL(page.url)) ? 'rtl' : 'ltr',
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
					],
					weight: 'Normal',
				},
			},
			fonts: [
				'https://api.fontsource.org/v1/fonts/work-sans/latin-400-normal.ttf',
				'https://api.fontsource.org/v1/fonts/work-sans/latin-800-normal.ttf',

				'https://api.fontsource.org/v1/fonts/noto-sans/cyrillic-400-normal.ttf',
				'https://api.fontsource.org/v1/fonts/noto-sans/cyrillic-900-normal.ttf',

				'https://api.fontsource.org/v1/fonts/noto-sans-sc/chinese-simplified-400-normal.ttf',
				'https://api.fontsource.org/v1/fonts/noto-sans-sc/chinese-simplified-900-normal.ttf',

				'https://api.fontsource.org/v1/fonts/noto-sans-tc/chinese-traditional-400-normal.ttf',
				'https://api.fontsource.org/v1/fonts/noto-sans-tc/chinese-traditional-900-normal.ttf',

				'https://api.fontsource.org/v1/fonts/noto-sans-jp/japanese-400-normal.ttf',
				'https://api.fontsource.org/v1/fonts/noto-sans-jp/japanese-900-normal.ttf',

				'https://api.fontsource.org/v1/fonts/noto-sans-arabic/arabic-400-normal.ttf',
				'https://api.fontsource.org/v1/fonts/noto-sans-arabic/arabic-800-normal.ttf',
			],
		};
	},
});
