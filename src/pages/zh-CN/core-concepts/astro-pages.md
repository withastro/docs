---
layout: ~/layouts/MainLayout.astro
title: 页面
description: Astro 页面简介。
---

**页面**是一种特殊的 [Astro 组件](/zh-CN/core-concepts/astro-components/)，位于 `src/pages/` 子目录中。它们负责处理你网站中每个 HTML 页面的路由、数据加载和整体页面布局。

### 基于文件的路由

Astro 利用一种称为**基于文件的路由的路由策略**。`src/pages` 目录中的每个 `.astro` 文件都会根据其文件路径成为你网站上的页面或端点。

📚 阅读更多关于 [Astro 中的路由](/en/core-concepts/routing/)

### 页面 HTML

Astro 页面必须返回完整的 `<html>...</html>` 页面响应，包括 `<head>` 和 `<body>`。（`<!doctype html>` 可选，会自动添加）

```astro
---
// Example: src/pages/index.astro
---
<html>
  <head>
    <title>My Homepage</title>
  </head>
  <body>
    <h1>Welcome to my website!</h1>
  </body>
</html>
```

### 复用页面布局

为避免在每个页面上重复相同的 HTML 元素，你可以将常见的 `<head>` 和 `<body>` 元素移动到你自己的[布局组件](/en/core-concepts/layouts/)中。你也可以根据需要使用尽可能多或尽可能少的布局组件。

```astro
---
// Example: src/pages/index.astro
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>My page content, wrapped in a layout!</p>
</MySiteLayout>
```

📚 阅读更多关于 Astro 中的[布局组件](/en/core-concepts/layouts/)的信息。

## Markdown 页面

Astro 还将 `/src/pages/` 中的任何 Markdown（`.md`）文件视为最终网站中的页面。这些通常用于大量文本的页面，例如博客文章和文档。

页面布局对于 [Markdown 文件](#markdown-页面)来说特别有用。Markdown 文件可以使用特殊的 front matter `layout` 属性来指定用来将 Markdown 内容包括在 `<html>...</html>` 中的[布局组件](/zh-CN/core-concepts/layouts/)。

```md
---
# 示例：src/pages/page.md
layout: '../layouts/MySiteLayout.astro'
title: 'My Markdown page'
---
# Title

This is my page, written in **Markdown.**
```

📚 阅读更多关于 Astro 中的 [Markdown](/en/guides/markdown-content/) 的信息。

## 非 HTML 页面

非 HTML 页面，例如 `.json` 或 `.xml`，甚至是图片之类的资源，都可以使用通常称为**文件路由**来生成 API 路由。

**文件路由**是以 `.js` 或 `.ts` 扩展名结尾，位于 `src/pages/` 目录的 script 文件，。

生产的文件名和扩展名基于源文件的名称，例如：`src/pages/data.json.ts` 将被构建以匹配最终构建中的 `/data.json` 路由。

在 SSR（服务器端渲染）中，扩展无关紧要，可以省略。这是因为在构建时不会生成任何文件。相反，Astro 则会生成单个服务器文件。

```js
// 示例：src/pages/builtwith.json.ts
// 输出：/builtwith.json

// 文件路由导出 get () 函数，调用该函数以生成文件。
// 返回带有 `body` 的对象，以在最终构建中保存文件内容。
export async function get () {
  return {
    body: JSON.stringify ({
      name: 'Astro',
      url: 'https://astro.build/',
    }),
  };
}
```

API 路由接收包含 [params](/en/reference/api-reference/#params) 和 [Request](https://developer.mozilla.org/en-US/docs/Web/API/request) 的 `APIContext` 对象：

```ts
import type { APIContext } from 'astro';

export async function get ({ params, request }: APIContext) {
  return {
    body: JSON.stringify ({
      path: new URL (request.url).pathname
    })
  };
}
```

或者你还可以使用 `APIRoute` 类型键入你的 API 路由函数。 当你的 API 路由返回错误类型时，这将提供更好的错误消息：

```ts
import type { APIRoute } from 'astro';

export const get: APIRoute = ({ params, request }) => {
  return {
    body: JSON.stringify ({
      path: new URL (request.url).pathname
    })
  };
};
```

## 自定义 404 错误页面

想要自定义 404 错误页面，你可以在 `/src/pages` 中创建 `404.astro` 文件。

这将生产 `404.html` 页面。大多数[部署服务](/en/guides/deploy/)都自动找到并使用它。
