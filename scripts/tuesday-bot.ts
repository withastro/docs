import { setOutput } from '@actions/core';
import simpleGit from 'simple-git';
import os from 'os';
import glob from 'fast-glob';
import { join } from 'path';
import languages from '../src/i18n/languages';
import { githubGet } from './lib/github-get.mjs';

const PAGE_SOURCE_DIRECTORY = './src/content/docs';

await setDiscordMessage();

async function setDiscordMessage() {
	const git = simpleGit({
		maxConcurrentProcesses: Math.max(2, Math.min(32, os.cpus().length)),
	});

	const pagePaths = await glob(`**/*.{md,mdx}`, {
		cwd: join(PAGE_SOURCE_DIRECTORY, 'en'),
	});

	const toTranslate: Record<string, string[]> = {};

	// for each page, find the last major commit. if the last major commit is older than a week, ignore it.
	for (const path of pagePaths) {
		const history = await git.log({
			file: join(PAGE_SOURCE_DIRECTORY, 'en', path),
			strictDate: true,
		});
		const lastCommit =
			history.all.find((logEntry) => {
				return !logEntry.message.match(/(en-only|typo|broken link|i18nReady|i18nIgnore)/i);
			}) || history.latest;

		// ignore files if no major changes in the last week
		if (new Date(lastCommit!.date) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) continue;

		const todo: string[] = [];

		// for each language, find the last major commit. if the last major commit is older than the last commit, add it to the todo list.
		for (const language of Object.keys(languages)) {
			if (language === 'en') continue;

			try {
				const languageHistory = await git.log({
					file: join(PAGE_SOURCE_DIRECTORY, language, path),
					strictDate: true,
				});
				const languageLastCommit =
					languageHistory.all.find((logEntry) => {
						return !logEntry.message.match(/(en-only|typo|broken link|i18nReady|i18nIgnore)/i);
					}) || languageHistory.latest;

				if (languageLastCommit!.date < lastCommit!.date) todo.push(language);
			} catch {
				// file doesn't exist
				todo.push(language);
			}
		}

		toTranslate[path] = todo;
	}

	const pulls = await githubGet({
		url: 'https://api.github.com/repos/withastro/docs/pulls?state=open&sort=updated&direction=desc',
		githubToken: process.env.GITHUB_TOKEN,
	});

	for (const pull of pulls) {
		const compare = await githubGet({
			url: `https://api.github.com/repos/withastro/docs/compare/${pull.base.label}...${pull.head.label}`,
			githubToken: process.env.GITHUB_TOKEN,
		});

		for (const file of compare.files) {
			if (!file.filename.startsWith('src/content/docs/')) continue;
			const lang = file.filename.split('src/content/docs/')[1].split('/')[0];
			if (lang === 'en') continue;
			const path = file.filename.split(lang)[1].slice(1);

			if (toTranslate[path]) {
				const sha = file.contents_url.split('?ref=')[1];
				const commit = compare.commits.find(
					(c: {
						sha: string;
						commit: {
							message: string;
						};
					}) =>
						c.sha === sha &&
						!c.commit.message.match(/(en-only|typo|broken link|i18nReady|i18nIgnore)/i)
				);
				if (
					commit &&
					(commit.message.match(/(en-only|typo|broken link|i18nReady|i18nIgnore)/i) ||
						commit.commit.author.date <
							(await git
								.log({ file: join(PAGE_SOURCE_DIRECTORY, 'en', path), strictDate: true })
								.then((history) => history.latest!.date)))
				)
					continue;
				toTranslate[path] = toTranslate[path].filter((l) => l !== lang);
				if (toTranslate[path].length === 0) delete toTranslate[path];
			}
		}
	}

	const list = Object.keys(toTranslate)
		.map((path) => {
			if (toTranslate[path].length === Object.keys(languages).length - 1)
				toTranslate[path] = ['all'];
			return `- [\`${path}\`](https://github.com/withastro/docs/tree/main/${join(
				PAGE_SOURCE_DIRECTORY,
				'en',
				path
			)}) (${toTranslate[path].map((l) => `\`${l}\``).join(', ')})`;
		})
		.join('\n');

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
