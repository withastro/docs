---
layout: ~/layouts/MainLayout.astro
title: Content Focus
description: "Astro is a perfect choice for your content-focused site! Blogs, marketing sites, portfolios, and more! Author your content directly in your project, or connect your CMS of choice."
i18nReady: false
---
Astro is a perfect choice for your content-focused site! Blogs, marketing sites, portfolios, and more!

Write a blog post directly in Astro using Markdown/MDX, or fetch your content from a headless CMS. Add a layout, create an index of posts and optionally set up an RSS feed to allow readers to subscribe to your posts.

:::tip[Quick Start]
Want to get started blogging with Astro immediately? Open our blog starter from Astro.new [have a deploy to Netlify button here?] Or, visit our [guide to setting up your Astro blog] for hands-on, step-by-step instructions.
:::

## How to write content for your Site

In Astro, you can author your content in a variety of ways! You can write your blog posts:

- entirely in Markdown, in the editor of your choice, and add your `.md` files to your Astro project
- in MDX (`.mdx`) files located in your Astro project
- using a third-part content management system (CMS)

### Markdown Authoring
Markdown is a convenient syntax for writing large amounts text with shorthands for some basic HTML formatting such as headers and font styles.

You can use any Markdown editor, including your code editor inside your Astro project itself, to compose your blog content. Create a new file within your Astro repository, or add a new Markdown file written in an external editor. Some online Markdown editors like [StackEdit](https://stackedit.io/) or [Dillinger](https://dillinger.io) will even sync your work with your Astro repository stored on GitHub.

### MDX Authoring
With the optional Astro MDX integration added to your project, you can include JavaScript expressions and components within your Markdown content. Add UI elements such as a banner or an interactive carousel right in your text, to take your blogging to the next level!

Write MDX content directly in your code editor, alongside your project files. You can use frontmatter YAML, ESM import and export statements, and JavaScript expressions inside curly braces while writing your text content in standard Markdown.

### Headless CMS Authoring

Write blog posts in your existing CMS like Storyblok or Contentful. Astro pages can fetch your remote content using your service's API.

## Adding new blog posts or pages

Any `.astro`, `.md` or `.mdx` file located within `src/pages/` automatically creates its own page route on your website with Astro's built-in [file-based routing]. Add a new post to your blog by adding a new file to your project anywhere within this directory! Individual pages will be built automatically at a URL corresponding to the post's file path.

If you writing your content in a CMS, then you can take advantage of Astro's [dynamic routing] to create your blog post pages with a single page component that will generate multiple page routes using your fetched content.

### Markdown/MDX pages

Specify an `.astro` layout component to use an `.md` or `.mdx` file to create a new page on your site. Your Markdown or MDX content will be injected in the position of your layout's default `<slot/>`.

This option is useful when your Markdown content is the entirety of your page content, and you use a standard layout for each blog post.

### Astro pages
You can also [import Markdown content](/en/guides/markdown-content/#importing-markdown) from `.md` and `.mdx` files into your `.astro` pages, if you prefer to build your page content directly in Astro components, with injections of Markdown content.

This option is useful when you want the advantages of authoring with `.astro` page syntax and JSX-like features, while including some sections of text written in Markdown.

### Dynamically-generated pages from remote content
You can create an `.astro` page component that both fetches data from a remote source, and exports a function that will generate multiple pages at build time. These JavaScript operations are defined in the component's frontmatter script, and the desired output for each of these pages is defined in the component's HTML template. 

This option is useful when your post content does not exist as individual files within your Astro `src/`, and you cannot use Astro's file-based routing to create new pages.

## Adding Blog Infrastructure

Once your content exists as pages on your site, you can use Astro's API and integrations to build standard blog features such as filtered or sorted lists of your posts, pages for tags or categories, previous and next navigation, and an RSS feed.

These features require some one-time code set up, then will re-run at build time and return updated results based on the current files in your project and any the data returned by the most recent fetch call.

### Blog Index

You can use the [`Astro.glob()` function](/en/reference/api-reference/#astroglob) to create a query that retrieves data from a set of defined local files, such as all your blog posts. Then, you can select, filter and sort these results using standard JavaScript operations and Astro templating to create and customize lists to display such as a full blog archive or a list of your five most recent posts.

### Tags/Categories Pages

Just as you can create an index of all or some of your blog posts, you can create more customized pages based on your blog post content's metadata. For example, using Astro's `Astro.glob()` function inside an `.astro` page component that dynamically generates multiple pages, you can create a page for each blog tag that lists only the tagged articles.

These functions and operations are written using standard JavaScript in your Astro page component's frontmatter, and with Astro's JSX-like templating, you can use the properties of each post like `title` and `url` as variables to create linked lists. Or, write and import a specialized Astro or framework component to display each post item, and pass these variables as attributes.

### RSS

You can create an RSS feed for your site by installing the `@astrojs/rss` integration and adding your custom data such about your site, such as your domain and a description. Once your RSS feed is configured, an updated XML document will be created every time your site is built, and your posts will be distributed to any subscribers via their feed readers.