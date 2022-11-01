---
layout: ~/layouts/MainLayout.astro
title: Layouts
description: An intro to layouts, a type of Astro component that is shared between pages for common layouts.
i18nReady: true
---

**Layouts** are a special type of [Astro component](/en/core-concepts/astro-components/) useful for creating reusable page templates.

A layout component is conventionally used to provide an [`.astro` or `.md` page](/en/core-concepts/astro-pages/) both a **page shell** (`<html>`, `<head>` and `<body>` tags) and a `<slot />` to specify where in the layout page content should be injected.

Layouts often provide common `<head>` elements and common UI elements for the page such as headers, navigation bars and footers.

Layout components are commonly placed in a `src/layouts` directory in your project.

## Sample Layout

**`src/layouts/MySiteLayout.astro`**

```astro
---
---
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>My Cool Astro Site</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <nav>
      <a href="#">Home</a>
      <a href="#">Posts</a>
      <a href="#">Contact</a>
    </nav>
    <article>
      <slot /> <!-- your content is injected here -->
    </article>
  </body>
</html>
```

**`src/pages/index.astro`**

```astro {2} /</?MySiteLayout>/
---
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>My page content, wrapped in a layout!</p>
</MySiteLayout>
```


📚 Learn more about [slots](/en/core-concepts/astro-components/#slots).

## Markdown Layouts

Page layouts are especially useful for [Markdown files](/en/guides/markdown-content/#markdown-and-mdx-pages) which otherwise would not have any page formatting. 

Astro provides a special `layout` frontmatter property to specify which `.astro` component to use as the page layout.

```markdown title="src/pages/page.md" {2} 
---
layout: ../layouts/BaseLayout.astro
title: "Hello, World!"
author: "Matthew Phillips"
date: "09 Aug 2022"
---
All frontmatter properties are available as props to an Astro layout component.

The `layout` property is the only special one provided by Astro.

You can use it in both Markdown and MDX files located within `src/pages/`.

```

A typical layout for Markdown pages includes:

1. The `frontmatter` prop to access the Markdown or MDX page's frontmatter and other data. 
2. A default [`<slot />`](/en/core-concepts/astro-components/#slots) to indicate where the page's Markdown content should be rendered.

```astro /(?<!//.*){?frontmatter(?:\\.\w+)?}?/ "<slot />"
---
// src/layouts/BaseLayout.astro
// 1. The frontmatter prop gives access to frontmatter and other data
const { frontmatter } = Astro.props;
---
<html>
  <head>
    <!-- Add other Head elements here, like styles and meta tags. -->
    <title>{frontmatter.title}</title>
  </head>
  <body>
    <!-- Add other UI components here, like common headers and footers. -->
    <h1>{frontmatter.title} by {frontmatter.author}</h1>
    <!-- 2. Rendered HTML will be passed into the default slot. -->
    <slot />
    <p>Written on: {frontmatter.date}</p>
  </body>
</html>
```

You can set a layout’s [`Props` type](/en/guides/typescript/#component-props) with the `MarkdownLayoutProps` helper:

```astro title="src/layouts/BaseLayout.astro" ins={2,4-9}
---
import type { MarkdownLayoutProps } from 'astro';

type Props = MarkdownLayoutProps<{
  // Define frontmatter props here
  title: string;
  author: string;
  date: string;
}>;

// Now, `frontmatter`, `url`, and other Markdown layout properties
// are accessible with type safety
const { frontmatter, url } = Astro.props;
---
<html>
  <head>
    <meta rel="canonical" href={new URL(url, Astro.site).pathname}>
    <title>{frontmatter.title}</title>
  </head>
  <body>
    <h1>{frontmatter.title} by {frontmatter.author}</h1>
    <slot />
    <p>Written on: {frontmatter.date}</p>
  </body>
</html>
```

### Markdown Layout Props

:::note
Markdown and MDX files do not return identical `Astro.props` objects. See the MDX integration guide for [MDX properties exposed](/en/guides/integrations-guide/mdx/#exported-properties).
:::

A Markdown layout will have access to the following information via `Astro.props`:

- **`file`** - The absolute path of this file (e.g. `/home/user/projects/.../file.md`).
- **`url`** - If it's a page, the URL of the page (e.g. `/en/guides/markdown-content`).
- **`frontmatter`** - all frontmatter from the Markdown or MDX document.
  - **`frontmatter.file`** - The same as the top-level `file` property.
  - **`frontmatter.url`** - The same as the top-level `url` property.
- **`headings`** - A list of headings (`h1 -> h6`) in the Markdown document with associated metadata. This list follows the type: `{ depth: number; slug: string; text: string }[]`.
- **`rawContent()`** - A function that returns the raw Markdown document as a string.
- **`compiledContent()`** - A function that returns the Markdown document compiled to an HTML string.

An example blog post may pass the following `Astro.props` object to its layout:

```js
Astro.props = {
  file: "/home/user/projects/.../file.md",
  url: "/en/guides/markdown-content/",
  frontmatter: {
    /** Frontmatter from a blog post */
    title: "Astro 0.18 Release",
    date: "Tuesday, July 27 2021",
    author: "Matthew Phillips",
    description: "Astro 0.18 is our biggest release since Astro launch.",
    /** Generated values */
    file: "/home/user/projects/.../file.md",
    url: "/en/guides/markdown-content/"
  },
  headings: [
    {
      "depth": 1,
      "text": "Astro 0.18 Release",
      "slug": "astro-018-release"
    },
    {
      "depth": 2,
      "text": "Responsive partial hydration",
      "slug": "responsive-partial-hydration"
    }
    /* ... */
  ],
  rawContent: () => "# Astro 0.18 Release\nA little over a month ago, the first public beta [...]",
  compiledContent: () => "<h1>Astro 0.18 Release</h1>\n<p>A little over a month ago, the first public beta [...]</p>",
}
```

#### Example: Using one Layout for `.md`, `.mdx`, and `.astro` files

A single Astro layout can be written to receive the `frontmatter` object from `.md` (or `.markdown` etc.) and `.mdx` files, as well as any named props passed from `.astro` files.

In the example below, the layout will display the page title either from an Astro component passing a `title` attribute or from a frontmatter YAML `title` property:

```astro /{?title}?/ /Astro.props[.a-z]*/
---
// src/components/MyLayout.astro
const { title } = Astro.props.frontmatter || Astro.props;
---
<html>
  <head></head>
  <body>
    <h1>{title}</h1>
    <slot />
  </body>
</html>
```


📚 Learn more about Astro’s Markdown support in our [Markdown guide](/en/guides/markdown-content/).

## Nesting Layouts

Layout components do not need to contain an entire page worth of HTML. You can break your layouts into smaller components, and then reuse those components to create even more flexible, powerful layouts in your project.

For example, a common layout for blog posts may display a title, date and author. A `BlogPostLayout.astro` layout component could add this UI to the page and also leverage a larger, site-wide layout to handle the rest of your page.

**`src/layouts/BlogPostLayout.astro`**

```astro {2} /</?BaseLayout>/
---
import BaseLayout from './BaseLayout.astro'
const {frontmatter} = Astro.props;
---
<BaseLayout>
  <h1>{frontmatter.title}</h1>
  <h2>Post author: {frontmatter.author}</h2>
  <slot />
</BaseLayout>
```
