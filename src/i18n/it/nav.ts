export default [
	{ text: 'Comincia qua', header: true, type: 'learn', key: 'startHere' },
	{ text: 'Per Iniziare', slug: 'getting-started', key: 'getting-started' },
	{ text: 'Installazione', slug: 'install/auto', key: 'install' },
	{ text: 'Setup dell’Editor', slug: 'editor-setup', key: 'editor-setup' },
	{ text: 'Aggiorna a v3', slug: 'guides/upgrade-to/v3', key: 'guides/upgrade-to/v3' },

	{ text: 'Concetti Chiave', header: true, type: 'learn', key: 'coreConcepts' },
	{ text: 'Perché Astro', slug: 'concepts/why-astro', key: 'concepts/why-astro' },
	{ text: 'MPA vs. SPA', slug: 'concepts/mpa-vs-spa', key: 'concepts/mpa-vs-spa' },
	{ text: 'Le Isole Astro', slug: 'concepts/islands', key: 'concepts/islands' },

	{ text: 'Tutorial', header: true, type: 'learn', key: 'tutorials' },
	{ text: 'Costruisci un Blog', slug: 'tutorial/0-introduction', key: 'blog-tutorial' },
	// { text: 'Thinking with Islands', slug: 'tutorial/0-introduction', key: 'island-tutorial' },

	{ text: 'Le basi', header: true, type: 'learn', key: 'basics' },

	{
		text: 'Struttura del Progetto',
		slug: 'core-concepts/project-structure',
		key: 'core-concepts/project-structure',
	},
	{
		text: 'Componenti',
		slug: 'core-concepts/astro-components',
		key: 'core-concepts/astro-components',
	},
	{ text: 'Pagine', slug: 'core-concepts/astro-pages', key: 'core-concepts/astro-pages' },
	{ text: 'Layout', slug: 'core-concepts/layouts', key: 'core-concepts/layouts' },

	{ text: 'Soluzioni', header: true, type: 'learn', key: 'examples' },
	{ text: 'Passa ad Astro', slug: 'guides/migrate-to-astro', key: 'guides/migrate-to-astro' },
	{ text: 'Connetti una CMS', slug: 'guides/cms', key: 'guides/cms' },
	{ text: 'Aggiungi un servizio backend', slug: 'guides/backend', key: 'guides/backend' },
	{
		text: 'Aggiungi un’integrazione',
		slug: 'guides/integrations-guide',
		key: 'guides/integrations-guide',
	},
	{ text: 'Pubblica il tuo sito', slug: 'guides/deploy', key: 'guides/deploy' },
	{ text: 'Altre soluzioni', slug: 'recipes', key: 'guides/recipes' },

	{ text: 'Guide', header: true, type: 'learn', key: 'features' },
	{
		text: 'Sintassi dei Template di Astro',
		slug: 'core-concepts/astro-syntax',
		key: 'core-concepts/astro-syntax',
	},
	{
		text: 'Framework UI',
		slug: 'core-concepts/framework-components',
		key: 'core-concepts/framework-components',
	},
	{ text: 'Navigazione', slug: 'core-concepts/routing', key: 'core-concepts/routing' },
	{ text: 'Markdown & MDX', slug: 'guides/markdown-content', key: 'guides/markdown-content' },
	{
		text: 'Collezioni di Contenuti',
		slug: 'guides/content-collections',
		key: 'guides/content-collections',
	},
	{
		text: 'Script & Gestione degli Eventi',
		slug: 'guides/client-side-scripts',
		key: 'guides/client-side-scripts',
	},
	{ text: 'CSS & Stili', slug: 'guides/styling', key: 'guides/styling' },
	{ text: 'Asset (Sperimentale)', slug: 'guides/assets', key: 'guides/assets' },
	{ text: 'Immagini', slug: 'guides/images', key: 'guides/images' },
	{ text: 'Font', slug: 'guides/fonts', key: 'guides/fonts' },
	{ text: 'Import', slug: 'guides/imports', key: 'guides/imports' },
	{
		text: 'Rendering lato server (SSR)',
		slug: 'guides/server-side-rendering',
		key: 'guides/server-side-rendering',
	},
	{ text: 'Punti d’accesso', slug: 'core-concepts/endpoints', key: 'core-concepts/endpoints' },
	{ text: 'Fetch dei Dati', slug: 'guides/data-fetching', key: 'guides/data-fetching' },
	{ text: 'Middleware', slug: 'guides/middleware', key: 'guides/middleware' },
	{ text: 'Testing', slug: 'guides/testing', key: 'guides/testing' },
	{
		text: 'Risoluzione dei problemi',
		slug: 'guides/troubleshooting',
		key: 'guides/troubleshooting',
	},

	{ text: 'Configurazione', header: true, type: 'learn', key: 'configuration' },
	{
		text: 'Il File di Configurazione di Astro',
		slug: 'guides/configuring-astro',
		key: 'guides/configuring-astro',
	},
	{ text: 'TypeScript', slug: 'guides/typescript', key: 'guides/typescript' },
	{ text: 'Import Alias', slug: 'guides/aliases', key: 'guides/aliases' },
	{
		text: 'Variabili d’Ambiente',
		slug: 'guides/environment-variables',
		key: 'guides/environment-variables',
	},

	{ text: 'API Reference', header: true, type: 'api', key: 'reference' },
	{
		text: 'Configurazione',
		slug: 'reference/configuration-reference',
		key: 'reference/configuration-reference',
	},
	{ text: 'API del Runtime', slug: 'reference/api-reference', key: 'reference/api-reference' },
	{
		text: 'API delle Integrazioni',
		slug: 'reference/integrations-reference',
		key: 'reference/integrations-reference',
	},
	{
		text: 'API degli Adattatori',
		slug: 'reference/adapter-reference',
		key: 'reference/adapter-reference',
	},
	{
		text: 'API del Servizio Immagini',
		slug: 'reference/image-service-reference',
		key: 'reference/image-service-reference',
	},
	{
		text: 'Direttive dei Template',
		slug: 'reference/directives-reference',
		key: 'reference/directives-reference',
	},
	{ text: 'La CLI di Astro', slug: 'reference/cli-reference', key: 'reference/cli-reference' },
	{
		text: 'Reference degli Errori',
		slug: 'reference/error-reference',
		key: 'reference/error-reference',
	},
	{
		text: 'Formato del Pacchetto NPM',
		slug: 'reference/publish-to-npm',
		key: 'guides/publish-to-npm',
	},
] as const;
