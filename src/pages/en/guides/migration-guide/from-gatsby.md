---
title: Migrating from Gatsby
description: Tips for migrating an existing Gatsby project to Astro
layout: ~/layouts/CMSLayout.astro
stub: false
framework: Gatsby
---

Here are some tips for converting a Gatsby project to Astro. This is not a full, step-by-step walkthrough, but it will guide you through some changes you will have to make. (THESE ARE SARAH'S ROUGH NOTES)

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

## Installing Astro

You start migrating from Gatsby to Astro with one of two methods:
- Create a new Astro project using `npm create astro@latest -- --template minimal`, then copy your existing Gatsby project files over to your new Astro project.
- Update your project dependencies in `package.json` and follow all the steps to [install Astro manually](/en/install/manual/) in your existing Gatsby project.

## Configuring your `public/` and build directories

Gatsby uses the `public` directory for its build output, and directory named `static` for public assets. Astro uses `dist/` by default for the build output and uses `public/` for static assets.

You can safely discard Gatsby's `public` directory, as you will no longer need its build output. Then, rename the `static` folder to `public`.

- You should have an `index.astro` page that does not use any layout.

## Community Resources 

- Blog Post: [Migrating to Astro was EZ](https://joelhooks.com/migrating-to-astro-was-ez).

- Blog Post: [My Switch from Gatsby to Astro](https://www.joshfinnie.com/blog/my-switch-from-gatsby-to-astro/).
