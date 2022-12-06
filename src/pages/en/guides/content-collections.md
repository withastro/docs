---
layout: ~/layouts/MainLayout.astro
title: Content Collections (Experimental)
description: Content collections help organize your Markdown and type-check your frontmatter with schemas.
i18nReady: false
---

Content collections help organize your Markdown or MDX and type-check your frontmatter with schemas. You may reach for collections if you:
- Have a medium-to-large number of documents to manage and fetch (example: a blog with 50+ posts).
- Want to enforce frontmatter fields, and fail if fields are missing (example: every blog post should have a title and description).
- Plan to use content in multiple areas of your site (landing pages, footers, navigation, etc).

## Glossary

- **Schema:** a way to codify the "structure" of your data. In this case, frontmatter data
- **Collection:** a set of data that share a common schema. In this case, Markdown and MDX files
- **Entry:** A piece of data (Markdown or MDX file) belonging to a given collection

## The content directory

Content Collections introduce a new, reserved directory for Astro to manage: `{srcDir}/content/`. This directory is where all content collections and frontmatter schemas live.


## Creating a collection

All entries in `{srcDir}/content/` **must** be nested in a "collection" directory. This allows you to retrieve a collection of entries based on the directory name, and optionally enforce frontmatter types with a schema. Think of collections like database tables or content types in a CMS.

What this looks like in practice:

```bash
src/content/
  # All newsletters have the same frontmatter properties
  newsletters/
    week-1.md
    week-2.md
    week-3.md
  # All blog posts have the same frontmatter properties
  blog/
    columbia.md
    enterprise.md
    endeavour.md
```

### Organizing with nested directories

Collections are considered **one level deep**, so you cannot nest collections (or collection schemas) within other collections. However, we do allow nested directories to better organize your content. This is vital for certain use cases like internationalization:

```bash
src/content/
  docs/
    # docs schema applies to all nested directories 👇
    en/
    es/
    ...
```

All nested directories will share the same schema defined for the top-level collection, if any (**docs** in this example).

See [getting from nested directories](#getting-from-nested-directories) to see how folders are treated when retrieving collections.

## Adding a schema

Schemas are an optional way to enforce frontmatter types in a collection. To configure schemas, you can create a `src/content/config.{js|mjs|ts}` file. This file should:

1. `export` a `collections` object, with each object key corresponding to the collection's folder name. We will offer a `defineCollection` utility [similar to the `defineConfig` helper](/en/guides/configuring-astro/#the-astro-config-file) (see example below).
2. Use a [Zod object](https://github.com/colinhacks/zod#objects) to define schema properties. The `z` utility will be built-in and exposed by `astro:content`.

For instance, say every `blog/` entry should have a `title`, `slug`, a list of `tags`, and an optional `image` url. We can specify each object property like so [using Zod functions](https://github.com/colinhacks/zod):

```ts
// src/content/config.ts
import { z, defineCollection } from 'astro:content';

const blog = defineCollection({
  schema: {
    title: z.string(),
    slug: z.string(),
    // mark optional properties with `.optional()`
    image: z.string().optional(),
    tags: z.array(z.string()),
  },
});

export const collections = { blog };
```

You can also include dashes `-` in your collection name using a string as the key. For example, to configure the collection `src/content/my-newsletter`, you may do the following:

```ts
const myNewsletter = defineCollection({...});

export const collections = { 'my-newsletter': myNewsletter };
```

### Why Zod?

We chose [Zod](https://github.com/colinhacks/zod) since it offers key benefits over plain TypeScript types. Namely:
- specifying default values for optional fields using `.default()`
- checking the *shape* of string values with built-in regexes, like `.url()` for URLs and `.email()` for emails
- transforming a frontmatter value into another value, like parsing a publish date to [a `Date` object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date).

```ts
{
  // "language" is optional, with a default value of english
  language: z.enum(['es', 'de', 'en']).default('en'),
  // allow email strings only.
  // ex. "jeff" would fail to parse, but "hey@blog.biz" would pass
  authorContact: z.string().email(),
  // allow url strings only.
  // ex. "/post" would fail, but `https://blog.biz/post` would pass
  canonicalURL: z.string().url(),
  // parse publishDate as a browser-standard Date object
  // ex. "Bananaday" would fail to parse, but "2022-10-10" would pass
  publishDate: z.string().transform(str => new Date(str)),
}
```

You can [browse Zod's documentation](https://github.com/colinhacks/zod) for a complete rundown of features.

### Zod quick reference

YAML covers strings, booleans, numbers, objects, and arrays. Here's a quick cheatsheet for each of those:

```ts
import { z, defineCollection } from 'astro:content';

defineCollection({
  schema: {
    // Boolean
    isDraft: z.boolean(),
    // String
    title: z.string(),
    // Number
    sortOrder: z.number(),
    // Array - Note array(...) is a wrapper around the type each element
    tags: z.array(z.string()),
    // Enum - Pass array of exact values that are supported, of any type
    language: z.enum(['en', 'es']),
    // Object
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
  }
})
```

See the [**Why Zod?** example](#why-zod) above for Zod-specific features like defaults and transforms.

## Getting content

Astro provides 2 functions to query collections:

- `getCollection` - get all entries in a collection, or based on a filter
- `getEntry` - get a specific entry in a collection by file name

These functions will have typed based on collections that exist. In other words, `getCollection('banana')` will raise a type error if there is no `src/content/banana/`.

```astro
---
import { getCollection, getEntry } from 'astro:content';
// Get all `blog` entries
const allBlogPosts = await getCollection('blog');
// Filter blog posts by entry properties
const draftBlogPosts = await getCollection('blog', ({ id, slug, data }) => {
  return data.status === 'draft';
});
// Get a specific blog post by file name
const enterprise = await getEntry('blog', 'enterprise.md');
---
```

### Return type

Assume the `blog` collection schema looks like this:

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: {
    title: z.string(),
    slug: z.string(),
    image: z.string().optional(),
    tags: z.array(z.string()),
  },
});

export const collections = { blog };
```

`await getCollection('blog')` will return entries of the following type:

```ts
{
  // parsed frontmatter
  data: {
    title: string;
    slug: string;
    image?: string;
    tags: string[];
  };
  // unique identifier file path relative to src/content/[collection]
  // example below would reflect the file names in your project
  id: 'file-1.md' | 'file-2.md' | ...;
	// URL-ready slug computed by stripping the file extension from `id`
	slug: 'file-1' | 'file-2' | ...;
  // raw body of the Markdown or MDX document
  body: string;
}
```

:::note
The `body` is the *raw* content of the file. This ensures builds remain performant by avoiding expensive rendering pipelines. See [“Moving to `src/pages/`"](#mapping-to-srcpages) to understand how a `<Content />` component could be used to render this file, and pull in that pipeline only where necessary.
:::

### Getting from nested directories

[As noted earlier](#organizing-with-nested-directories), you may organize entries into directories as well. The result will **still be a flat array** when getting a collection via `getCollection`, with the nested directory reflected in an entry’s `id`:

```ts
const docsEntries = await getCollection('docs');
console.log(docsEntries)
/*
[
	{ id: 'en/getting-started.md', slug: 'en/getting-started', data: {...} },
	{ id: 'en/structure.md', slug: 'en/structure', data: {...} },
	{ id: 'es/getting-started.md', slug: 'es/getting-started', data: {...} },
	{ id: 'es/structure.md', slug: 'es/structure', data: {...} },
	...
]
*/
```

To fetch from a specific directory **within** a collection, Astro recommends `getCollection` with a filter:

```astro
---
import { getCollection } from 'astro:content';

const enDocs = await getCollection('docs', ({ id }) => {
  // Where `id` is 'en/page-1.md' | 'en/page-2.md' | ...
  return id.startsWith('en');
});
---
```

## Rendering content with `renderEntry`

You may need to render the contents of these Markdown and MDX entries as well. This is especially useful when generating live URLs from your content entries (see [Generating pages from content collections](#generating-pages-from-content-collections)). 

You can retrieve a `Content` component for use in your Astro files with `renderEntry`:

```astro
---
const { getEntry } from 'astro:content';

const announcementPost = await getEntry('announcements', 'welcome.md');
// Pass a `getEntry` result or `getCollection` array item:
const { Content } = await renderEntry(announcementPost);
// Or pass a valid ID and collection name individually:
const { Content } = await renderEntry({
  id: announcementPost.id,
  collection: announcementPost.collection,
});
---

<h1>{announcementPost.data.title}</h1>
<Content />
```

This example will render the contents of `welcome.md`.

### Access content headings

Astro [generates a list of headings](/en/guides/markdown-content/#exported-properties) for Markdown and MDX documents. You can access this list using the `headings` property from `renderEntry`:

```astro
---
import { getCollection, renderEntry } from 'astro:content';
const blogPosts = await getCollection('blog');
---

{blogPosts.map(async (post) => {
  const {
    headings, // result of `getHeadings`
  } = await renderEntry(post);
  const { readingTime } = injectedFrontmatter;
  const h1 = headings.find(h => h.depth === 1);
  
  return <p>{h1} - {readingTime} min read</p>
})}
```

### Access injected frontmatter

Astro allows you to [inject frontmatter using remark or rehype plugins.](/en/guides/markdown-content/#example-injecting-frontmatter) You can access these values using the `injectedFrontmatter` property from `renderEntry`:

```astro
---
import { getCollection, renderEntry } from 'astro:content';
const blogPosts = await getCollection('blog');
---

{blogPosts.map(post => {
  const {
    injectedFrontmatter, // all properties injected via remark
  } = renderEntry(post);
  const { readingTime } = injectedFrontmatter;
  const h1 = headings.find(h => h.depth === 1);
  
  return <p>{h1} - {readingTime} min read</p>
})
```

Assuming `readingTime` was injected ([see our reading time example](/en/guides/markdown-content/#example-calculate-reading-time)), all properties should be available here.

<details>
<summary>**🙋 Why don't `getCollection` and `getEntry` contain these values?**</summary>

The remark and rehype pipelines are only run when your content is **rendered.** This lets `renderEntry` access anything generated by these plugins like injected frontmatter. To stay performant, `getCollection` and `getEntry` do not have this capability.

</details>

## Generating pages from content collections

You might map content collections to live URLs on your site. This should be  similar to globbing directories outside of `src/pages/`, [using `getStaticPaths` to generate routes dynamically.](/en/core-concepts/routing/#dynamic-routes)

Say you have a `docs` collection subdivided by locale like so:

```bash
src/content/
	docs/
		en/
			getting-started.md
			...
		es/
			getting-started.md
			...
```

You may want all `docs/` entries to be mapped onto pages, with those nested directories respected as nested URLs. You can do the following with `getStaticPaths`:

```tsx
// src/pages/docs/[...slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
	const blog = await getCollection('docs');
	return blog.map(entry => ({
    // Where `entry.slug` is `en/getting-started` | `es/getting-started` | ...
		params: { slug: entry.slug },
	}));
}
```

This will generate routes for every entry in our collection, mapping each entry slug (a path relative to `src/content/docs/`) to a URL. This example will generate:
- `/docs/en/getting-started`
- `/docs/es/getting-started`

...and so on.

## Landing page example

Say you're building a landing page for your collection of blog posts:

```bash
src/content/
  blog/
    enterprise.md
    columbia.md
    endeavour.md
```

Each blog post has required and optional fields you'd like to type-check. You can add a `src/content/config.ts` file and configure the `blog` collection like so:

```ts
// src/content/config.ts
import { z, defineCollection } from 'astro:content';

const blog = defineCollection({
  schema: {
    title: z.string(),
    slug: z.string(),
    tags: z.array(z.string()),
    status: z.enum(['draft', 'published']).default('draft'),
    publishedDate: z.string().transform((str) => new Date(str)),
  },
});

export const collections = { blog };
```

Now, you can use `getCollection` to retrieve type-safe frontmatter and slugs to use as links:

```astro
---
// src/pages/index.astro
import { getCollection, getEntry } from 'astro:content';

// Get all published blog posts
const blogPosts = await getCollection('blog', ({ data }) => {
  return data.status === 'published';
});
---

<ul>
  {allBlogPosts.map(post => (
    <li>
      {/* Access frontmatter properties with `.data` */}
      <a href={post.data.slug}>{post.data.title}</a>
      {/* Each property is type-safe, */}
      {/* so expect nice autocomplete and red squiggles here! */}
      <time datetime={post.data.publishedDate.toISOString()}>
        {post.data.publishedDate.toDateString()}
      </time>
    </li>
  ))}
</ul>
```
