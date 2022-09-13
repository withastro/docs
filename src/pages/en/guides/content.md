---
layout: ~/layouts/MainLayout.astro
title: Authoring Content
description: "Astro is a perfect choice for your content-focused site: blogs, marketing sites, portfolios, and more! Author your content directly in your project, or connect your CMS of choice."
i18nReady: false
---
Astro is a perfect choice for your content-focused site: blogs, marketing sites, portfolios, and more!

Write a blog post directly in Astro using Markdown/MDX, or fetch your content from a headless CMS. Add a layout, create an index of posts and optionally set up an RSS feed to allow readers to subscribe to your posts.

:::tip[Quick Start]
Want to explore a content-focused Astro site immediately? Open and edit one of our ready-to-go starter templates (blog, portfolio, documentation) right in your browser from [astro.new](https://astro.new)!
:::

## How to write content for your Site

In Astro, you can author your content in a variety of ways. For example, you can write blog posts:

- Entirely in Markdown, in the editor of your choice.
- In MDX (`.mdx`) files located in your Astro project.
- Using a third-part content management system (CMS).

### Markdown Authoring
Markdown is a convenient syntax for writing large amounts text with shorthand syntax for some basic HTML formatting such as headers and font styles.

You can use any Markdown editor, including your code editor, to compose your content.

 Create a new `.md` file within your Astro repository, or add a new Markdown file written in an external editor. Some online Markdown editors like [StackEdit](https://stackedit.io/) or [Dillinger](https://dillinger.io) will even sync your work with your Astro repository stored on GitHub.

📚 Learn more about [writing Markdown content in Astro](/en/guides/markdown-content/).

### MDX Authoring
With the optional Astro MDX integration added to your project, you can include JavaScript expressions and components within your Markdown content. Add UI elements such as a banner or an interactive carousel right in your text, to take your blogging to the next level!

Write `.mdx` files directly in your code editor, alongside your project files. You can use frontmatter YAML, ESM import and export statements, and JavaScript expressions inside curly braces while writing your text content in standard Markdown.

📚 Learn more about the [Astro official MDX integration](/en/guides/integrations-guide/mdx/).

### Headless CMS Authoring

Write blog posts in your existing Content Management System (CMS) such as Storyblok, WordPress, or Contentful. 

Astro pages can [fetch your remote content](/en/guides/data-fetching/#fetch-from-a-headless-cms) using your service's API.

## Adding new blog posts or pages

Any appopriate page file (`.astro`, `.md`, `.mdx`, `.js`/.`ts`, `.html`) located within `src/pages/` automatically creates its own page route on your website with Astro's built-in [file-based routing](/en/core-concepts/routing/). Add a new post to your blog by adding or generating a new file anywhere within this directory! Individual pages will be built automatically at a URL corresponding to the post's file path.

If you are writing your content in a CMS, then you can take advantage of Astro's [dynamic routing](/en/core-concepts/routing/#dynamic-routes) by using a single Astro page component to create multiple blog posts and pages from your fetched content.

## Adding Blog Infrastructure

Once your content exists as pages on your site, you can use [Astro's API](/en/reference/api-reference/) and [integrations](/en/guides/integrations-guide/) to build standard blog features such as filtered or sorted lists of your posts, individual pages for tags or categories, previous and next navigation, and an RSS feed.

These features require some one-time code set up. After that, your site will automatically update based on the current files in your project and any remote data returned by the most recent fetch calls. Note that for static websites, this updating occurs at build time only. See our guides and reference pages throughout this site for specific code examples.

:::tip[Official Blog Starter]
Visit [astro.new](https://astro.new/) to see and play with existing code powering some of these features in our official Blog starter template!
:::

### Blog Index

You can use the [`Astro.glob()` function](/en/reference/api-reference/#astroglob) to create a query that retrieves data from a set of defined local files, such as all your blog posts. You can select, filter and sort these results using standard JavaScript operations. 

Then, build exactly what you want displayed on your page, such as a full blog post archive or a list of your five most recent posts.

### Tags/Categories Pages

You can also create more customized pages using the content and metadata of your blog posts.

For example, using Astro's `Astro.glob()` function inside an `.astro` page component that dynamically generates multiple pages, you can automatically build individual pages for each blog tag. These functions and operations are written using standard JavaScript in your Astro page component's frontmatter. 

With Astro's JSX-like templating, you can use the properties of each post like `title` and `url`  to customize your page content. Or, write and import a dedicated Astro or UI framework component to display a card for each post, and pass these properties as attributes.

### RSS

You can [create an RSS feed](/en/guides/rss/) for your site by installing the `@astrojs/rss` integration and adding your site data, such as your domain and a description. Once your RSS feed is configured, an updated XML document will be created every time your site is built, and your posts will be distributed to any subscribers via their feed readers.