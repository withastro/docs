---
layout: ~/layouts/MainLayout.astro
title: Pages
description: An introduction to Astro pages
i18nReady: true
---

**Pages** are files that live in the `src/pages/` subdirectory of your Astro project. They are responsible for handling routing, data loading, and overall page layout for every page in your website.

## Supported page files 

Astro supports the following file types in the `src/pages/` directory:
- [`.astro`](#astro-pages)
- [`.md`](#markdownmdx-pages)
- `.mdx` (with the [MDX Integration installed](/en/guides/integrations-guide/mdx/#installation))
- [`.js`/`.ts`](#file-routes)
- [`.html`](#html-pages)

## File-based routing

Astro leverages a routing strategy called **file-based routing**. Each file in your `src/pages/` directory becomes an endpoint on your site based on its file path.

Write standard HTML [`<a>` elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) in your component template to link between pages.

📚 Read more about [Routing in Astro](/en/core-concepts/routing/).

## Astro Pages

Astro pages use the `.astro` file extension and support the same features as [Astro components](/en/core-concepts/astro-components/).

```astro
---
// Example: src/pages/index.astro
---
<html lang="en">
  <head>
    <title>My Homepage</title>
  </head>
  <body>
    <h1>Welcome to my website!</h1>
  </body>
</html>
```

To avoid repeating the same HTML elements on every page, you can move common `<head>` and `<body>` elements into your own [layout components](/en/core-concepts/layouts/). You can use as many or as few layout components as you'd like.

```astro {3} /</?MySiteLayout>/
---
// Example: src/pages/index.astro
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>My page content, wrapped in a layout!</p>
</MySiteLayout>
```

📚 Read more about [layout components](/en/core-concepts/layouts/) in Astro.

## Markdown/MDX Pages

Astro also treats any Markdown (`.md`) files inside of `src/pages/` as pages in your final website. If you have the [MDX Integration installed](/en/guides/integrations-guide/mdx/#installation), it also treats MDX (`.mdx`) files the same way. These are commonly used for text-heavy pages like blog posts and documentation.

Page layouts are especially useful for [Markdown files](#markdownmdx-pages). Markdown files can use the special `layout` front matter property to specify a [layout component](/en/core-concepts/layouts/) that will wrap their Markdown content in a full `<html>...</html>` page document.

```md {3}
---
# Example: src/pages/page.md
layout: '../layouts/MySiteLayout.astro'
title: 'My Markdown page'
---
# Title

This is my page, written in **Markdown.**
```

📚 Read more about [Markdown](/en/guides/markdown-content/) in Astro.


## File Routes

**File Routes** are script files that end with the `.js` or `.ts` extension and are located within the `src/pages/` directory. These can build non-HTML pages, like .json or .xml, or even assets such as images.

The `.js` or `.ts` extension will be removed during the build process. For example, `src/pages/data.json.ts` will be built to match the `/data.json` route. 

```js
// Example: src/pages/builtwith.json.ts
// Outputs: /builtwith.json

// File routes export a get() function, which gets called to generate the file.
// Return an object with `body` to save the file contents in your final build.
export async function get() {
  return {
    body: JSON.stringify({
      name: 'Astro',
      url: 'https://astro.build/',
    }),
  };
}
```

As API Routes, File Routes receive an `APIContext` object which contains [params](/en/reference/api-reference/#params) and a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request):

```ts title="src/pages/request-path.json.ts"
import type { APIContext } from 'astro';

export async function get({ params, request }: APIContext) {
  return {
    body: JSON.stringify({
      path: new URL(request.url).pathname
    })
  };
}
```

You can also write your API route functions using the `APIRoute` type. This will give you better error messages when your API route returns the wrong type:

```ts title="src/pages/request-path.json.ts"
import type { APIRoute } from 'astro';

export const get: APIRoute = ({ params, request }) => {
  return {
    body: JSON.stringify({
      path: new URL(request.url).pathname
    })
  };
};
```

You can optionally return an `encoding` option in static builds. It can be any valid [`BufferEncoding`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/bdd02508ddb5eebcf701fdb8ffd6e84eabf47885/types/node/buffer.d.ts#L169) accepted by node.js' `fs.writeFile` method. For example, to produce a binary png image using SSG:

```ts title="src/pages/image.png.ts" {7}
import type { APIRoute } from 'astro';

export const get: APIRoute = ({ params, request }) => {
  const buffer = ...;
  return {
    body: buffer.toString('binary'),
    encoding: 'binary',
  };
};

```

## HTML Pages

Files with the `.html` file extension can be placed in the `src/pages/` and used directly as pages on your site. Note that some key Astro features are not supported in [HTML Component](/en/core-concepts/astro-components/#html-components).

## Custom 404 Error Page

For a custom 404 error page, you can create a `404.astro` or `404.md` file in `/src/pages`.

This will build to a `404.html` page. Most [deploy services](/en/guides/deploy/) will find and use it.

