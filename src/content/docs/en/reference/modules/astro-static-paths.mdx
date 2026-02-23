---
title: Static Paths API Reference
sidebar:
  label: 'astro:static-paths'
i18nReady: true
tableOfContents:
  minHeadingLevel: 2
  maxHeadingLevel: 6
---
import ReadMore from '~/components/ReadMore.astro';
import Since from '~/components/Since.astro';

<p><Since v="6.0.0" /></p>

This module provides utilities to help adapters collect static paths from within their target runtime (e.g. `workerd`). This only provides a real implementation in the `prerender` Vite environment. In other environments, it returns a no-op implementation.

## Imports from `astro:static-paths`

```js
import { 
  StaticPaths,
} from 'astro:static-paths';
```

### `StaticPaths`

Allows adapters to collect all paths that need to be prerendered from within their target runtime. This is useful when [implementing a custom prerenderer](/en/reference/adapter-reference/#custom-prerenderer) that runs in a non-Node environment:

The `StaticPaths` constructor accepts a required [SSR manifest](/en/reference/integrations-reference/#ssrmanifest) and an object describing the route cache and providing a method to access the component used to render the route. The preferred method to initiate a `StaticPaths` instance is to pass it an [app instance](/en/reference/modules/astro-app/#the-app-instance).

The following example initializes a `StaticPaths` instance from an app in an adapter server entrypoint:

```js title="my-adapter/server.js"
import { createApp } from 'astro/app/entrypoint';
import { StaticPaths } from 'astro:static-paths';

const app = createApp();
const staticPaths = new StaticPaths(app);

export const handler = (event, context) => {
  // do something with `staticPaths`
};
```

#### `StaticPaths.getAll()`

<p>

**Type:** <code>() => Promise\<Array\<\{ pathname: string, route: <a href="/en/reference/integrations-reference/#routedata">RouteData</a> \}\>\></code>
</p>

Retrieves all paths that should be prerendered. This returns a promise that resolves to an array of objects describing the route path and its data.

The following example collects all static paths to be pre-rendered before returning them as `Response` in an adapter handler:

```js title="my-adapter/handler.js"
import { StaticPaths } from 'astro:static-paths';

export function createHandler(app) {
  return async (request) => {
    const { pathname } = new URL(request.url);
    
    // Endpoint to collect static paths during build
    if (pathname === '/__astro_static_paths') {
      const staticPaths = new StaticPaths(app);
      const paths = await staticPaths.getAll();
      // Returns array of { pathname: string, route: RouteData }
      return new Response(JSON.stringify({ paths }));
    }
    
    // ... handle other requests
  };
}
```
