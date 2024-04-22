import AstroMdx from '@astrojs/mdx';
import type { AstroIntegration } from 'astro';

/** Add `@astrojs/mdx` integration after Starlight's injected `astro-expressive-code` integration */
export function mdx(): AstroIntegration {
	return {
		name: 'add-mdx-integration',
		hooks: {
			'astro:config:setup': ({ config }) => {
				const astroMdxIndex = config.integrations.findIndex((i) => i.name === '@astrojs/mdx');
				// Replace Starlight injected `@astrojs/mdx` integration with our own
				config.integrations.splice(astroMdxIndex, 1, AstroMdx({ optimize: true }));
			},
		},
	};
}
