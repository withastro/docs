---
# NOTE: This file is auto-generated from 'scripts/generate-integration-pages.ts'
#       and pulls content directly from the package’s README.
#       DO NOT MAKE EDITS TO THIS FILE DIRECTLY, THEY WILL BE OVERWRITTEN!
#       For corrections, please edit the package README at
#       https://github.com/withastro/astro/tree/main/packages/integrations/alpinejs/

layout: ~/layouts/IntegrationLayout.astro
title: '@astrojs/alpinejs'
githubURL: 'https://github.com/withastro/astro/tree/main/packages/integrations/alpinejs/'
hasREADME: true
category: other
i18nReady: false
setup : |
  import Video from '~/components/Video.astro'
---

This **[Astro integration][astro-integration]** adds [Alpine.js](https://alpinejs.dev/) to your project so that you can use Alpine.js anywhere on your page.

*   <strong>[Installation](https://github.com/withastro/astro/tree/main/packages/integrations/alpinejs/#installation)</strong>
*   <strong>[Usage](https://github.com/withastro/astro/tree/main/packages/integrations/alpinejs/#usage)</strong>
*   <strong>[Configuration](https://github.com/withastro/astro/tree/main/packages/integrations/alpinejs/#configuration)</strong>
*   <strong>[Examples](https://github.com/withastro/astro/tree/main/packages/integrations/alpinejs/#examples)</strong>
*   <strong>[Troubleshooting](https://github.com/withastro/astro/tree/main/packages/integrations/alpinejs/#troubleshooting)</strong>
*   <strong>[Contributing](https://github.com/withastro/astro/tree/main/packages/integrations/alpinejs/#contributing)</strong>
*   <strong>[Changelog](https://github.com/withastro/astro/tree/main/packages/integrations/alpinejs/#changelog)</strong>

## Installation

### Quick Install

The `astro add` command-line tool automates the installation for you. Run one of the following commands in a new terminal window. (If you aren't sure which package manager you're using, run the first command.) Then, follow the prompts, and type "y" in the terminal (meaning "yes") for each one.

```sh
# Using NPM
npm run astro add alpinejs
# Using Yarn
yarn astro add alpinejs
# Using PNPM
pnpm astro add alpinejs
```

Then, restart the dev server by typing `CTRL-C` and then `npm run astro dev` in the terminal window that was running Astro.

### Manual Install

First, install the `@astrojs/alpinejs` package using your package manager. If you're using npm or aren't sure, run this in the terminal:

```sh
npm install @astrojs/alpinejs
```

Most package managers will install associated peer dependencies as well. Still, if you see a "Cannot find package 'alpinejs'" (or similar) warning when you start up Astro, you'll need to install Alpine.js yourself:

```sh
npm install alpinejs @types/alpinejs
```

Then, apply this integration to your `astro.config.*` file using the `integrations` property:

**`astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import alpine from '@astrojs/alpinejs';

export default defineConfig({
  // ...
  integrations: [alpine()],
});
```

Finally, restart the dev server.

## Usage

Once the integration is installed, you can use [Alpine.js](https://alpinejs.dev/) directivers and syntax inside any Astro component. The Alpine.js script is automatically added and enabled on every page of your website.

Check our [Astro Integration Documentation][astro-integration] for more on integrations.

## Limitations

The Apline.js integration does not give you control over how the script is loaded or initialized. If you require this control, consider [installing and using Alpine.js manually](https://alpinejs.dev/essentials/installation). Astro supports all officially documented Alpine.js manual setup instructions, using `<script>` tags inside of an Astro component.

**It is not currently possible to [extend Alpine.js](https://alpinejs.dev/advanced/extending) when using this component.** If you need this feature, consider following [the manual Alpine.js setup](https://alpinejs.dev/essentials/installation) instead using an Astro script tag:

```astro
<!-- Example: Load AlpineJS on a single page. -->
<script>
  import Alpine from 'alpinejs';

  // Optional: Extend Alpine.js
  // Alpine.directive('foo', ...)

  window.Alpine = Alpine;
  Alpine.start();
</script>
```

## Configuration

The Apline.js integration does not support any custom configuration at this time.

## Examples

*   The [Astro Alpine.js example](https://github.com/withastro/astro/tree/latest/examples/framework-alpine) shows how to use Alpine.js in an Astro project.

## Troubleshooting

For help, check out the `#support-threads` channel on [Discord](https://astro.build/chat). Our friendly Support Squad members are here to help!

You can also check our [Astro Integration Documentation][astro-integration] for more on integrations.

## Contributing

This package is maintained by Astro's Core team. You're welcome to submit an issue or PR!

## Changelog

See [CHANGELOG.md](https://github.com/withastro/astro/tree/main/packages/integrations/alpinejs/CHANGELOG.md) for a history of changes to this integration.

[astro-integration]: /en/guides/integrations-guide/

[astro-ui-frameworks]: /en/core-concepts/framework-components/
