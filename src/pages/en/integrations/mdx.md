---
layout: ~/layouts/IntegrationLayout.astro
title: '@astrojs/mdx'
description: Learn how to use the @astrojs/mdx integration in your Astro project.
githubURL: 'https://github.com/withastro/astro/tree/main/packages/integrations/mdx/'
hasREADME: true
category: other
i18nReady: false
setup: |
  import Video from '~/components/Video.astro';
  import DontEditWarning from '../../../../components/DontEditWarning.astro';
---
This **[Astro integration][astro-integration]** enables the usage of [MDX](https://mdxjs.com/) components and allows you to create pages as `.mdx` files.

## Why MDX?

MDX allows you to [use variables, JSX expressions and components within Markdown content](https://docs.astro.build/en/guides/markdown-content/#variables-and-components) in Astro. If you have existing content authored in MDX, this integration allows you to bring those files to your Astro project.

## Installation

### Quick Install

The `astro add` command-line tool automates the installation for you. Run one of the following commands in a new terminal window. (If you aren't sure which package manager you're using, run the first command.) Then, follow the prompts, and type "y" in the terminal (meaning "yes") for each one.

```sh
# Using NPM
npx astro add mdx
# Using Yarn
yarn astro add mdx
# Using PNPM
pnpm astro add mdx
```

If you run into any issues, [feel free to report them to us on GitHub](https://github.com/withastro/astro/issues) and try the manual installation steps below.

### Manual Install

First, install the `@astrojs/mdx` package using your package manager. If you're using npm or aren't sure, run this in the terminal:

```sh
npm install @astrojs/mdx
```

Then, apply this integration to your `astro.config.*` file using the `integrations` property:

**`astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  // ...
  integrations: [mdx()],
});
```

Finally, restart the dev server.

### Editor Integration

[VS Code](https://code.visualstudio.com/) supports Markdown by default. However, for MDX editor support, you may wish to add the following setting in your VSCode config. This ensures authoring MDX files provides a Markdown-like editor experience.

```json title=".vscode/settings.json"
"files.associations": {
    "*.mdx": "markdown"
}
```

## Usage

Visit the [MDX docs](https://mdxjs.com/docs/what-is-mdx/) to learn about using MDX as a content authoring solution.

In Astro, you can [add MDX pages to your project](/en/guides/markdown-content/#markdown-and-mdx-pages) by adding `.mdx` files within your `src/pages/` directory. You can also [import `.mdx` files](https://docs.astro.build/en/guides/markdown-content/#importing-markdown) into `.astro` files. 


## Configuration

Once installed, no configuration is necessary to use `.mdx` files in your Astro project. You may choose to extend or transform your Markdown with plugins.


### Markdown Plugins

#### Supported Plugins
Astro supports third-party [remark](https://github.com/remarkjs/remark) and [rehype](https://github.com/rehypejs/rehype) plugins for Markdown and MDX. [GitHub-flavored Markdown](https://github.com/remarkjs/remark-gfm) and [Smartypants](https://github.com/silvenon/remark-smartypants) are applied by default. 

**When adding your own plugins, these two default plugins are removed.** You can preserve these defaults with the [`extendDefaultPlugins` flag](#extendplugins).

You can browse [awesome-remark](https://github.com/remarkjs/awesome-remark) and [awesome-rehype](https://github.com/rehypejs/awesome-rehype) for popular plugins. See each plugin's own README for specific installation instructions.

#### Inherited Plugins from `markdown` config

By default, Astro's MDX integration inherits all [remark](https://github.com/withastro/astro/tree/main/packages/integrations/mdx/#remarkplugins) and [rehype](https://github.com/withastro/astro/tree/main/packages/integrations/mdx/#rehypeplugins) plugins from [the `markdown` option in your Astro config](/en/guides/markdown-content/#markdown-plugins).

Any additional plugins you apply in your MDX config will be applied *after* your configured Markdown plugins, and will apply only to `.mdx` files.

This example applies [`remark-toc`](https://github.com/remarkjs/remark-toc) to Markdown *and* MDX, and [`rehype-minify`](https://github.com/rehypejs/rehype-minify) to MDX only:

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config';
import remarkToc from 'remark-toc';
import rehypeMinify from 'rehype-minify';
export default {
  markdown: {
    // Applied to .md and .mdx files
    remarkPlugins: [remarkToc],
  },
  integrations: [mdx({
    // Applied to .mdx files only
    rehypePlugins: [rehypeMinify],
  })],
}
```

### extendPlugins

When adding your own plugins, [GitHub-flavored Markdown](https://github.com/remarkjs/remark-gfm) and [Smartypants](https://github.com/silvenon/remark-smartypants) are removed. You can preserve these defaults with the `extendDefaultPlugins` flag.


**Type:** `'markdown' | 'astroDefaults' | false`

**Default:** `'markdown'`

#### `markdown` (default)

By default, Astro inherits all [remark](https://github.com/withastro/astro/tree/main/packages/integrations/mdx/#remarkplugins) and [rehype](https://github.com/withastro/astro/tree/main/packages/integrations/mdx/#rehypeplugins) plugins from [the `markdown` option in your Astro config](/en/guides/markdown-content/#markdown-plugins). This also respects the [`markdown.extendDefaultPlugins`](/en/reference/configuration-reference/#markdownextenddefaultplugins) option to extend Astro's defaults. Any additional plugins you apply in your MDX config will be applied *after* your configured Markdown plugins.


#### `astroDefaults`

You may *only* want to extend [Astro's default plugins](/en/reference/configuration-reference/#markdownextenddefaultplugins) without inheriting your Markdown config. This example will apply the default [GitHub-Flavored Markdown](https://github.com/remarkjs/remark-gfm) and [Smartypants](https://github.com/silvenon/remark-smartypants) plugins alongside [`remark-toc`](https://github.com/remarkjs/remark-toc):

```js "extendPlugins: 'astroDefaults'"
// astro.config.mjs
import remarkToc from 'remark-toc';

export default {
  markdown: {
    remarkPlugins: [/** ignored */]
  },
  integrations: [mdx({
    remarkPlugins: [remarkToc],
    // Astro defaults applied
    extendPlugins: 'astroDefaults',
  })],
}
```

#### `false`

If you don't want to extend any plugins, set `extendPlugins` to `false`:

```js "extendPlugins: false"
// astro.config.mjs
import remarkToc from 'remark-toc';

export default {
  integrations: [mdx({
    remarkPlugins: [remarkToc],
    // Astro defaults not applied
    extendPlugins: false,
  })],
}
```

### recmaPlugins

These are plugins that modify the output [estree](https://github.com/estree/estree) directly. This is useful for modifying or injecting JavaScript variables in your MDX files.

We suggest [using AST Explorer](https://astexplorer.net/) to play with estree outputs, and trying [`estree-util-visit`](https://unifiedjs.com/explore/package/estree-util-visit/) for searching across JavaScript nodes.

## Examples

*   The [Astro MDX starter template](https://github.com/withastro/astro/tree/latest/examples/with-mdx) shows how to use MDX files in your Astro project.

## Troubleshooting

For help, check out the `#support` channel on [Discord](https://astro.build/chat). Our friendly Support Squad members are here to help!

You can also check our [Astro Integration Documentation][astro-integration] for more on integrations.

## Contributing

This package is maintained by Astro's Core team. You're welcome to submit an issue or PR!

## Changelog

See [CHANGELOG.md](https://github.com/withastro/astro/tree/main/packages/integrations/mdx/CHANGELOG.md) for a history of changes to this integration.

[astro-integration]: /en/guides/integrations-guide/

[astro-ui-frameworks]: /en/core-concepts/framework-components/#using-framework-components
