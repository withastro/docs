import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { AstroIntegration } from 'astro';
import { assignElementIds } from '../src/util/elementIds';

const htmlFiles = async (dir: string): Promise<string[]> =>
	(await readdir(dir, { recursive: true }))
		.filter((file: string): boolean => file.endsWith('.html'))
		.map((file: string): string => join(dir, file));

/** Adds a `data-el` id to every link and button in the built pages. */
export function elementIds(): AstroIntegration {
	return {
		name: 'element-ids',
		hooks: {
			'astro:build:done': async ({ dir }): Promise<void> => {
				const root = fileURLToPath(dir);
				for (const file of await htmlFiles(root)) {
					const url = `/${relative(root, file).split(sep).join('/')}`;
					const html = await readFile(file, 'utf8');
					await writeFile(file, assignElementIds(html, url));
				}
			},
		},
	};
}
