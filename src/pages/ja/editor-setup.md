---
layout: ~/layouts/MainLayout.astro
setup: |
  import Badge from '~/components/Badge.astro';
title: エディタのセットアップ
description: Astroで開発するため、エディタの設定をしましょう。
i18nReady: true
---

エディタをカスタマイズし、新機能を追加して開発者体験を向上させましょう。

## VS Code

[VS Code](https://code.visualstudio.com/) はMicrosoft社が開発した、web開発者に人気のあるコードエディタです。 VS Codeのエンジンは [GitHub Codespaces](https://github.com/features/codespaces) や [Gitpod](https://gitpod.io/)といった人気のあるブラウザ内コードエディタもサポートしています。

Astro はどのようなコードエディタでも動作しますが、VS CodeはAstroで開発する際におすすめのエディタです。 私たちはいくつかの重要な機能の追加と、開発者体験を向上させる公式[VS
 Code 拡張機能](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)をメンテナンスしています。

- `.astro`ファイルのシンタックスハイライト
- `.astro`ファイルのTypeScript型情報
- [VS Code Intellisense](https://code.visualstudio.com/docs/editor/intellisense)によるコード補完、ヒントなど

早速、[Astro VS Code Extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) をインストールしてみましょう。


📚 Astroプロジェクトでどのように[TypeScriptをセットアップ](/ja/guides/typescript/)するのか見る。

## その他のコードエディタ

素晴らしいコミュニティが他の人気エディタ用の拡張機能をメンテナンスしています。

- [VS Code Extension on Open VSX](https://open-vsx.org/extension/astro-build/astro-vscode) <span style="margin: 0.25em;"><Badge variant="accent">Official</Badge></span> - [VSCodium](https://vscodium.com/)のようなオープンプラットフォーム向けのOpen VSX Registryで利用可能な公式Astro VS Code Extensionです。
-  [Nova Extension](https://extensions.panic.com/extensions/sciencefidelity/sciencefidelity.astro/)<span style="margin: 0.25em;"><Badge variant="neutral">Community</Badge></span> - Astro用シンタックスハイライト、インテリセンス、自動補完

## ブラウザ内エディタ

ローカルエディタに加え、Astroはブラウザで動作するオンラインエディタでもきちんと動作します。

- [StackBlitz](https://stackblitz.com/) と [CodeSandbox](https://codesandbox.io/) - ブラウザ上で動作するオンラインエディタで, `.astro` ファイル用のシンタックスハイライトをサポートしています。設定やインストールは不要です。
- [GitHub.dev](https://github.dev/) - [Web Extentions](https://code.visualstudio.com/api/extension-guides/web-extensions)としてAstro VS Code拡張をインストールでき、拡張機能の一部をフルに利用できるようになります。現在のところ、シンタックスハイライトのみをサポートしています。
- [Gitpod](https://gitpod.io/) - Open VSXから公式Astro VS Code Extensionをインストールできるクラウド上のフル開発環境です。
