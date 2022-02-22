---
layout: ~/layouts/MainLayout.astro
title: Pages
description: An introduction to Astro pages
---
## Astro Pages

**Pages** are a special type of [Astro Component](/en/core-concepts/astro-components) that handle routing, data loading, and templating for each page of your website. Pages must live in `src/pages/` (or any subdirectory) and Pages must render a full HTML document.

### File-based Routing

Astro uses Pages for **file-based routing.** Every `.astro` Page in your `src/pages` directory becomes a page on your site, using the file name as the route. 

Astro also uses file-based routing to support dynamic route parameters in the filename, so that one `.astro` file can create many dynamic routes at build time.

📚 Read more about [Routing in Astro](/en/core-concepts/routing)

### Data Loading

Astro pages can fetch data to help generate your pages. Astro provides two different tools to pages to help you do this: **fetch()** and **top-level await.**

📚 Read more about [data-fetching](/en/guides/data-fetching) in Astro.

### Page Templating

All Astro components are responsible for returning *some* HTML. 

Astro Pages must return a full `<html>...</html>` page response, including `<head>` and `<body>`. (`<!doctype html>` is optional, and will be added automatically.)

To avoid recreating a full HTML document on every single Page, Astro pages can use [Layout components](/en/core-components/layouts) to provide common elements on multiple pages.

Layouts, if used, are specified on a per-page basis and are not required. Any individual page may customize its full HTML output entirely. 

If you want every page to look completely different, including different `<head>` and metadata, you can!

## Custom 404 Error Page

For a custom 404 error page create a `404.astro` file in `/src/pages`. That builds to a `404.html` page. Most [deploy services](/en/guides/deploy) will find and use it.


## Markdown Pages

Astro also treats any Markdown (`.md`) files inside of `/src/pages/` as pages for page routing. These are commonly used for text-heavy pages like blog posts and documentation. 

`.md` files have a special front matter property for specifying an Astro [Layout component](/en/core-concepts/layout) to wrap their Markdown content in a full `<html>...</html>` page document. The Markdown content will be rendered in the Layout's `<slot>` location.

Astro's Markdown files can import and render both Astro and framework components and pass front matter properties to Astro components as props.

📚 Read more about [Markdown Content](/en/guides/markdown-content) in Astro.


## Non-HTML Pages

> ⚠️ This feature is currently only supported with the `--experimental-static-build` CLI flag. This feature may be refined over the next few weeks/months as SSR support is finalized.

Non-HTML pages, like `.json` or `.xml`, can be built from `.js` and `.ts`. Built filenames and extensions are based on the source file's name, ex: `src/pages/data.json.ts` will be built to match the `/data.json` route in your final build.

📚 Read more about generating non-HTML pages in Astro.