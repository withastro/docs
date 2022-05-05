---
layout: ~/layouts/MainLayout.astro
title: RSS
description: An intro to RSS in Astro
setup : |
  import ImportMetaEnv from '~/components/ImportMetaEnv.astro';
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

Then, ensure you've [configured a `site`](/en/reference/configuration-reference/#site) in your project's `astro.config`. You will use this to generate links in your RSS feed [via the `SITE` environment variable](/en/guides/environment-variables/#default-environment-variables).

> Note: The `SITE` environment variable only exists in the latest Astro 1.0 beta. Either upgrade to the latest version of Astro (`astro@latest`), or write your `site` manually if this isn't possible (see examples below). 

Now, let's generate our first RSS feed! Create an `rss.xml.js` file under your `src/pages/` directory. `rss.xml` will be the output URL, so feel free to rename this if you prefer.

Next, import the `rss` helper from the `@astrojs/rss` package and call with the following parameters:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

export const get = () => rss({
    // `<title>` field in output xml
    title: 'Buzz’s Blog',
    // `<description>` field in output xml
    description: 'A humble Astronaut’s guide to the stars',
    // base URL for RSS <item> links
    // SITE will use "site" from your project's astro.config.
    site: import.meta.env.SITE,
    // list of `<item>`s in output xml
    // simple example: generate items for every md file in /src/pages
    // see "Generating items" section for required frontmatter and advanced use cases
    items: import.meta.glob('./**/*.md'),
    // (optional) inject custom xml
    customData: `<language>en-us</language>`,
  });
```

### Generating `items`

The `items` field accepts either:
1. [An `import.meta.glob(...)` result](#2-importmetaglob-result) **(only use this for `.md` files within the `src/pages/` directory!)**
2. [A list of RSS feed objects](#1-list-of-rss-feed-objects), each with a `link`, `title`, `pubDate`, and optional `description` and `customData` fields.

#### 1. `import.meta.glob` result

We recommend this option as a convenient shorthand for `.md` files under `src/pages/`. Each post should have a `title`, `pubDate`, and optional `description` and `customData` fields in its frontmatter. If this isn't possible, or you'd prefer to generate this frontmatter in code, [see option 2](#2-list-of-rss-feed-objects).

Say your blog posts are stored under the `src/pages/blog/` directory. You can generate an RSS feed like so:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

export const get = () => rss({
    title: 'Buzz’s Blog',
    description: 'A humble Astronaut’s guide to the stars',
    site: import.meta.env.SITE,
    items: import.meta.glob('./blog/**/*.md'),
  });
```

See [Vite's glob import documentation](https://vitejs.dev/guide/features.html#glob-import) for more on this import syntax.

#### 2. List of RSS feed objects

We recommend this option for `.md` files outside of the `pages` directory. This is common when generating routes [via `getStaticPaths`](/en/reference/api-reference/#getstaticpaths). 

For instance, say your `.md` posts are stored under a `src/posts/` directory. Each post has a `title`, `pubDate`, and `slug` in its frontmatter, where `slug` corresponds to the output URL on your site. We can generate an RSS feed using [Vite's `import.meta.globEager` helper](https://vitejs.dev/guide/features.html#glob-import) like so:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

const postImportResult = import.meta.globEager('../posts/**/*.md');
const posts = Object.values(postImportResult);

export const get = () => rss({
    title: 'Buzz’s Blog',
    description: 'A humble Astronaut’s guide to the stars',
    site: import.meta.env.SITE,
    items: posts.map((post) => ({
      link: post.frontmatter.slug,
      title: post.frontmatter.title,
      pubDate: post.frontmatter.pubDate,
    }))
  });
```

### Adding a stylesheet

You can style your RSS feed for a more pleasant user experience when viewing the file in your browser.

Use the `rss` function's `stylesheet` option to specify an absolute path to your stylesheet.

```js
rss({
  // ex. use your stylesheet from "public/rss/styles.xsl"
  stylesheet: '/rss/styles.xsl',
  // ...
});
```

If you don't have an RSS stylesheet in mind, we recommend the [Pretty Feed v3 default stylesheet](https://github.com/genmon/aboutfeeds/blob/main/tools/pretty-feed-v3.xsl), which you can download from GitHub and save into your project's `public/` directory.

## Using `getStaticPaths()`

> **Note:** This method has been deprecated, and will be removed before the official `v1.0.0` release. Please use `@astrojs/rss` instead.

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
