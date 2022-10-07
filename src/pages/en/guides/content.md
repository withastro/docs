---
layout: ~/layouts/MainLayout.astro
title: Authoring Content
description: "Astro is a perfect choice for your content-focused site: blogs, marketing sites, portfolios, and more! Author your content directly in your project, or connect your CMS of choice."
i18nReady: false
---
Astro is a perfect choice for your content-focused site: blogs, marketing sites, portfolios, and more!

Astro helps you author and present your content. You can write a blog post directly in Astro using Markdown/MDX, or fetch your content from a headless CMS. Astro lets you build a site around your content: you can add a layout to your pages, create an index of posts, and set up an RSS feed to allow readers to subscribe.

## Writing Content

In Astro, you can author your content in a variety of ways. 
- In Markdown (`.md`) files, designed to make it easy to write rich text content 
- In MDX (`.mdx`) files, which let you include components and dynamic expressions in your document
- Using a third-party content management system (CMS), then pulling that content into a `.astro` page.



### Markdown Authoring
Markdown is a convenient syntax for writing rich text with basic formatting and common elements like headers, lists, and images.

Create a new `.md` file within the `src/pages/` directory in your Astro repository, or bring in an existing markdown file. You can edit this directly in your code editor or use an external markdown editor. Some online Markdown editors like [StackEdit](https://stackedit.io/) or [Dillinger](https://dillinger.io) will even sync your work with your Astro repository stored on GitHub.

📚 Learn more about [writing Markdown content in Astro](/en/guides/markdown-content/).

### MDX Authoring
If you add the MDX integration to your project, you can use `.mdx` files, which let you include JavaScript expressions and custom components within your Markdown content. This includes both static [Astro components](/en/core-concepts/astro-components/) and interactive [framework components](/en/core-concepts/framework-components/). Add UI elements such as a banner or an interactive carousel right in your text to turn your content into full-fledged web pages.

Write `.mdx` files directly in your code editor, alongside your project files. You write text content in standard markdown, but have access to additional features that utilize JavaScript. 

📚 Learn more about the [Astro official MDX integration](/en/guides/integrations-guide/mdx/).

### Headless CMS Authoring

Write blog posts in your existing Content Management System (CMS) such as Storyblok, WordPress, or Contentful. Some CMSes, like Storyblok, provide an official [Astro integration](https://www.storyblok.com/mp/announcing-storyblok-astro). Others expose a JavaScript SDK that Astro pages can use to [fetch your remote content](/en/guides/data-fetching/#fetch-from-a-headless-cms).

## Managing pages

Markdown and MDX files live in your `src/pages` directory and make use of [file-based routing](/en/core-concepts/routing/). Files in this directory will generate pages on your site, built at a URL corresponding to the post's file path.

If you're writing your content in a CMS, you can fetch your posts and use [dynamic routing](/en/core-concepts/routing/#dynamic-routes) to use one `.astro` file to generate a route for each post. In Astro's default static mode, these routes are generated at build time. If you opt-in to [SSR mode](https://docs.astro.build/en/guides/server-side-rendering/), you respond to a request at runtime and fetch the content on demand.

## Adding Blog Infrastructure

Once your content exists as pages on your site, you can use [Astro's API](/en/reference/api-reference/) and [integrations](/en/guides/integrations-guide/) to build standard blog features such as filtered or sorted lists of your posts, individual pages for tags or categories, previous and next navigation, and an RSS feed.

These features require some one-time code set up. After that, your site will automatically update based on the current files in your project and any remote data returned by the most recent fetch calls. Note that for static websites, this updating occurs at build time only.

:::tip[Official Blog Starter]
Visit [astro.new](https://astro.new/) to see and play with existing code powering some of these features in our official Blog starter template!
:::

### Blog Index

You can use the [`Astro.glob()` function](/en/reference/api-reference/#astroglob) to create a query that retrieves data from a set of defined local files, such as all your blog posts. You can select, filter and sort these results using standard JavaScript operations. 

Then, build exactly what you want displayed on your page, such as a full blog post archive or a list of your five most recent posts.

### Tags/Categories Pages

You can also create more customized pages using the content and metadata of your blog posts.

For example, you can dynamically build individual pages for each unique tag found in your blog posts which show only the posts with that tag.  You can use the properties of each post like `title` and `url` directly in your page template to customize your page content. Or, create a dedicated component to handle the templating for each post displayed.

### RSS

You can [create an RSS feed](/en/guides/rss/) for your site by installing the `@astrojs/rss` integration and adding your site data, such as your domain and a description. Once your RSS feed is configured, an updated XML document will be created every time your site is built, and your posts will be distributed to any subscribers via their feed readers.
