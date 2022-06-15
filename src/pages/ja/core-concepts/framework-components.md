---
layout: ~/layouts/MainLayout.astro
title: UIフレームワーク
description: React や Svelte を利用する方法をご紹介します。
i18nReady: true
---

お好みの UI コンポーネントのフレームワークを生かして Astro でウェブサイトを作成してみましょう。

Astro は [React](https://ja.reactjs.org/) や [Preact](https://preactjs.com/)、[Svelte](https://svelte.dev/)、[Vue](https://vuejs.org/)、[SolidJS](https://www.solidjs.com/)、[AlpineJS](https://alpinejs.dev/)、[Lit](https://lit.dev/) のような人気のある様々なフレームワークをサポートしています。

## 統合機能をインストールする

Astro は React、Preact、Svelte、Vue、SolidJS、Lit 用の任意の統合機能を提供しています。1つ以上の Astro の統合機能をプロジェクトにインストールし、設定することが可能です。

これらのフレームワークを使うことができるよう Astro を設定するためにはまずこれらの統合機能と関連する peer dependencies をインストールします。

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

⚙️ Astro の統合機能をインストールし、設定するにあたっての詳細は[インテグレーションガイド](/ja/guides/integrations-guide/)をご覧ください。

⚙️ お好きなフレームワークの例を確認したいですか？[astro.new](https://astro.new/) にアクセスして、そのフレームワークのテンプレートを選択してみてください。

## フレームワークのコンポーネントを利用する

Astro のコンポーネントと同じように、お好きな JavaScript フレームワークを Astro のページやレイアウト、コンポーネント内で使ってみましょう！あなたが `src/components` 配下で書いたコンポーネントは共存したり、お好きな方法で組み合わせることができます。

フレームワークのコンポーネントを使用するには、Astro コンポーネント内のスクリプトで（拡張子を含んだ形の）相対パスでインポートしてください。そして、そのコンポーネントを Astro コンポーネントのテンプレート内で他のコンポーネントや HTML 要素、JSX に似た式と一緒に使用してください。

```astro
---
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<html>
  <body>
    <h1>Use React components directly in Astro!</h1>
    <MyReactComponent />
  </body>
</html>
```

> 💡 _注意点: すべてのインポートは Astro コンポーネントのスクリプト部分の **最上部** に記載する必要があります！_

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

> ⚠️ コンポーネントのフレームワーク (例えば React、Svelte など) がレンダリングするのに必要な JavaScript はページと一緒にダウンロードされます。`client:*` というディレクティブはいつ _コンポーネントで使用される JavaScript_ がインポートされるかと、いつ _コンポーネント_ がハイドレートされるかを決定するだけです。

### 利用可能なハイドレーションのディレクティブ

UI フレームワークのコンポーネントで利用可能なハイドレーションのディレクティブがいくつかあります。`client:load`、`client:idle`、`client:visible`、`client:media={QUERY}`、`client:only={FRAMEWORK}` です。

📚 これらのハイドレーションのディレクティブやその使い方を詳しく知りたい場合は[ディレクティブのリファレンス](/ja/reference/directives-reference/#client-directives)のページをご覧ください。

## フレームワークを混在させる

同じ Astro コンポーネントの中で複数のフレームワークで作られたコンポーネントをインポートし、レンダリングすることができます。

> ⚠️ _**Astro** コンポーネント (`.astro`) だけが複数のフレームワークのコンポーネントを含むことができます_

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

## フレームワークのコンポーネントをネストさせる

Astro のコンポーネントの中に複数のフレームワークのコンポーネントをネストさせることも可能です。

```astro
---
// src/pages/MyAstroPage.astro
import MyReactSidebar from '../components/MyReactSidebar.jsx';
import MySvelteButton from '../components/MySvelteButton.svelte';
---
<MyReactSidebar>
  <p>Here is a sidebar with some text and a button.</p>
  <MySvelteButton client:load />
</MyReactSidebar>
```

> ⚠️ _注意点: フレームワークのコンポーネント自体（例: `.jsx`、`.svelte`）は複数のフレームワークを混在させることはできません。_

これによってお好みの JavaScript フレームワークで "アプリケーション" 全体をビルドし、親のコンポーネントを通して Astro のぺージへレンダリングすることができます。これは関連するコンポーネントでステートやコンテクストを共有するのに便利です。

各フレームワークには独自のネストのパターンがあります。例えば、React や Solid の `children` という props や [レンダープロップ](https://ja.reactjs.org/docs/render-props.html)、Svelte や Vue の名前つきまたはデフォルトの `<slot />` などです。

注意: Astro コンポーネントはたとえハイドレートされるフレームワークのコンポーネントがあったとしても、常に静的な HTML としてレンダリングされます。このことは HTML のレンダリングに関与しない props のみを渡すことができることを意味しています。Astro のコンポーネントから React のレンダープロップスや名前つき slot をフレームワークのコンポーネントに渡すことができません。なぜなら、Astro コンポーネントはこれらのパターンが必要としているクライアントのランタイムの挙動を提供することができないからです。

## Astro コンポーネントをハイドレートすることはできますか？

`client:` という修飾子を使って Astro コンポーネントをハイドレートしようとするとエラーになるはずです。

[Astro コンポーネント](/ja/core-concepts/astro-components/)はクライアントサイドのランタイムを持たない HTML のみを表示するコンポーネントです。しかし、`<script>` タグを Astro コンポーネントのテンプレートの中で使い、グローバルスコープで実行する JavaScript をブラウザに送信することができます。

📚 [Astro コンポーネント内のクライアントサイドのスクリプト](/ja/core-concepts/astro-components/#クライアントサイドスクリプト)で詳しく学ぶことができます。

[mdn-io]: https://developer.mozilla.org/ja-JP/docs/Web/API/Intersection_Observer_API
[mdn-ric]: https://developer.mozilla.org/ja-JP/docs/Web/API/Window/requestIdleCallback
[mdn-mm]: https://developer.mozilla.org/ja-JP/docs/Web/API/Window/matchMedia
