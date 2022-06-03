---
layout: ~/layouts/MainLayout.astro
title: RSS
description: An intro to RSS in Astro
i18nReady: true
---

Astro supports fast, automatic RSS feed generation for blogs and other content websites. For more information about RSS feeds in general, see [aboutfeeds.com](https://aboutfeeds.com/).

## Setting up `@astrojs/rss`

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

## Generating `items`

The `items` field accepts either:
1. [An `import.meta.glob(...)` result](#1-importmetaglob-result) **(only use this for `.md` files within the `src/pages/` directory!)**
2. [A list of RSS feed objects](#2-list-of-rss-feed-objects), each with a `link`, `title`, `pubDate`, and optional `description` and `customData` fields.

### 1. `import.meta.glob` result

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

### 2. List of RSS feed objects

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

## Adding a stylesheet

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
