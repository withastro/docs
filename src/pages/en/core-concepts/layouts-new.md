---
layout: ~/layouts/MainLayout.astro
title: Layouts
description: An intro to layouts, a type of Astro component that is shared between pages for common layouts.
---
**Layouts** are a special type of [Component](/en/core-concepts/astro-components) for creating reusable page templates. 

Layouts contain the **page shell** (`<html>`, `<head>` and `<body>` tags) and a `<slot>` into which individual page content is injected. 

Layouts can also provide common elements such as headers, navigation bars and footers.

Conventionally, layout components are placed in `src/layouts`.


## Sample Layout

```astro
// src/layouts/BaseLayout.astro

---
import Footer from '../components/Footer.astro';
const {title} = Astro.props;
---
<html>
  <head>
    <title>Example Layout: {title}</title>
  </head>
  <body>
  
    <nav>
      <a href="#">Home</a>
      <a href="#">Posts</a>
      <a href="#">Contact</a>
    </nav>

    <!-- slot: your page content will be injected here. -->
    <slot />

    <Footer />
  </body>
</html>
```

📚 Learn more about how `<slot/>` works in our [Astro Component guide.](/en/core-concepts/astro-components)

## Using a Layout in a Page

A Page can import, then wrap its own content, in a `<Layout>`.

```astro
// src/pages/index.astro

---
import BaseLayout from '../layouts/BaseLayout.astro'
---
<BaseLayout title="Homepage">
  <h1>Hello, world!</h1>
  <h2>This is my page content. It will be nested inside a layout.</h2>
  <p>This page does not need to provide a page shell.</p>
</BaseLayout>
```

## Nesting Layouts

 You can create multiple Layout files and choose between them on a page-by-page basis. 

You can also nest Layouts to create different page types while keeping some basic elements in common across all pages. For example, a blog post may display title, date and author in addition to a site-wide header and footer found on other pages such as Contact and About Me.

```astro
// src/layouts/BlogLayout.astro

---
import BaseLayout from '../layouts/BaseLayout.astro'
const {title, author} = Astro.props;
---
<BaseLayout title={title}>
  <h1>{title}</h1>
  <h2>Post author: {author}</h2>
  <slot />
</BaseLayout>
```


## Markdown Layouts

Layouts are essential for Markdown files since they cannot provide their own page shell. Markdown files must declare a layout in the file frontmatter.

```markdown
---
title: Blog Post
description: My first blog post!
layout: ../layouts/PostLayout.astro
---
This is a post written in Markdown.
```

📚 Learn more about Astro’s markdown support in our [Markdown guide](/en/guides/markdown-content).