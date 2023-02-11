// import {scrapeFileForInterfaces} from './interfaces.mjs';
import fs from 'fs';
import {scrapeFileForErrors} from './errors.mjs';
import {scrapeFileForInterfaces, writeConfigurationPage} from './configuration.mjs';

// Fill this in to test a response locally, with fetching.
const IS_LOCAL = process.argv.includes('--local');
const ASTRO_TYPES_FILE = IS_LOCAL ? fs.readFileSync('../astro/packages/astro/src/@types/astro.ts', { encoding: 'utf-8' }) : (await fetch(
	'https://raw.githubusercontent.com/withastro/astro/main/packages/astro/src/%40types/astro.ts'
).then((r) => r.text()));
const ASTRO_ERRORS_FILE = IS_LOCAL ? fs.readFileSync('../astro/packages/astro/src/core/errors/errors-data.ts', { encoding: 'utf-8' }) : (await fetch(
	'https://raw.githubusercontent.com/withastro/astro/main/packages/astro/src/core/errors/errors-data.ts'
).then((r) => r.text()));


/**
 * The simple demo does not rely on the TypeScript compiler API; instead, it parses the
 * source file directly.  It uses the default parser configuration.
 */
export async function run() {
	for (const data of await scrapeFileForInterfaces(ASTRO_TYPES_FILE)) {
		writeConfigurationPage(data);
	}
	// const allFileResults = [
	// 	...await scrapeFileForErrors(ASTRO_ERRORS_FILE),
	// 	...
	// ]

	// fs.writeFileSync(
	// 	`src/data/reference.json`,
	// 	JSON.stringify(allFileResults, undefined, 2),
	// 	'utf8'
	// );

	// console.log(allFileResults);
}

run();
