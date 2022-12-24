---
title: Migrating from Eleventy
description: Tips for migrating an existing Eleventy project to Astro
layout: ~/layouts/MigrationLayout.astro
stub: true
framework: Eleventy
---

[Eleventy](https://11ty.dev) is an open-source static site generator that works with multiple template languages.

## Key Similarities between Eleventy (11ty) and Astro

Eleventy (11ty) and Astro share some similarities that will help you migrate your project:

- Both Astro and Eleventy are modern, JavaScript-based (Jamstack) site builders.

- Both Astro and Eleventy allow you to author your content in Markdown files, or fetch content from a CMS.

- Both Astro and Eleventy use file-based routing.

## Key Differences between Eleventy (11ty) and Astro

When you rebuild your Eleventy (11ty) site in Astro, you will notice some important differences:

- Eleventy supports a variety of templating languages. Astro supports including components from several popular JS Frameworks (e.g. React, Svelte, Vue, Solid), but uses Astro layouts, pages and components for most page templating.

- Astro uses a `src/` directory for all files, including site metadata, that are available for querying and processing during site build. `src/pages` is a special folder for file-based routing.

- Astro uses a `public/` folder for static assets that do not need to be processed nor transformed during the build.

## Switch from Eleventy to Astro

To convert an Eleventy blog to Astro, start with our blog theme starter template, or explore more community blog themes in our [theme showcase](https://astro.build/themes/). Bring your existing Markdown (or MDX, with our optional integration) files as content to [create Markdown or MDX pages](/en/guides/markdown-content/).

Your Eleventy project allowed you to use a variety of templating languages to build your site. In an Astro project, your page templating will mostly be achieved with Astro components, which can be used as UI elements, layouts and even full pages. You may want to explore [Astro's component syntax](/en/core-concepts/astro-components/) to see how to template in Astro using components.

To convert other types of sites, such as a portfolio or documentation site, see more official starter templates on [astro.new](https://astro.new) with links to a GitHub repository as well as one-click links to open a working project in StackBlitz, CodeSandbox and Gitpod online development environments.

## Community Resources

- Add your own!