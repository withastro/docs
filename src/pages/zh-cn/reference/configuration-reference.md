---
layout: ~/layouts/MainLayout.astro
title: 配置参考
setup: |
  import Since from '../../../components/Since.astro';
---

下面的参考资料涵盖了 Astro 所有支持的配置选项。要了解更多关于配置 Astro 的信息，请阅读我们的[配置 Astro 指南](/zh-cn/guides/configuring-astro/)。

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // 你的配置在这里...
})
```

## 顶层选项

### root

<p>

**类型**：`string`<br>
**CLI:** `--root`<br>
**默认**：`"."` (current working directory)
</p>

只有当你在项目根目录以外的目录下运行 `astro` CLI 命令时，你才应该提供该选项。通常，这个选项是通过 CLI 而不是 [Astro 配置文件](/zh-cn/guides/configuring-astro/#supported-config-file-types)提供的，因为 Astro 需要知道项目根目录才能找到配置文件。

如果提供相对路径（例如：`--root: './my-project'`），Astro 会根据你当前的工作目录进行解析。

#### 示例

```js
{
  root: './my-project-directory'
}
```

```bash
$ astro build --root ./my-project-directory
```

### srcDir

<p>

**类型**：`string`<br>
**默认**：`"./src"`
</p>

设置 Astro 将读取网站的目录。

这个值可以是绝对路径，也可以是相对路径。

```js
{
  srcDir: './www'
}
```

### publicDir

<p>

**类型**：`string`<br>
**默认**：`"./public"`
</p>

设置静态资源目录。这个目录下的文件在开发过程中被提供给 `/`，在构建过程中被复制到构建目录。这些文件总是按原样提供或复制的，没有转换或捆绑。

这个值可以是绝对路径，也可以是相对路径。

```js
{
  publicDir: './my-custom-publicDir-directory'
}
```

### outDir

<p>

**类型**：`string`<br>
**默认**：`"./dist"`
</p>

设置 `astro build` 将你的最终构建写入的目录。

这个值可以是绝对路径，也可以是相对路径。

```js
{
  outDir: './my-custom-build-directory'
}
```

### site

<p>

**类型**：`string`
</p>

你最终部署的链接。Astro 会使用这个完整的链接来生成网站地图和最终构建的规范链接。强烈建议你设置这个配置项，以获得 Astro 最佳体验。

```js
{
  site: 'https://www.my-site.dev'
}
```

### base

<p>

**类型**：`string`
</p>

你要部署到的基本路径。Astro 在开发过程中会匹配这个路径名，这样你的开发环境就会尽可能地与你的构建环境匹配。在下面的例子中，`astro dev` 会在 `/docs` 处启动你的服务器。

```js
{
  base: '/docs'
}
```

### trailingSlash

<p>

**类型**：`'always' | 'never' | 'ignore'`<br>
**默认**：`'ignore'`
</p>

设置设计服务器的路由匹配行为。从以下选项中选择：

- `'always'` - 只匹配包含尾部斜线的链接（例如：`/foo/`）。
- `'never'` - 不匹配包含尾部斜线的链接（例如：`/foo`）。
- `'ignore'`- 匹配链接，不管是否存在尾部的 `/`。

如果你的生产主机对尾部斜杠的工作或不工作有严格的处理方式，请使用该配置选项。

如果你希望自己更严格一些，那么你也可以设置这个选项，这样在开发过程中，无论是否有尾部斜杠的URL都不会工作。

```js
{
  // 例子。在开发过程中要求有尾部斜线
  trailingSlash: 'always'
}
```

**另见**：

- buildOptions.pageUrlFormat

## 构建选项

### build.format

<p>

**类型**：`('file' | 'directory')`<br>
**默认**：`'directory'`
</p>

控制每个页面的输出文件格式：

- 如果是'file'，Astro将为每个页面生成一个HTML文件（例如："/foo.html"）。
- 如果是'directory'，Astro将为每个页面生成一个有嵌套的`index.html`文件的目录（例如："/foo/index.html"）。

```js
{
  build: {
    // 示例：在构建过程中生 成`page.html` 而不是 `page/index.html`。
    format: 'file'
  }
}
```

## 服务器选项

定制 Astro 开发服务器，适用于 `astro dev` 和 `astro preview`。

```js
{
  server: { port: 1234, host: true}
}
```

要根据运行的命令（`dev`、`preview`）设置不同的配置，也可以向这个配置选项传递函数。

```js
{
  // 示例：使用函数语法，根据命令进行定制
  server: (command) => ({ port: command === 'dev' ? 3000 : 4000 })
}
```

### server.host

<p>

**类型**：`string | boolean`<br>
**默认**：`false`<br>
<Since v="0.24.0" />
</p>

设置服务器应该监听哪些网络 IP 地址（即非本地主机 IP）。

- `false`- 不在网络 IP 地址上公开
- `true`- 侦听所有地址，包括 LAN 和公开地址
- `[custom-address]` - 在 `[custom-address]` 网络 IP 地址上公开（例如：`192.168.0.1`）。

### server.port

<p>

**类型**：`number`<br>
**默认**：`3000`
</p>

设置服务器监听端口。

如果给定的端口已经在使用，Astro 会自动尝试下一个可用的端口。

```js
{
  server: { port: 8080 }
}
```

## Markdown 选项

### markdown.drafts

<p>

**类型**：`boolean`<br>
**默认**：`false`
</p>

控制 markdown 草稿页是否应该被包含在构建中。

如果 markdown 页面在 frontmatter 中包含 `draft: true`，那么它就被认为是草稿。在开发过程中会显示草稿页（`astro dev`），但在默认情况下，它们不会被包含在你的最终构建中。

```js
{
  markdown: {
    // 示例：在你的最终构建中包括所有的草稿
    drafts: true,
  }
}
```

### markdown.shikiConfig

<p>

**类型**：`Partial<ShikiConfig>`
</p>

Shiki 配置选项。使用方法见 [markdown 配置文档](/zh-cn/guides/markdown-content/#shiki-配置)。

### markdown.syntaxHighlight

<p>

**类型**：`'shiki' | 'prism' | false`<br>
**默认**：`shiki`
</p>

可供使用的语法高亮器：

- `shiki` - 使用 [Shiki](https://github.com/shikijs/shiki) 高亮器
- `prism` - 使用 [Prism](https://prismjs.com/) 高亮器
- `false` - 不使用语法高亮。

```js
{
  markdown: {
    // 示例：在 Markdown 中使用 prism 进行语法高亮显示
    syntaxHighlight: 'prism',
  }
}
```

### markdown.remarkPlugins

<p>

**类型**：`RemarkPlugins`
</p>

通过自定义 [Remark](https://github.com/remarkjs/remark)插件来定制 Markdown 构建方式。

**注意**：启用自定义的 `remarkPlugins` 或 `rehypePlugins` 会移除 Astro 对[GitHub-flavored Markdown](https://github.github.com/gfm/) 和 [Smartypants](https://github.com/silvenon/remark-smartypants) 的内置支持。如果有需要，你必须明确地将这些插件添加到 `astro.config.mjs` 文件中。

```js
{
  markdown: {
    // 示例：Astro 所使用的默认 remark 插件集
    remarkPlugins: ['remark-gfm', 'remark-smartypants'],
  },
};
```

### markdown.rehypePlugins

<p>

**类型**：`RehypePlugins`
</p>

通过自定义 [Rehype](https://github.com/remarkjs/remark-rehype) 插件来定制你的Markdown的构建方式。

**注意**：启用自定义 `remarkPlugins` 或 `rehypePlugins` 会移除 Astro 对 [GitHub-flavored Markdown](https://github.github.com/gfm/) 和 [Smartypants](https://github.com/silvenon/remark-smartypants) 的内置支持。如果由需要，你必须明确地将这些插件添加到 `astro.config.mjs` 文件中。

```js
{
  markdown: {
    // 示例：Astro 所使用的默认 rehype 插件集
    rehypePlugins: [],
  },
};
```

## 集成

用自定义集成来扩展 Astro 功能。你可以用集成来添加框架支持（如 Solid.js）、新功能（如站点地图）和新库支持（如 Partytown 和 Turbolinks）。

请阅读我们的[集成指南](/zh-cn/guides/integrations-guide/)，以帮助开始使用Astro集成。

```js
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
{
  // 示例：添加 React + Tailwind 支持
  integrations: [react(), tailwind()]
}
```

## Vite

传递额外的配置选项给 Vite。适用于需要使用一些 Astro 不支持的高级配置。

在 [vitejs.dev](https://vitejs.dev/config/) 上查看完整的 `vite` 配置对象文档。

#### 示例

```js
{
  vite: {
    ssr: {
      // 示例；如果需要的话，可以强制破坏性包跳过 SSR 处理
      external: ['broken-npm-package'],
    }
  }
}
```

```js
{
  vite: {
    // 示例：直接在 Astro 项目中添加自定义 Vite 插件
    plugins: [myPlugin()],
  }
}
```
