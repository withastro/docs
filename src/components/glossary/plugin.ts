import type { StarlightPlugin } from '@astrojs/starlight/types';

export function astroDocsGlossary(): StarlightPlugin {
	return {
		name: 'astro-docs-glossary',
		hooks: {
			setup({ addIntegration }) {
				addIntegration({
					name: 'astro-docs-glossary-integration',
					hooks: {
						'astro:config:setup': ({ injectRoute }) => {
							injectRoute({
								entryPoint: './src/components/glossary/GlossaryPage.astro',
								pattern: '/[locale]/reference/glossary/',
							});
						},
					},
				});
			},
		},
	};
}
