---
title: Deploy your Astro Site to Deno
description: How to deploy your Astro site to the web using Deno.
layout: ~/layouts/DeployGuideLayout.astro
---

You can deploy a server-side rendered Astro site to [Deno Deploy](https://deno.com/deploy), a distributed system that runs JavaScript, TypeScript, and WebAssembly at the edge, worldwide.

This guide includes instructions for deploying to Deno Deploy through Github Actions or Deno Deploy's CLI.

## Requirements

This guide assumes you already have [Deno](https://deno.land/) installed.

## Project Configuration

Your Astro project can be deployed to [Deno Deploy](https://deno.com/deploy) as a server-side rendered site (SSR). Deno Deploy does not support static sites.

### Adapter for SSR

To enable SSR in your Astro project and deploy on Deno Deploy:

1. Install [the Deno adapter](https://github.com/withastro/astro/tree/main/packages/integrations/deno) to your project’s dependencies.

    ```bash
      npm install @astrojs/deno
    ```

1. Add two new lines to your `astro.config.mjs` project configuration file.

    ```diff
    // astro.config.mjs
    import { defineConfig } from 'astro/config';
    + import deno from '@astrojs/deno';

    export default defineConfig({
    +   adapter: deno(),
    });
    ```

1. Update your `preview` script in `package.json` with the change below.

    ```diff
    // package.json
    {
      // ...
      "scripts": {
        "dev": "astro dev",
        "start": "astro dev",
        "build": "astro build",
    -     "preview": "astro preview"
    +     "preview": "deno run --allow-net --allow-read --allow-env ./dist/server/entry.mjs"
      }
    }
    ```
    
    You can now use this command to preview your production Astro site locally with Deno.
    
    ```bash
    npm run preview
    ```

## How to deploy

You can deploy to Deno Deploy through Github Actions or using Deno Deploy’s CLI (command line interface).

### Github Actions Deployment

If your project is stored on GitHub, the [Deno Deploy website](https://dash.deno.com/) will guide you through setting up Github Actions to deploy your Astro site.

1. Push your code to a public or private Github repository.

1. Sign in on [Deno Deploy](https://dash.deno.com/) with your Github account, and click on [New Project](https://dash.deno.com).

1. Select your repository, the branch you want to deploy from, and select **Github Action** mode. (Your Astro site requires a build step, and cannot use Automatic mode.)
   
1. In your Astro project, create a new file at `.github/workflows/deploy.yml` and paste in the YAML below. This is similar to the YAML given by Deno Deploy, with the additional steps needed for your Astro site.

    ```diff
    name: Deploy
    on: [push]

    jobs:
      deploy:
        name: Deploy
        runs-on: ubuntu-latest
        permissions:
          id-token: write # Needed for auth with Deno Deploy
          contents: read # Needed to clone the repository

        steps:
          - name: Clone repository
            uses: actions/checkout@v2

    +       # Not using npm? Change `npm ci` to `yarn install` or `pnpm i`
    +       - name: Install dependencies
    +         run: npm ci
    + 
    +       # Not using npm? Change `npm run build` to `yarn build` or `pnpm run build`
    +       - name: Build Astro
    +         run: npm run build

          - name: Upload to Deno Deploy
            uses: denoland/deployctl@v1
            with:
    +           project: my-deno-project # TODO: replace with Deno Deploy project name
    +           entrypoint: server/entry.mjs
    +           root: dist
    ```

1. After committing this YAML file, and pushing to Github on your configured deploy branch, the deploy should automatically begin!

   You can track the progress using the "Actions" tab on your Github repository page, or on [Deno Deploy](https://dash.deno.com).


### CLI Deployment

1. Install the [Deno Deploy CLI](https://deno.com/deploy/docs/deployctl).

    ```bash
    deno install --allow-read --allow-write --allow-env --allow-net --allow-run --no-check -r -f https://deno.land/x/deploy/deployctl.ts
    ```

1. Run your Astro build step.

    ```bash
    npm run build
    ```

1. Run `deployctl` to deploy!

   In the command below, replace the `__access_token__` with your [Personal Access Token](https://dash.deno.com/user/access-tokens) and `my-deno-project` with your Deno Deploy project name. You can also track the deploy progress on [Deno Deploy](https://dash.deno.com).

    ```bash
    DENO_DEPLOY_TOKEN=__access_token__ deployctl deploy --project=my-deno-project --no-static --include=./dist ./dist/server/entry.mjs
    ```

1. (Optional) To simplify the deploy into one command, add a `deploy-deno` script in `package.json`.

    ```diff
    // package.json
    {
      // ...
      "scripts": {
        "dev": "astro dev",
        "start": "astro dev",
        "build": "astro build",
        "preview": "deno run --allow-net --allow-read --allow-env ./dist/server/entry.mjs"
    +     "deploy-deno": "npm run build && deployctl deploy --project=my-deno-project --no-static --include=./dist ./dist/server/entry.mjs"
      }
    }
    ```
    
    Then you can use this command to run your deploy in one step.
    
    ```bash
    DENO_DEPLOY_TOKEN=__access_token__ npm run deno-deploy
    ```


📚 Read more about [SSR in Astro](/en/guides/server-side-rendering/).
