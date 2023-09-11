/**
 * This configures the navigation sidebar.
 * All other languages follow this ordering/structure and will fall back to
 * English for any entries they haven’t translated.
 *
 * - All entries MUST include `text` and `key`
 * - Heading entries MUST include `header: true` and `type`
 * - Link entries MUST include `slug` (which excludes the language code)
 */
export default [
	{ text: 'Commencer ici', header: true, type: 'learn', key: 'startHere' },
	{ text: 'Bien démarrer', slug: 'getting-started', key: 'getting-started' },
	{ text: 'Installation', slug: 'install/auto', key: 'install' },
	{ text: 'Configuration de l\'éditeur de code', slug: 'editor-setup', key: 'editor-setup' },
	{ text: 'Mise à jour vers la v3', slug: 'guides/upgrade-to/v3', key: 'guides/upgrade-to/v3' },

	{ text: 'Concepts Fondamentaux', header: true, type: 'learn', key: 'coreConcepts' },
	{ text: 'Pourquoi Astro ?', slug: 'concepts/why-astro', key: 'concepts/why-astro' },
	{ text: 'Les îles Astro', slug: 'concepts/islands', key: 'concepts/islands' },

	{ text: 'Tutoriels', header: true, type: 'learn', key: 'tutorials' },
	{ text: 'Construire un Blog', slug: 'tutorial/0-introduction', key: 'blog-tutorial' },
	// { text: 'Thinking with Islands', slug: 'tutorial/0-introduction', key: 'island-tutorial' },

	{ text: 'Les Bases', header: true, type: 'learn', key: 'basics' },

	{
		text: 'Structure du Projet',
		slug: 'core-concepts/project-structure',
		key: 'core-concepts/project-structure',
	},
	{
		text: 'Composants',
		slug: 'core-concepts/astro-components',
		key: 'core-concepts/astro-components',
	},
	{ text: 'Pages', slug: 'core-concepts/astro-pages', key: 'core-concepts/astro-pages' },
	{ text: 'Layouts', slug: 'core-concepts/layouts', key: 'core-concepts/layouts' },

	{ text: 'Méthodes', header: true, type: 'learn', key: 'examples' },
	{ text: 'Migrer vers Astro', slug: 'guides/migrate-to-astro', key: 'guides/migrate-to-astro' },
	{ text: 'Connecter un CMS', slug: 'guides/cms', key: 'guides/cms' },
	{ text: 'Ajouter des services Backend', slug: 'guides/backend', key: 'guides/backend' },
	{ text: 'Intégrations', slug: 'guides/integrations-guide', key: 'guides/integrations-guide' },
	{ text: 'Déployez votre site', slug: 'guides/deploy', key: 'guides/deploy' },
	{ text: 'Plus de méthodes', slug: 'recipes', key: 'guides/recipes' },

	{ text: 'Guides', header: true, type: 'learn', key: 'features' },
	{
		text: 'Syntaxe de Template Astro',
		slug: 'core-concepts/astro-syntax',
		key: 'core-concepts/astro-syntax',
	},
	{
		text: 'Framework d\'interface',
		slug: 'core-concepts/framework-components',
		key: 'core-concepts/framework-components',
	},
	{ text: 'Routage', slug: 'core-concepts/routing', key: 'core-concepts/routing' },
	{ text: 'Markdown & MDX', slug: 'guides/markdown-content', key: 'guides/markdown-content' },
	{
		text: 'Collections de Contenu',
		slug: 'guides/content-collections',
		key: 'guides/content-collections',
	},
	{
		text: 'Scripts & gestion d\'évènements',
		slug: 'guides/client-side-scripts',
		key: 'guides/client-side-scripts',
	},
	{ text: 'Styles & CSS', slug: 'guides/styling', key: 'guides/styling' },
	{ text: 'Images', slug: 'guides/images', key: 'guides/images' },
	{ text: 'Polices d\'écritures', slug: 'guides/fonts', key: 'guides/fonts' },
	{ text: 'Imports', slug: 'guides/imports', key: 'guides/imports' },
	{
		text: 'Rendu Côté Serveur (SSR)',
		slug: 'guides/server-side-rendering',
		key: 'guides/server-side-rendering',
	},
	{ text: 'Points de terminaison', slug: 'core-concepts/endpoints', key: 'core-concepts/endpoints' },
	{ text: 'Récupération de Données', slug: 'guides/data-fetching', key: 'guides/data-fetching' },
	{ text: 'Middleware', slug: 'guides/middleware', key: 'guides/middleware' },
	{ text: 'Test', slug: 'guides/testing', key: 'guides/testing' },
	{
		text: 'Voir les Transitions',
		slug: 'guides/view-transitions',
		key: 'guides/view-transitions',
	},
	{ text: 'Dépannage', slug: 'guides/troubleshooting', key: 'guides/troubleshooting' },

	{ text: 'Configuration', header: true, type: 'learn', key: 'configuration' },
	{
		text: 'Le Fichier de Configuration Astro',
		slug: 'guides/configuring-astro',
		key: 'guides/configuring-astro',
	},
	{ text: 'TypeScript', slug: 'guides/typescript', key: 'guides/typescript' },
	{ text: 'Alias d\'Importation', slug: 'guides/aliases', key: 'guides/aliases' },
	{
		text: 'Variables d\'Environnement',
		slug: 'guides/environment-variables',
		key: 'guides/environment-variables',
	},

	{ text: 'Référence', header: true, type: 'api', key: 'reference' },
	{
		text: 'Configuration',
		slug: 'reference/configuration-reference',
		key: 'reference/configuration-reference',
	},
	{ text: 'API d\'Exécution', slug: 'reference/api-reference', key: 'reference/api-reference' },
	{
		text: 'API d\'Intégration',
		slug: 'reference/integrations-reference',
		key: 'reference/integrations-reference',
	},
	{ text: 'API des adaptateurs', slug: 'reference/adapter-reference', key: 'reference/adapter-reference' },
	{
		text: 'API du Service d\'Images',
		slug: 'reference/image-service-reference',
		key: 'reference/image-service-reference',
	},
	{
		text: 'Utilisation des Directives',
		slug: 'reference/directives-reference',
		key: 'reference/directives-reference',
	},
	{ text: 'CLI d\'Astro', slug: 'reference/cli-reference', key: 'reference/cli-reference' },
	{
		text: 'Référence des erreurs',
		slug: 'reference/error-reference',
		key: 'reference/error-reference',
	},
	{ text: 'Format de Packet NPM', slug: 'reference/publish-to-npm', key: 'guides/publish-to-npm' },
] as const;
