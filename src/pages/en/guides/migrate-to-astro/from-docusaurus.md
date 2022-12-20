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

Docusaurus uses React to generate your website UI. Astro sites are built using `.astro` components, but can also support React, Preact, Vue.js, Svelte, SolidJS, AlpineJS, Lit and raw HTML templating.

Docusaurus was designed to build documentation websites and has some built-in, documentation-specific website features that you would have to build yourself in Astro. Instead, Astro offers some documentation-specific features through an [official docs theme](https://github.com/withastro/astro/tree/latest/examples/docs?on=github). This website was built using that template!


## Switch from Docusaurus to Astro

To convert a Docusaurus documentation site to Astro, start with our docs starter template. Add our MDX integration and bring your existing content files to [create MDX pages](/en/guides/markdown-content/).

You can find this, and other templates, on [astro.new](https://astro.new) with links to a GitHub repository as well as one-click links to open a working project in StackBlitz, CodeSandbox and Gitpod online development environments.


## Community Resources

- Add your own!