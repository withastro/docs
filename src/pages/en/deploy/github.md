---
title: Deploy your Astro Site to GitHub Pages
description: How to deploy your Astro site to the web using GitHub Pages.
layout: ~/layouts/MainLayout.astro
setup: import DeployGuidesNav from '~/components/DeployGuidesNav.astro';
---

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

<DeployGuidesNav minimal />
