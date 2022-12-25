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

**`src/layouts/MySiteLayout.astro`**

```astro
---
---
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <title>クールなAstroサイト</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
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

**`src/pages/index.astro`**

```astro {2} /</?MySiteLayout>/
---
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>レイアウトに包まれたページのコンテンツ</p>
</MySiteLayout>
```

📚 [スロット](/ja/core-concepts/astro-components/#スロット)についてもっと学ぶ。

## Markdownのレイアウト

ページレイアウトはとくに[Markdownファイル](/ja/guides/markdown-content/#markdownページとmdxページ)に対して便利です。Markdownファイルは特別な `layout`というfrontmatterのプロパティを使用して、ページのレイアウトと使用する`.astro`コンポーネントを指定できます。

**`src/pages/posts/post-1.md`**

```markdown {2}
---
layout: ../../layouts/BlogPostLayout.astro
title: Astro in brief
author: Himanshu
description: Astroの素晴らしさを知ろう!
---
これはマークダウンで書かれた投稿です。
```

マークダウンファイルがレイアウトを含む場合、frontmatterプロパティと最終的なページのHTML出力を含む`.astro`コンポーネントに`frontmatter`プロパティを渡します。


**`src/layouts/BlogPostLayout.astro`**

```astro /frontmatter(?:.\w+)?/
---
const {frontmatter} = Astro.props;
---
<html>
  <!-- ... -->
  <h1>{frontmatter.title}</h1>
  <h2>投稿者: {frontmatter.author}</h2>
  <p>{frontmatter.description}<p>
  <slot /> <!-- マークダウンのコンテンツはここに挿入されます。 -->
   <!-- ... -->
</html>
```

📚 AstroのMarkdownサポートについては、[Markdownガイド](/ja/guides/markdown-content/)についてもっと学ぶ。

## レイアウトの入れ子

レイアウトコンポーネントは、ページ全体に相当するHTMLを含む必要はありません。レイアウトをより小さなコンポーネントに分割し、そのコンポーネントを再利用して、プロジェクトでさらに柔軟で強力なレイアウトを作成できます。

たとえば、ブログの記事によくあるレイアウトは、タイトル、日付、作者を表示するものです。`BlogPostLayout.Astro`レイアウトコンポーネントは、このUIをページに追加し、さらに大きなサイト全体のレイアウトを利用して、ページの残りの部分を処理できます。

**`src/layout/BlogPostLayout.astro`**

```astro {2} /</?BaseLayout>/
---
import BaseLayout from './BaseLayout.astro'
const {frontmatter} = Astro.props;
---
<BaseLayout>
  <h1>{frontmatter.title}</h1>
  <h2>投稿者: {frontmatter.author}</h2>
  <slot />
</BaseLayout>
```
