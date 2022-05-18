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

`create-astro` は、新しいAstroプロジェクトをゼロから始めるもっとも速く、簡単な方法です。

## 1. CLIを実行する

ターミナルで次のコマンドを実行すると、便利なインストールウィザードである `create-astro` が起動します。これを使って、最初のAstroプロジェクトを作成する手順を説明します。

最初に新しいディレクトリを作成する必要はありません！ウィザードはプロジェクトフォルダを作成します。


```shell
# npm
npm create astro@latest

# yarn
yarn create astro

# pnpm
pnpm create astro@latest
```

パッケージマネージャーによっては、`create-astro@latest` をインストールするか確認するプロンプトが表示されます。プロジェクトフォルダの名前（例：`./my-astro-site`）を指定するよう求められますので、入力して新しいディレクトリを作成します。

### スターターテンプレートの選択

次に、スターターテンプレートの一覧が表示されますので、その中から選択します。

- `Just the basics`： Astroをこれから始めようとする人に最適なスターターテンプレートです。
- `Blog`, `Documentation`, `Portfolio`： 特定のユースケースを想定したテーマです。
- `Completely empty`： 開始するために必要最低限のテンプレートです。

矢印キー（上下）を使ってインストールしたいテンプレートに移動し、リターンキー（エンターキー）を押して選択してください。

> 💡 テンプレートを選ぶ前に、ブラウザで確認したいなら？[astro.new](https://astro.new/)にアクセスします。

### 依存関係のインストール（オプション）

この時、ウィザードはあなたに代わって `install` コマンドを実行することを提案しますが、これはオプションです。

> ⚠️ ここで実行しない場合は、ウィザード終了後、プロジェクトを開始する前に[依存関係のインストール](/ja/install/auto#2-依存関係のインストール)を実行する必要があります。

### 公式Astroインテグレーションをインストール（オプション）

[UIフレームワークの追加](/ja/core-concepts/framework-components)（React, Svelte, Vue, Solid, Preact, Lit）と、その他のAstro公式インテグレーション（Tailwind, Turbolinks, Partytown, Sitemap）を追加するには `astro add --yes` を実行する必要があります。

プロジェクトに組み込むAstroインテグレーションを選択するには、矢印キー（上下）を使って移動し、スペースバーで選択状態を切り替えます。一度に複数の項目を選択することも、統合を選択せずに続行することもできます。

選択が完了したら、リターンキー（エンターキー）を押して確定します。

> これらの統合や、[Astroコミュニティーインテグレーション](https://astro.build/integrations)は、後で[インテグレーションガイド](/ja/guides/integrations-guide)の説明にしたがって追加することもできます。

追加するインテグレーションを選択すると、`create-astro` がプロジェクトの `astro.config.mjs` に適用する変更を通知する次のようなターミナルメッセージが表示されるはずです。

```bash
Astro will make the following changes to your config file:
```

このメッセージは、選択したインテグレーションがプロジェクトの設定に正常に追加されたことを示します。(そうでない場合は、あとでいつでも手動で追加できます）。


### .git リポジトリの初期化（オプション）

この最後のステップでは、新しいディレクトリにgitリポジトリを初期化できます。これはオプションですが、プロジェクトで[Git](https://git-scm.com/)を使用する予定であれば便利です。


### 次のステップ

`create-astro` のインストールウィザードが完了すると、セットアップを完了し、新しいプロジェクトを開始するのに役立つ、おすすめの手順（"Next Steps"）が表示されます。


## 2. 依存関係のインストール

ウィザードでプロジェクトの依存関係をインストールしなかった場合、お好みのパッケージマネージャーを使用してインストールする必要があります。

```bash
# npm
npm install

# yarn
yarn

# pnpm
pnpm install

```


## 3. Astroをスタートする ✨

開発中のほとんどは、Astroに内蔵された開発サーバーを使用することになるでしょう。これは、開発中にローカルでプロジェクトを実行する方法です。

開始するには、パッケージマネージャーを使用して、事前に設定したスタートスクリプトを実行します。

```bash
# npm
npm run dev

# yarn
yarn start

# pnpm
pnpm run dev
```

うまくいけば、Astroは[http://localhost:3000](http://localhost:3000)でプロジェクトの開発サーバーを起動します！

Astroは `src/` ディレクトリのファイル変更を自動検出するので、開発中に変更を加えてもサーバーを再起動する必要はありません。

ブラウザでプロジェクトを開けない場合は、`start` コマンドを実行したターミナルに戻り、何が問題だったかを確認します。


## 4. Webにデプロイする

いよいよプロジェクトをWebにデプロイする時が来ました！プロジェクト内で `build` コマンドを実行し、静的なWebサイトをプロジェクト内の新しい `dist/` フォルダにビルドしてください。

```bash
# npm
npm run build

# yarn
yarn build

# pnpm
pnpm run build
```

コマンドが終了すると、プロジェクトに新しい`dist/`フォルダが作成されます。このフォルダはお気に入りのホスティングサービスに直接デプロイできます。

Webサイトを無料でホスティングするには、私たちが信頼しているホスティングパートナーである[Netlify](https://www.netlify.com/)をチェックしてみてください。あなたが選んだホストへのデプロイの手順については、私たちの詳細な[デプロイガイド](/ja/guides/deploy)を参照してください。


## 次のステップ

成功です！これで開発を始める準備ができました！

📚 Astroのディレクトリ構造については、[ディレクトリ構造ガイド](/ja/core-concepts/project-structure)で詳しく説明しています。

📚 Astroのコンポーネント構文については、[Astroコンポーネントガイド](/ja/core-concepts/astro-components)で詳しく説明しています。

📚 Astroのファイルベースのルーティングについては、[ルーティングガイド](/ja/core-concepts/astro-pages)で詳しく説明しています。
