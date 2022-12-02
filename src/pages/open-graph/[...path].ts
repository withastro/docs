import { OGImageRoute } from 'astro-og-canvas';
import { readFile } from 'fs/promises';
import matter from 'gray-matter';
import glob from 'tiny-glob';
import { rtlLanguages } from '../../i18n/languages';
import { getLanguageFromURL } from '../../util';

// Work around `import.meta.glob` performance issue.
// Using even a non-eager glob here seems to trigger an extremely slow
// start time when using the dev server (similar to the `src/i18n/util.ts`
// performance issues).
//
// To replace it, we’re hand-rolling a glob + Markdown frontmatter parsing
// combo to extract title & description from each page.

/** Paths for all of our Markdown content we want to generate OG images for. */
const paths = process.env.SKIP_OG ? [] : await glob('src/pages/**/*.{md,mdx}');

/**
 * An object mapping file paths to a file loader method, mimicking
 * `import.meta.glob`’s return object.
 */
const pages = Object.fromEntries(
	paths.map((path) => [
		// `OGImageRoute` expects glob paths to start with `/` as `import.meta.glob` would return.
		'/' + path,
		// Minimal version of a dynamic Markdown import.
		async () => {
			const fileContents = await readFile(path, 'utf8');
			const file = matter(fileContents);
			return {
				frontmatter: file.data,
				// An Astro `.md` import includes the page URL, so we’re faking that.
				url: path.replace('src/pages', '').replace(/(\/index)?\.mdx?$/, ''),
			};
		},
	])
);

export const { getStaticPaths, get } = OGImageRoute({
	param: 'path',

	pages,

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
