---
title: Deploy 
description: How to deploy your Astro site to the web.
layout: ~/layouts/MainLayout.astro
setup: import DeployTabGroup from '~/components/TabGroup/DeployTabGroup.astro';

---
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

> These guides provide instructions for performing a static deployment of your Astro site. Astro also has support for Server Side Rendering (SSR). 
>
> 📚 Read more about [enabling SSR in your Astro project](/en/guides/server-side-rendering/).

## Building The App

Run the command `npm run build` to build the app.

```bash
$ npm run build
```

By default, the build output will be placed at `dist/`. You may deploy this `dist/` folder to any of your preferred platforms.

<DeployTabGroup />

## Vercel

You can deploy Astro to [Vercel](http://vercel.com/) through the CLI or the Vercel git integrations with zero-configuration.

### CLI

1. Install the [Vercel CLI](https://vercel.com/cli) and run `vercel` to deploy.
2. Vercel will automatically detect Astro and configure the right settings.
3. When asked `Want to override the settings? [y/N]`, choose `N`.
4. Your application is deployed! (e.g. [astro.vercel.app](https://astro.vercel.app/))

```bash
$ npm i -g vercel
$ vercel
```

### Git

1. Push your code to your git repository (GitHub, GitLab, BitBucket).
2. [Import your project](https://vercel.com/new) into Vercel.
3. Vercel will automatically detect Astro and configure the right settings.
4. Your application is deployed! (e.g. [astro.vercel.app](https://astro.vercel.app/))

After your project has been imported and deployed, all subsequent pushes to branches will generate [Preview Deployments](https://vercel.com/docs/concepts/deployments/environments#preview), and all changes made to the Production Branch (commonly “main”) will result in a [Production Deployment](https://vercel.com/docs/concepts/deployments/environments#production).

Learn more about Vercel’s [Git Integration](https://vercel.com/docs/concepts/git).