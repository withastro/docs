---
layout: ~/layouts/MainLayout.astro
title: 配置 Astro
---

在 `astro.config.mjs` 文件中自定义 Astro 的运行方式。它在 Astro 项目中十分常见，所有官方的示例模板和主题都默认附带。

📚 阅读 Astro [API 的配置参考](/zh-cn/reference/configuration-reference/)以概览所有支持的配置项。

## Astro 配置文件

一个有效的 Astro 配置文件用推荐的 `defineConfig` 助手函数和 `default` 导出其配置。

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // 你的配置项都在这里
  // https://docs.astro.build/zh-cn/reference/configuration-reference/
})
```

你可以选择使用 `defineConfig()` 以便 IDE 可以提供自动类型提示。一个最基本的有效配置文件应该是这样：

```js
// 最基础完全空白的配置文件
export default {}
```

## 受支持的配置文件类型

Astro 支持多种 JavaScript 配置文件格式，如：`astro.config.js`、`astro.config.mjs`、`astro.config.cjs` 和 `astro.config.ts`。

TypeScript 配置文件使用 [`tsm`](https://github.com/lukeed/tsm) 出来并尊重项目中的 tsconfig 选项。

## 配置文件解析

Astro 将自动尝试解析项目根目录下名为 `astro.config.mjs` 的文件。I如果没在根目录下找到配置文件，则会使用默认配置：

```bash
# 示例：从 ./astro.config.mjs 中读取配置
astro build
```

你也可以用 `--config` CLI 标志明确指出要使用的配置文件。这个 CLI 标志将基于你运行 `astro` 命令的目录进行解析。

```bash
# 示例：从这个文件中读取配置
astro build --config my-config-file.js
```

## 配置智能提示

Astro 建议在配置文件中使用 `defineConfig()` 助手函数。IDE 将借助 `defineConfig()` 为你提供智能提示。像 VSCode 这样的编辑器就能够读取 Astro 的 TypeScript 类型定义并自动提供 jsdoc 类型提示，即使你的配置文件不是用 TypeScript 写的。

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // 你的配置项都在这里
  // https://docs.astro.build/zh-cn/reference/configuration-reference/
})
```

你也可以使用 JSDoc 标注，手动向 VSCode 提供类型定义。

```js
// astro.config.mjs
 export default /** @type {import('astro').AstroUserConfig} */ ({
  // 你的配置项都在这里
  // https://docs.astro.build/zh-cn/reference/configuration-reference/
}
```

## Referencing Relative Files

如果你提供了 `root` 相对路径或 `--root` CLI 标志，Astro 将基于你运行 `astro` 命令的目录来解析。

```js
export default defineConfig({
    // 基于你当前的工作目录解析 "./foo" 目录
    root: 'foo'
})
```

Astro 会将所有其他相对文件和目录字符串解析为相对于项目根目录的字符串：

```js
export default defineConfig({
    //  基于你当前的工作目录解析 "./foo" 目录
    root: 'foo',
    //  基于你当前的工作目录解析 "./foo/public" 目录
    publicDir: 'public',
})
```

使用 `import.meta.url` 引用相对于配置文件的文件或目录（除非你正在编写 common.js 模块标准的 `astro.config.cjs` 文件）。

```js
export default defineConfig({
    // 基于配置文件解析 "./foo" 目录
    root: new URL("./foo", import.meta.url),
    // 基于配置文件解析 "./public" 目录
    publicDir: new URL("./public", import.meta.url),
})
```

## 配置参考

📚 阅读 Astro [API 的配置参考](/zh-cn/reference/configuration-reference/)以概览所有支持的配置选项。
