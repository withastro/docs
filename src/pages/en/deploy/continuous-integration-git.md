---
title: Continuous Deployment from Git on Netlify / Vercel
description: A quick guide to continuous deployment via Git.
layout: ~/layouts/MainLayout.astro
setup: import DeployGuidesNav from '~/components/DeployGuidesNav.astro';
---
The quickest way to deploy your static website is to add your Astro project's Git repository (in GitHub, GitLab, or Bitbucket) as a new site in Netlify or Vercel and take advantage of continuous deployment. 

These platforms automatically detect pushes to your Astro source repository, build your site and deploy to the web at a custom URL or your personal domain.

## Add your repo to Netlify or Vercel

In both Netlify and Vercel, you can use the website UI to add a new "site" (Netlify) or a new "project" (Vercel) from your dashboard. When you are asked to import an existing project from a git repository, select your Astro project from your Git provider.

Both Netlify and Vercel will recognize your project as an Astro site, and should choose the appropriate configuration settings to build and deploy your site to the web. (If not, these settings can be changed.)

:::note
Make sure that the following settings are entered before hitting the "Deploy" button:

- **Build Command:** `astro build` or `npm run build`
- **Publish directory:** `dist`
:::

Click "Deploy" and your new website will be created at a unique `.netlify.app` or `.vercel.app` URL. That's it!

Your site will be automatically configured to watch your Git provider's main branch for changes, and to rebuild and republish at each new commit. These settings can be configured in your Netlify/Vercel dashboard.


## Building Your Site Locally

Both Netlify and Vercel will build your site for you and then publish your build output to the web. It is not necessary to build locally first. But, you can also build and preview site locally to catch any potential errors or warnings.

Run the command `npm run build` to build your Astro site.

```bash
$ npm run build
```

By default, the build output will be placed at `dist/`. This location can be changed using the [`outDir` configuration option](/en/reference/configuration-reference/#outdir). 

## Other Deployment Options

See the links below for information about more deployment options from Netlify and Vercel, including deploy hooks, CLI, and API, as well as instructions for deploying to a variety of other hosts.

<DeployGuidesNav />
