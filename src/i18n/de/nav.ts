import { NavDictionary } from '../checks';

export default NavDictionary({
	startHere: { text: 'Einrichtung', header: true, type: 'learn' },
	'getting-started': { text: 'Erste Schritte', slug: 'getting-started' },
	install: { text: 'Installation', slug: 'installation' },
	'comparing-astro-vs-other-tools': { text: 'Astro vs. X', slug: 'comparing-astro-vs-other-tools' },
	migrate: { text: 'Umstellung auf v0.21', slug: 'migration/0.21.0' },

	basics: { text: 'Grundlagen', header: true, type: 'learn' },
	'core-concepts/project-structure': { text: 'Projektstruktur', slug: 'core-concepts/project-structure' },
	'core-concepts/astro-components': { text: 'Astro-Komponenten', slug: 'core-concepts/astro-components' },
	'core-concepts/astro-pages': { text: 'Astro-Seiten', slug: 'core-concepts/astro-pages' },
	'core-concepts/layouts': { text: 'Layouts', slug: 'core-concepts/layouts' },

	// These have since moved in the English sidebar
	'core-concepts/routing': { text: 'Routing', slug: 'core-concepts/routing' },
	'core-concepts/partial-hydration': { text: 'Partial Hydration', slug: 'core-concepts/component-hydration' },

	features: { text: 'Anleitungen', header: true, type: 'learn' },
	'guides/styling': { text: 'Styling & CSS', slug: 'guides/styling' },
});
