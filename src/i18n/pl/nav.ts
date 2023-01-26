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
	{ text: 'Zacznij tutaj', header: true, type: 'learn', key: 'zacznijTutaj' },
	{ text: 'Rozpoczęcie', slug: 'getting-started', key: 'rozpoczecie' },
	{ text: 'Instalacja', slug: 'install/auto', key: 'instalacja' },
	{ text: 'Ustawienia edytora', slug: 'editor-setup', key: 'ustawienia-edytora' },
	{ text: 'Aktualizacja do v2', slug: 'guides/upgrade-to/v2', key: 'guides/aktualizacja-do/v2' },
	{ text: 'Migracja do Astro', slug: 'guides/migrate-to-astro', key: 'guides/migracja-do-astro' },

	{ text: 'Poradniki', header: true, type: 'learn', key: 'poradniki' },
	{ text: 'Zbuduj bloga', slug: 'tutorial/0-introduction', key: 'poradnik-do-bloga' },

	{ text: 'Wewnętrzne założenia', header: true, type: 'learn', key: 'wewnetrzne-zalozenia' },
	{ text: 'Dlaczego Astro', slug: 'concepts/why-astro', key: 'concepts/dlaczego-astro' },
	{ text: 'MPA vs. SPA', slug: 'concepts/mpa-vs-spa', key: 'concepts/mpa-vs-spa' },
	{ text: 'Wyspy Astro', slug: 'concepts/islands', key: 'concepts/wyspy' },

	{ text: 'Podstawy', header: true, type: 'learn', key: 'podstawy' },
	{
		text: 'Struktura projektu',
		slug: 'core-concepts/project-structure',
		key: 'core-concepts/struktura-projektu',
	},
	{
		text: 'Komponenty Astro',
		slug: 'core-concepts/astro-components',
		key: 'core-concepts/komponenty-astro',
	},
	{ text: 'Strony', slug: 'core-concepts/astro-pages', key: 'core-concepts/strony-astro' },
	{ text: 'Układy', slug: 'core-concepts/layouts', key: 'core-concepts/uklady' },
	{ text: 'Markdown i MDX', slug: 'guides/markdown-content', key: 'guides/kontent-markdown' },
	{ text: 'Routowanie', slug: 'core-concepts/routing', key: 'core-concepts/routowanie' },
	{ text: 'Importy', slug: 'guides/imports', key: 'guides/importy' },
	{ text: 'Endpointy', slug: 'core-concepts/endpoints', key: 'core-concepts/endpointy' },
	{ text: 'Pobieranie danych', slug: 'guides/data-fetching', key: 'guides/pobieranie-danych' },
	{ text: 'Wdrażanie', slug: 'guides/deploy', key: 'guides/wdrazanie' },
	{
		text: 'Rozwiązywanie problemów',
		slug: 'guides/troubleshooting',
		key: 'guides/rozwiazywanie-problemow',
	},

	{ text: 'Poradniki', header: true, type: 'learn', key: 'features' },
	{ text: 'Integracje', slug: 'guides/integrations-guide', key: 'guides/poradniki-integracji' },
	{
		text: 'Frameworki UI',
		slug: 'core-concepts/framework-components',
		key: 'core-concepts/frameworki-ui',
	},
	{
		text: 'Skrypty i zdażenia',
		slug: 'guides/client-side-scripts',
		key: 'guides/skrypty-i-zdazenia',
	},
	{ text: 'CSS & Stylowanie', slug: 'guides/styling', key: 'guides/stylowanie' },
	{
		text: 'Renderowanie po stronie serwera (SSR)',
		slug: 'guides/server-side-rendering',
		key: 'guides/renderowanie-po-stronie-serwera',
	},
	{ text: 'Tworzenie treści', slug: 'guides/content', key: 'guides/tworzenie-tresci' },
	{
		text: 'Zbiory treści',
		slug: 'guides/content-collections',
		key: 'guides/zbiory-tresci',
	},
	{ text: 'Używanie z CMS', slug: 'guides/cms', key: 'guides/cms' },
	{ text: 'Zdjęcia', slug: 'guides/images', key: 'guides/zdjecia' },
	{ text: 'Czcionki', slug: 'guides/fonts', key: 'guides/czcionki' },
	{
		text: 'Dzielenie stanu',
		slug: 'core-concepts/sharing-state',
		key: 'core-concepts/dzielenie-stanu',
	},
	{ text: 'RSS', slug: 'guides/rss', key: 'guides/rss' },
	{ text: 'Testowanie', slug: 'guides/testing', key: 'guides/testowanie' },

	{ text: 'Konfiguracja', header: true, type: 'learn', key: 'konfiguracja' },
	{
		text: 'Plik konfiguracyjny Astro',
		slug: 'guides/configuring-astro',
		key: 'guides/konfiguracja-astro',
	},
	{ text: 'TypeScript', slug: 'guides/typescript', key: 'guides/typescript' },
	{ text: 'Aliasy importowania', slug: 'guides/aliases', key: 'guides/aliasy' },
	{
		text: 'Zmienne środowiskowe',
		slug: 'guides/environment-variables',
		key: 'guides/zmienne-srodowiskowe',
	},

	{ text: 'Referencje', header: true, type: 'api', key: 'reference' },
	{
		text: 'Konfiguracja',
		slug: 'reference/configuration-reference',
		key: 'reference/konfiguracja-referencji',
	},
	{ text: 'CLI', slug: 'reference/cli-reference', key: 'reference/referencja-cli' },
	{ text: 'Runtime API', slug: 'reference/api-reference', key: 'reference/referencja-api' },
	{
		text: 'API integracji',
		slug: 'reference/integrations-reference',
		key: 'reference/api-integracji',
	},
	{ text: 'API adapterów', slug: 'reference/adapter-reference', key: 'reference/adaptery-api' },
	{
		text: 'Dyrektywy szablonów',
		slug: 'reference/directives-reference',
		key: 'reference/dyrektywy-szablonow',
	},
	{
		text: 'Referencja błędów',
		slug: 'reference/error-reference',
		key: 'reference/referencja-bledow',
	},
	{ text: 'Format pakietu NPM', slug: 'reference/publish-to-npm', key: 'guides/publikacja-do-npm' },
] as const;
