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
<html>
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

Page layouts are especially useful for [Markdown files](/en/guides/markdown-content/#markdown-and-mdx-pages). Markdown files can use a special `layout` property at the top of the frontmatter to specify which `.astro` component to use as a page layout.

**`src/pages/posts/post-1.md`**

```markdown {2}
---
layout: ../layouts/BlogPostLayout.astro
title: Blog Post
description: My first blog post!
---
This is a post written in Markdown.
```

When a Markdown file includes a layout, it passes a `content` property to the `.astro` component which includes the frontmatter properties and the final HTML output of the page.


**`src/layouts/BlogPostLayout.astro`**

```astro /content(?:.\w+)?/
---
const {content} = Astro.props;
---
<html>
   <!-- ... -->
  <h1>{content.title}</h1>
  <h2>Post author: {content.author}</h2>
  <slot />
   <!-- ... -->
</html>
```

📚 Learn more about Astro’s Markdown support in our [Markdown guide](/en/guides/markdown-content/).

## Nesting Layouts

Layout components do not need to contain an entire page worth of HTML. You can break your layouts into smaller components, and then reuse those components to create even more flexible, powerful layouts in your project.

For example, a common layout for blog posts may display a title, date and author. A `BlogPostLayout.astro` layout component could add this UI to the page and also leverage a larger, site-wide layout to handle the rest of your page.

**`src/layouts/BlogPostLayout.astro`**

```astro {2} /</?BaseLayout>/
---
import BaseLayout from '../layouts/BaseLayout.astro'
const {content} = Astro.props;
---
<BaseLayout>
  <h1>{content.title}</h1>
  <h2>Post author: {content.author}</h2>
  <slot />
</BaseLayout>
```
