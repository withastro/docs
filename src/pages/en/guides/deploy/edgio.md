---
title: Deploy your Astro Site to Edgio
description: How to deploy your Astro site to the web using Edgio.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

You can deploy your Astro project to [Edgio](https://www.edg.io/), an edge and CDN platform to deploy, protect and accelerate websites and APIs.

:::tip
Check out [the Astro guide in Edgio’s docs](https://docs.edg.io/guides/astro)!
:::

## Install Edgio CLI

```bash
npm install -g @edgio/cli
```

## Add Edgio to your Astro site

```bash
edgio init
```

## (Optional) Enable Server Side Rendering

After you’ve setup [Server Side Rendering with Astro](https://docs.astro.build/en/guides/server-side-rendering/), specify the server file path in `edgio.config.js` as below:

```diff
+ import { join } from 'path'

module.exports = {
+  astro: {
+    // The path of the standalone server that runs Astro SSR
+    // The dependencies for this file are automatically bundled
+    appPath: join(process.cwd(), 'dist', 'server', 'entry.mjs'),
+  },
}
```

## Deploy to Edgio

```bash
edgio deploy
```
