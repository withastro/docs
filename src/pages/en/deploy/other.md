---
title: Deploy your Astro Site
description: How to deploy your Astro site to the web.
layout: ~/layouts/MainLayout.astro
setup: import DeployTabGroup from '~/components/TabGroup/DeployTabGroup.astro';
---
## Project Setup

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
## Azure Static Web Apps

You can deploy your Astro project with Microsoft Azure [Static Web Apps](https://aka.ms/staticwebapps) service. You need:

- An Azure account and a subscription key. You can create a [free Azure account here](https://azure.microsoft.com/free).
- Your app code pushed to [GitHub](https://github.com/).
- The [SWA Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) in [Visual Studio Code](https://code.visualstudio.com/).

Install the extension in VS Code and navigate to your app root. Open the Static Web Apps extension, sign in to Azure, and click the '+' sign to create a new Static Web App. You will be prompted to designate which subscription key to use.

Follow the wizard started by the extension to give your app a name, choose a framework preset, and designate the app root (usually `/`) and built file location `/dist`. The wizard will run and will create a GitHub action in your repo in a `.github` folder.

The action will work to deploy your app (watch its progress in your repo’s Actions tab) and, when successfully completed, you can view your app in the address provided in the extension’s progress window by clicking the 'Browse Website' button that appears when the GitHub action has run.

## Buddy

You can deploy your Astro project using [Buddy](https://buddy.works/). To do so you'll need to:

1. Create a **Buddy** account [here](https://buddy.works/sign-up).
2. Create a new project and connect it with a git repository (GitHub, GitLab, BitBucket, any private Git Repository or you can use Buddy Git Hosting).
3. Add a new pipeline.
4. In the newly created pipeline add a **[Node.js](https://buddy.works/actions/node-js)** action.
5. In this action add:

   ```bash
   npm install
   npm run build
   ```

6. Add a deployment action - there are many to choose from, you can browse them [here](https://buddy.works/actions). Although their can settings differ, remember to set the **Source path** to `dist`.
7. Press the **Run** button.

## Layer0

You can deploy your Astro project using the following steps:

1. Add Layer0

```bash
# First, globally install the Layer0 CLI:
$ npm i -g @layer0/cli

# Then, add Layer0 to your Astro site:
$ 0 init
```

2. Update your Layer0 Router

Paste the following into routes.ts:

```js
// routes.ts
import { Router } from '@layer0/core';

export default new Router()
  .get(
    '/:path*/:file.:ext(js|css|png|ico|jpg|gif|svg)',
    ({ cache, serveStatic }) => {
      cache({
        browser: {
          // cache js, css, and images in the browser for one hour...
          maxAgeSeconds: 60 * 60,
        },
        edge: {
          // ... and at the edge for one year
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      });
      serveStatic('dist/:path*/:file.:ext');
    }
  )
  .match('/:path*', ({ cache, serveStatic, setResponseHeader }) => {
    cache({
      // prevent the browser from caching html...
      browser: false,
      edge: {
        // ...cache html at the edge for one year
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
    });
    setResponseHeader('content-type', 'text/html; charset=UTF-8');
    serveStatic('dist/:path*');
  });
```

You can remove the origin backend from `layer0.config.js`:

```js
module.exports = {};
```

3. Deploy to Layer0

To deploy your site to Layer0, run:

```bash
# Create a production build of your astro site
$ npm run build

# Deploy it to Layer0
$ 0 deploy
```

## Render

You can deploy your Astro project on [Render](https://render.com/) following these steps:

1. Create a [render.com account](https://dashboard.render.com/) and sign in
2. Click the **New +** button from your dashboard and select **Static Site**
3. Connect your [GitHub](https://github.com/) or [GitLab](https://about.gitlab.com/) repository or alternatively enter the public URL of a public repository
4. Give your website a name, select the branch and specify the build command and publish directory
   - **build command:** `npm run build`
   - **publish directory:** `dist`
5. Click the **Create Static Site** button

## Surge

1. First install [surge](https://www.npmjs.com/package/surge), if you haven't already.

2. Run `npm run build`.

3. Deploy to surge by typing `surge dist`.

You can also deploy to a [custom domain](http://surge.sh/help/adding-a-custom-domain) by adding `surge dist yourdomain.com`.

<DeployTabGroup />