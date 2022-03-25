---
layout: ~/layouts/MainLayout.astro
setup: |
  import Badge from '~/components/Badge.astro';
title: Using Integrations
---

**Astro Integrations** add new functionality and behaviors for your project with only a few lines of code. You can write a custom integration yourself, or grab popular ones from npm. 

- Unlock React, Vue, Svelte, Solid, and other popular UI frameworks.
- Integrate tools like Tailwind, Turbolinks, and Partytown with a few lines of code.
- Add new features to your project, like automatic sitemap generation.
- Write custom code that hooks into the build process, dev server, and more.

> Integration support was recently released in v0.25.0, and the API is still being finalized. Only first-party Astro integrations (those published to `@astrojs/` on npm) will be officially supported during this period. To use a 3rd-party plugin, you need to run Astro with the `--experimental-integrations` CLI flag.
## Tutorial: Adding React to Your Project

In this example, we will add the `@astrojs/react` integration to add React support to your Astro project. The process for adding any other framwork (Preact, Vue, Svelte or Solid.js) is almost identical and can be followed using the same steps outlined below.

<blockquote>
  <Badge variant="accent">Feeling adventurous?</Badge>
  
  Astro recent launched an **experimental** `astro add` command to automate this process! Instead of the steps below, you can run `npx astro add react`. That's it! 
  
  Skip down to [Automatic Integration Setup](/en/guides/integrations-guide/#automatic-integration-setup) for more details.

</blockquote>

First, you will need to install both the integration and any related packages that you expect to use in your project. For React, that means installing the `@astrojs/react` integration ***and*** the `react` + `react-dom` packages.

```bash
npm install --save-dev @astrojs/react
```

Once your packages have been installed, add two new lines to your `astro.config.mjs` project configuration file. 

```diff
  // astro.config.mjs
  import { defineConfig } from 'astro/config';
+ import react from '@astrojs/react';

  export default defineConfig({
+   integrations: [react()],
  });
``` 

The first line is the import statement that imports the integration into your configuration file. The second line calls the integration function (`react()`) and adds the integration so that Astro knows to use it.

That's it! Restart Astro, and the new integration should take effect immediately. 

If you see an error on startup, make sure that you:

- ✅ installed the required packages with npm
- ✅ imported the integration into your `astro.config.mjs` file
- ✅ called your integration as a function (`[react()]`, not `[react]`)
- ✅ removed the deprecated `renderers:` configuration

## Automatic Integration Setup

Astro recent launched an **experimental** `astro add` command to automate the setup of integrations.

> We will always ask for confirmation before updating any of your files, but it never hurts to have a version-controlled backup just in case.

Instead of the manual configuration outlined above, just run `astro add [name]` and our automatic integration wizard will update your configuration file and install any necessary dependencies.

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

## Handling Integration Dependencies

When installing an Astro integration in your project, keep an eye out for any "missing peer dependencies" warnings that you see during the install step. Not all package managers will peer dependencies for you automatically. If you are an Node v16+ and using npm, you should not need to worry about this section.

If you see a `"Cannot find package 'react'"` (or similar) warning when you start up Astro, that means that you need to install that package into your project.  React, for example, is a peer dependency of the `@astrojs/react` integration. That means that you should install the official `react` and `react-dom` packages alongside your integration. The integration will then pull from these packages automatically.

```diff
# Example: Install integrations and frameworks together
- npm install @astrojs/react
+ npm install @astrojs/react react react-dom
```

If you miss this step, don't worry, Astro will warn you during startup if any missing peer dependencies are required but not found in your project.

Managing your own peer dependencies may be a bit more work, but it also lets you control exactly what versions of packages you use for things like React, Tailwind, and more. This gives you more control over your project.

In the future, a helpful `astro add` command will be able to handle all of this setup for you, and install the correct peer dependencies for your integrations automatically.

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

Check out the [Integration API](/en/reference/integrations-reference) reference to learn all of the different ways that you can write an integration.

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


## Building Your Own Integration

Astro's Integration API is inspired by Rollup and Vite, and designed to feel familiar to anyone who has ever written a Rollup or Vite plugin before.

Check out the [Integration API](/en/reference/integrations-reference) reference to learn what integrations can do and how to write one yourself.
