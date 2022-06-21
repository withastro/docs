---
title: Deploy your Astro Site to Cloudflare Pages
description: How to deploy your Astro site to the web using Cloudflare Pages.
layout: ~/layouts/DeployGuideLayout.astro
---

You can deploy your Astro project on [Cloudflare Pages](https://pages.cloudflare.com/) a JAMstack platform for frontend developers to collaborate and deploy websites.

## Prerequisites

To get started you will need:

- A Cloudflare account. If you don’t already have one, you can create a free Cloudflare account during the process.
- Your app code pushed to a [GitHub](https://github.com/) or a [GitLab](https://about.gitlab.com/) repository.

## How to deploy

1. Set up a new project on Cloudflare Pages.

2. Use the following build settings:

    - **Framework preset**: `Astro`
    - **Build command:** `npm run build`
    - **Build output directory:** `dist`
    - **Environment variables (advanced)**: Currently, Cloudflare Pages supports `NODE_VERSION = 12.18.0` in the Pages build environment by default. Astro requires `14.15.0`, `v16.0.0`, or higher. You can add an environment variable with the **Variable name** of `NODE_VERSION` and a **Value** of a [Node version that’s compatible with Astro](/en/install/auto/#prerequisites) or by specifying the node version of your project in a `.nvmrc` or `.node-version` file.

3. Click the **Save and Deploy** button.
