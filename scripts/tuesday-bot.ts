import { setOutput } from '@actions/core';
import { lunaria } from '@lunariajs/core';
import { readFileSync } from 'fs';
import languages from '../src/i18n/languages';

await setDiscordMessage();

async function setDiscordMessage() {
	const config = JSON.parse(readFileSync('./lunaria.config.json', 'utf-8'));
	const status = await lunaria(config);

	if (!status) return;

	const toTranslate = status.filter(
		(s) => new Date(s.sourceFile.lastMajorChange) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
	);

	const list = toTranslate
		.filter(
			(s) =>
				Object.keys(s.localizations).filter(
					(l) => s.localizations[l]?.isMissing || s.localizations[l]?.isOutdated
				).length > 0
		)
		.map((s) => {
			const langs =
				Object.keys(s.localizations).filter(
					(l) => s.localizations[l]?.isMissing || s.localizations[l]?.isOutdated
				).length ===
				Object.keys(languages).length - 1
					? ['all']
					: Object.keys(s.localizations);
			return `- [\`${s.sharedPath}\`](<${s.gitHostingFileURL}>) (${
				langs[0] === 'all'
					? 'all'
					: langs
							.filter((lang) => {
								if (lang === 'en') return false;
								const { isMissing, isOutdated } = s.localizations[lang];
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
