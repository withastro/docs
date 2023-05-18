import type { CollectionEntry } from 'astro:content';
import languages from '~/i18n/languages';
import { stripLangFromSlug } from '~/util';
import { TranslationStatusBuilder } from '../../scripts/lib/translation-status/builder';

const builder = new TranslationStatusBuilder({
	pageSourceDir: './src/content/docs',
	htmlOutputFilePath: './dist/translation-status/index.html',
	sourceLanguage: 'en',
	targetLanguages: Object.keys(languages)
		.filter((lang) => lang !== 'en')
		.sort(),
	languageLabels: languages,
	githubRepo: process.env.GITHUB_REPOSITORY || 'withastro/docs',
	githubToken: process.env.GITHUB_TOKEN,
});

export async function isOutdated(pagePath: CollectionEntry<'docs'>['id']) {
	const isShallowRepo = await builder.git.revparse(['--is-shallow-repository']);
	if (isShallowRepo !== 'false') return false;

	// @ts-expect-error uses id in place of slug, but it works the same way
	const rawPath = stripLangFromSlug(pagePath);

	const pageData = await builder.getSinglePageData(pagePath);
	const enPageData = await builder.getSinglePageData(`en/${rawPath}`);

	return pageData.lastMajorChange < enPageData.lastMajorChange;
}
