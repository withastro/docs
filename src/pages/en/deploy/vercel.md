---
title: Deploy your Astro Site
description: How to deploy your Astro site to the web.
layout: ~/layouts/MainLayout.astro
setup: import DeployTabGroup from '~/components/TabGroup/DeployTabGroup.astro';
---
Ready to build and deploy your Astro site? Here is a guide to deploying your site to production on Netlify, Vercel and several other hosts.

> These guides provide instructions for performing a static deployment of your Astro site. Astro also has support for Server Side Rendering (SSR). 
>
> 📚 Read more about [enabling SSR in your Astro project](/en/guides/server-side-rendering/).

## Building The App

Run the command `npm run build` to build the app.

```bash
$ npm run build
```

By default, the build output will be placed at `dist/`. This location can be changed using the [`outDir` configuration option](/en/reference/configuration-reference/#outdir). You can deploy this folder to any of your preferred platforms.


## Continuous Deployment from a Git repository

The easiest way to deploy your website is to add your Astro project's Git repository (in GitHub, GitLab, or Bitbucket) as a new site in Netlify or Vercel and take advantage of continuous deployment. The platform automatically detects pushes to your Astro source repository, builds and deploys to the web.

See below for more deployment options from Netlify and Vercel, including deploy hooks, CLI, and API, as well as instructions for deploying to a variety of other hosts.

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