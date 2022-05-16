---
layout: ~/layouts/MainLayout.astro
title: Páginas
description: Introducción a páginas de Astro
i18nReady: true
---

Las **páginas** son un [componente de Astro](/es/core-concepts/astro-components/) que se encuentran en la subcarpeta `src/pages/`. Ellas son responsables de manejar el enrutamiento, la carga de datos y el diseño general de la página HTML de su proyecto.

### Enrutamiento basado en archivos

Astro aprovecha una estrategia de enrutamiento llamada **enrutamiento basado en archivos**. Cada archivo `.astro` en la carpeta `src/pages` se convierte en una página o un punto de salida en su proyecto.

📚 Lea más sobre [enrutamiento en Astro](/es/core-concepts/routing/)

### Páginas HTML

Las páginas de Astro deben devolver una respuesta completa de la página `<html>...</html>`, incluidos `<head>` y `<body>`. (`<!doctype html>` es opcional y se agregará automáticamente).

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

Para evitar repetir los mismos elementos HTML en cada página, puedes mover los elementos comunes `<head>` y `<body>` a sus propios [componentes de plantilla](/es/core-concepts/layouts/). Puede usar tantos o tan pocos componentes como crea conveniente.

```astro
---
// Example: src/pages/index.astro
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>El contenido de mi página, envuelto en una plantilla común!</p>
</MySiteLayout>
```

📚 Lea más sobre [componentes de plantilla](/es/core-concepts/layouts/) en Astro.


## Páginas Markdown 

Astro también trata cualquier archivo Markdown (`.md`) dentro de `/src/pages/` como páginas en su proyecto. Estos se usan comúnmente para páginas con mucho texto, como artículos de blog y documentación.

Las plantillas de página son especialmente útiles para [archivos Markdown](#páginas-markdown). Los archivos Markdown pueden usar la propiedad especial `layout` para especificar un [componente de plantilla](/es/core-concepts/layouts/) que envolverá su contenido Markdown en un documento completo de página `<html>...</html>`.

```md
---
# Example: src/pages/page.md
layout: '../layouts/MySiteLayout.astro'
title: 'Mi páginas Markdown'
---
# Título

Esta es mi página, escrita en **Markdown.**
```

📚 Lea más sobre [Markdown](/es/guides/markdown-content/) en Astro.


## Páginas no HTML

Las páginas que no son HTML, como `.json` o `.xml`, o incluso activos como imágenes, se pueden crear utilizando rutas API comúnmente conocidas como **rutas de archivo**.

Las **rutas de archivo** son scripts que terminan con la extensión `.js` o `.ts` y se encuentran dentro del directorio `src/pages/`.

Los nombres de los archivos y las extensiones creadas se basan en el nombre del archivo de origen, por ejemplo: `src/pages/data.json.ts` se creará para que coincida con la ruta `/data.json` en su compilación final.

En SSR (server-side rendering), la extensión no importa y se puede omitir. Esto se debe a que no se generan archivos en el momento de la compilación. En su lugar, Astro genera un único archivo en el servidor.

```js
// Ejemplo: src/pages/builtwith.json.ts
// Resultado: /builtwith.json

// Las rutas de archivo exportan una función get(), que se llama para generar el archivo.
// Devuelve un objeto con `body` para guardar el contenido del archivo en tu compilación final.
export async function get() {
  return {
    body: JSON.stringify({
      name: 'Astro',
      url: 'https://astro.build/',
    }),
  };
}
```

Las rutas API reciben un objeto `APIContext` que contiene [params](/es/reference/api-reference/#params) y una [request](https://developer.mozilla.org/en-US/docs/Web/API/Request):

```ts
import type { APIContext } from 'astro';

export async function get({ params, request }: APIContext) {
  return {
    body: JSON.stringify({
      path: new URL(request.url).pathname
    })
  };
}
```

Opcionalmente, también puedes escribir funciones de rutas API usando el tipo `APIRoute`. Esto le dará mejores mensajes de error cuando su ruta API devuelva el tipo incorrecto:

```ts
import type { APIRoute } from 'astro';

export const get: APIRoute = ({ params, request }) => {
  return {
    body: JSON.stringify({
      path: new URL(request.url).pathname
    })
  };
};
```

## Página 404 personalizada

Para crear una página de error 404 personalizada, puedes crear un archivo `404.astro` en `/src/pages`.

Esto generará una página `404.html` que la mayoría de los [servicios de despliegue](/es/guides/deploy/) encontrarán y usarán.
