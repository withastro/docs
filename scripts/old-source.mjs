import { createLunaria } from '@lunariajs/core';
import { yellow, blue } from 'kleur/colors';

// Set the amount of days since the last update in a source file.
const DAYS_TO_OUTDATED_MARK = parseInt(process.argv[2]) || 180;

console.log('Loading status from Lunaria...');

const lunaria = await createLunaria();
const status = await lunaria.getFullStatus();

const outdatedLog = [];

for (const { source } of status) {
	const latestSourceUpdate = new Date(source.git.latestTrackedChange.date);
	const daysSinceLastUpdate = Math.round(
		(Date.now() - latestSourceUpdate.getTime()) / (1000 * 60 * 60 * 24)
	);

	if (daysSinceLastUpdate >= DAYS_TO_OUTDATED_MARK) {
		outdatedLog.push(`- ${blue(source.path)} (${yellow(daysSinceLastUpdate)} days)`);
	}
}

if (outdatedLog.length > 0) {
	console.log(
		`Found ${yellow(outdatedLog.length)} source files that haven't been updated in ${yellow(DAYS_TO_OUTDATED_MARK)} days or more:`
	);
	outdatedLog.forEach((log) => console.log(log));
} else {
	console.log(
		`Found no source files that haven't been updated in ${yellow(DAYS_TO_OUTDATED_MARK)} days or more!`
	);
}
