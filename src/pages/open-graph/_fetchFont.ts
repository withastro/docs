import { mkdir, writeFile } from 'node:fs/promises';

/**
 * Download the Astro brand font for OpenGraph Image generation.
 * Returns the path the font was downloaded to if successful, otherwise `undefined`.
 */
export async function fetchBrandFont() {
	try {
		const fontPath = '_fonts/brand/';
		const fontFileName = 'brand-500-normal.otf';
		const fontDir = new URL(fontPath, import.meta.url);
		const fontFile = new URL(fontFileName, fontDir);

		const fontArrayBuffer = await fetch(
			'https://fonts-cdn.astro.build/Obviously/Obviously Normal/Desktop/Obviously-Medium.otf',
			JSON.parse(import.meta.env.FONT_CREDENTIALS)
		).then((res) => res.arrayBuffer());

		await mkdir(fontDir, { recursive: true });
		await writeFile(fontFile, Buffer.from(fontArrayBuffer));
		return './src/pages/open-graph/' + fontPath + fontFileName;
	} catch (error) {
		// When running locally, if anything goes wrong, we can safely return
		// nothing and continue with the default local fonts.
		if (!import.meta.env.VERCEL) return undefined;
		// But in production builds we want to error if we failed to download fonts.
		throw error;
	}
}
