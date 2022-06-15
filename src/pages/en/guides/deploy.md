---
title: Deploy your Astro Site
description: How to deploy your Astro site to the web.
layout: ~/layouts/MainLayout.astro
setup: import DeployTabGroup from '~/components/TabGroup/DeployTabGroup.astro';
---
Ready to build and deploy your Astro site? Here is a guide to deploying your site to production on Netlify, Vercel and several other hosts.

## Building Your Site Locally

Run the command `npm run build` to build your Astro site.

```bash
$ npm run build
```

By default, the build output will be placed at `dist/`. This location can be changed using the [`outDir` configuration option](/en/reference/configuration-reference/#outdir). You can verify your build locally, and deploy this folder to any of your preferred platforms.


## Continuous Deployment from a Git repository

The easiest way to deploy your static website is to add your Astro project's Git repository (in GitHub, GitLab, or Bitbucket) as a new site in Netlify or Vercel and take advantage of continuous deployment. 

These platforms automatically detect pushes to your Astro source repository, build your site and deploy to the web at a custom URL or your personal domain.

See the links below for information about more deployment options from Netlify and Vercel, including deploy hooks, CLI, and API, as well as instructions for deploying to a variety of other hosts.

<DeployTabGroup />