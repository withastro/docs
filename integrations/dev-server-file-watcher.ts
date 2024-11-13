import type { AstroIntegration } from 'astro';

/**
 * Astro integration that registers the passed paths so that saving them triggers a dev server
 * restart.
 *
 * @param paths Array of file paths relative to the project root.
 *
 * @example
 * // astro.config.mjs
 * export default {
 *   integrations: [
 *     devServerFileWatcher(["./example.js", "./src/content/config.ts"]),
 *   ],
 * }
 */
export const devServerFileWatcher = (paths: string[]) =>
	({
		name: 'dev-server-file-watcher',
		hooks: {
			'astro:config:setup'({ addWatchFile, config }) {
				paths.forEach((path) => addWatchFile(new URL(path, config.root)));
			},
		},
	}) satisfies AstroIntegration;
