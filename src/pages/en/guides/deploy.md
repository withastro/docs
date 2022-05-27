---
layout: ~/layouts/MainLayout.astro
title: Deploy a Website
description: Multiple different methods to deploy a website with Astro.
---

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

> These guides provide instructions for performing a static deployment of your Astro site. Astro also has support for Server Side Rendering (SSR). 
>
>📚 Read more about [enabling SSR in your Astro project](/en/guides/server-side-rendering/).

## Building The App

Run the command `npm run build` to build the app.

```bash
$ npm run build
```

By default, the build output will be placed at `dist/`. You may deploy this `dist/` folder to any of your preferred platforms.

## GitHub Pages

You can deploy an Astro site to GitHub Pages by using [GitHub Actions](https://github.com/features/actions) to automatically build and deploy your site. To do this, your source repository must be hosted on GitHub.

1. Set the [`site`](/en/reference/configuration-reference/#site) and, if needed, [`base`](/en/reference/configuration-reference/#base) options in `astro.config.mjs`.
    - `site` should be something like `https://<YOUR USERNAME>.github.io/`
    - `base` should be your repository’s name. (If your repository is named `<YOUR USERNAME>.github.io`, you don’t need to include `base`.)
1. Create a new file in your project at `.github/workflows/deploy.yml` and paste in the YAML below.

    ```yaml
    name: Github Pages Astro CI

    on:
      # Trigger the workflow every time you push to the `main` branch
      # Using a different branch name? Replace `main` with your branch’s name
      push:
        branches: [main]
      # Allows you to run this workflow manually from the Actions tab on GitHub.
      workflow_dispatch:

    jobs:
      deploy:
        runs-on: ubuntu-20.04

        # Allow this job to push changes to your repository
        permissions:
          contents: write

        steps:
          - name: Check out your repository using git
            uses: actions/checkout@v2

          - name: Use Node.js 16
            uses: actions/setup-node@v2
            with:
              node-version: 16

          # Not using npm? Change `npm ci` to `yarn install` or `pnpm i`
          - name: Install dependencies
            run: npm ci

          # Not using npm? Change `npm run build` to `yarn build` or `pnpm run build`
          - name: Build Astro
            run: npm run build

          - name: Deploy to GitHub Pages
            uses: peaceiris/actions-gh-pages@v3
            with:
              github_token: ${{ secrets.GITHUB_TOKEN }}
              # `./dist` is the default Astro build directory.
              # If you changed that, update it here too.
              publish_dir: ./dist
    ```
    
    > See [the GitHub Pages Action documentation](https://github.com/marketplace/actions/github-pages-action) for different ways you can configure the final “Deploy to GitHub Pages” step.

1. Commit the new workflow file and push it to GitHub.
1. On GitHub, go to your repository’s **Settings** tab and find the **Pages** section of the settings.
1. Choose the `gh-pages` branch as the **Source** of your site and press **Save**.

Your site should now be published! When you push changes to your Astro project’s repository, the GitHub Action will automatically deploy them for you.

### Travis CI

1. Set the correct `.site` in `astro.config.mjs`.
2. Create a file named `.travis.yml` in the root of your project.
3. Run `npm install` locally and commit the generated lockfile (`package-lock.json`).
4. Use the GitHub Pages deploy provider template, and follow the [Travis CI documentation](https://docs.travis-ci.com/user/deployment/pages/).

   ```yaml
   language: node_js
   node_js:
     - lts/*
   install:
     - npm ci
   script:
     - npm run build
   deploy:
     provider: pages
     skip_cleanup: true
     local_dir: dist
     # A token generated on GitHub allowing Travis to push code on you repository.
     # Set in the Travis settings page of your repository, as a secure variable.
     github_token: $GITHUB_TOKEN
     keep_history: true
     on:
       branch: master
   ```

## GitLab Pages

1. Set the correct `.site` in `astro.config.mjs`.
2. Set `dist` in `astro.config.mjs` to `public` and `public` in `astro.config.mjs` to a newly named folder that is holding everything currently in `public`. The reasoning is because `public` is a second source folder in astro, so if you would like to output to `public` you'll need to pull public assets from a different folder. Your `astro.config.mjs` might end up looking like this:

   ```js
   export default defineConfig({
     sitemap: true,
     site: 'https://astro.build/',
   });
   ```

3. Create a file called `.gitlab-ci.yml` in the root of your project with the content below. This will build and deploy your site whenever you make changes to your content:

   ```yaml
   image: node:14
   pages:
     cache:
       paths:
         - node_modules/
     script:
       - npm install
       - npm run build
     artifacts:
       paths:
         - public
     only:
       - main
   ```

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


>If you are using an older [build image](https://docs.netlify.com/configure-builds/get-started/#build-image-selection) on Netlify, make sure that you set your Node.js version.

You can specify your Node.js version in:
-  a [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc) file (example: `node v14.17.6`) 
- a `NODE_VERSION` environment variable in your site's settings using the Netlify project dashboard.

### Netlify Website UI

You can skip the `netlify.toml` file and go directly to [Netlify](https://netlify.com/) to configure your project. Netlify should now detect Astro projects automatically and pre-fill the configuration for you. Make sure that the following settings are entered before hitting the "Deploy" button:

- **Build Command:** `astro build` or `npm run build`
- **Publish directory:** `dist`

## Google Cloud

Different from most available deploy options here, [Google Cloud](https://cloud.google.com/) requires some UI clicks to deploy projects. (Most of these actions can also be done using the gcloud CLI).

### Cloud Run

1. Create a new GCP project, or select one you already have.

2. Make sure the Cloud Run API is enabled.

3. Create a new service.

4. Use a container from Docker Hub or build your own using [Cloud Build](https://cloud.google.com/build).

5. Configure a port from which the files are served.

6. Enable public access by adding a new permission to `allUsers` called `Cloud Run Invoker`.

### Cloud Storage

1. Create a new GCP project, or select one you already have.

2. Create a new bucket under [Cloud Storage](https://cloud.google.com/storage).

3. Give it a name and other required settings.

4. Upload your `dist` folder into it or upload using [Cloud Build](https://cloud.google.com/build).

5. Enable public access by adding a new permission to `allUsers` called `Storage Object Viewer`.

6. Edit the website configuration and add `ìndex.html` as entrypoint and `404.html` as errorpage.

## Google Firebase

1. Make sure you have [firebase-tools](https://www.npmjs.com/package/firebase-tools) installed.

2. Create `firebase.json` and `.firebaserc` at the root of your project with the following content:

   `firebase.json`:

   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": []
     }
   }
   ```

   `.firebaserc`:

   ```json
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

3. After running `npm run build`, deploy using the command `firebase deploy`.

## Surge

1. First install [surge](https://www.npmjs.com/package/surge), if you haven't already.

2. Run `npm run build`.

3. Deploy to surge by typing `surge dist`.

You can also deploy to a [custom domain](http://surge.sh/help/adding-a-custom-domain) by adding `surge dist yourdomain.com`.

## Heroku

1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

2. Create a Heroku account by [signing up](https://signup.heroku.com/).

3. Run `heroku login` and fill in your Heroku credentials:

   ```bash
   $ heroku login
   ```

4. Create a file called `static.json` in the root of your project with the below content:

   `static.json`:

   ```json
   {
     "root": "./dist"
   }
   ```

   This is the configuration of your site; read more at [heroku-buildpack-static](https://github.com/heroku/heroku-buildpack-static).

5. Set up your Heroku git remote:

   ```bash
   # version change
   $ git init
   $ git add .
   $ git commit -m "My site ready for deployment."

   # creates a new app with a specified name
   $ heroku apps:create example

   # set buildpack for static sites
   $ heroku buildpacks:set https://github.com/heroku/heroku-buildpack-static.git
   ```

6. Deploy your site:

   ```bash
   # publish site
   $ git push heroku master

   # opens a browser to view the Dashboard version of Heroku CI
   $ heroku open
   ```

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

## Azure Static Web Apps

You can deploy your Astro project with Microsoft Azure [Static Web Apps](https://aka.ms/staticwebapps) service. You need:

- An Azure account and a subscription key. You can create a [free Azure account here](https://azure.microsoft.com/free).
- Your app code pushed to [GitHub](https://github.com/).
- The [SWA Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) in [Visual Studio Code](https://code.visualstudio.com/).

Install the extension in VS Code and navigate to your app root. Open the Static Web Apps extension, sign in to Azure, and click the '+' sign to create a new Static Web App. You will be prompted to designate which subscription key to use.

Follow the wizard started by the extension to give your app a name, choose a framework preset, and designate the app root (usually `/`) and built file location `/dist`. The wizard will run and will create a GitHub action in your repo in a `.github` folder.

The action will work to deploy your app (watch its progress in your repo’s Actions tab) and, when successfully completed, you can view your app in the address provided in the extension’s progress window by clicking the 'Browse Website' button that appears when the GitHub action has run.

## Cloudflare Pages

You can deploy your Astro project on [Cloudflare Pages](https://pages.cloudflare.com/). You need:

- A Cloudflare account. If you don’t already have one, you can create a free Cloudflare account during the process.
- Your app code pushed to a [GitHub](https://github.com/) or a [GitLab](https://about.gitlab.com/) repository.

Then, set up a new project on Cloudflare Pages.

Use the following build settings:

- **Framework preset**: `Astro`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Environment variables (advanced)**: Currently, Cloudflare Pages supports `NODE_VERSION = 12.18.0` in the Pages build environment by default. Astro requires `14.15.0`, `v16.0.0`, or higher. You can add an environment variable with the **Variable name** of `NODE_VERSION` and a **Value** of a [Node version that’s compatible with Astro](/en/install/auto/#prerequisites) or by specifying the node version of your project in a `.nvmrc` or `.node-version` file.

Then click the **Save and Deploy** button.

## Render

You can deploy your Astro project on [Render](https://render.com/) following these steps:

1. Create a [render.com account](https://dashboard.render.com/) and sign in
2. Click the **New +** button from your dashboard and select **Static Site**
3. Connect your [GitHub](https://github.com/) or [GitLab](https://about.gitlab.com/) repository or alternatively enter the public URL of a public repository
4. Give your website a name, select the branch and specify the build command and publish directory
   - **build command:** `npm run build`
   - **publish directory:** `dist`
5. Click the **Create Static Site** button

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

## Credits

This guide was originally based off [Vite](https://vitejs.dev/)’s well-documented static deploy guide.
