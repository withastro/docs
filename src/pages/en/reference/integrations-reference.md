---
layout: ~/layouts/MainLayout.astro
title: Astro Integration API
i18nReady: true
---

**Astro Integrations** add new functionality and behaviors for your project with only a few lines of code.

This reference page is for anyone writing their own integration. To learn how to use an integration in your project, check out our [Using Integrations](/en/guides/integrations-guide/) guide instead.

## Examples

The official Astro integrations can act as reference for you as you go to build your own integrations.

- **Renderers:** [`lit`](https://github.com/withastro/astro/blob/main/packages/integrations/lit/src/index.ts), [`svelte`](https://github.com/withastro/astro/blob/main/packages/integrations/svelte/src/index.ts), [`react`](https://github.com/withastro/astro/blob/main/packages/integrations/react/src/index.ts), [`preact`](https://github.com/withastro/astro/blob/main/packages/integrations/preact/src/index.ts), [`vue`](https://github.com/withastro/astro/blob/main/packages/integrations/vue/src/index.ts), [`solid`](https://github.com/withastro/astro/blob/main/packages/integrations/solid/src/index.ts)
- **Libraries:** [`tailwind`](https://github.com/withastro/astro/blob/main/packages/integrations/tailwind/src/index.ts), [`partytown`](https://github.com/withastro/astro/blob/main/packages/integrations/partytown/src/index.ts)
- **Features:** [`sitemap`](https://github.com/withastro/astro/blob/main/packages/integrations/sitemap/src/index.ts)

## Quick API Reference

```ts
interface AstroIntegration {
    name: string;
    hooks: {
        'astro:config:setup'?: (options: {
            config: AstroConfig;
            command: 'dev' | 'build';
            updateConfig: (newConfig: Record<string, any>) => void;
            addRenderer: (renderer: AstroRenderer) => void;
            injectScript: (stage: InjectedScriptStage, content: string) => void;
            injectRoute: ({ pattern: string, entryPoint: string }) => void;
        }) => void;
        'astro:config:done'?: (options: { config: AstroConfig }) => void | Promise<void>;
        'astro:server:setup'?: (options: { server: vite.ViteDevServer }) => void | Promise<void>;
        'astro:server:start'?: (options: { address: AddressInfo }) => void | Promise<void>;
        'astro:server:done'?: () => void | Promise<void>;
        'astro:build:start'?: (options: { buildConfig: BuildConfig }) => void | Promise<void>;
        'astro:build:setup'?: (options: {
          vite: ViteConfigWithSSR;
          pages: Map<string, PageBuildData>;
          target: 'client' | 'server';
        }) => void | Promise<void>;
        'astro:build:ssr'?: (options: { manifest: SerializedSSRManifest }) => void | Promise<void>;
        'astro:build:done'?: (options: { pages: { pathname: string }[]; dir: URL; routes: RouteData[] }) => void | Promise<void>;
    };
}
```

## Hooks

### `astro:config:setup`

**Next hook:** [`astro:config:done`](#astroconfigdone)

**When:** On initialization, before either the [Vite](https://vitejs.dev/config/) or [Astro config](/en/reference/configuration-reference/) have resolved.

**Why:** To extend the project config. This inludes updating the [Astro config](/en/reference/configuration-reference/), applying [Vite plugins](https://vitejs.dev/guide/api-plugin.html), adding component renderers, and injecting scripts onto the page.

```js
'astro:config:setup'?: (options: {
    config: AstroConfig;
    command: 'dev' | 'build';
    updateConfig: (newConfig: Record<string, any>) => void;
    addRenderer: (renderer: AstroRenderer) => void;
    injectScript: (stage: InjectedScriptStage, content: string) => void;
    injectRoute: ({ pattern: string, entryPoint: string }) => void;
}) => void;
```

#### `config` option

**Type:** `AstroConfig`

A read-only copy of the user-supplied [Astro config](/en/reference/configuration-reference/). This is resolved _before_ any other integrations have run. If you need a copy of the config after all integrations have completed their config updates, [see the `astro:config:done` hook](#astroconfigdone).

#### `command` option

**Type:** `'dev' / 'build'`

- `dev` - Project is executed with `astro dev` or `astro preview`
- `build` - Project is executed with `astro build`

#### `updateConfig` option

**Type:** `(newConfig: Record<string, any>) => void;`

A callback function to update the user-supplied [Astro config](/en/reference/configuration-reference/). Any config you provide **will be merged with the user config + other integration config updates,** so you are free to omit keys!

For example, say you need to supply a [Vite](https://vitejs.dev/) plugin to the user's project:

```js
import bananaCSS from '@vitejs/official-banana-css-plugin';

export default {
  name: 'banana-css-integration',
  hooks: {
    'astro:config:setup': ({ updateConfig }) => {
      updateConfig({
        vite: {
          plugins: [bananaCSS()],
        }
      })
    }
  }
}
```

#### `addRenderer` option

**Type:** `(renderer:` [`AstroRenderer`](https://github.com/withastro/astro/blob/fdd607c5755034edf262e7b275732519328a33b2/packages/astro/src/%40types/astro.ts#L872-L883) `) => void;`
**Examples:** [`lit`](https://github.com/withastro/astro/blob/main/packages/integrations/lit/src/index.ts), [`svelte`](https://github.com/withastro/astro/blob/main/packages/integrations/svelte/src/index.ts), [`react`](https://github.com/withastro/astro/blob/main/packages/integrations/react/src/index.ts), [`preact`](https://github.com/withastro/astro/blob/main/packages/integrations/preact/src/index.ts), [`vue`](https://github.com/withastro/astro/blob/main/packages/integrations/vue/src/index.ts), [`solid`](https://github.com/withastro/astro/blob/main/packages/integrations/solid/src/index.ts)

A callback function to add a component framework renderer (i.e. React, Vue, Svelte, etc). You can browse the examples and type definition above for more advanced options, but here are the 2 main options to be aware of:

- `clientEntrypoint` - path to a file that executes on the client whenever your component is used. This is mainly for rendering or hydrating your component with JS.
- `serverEntrypoint` - path to a file that executes during server-side requests or static builds whenever your component is used. These should render components to static markup, with hooks for hydration where applicable. [React's `renderToString` callback](https://reactjs.org/docs/react-dom-server.html#rendertostring) is a classic example.

#### `injectRoute` option

**Type:** `({ pattern: string, entryPoint: string }) => void;`

A callback function to inject routes into an Astro project. Injected routes can be [`.astro` pages](/en/core-concepts/astro-pages/) or [`.js` and `.ts` route handlers](/en/core-concepts/astro-pages/#non-html-pages).

`injectRoute` takes an object with a `pattern` and an `entryPoint`.

- `pattern` - where the route should be output in the browser, for example `/foo/bar`. A `pattern` can use Astro's filepath syntax for denoting dynamic routes, for example `/foo/[bar]` or `/foo/[...bar]`. Note that a file extension is **not** needed in the `pattern`.
- `entryPoint` - a bare module specifier pointing towards the `.astro` page or `.js`/`.ts` route handler that handles the route denoted in the `pattern`.

Example usage:

```js
injectRoute({
  pattern: '/foo/[dynamic]',
  entryPoint: 'foo/dynamic-page.astro'
});
```

#### `injectScript` option

**Type:** `(stage: InjectedScriptStage, content: string) => void;`

A callback function to inject a string of JavaScript content onto every page.

The **`stage`** denotes how this script (the `content`) should be inserted. Some stages allow inserting scripts without modification, while others allow optimization during [Vite's bundling step](https://vitejs.dev/guide/build.html):

- `"head-inline"`: Injected into a script tag in the `<head>` of every page. **Not** optimized or resolved by Vite.
- `"before-hydration"`: Imported client-side, before the hydration script runs. Optimized and resolved by Vite.
- `"page"`: Similar to `head-inline`, except that the injected snippet is handled by Vite and bundled with any other `<script>` tags defined inside of Astro components on the page. The script will be loaded with a `<script type="module">` in the final page output, optimized and resolved by Vite.
- `"page-ssr"`: Injected into the frontmatter of every Astro page component. This is not commonly used, however it can be useful for injecting a CSS `import` into every page via its frontmatter, optimized and resolved by Vite.

### `astro:config:done`

**Previous hook:** [`astro:config:setup`](#astroconfigsetup)

**Next hook:** [`astro:server:setup`](#astroserversetup) when running in "dev" or "preview" mode, or [astro:build:start](#astrobuildstart) during production builds

**When:** After the Astro config has resolved and other integrations have run their `astro:config:setup` hooks.

**Why:** To retrieve the final config for use in other hooks.

```js
'astro:config:done'?: (options: { config: AstroConfig }) => void | Promise<void>;
```

#### `config` option

**Type:** `AstroConfig`

A read-only copy of the user-supplied [Astro config](/en/reference/configuration-reference/). This is resolved _after_ other integrations have run.

### `astro:server:setup`

**Previous hook:** [`astro:config:done`](#astroconfigdone)

**Next hook:** [`astro:server:start`](#astroserverstart)

**When:** Just after the Vite server is created in "dev" or "preview" mode, but before the `listen()` event is fired. [See Vite's createServer API](https://vitejs.dev/guide/api-javascript.html#createserver) for more.

**Why:** To update Vite server options and middleware.

```js
'astro:server:setup'?: (options: { server: vite.ViteDevServer }) => void | Promise<void>;
```

#### `server` option

**Type:** [`ViteDevServer`](https://vitejs.dev/guide/api-javascript.html#vitedevserver)

A mutable instance of the Vite server used in "dev" and "preview" mode. For instance, this is [used by our Partytown integration](https://github.com/withastro/astro/tree/main/packages/integrations/partytown) to inject the Partytown server as middleware:

```js
import

'astro:server:setup': ({ server }) => {
  server.middlewares.use(
    partytownServer(partytownLibDirectory, {
      mount: '/~partytown',
      ...
    })
  );
}
```

### `astro:server:start`

**Previous hook:** [`astro:server:setup`](#astroserversetup)

**Next hook:** [`astro:server:done`](#astroserverdone)

**When:** Just after the server's `listen()` event has fired.

**Why:** To intercept network requests at the specified address. If you intend to use this address for middleware, consider using `astro:server:setup` instead.

```js
'astro:server:start'?: (options: { address: AddressInfo }) => void | Promise<void>;
```

#### `address` option

**Type:** [`AddressInfo`](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_net_d_._net_.addressinfo.html)

The address, family and port number supplied by the [NodeJS Net module](https://nodejs.org/api/net.html).

### `astro:server:done`

**Previous hook:** [`astro:server:start`](#astroserverstart)

**When:** Just after the dev server is closed.

**Why:** To run any cleanup events you may trigger during the `astro:server:setup` or `astro:server:start` hooks.

```js
'astro:server:done'?: () => void | Promise<void>;
```

### `astro:build:start`

**Previous hook:** [`astro:config:done`](#astroconfigdone)

**Next hook:** [`astro:build:setup`](#astrobuildsetup)

**When:** After the `astro:config:done` event, but before the production build begins.

**Why:** To set up any global objects or clients needed during a production build. This can also extend the build configuration options in the [adapter API](/en/reference/adapter-reference/).

```js
'astro:build:start'?: (options: { buildConfig: BuildConfig }) => void | Promise<void>;
```

### `astro:build:setup`

**Previous hook:** [`astro:build:start`](#astrobuildstart)

**Next hook:** [`astro:build:ssr`](#astrobuildssr)

**When:** After the `astro:build:start` hook, runs immediately before the build.

**Why:** At this point, the Vite config for the build has been completely constructed, this is your final chance to modify it. This can be useful for example to overwrite some defaults. If you're not sure whether you should use this hook or `astro:build:start`, use `astro:build:start` instead.

```js
'astro:build:setup'?: (options: {
  vite: ViteConfigWithSSR;
  pages: Map<string, PageBuildData>;
  target: 'client' | 'server';
}) => void | Promise<void>;

```

### `astro:build:ssr`

**Previous hook:** [`astro:build:setup`](#astrobuildsetup)

**When:** After a production build (SSG or SSR) has completed.

**Why:** To get access the SSR manifest, this is useful when creating custom SSR builds in plugins or integrations.

```js
'astro:build:ssr'?: (options: { manifest: SerializedSSRManifest }) => void | Promise<void>;
```

### `astro:build:done`

**Previous hook:** [`astro:build:ssr`](#astrobuildssr)

**When:** After a production build (SSG or SSR) has completed.

**Why:** To access generated routes and assets for extension (ex. copy content into the generated `/assets` directory). If you plan to transform generated assets, we recommend exploring the [Vite Plugin API](https://vitejs.dev/guide/api-plugin.html) and [configuring via `astro:config:setup`](#updateconfig-option) instead.

```js
'astro:build:done'?: (options: { dir: URL; routes: RouteData[] }) => void | Promise<void>;
```

#### `dir` option

**Type:** [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL)

A URL path to the build output directory. Note that if you need a valid absolute path string, you should use Node's built-in [`fileURLToPath`](https://nodejs.org/api/url.html#urlfileurltopathurl) utility.

```js
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export default function myIntegration() {
  return {
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const metadata = await getIntegrationMetadata();
        // Use fileURLToPath to get a valid, cross-platform absolute path string 
        const outFile = fileURLToPath(new URL('./my-integration.json', dir));
        await fs.writeFile(outFile, JSON.stringify(metadata));
      }
    }
  }
}
```

#### `routes` option

**Type:** [`RouteData[]`](https://github.com/withastro/astro/blob/main/packages/astro/src/%40types/astro.ts#L973)

A list of all generated routes alongside their associated metadata. **This will be empty when using an SSR adapter!**

You can reference the full `RouteData` type below, but the most common properties are:

- `component` - the input file path relative to the project root
- `pathname` - the output file URL (undefined for routes using `[dynamic]` and `[...spread]` params)

**`RouteData` type reference**

```ts
interface RouteData {
  /** Whether a given route is an HTML page or non-HTML endpoint */
  type: 'page' | 'endpoint';
  /** Source component URL */
  component: string;
  /**
   * Output URL pathname where this route will be served
   * note: will be undefined for [dynamic] and [...spread] routes
   */
  pathname?: string;
  /** 
   * regex used for matching an input URL against a requested route
   * ex. "[fruit]/about.astro" will generate the pattern: /^\/([^/]+?)\/about\/?$/
   * where pattern.test("banana/about") is "true"
   */
  pattern: RegExp;
  /**
   * Dynamic and spread route params
   * ex. "/pages/[lang]/[..slug].astro" will output the params ['lang', '...slug']
   */
  params: string[];
  /**
   * Similar to the "params" field, but with more associated metadata
   * ex. "/pages/[lang]/index.astro" will output the segments
   * [[ { content: 'lang', dynamic: true, spread: false } ]]
   */
  segments: { content: string; dynamic: boolean; spread: boolean; }[][];
  /** 
   * Function to render component in-place from a set of input data.
   * This is typically for internal use, so call with caution!
   */
  generate: (data?: any) => string;
}
```

## Integration Ordering

All integrations are run in the order that they are configured. For instance, for the array `[react(), svelte()]` in a user's `astro.config.*`, `react` will run before `svelte`.

Your integration should ideally run in any order. If this isn't possible, we recommend documenting that your integration needs to come first or last in your user's `integrations` configuration array.

## Combine integrations into presets

An integration can also be written as a collection of multiple, smaller integrations. We call these collections **presets.** Instead of creating a factory function that returns a single integration object, a preset returns an _array_ of integration objects. This is useful for building complex features out of multiple integrations.

```js
integrations: [
  // Example: where examplePreset() returns: [integrationOne, integrationTwo, ...etc]
  examplePreset()
]
```
