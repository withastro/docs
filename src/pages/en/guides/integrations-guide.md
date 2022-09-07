---
layout: ~/layouts/MainLayout.astro
title: Using Integrations
i18nReady: true
setup: |
  import IntegrationsNav from '~/components/IntegrationsNav.astro';
---

**Astro Integrations** add new functionality and behaviors for your project with only a few lines of code. You can write a custom integration yourself, use an official integration, or use integrations built by the community.

Integrations can…

- Unlock React, Vue, Svelte, Solid, and other popular UI frameworks.
- Integrate tools like Tailwind, and Partytown with a few lines of code.
- Add new features to your project, like automatic sitemap generation.
- Write custom code that hooks into the build process, dev server, and more.

## Official Integrations

<IntegrationsNav />

## Automatic Integration Setup

Astro includes an `astro add` command to automate the setup of integrations.

:::caution
We will always ask for confirmation before updating any of your files, but it never hurts to have a version-controlled backup just in case.
:::

Run `astro add [integration-name]` and our automatic integration wizard will update your configuration file and install any necessary dependencies.

```shell
# Using NPM
npx astro add react
# Using Yarn
yarn astro add react
# Using PNPM
pnpx astro add react
```

It's even possible to configure multiple integrations at the same time!

```shell
# Using NPM
npx astro add react tailwind partytown
# Using Yarn
yarn astro add react tailwind partytown
# Using PNPM
pnpx astro add react tailwind partytown
```

:::note[Handling Integration Dependencies]
If you see any warnings like `Cannot find package '[package-name]'` after adding an integration, your package manager may not have installed [peer dependencies](https://nodejs.org/en/blog/npm/peer-dependencies/) for you. To install these missing packages, run `npm install [package-name]`.
:::

## Using Integrations

Astro integrations are always added through the `integrations` property in your  `astro.config.mjs` file.

There are three common ways to import an integration into your Astro project:
1. Installing an npm package integration.
2. Import your own integration from a local file inside your project.
3. Write your integration inline, directly in your config file.

```js
// astro.config.mjs
import {defineConfig} from 'astro/config';
import installedIntegration from '@astrojs/vue';
import localIntegration from './my-integration.js';

export default defineConfig({
  integrations: [
    // 1. Imported from an installed npm package
    installedIntegration(),
    // 2. Imported from a local JS file
    localIntegration(),
    // 3. An inline object
    {name: 'namespace:id', hooks: { /* ... */ }},
  ]
})
```

Check out the [Integration API](/en/reference/integrations-reference/) reference to learn all of the different ways that you can write an integration.

### Custom Options

Integrations are almost always authored as factory functions that return the actual integration object. This lets you pass arguments and options to the factory function that customize the integration for your project.

```js
integrations: [
  // Example: Customize your integration with function arguments
  sitemap({filter: true})
]
```

### Toggle an Integration

Falsy integrations are ignored, so you can toggle integrations on & off without worrying about left-behind `undefined` and boolean values.

```js
integrations: [
  // Example: Skip building a sitemap on Windows
  process.platform !== 'win32' && sitemap()
]
```

## Finding More Integrations

You can find many integrations developed by the community in the [Astro Integrations Directory](https://astro.build/integrations/). Follow links there for detailed usage and configuration instructions.

:::note[Experimental status]
**To enable third-party integrations:** Run Astro with the `--experimental-integrations` CLI flag, or include `experimental: { integrations: true }` in your Astro config file.

Official Astro integrations (those published to `@astrojs/` on npm) are supported by default. You don’t need the experimental flag to use those.
:::


## Building Your Own Integration

Astro's Integration API is inspired by Rollup and Vite, and designed to feel familiar to anyone who has ever written a Rollup or Vite plugin before.

Check out the [Integration API](/en/reference/integrations-reference/) reference to learn what integrations can do and how to write one yourself.
