---
title: Deploy your Astro Site to Surge
description: How to deploy your Astro site to the web using surge.sh
layout: ~/layouts/DeployGuideLayout.astro
---

## Surge

1. First install [surge](https://www.npmjs.com/package/surge), if you haven't already.

2. Run `npm run build`.

3. Deploy to surge by typing `surge dist`.

You can also deploy to a [custom domain](http://surge.sh/help/adding-a-custom-domain) by adding `surge dist yourdomain.com`.
