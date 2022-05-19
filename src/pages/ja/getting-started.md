---
setup: |
    import Button from '../../components/Button.astro'
    import ContributorList from '../../components/ContributorList.astro'
layout: ~/layouts/MainLayout.astro
title: はじめに
description: Astroの基本的な入門です。
---
静的サイトジェネレーター  🚀  好みのフレームワークを使える  🚀  JavaScriptを削減


> 古いプロジェクトをお持ちですか？[アップグレードガイド](/ja/migrate/)に従って、v1.0 beta にアップグレードしてください！


## Astroを試す

Astroはブラウザでも、ローカル環境でも、できるだけ簡単に始められるようにしています。

### オンラインコードエディタ

「購入前のお試し」には、[astro.new](https://astro.new)が便利です。さまざまなスターターテンプレートから選択し、ブラウザ上でAstroが完全に動作するバージョンの構築を開始できます。

また、次のボタンを1回クリックするだけで、**基本スタータープロジェクトを即座に立ち上げられます**。

<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
    <Button href="https://astro.new/starter?on=codesandbox">CodeSandboxで開く</Button>
    <Button href="https://astro.new/starter?on=stackblitz">StackBlitzで開く</Button>
</div>

### Astroをローカルにインストールする

インストールする準備はできましたか？

簡単な `create-astro` CLI ウィザードで、新しいプロジェクトをローカルですぐに立ち上げられます！

```bash
# npmで新しいプロジェクトを作成する
npm create astro@latest

# yarnの場合
yarn create astro

# pnpmの場合
pnpm create astro@latest
```

⚙️ [インストールガイド](/ja/install/auto/)には、お気に入りのパッケージマネージャーでAstroをインストールするための完全な手順が記載されています。

⚙️ [手動セットアップ](/ja/install/manual/)の手順もあります。


## Astroでビルドを始める

早速、あなたのサイトにコンテンツや機能を追加してみましょう！

🏗️ 新しい[Astro (.astro) ページ](/ja/core-concepts/astro-pages/)や[Markdown (.md) ページ](/ja/guides/markdown-content/)をサイトに追加する。

🏗️ 最初の[レイアウト](/ja/core-concepts/layouts/)を作成する。

🏗️ サイトに[CSSとスタイル](/ja/guides/styling/)を追加する。

……さらに詳しい情報は**特徴**をご確認ください。


## Astroを学ぶ

Astroサイトの主要なコンセプトとパターンの例をご覧ください。

📚 Astroの[ディレクトリ構成](/ja/core-concepts/project-structure/)についてもっと読む。

📚 Astroの[テンプレートディレクティブ](/ja/reference/directives-reference/)について詳しく学ぶ。

📚 Astroの[ランタイムAPI](/ja/reference/api-reference/)を探索する。

……他の資料は**リファレンス**の下にあります。


## Astroを拡張する

🧰 次のプロジェクトは、[組み込み済みテーマ](https://astro.build/themes)で始めましょう。

🧰 公式やコミュニティの[プラグインとコンポーネント](https://astro.build/integrations/)を使ってサイトをカスタマイズする。

🧰 [サイトショーケース](https://astro.build/showcase)を見て、インスピレーションを得る。

……[統合機能の使い方ガイド](/ja/integrations/integrations/)をご覧ください。



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
