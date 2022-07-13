---
# NOTE: This file is auto-generated from 'scripts/generate-integration-pages.ts'
#       and pulls content directly from the package’s README.
#       DO NOT MAKE EDITS TO THIS FILE DIRECTLY, THEY WILL BE OVERWRITTEN!
#       For corrections, please edit the package README at
#       https://github.com/withastro/astro/tree/main/packages/integrations/cloudflare/

layout: ~/layouts/IntegrationLayout.astro
title: '@astrojs/cloudflare'
version: '0.2.4'
githubURL: 'https://github.com/withastro/astro/tree/main/packages/integrations/cloudflare/'
category: adapter
i18nReady: false
---

An SSR adapter for use with Cloudflare Pages Functions targets. Write your code in Astro/Node and deploy to Cloudflare Pages.

In your `astro.config.mjs` use:

```js
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  adapter: cloudflare()
});
```

## Enabling Preview

In order for preview to work you must install `wrangler`

```sh
$ pnpm install wrangler --save-dev
```

It's then possible to update the preview script in your `package.json` to `"preview": "wrangler pages dev ./dist"`

## Streams

Some integrations such as [React](https://github.com/withastro/astro/tree/main/packages/integrations/react) rely on web streams. Currently Cloudflare Pages functions are in beta and don't support the `streams_enable_constructors` feature flag.

In order to work around this:

*   install the `"web-streams-polyfill"` package
*   add `import "web-streams-polyfill/es2018";` to the top of the front matter of every page which requires streams, such as server rendering a React component.
