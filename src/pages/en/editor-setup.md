---
layout: ~/layouts/MainLayout.astro
setup: |
  import Badge from '~/components/Badge.astro';
title: Editor Setup
description: Set up your editor to build with Astro.
i18nReady: true
---

Customize your code editor to improve the Astro developer experience and unlock new features.

## VS Code

[VS Code](https://code.visualstudio.com/) is a popular code editor for web developers, built by Microsoft. The VS Code engine also powers popular in-browser code editors like [GitHub Codespaces](https://github.com/features/codespaces) and [Gitpod](https://gitpod.io/).

Astro works with any code editor. However, VS Code is our recommended editor for Astro projects. We maintain an official [Astro VS Code Extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) that unlocks several key features and developer experience improvements for Astro projects.

- Syntax highlighting for `.astro` files.
- TypeScript type information for `.astro` files.
- [VS Code Intellisense](https://code.visualstudio.com/docs/editor/intellisense) for code completion, hints and more.

To get started, install the [Astro VS Code Extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) today.

📚 See how to [set up TypeScript](/en/guides/typescript/) in your Astro project.

## Other Code Editors

Our amazing community maintains several extensions for other popular editors, including:

- [VS Code Extension on Open VSX](https://open-vsx.org/extension/astro-build/astro-vscode) <span style="margin: 0.25em;"><Badge variant="accent">Official</Badge></span> - The official Astro VS Code Extension, available on the Open VSX registry for open platforms like [VSCodium](https://vscodium.com/)
- [Nova Extension](https://extensions.panic.com/extensions/sciencefidelity/sciencefidelity.astro/) <span style="margin: 0.25em;"><Badge variant="neutral">Community</Badge></span> - Provides syntax highlighting and code completion for Astro inside of Nova
- Neovim [LSP](https://github.com/neovim/nvim-lspconfig/blob/master/doc/server_configurations.md#astro) and [TreeSitter](https://github.com/virchau13/tree-sitter-astro) Plugins <span style="margin: 0.25em;"><Badge variant="neutral">Community</Badge></span> - Provides syntax highlighting, treesitter parsing, and code completion for Astro inside of Neovim

## In-Browser Editors

In addition to local editors, Astro also runs well on in-browser hosted editors, including:

- [StackBlitz](https://stackblitz.com/) and [CodeSandbox](https://codesandbox.io/) - online editors that run in your browser, with built-in syntax highlighting support for `.astro` files. No installation or configuration required!
- [GitHub.dev](https://github.dev/) - allows you to install the Astro VS Code extension as a [web extension](https://code.visualstudio.com/api/extension-guides/web-extensions), which gives you access to only some of the full extension features. Currently, only syntax highlighting is supported.
- [Gitpod](https://gitpod.io/) - a full dev environment in the cloud that can install the official Astro VS Code Extension from Open VSX.

## Other tools

### ESLint

[ESLint](https://eslint.org/) is a popular linter for JavaScript and JSX. For Astro support, [a community maintained plugin](https://github.com/ota-meshi/eslint-plugin-astro) can be installed.

See [the project's User Guide](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/) for more information on how to install and set up ESLint for your project.

### Prettier

[Prettier](https://prettier.io/) is a popular formatter for JavaScript, HTML, CSS and more. To add support for formatting `.astro` files, use [the official Astro Prettier plugin](https://github.com/withastro/prettier-plugin-astro).

To get started, first install Prettier and the plugin:

```shell
npm install --save-dev prettier prettier-plugin-astro
```

Prettier will then automatically detect the plugin and use it to process `.astro` files when you run it:

```shell
prettier --write .
```

See the [Prettier plugin's README](https://github.com/withastro/prettier-plugin-astro/blob/main/README.md) for more information about its supported options, how to set up Prettier inside VS Code, and more.

:::caution[Using with pnpm]
Due to upstream issues inside Prettier, the plugin will not be automatically detected when using [pnpm](https://pnpm.io/). In order to make it find the plugin, the following parameter needs to be added when running Prettier:

```shell
prettier --write --plugin-search-dir=. .
```

Additional settings are also required when using Prettier inside VS Code. See the plugin's README for more information.
:::
