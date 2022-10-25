import { RouteData } from 'astro';
import { AstroIntegration } from 'astro';
import { transpileModule } from 'typescript';

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

import tsConfig from '../../tsconfig.json';
import languages from '../../src/i18n/languages';

export function offlineMode(): AstroIntegration {
	return {
		name: 'astro-docs-offline-mode',
		hooks: {
			'astro:config:setup': async ({ updateConfig }) => {
				updateConfig({
					vite: {
						plugins: [rollupPlugin()],
					},
				});
			},
			'astro:build:done': async ({ routes, dir }) => {
				const generatedWorker = await generateSw(routes, Date.now().toString());

				const outFile = fileURLToPath(new URL('./service-worker.js', dir));
				await writeFile(outFile, generatedWorker);
			},
		},
	};
}

// Important routes to cache
const importantRoutes: string[] = Object.keys(languages).map((key) => `/${key}/offline/`);

// Exclude all the *.mjs files - one shows up in the list for each page
const excludeAssetRegEx = /\.mjs$/;

// Things like css files, js files, etc
const importantAssets: string[] = [
	'index.css',
	'theme.css',
	'favicon.ico',
	'favicon.svg',
	'manifest.webmanifest',
];

// Things like fonts
const unimportantAssets: string[] = [];

function formatFilePathStrings(strings: string[]): string[] {
	const newStrings: string[] = [];
	for (const str of strings) {
		let newStr = str;
		if (!newStr.startsWith('/')) newStr = '/' + newStr;
		newStr = `'${newStr}'`;
		newStrings.push(newStr);
	}
	return newStrings;
}

// Rollup plugin for getting the paths for all the assets
function rollupPlugin() {
	return {
		name: 'astro-docs-service-worker-rollup-plugin',
		writeBundle: {
			async handler(_, bundle: { [fileName: string]: unknown }) {
				Object.keys(bundle)
					.filter((fileName) => !fileName.match(excludeAssetRegEx))
					.forEach((fileName) => {
						// Don't double-cache thing
						if (importantAssets.includes(fileName)) return;

						// Don't cache videos, since they take up loads of space.
						if (fileName.endsWith('.mp4')) return;

						unimportantAssets.push(fileName);
					});
			},
		},
	};
}

// Function to generate the service worker file
async function generateSw(routes: RouteData[], hash: string): Promise<string> {
	// Load the template file
	const swTemplate = await readFile(join(__dirname, 'service-worker-template.ts'), 'utf-8');

	const routePaths = routes
		.filter((route) => !!route.pathname)
		.map((route) => route.pathname!)
		.map((pathName) => {
			// Don't add a slash to the end of paths that already have one
			if (pathName.endsWith('/')) return pathName;
			// Don't add a slash to the end of paths that have an extension
			if (/\.[a-zA-Z]+$/.test(pathName)) return pathName;

			// Add a slash to the end of all other paths
			return pathName + '/';
		});

	const importantFiles = formatFilePathStrings([...importantRoutes, ...importantAssets]);
	const otherFiles = formatFilePathStrings([
		...routePaths.filter((route) => !importantRoutes.includes(route)),
		...unimportantAssets,
	]);

	const generatedTemplate = swTemplate
		.replace('/* $%_priority_files_%$ */', importantFiles.join(','))
		.replace('/* $%_other_files_%$ */', otherFiles.join(','))
		.replace('/* $%_hash_%$ */', hash);

	// Compile from typescript
	const compiledTemplate = transpileModule(generatedTemplate, {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		compilerOptions: tsConfig.compilerOptions as any,
	}).outputText.replace('export {};', ''); // Get rid of this artifact from typescript

	return compiledTemplate;
}
