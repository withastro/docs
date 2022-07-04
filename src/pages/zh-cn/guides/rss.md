---
layout: ~/layouts/MainLayout.astro
title: RSS
description: Astro RSS 介绍
---

Astro 支持为博客和其他内容网站快速自动生成 RSS 摘要。更多关于 RSS 摘要的信息参见 [aboutfeeds.com](https://aboutfeeds.com/)。

## 设置 `@astrojs/rss`

`@astrojs/rss` 包提供了使用 [API 端点](/zh-cn/core-concepts/astro-pages/#非-html-页面)生成 RSS 的工具。当使用 [SSR 适配器](/zh-cn/guides/server-side-rendering/#enabling-ssr-in-your-project)时，可以解锁静态构建**和**按需生成特性。

首先，使用你喜欢的包管理器安装 `@astrojs/rss`：

```bash
# npm
npm i @astrojs/rss
# yarn
yarn add @astrojs/rss
# pnpm
pnpm i @astrojs/rss
```

然后，确保在项目的 `astro.config` 文件中[配置了 `site`](/zh-cn/reference/configuration-reference/#site)。它将结合 [`SITE` 环境变量](/zh-cn/guides/environment-variables/#默认环境变量)生成 RSS 摘要链接。

:::note[需要使用 v1]
`SITE` 环境变量只适用于最新的 Astro 1.0 beta。可以考虑升级到最新的 Astro（`astro@latest`），或可以手动编辑 `site`（见下方示例）。
:::

现在，让我们来生成我们的第一个 RSS 摘要吧。在 `src/pages/` 目录下创建 `rss.xml.js` 文件，`rss.xml` 是生成的链接，可以随意更改。

接下来，从 `@astrojs/rss` 包中导入 `rss` 助手函数，并使用以下参数进行调用。

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

export const get = () => rss({
    // 輸出的 xml 中的 `<title>` 字段
    title: 'Buzz’s Blog',
    // 输出的 xml 中的 `<description>` 字段
    description: 'A humble Astronaut’s guide to the stars',
    // RSS 中 `<item>` 链接的基础链接
    // 站点将使用项目下 astro.config 文件中的 `site` 配置项目
    site: import.meta.env.SITE,
    // 输出的 xml 中的 `<item>` 列表
    // 简单示例：为 `/src/pages` 中的每个 md 文件生成项目
    // 参见“生成项目”部分，了解需要的 frontmatter 和高级用例。
    items: import.meta.glob('./**/*.md'),
    // （可选）注入自定义 xml
    customData: `<language>en-us</language>`,
  });
```

## 生成 `items`

`items` 字段接受以下两种情况：
1. [`import.meta.glob(...)` 的结果](#1-importmetaglob-结果)**（只适用于 `src/pages/` 目录下的 `.md` 文件！）**。
2. [RSS 摘要对象的列表](#2-rss-摘要对象列表)，每个对象都要有 `link`、`title`、`pubDate` 字段，以及可选的 `description` 和`customData` 字段。

### 1. `import.meta.glob` 结果

我们推荐将这种方式用于 `src/pages/` 下的 `.md` 文件。每个帖子都应该有 `title`、`pubDate`，以及可选的 `description` 和 `customData` frontmatter 字段。如果这是不可能的，或者你更喜欢在代码中生成这个前言，[见选项2](#2-rss-摘要对象列表)。

假设你的博客文章存放在 `src/pages/blog/` 目录下。你可以像这样生成 RSS 摘要：

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

export const get = () => rss({
    title: 'Buzz’s Blog',
    description: 'A humble Astronaut’s guide to the stars',
    site: import.meta.env.SITE,
    items: import.meta.glob('./blog/**/*.md'),
  });
```

关于导入语法的更多信息，请参见 [Vite 的 glob 导入文档](https://vitejs.dev/guide/features.html#glob-import)。

### 2. RSS 摘要对象列表

我们推荐将这种方式用于`pages` 外的 `.md` 文件。它适用于[通过 `getStaticPaths`](/zh-cn/reference/api-reference/#getstaticpaths)生成路由。

例如，假设你的 `.md` 帖子存储在 `src/posts/` 目录下。每个帖子都有 `title`、`pubDate` 和 `slug` 字段，其中 `slug` 对应于站点输出链接。我们可以使用 [Vite 的 `import.meta.globEager` 助手函数](https://vitejs.dev/guide/features.html#glob-import)生成 RSS 摘要，像这样：

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

const postImportResult = import.meta.globEager('../posts/**/*.md');
const posts = Object.values(postImportResult);

export const get = () => rss({
    title: 'Buzz’s Blog',
    description: 'A humble Astronaut’s guide to the stars',
    site: import.meta.env.SITE,
    items: posts.map((post) => ({
      link: post.frontmatter.slug,
      title: post.frontmatter.title,
      pubDate: post.frontmatter.pubDate,
    }))
  });
```

## 添加样式

当你在浏览器中查看文件时，对 RSS 摘要进行样式设计有助于获得更愉快的用户体验。

使用 `rss` 函数的 `stylesheet` 选项来指定样式的绝对路径：

```js
rss({
  // 例如：使用 `public/rss/styles.xsl` 样式表
  stylesheet: '/rss/styles.xsl',
  // ...
});
```

如果没有中意的 RSS 样式，我们推荐 [Pretty Feed v3 默认样式表](https://github.com/genmon/aboutfeeds/blob/main/tools/pretty-feed-v3.xsl)，你可以从 GitHub 下载并保存到你项目的 `public/` 目录中。
