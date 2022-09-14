---
layout: ~/layouts/MainLayout.astro
title: 页面
description: Astro 页面简介
---

**页面**是位于 Astro 项目下 `src/pages/` 子目录中的文件。它们负责处理网站中每个页面的路由、数据加载和整体页面布局。

## 支持的页面文件

Astro 在 `src/pages/` 目录下支持以下文件类型：

- [`.astro`](#astro-页面)
- [`.md`](#markdownmdx-页面)
- `.mdx` (with the [MDX Integration installed](/zh-cn/guides/integrations-guide/mdx/#installation))
- [`.js`/`.ts`](#文件路由)
- [`.html`](#html-页面)

### 基于文件的路由

Astro 采用**基于文件的路由策略**。`src/pages` 目录中的每个 `.astro` 文件都会根据其文件路径成为你网站上的页面或端点。

在你的组件模板中编写标准的 HTML [`<a>` 元素](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)，以便在页面之间进行链接。

📚 阅读更多关于 [Astro 路由](/zh-cn/core-concepts/routing/)的信息。

### Astro 页面

Astro 页面使用 `.astro` 文件扩展名，支持与 [Astro 组件](/zh-cn/corecepts/astro-components/)相同的功能。

```astro
---
// 示例：src/pages/index.astro
---
<html>
  <head>
    <title>我的主页</title>
  </head>
  <body>
    <h1>欢迎来到我的网站!</h1>
  </body>
</html>
```

为避免在每个页面上重复相同的 HTML 元素，你可以将常见的 `<head>` 和 `<body>` 元素移动到自己的[布局组件](/zh-cn/core-concepts/layouts/)中。也可以根据需要尽可能多或尽可能少地使用布局组件。

```astro {3} /</?MySiteLayout>/
---
// 示例：src/pages/index.astro
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>我的页面内容，被包裹在一个布局中!</p>
</MySiteLayout>
```

📚 阅读更多关于 Astro [布局组件](/zh-cn/core-concepts/layouts/)的信息。

## Markdown/MDX 页面

Astro 也把 `src/pages/` 内的任何 Markdown（`.md`）文件当作你最终网站的页面。如果你安装了 [MDX 集成](/en/guides/integrations-guide/mdx/#installation)，它也以同样的方式处理 MDX（`.mdx`）文件。这些文件通常用于文字量大的页面，如博客文章和文档。

页面布局对于 [Markdown 文件](#markdownmdx-页面)来说特别有用。Markdown 文件可以使用特殊的 front matter `layout` 属性来指定用来将 Markdown 内容包括在 `<html>...</html>` 中的[布局组件](/zh-cn/core-concepts/layouts/)。

```md {3}
---
# 示例：src/pages/page.md
layout: '../layouts/MySiteLayout.astro'
title: '我的 Markdown 页'
---
# 标题

这是我的页面，用 **Markdown** 写的。
```

📚 阅读更多关于 Astro 中的 [Markdown](/zh-cn/guides/markdown-content/) 的信息。

## 文件路由

**文件路由**是指位于 `src/pages/` 目录下，以 `.js` 或 `.ts` 结尾的脚本文件。这些文件可以建立非 HTML 页面，如 .json 或 .xml，甚至是图片等资产。

`.js` 或 `.ts` 扩展名将在构建过程中被删除。例如，`src/pages/data.json.ts` 将被构建为与 `/data.json` 路由相匹配。

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

API 路由和文件路由会接收包含 [params](/zh-cn/reference/api-reference/#params) 和 [Request](https://developer.mozilla.org/en-US/docs/Web/API/request) 的 `APIContext` 对象：

```ts title="src/pages/request-path.json.ts"
import type { APIContext } from 'astro';

export async function get ({ params, request }: APIContext) {
  return {
    body: JSON.stringify ({
      path: new URL (request.url).pathname
    })
  };
}
```

或者你还可以在 API 路由函数中使用 `APIRoute` 类型。当你的 API 路由返回错误类型时，这将提供更好的错误消息：

```ts title="src/pages/request-path.json.ts"
import type { APIRoute } from 'astro';

export const get: APIRoute = ({ params, request }) => {
  return {
    body: JSON.stringify ({
      path: new URL (request.url).pathname
    })
  };
};
```

你可以在静态构建中选择性地返回 `encoding` 选项。它可以是任何有效的，被 node.js 的 `fs.writeFile` 方法接受的 [`BufferEncoding`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/bdd02508ddb5eebcf701fdb8ffd6e84eabf47885/types/node/buffer.d.ts#L169)。例如，使用 SSG 产生一个二进制 png 图像。

```ts title="src/pages/image.png.ts" {7}
import type { APIRoute } from 'astro';

export const get: APIRoute = ({ params, request }) => {
  const buffer = ...;
  return {
    body: buffer.toString('binary'),
    encoding: 'binary',
  };
};

```

## HTML 页面

带有 `.html` 文件扩展名的文件可以放在 `src/pages/` 中，并直接作为你网站上的页面使用。注意 [HTML 组件](/en/corecepts/astro-components/#html-components) 不支持一些关键的 Astro 功能。

## 自定义 404 错误页面

想要自定义 404 错误页面，你可以在 `/src/pages` 中创建 `404.astro` 或 `404.md` 文件。

它将生成 `404.html` 页面。大多数[部署服务](/zh-cn/guides/deploy/)都自动找到并使用它。
