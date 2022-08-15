---
layout: ~/layouts/MainLayout.astro
title: UIフレームワーク
description: React や Svelte を利用する方法をご紹介します。
i18nReady: true
---

お好みの UI コンポーネントのフレームワークを生かして Astro でウェブサイトを作成してみましょう。

Astro は [React](https://ja.reactjs.org/) や [Preact](https://preactjs.com/)、[Svelte](https://svelte.dev/)、[Vue](https://vuejs.org/)、[SolidJS](https://www.solidjs.com/)、[AlpineJS](https://alpinejs.dev/)、[Lit](https://lit.dev/) のような人気のある様々なフレームワークをサポートしています。

## インテグレーションをインストールする

Astro は React、Preact、Svelte、Vue、SolidJS、Lit のインテグレーションをオプションとして提供しています。1つまたは複数の Astro のインテグレーションをプロジェクトにインストールし、設定できます。

これらのフレームワークを使えるよう Astro を設定するためにはまずこれらのインテグレーションと関連する peer dependencies をインストールします。

```bash
npm install --save-dev @astrojs/react react react-dom
```

次に、それらをインポートし、`astro.config.mjs` 内の integrations の配列に関数を追加します。

```js
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import preact from '@astrojs/preact';
import svelte from '@astrojs/svelte';
import vue from '@astrojs/vue';
import solid from '@astrojs/solid-js';
import lit from '@astrojs/lit';

export default defineConfig({
  integrations: [react(), preact(), svelte(), vue(), solid() , lit()],
});
```

⚙️ Astro のインテグレーションをインストールし、設定するにあたっての詳細は[インテグレーションガイド](/ja/guides/integrations-guide/)をご覧ください。

⚙️ お好きなフレームワークの例を確認したいですか？[astro.new](https://astro.new/) にアクセスして、そのフレームワークのテンプレートを選択してみてください。

## フレームワークのコンポーネントを利用する

Astro のコンポーネントと同じように、お好きな JavaScript フレームワークを Astro のページやレイアウト、コンポーネント内で使ってみましょう！すべてのコンポーネントは、`/src/components` に同居させることも、好きなように整理することもできます。

フレームワークのコンポーネントを使用するには、Astro コンポーネント内のスクリプトで（拡張子を含んだ形の）相対パスでインポートしてください。そして、そのコンポーネントを Astro コンポーネントのテンプレート内で他のコンポーネントや HTML 要素、JSX に似た式と一緒に使用してください。

```astro
---
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<html>
  <body>
    <h1>Astro の中で React コンポーネントを直接使用してください！</h1>
    <MyReactComponent />
  </body>
</html>
```

:::tip
すべてのインポートは Astro コンポーネントのスクリプト部分の **最上部** に記載する必要があります！
:::

デフォルトでは、フレームワークのコンポーネントは静的な HTML としてレンダリングされます。このことはインタラクティブでないコンポーネントを表示するのに有用で、必要のない JavaScript をクライアントに送信するのを防いでくれます。

## インタラクティブなコンポーネントをハイドレートする

`client:*` というディレクティブの内の1つを使用してフレームワークのコンポーネントをインタラクティブに (ハイドレーションした状態に) することができます。これはコンポーネントがどのようにレンダリングされ、ハイドレートされるかを定義するためのコンポーネントの属性です。

この [client ディレクティブ](/ja/reference/directives-reference/#client-directives) はコンポーネントがビルド時にレンダリングされるかどうか、コンポーネントで使用されている JavaScript がクライアントサイドでいつブラウザに読み込まれるかを表しています。

ほとんどのディレクティブでビルド時にサーバー内でコンポーネントをレンダリングします。コンポーネント内の JavaScript は特定のディレクティブに応じてクライアントに送信されます。コンポーネントは自身に含まれる JavaScript をインポートし終えた段階でハイドレートします。

```astro
---
// 例: ブラウザでコンポーネントをハイドレートする
import InteractiveButton from '../components/InteractiveButton.jsx';
import InteractiveCounter from '../components/InteractiveCounter.jsx';
---
<!-- このコンポーネントの JavaScript はページ読み込み時にインポートが開始されます -->
<InteractiveButton client:load />

<!-- このコンポーネントの JavaScript はユーザーがスクロールしてコンポーネントがページ内に表示されるまでクライアントに送信さません -->
<InteractiveCounter client:visible />
```

:::caution
コンポーネントのフレームワーク (例えば React、Svelte など) がレンダリングするのに必要な JavaScript はページと一緒にダウンロードされます。`client:*` というディレクティブはいつ _コンポーネントで使用される JavaScript_ がインポートされるかと、いつ _コンポーネント_ がハイドレートされるかを決定するだけです。
:::

### 利用可能なハイドレーションのディレクティブ

UI フレームワークのコンポーネントで利用可能なハイドレーションのディレクティブがいくつかあります。`client:load`、`client:idle`、`client:visible`、`client:media={QUERY}`、`client:only={FRAMEWORK}` です。

📚 これらのハイドレーションのディレクティブやその使い方を詳しく知りたい場合は[ディレクティブのリファレンス](/ja/reference/directives-reference/#client-directives)のページをご覧ください。

## フレームワークを混在させる

同じ Astro コンポーネントの中で複数のフレームワークで作られたコンポーネントをインポートし、レンダリングすることができます。

:::caution
**Astro** コンポーネント (`.astro`) だけが複数のフレームワークのコンポーネントを含められます。
:::

```astro
---
// src/pages/MyAstroPage.astro
// 例: 同じページで複数のフレームワークのコンポーネントを混在させる
import MyReactComponent from '../components/MyReactComponent.jsx';
import MySvelteComponent from '../components/MySvelteComponent.svelte';
import MyVueComponent from '../components/MyVueComponent.vue';
---
<div>
  <MySvelteComponent />
  <MyReactComponent />
  <MyVueComponent />
</div>
```


## フレームワークコンポーネントに子コンポーネントを渡す

Astroコンポーネントでは、フレームワークコンポーネントに子コンポーネントを**渡せます**。各フレームワークは、これらの子コンポーネントを参照するための固有のパターンがあります。React、Preact、Solidは`children`という特別なプロパティを使用し、SvelteとVueは`<slot />`という要素を使用します。

```astro
// src/pages/MyAstroPage.astro
---
import MyReactSidebar from '../components/MyReactSidebar.jsx';
---
<MyReactSidebar>
  <p>Here is a sidebar with some text and a button.</p>
</MyReactSidebar>
```

さらに、[名前付きスロット](/en/core-concepts/astro-components/#named-slots)を使って、特定の子要素をグループ化できます。

React、Preact、Solidでは、これらのスロットはトップレベルのプロパティに変換されます。`kebab-case`を使用しているスロット名は、`camelCase`に変換されます。

```astro
// src/pages/MyAstroPage.astro
---
import MySidebar from '../components/MySidebar.jsx';
---
<MySidebar>
  <h2 slot="title">メニュー</h2>
  <p>テキストとボタンを含むサイドバーがあります。</p>
  <ul slot="social-links">
    <li><a href="https://twitter.com/astrodotbuild">Twitter</a></li>
    <li><a href="https://github.com/withastro">GitHub</a></li>
  </ul>
</MySidebar>
```

```jsx
// src/components/MySidebar.jsx
export default function MySidebar(props) {
  return (
    <aside>
      <header>{props.title}</header>
      <main>{props.children}</main>
      <footer>{props.socialLinks}</footer>
    </aside>
  )
}
```

SvelteとVueでは、これらのスロットは`<slot>`要素に`name`属性を付けて参照できます。また、`kebab-case`を使用したスロット名は保持されます。

```jsx
// src/components/MySidebar.svelte
<aside>
  <header><slot name="title" /></header>
  <main><slot /></main>
  <footer><slot name="social-links" /></footer>
</aside>
```


## フレームワークのコンポーネントをネストさせる

Astroファイルの中には、フレームワークコンポーネントの子もハイドレーションされたコンポーネントにできます。これは、フレームワークのどれからでも、コンポーネントを再帰的にネストできることを意味します。

```astro
---
// src/pages/MyAstroPage.astro
import MyReactSidebar from '../components/MyReactSidebar.jsx';
import MyReactButton from '../components/MyReactButton.jsx';
import MySvelteButton from '../components/MySvelteButton.svelte';
---

<MyReactSidebar>
  <p>テキストとボタンを含むサイドバーがあります。</p>
  <div slot="actions">
    <MyReactButton client:idle />
    <MySvelteButton client:idle />
  </div>
</MyReactSidebar>
```

:::caution
フレームワークのコンポーネント自体（例: `.jsx`、`.svelte`）は複数のフレームワークを混在させることはできません。
:::

これにより、お好みのJavaScriptフレームワークで「アプリ」全体を構築し、親コンポーネントを介してAstroのページにレンダリングできます。

:::note
Astroコンポーネントは、ハイドレーションされるフレームワークコンポーネントを含む場合でも、常に静的なHTMLとしてレンダリングされます。つまり、HTMLのレンダリングを行わないpropsしか渡すことができないのです。AstroコンポーネントからフレームワークコンポーネントにReactの「render props」を渡しても、Astroコンポーネントはこのパターンが要求するクライアント実行時の動作を提供できないため、うまくいきません。代わりに、名前付きスロットを使用します。
:::


## Astro コンポーネントをハイドレートすることはできますか？

`client:` という修飾子を使って Astro コンポーネントをハイドレートしようとするとエラーになるはずです。

[Astro コンポーネント](/ja/core-concepts/astro-components/)はクライアントサイドのランタイムを持たない HTML のみを表示するコンポーネントです。しかし、`<script>` タグを Astro コンポーネントのテンプレートの中で使い、グローバルスコープで実行する JavaScript をブラウザに送信することができます。

📚 [Astroコンポーネントのクライアントサイド`<script>`タグ](/ja/core-concepts/astro-components/#クライアントサイドスクリプト)についてもっと学ぶ

[mdn-io]: https://developer.mozilla.org/ja-JP/docs/Web/API/Intersection_Observer_API
[mdn-ric]: https://developer.mozilla.org/ja-JP/docs/Web/API/Window/requestIdleCallback
[mdn-mm]: https://developer.mozilla.org/ja-JP/docs/Web/API/Window/matchMedia
