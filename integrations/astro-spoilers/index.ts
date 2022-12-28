import type { AstroIntegration } from 'astro';
import { SpoilerTagname } from './constants';
import spoilers from './remark-spoilers';

export const spoilerAutoImport: Record<string, [string, string][]> = {
	'~/components/Spoiler.astro': [['default', SpoilerTagname]],
};

export function astroSpoilers(): AstroIntegration {
	return {
		name: '@astrojs/spoilers',
		hooks: {
			'astro:config:setup': ({ updateConfig }) => {
				updateConfig({
					markdown: {
						remarkPlugins: [spoilers()],
					},
				});
			},
		},
	};
}
