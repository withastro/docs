---
title: Deploy your Astro Site
description: How to deploy your Astro site to the web.
layout: ~/layouts/MainLayout.astro
setup: import DeployGuidesNav from '~/components/DeployGuidesNav.astro';
---
**Ready to build and deploy your Astro site?** Follow one of our guides to different deployment services or scroll down for general guidance about deploying an Astro site.

<DeployGuidesNav />

## Quick Deploy Options

You can build and deploy an Astro site to a number of hosts quickly using either their website's dashboard UI or a CLI.

### Website UI

A quick way to deploy your website is to connect your Astro project's online Git repository (e.g. GitHub, GitLab, Bitbucket) to a host provider and take advantage of continuous deployment using Git. 

These host platforms automatically detect pushes to your Astro source repository, build your site and deploy it to the web at a custom URL or your personal domain.

1. Add your repository to an online Git provider (e.g. in GitHub, GitLab, Bitbucket)

1. Choose a host that supports **continuous deployment** (e.g. Netlify, Vercel) and import your Git repository as a new site/project.

    Many common hosts will recognize your project as an Astro site, and should choose the appropriate configuration settings to build and deploy your site as shown below. (If not, these settings can be changed.)

    :::note[Deploy Settings]
    - **Build Command:** `astro build` or `npm run build`
    - **Publish directory:** `dist`
    :::

1. Click "Deploy" and your new website will be created at a unique `.netlify.app` or `.vercel.app` URL.


Your site will be automatically configured to watch your Git provider's main branch for changes, and to rebuild and republish at each new commit. These settings can typically be configured in your host provider's dashboard UI.

### CLI Deployment

Some hosts will have their own CLI you can install globally to your machine using npm.

1. Install your host's CLI globally

    `npm install netlify-cli -g`
1. Run the CLI and follow any instructions for authorization, setup etc.

1. Build your site and deploy to your host

    Many common hosts will build and deploy your site for you. They will usually recognize your project as an Astro site, and should choose the appropriate configuration settings to build and deploy as shown below. (If not, these settings can be changed.)

    :::note[Deploy Settings]
    - **Build Command:** `astro build` or `npm run build`
    - **Publish directory:** `dist`
    :::


    Other hosts will require you to [build your site locally](#building-your-site-locally) and deploy using the command line, or by pushing to your local git repository.

## Building Your Site Locally

Many hosts like Netlify and Vercel will build your site for you and then publish that build output to the web. But, some sites will require you to build locally and then run a deploy command or upload your build output. 

You may also wish to build locally to preview your site, or to catch any potential errors and warnings in your own environment.

Run the command `npm run build` to build your Astro site.

```bash
$ npm run build
```

By default, the build output will be placed at `dist/`. This location can be changed using the [`outDir` configuration option](/en/reference/configuration-reference/#outdir). 

## Adding an Adapter for SSR

:::note
Before deploying your Astro site with [SSR (server-side rendering)](/en/guides/server-side-rendering/) enabled, make sure you have:

    - installed the [appropriate adapter](/en/guides/server-side-rendering/#enabling-ssr-in-your-project) to your project dependencies
    - [added the adapter](/en/reference/configuration-reference/#integrations) to your `astro.config.mjs` file's import and default export
:::

