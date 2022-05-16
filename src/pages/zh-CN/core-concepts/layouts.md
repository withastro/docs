---
layout: ~/layouts/MainLayout.astro
title: 布局
description: 布局简介——一种在页面中共享常用布局的 Astro 组件。
---

**布局**是一种特殊类型的 [Astro 组件](/en/core-concepts/astro-components/)，可用于创建可重用的页面模板。

布局组件通常用于提供 [`.astro` 或 `.md` 页面](/en/core-concepts/astro-pages/)、**页面骨架**（`<html>`、`<head>` 和 `<body>` 标签）和 `<slot />` 要在哪里插入页面内容。

布局通常为页面提供常用的 `<head>` 元素和常用 UI 元素，例如页眉、导航栏和页脚。

布局组件通常放置在项目中的 `src/layouts` 目录中。

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

📚 详细了解 [slots](/en/core-concepts/astro-components/#slots)。

## 嵌套布局

布局组件无需包含整个页面的 HTML。你可以将布局分解为更小的组件，然后重用这些组件以创建更灵活、更强大的布局。

例如，博客文章的常见布局可能会显示标题、日期和作者。`BlogPostLayout.astro` 布局组件可以将此 UI 添加到页面，而其他部分则交由更广范围的样式来处理。

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

## Markdown 布局

页面布局对于 [Markdown 文件](/en/guides/markdown-content/#markdown-pages)尤其有用。Markdown 文件可以使用特殊的 `layout` front matter 来指定包裹 Markdown 内容的布局。

当 Markdown 页面使用布局时，它会向布局传递所有 Markdown front matter 和最终 HTML 输出的 `content` 属性。如何在布局组件中使此 `content` 属性，请参阅上面的 `BlogPostLayout.astro` 示例。

```markdown
// src/pages/posts/post-1.md
---
title: Blog Post
description: My first blog post!
layout: ../layouts/BlogPostLayout.astro
---
This is a post written in Markdown.
```

📚 在我们的 [Markdown 指南](/en/guides/markdown-content/)中了解有关 Astro 的 Markdown 支持的更多信息。
