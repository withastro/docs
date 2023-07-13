export default [
	{ text: 'Empezar Aquí', header: true, type: 'learn', key: 'startHere' },
	{ text: 'Cómo Empezar', slug: 'getting-started', key: 'getting-started' },
	{ text: 'Instalación', slug: 'install/auto', key: 'install' },
	{ text: 'Configuración del Editor', slug: 'editor-setup', key: 'editor-setup' },
	{ text: 'Actualizar a v2', slug: 'guides/upgrade-to/v2', key: 'guides/upgrade-to/v2' },

	{ text: 'Conceptos Básicos', header: true, type: 'learn', key: 'coreConcepts' },
	{ text: 'Por qué Astro', slug: 'concepts/why-astro', key: 'concepts/why-astro' },
	{ text: 'MPA vs. SPA', slug: 'concepts/mpa-vs-spa', key: 'concepts/mpa-vs-spa' },
	{ text: 'Islas de Astro', slug: 'concepts/islands', key: 'concepts/islands' },

	{ text: 'Tutoriales', header: true, type: 'learn', key: 'tutorials' },
	{ text: 'Crear un blog', slug: 'tutorial/0-introduction', key: 'blog-tutorial' },
	// { text: 'Thinking with Islands', slug: 'tutorial/0-introduction', key: 'island-tutorial' },

	{ text: 'Conceptos básicos', header: true, type: 'learn', key: 'basics' },

	{
		text: 'Estructura del proyecto',
		slug: 'core-concepts/project-structure',
		key: 'core-concepts/project-structure',
	},
	{
		text: 'Componentes',
		slug: 'core-concepts/astro-components',
		key: 'core-concepts/astro-components',
	},
	{ text: 'Páginas', slug: 'core-concepts/astro-pages', key: 'core-concepts/astro-pages' },
	{ text: 'Layouts', slug: 'core-concepts/layouts', key: 'core-concepts/layouts' },

	{ text: 'Recetas', header: true, type: 'learn', key: 'examples' },
	{ text: 'Migrar a Astro', slug: 'guides/migrate-to-astro', key: 'guides/migrate-to-astro' },
	{ text: 'Conectar un CMS', slug: 'guides/cms', key: 'guides/cms' },
	{ text: 'Agregar servicios backend', slug: 'guides/backend', key: 'guides/backend' },
	{
		text: 'Agregar integraciones',
		slug: 'guides/integrations-guide',
		key: 'guides/integrations-guide',
	},
	{ text: 'Desplegar tu sitio', slug: 'guides/deploy', key: 'guides/deploy' },
	{ text: 'Más recetas', slug: 'recipes', key: 'guides/recipes' },

	{ text: 'Guías', header: true, type: 'learn', key: 'features' },
	{
		text: 'Sintaxis de Plantilla de Astro',
		slug: 'core-concepts/astro-syntax',
		key: 'core-concepts/astro-syntax',
	},
	{
		text: 'Frameworks de Interfaz de Usuario',
		slug: 'core-concepts/framework-components',
		key: 'core-concepts/framework-components',
	},
	{ text: 'Enrutamiento', slug: 'core-concepts/routing', key: 'core-concepts/routing' },
	{ text: 'Markdown y MDX', slug: 'guides/markdown-content', key: 'guides/markdown-content' },
	{
		text: 'Colecciones de Contenido',
		slug: 'guides/content-collections',
		key: 'guides/content-collections',
	},
	{
		text: 'Scripts y Manejo de Eventos',
		slug: 'guides/client-side-scripts',
		key: 'guides/client-side-scripts',
	},
	{ text: 'CSS y Estilos', slug: 'guides/styling', key: 'guides/styling' },
	{ text: 'Assets (Experimental)', slug: 'guides/assets', key: 'guides/assets' },
	{ text: 'Imágenes', slug: 'guides/images', key: 'guides/images' },
	{ text: 'Fuentes', slug: 'guides/fonts', key: 'guides/fonts' },
	{ text: 'Importaciones', slug: 'guides/imports', key: 'guides/imports' },
	{
		text: 'Renderizado en el lado del servidor (SSR)',
		slug: 'guides/server-side-rendering',
		key: 'guides/server-side-rendering',
	},
	{ text: 'Endpoints', slug: 'core-concepts/endpoints', key: 'core-concepts/endpoints' },
	{ text: 'Obtención de Datos', slug: 'guides/data-fetching', key: 'guides/data-fetching' },
	{ text: 'Middleware', slug: 'guides/middleware', key: 'guides/middleware' },
	{ text: 'Testing', slug: 'guides/testing', key: 'guides/testing' },
	{ text: 'Solución de Problemas', slug: 'guides/troubleshooting', key: 'guides/troubleshooting' },

	{ text: 'Configuración', header: true, type: 'learn', key: 'configuration' },
	{
		text: 'El archivo de configuración de Astro',
		slug: 'guides/configuring-astro',
		key: 'guides/configuring-astro',
	},
	{ text: 'TypeScript', slug: 'guides/typescript', key: 'guides/typescript' },
	{ text: 'Alias de importación', slug: 'guides/aliases', key: 'guides/aliases' },
	{
		text: 'Variables de entorno',
		slug: 'guides/environment-variables',
		key: 'guides/environment-variables',
	},

	{ text: 'Referencia', header: true, type: 'api', key: 'reference' },
	{
		text: 'Configuración',
		slug: 'reference/configuration-reference',
		key: 'reference/configuration-reference',
	},
	{
		text: 'API de Tiempo de Ejecución',
		slug: 'reference/api-reference',
		key: 'reference/api-reference',
	},
	{
		text: 'API de Integraciones',
		slug: 'reference/integrations-reference',
		key: 'reference/integrations-reference',
	},
	{
		text: 'API de Adaptador',
		slug: 'reference/adapter-reference',
		key: 'reference/adapter-reference',
	},
	{
		text: 'API de Servicio de Imágenes',
		slug: 'reference/image-service-reference',
		key: 'reference/image-service-reference',
	},
	{
		text: 'Directivas de Plantilla',
		slug: 'reference/directives-reference',
		key: 'reference/directives-reference',
	},
	{ text: 'La CLI de Astro', slug: 'reference/cli-reference', key: 'reference/cli-reference' },
	{
		text: 'Referencia de Errores',
		slug: 'reference/error-reference',
		key: 'reference/error-reference',
	},
	{
		text: 'Formato de Paquete NPM',
		slug: 'reference/publish-to-npm',
		key: 'guides/publish-to-npm',
	},
] as const;
