---
layout: ~/layouts/MainLayout.astro
title: Astro Extension API
---

**Astro Extensions** add new functionality and behaviors for your project with only a few lines of code. 

This reference page is for anyone writing their own extension. To learn how to use an extension in your project, check out our [Using Extensions](/en/guides/integrations-guide) guide instead.


## Examples

The official Astro extensions can act as reference for you as you go to build your own extensions.

- **Renderers:** [`lit`](https://github.com/withastro/astro/blob/main/packages/extensions/lit/src/index.ts), [`svelte`](https://github.com/withastro/astro/blob/main/packages/extensions/svelte/src/index.ts), [`react`](https://github.com/withastro/astro/blob/main/packages/extensions/react/src/index.ts), [`preact`](https://github.com/withastro/astro/blob/main/packages/extensions/preact/src/index.ts), [`vue`](https://github.com/withastro/astro/blob/main/packages/extensions/vue/src/index.ts), [`solid`](https://github.com/withastro/astro/blob/main/packages/extensions/solid/src/index.ts)
- **Libraries:** [`tailwind`](https://github.com/withastro/astro/blob/main/packages/extensions/tailwind/src/index.ts), [`partytown`](https://github.com/withastro/astro/blob/main/packages/extensions/partytown/src/index.ts), [`turbolinks`](https://github.com/withastro/astro/blob/main/packages/extensions/turbolinks/src/index.ts)
- **Features:** [`sitemap`](https://github.com/withastro/astro/blob/main/packages/extensions/sitemap/src/index.ts)

## Quick API Reference

```ts
interface AstroEntegration {
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




## Extension Ordering

All Extension hooks are called in the order that they are provided. Whenever possible, you should design your extension to run in any order. However, sometimes this isn't possible, in which case you may have to document somewhere that your extension needs to come first or last in your user's `extensions` configuration array.


## Combining Extensions

An extension can also be written as a collection of multiple, smaller extensions. We call these collections **presets.** Instead of creating a factory function that returns a single extension object, a preset returns an *array* of extension objects. This is useful for building complex features out of multiple extensions.

```js
extensions: [
  // Example: where examplePreset() returns: [integrationOne, integrationTwo, ...etc]
  examplePreset()
]
```
