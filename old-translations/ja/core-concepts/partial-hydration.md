---
layout: ~/layouts/MainLayout.astro
title: パーシャルハイドレーション
description: Astroの「アイランドアーキテクチャー」を使って、パーシャルハイドレーションの仕組みをご紹介します。
setup: |
  import IslandsDiagram from '~/components/IslandsDiagram.astro';
i18nReady: true
---

**Astroはデフォルトで、クライアントサイドのJavaScriptを一切使わずに、Webサイトを生成します**。
[React](https://reactjs.org/)、[Preact](https://preactjs.com/)、[Svelte](https://svelte.dev/)、[Vue](https://vuejs.org/)、[SolidJS](https://www.solidjs.com/)、[AlpineJS](https://alpinejs.dev/)、[Lit](https://lit.dev/)で作られたフロントエンドUIコンポーネントを使って、Astroはビルド時に自動的にそれをHTMLに変換し、すべてのJavaScriptを取り除きます。これにより、Webサイトはデフォルトで高速に動作します。

```astro
---
// 例: JavaScriptを使わずに、ページ上で静的なReactコンポーネントを使用します。
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- 100% HTML、JavaScriptなし！ -->
<MyReactComponent />
```

しかし、インタラクティブなUIを作成するためには、クライアントサイドのJavaScriptが必要になります。ページ上でインタラクティブなUIが必要になったとき、Astroはページ全体を100％JavaScriptにすることを強要しません。その代わり、Astroでは **パーシャルハイドレーション（Partial Hydration）** というテクニックを使って、ページ上の個々のコンポーネントをハイドレーションできます。こうすることで、ページの実行に必要不可欠なJavaScriptだけを配信できます。

```astro
---
// 例: ページ上で動的なReactコンポーネントを使用します。
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- このコンポーネントは、ページ上でインタラクティブに動作するようになりました！ 
     残りの部分はこれまでと同じです。-->
<MyReactComponent client:load />
```

サイトの大部分は、純粋で軽いHTMLとCSSのまま、独立した**島（アイランド）のインタラクティブ機能**を利用できます。


## パーシャルハイドレーション

ブラウザ上で動作するインタラクティブなUIコンポーネントが必要なケースはたくさんあります。

- 画像のカルーセル
- 自動補完する検索バー
- モバイルサイドバーのオープン/クローズボタン
- 「今すぐ購入」ボタン

Astroでは、ブラウザで実行する必要のあるコンポーネントを、開発者が明示して許可します。Astroは、ページ上で必要なものだけを正確にハイドレートし、サイトの残りの部分は静的なHTMLとして残します。このテクニックは、**パーシャルハイドレーション**として知られています。

**パーシャルハイドレーションは、Astroのデフォルトで高速なパフォーマンスの秘密です。**


## アイランドアーキテクチャー

**アイランドアーキテクチャー（Islands architecture）** は、Webサイト全体を構築するためにパーシャルハイドレーションを使用するという考え方です。アイランドアーキテクチャーは、WebサイトをクライアントサイドのJavaScriptバンドルとしてビルドし、ユーザーに配布しなければならないという一般的なプロセスに代わるものです。

> 「アイランド」アーキテクチャの一般的な考え方は、驚くほどシンプルです。サーバー上でHTMLページをレンダリングし、動的な領域にはプレースホルダーやスロットを挿入します。
> <br/> -- [Islands Architecture: Jason Miller](https://jasonformat.com/islands-architecture/)

ブラウザに送信されるJavaScriptが少なくなるという、明らかなパフォーマンス上の利点の他に、アイランドアーキテクチャには2つの重要な利点があります。

- **コンポーネントは個別にロードします。** 軽量コンポーネント（サイドバーのトグルのような）は、ページ上の重いコンポーネントにブロックされることなく、迅速にロードおよびレンダリングされます。
- **コンポーネントは分離してレンダリングされます。** ページの各部分は独立したユニットであり、1つのユニットのパフォーマンスの問題は他のユニットに直接影響を与えません。

<IslandsDiagram>
    <Fragment slot="headerApp">ヘッダー "app"</Fragment>
    <Fragment slot="sidebarApp">サイドバー "app"</Fragment>
    <Fragment slot="main">
        テキスト、画像などのサーバー生成されたHTMLコンテンツ。
    </Fragment>
    <Fragment slot="carouselApp">画像のカルーセル "app"</Fragment>
    <Fragment slot="advertisement">広告<br/>（サーバーで生成）</Fragment>
    <Fragment slot="footer">フッター（サーバーで生成されたHTML）</Fragment>
</IslandsDiagram>

_出典: [Islands Architecture: Jason Miller](https://jasonformat.com/islands-architecture/)_
