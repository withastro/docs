---
layout: ~/layouts/MainLayout.astro
setup: |
  import Badge from '~/components/Badge.astro';
title: 编辑器配置
description: 配置与 Astro 一同使用的编辑器
---

自定义您的代码编辑器，以改善 Astro 开发体验并解锁新功能。

## VS Code

[VS Code](https://code.visualstudio.com) 是由 Miscrosoft 构建，受网页开发者欢迎的代码编辑器。VS Code 引擎还对云端代码编辑器像 [GitHub Codespaces](https://github.com/features/codespaces) 和 [Gitpod](https://gitpod.io) 提供了支持。

Astro 可以和任意编辑器一同工作。不过我们推荐在 Astro 项目中使用 VS Code。我们维护着一个官方 [Astro VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)，为 Astro 项目提供了几个关键特性并改善开发者体验。

- 为 `.astro` 文件提供语法高亮
- 为 `.astro` 文件提供 TypeScript 类型信息。
- [VS Code 智能提示](https://code.visualstudio.com/docs/editor/intellisense)提供代码补全和提示

开始前需要先安装 [Astro VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)。

📚 查看如何在你的 Astro 项目中[设置 TypeScript](/zh-cn/guides/typescript/)。

## 其他代码编辑器

我们令人惊喜的社群为其他受欢迎的编辑器维护了几个扩展，它们包括：

- [Open VSX 上的 VS Code 扩展](https://open-vsx.org/extension/astro-build/astro-vscode) <span style="margin: 0.25em;"><Badge variant="accent">官方</Badge></span> - 官方 Astro VS Code 扩展, 同时在 Open VSX registry 上分发，为其他开发平台如 [VSCodium](https://vscodium.com/) 提供支持
- [Nova 扩展](https://extensions.panic.com/extensions/sciencefidelity/sciencefidelity.astro/)<span style="margin: 0.25em;"><Badge variant="neutral">社区</Badge></span> - 为 Astro 提供语法高亮,、智能提示、自动补全
- Neovim [LSP](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md#astro) 和 [TreeSitter](https://github.com/virchau13/tree-sitter-astro) 插件 <span style="margin: 0.25em;"><Badge variant="neutral">社区</Badge></span> - 为 Neovim 内的 Astro 提供语法高亮、treesitter 解析和代码补全。

### JetBrains IDE

我们很想支持 [Webstorm IDE](https://www.jetbrains.com/webstorm/)。不幸的是，它不支持语言服务器，而且我们没有足够的资源来编写并维护一个与我们现有代码库语言不同的完全独立的扩展。请访问相关的 [JetBrains 支持问题](https://youtrack.jetbrains.com/issue/WEB-52015/Astro-Language-Support)，对工单进行投票，跟踪进展，并找到社区解决方法。

然而，JetBrains 即将推出的 [Fleet IDE](https://www.jetbrains.com/fleet/) 将支持语言服务器，我们目前可用的工具将能够毫无障碍地在那里运行.

## 云端编辑器

除本地编辑器外，Astro 同样适用于云端托管编辑器，包括：

- [StackBlitz](https://stackblitz.com) 和 [CodeSandbox](https://codesandbox.io) - 运行在你浏览器中的编辑器，并为 `.astro` 文件提供支持并内置语法高亮。无需安装或配置！
- [GitHub.dev](https://github.dev) - 可以将 Astro VS Code 扩展安装为[网页 extension](https://code.visualstudio.com/api/extension-guides/web-extensions) 只能使用部分功能，目前仅支持语法高亮。
- [Gitpod](https://gitpod.io) - 云上的完整开发环境，可以从 Open VSX 上安装官方 Astro VS Code 扩展。

## 其他工具

### ESLint

[ESLint](https://eslint.org/) 是流行的 JavaScript 和 JSX 的 linter。为了支持 Astro，需要安装[一个由社区维护的插件](https://github.com/ota-meshi/eslint-plugin-astro)。

关于如何为你的项目安装和设置 ESLint 的更多信息，请参见[the project's User Guide](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/)。

### Prettier

[Prettier](https://prettier.io/) 是流行的 JavaScript、HTML、CSS等 的格式化器。为了增加对 `.astro` 文件格式化的支持，请使用[官方 Astro Prettier 插件](https://github.com/withastro/prettier-plugin-astro)。

要开始使用，首先要安装 Prettier 和该插件：

``shell
npm install --save-dev prettier prettier-plugin-astro
```

然后 Prettier 会自动检测到这个插件，并在运行时使用它来处理 `.astro` 文件：

```shell
prettier --write .
```

参见 [Prettier 插件的 README](https://github.com/withastro/prettier-plugin-astro/blob/main/README.md)，以获得更多关于其支持的选项、如何在 VS Code 内设置 Prettier 等信息。

:::caution[与 pnpm 一起使用]
由于 Prettier 内部的上游问题，当使用 [pnpm](https://pnpm.io/) 时，无法自动检测到该插件。为了让它能找到这个插件，在运行 Prettier 时需要添加以下参数：

``shell
prettier --write --plugin-search-dir=. .
```

在 VS Code 内使用 Prettier 时，也需要额外的设置。更多信息请参见该插件的 README。
:::
