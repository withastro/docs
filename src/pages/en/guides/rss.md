---
layout: ~/layouts/MainLayout.astro
title: RSS
description: An intro to RSS in Astro
---

Astro supports fast, automatic RSS feed generation for blogs and other content websites. For more information about RSS feeds in general, see [aboutfeeds.com](https://aboutfeeds.com/).

## Using `@astrojs/rss` (recommended)

The `@astrojs/rss` package provides helpers for generating RSS feeds using [API endpoints](/en/core-concepts/astro-pages/#non-html-pages). This unlocks both static builds _and_ on-demand generation when using an [SSR adapter](/en/guides/server-side-rendering/#enabling-ssr-in-your-project).

First, install `@astrojs/rss` using your preferred package manager:

```bash
# npm
npm i @astrojs/rss
# yarn
yarn add @astrojs/rss
# pnpm
pnpm i @astrojs/rss
```

To generate your first RSS feed, create an `rss.xml.js` file under your `src/pages/` directory. `rss.xml` will be the output URL, so feel free to rename this if you prefer.

Now, import the `rss` helper from the `@astrojs/rss` package. We will explore each of the parameters below:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

export const get = () => rss({
    // `<title>` field in output xml
    title: 'Buzz’s Blog',
    // `<description>` field in output xml
    description: 'A humble Astronaut’s guide to the stars',
    // list of `<item>`s in output xml
    // simple example: generate items for every md file in /src/pages
    // see "Generating items" section for required frontmatter and advanced use cases
    items: import.meta.glob('./**/*.md'),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
    // (optional) add arbitrary metadata to opening <rss> tag
    // this example generates `<rss xmlns:h="http://www.w3.org/TR/html4/"...`
    xmlns: { h: 'http://www.w3.org/TR/html4/' },
  });
```

### Generating `items`

The `items` field accepts either:
1. [A list of RSS feed objects](#1-list-of-rss-feed-objects), each with a `link`, `title`, `pubDate`, and optional `description` and `customData` fields.
2. [An `import.meta.glob(...)` result](#2-importmetaglob-result). **Only use this for `.md` files in the `src/pages/` directory!**

#### 1. List of RSS feed objects

We recommend this option for `.md` files outside of the `pages` directory. This is common when generating routes [via `getStaticPaths`](/en/reference/api-reference/#getstaticpaths). 

For instance, say our blog posts are stored under a `src/posts/` directory. Each post has a `title`, `pubDate`, and `slug` in its frontmatter, where `slug` corresponds to the output URL on your site. We can generate an RSS feed using [Vite's `import.meta.globEager` helper](https://vitejs.dev/guide/features.html#glob-import) like so:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

const postImportResult = import.meta.globEager('../posts/**/*.md');
const posts = Object.values(postImportResult);

export const get = () => rss({
    title: 'Buzz’s Blog',
    description: 'A humble Astronaut’s guide to the stars',
    items: posts.map((post) => ({
      link: post.frontmatter.slug,
      title: post.frontmatter.title,
      pubDate: post.frontmatter.pubDate,
    }))
  });
```

#### 2. `import.meta.glob` result

We recommend this option as a convenient shorthand for `.md` files under `src/pages/`. Each post should have a `title`, `pubDate`, and optional `description` and `customData` fields in its frontmatter. See [Vite's glob import documentation](https://vitejs.dev/guide/features.html#glob-import) to understand the import syntax.

Say your blog posts are stored under the `src/pages/blog/` directory. You can generate an RSS feed like so:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

export const get = () => rss({
    title: 'Buzz’s Blog',
    description: 'A humble Astronaut’s guide to the stars',
    items: import.meta.glob('./blog/**/*.md'),
  });
```

### Adding a stylesheet

You can style your RSS feed with XSL for a more pleasant user experience when viewing in your browser.

Use the `rss` function's `stylesheet` option to specify an absolute path to your stylesheet. If you don't have an RSS stylesheet in mind, you can generate one by adding an `rss-styles.xsl.js` route (or whichever route you prefer) under your project's `src/pages/` directory. Here, you can apply our `getStylesheet` helper. This will serve the [Pretty Feed](https://github.com/genmon/aboutfeeds/blob/main/tools/pretty-feed-v3.xsl) stylesheet when visiting `/rss-styles.xsl`:

```js
// src/pages/rss-styles.xsl.js
import { getStylesheet } from '@astrojs/rss';

export const get = getStylesheet
```

Then, set your RSS feed's `stylesheet` option based on this file path:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

export const get = () => rss({
    title: 'Buzz’s Blog',
    description: 'A humble Astronaut’s guide to the stars',
    stylesheet: '/rss-styles.xsl',
    ...
  });
```

If you have an XSL-based stylesheet already, place it under your project's [`public/` directory](/en/core-concepts/project-structure/#public) and set the `stylesheet` option like so:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

export const get = () => rss({
    title: 'Buzz’s Blog',
    description: 'A humble Astronaut’s guide to the stars',
    // ex. use your stylesheet from "public/rss/styles.xsl"
    stylesheet: '/rss/styles.xsl',
    ...
  });
```

## Using `getStaticPaths()`

> **Note:** this approach is more limited compared to `@astrojs/rss`. We mainly include these instructions for legacy purposes.

You can also create an RSS feed from any Astro page that uses a `getStaticPaths()` function for routing. Only dynamic routes can use `getStaticPaths()` today (see [Routing](/en/core-concepts/routing)).

Create an RSS Feed by calling the `rss()` function that is passed as an argument to `getStaticPaths()`. This will create an `rss.xml` file in your final build (or whatever you specify using `dest`) based on the data that you provide using the `items` array.

```js
// Example: /src/pages/posts/[...page].astro
// Place this function inside your Astro component script.
export async function getStaticPaths({rss}) {
  const allPosts = await Astro.glob('../post/*.md');
  const sortedPosts = allPosts.sort((a, b) => Date.parse(b.frontmatter.date) - Date.parse(a.frontmatter.date));
  // Generate an RSS feed from this collection
  rss({
    // The RSS Feed title, description, and custom metadata.
    title: 'Don’s Blog',
    // See "Styling" section below
    stylesheet: true,
    description: 'An example blog on Astro',
    customData: `<language>en-us</language>`,
    // The list of items for your RSS feed, sorted.
    items: sortedPosts.map(item => ({
      title: item.frontmatter.title,
      description: item.frontmatter.description,
      link: item.url,
      pubDate: item.frontmatter.date,
    })),
    // Optional: Customize where the file is written to.
    // Otherwise, defaults to "/rss.xml"
    dest: '/my/custom/feed.xml',
  });
  // Return your paths
  return [...];
}
```

Note: RSS feeds will **not** be built during development when using this method.

### Adding a stylesheet

When using the `getStaticPaths` method to RSS, we will optionally generate a stylesheet for you. Pass `stylesheet: true` as an option to pull in the [Pretty Feed](https://github.com/genmon/aboutfeeds/blob/main/tools/pretty-feed-v3.xsl) XSL stylesheet.

If you'd like to use a custom XSL stylesheet, you can pass a string value like `stylesheet: '/my-custom-stylesheet.xsl'`. This file should be in your `public/` directory (in this case, `/public/my-custom-stylesheet.xsl`).
