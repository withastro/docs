import { createLunaria } from '@lunariajs/core';
import { unlinkSync } from 'node:fs';
import { yellow, blue, red } from 'kleur/colors';

// Set the amount of days between the last update in the source file
// and a translation to be considered an old translation. Default: 180 (6 months)
// Can be set by passing a number as the first argument when running the script.
const DAYS_TO_OUTDATED_MARK = parseInt(process.argv[2]) || 180;
// Set if the outdated files should be removed. Default: false
// Can be set by passing -r as an argument when running the script.
const REMOVE_OUTDATED_FILES = process.argv[2] === '-r' || process.argv[3] === '-r';

console.log('Loading status from Lunaria...');

const lunaria = await createLunaria();
const status = await lunaria.getFullStatus();

const outdatedLog = [];

for (const { source, localizations } of status) {
	const latestSourceUpdate = new Date(source.git.latestTrackedChange.date);

	for (const localization of localizations) {
		if (localization.status !== 'outdated') continue;

		const latestTranslationUpdate = new Date(localization.git.latestTrackedChange.date);
		const daysSinceLastUpdate = Math.round(
			(latestSourceUpdate.getTime() - latestTranslationUpdate.getTime()) / (1000 * 60 * 60 * 24)
		);

		if (daysSinceLastUpdate >= DAYS_TO_OUTDATED_MARK) {
			if (REMOVE_OUTDATED_FILES) {
				unlinkSync(localization.path);
			}
			outdatedLog.push(
				`- ${blue(localization.path)} (${yellow(daysSinceLastUpdate)} days) ${REMOVE_OUTDATED_FILES ? red('[REMOVED]') : ''}`
			);
		}
	}
}

if (outdatedLog.length > 0) {
	console.log(
		`Found ${yellow(outdatedLog.length)} translations that haven't been updated in ${yellow(DAYS_TO_OUTDATED_MARK)} days or more:`
	);
	outdatedLog.forEach((log) => console.log(log));
} else {
	console.log(
		`Found no translations that haven't been updated in ${yellow(DAYS_TO_OUTDATED_MARK)} days or more!`
	);
}
