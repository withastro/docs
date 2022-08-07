---
title: Deploy your Astro Site to GitHub Pages
description: How to deploy your Astro site to the web using GitHub Pages.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

You can use [GitHub Pages](https://pages.github.com/) to host an Astro website directly from a repository on [GitHub.com](https://github.com/).

## How to deploy

You can deploy an Astro site to GitHub Pages by using [GitHub Actions](https://github.com/features/actions) to automatically build and deploy your site. To do this, your source code must be hosted on GitHub.

Astro maintains the official [`withastro/action`](https://github.com/withastro/action) to deploy your project with very little configuration.

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
        branches: [ main ]
      # Allows you to run this workflow manually from the Actions tab on GitHub.
      workflow_dispatch:
      
    # Allow this job to clone the repo and create a page deployment
    permissions:
      contents: read
      pages: write
      id-token: write

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout your repository using git
            uses: actions/checkout@v2          
          - name: Install, build, and upload your site
            uses: withastro/actions@v0

      deploy:
        needs: build
        runs-on: ubuntu-latest
        environment:
          name: github-pages
          url: ${{ steps.deployment.outputs.page_url }}
        steps:
          - name: Deploy to GitHub Pages
            id: deployment
            uses: actions/deploy-pages@v1
    ```
    
    :::caution
    The official Astro [action](https://github.com/withastro/action) scans for a lockfile to detect your preferred package manager (`npm`, `yarn`, or `pnpm`). You should commit your package manager's automatically generated `package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml` file to your repository.
    :::

3. Commit the new workflow file and push it to GitHub.  

4. On GitHub, go to your repository’s **Settings** tab and find the **Pages** section of the settings.  

5. Choose the `gh-pages` branch and the `"/" (root)` folder as the **Source** of your site and press **Save**.  
  
Your site should now be published! When you push changes to your Astro project’s repository, the GitHub Action will automatically deploy them for you.

:::tip[set up a custom domain]
You can optionally set up a custom domain by adding the following `./public/CNAME` file to your project: 

```txt title="public/CNAME"
sub.mydomain.com
```

This will deploy your site at your custom domain instead of `user.github.io`. Don't forget to also [configure DNS for your domain provider](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain).   
:::
