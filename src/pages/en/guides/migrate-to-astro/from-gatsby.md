---
title: Migrating from Gatsby
description: Tips for migrating an existing Gatsby project to Astro
layout: ~/layouts/MigrationLayout.astro
stub: true
framework: Gatsby
---

[Gatsby](https://www.gatsbyjs.com/) is a static-site web builder based on React.

## Key Similarities

Gatsby and Astro share some similarities that will help you migrate your project:

- The syntax of `.astro` files is similar to JSX. Writing Astro should feel familiar.

- Astro has built-in support for Markdown and an integration for using MDX files. Both Gatsby and Astro use [Remark](https://remark.js.org/) by default for Markdown manipulation and pre-processing, so you can continue to use many of your existing Remark plugins.

- Astro also has [official integrations for using React components](/en/guides/integrations-guide/react/). Note that in Astro, React files **must** have a `.jsx` or `.tsx` extension.

- Astro has support for installing NPM packages, including several for React. You may be able to keep some or all of your existing React components and dependencies.

- Astro projects can also be SSG or SSR. (Support for per-page rendering strategy is planned.)

## Key Differences

When you rebuild your Gatsby site in Astro, you will notice some important differences:

- [MPA vs SPA](/en/concepts/mpa-vs-spa/): Gatsby is a React single-page app, and uses `index.js` as your project's root. Astro is a multi-page site, and `index.astro` is your home page.

- [Astro components](/en/core-concepts/astro-components/) are not written as exported functions that return page templating. Instead, you'll split your code into a "code fence" and a body exclusively for the HTML you generate.

- [Local file data](/en/guides/imports/): Gatsby uses GraphQL to retrieve data from your project files. Astro uses ESM imports and a top-level await [`Astro.glob()`](/en/guides/imports/#astroglob) call to import data from your project files. GraphQL may be optionally be added to your Astro project, but is not included by default.

## Switch from Gatsby to Astro

To convert a Gatsby blog to Astro, start with our official blog theme starter template, or explore more community blog themes in our [theme showcase](https://astro.build/themes/). Bring your existing Markdown (or MDX, with our optional integration) files as content to [create Markdown or MDX pages](/en/guides/markdown-content/).

While file-based routing and layout components are similar in Astro, you may wish to read about [Astro's project structure](/en/core-concepts/project-structure/) to learn where files should be located. For example, you will need to rename your Gatsby static assets folder from `static/` to `public/`.

To convert other types of sites, such as a portfolio or documentation site, see more official starter templates on [astro.new](https://astro.new) with links to a GitHub repository as well as one-click links to open a working project in StackBlitz, CodeSandbox and Gitpod online development environments.

## Community Resources 

- Blog Post: [Migrating to Astro was EZ](https://joelhooks.com/migrating-to-astro-was-ez).

- Blog Post: [My Switch from Gatsby to Astro](https://www.joshfinnie.com/blog/my-switch-from-gatsby-to-astro/).

- Blog Post: [Why I moved to Astro from Gatsby](https://dev.to/askrodney/why-i-moved-to-astro-from-gatsby-3fck).

- Blog Post: [Migrating my website from Gatsby to Astro](https://dev.to/flashblaze/migrating-my-website-from-gatsby-to-astro-2ej5).
