---
title: Deploy your Astro Site to Kinsta Application Hosting
description: How to deploy your Astro site to the web on Kinsta Application Hosting.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

You can use [Kinsta Application Hosting](https://kinsta.com/application-hosting/) to host an Astro site on their cloud hosting.

:::tip[Looking for an example?]
Check out [the official Kinsta Application Hosting Starter project for Astro](https://github.com/kinsta/hello-world-astro)!
:::

## Project configuration
To host your project on **Kinsta Application Hosting**, you need to:
- make sure your `package.json` has a `name` field.
- have a script called `build` in your `package.json`. (Your Astro project should already include this.)
- install the `serve` package and set the `start` script to `serve dist/`.

This is an example of a correct `package.json` file:
```json
{
  "name": "@example/blog",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "start": "serve dist/",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^1.1.7",
    "@astrojs/mdx": "^0.11.1",
    "@astrojs/rss": "^1.0.0",
    "@astrojs/sitemap": "^1.0.0",
    "serve": "^14.0.1"
  },
  "devDependencies": {
    "astro": "^1.1.7",
    "@astrojs/renderer-preact": "^0.5.0"
  }
}
```

## How to deploy
Your deployment to Kinsta Application Hosting will happen by pressing the button inside of **MyKinsta Admin Panel** or by setting automatic deployments.

### Website Ui Deployment
1. Go to [My Kinsta](https://my.kinsta.com/) panel.
2. Go to the **Applications** tab
3. Connect your GitHub repository.
4. Press the **Add service** > **Application** button.
5. Follow the wizard steps.
6. Your application is deployed.
