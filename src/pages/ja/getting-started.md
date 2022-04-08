---
setup: |
    import Button from '../../components/Button.astro'
    import ContributorList from '../../components/ContributorList.astro'
layout: ~/layouts/MainLayout.astro
title: はじめに
description: Astroの基本的な入門です。
---
静的サイトジェネレーター  🚀  好みのフレームワークを使える  🚀  JavaScriptを削減

## Astroを試す

Astroはブラウザでも、ローカル環境でも、できるだけ簡単に始められるようにしています。

### オンラインコードエディター

「購入前のお試し」には、[astro.new](https://astro.new)が便利です。さまざまなスターターテンプレートから選択し、ブラウザ上でAstroが完全に動作するバージョンの構築を開始できます。

また、ボタンを1回クリックするだけで、**基本スタータープロジェクトを即座に立ち上げられます**。

<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
    <Button href="https://astro.new/starter?on=codesandbox">CodeSandboxで開く</Button>
    <Button href="https://astro.new/starter?on=stackblitz">StackBlitzで開く</Button>
</div>

### Astroをローカルにインストールする

インストールする準備はできましたか？

簡単な `create-astro` CLI ウィザードを使うと、新しいプロジェクトをローカルですぐに立ち上げられます！

```bash
# 新しいディレクトリでこのコマンドを実行して始めましょう！
npm init astro
```

⚙️ [インストールガイド](/en/install/auto)には、お気に入りのパッケージマネージャーでAstroをインストールするための完全な手順が記載されています。

⚙️ [手動セットアップ](/en/install/manual/)の手順もあります。


## Astroでビルドを始める

早速、あなたのサイトにコンテンツや機能を追加してみましょう！

🏗️ 新しい[Astro (.astro) ページ](/en/core-concepts/astro-pages)や[Markdown (.md) ページ](/en/guides/markdown-content)をサイトに追加する。

🏗️ 最初の[レイアウト](/en/core-concepts/layouts)を作成する。

🏗️ サイトに[CSSとスタイリング](/en/guides/styling)を追加する。

……そして、さらに多くのガイドが**Learn**の下にあります。



## Astroを学ぶ

Astroサイトの主要なコンセプトとパターンの例をご覧ください。

📚 Astroの[プロジェクト構造](/ja/core-concepts/project-structure)についてもっと読む。

📚 Astroの[組み込みコンポーネント](/en/reference/api-reference/#built-in-components)について詳しく学ぶ。

📚 Astroの[API](/en/reference/api-reference)を探索する。

……そして、さらに多くの参考資料が**Reference**の下にあります。

## Astroと統合する

ユーザーがAstroと組み合わせたさまざまな統合をご覧ください！

🧰 AstroプロジェクトでCMSを使用する。

🧰 eコマースをセットアップする。

🧰 サイトにデータベースを接続する。

……[サードパーティーの統合](/en/integrations/integrations)をご覧ください。



## コミュニティーに参加する

活発でフレンドリーなコミュニティ、[Astro Discord](https://astro.build/chat)にぜひ参加してください。コミュニティと情報共有したり、コミュニティから力を借りられます！

💬 `#introduce-yourself` チャンネルで挨拶する。

💬 サポートチームに `#support` チャンネルで質問する。

💬 `#showcase` チャンネルであなたの作ったものをシェアする。


## もっと詳しく

[Astroブログ](https://astro.build/blog/)

[Astro更新履歴](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md)

[Astroマイグレーションガイド](/en/migrate) (v0.21+へのアップグレード案内)


## コントリビュート

このドキュメントは、以下の親切な方々によって提供されています。 [GitHubで参加](https://github.com/withastro/docs)

<ContributorList githubRepo="withastro/docs" />
