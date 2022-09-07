---
layout: ~/layouts/MainLayout.astro
title: 布局
description: 布局简介——一种在页面中共享常用布局的 Astro 组件。
---

**布局**是特殊的 [Astro 组件](/zh-cn/core-concepts/astro-components/)，可用于创建可重用的页面模板。

布局组件通常用于提供 [`.astro` 或 `.md` 页面](/zh-cn/core-concepts/astro-pages/)、**页面骨架**（`<html>`、`<head>` 和 `<body>` 标签）和用于插入页面内容的 `<slot />` 。

布局通常为页面提供常用的 `<head>` 元素和常用 UI 元素，例如页眉、导航栏和页脚。

布局组件通常放置在项目中的 `src/layouts` 目录中。

## 示例布局

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
      <slot /> <!-- 你的内容会被插入到这里 -->
    </article>
  </body>
</html>
```

**`src/pages/index.astro`**

```astro
---
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>My page content, wrapped in a layout!</p>
</MySiteLayout>
```

📚 详细了解[插槽](/zh-cn/core-concepts/astro-components/#插槽)。

## Markdown 布局

页面布局对于 [Markdown 文件](/zh-cn/guides/markdown-content/#markdown-页面)尤其有用。Markdown 文件可以在 frontmatter 顶部使用特殊的 `layout` 属性来指定要作为页面布局的 `.astro` 组件。

**`src/pages/posts/post-1.md`**

```markdown
---
layout: ../layouts/BlogPostLayout.astro
title: Blog Post
description: My first blog post!
---
This is a post written in Markdown.
```

当 Markdown 页面使用布局时，它会将 `content` 属性传递给 `.astro` 组件，其中包括 fronttmatter 属性和页面的最终 HTML 输出。

📚 在我们的 [Markdown 指南](/zh-cn/guides/markdown-content/)中了解有关 Astro  Markdown 支持的更多信息。

## 嵌套布局

布局组件无需包含整个页面的 HTML。你可以将布局分解为更小的组件，然后重用这些组件以创建更灵活、更强大的布局。

例如，博客文章的常见布局可能会显示标题、日期和作者。`BlogPostLayout.astro` 布局组件可以将此 UI 添加到页面，而其他部分则交由更广范围的样式来处理。

**`src/layouts/BlogPostLayout.astro`**

```astro
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
