---
layout: ~/layouts/MainLayout.astro
title: Astro Integration API
---

**Astro Integrations** add new functionality and behaviors for your project with only a few lines of code. 

This reference page is for anyone writing their own integration. To learn how to use an integration in your project, check out our [Using Integrations](/en/guides/integrations-guide) guide instead.


## Examples

The official Astro integrations can act as reference for you as you go to build your own integrations.

- **Renderers:** [`lit`](https://github.com/withastro/astro/blob/main/packages/integrations/lit/src/index.ts), [`svelte`](https://github.com/withastro/astro/blob/main/packages/integrations/svelte/src/index.ts), [`react`](https://github.com/withastro/astro/blob/main/packages/integrations/react/src/index.ts), [`preact`](https://github.com/withastro/astro/blob/main/packages/integrations/preact/src/index.ts), [`vue`](https://github.com/withastro/astro/blob/main/packages/integrations/vue/src/index.ts), [`solid`](https://github.com/withastro/astro/blob/main/packages/integrations/solid/src/index.ts)
- **Libraries:** [`tailwind`](https://github.com/withastro/astro/blob/main/packages/integrations/tailwind/src/index.ts), [`partytown`](https://github.com/withastro/astro/blob/main/packages/integrations/partytown/src/index.ts), [`turbolinks`](https://github.com/withastro/astro/blob/main/packages/integrations/turbolinks/src/index.ts)
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
        }) => void;
        'astro:config:done'?: (options: { config: AstroConfig }) => void | Promise<void>;
        'astro:server:setup'?: (options: { server: vite.ViteDevServer }) => void | Promise<void>;
        'astro:server:start'?: (options: { address: AddressInfo }) => void | Promise<void>;
        'astro:server:done'?: () => void | Promise<void>;
        'astro:build:start'?: () => void | Promise<void>;
        'astro:build:done'?: (options: { pages: { pathname: string }[]; dir: URL }) => void | Promise<void>;
    };
}
```

## Hooks

### astro:config:setup

**When it's run:** on initialization, before either the [Vite](https://vitejs.dev/config/) or [Astro config](/en/reference/configuration-reference/) have resolved.

**Use case:** for extending the project config. This includes updating the [Astro config](/en/reference/configuration-reference/), applying [Vite plugins](https://vitejs.dev/guide/api-plugin.html), adding component renderers, and injecting scripts onto the page.

#### "config" option

**Type**: `AstroConfig`

A read-only copy of the user-supplied [Astro config](/en/reference/configuration-reference/). This is resolved _before_ any other integrations have run. If you need a copy of the config after all integrations have completed their config updates, [see the `astro:config:done` hook](#astroconfigdone).

#### "command" option

**Type:** `'dev' / 'build'`

- `dev` - project was executed with `astro dev` or `astro preview`
- `build` - project was executed with `astro build`

#### "updateConfig" option

**Type:** `(newConfig: Record<string, any>) => void;`

A callback function to update the user-supplied [Astro config](/en/reference/configuration-reference/). Any config you provide **will be merged with the user config + other integration config updates,** so you are free to omit keys! 

For example, say you need to supply a [Vite](https://vitejs.dev) plugin to the user's project:

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

#### "addRenderer" option

- **Type:** `(renderer:` [`AstroRenderer`](https://github.com/withastro/astro/blob/fdd607c5755034edf262e7b275732519328a33b2/packages/astro/src/%40types/astro.ts#L872-L883) `) => void;`
- **Examples:** [`lit`](https://github.com/withastro/astro/blob/main/packages/integrations/lit/src/index.ts), [`svelte`](https://github.com/withastro/astro/blob/main/packages/integrations/svelte/src/index.ts), [`react`](https://github.com/withastro/astro/blob/main/packages/integrations/react/src/index.ts), [`preact`](https://github.com/withastro/astro/blob/main/packages/integrations/preact/src/index.ts), [`vue`](https://github.com/withastro/astro/blob/main/packages/integrations/vue/src/index.ts), [`solid`](https://github.com/withastro/astro/blob/main/packages/integrations/solid/src/index.ts)

A callback function to add a component framework renderer (i.e. React, Vue, Svelte, etc). You can browse the examples and type definition above for more advanced options, but here are the 2 main options to be aware of:
- `clientEntrypoint` - path to a file that executes on the client whenever your component is used. This is mainly for rendering or hydrating your component with JS.
- `serverEntrypoint` - path to a file that executes during server-side requests or static builds whenever your component is used. These should render components to static markup, with hooks for hydration where applicable. [React's `renderToString` callback](https://reactjs.org/docs/react-dom-server.html#rendertostring) is a classic example.

#### "injectScript" option

**Type:** `(stage: InjectedScriptStage, content: string) => void;`

A callback function to inject a string of JavaScript content onto every page.

The **`stage`** denotes how this script (the `content`) should be inserted. Some stages are inserted purely, while others are picked up by Vite:

- `"before-hydration"`: Imported client-side, before the hydration script runs. Processed & resolved by Vite.
- `"head-inline"`: Injected into a script tag in the `<head>` of every page. Not processed or resolved by Vite.
- `"page"`: Injected into the JavaScript bundle of every page. Processed & resolved by Vite.
- `"page-ssr"`: Injected into the frontmatter of every Astro page. Processed & resolved by Vite.

### astro:config:done

**When it's run:** after the Astro config has resolved and other integrations have run their `astro:config:setup` hooks.

**Use case:** to retrieve the final config for use in other hooks.

#### "config" option

**Type**: `AstroConfig`

A read-only copy of the user-supplied [Astro config](/en/reference/configuration-reference/). This is resolved _after_ other integrations have run.

### astro:server:setup

**When it's run:** just after the Vite server is created in "dev" or "preview" mode, but before the `listen()` event is fired. [See Vite's createServer API](https://vitejs.dev/guide/api-javascript.html#createserver) for more.

**Use case:** to update Vite server options and middleware.

#### "server" option

**Type:** [`ViteDevServer`](https://vitejs.dev/guide/api-javascript.html#vitedevserver)

An mutable instance of the Vite server used in "dev" and "preview" mode. For instance, this is [used by our Partytown integration](https://github.com/withastro/astro/tree/main/packages/integrations/partytown) to inject the Partytown server as middleware:

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

### astro:server:start

**When it's run:** after the server's `listen()` event has fired.

**Use case:** to intercept network requests at the specified address. If you intend to use this address for middleware, consider using `astro:server:setup` instead.

#### "address" option

**Type:** [`AddressInfo`](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_net_d_._net_.addressinfo.html)

The address, family and port number supplied by the [NodeJS Net module](https://nodejs.org/api/net.html).

### astro:server:done

**When it's run:** when the dev server is closed.

**Use case:** to run any cleanup events you may trigger during the `astro:server:setup` or `astro:server:start` hooks.

### astro:build:start

**When it's run:** after the `astro:config:done` event, but before the production build begins.

**Use case:** to setup any global objects or clients you may need during a production build. This can also extend build configuration options in the [experimental adapter API](/en/reference/adapter-reference/).

### astro:build:done

**When it's run:** after a production build (SSG or SSR) has completed.

**Use case:** to access generated routes and assets for extension (ex. copy content into the generated `/assets` directory). If you plan to transform generated assets, we recommend exploring the [Vite Plugin API](https://vitejs.dev/guide/api-plugin.html) and [configuring via `astro:config:setup`](#updateconfig-option) instead.

#### "pages" option

**Type:** `{ pathname: string }[]`

An array of all generated routes. This currently includes the `pathname` alone, though we plan to include metadata in the future. Note: this will be empty when using an SSR adapter! 

#### "dir" option

**Type:** [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL)

A URL path to the build output directory. We wrap the path in a URL object for easier parsing. If you just want the path as a string, try `dir.pathname` 🙂

## Integration Ordering

All integrations are run in the order that they are configured. For instance, for the array `[react(), svelte()]` in a user's `astro.config.*`, `react` will run before `svelte`.

Your integration should ideally run in any order. If this isn't possible, we recommend documenting that your integration needs to come first or last in your user's `integrations` configuration array.


## Combine integrations into presets

An integration can also be written as a collection of multiple, smaller integrations. We call these collections **presets.** Instead of creating a factory function that returns a single integration object, a preset returns an *array* of integration objects. This is useful for building complex features out of multiple integrations.

```js
integrations: [
  // Example: where examplePreset() returns: [integrationOne, integrationTwo, ...etc]
  examplePreset()
]
```
