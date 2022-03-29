---
layout: ~/layouts/MainLayout.astro
setup: |
  import Badge from '~/components/Badge.astro';
title: Editor Setup
description: Set up your editor to build with Astro.
---

Customize your code editor to improve the Astro developer experience and unlock new features.

<!-- 
TODO: ## TypeScript 
We talked about having a dedicated TypeScript page for specific instructions on how to set 
up your tsconfig.json, your env files, what features are expected, etc. etc.
Once that page exists, it would be good to link to that here, since your editor will probably 
rely on that same setup of configuration files to give you inline typescript info. 
-->


## VS Code

[VS Code](https://code.visualstudio.com) is a popular code editor for web developers, built by Microsoft. VS Code is our recommended code editor for Astro projects, including VS Code-powered browser editors like [GitHub Codespaces](https://github.com/features/codespaces) and [Gitpod](https://gitpod.io).

The [Official Astro Extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) for VS Code makes web development even easier by unlocking several key features for Astro projects:

- Syntax highlighting for `.astro` files.
- TypeScript type information for `.astro` files.
- [VS Code Intellisense](https://code.visualstudio.com/docs/editor/intellisense) for code completion, hints and more.

To get started, Install the [Astro VS Code Extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) today.

## Other Code Editors

Our amazing community maintains extensions for several other popular editors, including:

- [VS Code Extension on Open VSX](https://open-vsx.org/extension/astro-build/astro-vscode) <span style="margin: 0.25em;"><Badge variant="accent">Official</Badge></span> - The official Astro VS Code Extension, available on the Open VSX registry for open platforms like [VSCodium](https://vscodium.com/)
- [Nova Extension](https://extensions.panic.com/extensions/sciencefidelity/sciencefidelity.astro/)<span style="margin: 0.25em;"><Badge variant="neutral">Community</Badge></span> - Syntax highlighting, IntelliSense, autocompletion for Astro

## In-Browser Editors

In addition to local editors, Astro also runs well on in-browser hosted editors, including:

- [StackBlitz](https://stackblitz.com) and [CodeSandbox](https://codesandbox.io) are online editors that run in your browser, with built-in syntax highlighting support for `.astro` files. No installation or configuration required!
- [GitHub.dev](https://github.dev) allows you to install the Astro VS Code extension as a [web extension](https://code.visualstudio.com/api/extension-guides/web-extensions), which gives you access to only some of the full extension features. Currently, only syntax highlighting is supported.
