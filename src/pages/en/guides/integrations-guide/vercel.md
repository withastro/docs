---
# NOTE: This file is auto-generated from 'scripts/generate-integration-pages.ts'
#       and pulls content directly from the package’s README.
#       DO NOT MAKE EDITS TO THIS FILE DIRECTLY, THEY WILL BE OVERWRITTEN!
#       For corrections, please edit the package README at
#       https://github.com/withastro/astro/tree/main/packages/integrations/vercel/

layout: ~/layouts/IntegrationLayout.astro
title: '@astrojs/vercel'
githubURL: 'https://github.com/withastro/astro/tree/main/packages/integrations/vercel/'
hasREADME: true
category: adapter
i18nReady: false
setup : |
  import Video from '~/components/Video.astro'
---

This adapter allows Astro to deploy your SSR site to [Vercel](https://www.vercel.com/).

## Why Astro Vercel

If you're using Astro as a static site builder — its behavior out of the box — you don't need an adapter. In order to return the correct status code for non existing pages, you must add the following config file at the root of your project:

**`vercel.json`**

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

If you wish to [use server-side rendering (SSR)](/en/guides/server-side-rendering/), Astro requires an adapter that matches your deployment runtime.

[Vercel](https://www.netlify.com/) is a deployment platform that allows you to host your site by connecting directly to your GitHub repository.  This adapter enhances the Astro build process to prepare your project for deployment through Vercel.

## Installation

First, install the `@astrojs/vercel` package using your package manager. If you're using npm or aren't sure, run this in the terminal:

```sh
npm install @astrojs/vercel
```

Then, install this adapter in your `astro.config.*` file using the `deploy` property (note the import from `@astrojs/vercel/serverless` - see [targets](https://github.com/withastro/astro/tree/main/packages/integrations/vercel/#targets)).

**`astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server',
	adapter: vercel()
});
```

### Targets

You can deploy to different targets:

*   `edge`: SSR inside an [Edge function](https://vercel.com/docs/concepts/functions/edge-functions).
*   `serverless`: SSR inside a [Node.js function](https://vercel.com/docs/concepts/functions/serverless-functions).
*   `static`: generates a static website following Vercel's output formats, redirects, etc.

> **Note**: deploying to the Edge has [its limitations](https://vercel.com/docs/concepts/functions/edge-functions#known-limitations). An edge function can't be more than 1 MB in size and they don't support native Node.js APIs, among others.

You can change where to target by changing the import:

```js
import vercel from '@astrojs/vercel/edge';
import vercel from '@astrojs/vercel/serverless';
import vercel from '@astrojs/vercel/static';
```

## Usage

📚 **[Read the full deployment guide here.](/en/guides/deploy/vercel/)**

You can deploy by CLI (`vercel deploy`) or by connecting your new repo in the [Vercel Dashboard](https://vercel.com/). Alternatively, you can create a production build locally:

```sh
astro build
vercel deploy --prebuilt
```

## Configuration

This adapter does not expose any configuration options.

## Troubleshooting

**A few known complex packages (example: [puppeteer](https://github.com/puppeteer/puppeteer)) do not support bundling and therefore will not work properly with this adapter.** By default, Vercel doesn't include npm installed files & packages from your project's `./node_modules` folder. To address this, the `@astrojs/vercel` adapter automatically bundles your final build output using `esbuild`.

For help, check out the `#support-threads` channel on [Discord](https://astro.build/chat). Our friendly Support Squad members are here to help!

## Contributing

This package is maintained by Astro's Core team. You're welcome to submit an issue or PR!

## Changelog

See [CHANGELOG.md](https://github.com/withastro/astro/tree/main/packages/integrations/vercel/CHANGELOG.md) for a history of changes to this integration.

[astro-integration]: /en/guides/integrations-guide/
