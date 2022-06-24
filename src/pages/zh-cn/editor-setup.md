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

>⚙️ 查看如何在你的 Astro 项目中[设置 TypeScript](/zh-cn/guides/typescript/)。

## 其他代码编辑器

我们令人惊喜的社群为其他受欢迎的编辑器维护了几个扩展，它们包括：

- [Open VSX 上的 VS Code 扩展](https://open-vsx.org/extension/astro-build/astro-vscode) <span style="margin: 0.25em;"><Badge variant="accent">官方</Badge></span> - 官方 Astro VS Code 扩展, 同时在 Open VSX registry 上分发，为其他开发平台如 [VSCodium](https://vscodium.com/) 提供支持
- [Nova 扩展](https://extensions.panic.com/extensions/sciencefidelity/sciencefidelity.astro/)<span style="margin: 0.25em;"><Badge variant="neutral">社群</Badge></span> - 为 Astro 提供语法高亮,、智能提示、自动补全

## 云端编辑器

除本地编辑器外，Astro 同样适用于云端托管编辑器，包括：

- [StackBlitz](https://stackblitz.com) 和 [CodeSandbox](https://codesandbox.io) - 运行在你浏览器中的编辑器，并为 `.astro` 文件提供支持并内置语法高亮。无需安装或配置！
- [GitHub.dev](https://github.dev) - 可以将 Astro VS Code 扩展安装为[网页 extension](https://code.visualstudio.com/api/extension-guides/web-extensions) 只能使用部分功能，目前仅支持语法高亮。
- [Gitpod](https://gitpod.io) - 云上的完整开发环境，可以从 Open VSX 上安装官方 Astro VS Code 扩展。 
