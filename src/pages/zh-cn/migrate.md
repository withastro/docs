---
layout: ~/layouts/MainLayout.astro
title: 迁移指南
description: 如何将你的项目迁移至最新的 Astro 版本。
i18nReady: true
---

该指南将帮助你迁移到从旧版迁移到最新的 Astro 版本。

阅读下面的指南，了解主要的亮点和如何处理破坏性变更的说明。

## Astro 1.0 Beta

在 2022 年 4 月 4 日，我们发布了 Astro 1.0 Beta！🎉

**在测试期间，我们不打算再做任何破坏性变更，直到正式的 v1.0.0 版本发布（计划于 2022 年 6 月 8 日）。**

如果不得不做出破坏性变更，我们将在本节中指出。

Astro 的 `v1.0.0-beta.0` 版本不包含任何破坏性变化。

如果你是从 v0.25 或更早的版本来的，请确保你已经阅读并遵循下面的 [v0.26 迁移指南](#迁移至-v026)，其中包含了几个主要的破坏性变化。

## 迁移至 v0.26

### 全新的配置 API

我们已经重新设计配置 API，以解决去年积累的一些明显的混乱点。大多数配置只是被移动或重新命名，希望这对大多数用户来说是一个快速更新。有几个选项被重构得比较严重，可能需要一些额外的改变。

- `.buildOptions.site` 已经被 `.site`（你部署的域）和一个新的 `.base`（你部署的子路径）选项所取代。
- `.markdownOptions` 已被 `.markdown` 取代，这是一个基本相似的配置项，有一些小的变化，以简化 Markdown 配置。
- `.sitemap` 已经被移至 [@astrojs/sitemap](https://www.npmjs.com/package/@astrojs/sitemap) 整合中。

如果你用传统的配置运行 Astro，你会看到一个警告，并说明如何更新。请参阅我们更新的[配置参考](/zh-cn/reference/configuration-reference/)以获得更多关于升级的信息。

阅读 [RFC0019](https://github.com/withastro/rfcs/blob/main/proposals/0019-config-finalization.md) 了解更多关于这些变化的背景。

### 全新的 Markdown API

Astro v0.26 为你的内容发布提供了全新的 Markdown API。这包括三个主要面向用户的变化。

- 你现在可以直接使用 ESM `import()` 导入 markdown 内容。
- 一个新的 `Astro.glob()` API，以便更容易使用全局导入（特别是对于 Markdown 而言）。
- **破坏性变更：** `Astro.fetchContent()` 已经被移除并被 `Astro.glob()` 取代。
- **破坏性变更：** Markdown 对象有个用于更新的 API。

```diff
// v0.25
- let allPosts = Astro.fetchContent('./posts/*.md');
// v0.26+
+ let allPosts = await Astro.glob('./posts/*.md');
```

在迁移的时候，要注意新的 Markdown 对象接口。例如，Frontmatter 已经被移到了 `.frontmatter` 属性中，所以像 `post.title` 这样的引用应该改变为 `post.frontmatter.title`。

这应该能解决 Markdown 用户的许多问题，包括对大型网站的性能改进。

阅读 [RFC0017](https://github.com/withastro/rfcs/blob/main/proposals/0017-markdown-content-redesign.md) 了解更多关于这些变化的背景。

### 全新的默认 Script 行为

Astro 组件中的 `<script>`标签现在已经被默认建立、捆绑和优化。这完成了使我们的 Astro 组件语法更加一致的长期行动，与我们今天的 `<style>` 标签的默认优化行为相匹配。

这包括一些需要注意的变化。

- **破坏性：** `<script hoist>` 是新的默认 `<script>` 行为。`hoist` 属性已被删除。
- 新的 `<script is:inline>` 指令，可以将 `<script>` 标签恢复到以前的默认行为（未构建、未捆绑、不受 Astro 影响）。
- 新的 `<style is:inline>` 指令将在在页面模板中留下一个样式标签（类似于以前的 `<script>` 行为）。
- 新的 `<style is:global>` 指令将在在未来的版本中取代 `<style global>`。

## 迁移至 v1.0.0-beta.0

```diff
// v0.25
- <script hoist>
// v0.26+
+ <script>
```

阅读 [RFC0016](https://github.com/withastro/rfcs/blob/main/proposals/0016-style-script-defaults.md) 了解更多关于这些变化的背景。

### 更新 Astro.request API

`Astro.request` 已经从自定义对象变成了标准的 `Request` 对象。这是使用更多网络标准 API 的项目的一部分，特别是在涉及 SSR 的地方。

这包括一些需要注意的变化。

- `Astro.request` 改用 [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 对象。
- 将 `Astro.request.params` 移至 `Astro.params`。
- 将 `Astro.request.canonicalURL` 移到 `Astro.canonicalURL`。

阅读 [RFC0018](https://github.com/withastro/rfcs/blob/main/proposals/0018-astro-request.md) 了解更多关于这些变更的背景。

### 其他变更

- 改进 `Astro.slots` API，支持向基于函数插槽传递参数。这使得接受回调函数作为子函数的实用组件更加符合人体工程学。
- 更新 CLI 输出格式，特别是针对错误报告。
- 更新 `@astrojs/compiler`，修复了一些与在 frontmatter 中使用 RegExp 相关的错误。

## 迁移至 v0.25

### Astro 集成

`renderers` 配置已被全新的、官方集成系统所取代！这将释出一些令人兴奋的新功能。你可以阅读我们的[使用集成](/zh-cn/guides/integrations-guide/)指南，了解更多关于如何使用这个新系统的细节。

整合取代了我们原来的 `renderers` 概念，并伴随着一些破坏性变更和对现有用户的新默认值。这些变化将在下面介绍。

#### 移除内嵌框架支持

以前，React、Preact、Svelte 和 Vue 都默认包含在 Astro 中。从 0.25.0 版本开始，Astro 不再附带任何内置的渲染器。如果你没有为你的项目定义 `renderers` 配置项，你现在需要自己安装这些框架。

请阅读我们的[逐步演示](/zh-cn/guides/integrations-guide/)，了解如何为你目前使用的框架添加新的 Astro 集成。

#### 废弃渲染器

> 如果你的配置文件中自定义了 renderers，请阅读本节。

新的集成系统取代了之前的 `renderers` 系统，包括 npm 上发布的 `@astrojs/renderer-*` 包。今后，`@astrojs/renderer-react` 会变成 `@astrojs/react`，`@astrojs/renderer-vue` 会变成 `@astrojs/vue`，以此类推。

**迁移：**更新 Astro 到 `v0.25.0`，然后运行 `astro dev` 或 `astro build`，其中包含过时的 `"renderers"` 配置的旧配置文件。你会立即看到提醒，告诉你需要根据你当前的配置对你的 `astro.config.mjs` 文件进行的确切修改。你也可以自己更新你的软件包，使用下面的表格。

要想获得更深入的演示，请阅读我们的[分步指南](/zh-cn/guides/integrations-guide/)，了解如何用新的 Astro 框架集成替换现有的渲染器。

```diff
# 安装你的新集成和框架
# （阅读完整的演示：https://docs.astro.build/zh-cn/guides/integrations-guide）
+ npm install @astrojs/lit lit
+ npm install @astrojs/react react react-dom
```

```diff
# 然后更新你的 `astro.config.mjs` 文件：
# （阅读完整的演示：https://docs.astro.build/zh-cn/guides/integrations-guide）
+ import lit from '@astrojs/lit';
+ import react from '@astrojs/react';

export default {
-   renderers: ['@astrojs/renderer-lit', '@astrojs/renderer-react'],
+   integrations: [lit(), react()],
}
```

| npm 中废弃的渲染器           | npm 中的 v0.25+ 集成        |
| --------------------------- | -------------------------- |
| @astrojs/renderer-react     | @astrojs/react             |
| @astrojs/renderer-preact    | @astrojs/preact            |
| @astrojs/renderer-solid     | @astrojs/solid-js          |
| @astrojs/renderer-vue       | @astrojs/vue               |
| @astrojs/renderer-svelte    | @astrojs/svelte            |

#### 处理同伴的依赖关系

> 请阅读本节，如果。你使用 Node v14 **或**如果你使用 npm 以外的任何包管理器。

与旧的渲染器不同，集成不再将框架本身（`react`、`svelte`、`vue` 等）标记为集成的直接依赖项。取而代之的是，你现在需要**在集成的基础之上**再安装你的框架包。

```diff
# 示例：同时安装集成和框架
- npm install @astrojs/react
+ npm install @astrojs/react react react-dom
```

如果你在启动 Astro 时看到 `"Cannot find package 'react'"`（或类似的）警告，这意味着你需要将该包安装到你的项目中。更多信息请参见我们在集成指南中的[关于对等依赖关系说明](/zh-cn/guides/integrations-guide/#handling-integration-dependencies)。

如果你使用的是 `npm` 和 Node v16+，那么 `npm` 可能为你自动处理，因为最新版本的 `npm`（v7+）会自动为你安装类似的对等依赖关系。这种情况下，在项目中安装像 `react` 这样的框架是可选步骤，但仍然推荐。

### 更新语法高亮

我们喜欢找到合理的默认值，即开即用。作为其中的一部分，我们决定让 [Shiki](https://github.com/shikijs/shiki) 成为我们新的默认语法高亮渲染器。它预设使用 `github-dark` 主题，可以在零配置的情况下，为你的代码块提供高亮，没有多余的 CSS 类、样式表或客户端 JS。

请查看我们新的[语法高亮文档](/zh-cn/guides/markdown-content/#语法高亮)以了解全部细节。**如果你想继续 Prism 作为你的语法高亮器**，在你项目的 markdown 配置中[将 `syntaxHighlight` 选项设置为 `prism`](/zh-cn/guides/markdown-content/#prism-配置)。

#### `<Prism />` 组件有了一个新家

作为我们保持 Astro 核心尽可能精简目标的一部分，我们已经将内置的 `Prism` 组件从 `astro/components` 移动到 `@astrojs/prism` 包中。现在你可以从 `@astrojs/prism` 中导入这个组件，像是这样。

```astro
---
import { Prism } from '@astrojs/prism';
---
```

由于 `@astrojs/prism` 包仍然与 `astro` 核心捆绑在一起，你不需要安装任何新的东西，也不需要添加 Prism 作为一个集成！然而，请注意，我们计划在未来将 `@astrojs/prism`（以及一般的 Prism 语法高亮）分离到一个单独的、可安装的包中。更多信息请参见 [`<Prism />` 组件 API 参考](/zh-cn/reference/api-reference/#prism-) 。

### CSS 解析器更新

我们的内嵌 CSS 解析器已经更新，并且对高级 CSS 语法（如容器查询）有了更好的支持。对于大多数用户来说，这应该是一个不可见的变化，但希望进阶级用户会喜欢新的 CSS 功能支持。

## 迁移至 v0.24

> 新的构建策略在 0.24 上默认开启。如果你遇到问题，你可以通过传递 `--legacy-build` 标志继续使用旧的构建策略。请[创建 issue](https://github.com/withastro/astro/issues/new/choose) 以便我们解决新构建策略的问题。

0.24 引入了全新的**静态生成**策略，它改变了一些特性的行为。在以前的 Astro 版本中，这是可用行为选择加入标志：`--experimental-static-build`。

要在迁移前进行过渡，请注意迁移到此新构建引擎所需的以下更改。你可以随时对代码库进行这些更改，以便提前做好准备。

### 废弃 Astro.resolve()

`Astro.resolve()` 允许你获取可能希望在浏览器中引用的资源的解析链接。这通常是在 `<link>` 和 `<img>` 标签中根据需要选择性进行加载的 CSS 文件和图像。不幸的是，由于 Astro 现在在**构建时**而不是在**渲染时**中构建资源，这将不再有效。你需要将引用资源升级到以下几个未来可用项之一：

#### 如何解析 CSS 文件

**1. ESM 导入（推荐）**

**示例：** `import './style.css';`
**适用于：** 如果你的 CSS 文件位于 `src/` 目录中，并且你需要自动 CSS 构建和优化功能。

用 ESM 导入将将 CSS 添加到页面上。Astro 检测这些 CSS 导入，然后自动构建、优化和添加 CSS 到页面。这是从 `Astro.resolve()` 迁移的最简单方法，同时保持 Astro 提供的自动构建/捆绑。

```astro
---
// 示例： Astro 会自动为你包括并优化该 CSS
import './style.css';
---
<html><!-- Your page here --></html>
```

在任何支持 ESM 导入的地方都可以导入 CSS，包括：

- JavaScript 文件
- TypeScript 文件
- Astro 组件前端
- 非 Astro 组件，如 React、Svelte 等

当使用此方法导入 CSS 文件时，任何 `@import` 语句也会被解析并内联到导入的 CSS 文件中。所有 `url()` 引用也相对于源文件进行解析，并且任何 `url()` 引用的资源都将包含在最终构建中。

**2. 绝对路径**

**示例：** `<link href="/style.css">`
**适用于：** 如果你的 CSS 文件位于 `public/` 中，并且你更喜欢自己创建 HTML `link` 元素。

你可以通过组件模板中的绝对路径路径引用 `public/` 目录中的任何文件。如果你想自己控制页面上的 `<link>` 标记，这是一个不错的选择。但是，当你使用上述 `import` 方法时，这种方法也会跳过由 Astro 提供的 CSS 处理、捆绑和优化。

我们建议使用 `import` 方法而非绝对路径方法，因为它在默认情况下提供了最佳的 CSS 性能和功能。

#### 如何解析 JavaScript 文件

**1. 绝对 URL 路径**

**示例：** `<script src="/some-external-script.js" />`
**适用于：** 如果你的 JavaScript 文件位于 `public/` 中。

你可以通过 Astro 组件模板中的绝对路径引用 `public/` 目录中的任何文件。对于外部脚本来说，这是一个很好的默认选项，因为它可以让你自己控制页面上的 `<script>` 标记。

请注意，当你使用下面描述的 `import` 方法时，这种方法会跳过由 Astro 提供的 JavaScript 处理、捆绑和优化。但是，这对于已经发布并与 Astro 分开压缩的任何外部脚本而言可能是首选项。如果你的脚本是从外部源下载的，那么这种方法可能是首选。

**2. 通过`<script hoist>`进行 ESM 导入**

**示例：** `<script lift>import './some-external-script.js';</script>`
**适用于：** 如果你的外部脚本位于 `src/` 内，并且_它支持 ESM 模块类型。

在你的 Astro 模板中的 `<script lift>` 元素内使用 ESM 导入，Astro 将在你的最终构建中包含 JavaScript 文件。 Astro 会检测这些 JavaScript 客户端导入，然后自动构建、优化 JavaScript 并将其添加到页面中。这是从 `Astro.resolve()` 迁移的最简单方法，同时保持 Astro 提供的自动构建/捆绑。

```astro
<script hoist>
  import './some-external-script.js';
</script>
```

请注意，Astro 会将此外部脚本与你的客户端 JavaScript 的其余部分捆绑在一起，并将其加载到 `type="module"` 脚本上下文中。一些较旧的 JavaScript 文件可能不是用 `module` 上下文编写的，在这种情况下，可能需要更新它们以使用此方法。

#### 如何解析图像和其他资源

**1. 绝对路径（推荐）**

**示例：** `<img src="/penguin.png">`
**适用于：**如果你想将资源存储于 `public/`。

如果你把图像放置于 `public/` 中，你可以直接在组件模板中通过绝对路径安全地引用它们。这是目前最简单的引用资源的方法，建议大多数用户在开始使用 Astro 时使用。

**2. ESM 导入**

**示例：** `import imgUrl from './penguin.png'`
**适用于：** 如果你想将资源存储与 `src/` 目录，并想要自动优化功能，如文件名加密。

这可以在任何 JavaScript 或 Astro 组件中使用，并返回一个最终图像的解析链接。一旦你有了解析链接，你就可以在组件模板的任何地方使用它。

```astro
---
// 示例：Astro 将在最终构建中包含此图像文件
import imgUrl from './penguin.png';
---
<img src={imgUrl} />
```

与 Astro 处理 CSS 的方式类似，ESM 导入允许 Astro 自动为你执行一些简单的构建优化。例如，任何使用 ESM 导入 `src/`内资源（如 `import imgUrl from './penguin.png'`）将自动对其文件名进行加密。这可以让你在服务器上更积极地缓存文件，提高用户性能。在未来，Astro 可能会添加更多像这样的优化。

**提示：** 如果你不喜欢静态 ESM 导入，Astro 也支持动态 ESM 导入。如果你喜欢这种语法，我们推荐使用这个选项。`<img src={(await import('./penguin.png')).default}. />`。

### 废弃 `<script>` 默认处理

以前, 所有的 `<script>` 元素都会自动写入最终的 HTML 输出、处理和捆绑中。这将不再是默认行为。从 0.24 起，你必须在选择要处理的 `<script>` 元素上加上 `hoist` 属性。Hoist 模块同样需要使用 `type="module"`。

```astro
<script>
  // Will be rendered into the HTML exactly as written!
  // ESM imports will not be resolved relative to the file.
</script>
<script type="module" hoist>
  // Processed! Bundled! ESM imports work, even to npm packages.
</script>
```

## 迁移至 v0.23

### 丢失 Sass 错误

```
Preprocessor dependency "sass" not found. Did you install it?
```

我们在探索减小 npm 安装大小，我们将 [Sass](https://sass-lang.com/) 移动到外部作为一个可选依赖。如果你在项目中使用 Sass，你可以通过运行 `npm install sass --save-dev`  将其作为依赖。

### 废弃未转义的 HTML

在 Astro v0.23+ 中，现在表达式中的未转义的 HTML 内容被废弃了。
在未来的版本，表达式中的内容将提供字符串转义以防御意外的 HTML 注入。

```diff
- <h1>{title}</h1> <!-- <h1>Hello <strong>World</strong></h1> -->
+ <h1>{title}</h1> <!-- <h1>Hello &lt;strong&gt;World&lt;/strong&gt;</h1> -->
```

要继续注入未转义的 HTML，你现在可以使用 `set:html`。

```diff
- <h1>{title}</h1>
+ <h1 set:html={title} />
```

要避免使用嵌套元素，可以将 `set:html` 和 `<Fragment>` 一起使用。

```diff
- <h1>{title}!</h1>
+ <h1><Fragment set:html={title}>!</h1>
```

你也可以使用 `set:text` 防御意外的 HTML 注入。

```astro
<h1 set:text={title} /> <!-- <h1>Hello &lt;strong&gt;World&lt;/strong&gt;</h1> -->
```

## 迁移至 v0.21

### Vite

从 v0.21 开始，Astro 将使用 [Vite] 进行构建。
因此写在 `snowpack.config.mjs` 中的配置需要移动到 `astro.config.mjs`。

```js
// @ts-check

/** @type {import('astro').AstroUserConfig} */
export default {
  renderers: [],
  vite: {
    plugins: [],
  },
};
```

了解更多配置 Vite，的信息，请访问它们的[配置指南](https://vitejs.dev/config/)。

#### Vite 插件

在 Astro v0.21+ 中，可以 `astro.config.mjs` 在中配置 Vite 插件。

```js
import { imagetools } from 'vite-imagetools';

export default {
  vite: {
    plugins: [imagetools()],
  },
};
```

了解更多 Vite 插件信息，请访问它们的[插件指南](https://vitejs.dev/guide/using-plugins.html)。

#### 渲染器改用 Vite

在 Astro v0.21+ 插件现在需要使用 `viteConfig()`。

```diff
// renderer-svelte/index.js
+ import { svelte } from '@sveltejs/vite-plugin-svelte';

export default {
  name: '@astrojs/renderer-svelte',
  client: './client.js',
  server: './server.js',
-  snowpackPlugin: '@snowpack/plugin-svelte',
-  snowpackPluginOptions: { compilerOptions: { hydratable: true } },
+  viteConfig() {
+    return {
+      optimizeDeps: {
+        include: ['@astrojs/renderer-svelte/client.js', 'svelte', 'svelte/internal'],
+        exclude: ['@astrojs/renderer-svelte/server.js'],
+      },
+      plugins: [
+        svelte({
+          emitCss: true,
+          compilerOptions: { hydratable: true },
+        }),
+      ],
+    };
+  },
}
```

了解更多 Vite 插件信息，请访问它们的[插件指南](https://vitejs.dev/guide/using-plugins.html)。

> 在之前的版本中，它们使用 `snowpackPlugin` 或 `snowpackPluginOptions` 进行配置。

### 别名

在 v0.21+ 中，可以在 `tsconfig.json` 或 `jsconfig.json` 中添加导入别名。

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["src/components/*"]
    }
  }
}
```

_[VSCode](https://code.visualstudio.com/docs/languages/jsconfig) 和其他编辑器将自动集成这些别名._

### 导入中使用文件扩展名

在 Astro v0.21+ 中，需要附带文件在磁盘上真实的扩展名。如 `Div.tsx` 需要用 `Div.tsx`，而不能是 `Div.jsx`。

```diff
- import Div from './Div.jsx' // Astro v0.20
+ import Div from './Div.tsx' // Astro v0.21
```

这个更改同样适用于需要通过编译转换为 css 的文件 如 `Div.scss`：

```diff
- <link rel="stylesheet" href={Astro.resolve('./Div.css')}>
+ <link rel="stylesheet" href={Astro.resolve('./Div.scss')}>
```

### 移除 Frontmatter 中的组件

以前你可以在 Astro Frontmatter 中使用 JSX 语法替代 Astro 组件语法来创建小型 它很酷，但最新的编译器不再支持。我们希望在未来的 Astro 版本中使用不同的、非 JSX API 的方式重新引入这个特性。

要迁移至 v0.21+，请将所有 JSX Astro 组件（也就所有在其他组件 frontmatter 中创建的 Astro 组件）转换成独立组件。
### 样式更改

#### Autoprefixer

Autoprefixer 不再默认运行，要启用需要：

1. 安装最新版本 (`npm i autoprefixer`)
2. 在项目根目录创建 `postcss.config.cjs` 文件并输入：

   ```js
   module.exports = {
     plugins: {
       autoprefixer: {},
     },
   };
   ```

#### Tailwind CSS

确保你安装了 PostCSS 。它在上一个版本中是可选的，但现在必须要安装了：

1. 安装最新版本的 postcss (`npm i -D postcss`)
2. 在项目根目录创建 `postcss.config.cjs` 文件并输入：

   ```js
   module.exports = {
     plugins: {
       tailwindcss: {},
     },
   };
   ```

   阅读 [Tailwind CSS 文档](https://tailwindcss.com/docs/installation#add-tailwind-as-a-post-css-plugin)了解更多信息

### 已知问题

#### 顶部导入

在 Astro v0.21+ 中引入了一个 bug，内部导入必须处于顶部。

```astro
---
import Component from '../components/Component.astro'
const whereShouldIPutMyImports = "on top!"
---
```

[vite]: https://vitejs.dev
