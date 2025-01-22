---
title: Layouts
description: An introduction to layouts in Astro.
i18nReady: true
---

import ReadMore from '~/components/ReadMore.astro'

**Layouts** are [Astro components](/en/basics/astro-components/) used to provide a reusable UI structure, such as a page template.

We conventionally use the term "layout" for Astro components that provide common UI elements shared across pages such as headers, navigation bars, and footers. A typical Astro layout component provides [Astro, Markdown or MDX pages](/en/basics/astro-pages/) with:
- a **page shell** (`<html>`, `<head>` and `<body>` tags)
- a [**`<slot />`**](/en/basics/astro-components/#slots) to specify where individual page content should be injected.

 But, there is nothing special about a layout component! They can [accept props](/en/basics/astro-components/#component-props) and [import and use other components](/en/basics/astro-components/#component-structure) like any other Astro component. They can include [UI frameworks components](/en/guides/framework-components/) and [client-side scripts](/en/guides/client-side-scripts/). They do not even have to provide a full page shell, and can instead be used as partial UI templates.

However, if a layout component does contain a page shell, its `<html>` element must be the parent of all other elements in the component.

Layout components are commonly placed in a `src/layouts` directory in your project for organization, but this is not a requirement; you can choose to place them anywhere in your project. You can even colocate layout components alongside your pages by [prefixing the layout names with `_`](/en/guides/routing/#excluding-pages).

## Sample Layout

```astro "<slot />" 
---
// src/layouts/MySiteLayout.astro
import BaseHead from '../components/BaseHead.astro';
import Footer from '../components/Footer.astro';
const { title } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <BaseHead title={title}/>
  </head>
  <body>
    <nav>
      <a href="#">Home</a>
      <a href="#">Posts</a>
      <a href="#">Contact</a>
    </nav>
    <h1>{title}</h1>
    <article>
      <slot /> <!-- your content is injected here -->
    </article>
    <Footer />
  </body>
  <style>
    h1 {
      font-size: 2rem;
    }
  </style>
</html>
```

```astro title="src/pages/index.astro"
---
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout title="Home Page">
  <p>My page content, wrapped in a layout!</p>
</MySiteLayout>
```

<ReadMore>Learn more about [slots](/en/basics/astro-components/#slots).</ReadMore>

## Using TypeScript with layouts

Any Astro layout can be modified to introduce type safety & autocompletion by providing the types for your props:

```astro ins={2-7} title="src/components/MyLayout.astro"
---
interface Props { 
  title: string;
  description: string;
  publishDate: string;
  viewCount: number;
}
const { title, description, publishDate, viewCount } = Astro.props;
---
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="description" content={description}>
    <title>{title}</title>
  </head>
  <body>
    <header>
      <p>Published on {publishDate}</p>
      <p>Viewed by {viewCount} folks</p>
    </header>
    <main>
      <slot />
    </main>
  </body>
</html>
```

## Markdown Layouts

Page layouts are especially useful for individual Markdown pages which otherwise would not have any page formatting. 

Astro provides a special `layout` frontmatter property intended for [individual `.md` files located within `src/pages/` using file-based routing](/en/guides/markdown-content/#individual-markdown-pages) to specify which `.astro` component to use as the page layout. This component allows you to provide `<head>` content like meta tags (e.g. `<meta charset="utf-8">`) and styles for the Markdown page. By default, this specified component can automatically access data from the Markdown file.

This is not recognized as a special property when using [content collections](/en/guides/content-collections/) to query and render your content.

```markdown title="src/pages/page.md" {2} 
---
layout: ../layouts/BlogPostLayout.astro
title: "Hello, World!"
author: "Matthew Phillips"
date: "09 Aug 2022"
---
All frontmatter properties are available as props to an Astro layout component.

The `layout` property is the only special one provided by Astro.

You can use it in Markdown files located within `src/pages/`.

```

A typical layout for a Markdown page includes:

1. The `frontmatter` prop to access the Markdown page's frontmatter and other data. 
2. A default [`<slot />`](/en/basics/astro-components/#slots) to indicate where the page's Markdown content should be rendered.

```astro title="src/layouts/BlogPostLayout.astro" /(?<!//.*){?frontmatter(?:\\.\w+)?}?/ "<slot />"
---
// 1. The frontmatter prop gives access to frontmatter and other data
const { frontmatter } = Astro.props;
---
<html>
  <head>
    <!-- Add other Head elements here, like styles and meta tags. -->
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="utf-8">
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

```astro title="src/layouts/BlogPostLayout.astro" ins={2,4-9}
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
    <meta charset="utf-8">
    <link rel="canonical" href={new URL(url, Astro.site).pathname}>
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

A Markdown layout will have access to the following information via `Astro.props`:

- **`file`** - The absolute path of this file (e.g. `/home/user/projects/.../file.md`).
- **`url`** - The URL of the page (e.g. `/en/guides/markdown-content`).
- **`frontmatter`** - All frontmatter from the Markdown or MDX document.
  - **`frontmatter.file`** - The same as the top-level `file` property.
  - **`frontmatter.url`** - The same as the top-level `url` property.
- **`headings`** - A list of headings (`h1 -> h6`) in the Markdown or MDX document with associated metadata. This list follows the type: `{ depth: number; slug: string; text: string }[]`.
- **`rawContent()`** - A function that returns the raw Markdown document as a string.
- **`compiledContent()`** - An async function that returns the Markdown document compiled to an HTML string.

:::note
A Markdown layout will have access to all the Markdown file's [available properties](/en/guides/markdown-content/#available-properties) from `Astro.props` **with two key differences:**

*   Heading information (i.e. `h1 -> h6` elements) is available via the `headings` array, rather than a `getHeadings()` function.

*   `file` and `url` are *also* available as nested `frontmatter` properties (i.e. `frontmatter.url` and `frontmatter.file`).

:::

### Importing Layouts Manually (MDX)

You can also use the special Markdown layout property in the frontmatter of MDX files to pass `frontmatter` and `headings` props directly to a specified layout component in the same way. 

To pass information to your MDX layout that does not (or cannot) exist in your frontmatter, you can instead import and use a `<Layout />` component. This works like any other Astro component, and will not receive any props automatically. Pass it any necessary props directly:

```mdx title="src/pages/posts/first-post.mdx" ins={6} del={2} /</?BaseLayout>/ /</?BaseLayout title={frontmatter.title} fancyJsHelper={fancyJsHelper}>/
---
layout: ../../layouts/BaseLayout.astro
title: 'My first MDX post'
publishDate: '21 September 2022'
---
import BaseLayout from '../../layouts/BaseLayout.astro';

export function fancyJsHelper() {
  return "Try doing that with YAML!";
}

<BaseLayout title={frontmatter.title} fancyJsHelper={fancyJsHelper}>
  Welcome to my new Astro blog, using MDX!
</BaseLayout>
```

Then, your values are available to you through `Astro.props` in your layout, and your MDX content will be injected into the page where your `<slot />` component is written:

```astro title="src/layouts/BaseLayout.astro" /{?title}?/ "fancyJsHelper" "{fancyJsHelper()}"
---
const { title, fancyJsHelper } = Astro.props;
---
<html>
  <head>
    <!-- -->
    <meta charset="utf-8">
  </head>
  <body>
    <!-- -->
    <h1>{title}</h1>
    <slot /> <!-- your content is injected here -->
    <p>{fancyJsHelper()}</p>
    <!-- -->
  </body>
</html>
```

When using any layout (either through the frontmatter `layout` property or by importing a layout), you must include the `<meta charset="utf-8">` tag in your layout as Astro will no longer add it automatically to your MDX page.

<ReadMore>Learn more about Astro’s Markdown and MDX support in our [Markdown guide](/en/guides/markdown-content/).</ReadMore>

## Nesting Layouts

Layout components do not need to contain an entire page worth of HTML. You can break your layouts into smaller components, and combine layout components to create even more flexible, page templates. This pattern is useful when you want to share some code across multiple layouts.

For example, a `BlogPostLayout.astro` layout component could style a post's title, date and author. Then, a site-wide `BaseLayout.astro` could handle the rest of your page template, like navigation, footers, SEO meta tags, global styles, and fonts. You can also pass props received from your post to another layout, just like any other nested component.

```astro {3} /</?BaseLayout>/ /</?BaseLayout url={frontmatter.url}>/
---
// src/layouts/BlogPostLayout.astro
import BaseLayout from './BaseLayout.astro';
const { frontmatter } = Astro.props;
---
<BaseLayout url={frontmatter.url}>
  <h1>{frontmatter.title}</h1>
  <h2>Post author: {frontmatter.author}</h2>
  <slot />
</BaseLayout>
```
