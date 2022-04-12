---
layout: ~/layouts/MainLayout.astro
title: Astro Adapter API (experimental)
---

Astro is designed to make it easy to deploy to any cloud provider for SSR (server-side rendering). This ability is provided by __adapters__, which are [integrations](/en/reference/integrations-reference/).

> Server-side rendering in Astro is *experimental*. If you are interested in building an adapter for a host now is the perfect time to help shape these APIs. If you are worried about breaking changes this might be a little too soon for you.

## What is an adapter

An adapter is a special kind of [integration](/en/reference/integrations-reference/) that provides an entrypoint for server-side rendering. An adapter does two things:

- Implements host-specific APIs for handling requests.
- Configures the build according to host conventions.

## Building an Adapter

An adapter is an [integration](/en/reference/integrations-reference/) and can do anything that an integration can do.

An adapter __must__ call the `setAdapter` API in the `astro:config:done` hook like so:

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

The object passed into `setAdapter` is defined as:

```ts
interface AstroAdapter {
	name: string;
	serverEntrypoint?: string;
	exports?: string[];
}
```

The properties are:

* __name__: A unique name for your adapter, used for logging.
* __serverEntrypoint__: The entrypoint for server-side rendering.
* __exports__: An array of named exports when used in conjunction with `createExports` (explained below).

### Server Entrypoint

Astro's adapter API attempts to work with any type of host, and gives a flexible way to conform to the host APIs.

#### Exports

Some serverless hosts expect you to export a function, such as `handler`:

```js
export function handler(event, context) {
  // ...
}
```

With the adapter API you achieve this by implementing `createExports` in your `serverEntrypoint`:

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

And then in your integration, where you call `setAdapter`, provide this name in `exports`:

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

Some hosts expect you to *start* the server yourselves, for example by listening to a port. For these types of hosts, the adapter API allows you to export a `start` function which will be called when the bundle script is run.

```js
import { App } from 'astro/app';

export function start(manifest) {
  const app = new App(manifest);

  addEventListener('fetch', event => {
    // ...
  });
}
```

#### astro/app

This module is used for rendering pages that have been prebuilt through `astro build`. Astro uses the standard [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) and [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) objects. Hosts that have a different API for request/response should convert to these types in their adapter.

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

The following methods are provided:

##### app.render(request)

This method calls the Astro page that matches the request, renders it, and returns a Promise to a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object. This also works for API routes, that do not render pages.

```js
const response = await app.render(request);
```

##### app.match(request)

This method is used to determine if a request is matched by the Astro app's routing rules.

```js
if(app.match(request)) {
  const response = await app.render(request);
}
```

You can usually call `app.render(request)` without using `.match` because Astro handles 404s if you provide a `404.astro` file. Use `app.match(request)` if you want to handle 404s in a different way.
