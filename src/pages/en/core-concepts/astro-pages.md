---
layout: ~/layouts/MainLayout.astro
title: Pages
description: An introduction to Astro pages
i18nReady: true
---

**Pages** are a special type of [Astro component](/en/core-concepts/astro-components) that live in the `src/pages/` subdirectory. They are responsible for handling routing, data loading, and overall page layout for every HTML page in your website.

### File-based routing

Astro leverages a routing strategy called **file-based routing.** Every `.astro` file in your `src/pages` directory becomes a page or an endpoint on your site based on its file path.

📚 Read more about [Routing in Astro](/en/core-concepts/routing)

### Page HTML

Astro Pages must return a full `<html>...</html>` page response, including `<head>` and `<body>`. (`<!doctype html>` is optional, and will be added automatically.)

```astro
---
// Example: src/pages/index.astro
---
<html>
  <head>
    <title>My Homepage</title>
  </head>
  <body>
    <h1>Welcome to my website!</h1>
  </body>
</html>
```

### Leveraging Page Layouts

To avoid repeating the same HTML elements on every page, you can move common `<head>` and `<body>` elements into your own [layout components](/en/core-concepts/layouts). You can use as many or as few layout components as you'd like.

```astro
---
// Example: src/pages/index.astro
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>My page content, wrapped in a layout!</p>
</MySiteLayout>
```

📚 Read more about [layout components](/en/core-concepts/layouts) in Astro.


## Markdown Pages

Astro also treats any Markdown (`.md`) files inside of `/src/pages/` as pages in your final website. These are commonly used for text-heavy pages like blog posts and documentation. 

Page layouts are especially useful for [Markdown files.](#markdown-pages) Markdown files can use the special `layout` front matter property to specify a [layout component](/en/core-concepts/layouts) that will wrap their Markdown content in a full `<html>...</html>` page document. 

```md
---
# Example: src/pages/page.md
layout: '../layouts/MySiteLayout.astro'
title: 'My Markdown page'
---
# Title

This is my page, written in **Markdown.**
```

📚 Read more about [Markdown](/en/guides/markdown-content) in Astro.


## Non-HTML Pages

Non-HTML pages, like `.json` or `.xml`, or even assets such as images, can be built using API routes commonly referred to as **File Routes**. 

**File Routes** are script files which end with the `.js` or `.ts` extension, eith the source file must exist within the `src/pages/` directory.

Built filenames and extensions are based on the source file's name, ex: `src/pages/data.json.ts` will be built to match the `/data.json` route in your final build.

In SSR (server-side rendering) the extension does not matter and can be omitted, this is because no files are generated at build time instead Astro generates a single server file instead.

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

API Routes receive an `APIContext` object which contains [params](/en/reference/api-reference/#params) and a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request):

```ts
import type { APIContext } from 'astro';

export async function get({ params, request }: APIContext) {
  return {
    body: JSON.stringify({
      path: new URL(request.url).pathname
    })
  };
}
```

Optionally you can also type your API route functions using the `APIRoute` type. This will give you better error messages when your API route returns the wrong type:

```ts
import type { APIRoute } from 'astro';

export const get: APIRoute = ({ params, request }) => {
  return {
    body: JSON.stringify({
      path: new URL(request.url).pathname
    })
  };
};
```

## Custom 404 Error Page

For a custom 404 error page, you can create a `404.astro` file in `/src/pages`. 

This will build to a `404.html` page. Most [deploy services](/en/guides/deploy) will find and use it.
