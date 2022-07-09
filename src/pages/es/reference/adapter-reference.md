---
layout: ~/layouts/MainLayout.astro
title: API de adaptadores de Astro
i18nReady: true
---

Astro está diseñado para que sea fácil de desplegar usando SSR (server side rendering) por cualquier proveedor de la nube. Esta capacidad la proporcionan los __adaptadores__, que son [integraciones](/es/reference/integrations-reference/).

## ¿Qué es un adaptador?

Un adaptador es un tipo especial de [integración](/es/reference/integrations-reference/) que proporciona un punto de entrada para el renderizado en el servidor. Un adaptador hace dos cosas:

- Implementa API específicas del host para manejar solicitudes.
- Configura la compilación de acuerdo con las convenciones del host.

## Construyendo un adaptador

Un adaptador es una [integración](/es/reference/integrations-reference/) y puede hacer todo lo que puede hacer una integración.

Un adaptador __debe__ llamar a la API `setAdapter` en el enlace `astro:config:done` así:

```js
export default function createIntegration() {
  return {
    name: '@matthewp/my-adapter',
    hooks: {
      'astro:config:done': ({ setAdapter }) => {
        setAdapter({
          name: '@matthewp/my-adapter',
          serverEntrypoint: '@matthewp/my-adapter/server.js'
        });
      },
    },
  };
}
```

El objeto pasado a `setAdapter` se define como:

```ts
interface AstroAdapter {
	name: string;
	serverEntrypoint?: string;
	exports?: string[];
}
```

Las propiedades son:

* __name__: Un nombre único para su adaptador, usado para iniciar sesión.
* __serverEntrypoint__: el punto de entrada para el renderizado en el servidor.
* __exports__: un array de exportaciones con nombre cuando se usa junto con `createExports` (explicado a continuación).

### Server Entrypoint

La API del adaptador de Astro intenta funcionar con cualquier tipo de host y ofrece una forma flexible de ajustarse a las API del host.

#### Exports

Algunos hosts serverless esperan que exportes una función, como `handler`:

```js
export function handler(event, context) {
  // ...
}
```

Con la API del adaptador, logras esto implementando `createExports` en tu `serverEntrypoint`:

```js
import { App } from 'astro/app';

export function createExports(manifest) {
  const app = new App(manifest);

  const handler = (event, context) => {
    // ...
  };

  return { handler };
}
```

Y luego en la integración, donde llama a `setAdapter`, proporcione este nombre en `exports`:

```diff
export default function createIntegration() {
  return {
    name: '@matthewp/my-adapter',
    hooks: {
      'astro:config:done': ({ setAdapter }) => {
        setAdapter({
          name: '@matthewp/my-adapter',
          serverEntrypoint: '@matthewp/my-adapter/server.js',
+         exports: ['handler'],
        });
      },
    },
  };
}
```

#### Start

Algunos hosts esperan que ustedes mismos *inicien* el servidor, por ejemplo escuchando un puerto. Para estos tipos de hosts, la API del adaptador te permite exportar una función `start` que se llamará cuando se ejecute el script del paquete.

```js
import { App } from 'astro/app';

export function start(manifest) {
  const app = new App(manifest);

  addEventListener('fetch', event => {
    // ...
  });
}
```

#### `astro/app`

Este módulo se utiliza para renderizar páginas que se han compilado previamente a través de `astro build`. Astro usa los objectos estándar [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) y [Response](https://developer.mozilla.org/en-US/docs/Web/API/Respuesta). Los hosts que tienen una API diferente para request/response deben convertirse a estos tipos en su adaptador.

```js
import { App } from 'astro/app';
import http from 'http';

export function start(manifest) {
  const app = new App(manifest);

  addEventListener('fetch', event => {
    event.respondWith(
      app.render(event.request)
    );
  });
}
```

Se proporcionan los siguientes métodos:

##### `app.render(request)`

Este método llama a la página de Astro que coincide con la solicitud, la renderiza y devuelve una Promise a un objeto [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response). Esto también funciona para las rutas API, que no procesan páginas.

```js
const response = await app.render(request);
```

##### `app.match(request)`

Este método se usa para determinar si una solicitud coincide con las reglas de enrutamiento de la aplicación Astro.

```js
if(app.match(request)) {
  const response = await app.render(request);
}
```

Por lo general, puede llamar a `app.render(request)` sin usar `.match` porque Astro maneja 404 si se proporciona un archivo `404.astro`. Usa `app.match(request)` si quieres manejar los 404 de una manera diferente.
