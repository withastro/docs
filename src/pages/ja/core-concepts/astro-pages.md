---
layout: ~/layouts/MainLayout.astro
title: ページ
description: Astroページの紹介
i18nReady: true
---

**ページ**は、`src/pages/`サブディレクトリにある[Astroコンポーネント](/ja/core-concepts/astro-components/)の特殊なタイプです。Webサイトの各HTMLページのルーティング、データロード、全体的なページレイアウトを処理する役割を担っています。

### ファイルベースルーティング

Astroは、**ファイルベースルーティング**と呼ばれるルーティング手法を採用しています。 `src/pages`ディレクトリ内のすべての`.astro`ファイルは、そのファイルパスに基づいてサイトのページ、またはエンドポイントになります。

ページ間のリンクを張るには、HTMLの[`<a>`要素](https://developer.mozilla.org/ja/docs/Web/HTML/Element/a)をコンポーネントテンプレートに記述してください。

📚 [Astroのルーティング](/ja/core-concepts/routing/)について詳しくみる。

### ページのHTML

Astroページは、`<head>` と `<body>` を含む完全な `<html>...</html>` ページレスポンスを返す必要があります。（`<!doctype html>` はオプションで、書かなくても自動的に追加されます）。

```astro
---
// 例: src/pages/index.astro
---
<html>
  <head>
    <title>ホームページ</title>
  </head>
  <body>
    <h1>私のホームページへようこそ！</h1>
  </body>
</html>
```

### ページレイアウトの活用

すべてのページで同じHTML要素を繰り返すことを避けるために、共通の `<head>` と `<body>` 要素を独自の[レイアウトコンポーネント](/ja/core-concepts/layouts/)に移動できます。レイアウトコンポーネントはいくつでも使えます。

```astro
---
// 例: src/pages/index.astro
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>レイアウトに包まれたコンテンツ！</p>
</MySiteLayout>
```

📚 Astroの[レイアウトコンポーネント](/ja/core-concepts/layouts/)について詳しくみる。


## Markdownページ

Astroは `/src/pages/` にあるMarkdown (`.md`) ファイルも、最終的なWebサイトのページとして扱います。これらは一般的に、ブログの投稿やドキュメントのような、テキストを多用するページに使用されます。

ページレイアウトは[Markdownファイル](#markdownページ)に対して特に有効です。Markdownファイルは特別な `layout`というfront-matterプロパティを使用して、Markdownコンテンツを `<html>...</html>` ページドキュメントにラップする [レイアウトコンポーネント](/ja/core-concepts/layouts/)を指定できます。


```md
---
# 例: src/pages/page.md
layout: '../layouts/MySiteLayout.astro'
title: 'Markdownページ'
---
# タイトル

これは**Markdown**で書かれたページです。
```

📚 Astroの[Markdown](/ja/guides/markdown-content/)について詳しくみる。


## HTMLではないページ

`.json`や`.xml`などのHTMLではないページや、画像などのアセットも、一般的に**ファイルルート**と呼ばれるAPIルートで構築できます。

**ファイルルート**は、拡張子が `.js` または `.ts` であるスクリプトファイルで、`src/pages/` ディレクトリに配置されたものです。

ビルドされるファイル名と拡張子はソースファイルの名前に基づいています。たとえば、`src/pages/data.json.ts` は、最終的に `/data.json` のパスとマッチするようにビルドされます。

SSR（サーバーサイドレンダリング）では、拡張子は関係ないので省略できます。これは、ビルド時にファイルが生成されないためです。その代わり、Astroは1つのサーバーファイルを生成します。

```js
// 例: src/pages/builtwith.json.ts
// 出力先: /builtwith.json

// ファイルルートはget()関数をエクスポートし、それがファイルを生成するために呼び出されます。
// 最終的なビルドでファイルの内容を保存するために、`body` を持つオブジェクトを返します。
export async function get() {
  return {
    body: JSON.stringify({
      name: 'Astro',
      url: 'https://astro.build/',
    }),
  };
}
```

APIルートは、[params](/ja/reference/api-reference/#params)と[Request](https://developer.mozilla.org/ja/docs/Web/API/Request) を含む `APIContext` オブジェクトを受け取ります。


```ts
import type { APIContext } from 'astro';

export async function get({ params, request }: APIContext) {
  return {
    body: JSON.stringify({
      path: new URL(request.url).pathname
    })
  };
}
```

APIルートの関数は `APIRoute` 型を使って書くこともできます。これにより、APIルートが間違った型を返した場合に、より適切なエラーメッセージを表示できます。

```ts
import type { APIRoute } from 'astro';

export const get: APIRoute = ({ params, request }) => {
  return {
    body: JSON.stringify({
      path: new URL(request.url).pathname
    })
  };
};
```

## カスタム404エラーページ

カスタムの404エラーページを作成するには、`src/pages`に `404.astro` または `404.md` ファイルを作成します。

これは `404.html` ページにビルドされます。ほとんどの[デプロイサービス](/ja/guides/deploy/)はこのファイルを見つけて使用します。
