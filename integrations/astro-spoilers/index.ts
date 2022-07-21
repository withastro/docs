import type { AstroIntegration } from 'astro';
import { SpoilerTagname } from './constants';
import spoilers from './remark-spoilers';

export function astroSpoilers(): AstroIntegration {
	return {
		name: '@astrojs/spoilers',
		hooks: {
			'astro:config:setup': ({ injectScript, updateConfig }) => {
				updateConfig({
					markdown: {
						remarkPlugins: [spoilers()],
					},
				});

				// Auto-import the Spoiler component and attach it to the global scope
				injectScript('page-ssr', `import ${SpoilerTagname} from "~/components/Spoiler.astro"; global.${SpoilerTagname} = ${SpoilerTagname};`);
			},
		},
	};
}
