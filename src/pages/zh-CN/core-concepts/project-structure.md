---
layout: ~/layouts/MainLayout.astro
title: 项目结构
description: 学习如何用 Astro 构建一个项目。
---

你用 `create-astro` CLI 向导所生成的新 Astro 项目中已经包括一些文件和文件夹。其他的则你将自己创建并添加到 Astro 的现有文件结构中。

以下是 Astro 的项目结构，以及一些你将在新项目中发现的文件。

## 目录和文件

Astro 为你的项目提供了一个有想法的文件夹布局。每个 Astro 项目的根目录下都应该包括以下目录和文件：

- `src/*` - 你的项目源代码（组件、页面、样式等）。
- `public/*` - 你的非代码、未处理的资源（字体、图标等）。
- `package.json` - 项目列表。
- `astro.config.mjs` - Astro 配置文件（可选）。

### 项目树实例

一个普通的项目目录可能看起来像这样：

```
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   └-─ Button.jsx
│   ├── layouts/
│   │   └-─ PostLayout.astro
│   └── pages/
│   │   ├── posts/
│   │   │   ├── post1.md
│   │   │   ├── post2.md
│   │   │   └── post3.md
│   │   └── index.astro
│   └── styles/
│       └-─ global.css
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └-─ social-image.png
├── astro.config.mjs
└── package.json

```

### `src/`

`src` 文件夹是大部分项目源代码所在的地方。这包括：

- [页面](/en/core-concepts/astro-pages/)
- [布局](/en/core-concepts/layouts/)
- [Astro 组件](/en/core-concepts/astro-components/)
- [前端组件（React 等）](/en/core-concepts/framework-components/)
- [样式（CSS、Sass）](/en/guides/styling/)
- [Markdown](/en/guides/markdown-content/)

Astro 处理、压缩和捆绑 `src/` 下文件以创建最终传递到浏览器的网站。与静态的 `public/` 目录不同，你的 `src/` 文件是由 Astro 建立并处理的。

有些文件（如 Astro 组件）可能不会被发送到浏览器，而是被渲染成静态 HTML。其他文件（如 CSS）则会被传递到浏览器，但可能被会压缩或与其他 CSS 文件捆绑在一起以提高性能。

### `src/components'

**组件**是你在 HTML 页面中可重复使用的代码单元。它可以是 [Astro 组件](/en/core-concepts/astro-components/) 或是像 React 或 Vue 这样的[前端组件](/en/core-concepts/framework-components/)。通常将你项目中所有组件都分组放在这个文件夹中。

这在 Astro 项目中是个习惯，但不过你可以自由地根据喜好进行管理。

### `src/layouts`

[布局](/en/core-concepts/layouts/)是一种特殊的组件，它将一些内容包裹在一个更大的页面布局中。通常用在 [Astro 页面](/en/core-concepts/astro-pages/)和 [Markdown 页面](/en/guides/markdown-content/)中以定义页面的布局。

和 `src/components` 一样，这个目录也只是个习惯。

### `src/pages`

[页面](/en/core-concepts/astro-pages/)是一种用于创建新的页面的特殊组件。一个页面可以是一个 Astro 组件，也可以是一个 Markdown 文件，它代表你网站的一些内容页面。

> ⚠️ `src/pages` 是 Astro 项目中**必须要有的**一个子目录。没有它，你的网站将没有任何页面或路径！

### `src/styles`

在 `src/styles` 目录下存储你的 CSS 或 Sass 文件仍只是个习惯。只要你的样式在 `src/` 目录下的某个地方，并且正确导入，Astro 就能处理并压缩它们。

### `public/`

`public/` 目录用于文件和资源，它不会在 Astro 构建过程中处理。这些文件将不加修改地被直接复制到构建文件夹。

这种行为使得 `public/` 成为存放图片和字体等普通资源或 `robots.txt` 和 `manifest.webmanifest` 等特殊文件的理想选择。

你也可以把 CSS 和 JavaScript 放在 `public/` 目录中，但要注意这些文件不会在最终构建中被捆绑或压缩。

 💡一般而言，你自己编写的 CSS 或 JavaScript 都应该放在 `src/` 目录下。

### `package.json'

它被 JavaScript 包管理器用来管理依赖关系。它也定义了通常用于运行 Astro 的脚本（例如：`npm start`, `npm run build`）。

如需帮助为你的项目创建一个新的 `package.json` 文件，请查看[手册设置](/en/install/manual/)中的说明。

### `astro.config.mjs`

每个入门模板都有它，它存储着 Astro 项目的配置。你可以在这里指定要使用的集成、构建选项、服务器选项以及其他内容。

参见[配置参考](/en/reference/configuration-reference/#article)了解关于配置的更多细节。
