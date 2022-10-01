---
layout: ~/layouts/MainLayout.astro
title: TypeScript
description: 了解如何使用 Astro 内置的 TypeScript 支持。
---

Astro 内置了对 [TypeScript](https://www.typescriptlang.org/) 的支持。你可以在 Astro 项目中导入 `.ts` 和 `.tsx` 文件，甚至可以直接在 [Astro 组件](/zh-cn/core-concepts/astro-components/#组件脚本) 中编写 TypeScript 代码。

Astro 本身并不执行任何类型检查。类型检查应该在 Astro 之外进行，或者由 IDE 亦或是使用单独的脚本空虚检查。[Astro VSCode 扩展](/zh-cn/editor-setup/) 会在你打开文件时自动提供 TypeScript 提示和错误提醒。

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

Astro 支持你在 `tsconfig.json` 和 `jsconfig.json` 文件里的 `paths` 配置所定义的 [导入别名](/zh-cn/guides/aliases/)。[阅读我们的指南](/zh-cn/guides/aliases/)以了解更多。

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

Astro 支持通过 TypeScript 输入你的组件参数。为了启动它，你需要将一个名为 `Props` 的 TypeScript 接口添加到你的的组件。[Astro VSCode 扩展](/zh-cn/editor-setup/)会自动寻找 `Props` 接口，并且当你在其他模板内使用该组件时，给你提供适当的 TS 支持。

```astro
---
// Example: HelloWorld.astro
interface Props {
  name: string;
  greeting?: string;
}
const { greeting = 'Hello', name } = Astro.props
---
<h2>{greeting}, {name}!</h2>
```

### 常见的 prop 类型套路

- 如果你的组件没有任何的参数或插槽，你可以使用 `type Props = Record<string, never>`。

- 如果你的组件必须将一个子组件传递给默认插槽，你可以使用 `type Props = { children: any; };`。

### 内置的属性类型

Astro 提供 JSX 类型定义来检查你的代码是否使用了有效的 HTML 属性。你可以使用这些类型来帮助构建组件 props。例如，如果你正在构建一个 `<Link>` 组件，你可以通过以下语法来为组件的 Prop 类型重用默认的 HTML 属性。

```astro title="src/components/Link.astro" ins={2}
---
type Props = astroHTML.JSX.AnchorHTMLAttributes;
const { href, ...attrs } = Astro.props;
---
<a {href} {...attrs}>
  <slot />
</a>
```

也可以通过在 `.d.ts` 文件中重新声明命名空间 `astroHTML.JSX`，来为默认的 JSX 定义扩展非标准属性。

```ts
// src/custom-attributes.d.ts

declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    'data-count'?: number;
    'data-label'?: string;
  }
}
```

:::note
`astroHTML` 被全局注入到 `.astro` 组件中。如果要在 TypeScript 文件中使用它，请使用一个[三斜杠指令（triple-slash directive）](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html)来进行引用：

```ts
/// <reference types="astro/astro-jsx" />

type MyAttributes = astroHTML.JSX.ImgHTMLAttributes;
```
:::

## 类型检验

要在编辑器中查看类型错误，请确保已安装 [Astro VS Code 扩展](/zh-cn/editor-setup/)。请注意，`astro start` 和 `astro build` 命令将使用 esbuild 转译代码，但不会运行任何类型检查。为了防止你的代码在包含 TypeScript 错误的情况下被构建，请将你 `package.json` 中的“build”脚本更改为以下内容：

```json title="package.json" del={2} ins={3} ins="astro check && tsc --noEmit && "
  "scripts": {
    "build": "astro build",
    "build": "astro check && tsc --noEmit && astro build",
  },
```

:::note
`astro check` 仅检查 `.astro` 文件中的类型，而 `tsc --noEmit` 仅检查 `.ts` 和 `.tsx` 文件中的类型。要检查 Svelte 和 Vue 文件中的类型，可以使用 [`svelte-check`](https://www.npmjs.com/package/svelte-check) 和 [`vue-tsc`](https://www.npmjs.com/package/vue-tsc) 包。
:::

📚 阅读更多关于 Astro 中的 [`.ts` 文件导入](/zh-cn/guides/imports/#typescript)。
📚 阅读更多关于 [TypeScript 配置](https://www.typescriptlang.org/tsconfig/)。

## Troubleshooting

### Errors Typing multiple JSX frameworks at the same time

An issue may arise when using multiple JSX frameworks in the same project, as each framework requires different, sometimes conflicting, settings inside `tsconfig.json`.

**Solution**: Set the [`jsxImportSource` setting](https://www.typescriptlang.org/tsconfig#jsxImportSource) to `react` (default), `preact` or `solid-js` depending on your most-used framework. Then, use a [pragma comment](https://www.typescriptlang.org/docs/handbook/jsx.html#configuring-jsx) inside any conflicting file from a different framework.

For the default setting of `jsxImportSource: react`, you would use:

```jsx
// For Preact
/** @jsxImportSource preact */

// For Solid
/** @jsxImportSource solid-js */
```

### Vue components are mistakenly typed by the `@types/react` package when installed

The types definitions from the `@types/react` package are declared globally and therefore will be mistakenly used to typecheck `.vue` files when using [Volar](https://github.com/johnsoncodehk/volar).

**Status**: Expected behavior.

**Solution**: There's currently no reliable way to fix this, however a few solutions and more discussion can be found in [this GitHub discussion](https://github.com/johnsoncodehk/volar/discussions/592).
