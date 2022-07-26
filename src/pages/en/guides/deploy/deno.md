---
title: Deploy your Astro Site to Deno
description: How to deploy your Astro site to the web using Deno.
layout: ~/layouts/DeployGuideLayout.astro
---

You can deploy a server-side rendered Astro site to [Deno Deploy](https://deno.com/deploy), a distributed system that runs JavaScript, TypeScript, and WebAssembly at the edge, worldwide.

## How to deploy

Deploy an Astro site on Deno using the Deno adapter & [deployctl](https://github.com/denoland/deployctl).

1. Install Deno Adapter in Astro

    Install the Deno (beta) adapter with `npm i -D @astrojs/deno`.

    Change your `astro.config.mjs` configuration file to the following:

    ```js
    import { defineConfig } from 'astro/config';
    import deno from "@astrojs/deno";

    export default defineConfig({
      output: 'server',
      adapter: deno(),
    });
    ```

2. Build your site by running `astro build`

3. Preview your local build with Deno

    To actually use Deno locally to preview your Astro site, you'll need to add some script changes.

    Change the `package.json` scripts section to the following:

    ```json
    {
      "scripts": {
        "dev": "astro dev",
        "start": "astro dev",
        "build": "astro build",
        "preview": "deno run --allow-net --allow-read --allow-env ./dist/server/entry.mjs"
      }
    }
    ```

4. You can now deploy your build using the `deployctl` CLI from your terminal:

    ```shell
    deployctl deploy --project=hello-world ./dist/server/entry.mjs
    ```
📚 Read more about [SSR in Astro](/en/guides/server-side-rendering/).
