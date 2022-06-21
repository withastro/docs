---
title: Deploy your Astro Site to Netlify
description: How to deploy your Astro site to the web on Netlify.
layout: ~/layouts/DeployGuideLayout.astro
---
Your Astro project can be deployed to Netlify in three different ways: as a static site, a server-rendered site, or an edge-rendered site.

## Static Site Deployment

Your Astro project is a static site by default. You don’t need any extra configuration to deploy a static Astro site to Netlify! 


### Netlify Website UI

If your project is stored in GitHub, GitLab, BitBucket, or Azure DevOps, you can use the Netlify website UI to "Add a new site" from your dashboard and choose to "import an existing project."

When you import your repository from your Git provider, Netlify will detect Astro projects automatically and pre-fill the configuration for you.

Make sure that the following settings are entered before hitting the "Deploy" button:

- **Build Command:** `astro build` or `npm run build`
- **Publish directory:** `dist`

After deploying, you will redirected to the site overview page and you can edit the details of your site and see your preview and production deploy logs and previews.

Any future changes to your source repository will trigger preview and production deploys based on your deployment configuration.

More info at [Deploying an existing Astro Git repository to Netlify](https://www.netlify.com/blog/how-to-deploy-astro/#deploy-an-existing-git-repository-to-netlify)


### Netlify CLI

You can also create a new site on Netlify and link up your Git repository by installing and using the [Netlify CLI](https://cli.netlify.com/).

After following the instructions to log in and authorize Netlify, and running `netlify init`, the CLI will then automatically detect the build settings (astro build), deploy directory (dist), and offer to automatically generate a `netlify.toml` file with those settings. 

Next, the CLI will add a deploy key to the repository, which means your site will be automatically rebuilt on Netlify every time you push a change to Git.

More details from Netlify on [Deploy an Astro site using the Netlify CLI](https://www.netlify.com/blog/how-to-deploy-astro/#link-your-astro-project-and-deploy-using-the-netlify-cli)

## Server-Side Rendering (SSR) Deployment

To enable SSR in Astro on Netlify, install the Netlify adapter to your project’s dependencies.

```bash
npm install --save-dev @astrojs/netlify
```

Once your packages have been installed, add two new lines to your `astro.config.mjs` project configuration file.

```diff
  // astro.config.mjs
  import { defineConfig } from 'astro/config';
+ import netlify from '@astrojs/netlify/functions';

  export default defineConfig({
+   adapter: netlify(),
  });
```

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

#### OLD NETLIFY CONTENT FOR REFERENCE
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