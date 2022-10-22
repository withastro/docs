import { RouteData } from 'astro';
import { AstroIntegration } from 'astro';

import { readFile, writeFile } from 'node:fs/promises';

import { fileURLToPath } from 'node:url';

import { join } from 'node:path';

export function serviceWorker(): AstroIntegration {
	return {
		name: 'astro-docs-service-worker',
		hooks: {
			'astro:build:done': async ({ routes, dir }) => {
				const compiledTemplate = await generateSw(routes, '1');

				const outFile = fileURLToPath(new URL('./service-worker.js', dir));
				await writeFile(outFile, compiledTemplate);
			},
		},
	};
}

async function generateSw(routes: RouteData[], hash: string): Promise<string> {
	const swTemplate = await readFile(join(__dirname, 'service-worker-template.js'), 'utf-8');

	const routePaths = routes
		.filter((route) => !!route.pathname)
		.map((route) => `'${route.pathname}'`);

	const compiledTemplate = swTemplate
		.replace('/* $%_routes_%$ */', routePaths.join(','))
		.replace('/* $%_hash_%$ */', hash);

	return compiledTemplate;
}
