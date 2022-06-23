---
title: Deploy your Astro Site to Netlify
description: How to deploy your Astro site to the web on Netlify.
layout: ~/layouts/DeployGuideLayout.astro
---
[Netlify](https://netlify.com) offers hosting and serverless backend services for web applications and static websites. Any Astro site can be hosted on Netlify! 

This guide includes instructions for deploying to Netlify through the website UI or Netlify's CLI.

## Project Configuration

Your Astro project can be deployed to Netlify in three different ways: as a static site, a server-rendered site, or an (experimental) edge-rendered site.

### Static Site

Your Astro project is a static site by default. You don’t need any extra configuration to deploy a static Astro site to Netlify. 

### Adapter for SSR/Edge

To enable SSR in your Astro project and deploy on Netlify:

1. Install [the Netlify adapter](https://github.com/withastro/astro/tree/main/packages/integrations/netlify) to your project’s dependencies.

    ```bash
      npm install --save-dev @astrojs/netlify
    ```

1. Add two new lines to your `astro.config.mjs` project configuration file.

    ```diff
    import { defineConfig } from 'astro/config';
    + import netlify from '@astrojs/netlify/functions';

    export default defineConfig({
    +   adapter: netlify(),
    });
    ```
 
    To render your project using [Netlify's experimental Edge Functions](https://docs.netlify.com/netlify-labs/experimental-features/edge-functions/#app) instead, change the `netlify/functions` import in the Astro config file to use `netlify/edge-functions`.
      ```diff
      import { defineConfig } from 'astro/config';
      // change this line
      - import netlify from '@astrojs/netlify/functions';
      // to this line
      + import netlify from '@astrojs/netlify/edge-functions';

      export default defineConfig({
        adapter: netlify(),
      });
      ```

## How to deploy

You can deploy to Netlify through the website UI or using Netlify’s CLI (command line interface). The process is the same for both static and SSR Astro sites.

### Website UI Deployment

If your project is stored in GitHub, GitLab, BitBucket, or Azure DevOps, you can use the Netlify website UI to deploy your Astro site.

1. Click <kbd>Add a new site</kbd> in your [Netlify dashboard](https://app.netlify.com/)

1. Choose <kbd>Import an existing project</kbd>

    When you import your Astro repository from your Git provider, Netlify should automatically detect and pre-fill the correct configuration settings for you.

1. Make sure that the following settings are entered, then press the <kbd>Deploy</kbd> button:

    - **Build Command:** `astro build` or `npm run build`
    - **Publish directory:** `dist`

 After deploying, you will be redirected to the site overview page. There, you can edit the details of your site.

Any future changes to your source repository will trigger preview and production deploys based on your deployment configuration.

#### `netlify.toml` file

You can optionally create a new `netlify.toml` file at the top level of your project repository to configure your build command and publish directory, as well as other project settings including environment variables and redirects. Netlify will read this file and automatically configure your deployment.

To configure the default settings, create a `netlify.toml` file with the following contents:

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

📚 More info at [“Deploying an existing Astro Git repository”](https://www.netlify.com/blog/how-to-deploy-astro/#deploy-an-existing-git-repository-to-netlify) on Netlify’s blog


### CLI Deployment

You can also create a new site on Netlify and link up your Git repository by installing and using the [Netlify CLI](https://cli.netlify.com/).


1. Install Netlify's CLI globally

    ```bash
    npm install --global netlify-cli
    ```

1. Run the CLI and follow the instructions to log in and authorize Netlify

1. Run `netlify init` and follow the instructions

1. Confirm your build command (`astro build`)

    The CLI will automatically detect the build settings (`astro build`) and deploy directory (`dist`), and will offer to automatically generate [a `netlify.toml` file](#netlifytoml-file) with those settings. 

1. Build and deploy by pushing to Git

    The CLI will add a deploy key to the repository, which means your site will be automatically rebuilt on Netlify every time you `git push`.

📚 More details from Netlify on [Deploy an Astro site using the Netlify CLI](https://www.netlify.com/blog/how-to-deploy-astro/#link-your-astro-project-and-deploy-using-the-netlify-cli)


<!-- 
#### OLD NETLIFY CONTENT FOR REFERENCE

## Server-Side Rendering (SSR) Deployment

With Netlify you can deploy from git, their web UI, or from the cli. Here we'll use the [Netlify CLI](https://docs.netlify.com/cli/get-started/) to deploy.

First build your site as normal:

```bash
npm run build
```

This creates `netlify/functions/` which contains your SSR code. Deploying your site will deploy this function which contains all of your Astro pages ready to be rendered.

```bash
netlify deploy
```

After the deploy is complete it should provide you a preview URL to see your site.

📚 Read more about [SSR in Astro](/en/guides/server-side-rendering/).


## Netlify

You can configure your deployment in two ways, via the [Netlify website UI](#netlify-website-ui) or with a local project `netlify.toml` file.




> If you are using an older [build image](https://docs.netlify.com/configure-builds/get-started/#build-image-selection) on Netlify, make sure that your Node.js version is set.

You can specify your Node.js version in:
- a [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc) file (example: `node v14.17.6`) 
- a `NODE_VERSION` environment variable in your site's settings using the Netlify project dashboard.
-->
