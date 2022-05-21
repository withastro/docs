---
layout: ~/layouts/MainLayout.astro
title: TypeScript
description: 了解如何使用 Astro 内置的 TypeScript 支持。
---

Astro 内置了对 [TypeScript](https://www.typescriptlang.org/) 的支持。你可以在 Astro 项目中导入 `.ts` 和 `.tsx` 文件，甚至可以直接在 [Astro 组件](/zh-CN/core-concepts/astro-components/#the-component-script) 中编写 TypeScript 代码。

Astro 本身并不执行任何类型检查。类型检查应该在 Astro 之外进行，或者由 IDE 亦或是使用单独的脚本空虚检查。[Astro VSCode 扩展](/zh-CN/editor-setup/) 会在你打开文件时自动提供 TypeScript 提示和错误提醒。

## 设置

**强烈建议**你在项目中创建 `tsconfig.json` 文件，这样 Astro 和 VSCode 等工具就知道该如何理解你的项目。如果没有 `tsconfig.json` 文件，TypeScript 则并不能完全支持某些功能（比如 npm 包导入）。

一些 TypeScript 配置选项在 Astro 中需要特别注意。下面是我们推荐的入门 `tsconfig.json` 文件，你可以复制并粘贴到你自己的项目中。每个 [astro.new 模板](https://astro.new/)都默认包括这个 `tsconfig.json` 文件。

```json
// 示例：Astro 项目自带的 tsconfig.json
{
  "compilerOptions": {
    // 启用顶层 await 和其他现代 ESM 功能。
    "target": "ESNext",
    "module": "ESNext",
    // 启用用于 npm 软件包导入的 node 式模块解析，
    "moduleResolution": "node",
    // 启用 JSON 导入。
    "resolveJsonModule": true,
    // 启用更严格的转译，以获得更好的输出。
    "isolatedModules": true,
    // 给 Vite 运行时添加类型定义。
    "types": ["vite/client"]
  }
}
```

## 类型导入

尽可能使用类型导入和导出。这将帮助你避免极端情况，即 Astro 的捆绑器可能尝试把它们当作 JavaScript 并错误地捆绑你的导入类型。

```diff
- import { SomeType } from './script';
+ import type { SomeType } from './script';
```

## 导入别名

Astro 支持你在 `tsconfig.json` 和 `jsconfig.json` 文件里的 `paths` 配置所定义的 [导入别名](/zh-CN/guides/aliases/)。[阅读我们的指南](/zh-CN/guides/aliases/)以了解更多。

```ts
import HelloWorld from '@components/HelloWorld.astro';
import Layout from '@layouts/Layout.astro';
```

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"]
    }
  }
}
```

## 组件参数

Astro 支持通过 TypeScript 输入你的组件参数。要启用你的 Astro 组件则需要导出 TypeScript `Props` 接口。[Astro VSCode 扩展](/zh-CN/editor-setup/)会自动寻找 `Props` 接口，当你在其他模板内使用该组件时，会给提供一定的 TS 支持。

```astro
---
// Example: HelloWorld.astro
export interface Props {
  name: string;
  greeting?: string;
}
const { greeting = 'Hello', name } = Astro.props
---
<h2>{greeting}, {name}!</h2>
```

📚 阅读更多关于 Astro 中的 [`.ts` 文件导入](/en/guides/imports/#typescript)。
📚 阅读更多关于 [TypeScript 配置](https://www.typescriptlang.org/tsconfig/)。
