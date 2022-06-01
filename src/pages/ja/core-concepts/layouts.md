---
layout: ~/layouts/MainLayout.astro
title: レイアウト
description: レイアウトの紹介です。Astroコンポーネントの一種で、共通のレイアウトのためにページ間で共有されます。
i18nReady: true
---

**レイアウト**は、再利用可能なページテンプレートを作成するのに便利な[Astroコンポーネント](/ja/core-concepts/astro-components/)の特殊なタイプです。

レイアウトコンポーネントは、慣習的に [`.astro` または `.md` ページ](/ja/core-concepts/astro-pages/)に**ページシェル**（`<html>`, `<head>`, `<body>` タグ）と、レイアウト内のどこにページ内容を挿入するか指定する `<slot />` を提供するために使用されています。

レイアウトは多くの場合、共通の `<head>` 要素や、ヘッダー、ナビゲーションバー、フッターなどのページの共通UI要素を提供します。

レイアウトコンポーネントは一般的に、プロジェクト内の `src/layouts` ディレクトリに配置されます。


## レイアウトのサンプル

```astro
---
// 例: src/layouts/MySiteLayout.astro
---
<html>
  <head>
    <!-- ... -->
  </head>
  <body>
    <nav>
      <a href="#">ホーム</a>
      <a href="#">ブログ</a>
      <a href="#">お問い合わせ</a>
    </nav>
    <article>
      <slot /> <!-- ここにコンテンツが挿入されます -->
    </article>
  </body>
</html>
```

```astro
---
// 例: src/pages/index.astro
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>レイアウトに包まれたページのコンテンツ</p>
</MySiteLayout>
```

📚 [スロット](/ja/core-concepts/astro-components/#スロット)についてもっと学ぶ。


## レイアウトの入れ子

レイアウトコンポーネントは、ページ全体に相当するHTMLを含む必要はありません。レイアウトをより小さなコンポーネントに分割し、そのコンポーネントを再利用して、プロジェクトでさらに柔軟で強力なレイアウトを作成できます。

たとえば、ブログの記事によくあるレイアウトは、タイトル、日付、作者を表示するものです。`BlogPostLayout.Astro`レイアウトコンポーネントは、このUIをページに追加し、さらに大きなサイト全体のレイアウトを利用して、ページの残りの部分を処理できます。

```astro
---
// 例: src/layout/BlogPostLayout.astro
import BaseLayout from '../layouts/BaseLayout.astro'
const {content} = Astro.props;
---
<BaseLayout>
  <h1>{content.title}</h1>
  <h2>投稿者: {content.author}</h2>
  <slot />
</BaseLayout>
```

## Markdownのレイアウト

ページレイアウトはとくに[Markdownファイル](/ja/guides/markdown-content/#markdown-pages)に対して便利です。Markdownファイルは特別な `layout`というfront-matterのプロパティを使用して、MarkdownコンテンツをフルページのHTMLドキュメントで包むレイアウトコンポーネントを指定できます。

Markdownページがレイアウトを使用する場合、レイアウトにはすべてのMarkdownのfront-matterデータと最終的なHTML出力を含む、単一の `content` プロパティを渡します。 レイアウトコンポーネントでこの `content` プロパティをどのように使用するかは、上記の `BlogPostLayout.Astro` の例を参照してください。

```markdown
// src/pages/posts/post-1.md
---
title: ブログ記事
description: 最初のブログ記事
layout: ../layouts/BlogPostLayout.astro
---
これはMarkdownで書かれた投稿です。
```

📚 AstroのMarkdownサポートについては、[Markdownガイド](/ja/guides/markdown-content/)で詳しく説明しています。
