---
layout: ~/layouts/MainLayout.astro
title: Customizing Astro
description: Creating and editing astro.config.mjs
---

All Astro starter templates include `astro.config.mjs` at the root of your project. This file is optional, but allows you to unlock the full potential of Astro! 

To create one yourself, use the code below with any (or none!) of the options below:

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
    // all options are optional; these options are the defaults
    projectRoot: './',
    public: './public/',
    dist: './dist/',
    src: './src/',
    pages: './src/pages/',
    integrations: [],
    markdownOptions: {
        render: [
        '@astrojs/markdown-remark',
            {
                syntaxHighlight: 'shiki',
            },
        ],
    },
    vite: {},
});
```

> 💡 Astro supports several formats for its configuration file. You can use `.js`, `.mjs`, `.cjs`, or `.ts`.


## Project Directories

This config file will allow you to specify directories for your `projectRoot`, `public`, `src`, `dist` and `pages`.

## Integrations

To include [UI framework components](/en/core-concepts/framework-components/) such as React, Svelte, or to use other tools such as Tailwind or Partytown in your project, import and add them to `integrations: []`. 

📚 See the [integrations guide](/en/guides/integrations-guide) for examples and usage.

## markdownOptions

You can specify [Markdown parsers and plugins](/en/guides/markdown-content#markdown-parsers) and also choose and configure a [syntax highlighter](/en/guides/markdown-content#syntax-highlighting) to customize the Markdown for your project.

## devOptions


## buildOptions

## vite

You can also pass additional configuration directly to `vite`.

📚 Read Astro's [API configuration reference](/en/reference/configuration-reference/) for more information.

