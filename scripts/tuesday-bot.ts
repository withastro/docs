import { setOutput } from '@actions/core';
import { join } from 'path';
import languages from '../src/i18n/languages';
import { TranslationStatusBuilder } from './lib/translation-status/builder'

const PAGE_SOURCE_DIRECTORY = './src/content/docs';

await setDiscordMessage();

async function setDiscordMessage() {
  const builder = new TranslationStatusBuilder({
    pageSourceDir: './src/content/docs',
    htmlOutputFilePath: './dist/translation-status/index.html',
    sourceLanguage: 'en',
    targetLanguages: Object.keys(languages)
      .filter((lang) => lang !== 'en')
      .sort(),
    languageLabels: languages,
    githubRepo: process.env.GITHUB_REPOSITORY || 'withastro/docs',
  });

  const pages = await builder.createPageIndex()
  const statusByPage = builder.getTranslationStatusByPage(pages)
	const toTranslate = statusByPage.filter((s) => new Date(s.sourcePage.lastMajorChange) > new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)))

  const list = toTranslate.map((s) => {
    const langs = Object.keys(s.translations).filter(l => s.translations[l]?.isMissing || s.translations[l]?.isOutdated).length === Object.keys(languages).length - 1 ? ['all'] : Object.keys(s.translations)
    return `- [\`${s.subpath}\`](https://github.com/withastro/docs/tree/main/${join(
      PAGE_SOURCE_DIRECTORY,
      'en',
      s.subpath
    )}) (${langs[0] === 'all' ? 'all' : langs.filter(lang => {
      if (lang === 'en') return false;
      const { isMissing, isOutdated } = s.translations[lang];
      return isMissing || isOutdated;
    }).join(', ')})`;
  }).join('\n');

	let message = `**Translation Tuesday!** <@951985780828545095>\n\nWe have ${
		Object.keys(toTranslate).length
	} pages with major changes. Please help us translate these pages to your language!\n\n${list}`;

	// message length limit is 2000 characters
	while (message.length > 1902) {
		const lastNewline = message.lastIndexOf('\n', 2000);
		message = message.slice(0, lastNewline);
	}

	message += '\n\nSee our [Translation Status page](https://i18n.docs.astro.build) for more, including open PRs.';

	setOutput('DISCORD_MESSAGE', message);
}
