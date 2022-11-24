---
title: Migrating from Gatsby
description: Tips for migrating an existing Gatsby project to Astro
layout: ~/layouts/CMSLayout.astro
stub: false
framework: Gatsby
---

Here are some tips for converting a Gatsby project to Astro.

## Key Differences

### React App vs MPA 

Gatsby is a React App, and uses `index.js` as your project's route. 

Astro is a multi-page site, and `index.astro` is your home page. 

### React components vs Astro components
Gatsby's `.js` or `.jsx` components (including pages and layouts) include exported functions that return page templating.

Astro's `.astro` pages, layouts and components are not written as exported functions. Instead, any necessary JavaScript is written in a frontmatter "code fence" and the rest of the file is exclusively for page templating, and other HTML elements such as `<style>` and `<script>` tags.

### Imports and Data Fetching

Gatsby sites typically use several plugins and packages to read the file system, transform Markdown etc.  Additionally, Gatsby uses GraphQL to retrieve data from your project files.

Astro has some external packages and integrations, but many core features are available from the API. Astro uses ESM imports and a top-level await [`Astro.glob()`]() call to import your project data. (GraphQL may be optionally used.)

## Key Similarities

- The syntax of `.astro` files is similar to JSX. 

- Astro uses a `src/pages` folder for file-based routing.

- Astro has built-in support for Markdown, and integrations for using MDX files and React components.

- Astro has support for installing NPM packages, including ones for React. You may be able to keep some of your existing React components and dependencies.

## Community Resources 

- Blog Post: [Migrating to Astro was EZ](https://joelhooks.com/migrating-to-astro-was-ez).

- Blog Post: [My Switch from Gatsby to Astro](https://www.joshfinnie.com/blog/my-switch-from-gatsby-to-astro/).
