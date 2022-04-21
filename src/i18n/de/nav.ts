import { NavDictionary } from '../checks';

export default NavDictionary({
	// Start Here
	startHere: { text: 'Hier Anfangen', header: true, type: 'learn' },
	'getting-started': { text: 'Erste Schritte', slug: 'getting-started' },
	install: { text: 'Installation', slug: 'installation' },
	'editor-setup': { text: 'Editor-Einrichtung', slug: 'editor-setup' },
	'comparing-astro-vs-other-tools': { text: 'Astro vs. X', slug: 'comparing-astro-vs-other-tools' },
	migrate: { text: 'Umstellung auf v0.21', slug: 'migration/0.21.0' },

	// Core Concepts
	'core-concepts/partial-hydration': { text: 'Partial Hydration', slug: 'core-concepts/component-hydration' },

	// Basics
	basics: { text: 'Grundlagen', header: true, type: 'learn' },
	'core-concepts/project-structure': { text: 'Projektstruktur', slug: 'core-concepts/project-structure' },
	'core-concepts/astro-components': { text: 'Astro-Komponenten', slug: 'core-concepts/astro-components' },
	'core-concepts/astro-pages': { text: 'Astro-Seiten', slug: 'core-concepts/astro-pages' },
	'core-concepts/layouts': { text: 'Layouts', slug: 'core-concepts/layouts' },

	// Features
	features: { text: 'Anleitungen', header: true, type: 'learn' },
	'guides/styling': { text: 'Styling & CSS', slug: 'guides/styling' },

	// Reference
	'core-concepts/routing': { text: 'Routing', slug: 'core-concepts/routing' },
});
