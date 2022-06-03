---
layout: ~/layouts/MainLayout.astro
title: CSSとスタイル
description: コンポーネントにスタイルを付与する
i18nReady: true
setup: |
  import Since from '../../../components/Since.astro';
---
AstroはスタイリングやCSSの記述を簡単にするために設計されました。Astroコンポーネントの内部に直接CSSを記述したり、[Tailwind][tailwind]などのお気に入りのCSSライブラリをインポートできます。Sass][sass]や[Less][less]などの高度なスタイリング言語もサポートされています。

## Astroでのスタイリング

Astroコンポーネントのスタイリングは、コンポーネントまたはページテンプレートに`<style>`タグを追加するだけで簡単です。Astroコンポーネント内に`<style>`タグを設置すると、AstroがCSSを検出し、スタイルを自動で処理します。

```astro
<style>
  h1 { color: red; }
</style>
```

### スタイルのスコープ

Astroの`<style>`CSSルールは、**デフォルトで自動的にスコープされます**。スコープされたスタイルは、その同じコンポーネントの内部に書かれたHTMLにのみ適用されるように内部でコンパイルされます。Astroコンポーネント内に記述したCSSは、自動的にそのコンポーネントの中にカプセル化されます。

```diff
<style>
-  h1 { color: red; }
+  h1.astro-HHNQFKH6 { color: red; }
-  .text { color: blue; }
+  .text.astro-HHNQFKH6 { color: blue; }
</style>
```
スコープされたスタイルは漏れず、サイトの他の部分に影響を与えることはありません。Astroでは、`h1 {}`や`p {}`のようなユニークではないセレクタを使用しても問題ありません。なぜなら、最終的な出力ではスコープされてコンパイルされるからです。

また、スコープされたスタイルは、テンプレート内に含まれる他のAstroコンポーネントには適用されません。子コンポーネントにスタイルを設定する必要がある場合、そのコンポーネントを`<div>`(または他の要素)でラップしてからスタイルを付与するか検討してください。

#### グローバルスタイル

ほとんどのコンポーネントではスコープされたスタイルを使うことをおすすめしますが、いずれはグローバルでスコープされていないCSSを書くまっとうな理由が見つかるかもしれません。この場合、`<style is:global>`属性を使って、CSSの自動的なスコープを無効にできます。

```html
<style is:global>
  /* スコープされず、ブラウザにそのまま配信されます。
     サイト内の全ての<h1>タグに適用されます。*/
  h1 { color: red; }
</style>
```

また、`:global()`セレクタを使用すると、同じ`<style>`タグ内にグローバルなスタイルとスコープ付きのスタイルを混在させられます。これは、コンポーネントの子要素にスタイルを適用するための強力なパターンになります。

```astro
<style>
  /* スコープされ、このコンポーネントに対してのみ適用される。 */
  h1 { color: red; }
  /* グローバルが混在、子要素の`h1`にのみ適用されます。*/
  article :global(h1) {
    color: blue;
  }
</style>
<h1>Title</h1>
<article><slot /></article>
```

これは、ブログの投稿や、CMSを使用したドキュメントなど、コンテンツがAstroの外にあるものをスタイルするのに最適な方法です。ただし、特定の親コンポーネントを持つかどうかで外観が異なるコンポーネントは、トラブルシューティングが困難になる可能性があるので注意が必要です。

スコープされたスタイルができるだけ頻繁に使用されるべきです。グローバルなスタイルは、必要なときだけ使うべきでしょう。
### CSS変数

<Since v="0.21.0" />

Astroの`<style>`は、ページ上で利用可能なあらゆるCSS変数を参照できます。また、`define:vars`ディレクティブを使用して、コンポーネントのfront-matterから直接CSS変数を渡せます。

```astro
---
const foregroundColor = "rgb(221 243 228)";
const backgroundColor = "rgb(24 121 78)";
---
<style define:vars={{ foregroundColor, backgroundColor }}>
  h1 {
    background-color: var(--backgroundColor);
    color: var(--foregroundColor);
  }
</style>
<h1>こんにちは</h1>
```

📚 `define:vars`については、[テンプレートディレクティブ](/ja/reference/directives-reference/#definevars)のページをご覧ください。

## 外部のスタイル

外部のグローバルなスタイルシートを参照する方法は2つあります。プロジェクトのソース内にあるファイルの場合はESMのインポート、`public/` ディレクトリにあるファイルやプロジェクトの外部でホストされているファイルの場合は絶対URLリンクになります。

📚 詳しくは`public/`や`src/`にある[静的アセット](/ja/guides/imports/)の使い方をご覧ください。

### ローカルスタイルシートのインポート

> ⚠️ npmパッケージからインポートする場合、`astro.config`を更新する必要がある場合があります。以下の[スタイルシートをnpmパッケージからインポートする](#npmパッケージからスタイルシートをインポートする)をご覧ください。

ESMのインポート構文を使用して、Astroコンポーネントのfront-matterでスタイルシートをインポートできます。CSSのインポートは、[Astroコンポーネント内の他のESMのインポート](/ja/core-concepts/astro-components/#コンポーネントスクリプト)のように動作し、**コンポーネントからの相対パス**を、ほかのimportと同様にコンポーネントスクリプトの**先頭**に記述しなければなりません。

```astro
---
// AstroはこのCSSを自動的にバンドルし、最適化します。
// これは.scssや.stylなどのプリプロセッサーのファイルにも有効です。
import '../styles/utils.css';
---
<html><!-- ページの内容 --></html>
```
ESMによるCSSの`import`は、ReactやPreactのようなJSXコンポーネントを含む、あらゆるJavaScriptファイル内でサポートされています。 これは、Reactコンポーネントに対して、コンポーネント単位できめ細かいスタイルを記述するのに便利です。

### npmパッケージからスタイルシートをインポートする 

また、外部のnpmパッケージからスタイルシートを読み込む必要がある場合もあります。これは特に[Open Props](https://open-props.style/)のようなユーティリティでよくあることです。パッケージが**ファイル拡張子の使用を推奨**している場合(例:`package-name/styles`の代わりに `package-name/styles.css` )、これは他のローカルスタイルシートと同様に動作するはずです。

```astro
---
// src/pages/random-page.astro
import 'package-name/styles.css';
---
<html><!-- ページの内容 --></html>
```

パッケージが**ファイル拡張子の使用を推奨していない**場合(例: `package-name/styles`)は、まずAstroの設定を更新する必要があります！

`package-name`から`normalize`という名前のCSSファイルをインポートしているとします(ファイル拡張子は省略されています)。ページを正しくプリレンダリングするために、`package-name`を[`vite.ssr.noExternal`配列](https://vitejs.dev/config/#ssr-noexternal)に追加してください。

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    ssr: {
      noExternal: ['package-name'],
    }
  }
})
```

> 注：これは[Vite固有の設定](https://vitejs.dev/config/#ssr-noexternal)であり、[Astro SSR](/ja/guides/server-side-rendering/)とは関係がありません。

これで、`package-name/normalize`を自由にインポートできるようになりました。これは、他のローカルスタイルシートと同様に、Astroによってバンドルされ、最適化されます。

```astro
---
// src/pages/random-page.astro
import 'package-name/normalize';
---
<html><!-- ページに内容 --></html>
```

### "link"タグで静的スタイルシートを読み込む

また、`<link>`要素を使用して、ページにスタイルシートを読み込めます。これは、`/public`ディレクトリにあるCSSファイルへの絶対URLパスか、外部のウェブサイトへのURLである必要があります。`<link>`のhref値を相対パスで指定することはサポートされていません。

```html
<head>
  <!--  ローカル: /public/styles/global.css -->
  <link rel="stylesheet" href="/styles/global.css" />
  <!-- 外部  -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.24.1/themes/prism-tomorrow.css">
</head>
```

この方法では`public/`ディレクトリを使用するため、Astro が提供する通常のCSS処理、バンドル、最適化はスキップされます。これらの変換が必要な場合は、上記の[ローカルスタイルシートのインポート](#ローカルスタイルシートのインポート)の方法を使用してください。

## CSSインテグレーション

Astroは、[Tailwind][tailwind]など、人気のCSSライブラリやツール、フレームワークをプロジェクトに追加するためのサポートを備えています!

📚 これらの統合機能のインストール、インポート、設定の手順については、[インテグレーション](/ja/guides/integrations-guide/)を参照してください。

## CSSプリプロセッサ

Astroは、[Vite][vite-preprocessors]を通じて、[Sass][sass]、[Stylus][stylus]、[Less][less]といったCSSプリプロセッサをサポートしています。

### Sass

 ```
 npm install -D sass
 ```

`.astro`ファイルで`<style lang="scss">`または`<style lang="sass">`を使用してください。

### Stylus

```
npm install -D stylus
```
`.astro`ファイルで`<style lang="styl">`または`<style lang="stylus">`を使用してください。

### Less

```
npm install -D less
```
`.astro`ファイルで`<style lang="less">`を使用してください。

> 上記のCSSプリプロセッサは、JSフレームワークの中でも使用できます。ただし、各フレームワークが推奨するパターンに従ってください。

- **React** / **Preact**: `import Styles from './styles.module.scss'`;
- **Vue**: `<style lang="scss">`
- **Svelte**: `<style lang="scss">`

## PostCSS

Astroには、[Vite](https://vitejs.dev/guide/features.html#postcss)の一部としてPostCSSが同梱されています。プロジェクトにPostCSSを設定するには、プロジェクトルートに`postcss.config.js`ファイルを作成します。プラグインは`require()`を使ってインポートすることができます。

```js
// ./postcss.config.js

module.exports = {
  plugins: [
    require('postcss-preset-env'),
    require('autoprefixer'),
  ],
};
```


---

## フレームワークとライブラリ

### 📘 React / Preact

`.jsx`ファイルはグローバルCSSとCSS Modulesの両方をサポートしています。後者を有効にするには、`.module.css`拡張子を使用します。(Sassを使用している場合は`.module.scss`/`.module.sass`)。

```js
import './global.css'; // グローバルCSSを読み込む
import Styles from './styles.module.css'; // CSS Modulesを使う (`.module.css`, `.module.scss`, または`.module.sass`にしなければなりません！)
```

### 📗 Vue

Astro内のVueは、`vue-loader`と同じメソッドをサポートしています。

- [vue-loader - Scoped CSS][vue-scoped]
- [vue-loader - CSS Modules][vue-css-modules]

### 📕 Svelte

Astro内のSvelteも期待通りに動作します。[Svelte Styling Docs][svelte-style]


## 応用編

> ⚠️注意⚠️:
> Astroの組み込みCSSバンドル機能をバイパスする場合は注意が必要です！スタイルはビルド後のアウトプットに自動的に含まれません。あなたの責任で参照されたファイルが最終的なページ出力に適切に含まれることを確認しましょう。

### `?raw` CSSインポート

高度なユースケースでは、Astroによってバンドルまたは最適化されることなく、CSSを`src`ディレクトリ内から直接読み込めます。これは、CSSのスニペットを完全に制御する必要がある場合や、Astroの自動CSS処理をバイパスする必要がある場合に便利です。

これはほとんどユーザーにおすすめされません。

```astro
---
// 高度な例！ ほとんどのユーザーにおすすめされません。
import rawStylesCSS from '../styles/main.css?raw';
---
<style is:inline set:html={rawStylesCSS}></style>
```

詳しくは[Viteのドキュメント](https://vitejs.dev/guide/assets.html#importing-asset-as-url)をご覧ください。

### `?url` CSSインポート

高度な使い方をする場合、プロジェクトの`src/`ディレクトリ内にあるCSSファイルを直接のURL参照でインポートできます。これは、CSSファイルがどのようにページに読み込まれるかを完全に制御する必要がある場合に便利です。しかし、この場合、そのCSSファイルをページの残りのCSSと一緒に最適化することはできません。

これはほとんどのユーザーにはおすすめできません。代わりに、CSSファイルを`public/`内に配置し、一貫したURLの参照を得られるようにしましょう。

> ⚠️注意⚠️:
> `?url`を指定して小さいCSSファイルをインポートすると、Base64でエンコードされたCSSファイルの内容がデータURLとして返されることがありますが、これは最終的なビルドのときだけです。エンコードされたデータURL(`data:text/css;base64,...`)をサポートするようにコードを書くか、この機能を無効にするために[`vite.build.assetsInlineLimit`](https://vitejs.dev/config/#build-assetsinlinelimit)設定オプションを `0`にセットする必要があります。

```astro
---
// 高度な例！ ほとんどのユーザーにおすすめされません。
import stylesUrl from '../styles/main.css?url';
---
<link rel="preload" href={stylesUrl} as="style">
<link rel="stylesheet" href={stylesUrl}>
```

詳しくは[Viteのドキュメント](https://vitejs.dev/guide/assets.html#importing-asset-as-url)をご覧ください。


[less]: https://lesscss.org/
[sass]: https://sass-lang.com/
[stylus]: https://stylus-lang.com/
[svelte-style]: https://svelte.dev/docs#component-format-style
[tailwind]: https://github.com/withastro/astro/tree/main/packages/integrations/tailwind
[vite-preprocessors]: https://vitejs.dev/guide/features.html#css-pre-processors
[vue-css-modules]: https://vue-loader.vuejs.org/guide/css-modules.html
[vue-scoped]: https://vue-loader.vuejs.org/guide/scoped-css.html
