---
layout: ~/layouts/MainLayout.astro
title: Contenido de autoría
description: "Astro es una opción perfecta para su sitio centrado en el contenido: blogs, sitios de marketing, carteras y más. Cree su contenido directamente en su proyecto, o conecte su CMS de elección."
i18nReady: true
---
Astro es una opción perfecta para su sitio centrado en el contenido: blogs, sitios de marketing, carteras y más.

Astro te ayuda a crear y presentar tu contenido. Puede escribir una publicación de blog directamente en Astro usando Markdown/MDX, o buscar su contenido desde un CMS sin encabezado. Astro le permite crear un sitio en torno a su contenido: puede agregar un diseño a sus páginas, crear un índice de publicaciones y configurar una fuente RSS para permitir que los lectores se suscriban.

## Escribir contenido

En Astro, puede crear su contenido de varias maneras: 
- En archivos Markdown (`.md`), diseñados para facilitar la escritura de contenido de texto enriquecido.
- En archivos MDX (`.mdx`), que le permiten incluir componentes y expresiones dinámicas en su documento.
- Usando un sistema de administración de contenido (CMS) de terceros, luego extrayendo ese contenido a una página `.astro`.
- Otras opciones (menos utilizadas para páginas con mucho contenido) incluyen [Archivos `.astro`](/es/core-concepts/astro-pages/#páginas-de-astro) y [Archivos `.html`](/es/core-concepts/astro-pages/#páginas-html).

### Creación de rebajas
Markdown es una sintaxis conveniente para escribir texto enriquecido con formato básico y elementos comunes como encabezados, listas e imágenes. Astro tiene soporte incorporado para archivos Markdown en su proyecto.

Cree y escriba un nuevo archivo `.md` en su editor de código o traiga un archivo existente escrito en su editor Markdown favorito. Algunos editores de Markdown en línea como [StackEdit](https://stackedit.io/) y [Dillinger](https://dillinger.io) incluso le permitirá editar y sincronizar su trabajo con su repositorio de Astro almacenado en GitHub.

📚 Learn more about [escribir contenido Markdown en Astro](/es/guides/markdown-content/).

### Autoría MDX
Si agrega la integración MDX a su proyecto, también puede escribir contenido usando archivos `.mdx`, que le permiten incluir expresiones JavaScript y componentes personalizados dentro de su Markdown. Esto incluye tanto estática [Componentes Astro](/es/core-concepts/astro-components/) e interactivo [componentes del framework](/es/core-concepts/framework-components/). Agregue elementos de la interfaz de usuario como un banner o un carrusel interactivo directamente en su texto para convertir su contenido en páginas web completas.

Escriba y edite archivos `.mdx` directamente en su editor de código, junto con sus archivos de proyecto.

📚 Aprender más acerca de [utilizando MDX con Astro](/es/guides/integrations-guide/mdx/).

### Autoría de CMS sin cabeza

Escriba publicaciones de blog en su sistema de administración de contenido (CMS) existente, como Storyblok, WordPress o Contentful. Algunos CMS, como Storyblok, brindan un [integración Astro](https://www.storyblok.com/mp/announcing-storyblok-astro). Otros exponen un SDK de JavaScript que las páginas de Astro pueden usar para [obtener su contenido remoto](/es/guides/data-fetching/#fetching-de-datos-desde-un-headless-cms).

## Administrar páginas de contenido

Los archivos Markdown y MDX que viven en su `src/pages` directorio generarán automáticamente páginas en su sitio utilizando el [enrutamiento basado en archivos](/es/core-concepts/routing/) de Astro, creado en una URL correspondiente a la ruta del archivo de la publicación. 

También puede optar por mantener sus archivos Markdown y MDX fuera del directorio `src/pages` y, en su lugar, [importar su contenido](/es/guides/markdown-content/#importando-markdown) en páginas `.astro`.

Si está escribiendo su contenido en un CMS, puede obtener sus publicaciones y usar [enrutamiento dinámico](/es/core-concepts/routing/#rutas-dinámicas) usar un archivo `.astro` para generar una ruta para cada publicación. En el modo estático predeterminado de Astro, estas rutas se generan en el momento de la construcción. Si opta por el [modo SSR](/es/guides/server-side-rendering/), usted responde a una solicitud en tiempo de ejecución y obtiene el contenido a pedido.

## Exhibiendo tu contenido

Para crear funciones comunes para organizar y mostrar su contenido, como un archivo de blog o una página para cada etiqueta de blog, Astro le permite [obtener nombres de archivo y metadatos](/es/reference/api-reference/#astroglob) desde su Markdown y MDX frontmatter y utilícelos para generar contenido de página y rutas.

## Integraciones comunitarias

Además de la integración oficial [`@astrojs/mdx`](/es/guides/integrations-guide/mdx/), existen varias [integraciones comunitarias](https://astro.build/integrations/css+ui/?q=content) para trabajar con contenido en su proyecto Astro.
