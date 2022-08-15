---
setup: |
    import Button from '../../components/Button.astro'
    import ContributorList from '../../components/ContributorList.astro'
    import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro'
layout: ~/layouts/MainLayout.astro
title: はじめに
description: Astroの基本的な紹介です。
i18nReady: true
---

#### Astroとは？

Astroは、**コンテンツにフォーカスした高速なWebサイト**を構築するための**オールインワンWebフレームワーク**です。

#### 主な特長

- **コンポーネントアイランド：** 高速なウェブサイトを構築するための新しいウェブアーキテクチャー。
- **サーバーファーストのAPI設計：** ユーザーのデバイスから高コストのハイドレーションをなくします。
- **デフォルトでゼロJS：** サイトを遅くするJavaScriptランタイムオーバーヘッドはありません。
- **エッジ対応：** DenoやCloudflareのようなグローバルなエッジを含め、どこでもデプロイできます。
- **カスタマイズ可能：** Tailwind、MDX、その他100以上のインテグレーションから選択可能です。
- **特定のUIに依存しない：** React、Preact、Svelte、Vue、Solid、Litなどをサポートします。

<!-- - **`client:visible` component loading:** If your user never sees it, it never loads. -->
<!-- - **Image optimizations:** Astro's very own `<Image />` component. -->
<!-- - **TypeScript support**  -->
<!-- - **File-based routing:** Every file in the pages directory becomes a route. -->

Astroの特徴については、[Astroを選ぶ理由](/ja/concepts/why-astro/)の詳細な説明をご覧ください。✨


## ブラウザでAstroを試す

[astro.new](https://astro.new/)にアクセスし、さまざまなテンプレートから選んで始めましょう。ブラウザでAstroの完全版を使って遊んでみてください。

<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
    <Button href="https://astro.new/basics?on=stackblitz">クイックスタート</Button>
    <Button variant="outline" href="https://astro.new/">すべてのテンプレートを見る →</Button>
</div>

## 最初のプロジェクトを始める

便利な`create-astro`CLIウィザードを使って、新しいAstroプロジェクトをローカルに立ち上げて実行しましょう！

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  # npmで新しいプロジェクトを作成する
  npm create astro@latest
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  # pnpmで新しいプロジェクトを作成する
  pnpm create astro@latest
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  # yarnで新しいプロジェクトを作成する
  yarn create astro
  ```
  </Fragment>
</PackageManagerTabs>

[インストールガイド](/ja/install/auto/)には、お気に入りのパッケージマネージャーでAstroをインストールするための完全な手順が記載されています。


## Astroを学ぶ

Astroサイトの主要なコンセプトとパターンの例をご覧ください。

📚 サイトに[最初のページを追加する](/ja/core-concepts/astro-pages/)。

📚 [ディレクトリ構成](/ja/core-concepts/project-structure/)についてもっと読む。

📚 Astroの[ファイルベースのルーティング](/ja/core-concepts/routing/)について詳しく学ぶ。

……完全なAPIドキュメントは**リファレンス**タブの下にあります。


## Astroを拡張する

🧰 次のプロジェクトは、[組み込み済みテーマ](https://astro.build/themes)で始めましょう。

🧰 公式やコミュニティの[プラグインとコンポーネント](https://astro.build/integrations/)を使ってサイトをカスタマイズする。

🧰 [サイトショーケース](https://astro.build/showcase)を見て、インスピレーションを得る。

……[インテグレーションの使い方ガイド](/ja/integrations/integrations/)をご覧ください。


## コミュニティに参加する

活発でフレンドリーなコミュニティ、[Astro Discord](https://astro.build/chat)にぜひ参加してください。コミュニティと情報共有したり、コミュニティから力を借りられます！

💬 `#introduce-yourself` チャンネルで挨拶する。

💬 サポートチームに `#support-threads` チャンネルで質問する。

💬 `#showcase` チャンネルであなたの作ったものをシェアする。


## もっと詳しく

[Astroブログ](https://astro.build/blog/)

[Astro更新履歴](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md)

[Astroアップグレードガイド](/ja/migrate/)


## 貢献する

このドキュメントは、これらの協力者によって提供されています。 [GitHubで参加](https://github.com/withastro/docs)

<ContributorList githubRepo="withastro/docs" />
