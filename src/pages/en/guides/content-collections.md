---
layout: ~/layouts/MainLayout.astro
title: Content Collections (Experimental)
description: Content collections help organize your Markdown and type-check your frontmatter with schemas.
i18nReady: false
---

Content collections help organize your Markdown or MDX and type-check your frontmatter with schemas. Collections may be helpful if you:

- **Plan to use Markdown content in multiple areas** of your site (landing pages, footers, navigation, etc).
- **Have a growing number of documents** to manage and fetch (e.g. a blog with 20+ posts).
- **Want Astro to enforce frontmatter fields,** and fail if fields are missing (e.g. every blog post should have a title and description).

## The content directory

Astro treats the `src/content/` directory as special. This is where **collections** (folders) of Markdown/MDX **entries** (files) can be stored, with a single configuration file to define each collection's **schema** (frontmatter data types and shape). Files other than your `.md`/`.mdx` content are not permitted inside `src/content/`.

## Collections

A collection is a directory in `src/content/` containing Markdown or MDX fields. Every Markdown or MDX file in `src/content/` **must** belong to a collection directory, since Astro [provides built-in functions](#querying-content-collections) for querying your content by the collection directory name. 

Content within a collection should share the same frontmatter shape and types. You can optionally enforce these types [by configuring a schema](/en/guides/content-collections/#defining-a-collection-schema).

To create a collection, add a new directory to `src/content/`. Then, add Markdown or MDX entries that share frontmatter properties. The following example shows two collections: `blog` and `newsletter`. 

```bash "newsletter/" "blog/"
src/content/
│   # All blog posts have the same frontmatter properties
├── blog/
│   ├── columbia.md
│   ├── endeavour.md
│   └── enterprise.md
│   # All newsletters have the same frontmatter properties
└── newsletter/
    ├── week-1.md
    ├── week-2.md
    └── week-3.md
```

### Collections with nested directories

Collections are **top-level folders** within `src/content/`. You cannot nest collections, but you may use nested directories within a collection to better organize a collection's content. All nested directories will share the same schema defined for the top-level collection.

For example, you can use this structure for internationalization:

```bash
src/content/
└── docs/
    │   # docs schema applies to all nested directories 👇
    ├── en/
    ├── es/
    └── ...
```


## Defining a collection schema

Schemas are an optional way to enforce frontmatter types in a collection. Astro uses [Zod](https://github.com/colinhacks/zod) to validate your frontmatter with schemas in the form of [Zod objects](https://github.com/colinhacks/zod#objects).

To configure schemas, create a `src/content/config.ts` file (`.js` and `.mjs` extensions are also supported). This file should:

1. Import the `defineCollection` and `z` utilities from `astro:content`. 
2. Define a `schema` for each collection.
2. Export a single `collections` object, with each object key corresponding to the collection's folder name.

For example, say you maintain two collections: one for release announcements and one for blog content. Your entries at `src/content/announcements` should include a `title` and `version`.  Your `src/content/engineering-blog/` collection entries should have a `title`, list of `tags`, and an optional `image` URL. 

You can specify each expected property in the `schema` field of `defineCollection`:

```ts
// src/content/config.ts
import { z, defineCollection } from 'astro:content';

const releases = defineCollection({
  schema: {
    title: z.string(),
    version: z.number(),
  },
});

const engineeringBlog = defineCollection({
  schema: {
    title: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
  },
});

export const collections = {
	releases: releases,
  // Don't forget 'quotes' for collection names containing dashes
  'engineering-blog': engineeringBlog,
};
```

### Schema data types with Zod

Markdown and MDX frontmatter can contain booleans, strings, numbers, objects, and arrays. When defining a schema, you must include every frontmatter property along with its data type. To define and validate this schema, we use a library called [Zod](https://github.com/colinhacks/zod), which is available via the `z` import.

You can extend any of these types with `.optional()` if a frontmatter property is not always required or `.defaultValue(value)` to provide a value to use when the property is not set in frontmatter. If only a limited set of values is valid for a property, you can specify these using [the `.enum()` method](https://github.com/colinhacks/zod#zod-enums).

The following schema illustrates each of these data types in use:

```ts
import { z, defineCollection } from 'astro:content';

defineCollection({
  schema: {
    isDraft: z.boolean(),
    title: z.string(),
    sortOrder: z.number(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    tags: z.array(z.string()), // An array of strings
    footnote: z.string().optional(),
    author: z.string().default('Anonymous'),
    language: z.enum(['en', 'es']),
  }
})
```

### Advanced schema features

You can use all of Zod’s properties and methods with content schemas. This includes transforming a frontmatter value into another value, checking the shape of string values with built-in regexes, and more.

```ts
{
  // Allow only strings representing email addresses
  authorContact: z.string().email(),
  // Allow URL strings only (e.g. `https://example.com`)
  canonicalURL: z.string().url(),
  // Parse publishDate as a browser-standard `Date` object
  publishDate: z.string().transform(str => new Date(str)),
}
```

📚 See [Zod’s documentation](https://github.com/colinhacks/zod) for a complete list of features.

## Querying content collections

Astro provides two functions to query collections:

### `getCollection()`

`getCollection()` returns multiple entries in a collection. It requires the name of a `collection` as a parameter.  By default, it returns all items in the collection.

It can also take a second, optional parameter: a filter function based on schema properties. This allows you to query for only some items in a collection based on `id`, `slug`, or frontmatter values via the `data` object.

```astro
---
import { getCollection } from 'astro:content';

// Get all `src/content/blog/` entries
const allBlogPosts = await getCollection('blog');

// Only return posts with `draft: true` in the frontmatter
const draftBlogPosts = await getCollection('blog', ({ data }) => {
  return data.draft === true;
});
---
```

#### Querying nested directories

The filter function can also be used to query for nested directories within a collection. Since the `id` includes the full nested path, you can filter by the start of each `id` to only return items from a specific nested directory:

```astro
---
import { getCollection } from 'astro:content';
const enDocs = await getCollection('docs', ({ id }) => {
  // Return all entries in `src/content/docs/en/`
  return id.startsWith('en/');
});
---
```

### `getEntry()`

`getEntry()` is function that returns a specific entry in a collection by entry ID (file path relative to the collection). Both of these are required parameters.

```astro
---
import { getEntry } from 'astro:content';

const enterprise = await getEntry('blog', 'enterprise.md');
---
```

### Data returned from a collection query

`getCollection()` and `getEntry()` will return entries that include:
 - `id` - a unique ID using the file path relative to `src/content/[collection]`
 - `slug` - a URL-ready slug. Defaults to the ID without the file extension.
 - `data` - an object of frontmatter properties inferred from your collection schema. Defaults to `any` if no schema is configured.
 - `body` - a string containing the raw, uncompiled body of the Markdown or MDX document.

Querying your content files with `getCollection()`or `getEntry()` allows you to use frontmatter properties from an entry's `data` object in [JSX-like expressions](/en/core-concepts/astro-components/#jsx-like-expressions) or pass props to other components, such as a layout. You can optionally add type safety with a built-in utility.

For example, you can use a `getCollection()` query to filter and then display a list of links to all your published blog posts:
```astro
---
// src/pages/index.astro
import { getCollection } from 'astro:content';

// Get all published blog posts
const blogPosts = await getCollection('blog', ({ data }) => {
  return data.status === 'published';
});
---
<ul>
  {allBlogPosts.map(post => (
    <li>
      <a href={post.data.slug}>{post.data.title}</a>
      <time datetime={post.data.publishedDate.toISOString()}>
        {post.data.publishedDate.toDateString()}
      </time>
    </li>
  ))}
</ul>
```

### Collection entry types

If a page or component uses content from a `getCollection()` or `getEntry()` query, you can use the `CollectionEntry` utility to type its props:

```astro /CollectionEntry([<.+>])?/
---
// src/components/BlogCard.astro
import type { CollectionEntry } from 'astro:content';

interface Props {
  // Get type of a `blog` collection entry
  post: CollectionEntry<'blog'>;
}

// `post.data` will match your collection schema
const { post } = Astro.props;
---
```

## Rendering page content from entries

To render the content of your Markdown and MDX entries, use the `<Content />` component returned by the `renderEntry()` function. This allows you to generate pages from your content entries (see [Generating pages from content collections](#generating-pages-from-content-collections)), add post previews to your homepage, or display your content elsewhere on your site.

### `renderEntry()`

`renderEntry()` is a function that takes an entry retrieved by `getEntry()` as a parameter and returns a `<Content />` component containing the rendered content of the Markdown or MDX file. 

For example, this page renders the contents of `content/announcements/welcome.md` and uses some of its frontmatter properties:

```astro "renderEntry"
---
// src/pages/welcome-announcement.astro
import Layout from '../../layouts/Layout.astro';
import { renderEntry, getEntry } from 'astro:content';
const announcementPost = await getEntry('announcements', 'welcome.md');
const { Content } = await renderEntry(announcementPost);
---
<Layout>
    <h1>{announcementPost.data.title}</h1>
    <p>Written by: {announcementPost.data.author}</p>
    <Content />
</Layout>
```

### Access content headings from `renderEntry()`

Astro [generates a list of headings](/en/guides/markdown-content/#exported-properties) for Markdown and MDX documents. You can access this list using the `headings` property from `renderEntry()`:

```astro "{ headings }"
---
import { getCollection, renderEntry } from 'astro:content';
const blogPosts = await getCollection('blog');
---

{blogPosts.map(async (post) => {
  const { headings } = await renderEntry(post);
  const h1 = headings.find(h => h.depth === 1);
  return <p>{h1}</p>
})}
```

### Access injected frontmatter from `renderEntry()`

Astro allows you to [inject frontmatter using remark or rehype plugins.](/en/guides/markdown-content/#example-injecting-frontmatter) You can access these values using the `injectedFrontmatter` property from `renderEntry()`:

```astro "{ injectedFrontmatter }"
---
import { getCollection, renderEntry } from 'astro:content';
const blogPosts = await getCollection('blog');
---

{blogPosts.map(async (post) => {
  const { injectedFrontmatter } = await renderEntry(post);
  return <p>{post.data.title} — {injectedFrontmatter.readingTime}</p>
})}
```

Assuming `readingTime` was injected ([see our reading time example](/en/guides/markdown-content/#example-calculate-reading-time)), it will be available on the `injectedFrontmatter` object.

<details>
<summary>**🙋 Why don't `getCollection` and `getEntry` contain these values?**</summary>

The remark and rehype pipelines are only run when your content is **rendered.** This lets `renderEntry()` access anything generated by these plugins like injected frontmatter. To stay performant, `getCollection()` and `getEntry()` do not have this capability.

</details>

## Generating pages from content collections

You can create pages based on your content collections using [dynamic routes](/en/core-concepts/routing/#dynamic-routes). 

Use `getCollection()` inside a [`getStaticPaths()`](/en/reference/api-reference/#getstaticpaths) function to query your content entries and provide the `slug` parameter for each page. 

For example, you can dynamically create a page for each entry in a `blog` collection, including nested directories, by creating a `.astro` page with a [rest parameter in its filename](/en/core-concepts/routing/#rest-parameters) to match file paths of any depth.

	```astro "{ slug: entry.slug }"
	---
	// src/pages/posts/[...slug].astro
	import { getCollection } from 'astro:content';
	
	export async function getStaticPaths() {
	  const blog = await getCollection('blog');
	  return blog.map(entry => ({
	    params: { slug: entry.slug },
	  }));
	}
	---
	```

This will generate page routes for every entry in the `blog` collection, mapping each entry’s slug to a URL. For example, an entry at `src/content/blog/hello-world.md` will have a slug of `hello-world` and the collection entry `src/content/blog/en/intro.md` will have a slug of `en/intro`.

Because this dynamic route is in `src/pages/posts/`, the final URLs will be `/posts/hello-world/` and `/posts/en/intro/`.

### Rendering post contents

When you pass each page route an entry via `props` in your `getStaticPaths()` function, you have access to the entry from `Astro.props`. You can use its frontmatter values via the `data` object and use `renderEntry()` to render its content via a `<Content /> component. You can optionally add type safety using the `CollectionEntry` utility.

```astro "renderEntry" "props: entry"
---
// src/pages/blog/[...slug].astro
import { getCollection, renderEntry, CollectionEntry } from 'astro:content';

export async function getStaticPaths() {
  const docs = await getCollection('docs');
  return docs.map(entry => ({
    // Pass blog entry via props
    params: { slug: entry.slug, props: { entry } },
  }));
}

interface Props {
  // Optionally use `CollectionEntry` for type safety
  entry: CollectionEntry<'docs'>;
}

const { entry } = Astro.props;
const { Content } = await renderEntry(entry);
---

<h1>{entry.data.title}</h1>
<Content />
```
