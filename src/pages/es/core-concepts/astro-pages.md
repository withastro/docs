---
layout: ~/layouts/MainLayout.astro
title: Páginas
description: Introducción a páginas de Astro
i18nReady: true
---

Las **páginas** son [componentes de Astro](/es/core-concepts/astro-components/) que se encuentran en la subcarpeta `src/pages/`. Ellas son responsables de manejar el enrutamiento, la carga de datos y el diseño general de cada página HTML de tu proyecto.

### Enrutamiento basado en archivos

Astro aprovecha una estrategia de enrutamiento llamada **enrutamiento basado en archivos**. Cada archivo `.astro` en la carpeta `src/pages` se convierte en una página o un endpoint en tu proyecto.

Escriba elementos HTML [`<a>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/a) estándar en la plantilla del componente para vincular entre páginas.

📚 Lea más sobre [enrutamiento en Astro](/es/core-concepts/routing/)

### Páginas HTML

Las páginas de Astro deben devolver una respuesta completa de la página `<html>...</html>`, incluyendo `<head>` y `<body>`. (`<!doctype html>` es opcional y se agregará automáticamente).

```astro
---
// Ejemplo: src/pages/index.astro
---
<html>
  <head>
    <title>Mi página de inicio</title>
  </head>
  <body>
    <h1>Bienvenido a mi página web!</h1>
  </body>
</html>
```

### Aprovechando las plantillas de página

Para evitar repetir los mismos elementos HTML en cada página, puedes mover los elementos comunes `<head>` y `<body>` a tus propios [componentes plantilla](/es/core-concepts/layouts/). Puedes usar tantos o tan pocos componentes como creas conveniente.

```astro
---
// Example: src/pages/index.astro
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>El contenido de mi página, envuelto en una plantilla común!</p>
</MySiteLayout>
```

📚 Lee más sobre [componentes plantilla](/es/core-concepts/layouts/) en Astro.


## Páginas Markdown 

Astro también trata cualquier archivo Markdown (`.md`) dentro de `/src/pages/` como páginas en tu proyecto. Estos se usan comúnmente para páginas con mucho texto, como artículos de blog y documentación.

Los componentes plantilla son especialmente útiles para [archivos Markdown](#páginas-markdown). Los archivos Markdown pueden usar la propiedad especial `layout` para especificar un [componente plantilla](/es/core-concepts/layouts/) que envolverá el contenido Markdown en un documento completo `<html>...</html>`.

```md
---
# Example: src/pages/page.md
layout: '../layouts/MySiteLayout.astro'
title: 'Mis páginas Markdown'
---
# Título

Esta es mi página, escrita en **Markdown.**
```

📚 Lea más sobre [Markdown](/es/guides/markdown-content/) en Astro.


## Páginas no HTML

Las páginas que no son HTML, como `.json` o `.xml`, o incluso activos como imágenes, pueden ser creados utilizando rutas API comúnmente conocidas como **rutas de archivo**.

Las **rutas de archivo** son scripts que terminan con la extensión `.js` o `.ts` y se encuentran dentro de la carpeta `src/pages/`.

Los nombres de los archivos y las extensiones creadas se basan en el nombre del archivo, por ejemplo: `src/pages/data.json.ts` creará la ruta `/data.json` en la compilación final.

En SSR (server-side rendering), la extensión no importa y se puede omitir. Esto se debe a que no se generan archivos en el momento de la compilación. En su lugar, Astro genera un único archivo en el servidor.

```js
// Ejemplo: src/pages/builtwith.json.ts
// Resultado: /builtwith.json

// Las rutas de archivo exportan una función get(), que se llama para generar el archivo.
// Devuelve un objeto con `body` para guardar el contenido del archivo en la compilación final.
export async function get() {
  return {
    body: JSON.stringify({
      name: 'Astro',
      url: 'https://astro.build/',
    }),
  };
}
```

Las rutas API reciben un objeto `APIContext` que contiene [params](/es/reference/api-reference/#params) y [request](https://developer.mozilla.org/en-US/docs/Web/API/Request):

```ts title="src/pages/request-path.json.ts"
import type { APIContext } from 'astro';

export async function get({ params, request }: APIContext) {
  return {
    body: JSON.stringify({
      path: new URL(request.url).pathname
    })
  };
}
```

También puedes escribir funciones de rutas API usando el tipo `APIRoute`. Esto te dará mejores mensajes de error cuando la ruta API devuelva el tipo incorrecto:

```ts title="src/pages/request-path.json.ts"
import type { APIRoute } from 'astro';

export const get: APIRoute = ({ params, request }) => {
  return {
    body: JSON.stringify({
      path: new URL(request.url).pathname
    })
  };
};
```

## Página de error 404 personalizada

Para crear una página de error 404 personalizada, puedes crear un archivo `404.astro` o `404.md` en `/src/pages`.

Esto generará una página `404.html` que la mayoría de los [servicios de despliegue](/es/guides/deploy/) encontrarán y usarán.
