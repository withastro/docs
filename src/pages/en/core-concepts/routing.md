---
layout: ~/layouts/MainLayout.astro
title: Routing
description: An intro to routing with Astro.
---

Astro uses **file-based routing** to generate your build URLs based on the file layout of your project `src/pages/` directory. When a file is added to the `src/pages` directory of your project, it is automatically available as a route based on its filename.

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

A single Astro Page component can also specify dynamic route parameters in its filename to generate multiple routes that match a given criteria. You can create several related pages at once, such as author pages, or a page for each blog tag. Named parameters allow you to specify values for "named" levels of these route paths, and rest parameters allow for more flexible "catch-all" routes.

> 💡 Even dynamically-created pages and routes are generated at build time.

Astro pages that create dynamic routes must: 

1. use `[bracket]` notation to identify the dynamic parameters

2. export a `getStaticPaths()` function to specify exactly which paths will be pre-rendered by Astro.


### Named Parameters

You can generate routes with a `[named]` parameter by providing your `getStaticPaths()` function the values to use like so: 

```astro
---
// src/pages/dogs/[dog].astro

export function getStaticPaths() {
  return [
    // Generates: /dogs/clifford
    {params: {dog: 'clifford'}},
    // Generates: /dogs/rover
    {params: {dog: 'rover'}},
    // Generates: /dogs/spot
    {params: {dog: 'spot'}},
  ];
}
---
```

📚 Learn more about [`getStaticPaths()`](/en/reference/api-reference#getstaticpaths).

Routes can be generated from multiple named parameters, at any level of the filepath:

- `pages/blog/[slug].astro` → (`/blog/hello-world`, `/blog/post-2`, etc.)
- `pages/[username]/settings.astro` → (`/fred/settings`, `/drew/settings`, etc.)
- `pages/[lang]-[version]/info.astro` → (`/en-v1/info`, `/fr-v2/info`, etc.)

#### The `Astro.request.params` obect

Astro components that generate routes dynamically have acess to an `Astro.request.params` object for each route. This allows you to use those generated parts of the URL in your component script and template.

```astro
---
// Example: src/pages/posts/[id].astro
const { id } = Astro.request.params;
---
<p>Post: { id }</p>


// Astro.request.params object passed for the route `/post/abc`
{ "id": "abc" }
```

Multiple dynamic route segments can be combined to work the same way. 

```astro
---
// Example: src/pages/post/[id]/[comment].astro
const { id, comment } = Astro.request.params;
---

// Astro.request.params object passed for the route `/post/abc/a-comment`
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

### Caveats

Query requests for parameters will not necessarily match every existing route in your project.

Static routes without path params will take precedence over all other routes, and will not match queries for dynamic path params. Similarly, named path routes take precedence over catch-all routes, and will not match queries for catch-all path params.

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
- `pages/post/[...slug].astro` - Will match `/post/1/2`, `/post/a/b/c`, etc. But not `/post/create`, `/post/1`, `/post/abc`

## Pagination

Astro supports built-in, automatic pagination for large collections of data that need to be split into multiple pages. Astro will automatically include pagination metadata for things like previous/next page URL, total number of pages, and more.

```astro
---
// Example: Using paginate() in a dynamic route
export async function getStaticPaths({ paginate }) {
  // Load your data:
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=150`);
  const result = await response.json();
  const allPokemon = result.results;
  // Return a paginated collection of routes:
  return paginate(allPokemon, { pageSize: 10 });
}
// The paginated data is passed as a prop to each page.
const { page } = Astro.props;
---
<!-- ... -->
```

Pagination is useful when you need to generate multiple, numbered pages from a larger data set:

- `/posts/1` (Page 1: Displays posts 1-10)
- `/posts/2` (Page 2: Displays posts 11-20)
- `/posts/3` (Page 3: Displays posts 21-30)


### The `page` prop

When you use the `paginate()` function, each page in the collection will be passed its data via a `page` prop. The `page` prop has several useful properties, but the most important one is `page.data`. This is the array containing the page’s slice of data that you passed to the `paginate()` function. 

```astro
---
// Example: Using the paginated `page` prop
export async function getStaticPaths() { /* ... */ }
const { page } = Astro.props;
---
<h1>Page {page.currentPage}</h1>
<ul>
  {page.data.map(item => <li>{item.title}</li>)}
</ul>
```


The `page` prop also includes other helpful metadata, like `page.url.next`, `page.url.prev`, `page.total`, and more.

```ts
interface Page<T = any> {
	/** result */
	data: T[];
	/** metadata */
	/** the count of the first item on the page, starting from 0 */
	start: number;
	/** the count of the last item on the page, starting from 0 */
	end: number;
	/** total number of results */
	total: number;
	/** the current page number, starting from 1 */
	currentPage: number;
	/** number of items per page (default: 25) */
	size: number;
	/** number of last page */
	lastPage: number;
	url: {
		/** url of the current page */
		current: string;
		/** url of the previous page (if there is one) */
		prev: string | undefined;
		/** url of the next page (if there is one) */
		next: string | undefined;
	};
}
```

## Nested Pagination

A more advanced use-case for pagination is **nested pagination.** This is when pagination is combined with other dynamic route params. You can use nested pagination to group your paginated collection by some property or tag.

For example, if you want to group your paginated markdown posts by some tag, you would use nested pagination by creating a `/src/pages/[tag]/[page].astro` page that would match the following URLS:

- `/red/1` (tag=red)
- `/red/2` (tag=red)
- `/blue/1` (tag=blue)
- `/green/1` (tag=green)

Nested pagination works by returning an array of `paginate()` results from `getStaticPaths()`, one for each grouping. 

In the following example, we will implement nested pagination to build the URLs listed above:

```astro
---
// Example: /src/pages/[tag]/[page].astro
export function getStaticPaths({paginate}) {
  const allTags = ['red', 'blue', 'green'];
  const allPosts = Astro.fetchContent('../../posts/*.md');
  // For every tag, return a paginate() result.
  // Make sure that you pass `{params: {tag}}` to `paginate()`
  // so that Astro knows which tag grouping the result is for.
  return allTags.map((tag) => {
    const filteredPosts = allPosts.filter((post) => post.tag === tag);
    return paginate(filteredPosts, {
      params: { tag },
      pageSize: 10
    });
  });
}
const { page } = Astro.props;
const { params } = Astro.request;
```
