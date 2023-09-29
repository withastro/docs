import { setOutput } from '@actions/core';
import { join } from 'path';
import languages from '../src/i18n/languages';
import { TranslationStatusBuilder } from './lib/translation-status/builder';

const PAGE_SOURCE_DIRECTORY = './src/content/docs';

await setDiscordMessage();

async function setDiscordMessage() {
	const builder = new TranslationStatusBuilder({
		pageSourceDir: './src/content/docs',
		oldTranslationDir: './old-translations',
		htmlOutputFilePath: './dist/translation-status/index.html',
		sourceLanguage: 'en',
		targetLanguages: Object.keys(languages)
			.filter((lang) => lang !== 'en')
			.sort(),
		languageLabels: languages,
		githubRepo: process.env.GITHUB_REPOSITORY || 'withastro/docs',
	});

	const pages = await builder.createPageIndex();
	const oldTranslations = await builder.createOldTranslationIndex();
	const statusByPage = builder.getTranslationStatusByPage(pages, oldTranslations);
	const toTranslate = statusByPage.filter(
		(s) => new Date(s.sourcePage.lastMajorChange) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
	);

	const list = toTranslate
		.filter(
			(s) =>
				Object.keys(s.translations).filter(
					(l) => s.translations[l]?.isMissing || s.translations[l]?.isOutdated
				).length > 0
		)
		.map((s) => {
			const langs =
				Object.keys(s.translations).filter(
					(l) => s.translations[l]?.isMissing || s.translations[l]?.isOutdated
				).length ===
				Object.keys(languages).length - 1
					? ['all']
					: Object.keys(s.translations);
			return `- [\`${s.subpath}\`](<https://github.com/withastro/docs/tree/main/${join(
				PAGE_SOURCE_DIRECTORY,
				'en',
				s.subpath
			)}>) (${
				langs[0] === 'all'
					? 'all'
					: langs
							.filter((lang) => {
								if (lang === 'en') return false;
								const { isMissing, isOutdated } = s.translations[lang];
								return isMissing || isOutdated;
							})
							.join(', ')
			})`;
		})
		.join('\n');

	let message = `**Translation Tuesday!** <@&951985780828545095>\n\nWe have ${
		Object.keys(toTranslate).length
	} pages with major changes since last week. Please help us translate these pages to your language!\n\n${list}`;

	const suffix =
		'\n\nSee our [Translation Status page](<https://i18n.docs.astro.build>) for more, including open PRs.';

	// Keep the entire message including the suffix within Discord's limits
	const maxLengthWithoutSuffix = 2000 - suffix.length;
	while (message.length > maxLengthWithoutSuffix) {
		const lastNewline = message.lastIndexOf('\n', maxLengthWithoutSuffix);
		message = message.slice(0, lastNewline);
	}

	message += suffix;

	setOutput('DISCORD_MESSAGE', message);
}
