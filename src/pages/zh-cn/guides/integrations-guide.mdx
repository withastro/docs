---
layout: ~/layouts/MainLayout.astro
title: 使用集成
---

使用 **Astro 集成**只需几行代码就能为你的项目添加新的功能和行为。你可以自己编写一个自定义的集成，或者从 [npm](https://www.npmjs.com/search?q=keywords%3Aastro-component&ranking=popularity) 获取流行集成。

- 解锁 React、Vue、Svelte、Solid 和其他流行的 UI 框架。
- 只需几行代码就能整合 Tailwind 和 Partytown 等工具。
- 为你的项目添加新功能，如自动生成网站地图。
- 编写自定义代码，与构建过程、开发服务器等挂钩。

:::note[实验性]
目前只默认支持官方 Astro 集成（发布在 npm 的 `@astrojs/` 范围包），以保护用户不被破坏。

**启用第三方集成**：使用 `--experimental-integrations` CLI 标志运行 Astro，或在 Astro 配置文件中包括 `experimental: { integrations: true }`。
:::

## 教程：在项目中添加 React

在这个例子中，我们将添加 `@astrojs/react` 集成，好让你的 Astro 项目支持 React。添加任何其他框架（Preact、Vue、Svelte 或 Solid.js）的过程几乎都是相同的，可以使用下面概述的相同步骤。

:::tip[快速开始]
Astro 提供了 `astro add` 命令，你可以运行它自动完成添加官方 Astro 集成这一过程。你可以运行 `npx astro add react`，而不是下面的步骤。

跳到[自动集成设置](#自动集成设置)了解更多细节。
:::

首先，你需要安装集成和任何你希望在项目中使用的相关包。对于 React 来说，你需要安装 `@astrojs/react`集成***和*** `react` + `react-dom` 包。

```bash
npm install --save-dev @astrojs/react
```

当包安装完成后，在你的 `astro.config.mjs` 项目配置文件中添加两行新内容。

```diff
  // astro.config.mjs
  import { defineConfig } from 'astro/config';
+ import react from '@astrojs/react';

  export default defineConfig({
+   integrations: [react()],
  });
```

第一行是导入语句，将集成导入到你的配置文件中。第二行调用集成函数（`react()`）并添加集成，Astro 就知道要使用它了。

这就是了! 重新启动 Astro，新的集成应该立即生效。

如果你在启动时看到一个错误，请确保你：

- ✅ 使用 npm 安装了所需的包
- ✅ 在 `astro.config.mjs` 文件中导入了集成
- ✅ 以函数形式调用你的集成（`[react()]`，而不是 `[react]`）。
- ✅ 删除废弃 `renderers:` 配置（v0.25 前曾使用）。

## 自动集成设置

Astro 最近推出了**实验性的** `astro add` 命令来自动设置集成。

:::caution
在更新你的任何文件之前，我们都会要求你进行确认，但为了以防万一，请做好备份。
:::

不需要上述的手动配置，只需运行 `astro add [name]`，我们的自动集成向导将更新你的配置文件并安装任何必要的依赖。

```shell
# 使用 NPM
npx astro add react
# 使用 Yarn
yarn astro add react
# 使用 PNPM
pnpx astro add react
```

甚至还可以同时配置多个集成!

```shell
# 使用 NPM
npx astro add react tailwind partytown
# 使用 Yarn
yarn astro add react tailwind partytown
# 使用 PNPM
pnpx astro add react tailwind partytown
```

## 处理集成依赖

当在你的项目中安装 Astro 集成时，请留新所有你在安装步骤中看到的“缺失对等依赖（missing peer dependencies）”的警告。不是所有的包管理器都会自动为你安装对等依赖。如果你是在 Node v16 以上并且使用 npm，则不需要担心。

如果你在启动 Astro 时看到 `"Cannot find package 'react'"` 或其他类似警告，这意味着你需要手动安装该包。例如，React 是 `@astrojs/react` 集成的对等依赖。这意味着除安装集成外还需安装官方的 `react` 和 `react-dom` 包。然后，该集成将自动从这些包中提取。

```diff
# 示例：同时安装集成和框架
- npm install @astrojs/react
+ npm install @astrojs/react react react-dom
```

如果你忘记了这一步，不用担心，如果项目中缺失任一对等依赖，Astro 都会在启动时警告你。

自行管理对等依赖关系可能有点费劲，但它也使得你可以准确地控制所用包版本，如 React、Tailwind 等。这使得你对项目拥有了更大的控制权。

在未来，`astro add` 命令将能够为你处理所有这些设置，并为你的集成自动安装正确的对等依赖。

## 使用集成

Astro 集成总是添加在 `astro.config.mjs` 文件中的 `integrations` 属性。

:::tip[需要特定集成的更多信息?]
在我们的[集成目录](https://astro.build/integrations/)中找到它，并按照其在 GitHub 上的存储库的链接，了解详细的使用和配置说明。
:::

有三种常见的方法来导入集成到你的 Astro 项目：

1. 安装 npm 包集成。
2. 从项目内部的本地文件导入你自己的集成。
3. 直接在配置文件中内联编写集成。

```js
// astro.config.mjs
import {defineConfig} from 'astro/config';
import installedIntegration from '@astrojs/vue';
import localIntegration from './my-integration.js';

export default defineConfig({
  integrations: [
    // 1. 从已安装的 npm 包中导入
    installedIntegration(),
    // 2. 从本地 JS 文件导入
    localIntegration(),
    // 3. 内联对象
    {name: 'namespace:id', hooks: { /* ... */ }},
  ]
})
```

查看[集成 API](/zh-cn/reference/integrations-reference/)参考资料，了解所有不同地集成编写方式。

### 自定义选项

集成几乎都是以工厂函数的形式编写的，并返回真实的集成对象。这使得你可以通过向工厂函数传递参数和选项定制集成。

```js
integrations: [
  // 示例：用函数参数来定制你的集成
  sitemap({filter: true})
]
```

### 切换集成

你可以切换集成启用状态，而不用担心遗留的 `undefined` 和布尔值问题，Astro 会自动忽略禁用集成。

```js
integrations: [
  // 示例：不在 Windows 上构建网站地图
  process.platform !== 'win32' && sitemap()
]
```

## 构建自己的集成

Astro 的集成 API 受到 Rollup 和 Vite 的启发，设计得让任何曾经写过 Rollup 或 Vite 插件的人都感到熟悉。

查看[集成 API](/zh-cn/reference/integrations-reference/)，了解集成的作用以及如何自己写一个。
