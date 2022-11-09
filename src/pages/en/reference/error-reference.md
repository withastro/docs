---
# NOTE: This file is auto-generated from 'scripts/error-docgen.mjs'
# Do not make edits to it directly, they will be overwritten.
# Instead, change this file: https://github.com/withastro/astro/blob/main/packages/astro/src/core/errors/errors-data.ts
# Translators, please remove this note and the <DontEditWarning/> component.

layout: ~/layouts/MainLayout.astro
title: Error reference
i18nReady: true
githubURL: https://github.com/withastro/astro/blob/main/packages/astro/src/core/errors/errors-data.ts
setup: |
  import Since from '../../../components/Since.astro';
  import DontEditWarning from '../../../components/DontEditWarning.astro';
---

<DontEditWarning />

The following reference covers all errors that can be emitted by Astro. To learn more about common pitfalls, see our guide on [Troubleshooting](/en/guides/troubleshooting/).

### StaticRedirectNotAllowed



> Redirects are only available when using output: 'server'. Update your Astro config if you need SSR features. (E03001)

#### What went wrong?
The `Astro.redirect` function is only available when [Server-side rendering](https://docs.astro.build/en/guides/server-side-rendering/) is enabled.

To redirect on a static website, the [meta refresh attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) can be used. Certain hosts also provide config-based redirects (ex: [Netlify redirects](https://docs.netlify.com/routing/redirects/)).

**See Also:**
- https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project
https://docs.astro.build/en/guides/server-side-rendering/#astroredirect


### SSRClientAddressNotAvailableInAdapter



> Astro.clientAddress is not available in the `adapterName` adapter. File an issue with the adapter to add support. (E03002)

#### What went wrong?



