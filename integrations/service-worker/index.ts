import { RouteData } from 'astro';
import { AstroIntegration } from 'astro';

import { readFile, writeFile } from 'node:fs/promises';

import { fileURLToPath } from 'node:url';

import { join } from 'node:path';

export function serviceWorker(): AstroIntegration {
	return {
		name: 'astro-docs-service-worker',
		hooks: {
			'astro:config:setup': async ({ updateConfig }) => {
				updateConfig({
					vite: {
						plugins: [rollupPlugin()],
					},
				});
			},
			'astro:build:done': async ({ routes, dir }) => {
				const compiledTemplate = await generateSw(routes, Date.now().toString());

				const outFile = fileURLToPath(new URL('./service-worker.js', dir));
				await writeFile(outFile, compiledTemplate);
			},
		},
	};
}

// Important routes to cache
const importantRoutes: string[] = ['/', '/offline'];

// Exclude all the *.mjs files - one shows up in the list for each page
const excludeAssetRegEx = /\.mjs$/;

// Things like css files, js files, etc
const importantAssets: string[] = ['index.css', 'theme.css', 'favicon.ico', 'favicon.svg'];

// Things like fonts
const unimportantAssets: string[] = [];

function formatFilePathStrings(strs: string[]): string[] {
	const newStrs: string[] = [];
	for (const str of strs) {
		let newStr = str;
		if (!newStr.startsWith('/')) newStr = '/' + newStr;
		newStr = `'${newStr}'`;
		newStrs.push(newStr);
	}
	return newStrs;
}

function rollupPlugin() {
	return {
		name: 'astro-docs-service-worker-rollup-plugin',
		writeBundle: {
			async handler(_, bundle: { [fileName: string]: unknown }) {
				Object.keys(bundle)
					.filter((fileName) => !fileName.match(excludeAssetRegEx))
					.forEach((fileName) => {
						if (importantAssets.includes(fileName)) return;
						else unimportantAssets.push(fileName);
					});
			},
		},
	};
}

async function generateSw(routes: RouteData[], hash: string): Promise<string> {
	const swTemplate = await readFile(join(__dirname, 'service-worker-template.js'), 'utf-8');

	const routePaths = routes.filter((route) => !!route.pathname).map((route) => route.pathname!);

	const importantFiles = formatFilePathStrings([...importantRoutes, ...importantAssets]);
	const otherFiles = formatFilePathStrings([
		...routePaths.filter((route) => !importantRoutes.includes(route)),
		...unimportantAssets,
	]);

	const compiledTemplate = swTemplate
		.replace('/* $%_priority_files_%$ */', importantFiles.join(','))
		.replace('/* $%_other_files_%$ */', otherFiles.join(','))
		.replace('/* $%_hash_%$ */', hash);

	return compiledTemplate;
}
