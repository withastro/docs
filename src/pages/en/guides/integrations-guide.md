---
layout: ~/layouts/MainLayout.astro
title: Using Integrations
---

**Astro Integrations** can extend Astro with new functionality and behaviors. Astro's Integration API is inspired by Rollup and builds on top of Vite's already impressive plugin API. Taken together, this system gives you access to configure just about everything in Astro, from high-level Astro dev/build features to low-level file loading & build logic. 

## Adding an Integration

To use a integration, it first needs to be available in your project. This usually means installing it from npm using your favorite package manager of choice:

```
npm install --save-dev @astrojs/react
```

Then, you will need to add the integration to your `astro.config.mjs` project configuration file.

```diff
  import { defineConfig } from 'astro/config';
+ import react from '@astrojs/react';

  // https://astro.build/config
  export default defineConfig({
+   integrations: [react()],
  });
``` 

That's it! Restart Astro, and the new integration should take effect.

#### A Note on Peer Dependencies

It is common for Astro integrations to mark certain dependencies as "peer dependencies" so that you can manage them yourself if you need to. React, for example, is a peer dependency of the `@astrojs/react` integration. In npm (v7+) this will install React into your project for you automatically if you haven't defined your own specific React version.

Not all package managers match this behavior, including older versions of npm. Keep an eye out for any "missing peer" warnings from your package manager when you go to install your integration. If you see this sort of warning, or if you have trouble starting Astro due to a "missing package" issue, then you may need to install the missing peer dependencies as dependencies of your own.

While this sounds like an unnecesary extra step, managing your own peer dependencies will also let you control what versions of packages you use for things like React, Tailwind, and more.

<!-- TODO: Finding Integrations: Tony is working on a catalog! -->

## Building Your Own Integration

Check out the [Integration API](/en/reference/integrations-reference) reference page for documentation about writing and publishing your own integrations.