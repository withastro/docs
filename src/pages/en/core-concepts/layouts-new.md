---
layout: ~/layouts/MainLayout.astro
title: Layouts
description: An intro to layouts, a type of Astro component that is shared between pages for common layouts.
---

**Layouts** are a special type of [Astro Component](/en/core-concepts/astro-components) useful for creating reusable page templates. 

Layouts are a common convention in Astro for any component that contains both a **page shell** (`<html>`, `<head>` and `<body>` tags) and a `<slot>` that page content is injected into. 

Layouts often provide common `<head>` elements and common UI elements for the page such as headers, navigation bars and footers.

Layout components are commonly placed in a `src/layouts` directory in your project.

## Sample Layout

```astro
---
// Example: src/layouts/MySiteLayout.astro
---
<html>
  <head>
    <!-- ... -->
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

```astro
---
// Example: src/pages/index.astro
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>My page content, wrapped in a layout!</p>
</MySiteLayout>
```


📚 Learn more about how `<slot/>` works in our [Astro Component guide.](/en/core-concepts/astro-components)


## Nesting Layouts

Layout components don't need to contain an entire page worth of HTML. You can break your layouts into smaller components, and then reuse those components to create even more flexible, powerful layouts in your project.

For example, a common layout for blog posts may display a title, date and author. A `BlogPostLayout.astro` layout component could add this UI to the page and also leverage a larger, site-wide layout to handle the rest of your page.

```astro
---
// Example src/layout/BlogPostLayout.astro
import BaseLayout from '../layouts/BaseLayout.astro'
const {content} = Astro.props;
---
<BaseLayout>
  <h1>{content.title}</h1>
  <h2>Post author: {content.author}</h2>
  <slot />
</BaseLayout>
```

## Markdown Layouts

Page layouts are especially useful for [Markdown files.](#markdown-pages) Markdown files can use the special `layout` front matter property to specifying a Layout component that will wrap their Markdown content in a full page HTML document. 

When a markdown page uses a layout, it passes the layout a single `content` prop that includes all of the markdown front matter data and final HTML output.  See the `BlogPostLayout.astro` example above for an example of how you would use this `content` prop in your layout component.


```markdown
---
title: Blog Post
description: My first blog post!
layout: ../layouts/BlogPostLayout.astro
---
This is a post written in Markdown.
```

📚 Learn more about Astro’s markdown support in our [Markdown guide](/en/guides/markdown-content).