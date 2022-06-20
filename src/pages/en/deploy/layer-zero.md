---
title: Deploy your Astro Site to Layer0
description: How to deploy your Astro site to the web using Layer0.
layout: ~/layouts/MainLayout.astro
setup: import DeployGuidesNav from '~/components/DeployGuidesNav.astro';
---

## Layer0

You can deploy your Astro project using the following steps:

1. Add Layer0

```bash
# First, globally install the Layer0 CLI:
$ npm i -g @layer0/cli

# Then, add Layer0 to your Astro site:
$ 0 init
```

2. Update your Layer0 Router

Paste the following into routes.ts:

```js
// routes.ts
import { Router } from '@layer0/core';

export default new Router()
  .get(
    '/:path*/:file.:ext(js|css|png|ico|jpg|gif|svg)',
    ({ cache, serveStatic }) => {
      cache({
        browser: {
          // cache js, css, and images in the browser for one hour...
          maxAgeSeconds: 60 * 60,
        },
        edge: {
          // ... and at the edge for one year
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      });
      serveStatic('dist/:path*/:file.:ext');
    }
  )
  .match('/:path*', ({ cache, serveStatic, setResponseHeader }) => {
    cache({
      // prevent the browser from caching html...
      browser: false,
      edge: {
        // ...cache html at the edge for one year
        maxAgeSeconds: 60 * 60 * 24 * 365,
      },
    });
    setResponseHeader('content-type', 'text/html; charset=UTF-8');
    serveStatic('dist/:path*');
  });
```

You can remove the origin backend from `layer0.config.js`:

```js
module.exports = {};
```

3. Deploy to Layer0

To deploy your site to Layer0, run:

```bash
# Create a production build of your astro site
$ npm run build

# Deploy it to Layer0
$ 0 deploy
```

<DeployGuidesNav minimal />
