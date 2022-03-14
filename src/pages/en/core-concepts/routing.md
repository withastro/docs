---
layout: ~/layouts/MainLayout.astro
title: Routing
description: An intro to routing with Astro.
---

Astro uses **file-based routing** to generate your build URLs based on the file layout of your project `src/pages` directory. When a file is added to the `src/pages` directory of your project, it is automatically available as a route based on its filename.

## Static routes

Astro Components (`.astro`) and Markdown Files (`.md`) in the `src/pages` directory **automatically become pages on your website**. Each page’s route corresponds to its path and filename within the `src/pages` directory. 

```bash
# Example: Static routes
src/pages/index.astro        -> mysite.com/
src/pages/about.astro        -> mysite.com/about
src/pages/about/index.astro  -> mysite.com/about
src/pages/about/me.astro     -> mysite.com/about/me
src/pages/posts/1.md         -> mysite.com/posts/1
```

> 💡 There is no separate "routing config" to maintain in an Astro project. Static pages are created by placing files in the `/src/pages/` directory.

## Dynamic routes

A single Astro Page component can also specify dynamic route parameters in its filename to generate multiple routes that match a given criteria. You can create several related pages at once, such as author pages, or a page for each blog tag.

> 💡 Even dynamically-created pages and routes are generated at build time.

Astro pages that create dynamic routes must: 

1. use `[bracket]` notation to identify the dynamic parameters

2. export a `getStaticPaths()` function to specify exactly which paths will be pre-rendered by Astro.

```astro
// src/pages/dogs/[dog].astro
---
export function getStaticPaths() {
  const dogs = ["clifford", "rover", "spot"]; //array of routes to be generated

  return dogs.map((dog) => ({
    params: {
      dog,
    },
  }));
}
---

# routes generated:
mysite.com/dogs/clifford
mysite.com/dogs/rover
mysite.com/dogs/spot

```

📚 Learn more about [`getStaticPaths()`](/en/reference/api-reference#getstaticpaths).

### Named parameters

Routes can be generated from multiple named parameters, at any level of the filepath:

- `pages/blog/[slug].astro` → (`/blog/hello-world`, `/blog/post-2`, etc.)
- `pages/[username]/settings.astro` → (`/fred/settings`, `/drew/settings`, etc.)
- `pages/[lang]-[version]/info.astro` → (`/en-v1/info`, `/fr-v2/info`, etc.)

#### Requesting the parameters

Astro components that generate routes dynamically have acess to an `Astro.request.params` object for each route. This allows you to use those generated parts of the URL in your component script and template.

```astro
---
// Example: src/pages/posts/[id].astro
const { id } = Astro.request.params;
---
<p>Post: { id }</p>


// Astro.reqest.params object passed for the route `/post/abc`
{ "id": "abc" }
```

Multiple dynamic route segments can be combined to work the same way. 

```astro
---
// Example: src/pages/post/[id]/[comment].astro
const { id, comment } = Astro.request.params;
---

// Astro.reqest.params object passed for the route `/post/abc/a-comment`
{ "id": "abc", "comment": "a-comment" }
```

### Rest parameters

If you need more flexibility in your URL routing, you can use a rest parameter in your `.astro` filename as a universal catch-all for file paths of any depth by adding three dots (`...`) inside your brackets. 

For example:

- `pages/post/[...slug].astro` → (`/post/a`, `/post/a/b`, `/post/a/b/c`, etc.)

Matched parameters will be passed as a query parameter (`slug` in the example) to the page.

```json
// Astro.request.params object passed for the route `/post/a/b/c`
{ "slug": "a/b/c" }
```

> Rest parameters are optional by default, so `pages/post/[...slug].astro` could match `/post/` as well.

#### Example: Rest parameters

For a real-world example, you can implement GitHub’s file viewer with the following named and rest paramenters:

```
/[org]/[repo]/tree/[branch]/[...file]
```

In this example, a request for `/withastro/astro/tree/main/docs/public/favicon.svg` would result in the following parameters being available to the page:

```js
{
	org: 'withastro',
	repo: 'astro',
	branch: 'main',
	file: 'docs/public/favicon.svg'
}
```

## Caveats

Query requests for parameters will not necessarily match every existing route in your project.

Static routes without path params will take precedence over all other routes, and named path params over catch-all path params.

Consider the following project:

```
└── pages/
│       ├── posts/
│       │   ├── create.astro
│       │   ├── [pid].astro
│       │   └── [...slug].astro

```

  - `pages/post/create.astro` - Will match `/post/create`
  
  - `pages/post/[pid].astro` - Will match `/post/1`, `/post/abc`, etc. But not `/post/create`

  - `pages/post/[...slug].astro` - Will match `/post/1/2`, `/post/a/b/c`, etc. But not `/post/create`, `/post/abc`