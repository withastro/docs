---
title: Deploy your Astro Site on Netlify
description: How to deploy your Astro site to the web on Netlify.
layout: ~/layouts/MainLayout.astro
setup: import DeployTabGroup from '~/components/TabGroup/DeployTabGroup.astro';
---
## Static Site Deployment
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

You can skip the `netlify.toml` file and go directly to [Netlify](https://netlify.com/) to configure your project. Add your source repository as a new site and Netlify will detect Astro projects automatically and pre-fill the configuration for you. 

Make sure that the following settings are entered before hitting the "Deploy" button:

- **Build Command:** `astro build` or `npm run build`
- **Publish directory:** `dist`


<DeployTabGroup />