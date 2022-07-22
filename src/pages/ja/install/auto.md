---
title: 自動CLIでAstroをインストール
description: npm、pnpm、またはYarnを使って、create-astro CLIツールによりAstroをインストールする方法です。
layout: ~/layouts/MainLayout.astro
setup: import InstallGuideTabGroup from '~/components/TabGroup/InstallGuideTabGroup.astro';
i18nReady: true
---
Astroをインストールする準備はできましたか？自動または手動セットアップガイドにしたがって開始してください。

#### 前提条件

- **Node.js** - `14.15.0`、`v16.0.0`、またはそれ以上。
- **テキストエディタ** - [VS Code](https://code.visualstudio.com/)と[公式Astro拡張機能](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)を推奨します。
- **ターミナル** - Astroは、コマンドラインインターフェイス（CLI）からアクセスします。

<InstallGuideTabGroup />

#### インストール

`create-astro` は、新しいAstroプロジェクトをゼロから始めるもっとも速い方法です。

:::tip[オンラインプレビュー]
ブラウザでAstroを試してみませんか？[Astro.new](https://astro.new/)では、スターターテンプレートを利用し、ブラウザから離れることなく、新しいAstroプロジェクトを立ち上げられます。
:::

## 1. セットアップウィザードを実行する

ターミナルで以下のコマンドを実行すると、便利なインストールウィザード、`create-Astro`が起動します。

```shell
# npm
npm create astro@latest

# yarn
yarn create astro

# pnpm
pnpm create astro@latest
```

`create-astro`ウィザードは、新しいAstroプロジェクトのセットアップの全ステップを案内します。このウィザードはどのディレクトリでも実行でき、始める前にプロジェクト用の新しい空のディレクトリを作成する必要はありません。新しいプロジェクト用の空のディレクトリがまだなければ、ウィザードが自動的に作成します。

すべてがうまくいけば、「Ready for liftoff!」というメッセージの後に、いくつかの推奨する「Next steps」が表示されるはずです。新しいプロジェクトディレクトリに`cd`で移動し、Astroの使用を開始します。

もし`create-astro`ウィザードで`npm install`のステップをスキップした場合は、続行する前に依存関係をインストールしてください。


## 2. Astroをスタートする ✨

Astroには、プロジェクト開発に必要なものをすべて備えた開発サーバーが内蔵されています。`Astro dev`コマンドを実行すると、ローカルの開発サーバーが起動し、新しいウェブサイトが実際に動作しているところをいち早く見られます。

すべてのスターターテンプレートには、あなたに代わって`astro dev`を実行するスクリプトがあらかじめ設定されています。お好みのパッケージマネージャーでこのコマンドを実行し、Astro開発サーバを起動します。

```bash
# npm
npm run dev

# yarn
yarn run dev

# pnpm
pnpm run dev
```

うまくいけば、Astroは[http://localhost:3000](http://localhost:3000)でプロジェクトの開発サーバーを起動します！

Astroは `src/` ディレクトリのファイル変更を自動検出するので、開発中に変更を加えてもサーバーを再起動する必要はありません。

ブラウザでプロジェクトを開けない場合は、`dev`コマンドを実行したターミナルに戻って、エラーが発生したか、またはプロジェクトが上記のリンク先とは異なるURLで提供されていないか確認してください。


## 次のステップ

成功です！これでAstroを使った開発を始める準備ができました！🥳

ここでは、次に調べることをおすすめするいくつかのトピックを紹介します。どのような順番で読んでもかまいません。また、このドキュメントを少し離れて、新しいAstroプロジェクトのコードベースで遊びながら、問題にぶつかったり、質問があったりしたときに、ドキュメントに戻ってくることもできます。

📚 **フレームワークを追加**：[インテグレーションガイド](/ja/guides/integrations-guide/)で、`npx astro add`を使用してReact、Svelte、Tailwindなどをサポートし、Astroを拡張する方法を学びます。

📚 **サイトをデプロイ**：[デプロイガイド](/ja/guides/deploy/)で、Astroプロジェクトをビルドしてウェブにデプロイする方法を学びましょう。

📚 **コードベースを理解**：Astroのディレクトリ構造については、[ディレクトリ構造ガイド](/ja/core-concepts/project-structure/)で詳しく説明します。
