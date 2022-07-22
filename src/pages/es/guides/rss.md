---
layout: ~/layouts/MainLayout.astro
title: RSS
description: Introducción a RSS en Astro
i18nReady: true
---

Astro proporciona una generación rápida y automática de RSS feeds para blogs u otros sitios web con mucho contenido. Para más información acerca de RSS feeds en general, visita [aboutfeeds.com](https://aboutfeeds.com/).

## Configurando `@astrojs/rss`

El paquete `@astrojs/rss` provee helper functions para generar RSS feeds utilizando [API endpoints](/es/core-concepts/astro-pages/#páginas-no-html). Esto desbloquea la generación de RSS feeds para builds estáticos _y_ on-demand para cuando utilizamos un [adaptador SSR](/es/guides/server-side-rendering/#habilitando-ssr-en-su-proyecto).

Primero, instala `@astrojs/rss` utilizando tu gestor de paquetes favorito:

```bash
# npm
npm i @astrojs/rss
# yarn
yarn add @astrojs/rss
# pnpm
pnpm i @astrojs/rss
```

Luego, asegúrate de haber [configurado un `site`](/es/reference/configuration-reference/#site) en el archivo `astro.config` de tu proyecto. Vas a utilizar esto para generar links en tu feed RSS [por medio de la variable de entorno `SITE`](/es/guides/environment-variables/#variables-de-entorno-predeterminadas).

:::note[Requiere v1]
La variable de entorno `SITE` solamente está disponible en la versión beta 1.0 de Astro. Actualiza a la última versión de Astro (`astro@latest`), o escribe tu `site` manualmente (vea los ejemplos a continuación).
:::

¡Ahora, generemos nuestro primer RSS feed! Crea un archivo `rss.xml.js` en la carpeta `src/pages/`. La URL en producción será `rss.xml`, así que siéntete libre de renombrarlo si así lo deseas.

Luego, importa la helper function `rss` del paquete `@astrojs/rss` y llámala con los siguientes parámetros:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

export const get = () => rss({
    // campo `<title>` en el xml generado
    title: 'Blog de Buzz',
    // campo `<description>` en el xml generado
    description: 'Guía para las estrellas de un humilde astronauta',
    // URL base para links de <item> en el RSS
    // SITE utilizará "site" del astro.config de tu proyecto.
    site: import.meta.env.SITE,
    // lista de `<item>`s en el xml generado
    // ejemplo simple: generar items por cada archivo md en /src/pages
    // vea la sección "Generando items" para ver el frontmatter requerido y casos de uso avanzados
    items: import.meta.glob('./**/*.md'),
    // (opcional) inyecte xml personalizado
    customData: `<language>es-es</language>`,
  });
```

## Generando `items`

El campo `items` acepta cualquiera de estas dos opciones:

1. [El resultado de `import.meta.glob(...)`](#1-resultado-de-importmetaglob) **(utilícelo únicamente para archivos `.md` dentro de la carpeta `src/pages/`!)**
2. [Una lista de objetos RSS feed](#2-listado-de-objetos-rss-feed), cada uno con los campos requeridos `link`, `title`, `pubDate`, y los opcionales `description` y `customData`.

### 1. Resultado de `import.meta.glob`

Recomendamos esta opción como un atajo conveniente para archivos `.md` dentro de la carpeta `src/pages/`. Cada artículo debe tener los campos requeridos `title`, `pubDate` y los opcionales `description` y `customData` en su frontmatter. Si esto no es posible, o si prefiere generar el frontmatter utilizando código, [vea la opción 2](#2-listado-de-objetos-rss-feed).

En el caso en que los artículos de tu blog estén guardados en la carpeta `src/pages/blog/`, puedes generar un RSS feed de la siguiente manera:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

export const get = () => rss({
    title: 'Blog de Buzz',
    description: 'Guía para las estrellas de un humilde astronauta',
    site: import.meta.env.SITE,
    items: import.meta.glob('./blog/**/*.md'),
  });
```

Vea la [documentación de glob import de Vite](https://vitejs.dev/guide/features.html#glob-import) para más información sobre esta sintaxis de importación.

### 2. Listado de objetos RSS feed

Recomendamos esta opción para archivos `.md` que se encuentran fuera de la carpeta `pages`. Esto es común cuando generamos rutas [vía `getStaticPaths`](/es/reference/api-reference/#getstaticpaths).

En el caso en que los artículos de tu blog estén guardados en la carpeta `src/posts/`, y cada artículo posea un `title`, `pubDate` y `slug` en su frontmatter (donde `slug` corresponde a la URL en producción en su sitio), podemos generar un RSS feed utilizando la [helper function de Vite `import.meta.globEager`](https://vitejs.dev/guide/features.html#glob-import) de la siguiente manera:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

const postImportResult = import.meta.globEager('../posts/**/*.md');
const posts = Object.values(postImportResult);

export const get = () => rss({
    title: 'Blog de Buzz',
    description: 'Guía para las estrellas de un humilde astronauta',
    site: import.meta.env.SITE,
    items: posts.map((post) => ({
      link: post.frontmatter.slug,
      title: post.frontmatter.title,
      pubDate: post.frontmatter.pubDate,
    }))
  });
```

## Añadiendo una hoja de estilos

Puedes estilar tu RSS feed para proveer una experiencia de usuario más placentera a la hora de ver el archivo en el navegador.

Utiliza la opción `stylesheet` de la helper function `rss` para especificar un path absoluto a tu hoja de estilos.

```js
rss({
  // ej. utiliza tus estilos de "public/rss/styles.xsl"
  stylesheet: '/rss/styles.xsl',
  // ...
});
```

Si no tienes alguna hoja de estilos de RSS en mente o no conoces una, recomendamos [Pretty Feed v3 default stylesheet](https://github.com/genmon/aboutfeeds/blob/main/tools/pretty-feed-v3.xsl), la cual puedes descargar de GitHub y guardar en la carpeta `public/` de tu proyecto.
