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
      push:
        branches: [ main ]
      pull_request:
        branches: [ main ]

    permissions:
      contents: read
      pages: write
      id-token: write

    jobs:
      build:

        runs-on: ubuntu-latest

        steps:
        - uses: actions/checkout@v2
        - uses: actions/setup-node@v2
          with:
            node-version: '16'
            cache: 'npm'
        # Not using npm? Change `npm ci` to `yarn install` or `pnpm i`
        - run: npm ci
        # Not using npm? Change `npm run build` to `yarn build` or `pnpm run build`
        - run: npm run build --if-present

        - name: Archive build output
          run: "tar --dereference --directory dist/ -cvf artifact.tar ."
        - name: Upload artifact
          uses: actions/upload-artifact@v2
          with:
            name: github-pages
            path: artifact.tar

      deploy:
        environment:
          name: github-pages
          url: ${{ steps.deployment.outputs.page_url }}
        runs-on: ubuntu-latest
        needs: build
        steps:
          - name: Deploy to GitHub Pages
            id: deployment
            uses: paper-spa/deploy-pages@main
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
