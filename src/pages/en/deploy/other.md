---
title: Deploy your Astro Site
description: How to deploy your Astro site to the web.
layout: ~/layouts/MainLayout.astro
setup: import DeployGuidesNav from '~/components/DeployGuidesNav.astro';
---
## Project Setup

The following guides are based on some shared assumptions:

- You are using the default build output location (`dist/`). This location can be changed using the [`outDir` configuration option](/en/reference/configuration-reference/#outdir).
- You are using npm. You can use equivalent commands to run the scripts if you are using Yarn or other package managers.
- Astro is installed as a local dev dependency in your project, and you have set up the following npm scripts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  }
}
```

<DeployGuidesNav minimal />
