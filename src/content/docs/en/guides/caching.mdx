---
title: Route caching
description: An intro to caching with Astro.
i18nReady: true
---
import Since from '~/components/Since.astro'
import ReadMore from '~/components/ReadMore.astro'

<p><Since v="7.0.0" /></p>

Astro provides a platform-agnostic API for caching responses from [on-demand rendered](/en/guides/on-demand-rendering/) pages and endpoints. Cache directives set in your routes are translated into the appropriate headers or runtime behavior depending on your configured cache provider.

Route caching builds on standard [HTTP caching semantics](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching), including [`max-age`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control#max-age) and [`stale-while-revalidate`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#stale-while-revalidate), with support for tag-based and path-based invalidation, config-level route rules, and pluggable cache providers that adapters can set automatically.

## Configure caching

Route caching requires a cache provider to determine how caching is implemented at runtime. A [built-in in-memory provider](/en/reference/cache-provider-reference/#built-in-memory-cache-provider) is available, and custom providers can be implemented for advanced use cases and specific runtimes.

To enable this feature, set a [cache provider](/en/reference/cache-provider-reference/) in your Astro config:

```js title="astro.config.mjs" {6-8} "memoryCache"
import { defineConfig, memoryCache } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  cache: {
    provider: memoryCache(),
  },
});
```

You can then use [`Astro.cache`](/en/reference/api-reference/#cache) in your `.astro` pages (or `context.cache` for API routes and middleware) to control caching per request. Cache defaults for groups of routes can also be defined declaratively in your config using [`routeRules`](#route-rules).

If you deploy to Netlify, Vercel, or Cloudflare, you can use their respective adapters' experimental [CDN cache provider](#adapter-cache-providers) instead of the in-memory provider.

## Adapter cache providers

Astro's first-party adapters for Netlify, Vercel, and Cloudflare each provide an experimental CDN cache provider that maps cache directives to the platform's native cache headers and invalidation API. Rather than storing responses in memory, these push your caching directives to the host's edge network, and cache hits are served straight from the CDN without invoking your server function.

During the experimental phase these providers need to be manually enabled, as shown below. In a future release, they will be enabled automatically by their adapters.

Each provider automatically tags cached responses with the request path, so [`cache.invalidate({ path })`](/en/reference/api-reference/#cacheinvalidate) works on platforms that only support tag-based purges.

### Netlify

<p>

<Since pkg="@astrojs/netlify" v="8.0.0" />
</p>

Import `cacheNetlify()` from `@astrojs/netlify/cache` and set it as your cache provider:

```js title="astro.config.mjs" ins={3, 7-9}
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import { cacheNetlify } from '@astrojs/netlify/cache';

export default defineConfig({
  adapter: netlify(),
  cache: {
    provider: cacheNetlify(),
  },
});
```

The provider sets `Netlify-CDN-Cache-Control` and `Netlify-Cache-Tag` headers. Cached responses use Netlify's [durable cache](https://docs.netlify.com/platform/caching/#durable-directive) so they are shared across all edge nodes, reducing function invocations. Both tag-based and path-based invalidation are supported.

### Vercel

<p>

<Since pkg="@astrojs/vercel" v="11.0.0" />
</p>

Import `cacheVercel()` from `@astrojs/vercel/cache` and set it as your cache provider:

```js title="astro.config.mjs" ins={3, 7-9}
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import { cacheVercel } from '@astrojs/vercel/cache';

export default defineConfig({
  adapter: vercel(),
  cache: {
    provider: cacheVercel(),
  },
});
```

The provider sets `Vercel-CDN-Cache-Control` and `Vercel-Cache-Tag` headers. Both tag-based and path-based invalidation are supported. Tag invalidation is a soft invalidation: cached responses are marked as stale and revalidated in the background using stale-while-revalidate.

### Cloudflare

<p>

<Since pkg="@astrojs/cloudflare" v="14.0.0" />
</p>

Import `cacheCloudflare()` from `@astrojs/cloudflare/cache` and set it as your cache provider:

```js title="astro.config.mjs" ins={3, 7-9}
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import { cacheCloudflare } from '@astrojs/cloudflare/cache';

export default defineConfig({
  adapter: cloudflare(),
  cache: {
    provider: cacheCloudflare(),
  },
});
```

The provider sets `Cloudflare-CDN-Cache-Control` and `Cache-Tag` headers. Both tag-based and path-based invalidation are supported.

The adapter enables the Cloudflare [Workers Cache](https://developers.cloudflare.com/workers/cache/) with default settings when a Cloudflare cache provider is used. You can [change the configuration](https://developers.cloudflare.com/workers/cache/configuration/) if needed, for example if you want to preserve the cache when you deploy a new version of the site.

## Interacting with the cache

The [`cache` object](/en/reference/api-reference/#cache) provides methods for setting cache options, invalidating entries, and checking the current cache state. This object is available in your `.astro` pages as `Astro.cache`, and in API routes and middleware as `context.cache`.

<ReadMore>See the [Cache API reference](/en/reference/api-reference/#cache) for more details.</ReadMore>

### Checking if caching is enabled

When caching is not configured, `cache.set()`, `cache.tags`, and `cache.options` log a warning, and `cache.invalidate()` throws an error. To avoid this, wrap your caching logic in a conditional check using [`cache.enabled`](/en/reference/api-reference/#cacheenabled). Its value is always `false` when no provider is configured or in development mode.

```astro title="src/pages/products/[id].astro" "Astro.cache.enabled"
---
if (Astro.cache.enabled) {
  const tags = await getProductTags(Astro.params.id);
  Astro.cache.set({ maxAge: 3600, tags });
}
---
```

### Setting cache options

Call [`cache.set()`](/en/reference/api-reference/#cacheset) with an options object to enable caching for the current response.

The following example caches a page for 2 minutes, serves stale content for 1 minute while revalidating, and tags the response for targeted invalidation:

```astro title="src/pages/index.astro" {4-8}
---
export const prerender = false; // Not needed in 'server' mode

Astro.cache.set({
  maxAge: 120,
  swr: 60,
  tags: ['home'],
});
---

<html><body>Cached page</body></html>
```

In API routes and middleware, use `context.cache`:

```ts title="src/pages/api/data.ts" {2-5}
export function GET(context) {
  context.cache.set({
    maxAge: 300,
    tags: ['api', 'data'],
  });
  return Response.json({ ok: true });
}
```

### Opting out of caching

Call [`cache.set()`](/en/reference/api-reference/#cacheset) with `false` to explicitly opt a request out of caching. This is useful when a matched [route rule](#route-rules) would otherwise cache the response:

```astro title="src/pages/dashboard.astro"
---
if (isPersonalized) {
  Astro.cache.set(false);
}
---
```

### Reading cache state

You can access the current accumulated cache options via [`cache.options`](/en/reference/api-reference/#cacheoptions). This is useful for debugging or when you want to conditionally modify caching based on the current state:

```ts title="src/pages/api/debug.ts"
const { maxAge, swr, tags } = context.cache.options;
```

### Invalidating cache entries

You can purge cached entries by tag or path using [`cache.invalidate()`](/en/reference/api-reference/#cacheinvalidate). This is useful for programmatically clearing cached content when it becomes stale, such as after a content update or user action.

The following example creates an API route that invalidates by tag and by path:

```ts title="src/pages/api/revalidate.ts"
export async function POST(context) {
  // Invalidate all entries tagged 'data'
  await context.cache.invalidate({ tags: ['data'] });

  // Invalidate a specific path
  await context.cache.invalidate({ path: '/api/data' });

  return Response.json({ purged: true });
}
```

Tag-based invalidation removes all cached entries whose tags include any of the provided tags. Path-based invalidation is exact-match only (no [glob](/en/guides/imports/#glob-patterns) or wildcard patterns).

## Merge behavior

Multiple calls to [`cache.set()`](/en/reference/api-reference/#cacheset) within a single request are merged according to the following rules:

- **Scalar values** (`maxAge`, `swr`, `etag`): last-write-wins
- **`lastModified`**: most recent date wins
- **`tags`**: accumulate across all calls

Middleware, layouts, content loaders, and page code can each contribute cache directives independently.

## Dev mode behavior

In dev mode, the cache API is available so that route code does not need conditional checks, but no actual caching occurs. [`cache.enabled`](/en/reference/api-reference/#cacheenabled) is `false`, and [`cache.set()`](/en/reference/api-reference/#cacheset) and [`cache.invalidate()`](/en/reference/api-reference/#cacheinvalidate) are no-ops. To test your caching locally, build then preview your site.

## Route rules

Route rules allow you to define caching behavior for groups of routes declaratively in your config. This is useful for applying caching to large groups of routes at once.

The following example caches all API routes with stale-while-revalidate, product pages with a 1-hour freshness window, and blog posts for 5 minutes:

```js title="astro.config.mjs" {9-13}
import { defineConfig, memoryCache } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  cache: {
    provider: memoryCache(),
  },
  routeRules: {
    '/api/[...path]': { swr: 600 },
    '/products/[...slug]': { maxAge: 3600, tags: ['products'] },
    '/blog/[...slug]': { maxAge: 300, swr: 60 },
  },
});
```

The following route patterns are supported:

- **Static paths**: `/about`, `/api/health`
- **Dynamic parameters**: `/products/[id]`, `/blog/[slug]`
- **Rest parameters**: `/docs/[...path]`

Patterns use the same syntax, matching, and priority rules as Astro's [file-based routing](/en/guides/routing/#route-priority-order), so more specific patterns take precedence. Glob wildcards such as `*` are not supported; use a `[...rest]` parameter to match a group of routes (for example, `/api/[...path]` to match everything under `/api`).

Per-route [`cache.set()`](/en/reference/api-reference/#cacheset) calls merge with config-level route rules. Route code can override or extend the defaults set in config. For example, a route rule might set a default `maxAge` for all product pages, but individual pages can call `cache.set()` to customize or disable caching as needed.
