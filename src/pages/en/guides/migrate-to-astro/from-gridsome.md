---
title: Migrating from Gridsome
description: Tips for migrating an existing Gridsome project to Astro
layout: ~/layouts/MigrationLayout.astro
stub: true
framework: Gridsome
---

[Gridsome](https://gridsome.org) is an open-source static site generator built on Vue and GraphQL.

## Key Similarities between Gridsome and Astro

Gridsome and Astro share some similarities that will help you migrate your project:


- Both Gridsome and Astro are modern Javascript static-site generators with similar project file structures. Both use a `src/` folder for your project files and a special `src/pages/` folder for file-based routing. Creating and managing pages for your site should feel familiar.

- Astro has [an official integration for using Vue components](/en/guides/integrations-guide/vue/) and support for NPM packages and community integrations, including several for Vue. You will be able to write Vue UI components for interactivity, and may be able to keep some or all of your existing Gridsome Vue components and dependencies.

- Astro and Gridsome both allow you to use Headless CMSs, APIs or Markdown-files for data. You can continue to use your preferred authoring system, and will be able to keep your existing content.



## Key Differences between Gridsome and Astro

When you rebuild your Gridsome site in Astro, you will notice some important differences:

- Gridsome is a Vue-based single-page application (SPA). Astro sites are multi-page apps built using `.astro` components, but can also support React, Preact, Vue.js, Svelte, SolidJS, AlpineJS, Lit and raw HTML templating.

- As an SPA, Gridsome uses `vue-router` for SPA routing, and `vue-meta` for managing `<head>`. In Astro, you will create separate HTML pages and control your page `<head>` directly, or in a layout component.

- Gridsome uses GraphQL to retrieve data from your project files. Astro uses ESM imports and a top-level await [`Astro.glob()`](/en/guides/imports/#astroglob) call to import data from your project files. GraphQL may be optionally be added to your project, but is not included by default.

## Community Resources

- Add your own!