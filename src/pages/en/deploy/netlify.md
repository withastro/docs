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

## Netlify

You can configure your deployment in two ways, via the [Netlify website UI](#netlify-website-ui) or with a local project `netlify.toml` file.

### `netlify.toml` file

Create a new `netlify.toml` file at the top level of your project repository with the following settings:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

Using [`pnpm` on Netlify?](https://answers.netlify.com/t/using-pnpm-and-pnpm-workspaces/2759) Use the following settings instead:

```toml
[build.environment]
  NPM_FLAGS = "--version" # prevent Netlify npm install
[build]
  command = 'npx pnpm i --store=node_modules/.pnpm-store && npm run build'
  publish = 'dist'
```

Push the new `netlify.toml` file up to your hosted git repository. Then, set up a new project on [Netlify](https://netlify.com/) for your git repository. Netlify will read this file and automatically configure your deployment.


> If you are using an older [build image](https://docs.netlify.com/configure-builds/get-started/#build-image-selection) on Netlify, make sure that your Node.js version is set.

You can specify your Node.js version in:
- a [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc) file (example: `node v14.17.6`) 
- a `NODE_VERSION` environment variable in your site's settings using the Netlify project dashboard.

### Netlify Website UI

You can skip the `netlify.toml` file and go directly to [Netlify](https://netlify.com/) to configure your project. Netlify should now detect Astro projects automatically and pre-fill the configuration for you. Make sure that the following settings are entered before hitting the "Deploy" button:

- **Build Command:** `astro build` or `npm run build`
- **Publish directory:** `dist`