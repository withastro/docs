---
title: Deploy your Astro Site to GitHub Pages
description: How to deploy your Astro site to the web using GitHub Pages.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

You can use [GitHub Pages](https://pages.github.com/) to host an Astro website directly from a repository on [GitHub.com](https://github.com/).

## How to deploy

You can deploy an Astro site to GitHub Pages by using [GitHub Actions](https://github.com/features/actions) to automatically build and deploy your site. To do this, your source code must be hosted on GitHub.

1. Set the [`site`](/en/reference/configuration-reference/#site) and, if needed, [`base`](/en/reference/configuration-reference/#base) options in `astro.config.mjs`.
    - `site` should be something like `https://<YOUR_USERNAME>.github.io`
    - `base` should be your repository’s name starting with a forward slash, for example `/my-repo`.
    
    :::note
    If your repository is named `<YOUR_USERNAME>.github.io`, you don’t need to include `base`.)
    :::

2. Create a new file in your project at `.github/workflows/deploy.yml` and paste in the YAML below.

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
    
    :::caution
    This workflow uses the `npm ci` command by default. You must include a `package-lock.json` file in your repository for this to work. To generate one, run `npm i` in your terminal and commit the resulting lock file.
    :::

    :::tip
    See [the GitHub Pages Action documentation](https://github.com/marketplace/actions/github-pages-action) for different ways you can configure the final “Deploy to GitHub Pages” step.
    :::

3. Commit the new workflow file and push it to GitHub.
4. On GitHub, go to your repository’s **Settings** tab and find the **Pages** section of the settings.
5. Choose the `gh-pages` branch and the `"/" (root)` folder as the **Source** of your site and press **Save**.

Your site should now be published! When you push changes to your Astro project’s repository, the GitHub Action will automatically deploy them for you.
