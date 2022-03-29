---
layout: ~/layouts/MainLayout.astro
setup: |
  import Badge from '~/components/Badge.astro';
title: Editor Setup
description: Set up your editor to build with Astro.
---

Set up your code editor to improve the developer experience of working with Astro.

<!-- 
TODO: ## TypeScript 
We talked about having a dedicated TypeScript page for specific instructions on how to set 
up your tsconfig.json, your env files, what features are expected, etc. etc.
Once that page exists, it would be good to link to that here, since your editor will probably 
rely on that same setup of configuration files to give you inline typescript info. 
-->


## VS Code

[VS Code](https://code.visualstudio.com) is a popular code editor for web developers, built by Microsoft. It is our official code editor of choice for Astro because it powers local development and online platforms such as [GitHub Codespaces](https://github.com/features/codespaces), and [Gitpod](https://gitpod.io).

To get started, install the [Official Astro Extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) for VS Code. While this extension is not required for development, it unlocks several key features for Astro:

- Syntax highlighting for `.astro` files.
- TypeScript type information for `.astro` files.
- [VS Code Intellisense](https://code.visualstudio.com/docs/editor/intellisense) for code completion, hints and more.

Install the [Astro VS Code Extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) to get started. 

## Other Code Editors

Our amazing community maintains extensions for several other popular editors, including:

- [VS Code Extension on Open VSX](https://open-vsx.org/extension/astro-build/astro-vscode) <span style="margin: 0.25em;"><Badge variant="accent">Official</Badge></span> - The official Astro VS Code Extension, available on the Open VSX registry for open platforms like [VSCodium](https://vscodium.com/)
- [Nova Extension](https://extensions.panic.com/extensions/sciencefidelity/sciencefidelity.astro/)<span style="margin: 0.25em;"><Badge variant="neutral">Community</Badge></span> - Syntax highlighting, IntelliSense, autocompletion for Astro

## In-Browser Editors

In addition to local editors, Astro also runs well on in-browser hosted editors, including:

- [StackBlitz](https://stackblitz.com) and [CodeSandbox](https://codesandbox.io) are online editors that run in your browser, with built-in syntax highlighting support for `.astro` files. No installation or configuration required!
- [GitHub.dev](https://github.dev) allows you to install the Astro VS Code extension as a [web extension](https://code.visualstudio.com/api/extension-guides/web-extensions), which gives you access to only some of the full extension features. Currently, only syntax highlighting is supported.
