---
title: Astroを手動でインストール
description: Astroをnpm、pnpm、Yarnを使って手動でインストールする方法です。
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

CLIの自動作成ツール `create-astro` を使用しない場合は、以下のガイドにしたがってプロジェクトを自分でセットアップできます。

## 1. ディレクトリの作成

プロジェクト名で空のディレクトリを作成し、その中に移動します。

```bash
mkdir my-astro-project
cd my-astro-project
```

新しいディレクトリに移動したら、プロジェクトの `package.json` ファイルを作成します。これはAstroを含むプロジェクトの依存関係を管理する方法です。このファイル形式に馴染みがない場合は、以下のコマンドを実行して作成してください。

```bash
npm init --yes
```


## 2. Astroのインストール

まず、Astroプロジェクトの依存関係をプロジェクト内にインストールします。

```bash
npm install astro
```

次に、`package.json` のプレースホルダー "scripts" セクションを、以下のように置き換えます。

```diff
  "scripts": \{
-    "test": "echo \"Error: no test specified\" && exit 1"
+    "dev": "astro dev",
+    "start": "astro dev",
+    "build": "astro build",
+    "astro": "astro"
  },
```

これらのスクリプトは、このガイドの後半でAstroを起動し、さまざまなコマンドを実行するために使用します。


## 3. 最初のページを作成する

テキストエディタで、ディレクトリ内の `src/pages/index.astro` に新しいファイルを作成します。これがプロジェクトにおける最初のAstroのページとなります。

このガイドでは、次のコードスニペット（`---`のダッシュを含む）を新しいファイルにコピー＆ペーストします。

```astro
---
// Astroへようこそ！この3つのダッシュで囲まれた部分のコードが、
// 「コンポーネントのFront Matter」です。ブラウザで実行されることはありません。
console.log('これはブラウザではなく、ターミナルで実行されます！');
---
<!-- 以下は「コンポーネントテンプレート」です。これは単なるHTMLですが
     しかし、優れたテンプレートを作成するための魔法がいくつか散りばめられています。 -->
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
<style>
  h1 {
    color: orange;
  }
</style>
```

## 4. 最初の静的アセットを作成する

静的アセットを格納するために、`public/` ディレクトリも作成します。Astroはこれらのアセットを常に最終ビルドに含めますので、コンポーネントテンプレートの内部から安全に参照できます。

テキストエディタで、ディレクトリ内の `public/robots.txt` に新しいファイルを作成します。`robots.txt` は、ほとんどのサイトがGoogleなどの検索ボットにあなたのサイトをどのように扱うかを伝えるために含める簡単なファイルです。

このガイドでは、次のコードスニペットを新しいファイルにコピー＆ペーストしてください。

```
# 例: すべてのボットにサイトのスキャンとインデックスを許可する。
# 完全な構文: https://developers.google.com/search/docs/advanced/robots/create-robots-txt
User-agent: *
Allow: /
```

## 5. `astro.config.mjs` の作成

Astroの設定は、`astro.config.mjs` を使用します。このファイルは、Astroの設定が必要ない場合は任意ですが、今すぐ作成することをお勧めします。

プロジェクトのルートに `astro.config.mjs` を作成し、その中に以下のコードをコピーします。

```
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({});
```

ReactやSvelteなどの[UIフレームワークコンポーネント](/ja/core-concepts/framework-components/)や、TailwindやPartytownなどのツールをプロジェクトに組み込む場合は、ここで[手動でインテグレーションを取り込んで設定](/ja/guides/integrations-guide/)します。

📚 詳しくはAstroの[API設定リファレンス](/ja/reference/configuration-reference/)を参照してください。


## 6. 次のステップ

上記の手順を踏んだ場合、プロジェクトディレクトリは以下のようになっているはずです。

```
├── node_modules/
├── src/
│   └── pages/
│   │   └── index.astro
├── public/
│   ├── robots.txt
├── astro.config.mjs
├── package.json
└── package-lock.json (or: yarn.lock, pnpm-lock.yaml, etc.)
```

おめでとうございます！これでAstroを使うための設定は完了です。

このガイドに完全にしたがった場合は、[ステップ2: Astroをスタートする](/ja/install/auto/#2-astroをスタートする-)に直接ジャンプして、Astroをはじめて実行する方法を続けて学ぶことができます。
