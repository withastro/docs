---
layout: ~/layouts/MainLayout.astro
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

## Peer Dependencies Warning

When installing an integration from npm, keep an eye out for any "missing peer dependencies" messages during the install step. You may also need those packages in your project and not all package managers will install them for you automatically. 

React, for example, is a peer dependency of the `@astrojs/react` integration. npm (v7+) will install the required React packages for you automatically when you install `@astrojs/react`. In other package managers (including older versions of npm) you will need to install these yourself, seperately:

```bash
# Install any missing peer dependencies for an integration
npm install --save-dev react react-dom
```

If you miss this step, don't worry, Astro will warn you during startup if any missing peer dependencies are required but not found in your project.

Managing your own peer dependencies may require more work, but it also lets you control what versions of packages you use for things like React, Tailwind, and more.

## Usage Rules

Astro integrations are always added through the `integrations` property in your  `astro.config.mjs` file. 

There are three common ways to write an integration to your Astro project:
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