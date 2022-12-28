---
title: Migrating from Next.js
description: Tips for migrating an existing Next.js project to Astro
layout: ~/layouts/MigrationLayout.astro
stub: true
framework: Next.js
---

[Next.js](https://nextjs.org) is a framework for building web applications on top of React.

## Key Similarities

Next.js and Astro share some similarities that will help you migrate your project:

- The syntax of `.astro` files is similar to JSX. Writing Astro should feel familiar.

- Both Next.js and Astro are modern Javascript static-site generators. Both use a `src/` folder for your project files and a special folder for file-based routing. Creating and managing pages for your site should feel familiar.

- Astro has [an official integration for using React components](/en/guides/integrations-guide/react/) and support for NPM packages and community integrations, including several for React. You will be able to write React UI components for interactivity, and may be able to keep some or all of your existing components and dependencies.


## Key Differences

When you rebuild your Next.js site in Astro, you will notice some important differences:

- [MPA vs SPA](/en/concepts/mpa-vs-spa/): Next.js is a React-based SPA (single-page application). Astro sites are multi-page apps built using `.astro` components, but can also support React, Preact, Vue.js, Svelte, SolidJS, AlpineJS, Lit and raw HTML templating.

- [Astro components](/en/core-concepts/astro-components/) are not written as exported functions that return page templating. Instead, you'll split your code into a "code fence" and a body exclusively for the HTML you generate.

- [Content-focus](/en/concepts/why-astro/): Astro was designed primarily for content-focused sites. An existing Next.js app might be built for high client-side interactivity and may include items that are difficult to replicate in Astro, such as dashboards.


## Switch from Next.js to Astro

To convert a Next.js blog to Astro, start with our official blog theme starter template, or explore more community blog themes in our [theme showcase](https://astro.build/themes/). Bring your existing Markdown (or MDX, with our optional integration) files as content to [create Markdown or MDX pages](/en/guides/markdown-content/).

While file-based routing and layout components are similar in Astro, you may wish to read about [Astro's project structure](/en/core-concepts/project-structure/) to learn where files should be located. For example, Astro uses a `public/` folder outside of `src/` for static assets.

To convert other types of sites, such as a portfolio or documentation site, see more official starter templates on [astro.new](https://astro.new) with links to a GitHub repository as well as one-click links to open a working project in StackBlitz, CodeSandbox and Gitpod online development environments.


## Community Resources 

- Blog Post: [My Switch from Next to Astro](https://www.joshfinnie.com/blog/my-switch-from-Next-to-astro/).
