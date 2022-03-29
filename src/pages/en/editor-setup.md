---
layout: ~/layouts/MainLayout.astro
setup: |
  import Badge from '~/components/Badge.astro';
title: Editor Setup
description: Set up your editor to build with Astro.
---
You can build and develop your Astro project using any of your favorite code editors, either locally or in the cloud!

Improve your experience by working with `.astro` files in supported editors with Astro language support.

## VS Code Extension

[VS Code](https://code.visualstudio.com) is a popular code editor that can be downloaded and used locally or in full online development platforms such as [GitHub Codespaces](https://github.com/features/codespaces), and [Gitpod](https://gitpod.io).

Astro has its own [Astro VS Code Extension on Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) that you can install in any of these VS Code environments for .`astro` syntax highligting, code completion, and more!

### Full List of Features
- [Go to Definition](https://code.visualstudio.com/docs/editor/editingevolved#_go-to-definition)
- Code hover hints 
- Code completion
- Function signatures
- Syntax highlighting
- Code folding
- Emmet

### Installation


After [setting up VS Code](https://code.visualstudio.com/Docs/setup/setup-overview) and starting any of our [Astro starter example templates](https://github.com/withastro/astro/tree/main/examples), VS Code should prompt you to install the Astro extension automatically. (Look for a pop-up in the bottom right corner!)

To add the extension yourself:

1. Navigate to the "Extensions" tab
2. Search for "astro" in the VS Code Marketplace
3. Install the [Astro VS Code Extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)

## Other Astro Language Extensions

You can also get Astro language support outside of VS Code using:

- [Astro VS Code Extension on Open VSX](https://open-vsx.org/extension/astro-build/astro-vscode) <span style="margin: 0.25em;"><Badge variant="accent">Official</Badge></span> - The official Astro VS Code Extension, available on the Open VSX registry for open platforms like [VSCodium](https://vscodium.com/)

- [Nova editor extension](https://extensions.panic.com/extensions/sciencefidelity/sciencefidelity.astro/)<span style="margin: 0.25em;"><Badge variant="neutral">Community</Badge></span> - Syntax highlighting, IntelliSense, autocompletion for Astro

## In-Browser Editors

[StackBlitz](https://stackblitz.com) and [CodeSandbox](https://codesandbox.io) are online editors that run in your browser, with built-in syntax highlighting support for `.astro` files. No installation or configuration required!

[GitHub.dev](https://github.dev) allows you to install the Astro VS Code extension as a [web extension](https://code.visualstudio.com/api/extension-guides/web-extensions), which gives you access to only some of the full extension features. Currently, only syntax highlighting is supported.