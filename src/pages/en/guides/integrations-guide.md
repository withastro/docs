---
layout: ~/layouts/MainLayout.astro
title: Using Integrations
---

**Astro Integrations** allow you to extend Astro with new functionality and behaviors.

**Astro Integrations** can extend Astro with new functionality and behaviors. Unlock the power of popular UI frameworks (e.g. React, Vue, Svelte, Solid...), popular libraries (Tailwind, Turbolinks, Partytown) and more. Integrations reduce the total amount of configuration that you need to write yourself, so that you can add new features to your project with only a few lines of code.

## Adding an Integration

Integrations are still a new concept in Astro (first released in v0.25.0) so currently only official integrations (those published to `@astrojs/` on npm) are supported. If you are trying to use a 3rd-party plugin, be sure to run Astro with the `--experimental-integrations` CLI flag. Some 3rd-party integrations may break as we continue to finalize the API.

First, you will need to install the integration to your project. In this example, we will use the `@astrojs/react` integration to add React support to your Astro project.

```
npm install --save-dev @astrojs/react
```

Then, you will need to add two lines to your `astro.config.mjs` project configuration file. The import (`import react from '@astrojs/react';`) and the line to add the integration to your config `integrations: [react()]`.

```diff
  import { defineConfig } from 'astro/config';
+ import react from '@astrojs/react';

  // https://astro.build/config
  export default defineConfig({
+   integrations: [react()],
  });
``` 

That's it! Restart Astro, and the new integration should take effect. If you see an error, make sure that you installed the `@astrojs/react` package with npm, and that you called your integration as a function (`good: [react()]`) and didn't pass it directly in your config (`bad: [react]`).

#### A Note on Peer Dependencies

It is common for Astro integrations to mark certain dependencies as "peer dependencies" so that you can manage them yourself if you need to. React, for example, is a peer dependency of the `@astrojs/react` integration. In npm (v7+) this will install React into your project for you automatically if you haven't defined your own specific React version.

Not all package managers match this behavior, including older versions of npm. Keep an eye out for any "missing peer" warnings from your package manager when you go to install your integration. If you see this sort of warning, or if you have trouble starting Astro due to a "missing package" issue, then you may need to install the missing peer dependencies as dependencies of your own.

While this sounds like an unnecesary extra step, managing your own peer dependencies will also let you control what versions of packages you use for things like React, Tailwind, and more.

<!-- TODO: Finding Integrations: Tony is working on a catalog! -->

## Building Your Own Integration


Astro's Integration API is inspired by Rollup and Vite, and designed to feel familiar to anyone who has ever written a Rollup or Vite plugin before.

Check out the [Integration API](/en/reference/integrations-reference) reference to learn what integrations can do and how to write one yourself.