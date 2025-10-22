import type { StarlightPlugin } from '@astrojs/starlight/types';
import { twoLocalesConfig } from '../locales';

/**
 * Starlight plugin to reduce the number of locales for Astro's smoke tests.
 *
 * This is done in a plugin rather than a conditional in the Starlight config
 * so that the config remains statically analyzable.
 */
export function starlightPluginSmokeTest(): StarlightPlugin {
	return {
		name: 'starlight-plugin-smoke-test',
		hooks: {
			'config:setup'({ updateConfig }) {
				if (!process.env.PUBLIC_TWO_LANG) return;

				updateConfig({ locales: twoLocalesConfig });
			},
		},
	};
}
