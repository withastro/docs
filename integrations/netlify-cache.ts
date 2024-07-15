// @ts-expect-error This package does not provide types (despite being authored in TypeScript...)
import { save, restore } from '@netlify/cache-utils';
import type { AstroIntegration } from 'astro';

const cacheDirectories = ['./node_modules/.astro', './node_modules/.astro-og-canvas'];

export const netlifyCache = (): AstroIntegration => ({
	name: 'astro-netlify-cache',
	hooks: {
		async 'astro:build:start'({ logger }) {
			if (!process.env.NETLIFY) return;
			logger.info(`Restoring: ${cacheDirectories.join(', ')}`);
			await restore(cacheDirectories);
			logger.info(`Cache restored.`);
		},
		async 'astro:build:done'({ logger }) {
			if (!process.env.NETLIFY) return;
			logger.info(`Caching: ${cacheDirectories.join(', ')}`);
			await save(cacheDirectories);
			logger.info(`Directories cached.`);
		},
	},
});
