import { setOutput } from '@actions/core';
import { join } from 'path';
import languages from '../src/i18n/languages';
import { githubGet } from './lib/github-get.mjs';
import { TranslationStatusBuilder, COMMIT_IGNORE } from './translation-status'

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

  const pulls = await githubGet({
		url: 'https://api.github.com/repos/withastro/docs/pulls?state=open&sort=updated&direction=desc',
		githubToken: process.env.GITHUB_TOKEN,
	});

  const updatedInPulls: Record<string, string[]> = {};

	for (const pull of pulls) {
    const compare = await githubGet({
			url: `https://api.github.com/repos/withastro/docs/compare/${pull.base.label}...${pull.head.label}`,
			githubToken: process.env.GITHUB_TOKEN,
		});

    for (const file of compare.files) {
      if (!file.filename.startsWith('src/content/docs/')) continue;
      const lang = file.filename.split('src/content/docs/')[1].split('/')[0];
      if (lang === 'en') continue;
      const path = file.filename.split(`/${lang}/`)[1];
      const current = pages['en'][path]
      const sha = file.contents_url.split('?ref=')[1];
      const commit = compare.commits.find((c: {
          sha: string;
          commit: {
            message: string;
          };
        }) =>
          c.sha === sha &&
          !c.commit.message.match(COMMIT_IGNORE)
      );
      if (!commit) continue;
      if ((commit.commit.author.date < current.lastMajorChange)) continue;

      if (!updatedInPulls[path]) updatedInPulls[path] = ['en'];
      updatedInPulls[path].push(lang);
    }
  }

  const list = toTranslate.map((s) => {
    if ((updatedInPulls[s.subpath]?.length ?? 0) === 0) updatedInPulls[s.subpath] = ['all'];
    else updatedInPulls[s.subpath] = Object.keys(languages).filter((l) => !updatedInPulls[s.subpath].includes(l));
    return `- [\`${s.subpath}\`](https://github.com/withastro/docs/tree/main/${join(
      PAGE_SOURCE_DIRECTORY,
      'en',
      s.subpath
    )}) (${updatedInPulls[s.subpath].map((l) => `\`${l}\``).join(', ')})`;
  }).join('\n');

	let message = `**Translation Tuesday!** <@951985780828545095>\n\nWe have ${
		Object.keys(toTranslate).length
	} pages with major changes. Please help us translate these pages to your language!\n\n${list}`;

	// message length limit is 2000 characters
	while (message.length > 1952) {
		const lastNewline = message.lastIndexOf('\n', 2000);
		message = message.slice(0, lastNewline);
	}

	message += '\n\nAnd [more](https://i18n.docs.astro.build)...';

	setOutput('DISCORD_MESSAGE', message);
}
