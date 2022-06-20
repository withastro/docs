---
title: Deploy your Astro Site to Vercel
description: How to deploy your Astro site to the web on Vercel.
layout: ~/layouts/MainLayout.astro
setup: import DeployGuidesNav from '~/components/DeployGuidesNav.astro';
---
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


<DeployGuidesNav minimal />
