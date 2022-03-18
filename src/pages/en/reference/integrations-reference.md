---
layout: ~/layouts/MainLayout.astro
title: Astro Integration API
---

## Usage

Astro integrations are always added through the `integrations` property in your  `astro.config.js` file. 

There are three common ways to add an integration to your Astro project:
1. Import an installed npm package integration.
2. Import your own integration from another file inside your project.
3. Write your integration inline, directly in your config file.

```js
// astro.config.js
import defineConfig from 'astro/define';
// 1. Imported from an installed npm package
import installedIntegration from '@astrojs/vue'
// 2. Imported from a local file
import myIntegration from './my-integration.js'
// 3. Written directly in this file
const myInlineIntegration = {name: 'namespace:id', hooks: { /* ... */ }};

export default defineConfig({
  integrations: [
    installedIntegration(), 
    myIntegration(),
    myInlineIntegration
  ]
})
```

It is a very common convention to author integrations as factory functions that returns the actual integration object. This lets you pass arguments and options to the function to customize the integration as you need it:

```js
integrations: [
  // Example: Customize your integration
  sitemap({filter: true})
]
```

Falsy integrations are ignored, so you can toggle integrations on & off without worrying about left-behind `undefined` and boolean values.

```js
integrations: [
  // Example: Skip building a sitemap on Windows
  process.platform !== 'win32' && sitemap()
]
```

An integration can also be written as a collection of other, smaller integrations. To the consumer, this will work like any other integration function call, but instead of returning one integration object it will return an array of integration objects. This is useful for building complex features out of multiple integrations.

```js
integrations: [
  // Example: where examplePreset() returns: [integrationOne, integrationTwo, ...etc]
  examplePreset()
]
```

## Integration Ordering

All Integration hooks are called in the order that they are provided. Whenever possible, you should design your integration to run in any order. However, sometimes this isn't possible, in which case you may have to document somewhere that your integration needs to come first or last in your user's `integrations` configuration array.


## Authoring Integrations


### Quick Reference

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

<!-- TODO: ## Examples 

```js
// integration.mjs
export function(options) {

  return {
    // Example: 'react:fastreload'
    name: 'my-namespace:integration-name',
    hooks: {

    }
  }

}
```

-->


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

