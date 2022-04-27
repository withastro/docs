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
            injectElement: (stage: vite.HtmlTagDescriptor, element: string) => void;
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


<!-- TODO: Detailed Hooks Reference

## Hooks

### astro:config:setup
### astro:config:done
### astro:server:setup
### astro:server:start
### astro:server:done
### astro:build:start
### astro:build:done

-->




## Integration Ordering

All integrations are run in the order that they are configured. For instance, for the array `[react(), svelte()]` in a user's `astro.config.*`, `react` will run before `svelte`.

Your integration should ideally run in any order. If this isn't possible, we recommend documenting that your integration needs to come first or last in your user's `integrations` configuration array.

## Combining Plugins

An integration can also be written as a collection of multiple, smaller integrations. We call these collections **presets.** Instead of creating a factory function that returns a single integration object, a preset returns an *array* of integration objects. This is useful for building complex features out of multiple integrations.

```js
integrations: [
  // Example: where examplePreset() returns: [integrationOne, integrationTwo, ...etc]
  examplePreset()
]
```
