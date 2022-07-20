---
# NOTE: This file is auto-generated from 'scripts/generate-integration-pages.ts'
#       and pulls content directly from the package’s README.
#       DO NOT MAKE EDITS TO THIS FILE DIRECTLY, THEY WILL BE OVERWRITTEN!
#       For corrections, please edit the package README at
#       https://github.com/withastro/astro/tree/main/packages/integrations/vue/

layout: ~/layouts/IntegrationLayout.astro
title: '@astrojs/vue'
version: '0.4.1'
githubURL: 'https://github.com/withastro/astro/tree/main/packages/integrations/vue/'
category: renderer
i18nReady: false
---

This **[Astro integration][astro-integration]** enables server-side rendering and client-side hydration for your [Vue 3](https://vuejs.org/) components.

## Installation

There are two ways to add integrations to your project. Let's try the most convenient option first!

### `astro add` command

Astro includes a CLI tool for adding first party integrations: `astro add`. This command will:

1.  (Optionally) Install all necessary dependencies and peer dependencies
2.  (Also optionally) Update your `astro.config.*` file to apply this integration

To install `@astrojs/vue`, run the following from your project directory and follow the prompts:

```sh
# Using NPM
npx astro add vue
# Using Yarn
yarn astro add vue
# Using PNPM
pnpx astro add vue
```

If you run into any hiccups, [feel free to log an issue on our GitHub](https://github.com/withastro/astro/issues) and try the manual installation steps below.

### Install dependencies manually

First, install the `@astrojs/vue` integration like so:

```sh
npm install @astrojs/vue
```

Most package managers will install associated peer dependencies as well. Still, if you see a "Cannot find package 'vue'" (or similar) warning when you start up Astro, you'll need to install Vue:

```sh
npm install vue
```

Now, apply this integration to your `astro.config.*` file using the `integrations` property:

**`astro.config.mjs`**

```js
import vue from '@astrojs/vue';

export default {
  // ...
  integrations: [vue()],
}
```

## Getting started

To use your first Vue component in Astro, head to our [UI framework documentation][astro-ui-frameworks]. You'll explore:

*   📦 how framework components are loaded,
*   💧 client-side hydration options, and
*   🪆 opportunities to mix and nest frameworks together

Also check our [Astro Integration Documentation][astro-integration] for more on integrations.

[astro-integration]: /en/guides/integrations-guide/

[astro-ui-frameworks]: /en/core-concepts/framework-components/

## Options

This integration is powered by `@vitejs/plugin-vue`. To customize the Vue compiler, options can be provided to the integration. See the `@vitejs/plugin-vue` [docs](https://github.com/vitejs/vite/tree/main/packages/plugin-vue) for more details.

**`astro.config.mjs`**

```js
import vue from '@astrojs/vue';

export default {
  // ...
  integrations: [vue({
    template: {
      compilerOptions: {
        // treat any tag that starts with ion- as custom elements
        isCustomElement: tag => tag.startsWith('ion-')
      }
    }
    // ...
  })],
}
```
