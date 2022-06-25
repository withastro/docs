---
layout: ~/layouts/MainLayout.astro
title: 使用环境变量
description: 学习如何在 Astro 项目中使用环境变量
---

Astro 使用 Vite 的环境变量，并允许你[使用它们的任一方式](https://vitejs.dev/guide/env-and-mode.html)获取并设置环境变量。

注意**所有**环境变量都对服务端代码可见，出于安全考虑只有以 `PUBLIC_` 开始的环境变量才会对客户端代码可见。

查看官方的[环境变量示例](https://github.com/withastro/astro/tree/main/examples/env-vars)了解最佳实践。

```ini
SECRET_PASSWORD=password123
PUBLIC_ANYBODY=there
```

在这个示例中，`PUBLIC_ANYBODY`（通过 `import.meta.env.PUBLIC_ANYBODY` 访问) ，而 `SECRET_PASSWORD`（通过 `import.meta.env.SECRET_PASSWORD` 访问）将只对服务端可见。

## 默认环境变量

Astro 包括了几个开箱即用的环境变量:

- `import.meta.env.MODE`（`development` | `production`）：站点的运行模式。在运行 `astro dev` 时为 `development`，在运行 `astro build` 时为 `production`。
- `import.meta.env.BASE_URL`（`string`）：站点运行的基础链接。它由 [`base` 配置项](/zh-CN/reference/configuration-reference/#base) 决定。
- `import.meta.env.PROD`（`boolean`）：你的站点是否运行在生产环境。
- `import.meta.env.DEV`（`boolean`）: 你的站点是否运行子啊开发环境（总是和 `import.meta.env.PROD` 相反）。
- `import.meta.env.SITE`（`string`）：特指项目中 `astro.config` 中的 [`site` 项](/zh-cn/reference/configuration-reference/#site)。

## 设置环境变量

环境变量会从项目目录中的 `.env` 文件中加载。

你也可以在文件名上附加一个模式（`production` 或 `development`），如 `.env.production` 或 `.env.development`，这使得环境变量只在该模式下生效。

只要在项目目录下创建 `.env` 文件，并在其中添加一些变量。

```bash
# .env
# 这只有在服务器上运行时才会有效!
DB_PASSWORD="foobar"
# 这在什么地方都有效！
PUBLIC_POKEAPI="https://pokeapi.co/api/v2"
```

```ini
.env                # 加载所有变量
.env.local          # 加载所有变量，被 git 忽略
.env.[mode]         # 只在特定模式下加载
.env.[mode].local   # 只在特定模式下加载，被 git 忽略
```

## 获取环境变量

在 Vite 中，你可以使用 `process.env`，而不是使用 `import.meta.env`，它使用了 ES2020 中添加的 `import.meta` 功能。

::提示[不用担心浏览器支持] 。
Vite 将用静态值替换所有 `import.meta.env` 内容。
:::

例如，使用 `import.meta.env.PUBLIC_POKEAPI` 来获取 `PUBLIC_POKEAPI` 环境变量。

```js
// 当 import.meta.env.SSR === true
const data = await db(import.meta.env.DB_PASSWORD);

// 当 import.meta.env.SSR === false
const data = fetch(`${import.meta.env.PUBLIC_POKEAPI}/pokemon/squirtle`);
```

:::caution
因为 Vite 静态地替换了 `import.meta.env`，所以你不能用 `import.meta.env[key]` 这样的动态键来访问它。
:::

## TypeScript 智能提示

默认情况，Vite 在 `vite/client.d.ts` 中为 `import.meta.env` 提供类型定义。

虽然你可以在 `.env.[模式]` 文件中定义更多的自定义环境变量，但你可能想为自行定义的环境变量提供 TypeScript 的智能提示。这些变量的前缀是 `PUBLIC_`。

为了实现这一点，你可以在 `src/` 中创建一个 `env.d.ts`，并像这样配置 `ImportMetaEnv`。

```ts
interface ImportMetaEnv {
  readonly DB_PASSWORD: string;
  readonly PUBLIC_POKEAPI: string;
  // 更多环境变量…
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```
