---
title: Migrating from Docusaurus
description: Tips for migrating an existing Docusaurus project to Astro
layout: ~/layouts/MigrationLayout.astro
stub: true
framework: Docusaurus
---

[Docusaurus](https://Docusaurus.io) is popular documentation website builder built on React.


## Key Similarities between Docusaurus and Astro

Docusaurus and Astro share some similarities that will help you migrate your project:

- Both Astro and Docusaurus are modern, JavaScript-based (Jamstack) site builders.

- Both Astro and Docusaurus allow you to author your content in Markdown.

- Astro's JSX-like syntax should feel familiar if you are used to writing React.


## Key Differences between Docusaurus and Astro

When you rebuild your Docusaurus site in Astro, you will notice some important differences:

- Docusaurus is a React-based single-page application (SPA). Astro sites are multi-page apps built using `.astro` components, but can also support React, Preact, Vue.js, Svelte, SolidJS, AlpineJS, Lit and raw HTML templating.

- Docusaurus was designed to build documentation websites and has some built-in, documentation-specific website features that you would have to build yourself in Astro. Instead, Astro offers some documentation-specific features through an [official docs theme](https://github.com/withastro/astro/tree/latest/examples/docs?on=github). This website was built using that template!

- Docusaurus sites use MDX pages for content which allow you to write a combination of JSX and Markdown (although not all of Markdown's features are supported). Astro's docs theme uses Markdown (`.md`) files by default and does not require you to use MDX. You can optionally install Astro's MDX integration and use `.mdx` files in addition to standard Markdown files.


## Switch from Docusaurus to Astro

To convert a Docusaurus documentation site to Astro, start with our docs starter template. Add our MDX integration and bring your existing content files to [create MDX pages](/en/guides/markdown-content/).

You can find this, and other templates, on [astro.new](https://astro.new) with links to a GitHub repository as well as one-click links to open a working project in StackBlitz, CodeSandbox and Gitpod online development environments.


## Community Resources

- Add your own!