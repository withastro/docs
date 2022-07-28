---
title: Deploy your Astro Site to Vercel
description: How to deploy your Astro site to the web on Vercel.
layout: ~/layouts/DeployGuideLayout.astro
---

You can use [Vercel](http://vercel.com/) to deploy an Astro site to their global edge network with zero configuration.

This guide includes instructions for deploying to Vercel through the website UI or Vercel's CLI.

## Project Configuration

Your Astro project can be deployed to Vercel as a static site, or as a server-side rendered site (SSR).

### Static Site

Your Astro project is a static site by default. You don’t need any extra configuration to deploy a static Astro site to Vercel. 

### Adapter for SSR

To enable SSR in your Astro project and deploy on Vercel:

1. Install [the Vercel adapter](https://github.com/withastro/astro/tree/main/packages/integrations/vercel) to your project’s dependencies.

    ```bash
      npm install --save-dev @astrojs/vercel
    ```

1. Add two new lines to your `astro.config.mjs` project configuration file.

    ```diff
    // astro.config.mjs
    import { defineConfig } from 'astro/config';
    + import vercel from '@astrojs/vercel/serverless';

    export default defineConfig({
    +   output: 'server',
    +   adapter: vercel(),
    });
    ```

1. Enable Vercel’s [Build Output API](https://vercel.com/docs/build-output-api/v3) by setting the `ENABLE_VC_BUILD` environment variable in `vercel.json`.

    ```js
    {
      "build": {
        "env": {
          "ENABLE_VC_BUILD": "1"
        }
      }
    }
    ```

    📚 Learn more about [setting enviroment variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

## How to deploy

You can deploy to Vercel through the website UI or using Vercel’s CLI (command line interface). The process is the same for both static and SSR Astro sites.

### Website UI Deployment

1. Push your code to your online Git repository (GitHub, GitLab, BitBucket).
2. [Import your project](https://vercel.com/new) into Vercel.
3. Vercel will automatically detect Astro and configure the right settings.
4. Your application is deployed! (e.g. [astro.vercel.app](https://astro.vercel.app/))

After your project has been imported and deployed, all subsequent pushes to branches will generate [Preview Deployments](https://vercel.com/docs/concepts/deployments/environments#preview), and all changes made to the Production Branch (commonly “main”) will result in a [Production Deployment](https://vercel.com/docs/concepts/deployments/environments#production).

📚 Learn more about Vercel’s [Git Integration](https://vercel.com/docs/concepts/git).


### CLI Deployment

1. Install the [Vercel CLI](https://vercel.com/cli) and run `vercel` to deploy.

    ```bash
    npm i -g vercel
    vercel
    ```

2. Vercel will automatically detect Astro and configure the right settings.
3. When asked `Want to override the settings? [y/N]`, choose `N`.
4. Your application is deployed! (e.g. [astro.vercel.app](https://astro.vercel.app/))

