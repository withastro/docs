/**
 * Ceci configure la barre latérale de navigation.
 * Toutes les autres langues suivent cet ordre/structure et reviendront à l'anglais pour toutes les entrées non traduites.
 *
 * - Toutes les entrées doivent inclure `text` et `key`.
 * - Les entrées d'en-tête DOIVENT inclure `header: true` et `type`.
 * - Les entrées de liens DOIVENT inclure `slug` (ce qui exclut le code de langue)
 */
export default [
	// Start Here
	{ text: 'Commencez ici', header: true, type: 'learn', key: 'startHere' },
	{ text: 'Bien démarrer', slug: 'getting-started', key: 'getting-started' },
	{ text: 'Installation', slug: 'install/auto', key: 'install' },
	{ text: 'Configuration de l\'éditeur de code', slug: 'editor-setup', key: 'editor-setup' },
	{ text: 'Guide de Migration', slug: 'migrate', key: 'migrate' },
	{ text: 'Construit avec Astro', slug: 'integrations/integrations', key: 'integrations/integrations' },
	{ text: 'Astro vs. X', slug: 'comparing-astro-vs-other-tools', key: 'comparing-astro-vs-other-tools' },

	// Core Concepts
	{ text: 'Concepts Principaux', header: true, type: 'learn', key: 'coreConcepts' },
	{ text: 'Pourquoi Astro ?', slug: 'concepts/why-astro', key: 'concepts/why-astro' },
	{ text: 'MPA vs. SPA', slug: 'concepts/mpa-vs-spa', key: 'concepts/mpa-vs-spa' },

	// Basics
	{ text: 'Les bases', header: true, type: 'learn', key: 'basics' },
	{ text: 'Structure du Projet', slug: 'core-concepts/project-structure', key: 'core-concepts/project-structure' },
	{ text: 'Composants', slug: 'core-concepts/astro-components', key: 'core-concepts/astro-components' },
	{ text: 'Pages', slug: 'core-concepts/astro-pages', key: 'core-concepts/astro-pages' },
	{ text: 'Layouts', slug: 'core-concepts/astro-layouts', key: 'core-concepts/astro-layouts' },
	{ text: 'Markdown', slug: 'guides/markdown-content', key: 'guides/markdown-content' },
	{ text: 'Fichiers Statiques', slug: 'guides/imports', key: 'guides/imports' },
	{ text: 'Dépannage', slug: 'guides/troubleshooting', key: 'guides/troubleshooting' },

	// Features
	{ text: 'Fonctionnalités', header: true, type: 'learn', key: 'features' },
	{ text: 'Configurer Astro', slug: 'guides/configuring-astro', key: 'guides/configuring-astro' },
	{ text: 'CSS et Styles', slug: 'guides/styling', key: 'guides/styling' },
	{ text: 'Récupération de Données', slug: 'guides/data-fetching', key: 'guides/data-fetching' },
	{ text: 'Déployer', slug: 'guides/deploy', key: 'guides/deploy' },
	{ text: 'Variables d\'Environnement', slug: 'guides/environment-variables', key: 'guides/environment-variables' },
	{ text: 'Alias d\'importation', slug: 'guides/aliases', key: 'guides/aliases' },
	{ text: 'Intégrations', slug: 'guides/integrations-guide', key: 'guides/integrations-guide' },
	{ text: 'Flux RSS', slug: 'guides/rss', key: 'guides/rss' },
	{ text: 'Rendu côté serveur (SSR)', slug: 'guides/server-side-rendering', key: 'guides/server-side-rendering' },
	{ text: 'TypeScript', slug: 'guides/typescript', key: 'guides/typescript' },
	{ text: 'Composants de Frameworks', slug: 'core-concepts/framework-components', key: 'core-concepts/framework-components' },

	// Référence
	{ text: 'Référence', header: true, type: 'reference', key: 'reference' },
	{ text: 'Configuration', slug: 'reference/configuration-reference', key: 'reference/configuration-reference' },
	{ text: 'Lignes de Commandes', slug: 'reference/cli-reference', key: 'reference/cli-reference' },
	{ text: 'API d\'Exécution', slug: 'reference/api-reference', key: 'reference/api-reference' },
	{ text: 'API d\'Intégration', slug: 'reference/integrations-reference', key: 'reference/integrations-reference' },
	{ text: 'API des adaptateurs (expérimental)', slug: 'reference/adapter-reference', key: 'reference/adapter-reference' },
	{ text: 'Règles de Routage', slug: 'core-concepts/routing', key: 'core-concepts/routing' },
	{ text: 'Utilisation des Directives', slug: 'reference/directives-reference', key: 'reference/directives-reference' },
	{ text: 'Format de Packet NPM', slug: 'guides/publish-to-npm', key: 'guides/publish-to-npm' },
] as const;