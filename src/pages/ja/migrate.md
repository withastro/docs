---
layout: ~/layouts/MainLayout.astro
title: アップグレードガイド
description: How to migrate your project to latest version of Astro.
i18nReady: true
---

このガイドは古いバージョンのAstroから最新のバージョンへの移行を支援するものです。

主なハイライトと、破壊的変更への対処方法については以下のガイドをお読みください。

## Astro 1.0 Beta

2022年4月4日、1.0 Betaがリリースされました！🎉

**正式なv1.0.0リリース(2022年6月8日予定)に向けて、このベータ期間中にこれ以上の破壊的変更を加えることは予定していません。**

もし、何らかの破壊的変更が必要な場合は、このセクションで呼びかけます。

## v1.0.0-beta.0へアップグレード

`v1.0.0-beta.0`に破壊的変更はありません。

v0.25以前からアップグレードする人は、いくつかの破壊的変更を含んだ以下の[v0.26へアップグレード](#v026へアップグレード)を読み、それに従っていることを確認してください。

## v0.26へアップグレード
### 新しいConfiguration API

Configuration APIは、昨年以来蓄積されたいくつかの顕著な混乱ポイントを解決するために再設計されました。ほとんどの設定は移動または名前が変更されているのみなので、ほとんどのユーザーはすぐにアップデートできるでしょう。いくつかのオプションは大きくリファクタリングされており、追加で変更が必要になるかもしれません。

- `.buildOptions.site`は`.site`(デプロイ先ドメイン)と新たな`.base`(デプロイ先のサブパス)オプションに置き換えられました。
- `.markdownOptions`は、Markdownの設定を簡素化するためにいくつかの小さな変更を加えた、ほぼ同様の設定オブジェクトである`.markdown`に置き換わりました。
- `.sitemap`は[@astrojs/sitemap](https://www.npmjs.com/package/@astrojs/sitemap)インテグレーションに移動しました。

レガシーな構成でAstroを実行すると、アップデート方法を示す警告が表示されます。アップグレードの詳細については、更新された[設定方法](/ja/reference/configuration-reference/)を参照してください。

これらの変更の背景については、[RFC0019](https://github.com/withastro/rfcs/blob/main/proposals/0019-config-finalization.md)をお読みください。

### 新しいMarkdown API

Astro v0.26は、あなたのコンテンツのための全く新しいMarkdown APIをリリースします。これには3つの大きな変更が含まれています。
- ESMのimport(`import`/`import()`)を使用してマークダウンコンテンツを直接インポートすることができるようになりました。 
- 新しい`Astro.glob()`APIは、globのインポートをより簡単にします。(特に Markdownで)。
- **破壊的変更:** `Astro.fetchContent()`は削除され、`Astro.glob()`に置き換わりました。
- **破壊的変更:** Markdownオブジェクトのインターフェイスが更新されました。

```diff
// v0.25
- let allPosts = Astro.fetchContent('./posts/*.md');
// v0.26+
+ let allPosts = await Astro.glob('./posts/*.md');
```

アップグレードする際は、新しいMarkdownオブジェクトのインターフェースに注意してください。例えば、Frontmatterは `.frontmatter` プロパティに移動したので、`post.title`のような参照は`post.frontmatter.title`に変更する必要があります。

これは、大規模なサイトにおけるパフォーマンスの向上を含む、Markdownユーザーにとっての多くの問題を解決するはずです。

これらの変更の背景については、[RFC0017](https://github.com/withastro/rfcs/blob/main/proposals/0017-markdown-content-redesign.md)をお読みください。

### スクリプトの新しいデフォルト動作

Astroコンポーネントの`<script>`タグは、デフォルトでビルド、バンドル、最適化されるようになりました。これは、Astro コンポーネントの構文をより一貫したものにし、現在の`<style>`タグのデフォルトで最適化された動作と一致させるという長期的な移行を完成させるものです。

これには、注意すべきいくつかの変更点があります。

- **破壊的変更:**`<script hoist>`の動作は新しいデフォルトの`<script>`の動作になりました。`hoist`属性は削除されました。 
- 新しい`<script is:inline>`ディレクティブは、`<script>`タグを以前のデフォルトの動作(ビルドなし、バンドルなし、Astroによる変更なし)に戻すためのものです。
- 新しい`<style is:inline>`ディレクティブは、スタイルタグをページテンプレートにインラインで残すことができます(以前の`<script>`の動作に似ています)。
- 新しい`<style is:global>`ディレクティブは、将来のリリースで`<style global>`を置き換える予定です。

```diff
// v0.25
- <script hoist>
// v0.26+
+ <script>
```

これらの変更の背景については、[RFC0016](https://github.com/withastro/rfcs/blob/main/proposals/0016-style-script-defaults.md)をお読みください。

### `Astro.request`APIの更新

`Astro.request`はカスタムオブジェクトから標準の`Request`オブジェクトに変更されました。これは、特にSSRに関連した、よりWeb標準のAPIを使用するプロジェクトの一部です。

これには、注意すべきいくつかの変更点があります。

- `Astro.request`を[Request](https://developer.mozilla.org/ja/docs/Web/API/Request)オブジェクトに変更しました。
- `Astro.request.params`を`Astro.params`に移動しました。
- `Astro.request.canonicalURL`を`Astro.canonicalURL`に移動しました。

これらの変更の背景については、[RFC0018](https://github.com/withastro/rfcs/blob/main/proposals/0018-astro-request.md)をお読みください。

### その他変更

- `Astro.slots`APIを改良し、関数ベースのスロットに引数を渡すことをサポートしました。これにより、コールバック関数を子関数として受け取る、より人間工学的なユーティリティコンポーネントが可能になります。
- CLI出力のフォーマット、特にエラーレポート周りを更新しました。
- `@astrojs/compiler`を更新し、frontmatterでの正規表現の使用に関するバグを修正しました。

## v0.25へアップグレード

### Astroインテグレーション

`renderers`の設定が新しい公式のインテグレーションシステムに置き換えられました！ これにより、Astroの非常にエキサイティングな新機能がいくつか追加されます。この新しいシステムの使用方法の詳細については、[インテグレーションを使用する](/ja/guides/integrations-guide/)ガイドを参照してください。


インテグレーションは,`renderers`の概念に代わるもので、いくつかの破壊的変更と、既存ユーザ向けの新しいデフォルト機能が付属しています。これらの変更については以下で説明します。

#### 削除: ビルトインのフレームワークサポート

以前は、React、Preact、Svelte、VueのすべてがAstroにデフォルトで含まれていました。v0.25.0 以降、Astroにはビルトインのレンダラーが付属しなくなりました。プロジェクトに`renderers`の設定項目が定義されていない場合、これらのフレームワークを自分でインストールする必要があります。

現在使用しているフレームワークに新しいAstroインテグレーションを追加する方法については、[ステップバイステップのチュートリアル](/ja/guides/integrations-guide/)をご覧ください。

#### 非推奨: Renderers

> *カスタムした"renderers"をすでに設定ファイルに定義している場合は、このセクションをお読みください。*


新しいインテグレーションシステムは、npmで公開されている`@astrojs/renderer-*`パッケージを含む、以前の`renderers`システムを置き換えるものです。今後、`@astrojs/renderer-react`は`@astrojs/react`に、`@astrojs/renderer-vue`は`@astrojs/vue`といった具合になります。

**アップグレード方法:** Astroを`v0.25.0`にアップデートし、古い`"renderers"`の設定を含む設定ファイルを使用して`astro dev`または`astro build`を実行します。現在の設定に基づき、`astro.config.mjs`ファイルに必要な変更を伝える通知がすぐに表示されます。また、以下の表を使用して、自分でパッケージを更新することもできます。

より詳しい説明は、[ステップバイステップガイド](/ja/guides/integrations-guide/)をチェックして、既存のレンダラーを新しいAstroフレームワークインテグレーションに置き換える方法を学んでください。

```diff
# 新しいインテグレーションやフレームワークをインストールする:
# (チュートリアルの詳細を読む: https://docs.astro.build/ja/guides/integrations-guide)
+ npm install @astrojs/lit lit
+ npm install @astrojs/react react react-dom
```
```diff
# そして、`astro.config.mjs`ファイルをアップデートする:
# (チュートリアルの詳細を読む: https://docs.astro.build/ja/guides/integrations-guide)
+ import lit from '@astrojs/lit';
+ import react from '@astrojs/react';

export default {
-   renderers: ['@astrojs/renderer-lit', '@astrojs/renderer-react'],
+   integrations: [lit(), react()],
}
```


| npm上にある非推奨のレンダラー | v0.25+ npm上にあるインテグレーション |
| --------------------------- | -------------------------- |
| @astrojs/renderer-react     | @astrojs/react             |
| @astrojs/renderer-preact    | @astrojs/preact            |
| @astrojs/renderer-solid     | @astrojs/solid-js          |
| @astrojs/renderer-vue       | @astrojs/vue               |
| @astrojs/renderer-svelte    | @astrojs/svelte            |

#### Peer Dependenciesのハンドリング

> *以下の場合は、このセクションをお読みください。Node v14を使用している場合**または**npm以外のパッケージマネージャを使用している場合*

旧 renderersとは異なり、インテグレーションはフレームワーク自体（react、svelte、vueなど）を直接の依存対象としてマークしなくなりました。その代わり、フレームワークのパッケージを、インテグレーションに**加えて**インストールする必要があります。


```diff
# 例: インテグレーションとともにフレームワークもインストールする
- npm install @astrojs/react
+ npm install @astrojs/react react react-dom
```

Astroの起動時に「Cannot find package 'react'」（または同様の警告）が表示された場合、そのパッケージをプロジェクトにインストールする必要があることを意味します。詳細については、インテグレーションの[peer dependenciesに関する注意書き](/ja/guides/integrations-guide/#handling-integration-dependencies)を参照してください。

npmとNode v16+を使用している場合、npmの最新バージョン（v7+）がこのようなpeer dependenciesを自動的にインストールするため、npmによって自動的に処理される場合があります。その場合、reactのようなフレームワークをプロジェクトにインストールすることは、必須ではありませんが、推奨されるステップです。

### 更新: シンタックスハイライト

私たちはすぐに使える気の利いたデフォルト機能を見つける大好きです。 その一環として[Shiki](https://github.com/shikijs/shiki)を新しいデフォルトのシンタックスハイライターに決定しました。 これは`github-dark`テーマにあらかじめ設定されていて、余計なCSSクラス、スタイルシート、クライアントサイドのjsなしで、設定せずともシンタックスハイライトを提供してくれます。

詳細については新しい[シンタックスハイライトのドキュメント](/ja/guides/markdown-content/#syntax-highlighting)をご覧ください。 **もし、シンタックスハイライトにPrismを使用したい場合は、** プロジェクトのマークダウン設定で[`syntaxHighlight`オプションを`prism`](/ja/guides/markdown-content/#prism-configuration)に設定してください。

#### `<Prism />`コンポーネントを新しい場所へ

Astroのコアをできるだけスリムにするというミッションの一環として、ビルドインだった`Prism`コンポーネントを`astro/components`から`@astrojs/prism`パッケージに移動させました。このコンポーネントは`@astrojs/prism`から以下のようにインポートできます。

```astro
---
import { Prism } from '@astrojs/prism';
---
```

`@astrojs/prism`パッケージは`astro`のコアにバンドルされているので、新たにインストールする必要はありませんし、Prismをインテグレーションとして追加する必要もありません！しかし、将来的には`@astrojs/prism`(およびPrismのシンタックスハイライト全般)を別のインストール可能なパッケージとして切り出す予定であることに注意してください。詳しくは[`<Prism />`コンポーネントAPIリファレンス](/ja/reference/api-reference/#prism-)を参照してください。

### CSSパーサーの更新

内部のCSSパーサーが更新され、コンテナクエリなどの高度なCSS構文がより良くサポートされるようになりました。これはほとんどのユーザーにとってほとんど目に見えない変更ですが、上級ユーザーが新しいCSS機能のサポートを享受できることを期待しています。

## v0.24へアップグレード

> 0.24では、新しいビルド方法がデフォルトで有効になっています。もし問題が発生した場合は、`--legacy-build`フラグを指定することで、古いビルド方法を使用し続けることができます。新しいビルド方法に関する問題を解決するために、[issueを登録](https://github.com/withastro/astro/issues/new/choose)してください。

0.24 では、いくつかの機能の動作を変更する新しい *静的ビルド* 戦略を導入しました。以前のバージョンのAstroでは、これは`--experimental-static-build`フラグを付与した際の動作でした。

アップグレードに向けて、この新しいビルドエンジンに移行するために必要な以下の変更点に注意してください。これらの変更はいつでもコードに加えることができるので、想定より早く準備することができるでしょう。

### 非推奨: `Astro.resolve()`

`Astro.resolve()`を使うと、ブラウザで参照したいアセットの解決済みのURLを取得することができます。これは、必要に応じてCSSファイルや画像を読み込むために、`<link>`タグや`<img>`タグの内部で最もよく使用されていました。しかし残念ながら、Astroが *レンダリング時* ではなく *ビルド時* にアセットを構築するようになったため、機能しなくなりました。今後利用可能な以下の将来性のあるオプションのいずれかに、参照先をアップグレードすることをお勧めします。

#### CSSファイルのパス解決

**1. ESM Import (おすすめ)**

**例:** `import './style.css';`
**使いどころ:** CSSファイルが `src/` ディレクトリ内にあり、CSSのビルドと最適化の機能が必要な場合。

ESM Importを使用して、ページにCSSを追加します。AstroはこれらのCSSインポートを検出し、CSSを自動的にビルド、最適化、およびページに追加します。これは、Astroが提供するビルド/バンドルシステムを使いながらも`Astro.resolve()`から移行する最も簡単な方法です。

```astro
---
// 例: AstroはCSSを自動的にインクルードし最適化します。
import './style.css';
---
<html><!-- ページ内容 --></html>
```
CSSファイルのインポートは、次のようなESMのimportがサポートされている場所であれば動作します。

- JavaScriptファイル
- TypeScript ファイル
- Astroコンポーネントのfront matter
- ReactやSvelteなどの非Astroコンポーネント

この方法でCSSファイルをインポートすると、`@import`も解決され、インポートされたCSSファイルにインライン化されます。すべての`url()`関数もソースファイルからの相対パスで解決され、`url()`が参照するアセットが最終的なビルドに含まれるようになります。

**2. 絶対パス**

**例:** `<link href="/style.css">`
**使いどころ:** CSSファイルが`public/`ディレクトリ内にあり、HTMLの`link`要素を自分で作りたい場合。 

`public/`ディレクトリ内の任意のファイルはコンポーネントテンプレート内で絶対パスにより参照することができます。これは、ページ上の`<link>`タグを自分で制御したい場合に有効なオプションです。ただし、この方法は上述した`ESM Import`を使用した場合にAstroが提供する、バンドル、最適化といったCSS処理をスキップします。

デフォルトで最高のCSSパフォーマンスと機能を提供するため、絶対パスを指定するよりも`import`を使用することをお勧めします。

#### JavaScriptファイルのパス解決

**1. 絶対パス**

**例:** `<script src="/some-external-script.js" />`
**使いどころ:** JavaScriptファイルが `public/` の中にある場合。

Astroコンポーネントのテンプレートでは、`public/`ディレクトリ内の任意のファイルを絶対パスで参照することができます。これは、ページ上の`<script>`タグをページ自体で制御できるため、外部スクリプトのデフォルトオプションとして適しています。

この方法では、後述の`import`を使用した場合に、Astroが提供するJavaScriptの処理、バンドル、最適化が省略されることに注意してください。しかし、すでにAstroとは別に公開され、最小化されている外部スクリプトの場合は、この方法が好ましいかもしれません。スクリプトが外部ソースからダウンロードされる場合は、この方法が良いでしょう。

**2. `<script hoist>`によるESM Import**

**例:** `<script hoist>import './some-external-script.js';</script>`
**使いどころ:** 外部スクリプトが`src/`ディレクトリ内にあり、それがES Modulesをサポートしている場合。

Astroテンプレート内の`<script hoist>`要素内でESMのimportを使用すると、Astroは最終的なビルドにJavaScriptファイルを含めます。AstroはこれらのJavaScriptのクライアントサイドインポートを検出し、ビルド、最適化、およびページへのJavaScriptの追加を自動的に行います。これは、Astroが提供するビルド/バンドルシステムを使いながらも`Astro.resolve()`から移行する最も簡単な方法です。

```astro
<script hoist>
  import './some-external-script.js';
</script>
```

Astroはこの外部スクリプトを残りのクライアントサイドJavaScriptと一緒にバンドルし、`type="module"`で読み込むことに注意してください。古いJavaScriptファイルは `type="module"`の文脈で書かれていない場合があり、その場合はこの方法を使用するために更新する必要があるかもしれません。

#### 画像や他のアセットのパスを解決する方法

**1. 絶対パス(おすすめ)**

**例:** `<img src="/penguin.png">`
**使いどころ:** アセットが`public/`ディレクトリ内にある場合

`public/`の中に画像を配置すれば、コンポーネントテンプレート内で直接絶対パスで安全に参照することができます。これは現在使用できる最もシンプルなアセットを参照する方法であり、Astroを使い始めたほとんどのユーザーに推奨される方法です。

**2. ESM Import**

**例:** `import imgUrl from './penguin.png'`
**使いどころ:** アセットが `src/` ディレクトリ内にあり、ファイル名のハッシュ化のような自動最適化機能が必要な場合。 

これは、あらゆるJavaScriptまたはAstroコンポーネントの内部で動作し、最終的な画像への解決されたURLを返します。そのURLはコンポーネントテンプレート内のどこでも使うことができます。

```astro
---
// 例: Astroはこの画像を最終的なビルドに含めます。
import imgUrl from './penguin.png';
---
<img src={imgUrl} />
```

AstroがCSSを処理する方法と同様に、ESMのimportによってAstroはいくつかの簡単なビルドの最適化を自動的に実行することができます。例えば、ESMのimportを使用してインポートされた`src/`内のアセット（例：`import imgUrl from './penguin.png'`）には、そのファイル名が自動的にハッシュ化されます。これにより、サーバー上でより積極的にファイルをキャッシュすることができ、ユーザーのパフォーマンスを向上させることができます。将来、Astroはこのような最適化をさらに追加する可能性があります。

**ヒント:** 静的なESMのimportが嫌いな場合は、Astroは動的なESMのimportもサポートしています。このオプションを推奨するのは、この構文が好きな場合のみです。: `<img src={(await import('./penguin.png')).default} />`.


### 非推奨: `<script>`のデフォルト処理

以前は、すべての`<script>`要素が最終的なHTML出力から読み込まれ、自動的に処理、バンドルされていました。この動作は、もはやデフォルトではありません。0.24からは、`<script>`要素に`hoist`属性を明示する必要があります。また、hoistされたモジュールには、`type="module"`が必要です。

```astro
<script>
  // 書かれたとおりにHTMLにレンダリングされます！
  // ESMのimportはファイルからの相対パスでは解決はされません。
</script>
<script type="module" hoist>
  // 処理、バンドルされます! ESMのimportは、npmパッケージに対しても機能します。
</script>
```


## v0.23へアップグレード

### Sassが欠落するエラー

```
Preprocessor dependency "sass" not found. Did you install it?
```

npmのインストールサイズを小さくするために、Sassをオプションの依存関係に移動しました。プロジェクトでSassを使用する場合は、`npm install sass --save-dev`を実行して依存関係として保存したか確認することをお勧めします。

### 非推奨: エスケープされていないHTML

Astro v0.23+では、コード中のエスケープされていないHTMLコンテンツは非推奨になりました。
今後のリリースでは、意図しないHTMLインジェクションから保護するために、コード内のコンテンツは文字列がエスケープされるようになります。

```diff
- <h1>{title}</h1> <!-- <h1>Hello <strong>World</strong></h1> -->
+ <h1>{title}</h1> <!-- <h1>Hello &lt;strong&gt;World&lt;/strong&gt;</h1> -->
```

エスケープされていないHTMLを注入する場合、今後は`set:html`を使用する必要があります。

```diff
- <h1>{title}</h1>
+ <h1 set:html={title} />
```

ラッパー要素を避けるために、`set:html`は`<Fragment>`と一緒に動作します。

```diff
- <h1>{title}!</h1>
+ <h1><Fragment set:html={title}>!</h1>
```

また、`set:text`を使えば、意図しないHTMLインジェクションから保護することができます。

```astro
<h1 set:text={title} /> <!-- <h1>Hello &lt;strong&gt;World&lt;/strong&gt;</h1> -->
```

## v0.21へアップグレード

### Vite

v0.21から、Astroは[Vite]でビルドされるようになりました。
そのため、`snowpack.config.mjs`に書かれている設定は`astro.config.mjs`に移動する必要があります。

```js
// @ts-check

/** @type {import('astro').AstroUserConfig} */
export default {
  renderers: [],
  vite: {
    plugins: [],
  },
};
```

Viteの設定について詳しく知りたい方は、Viteの[設定ガイド](https://vitejs.dev/config/)をご覧ください。

#### Viteプラグイン

Astro v0.21+では、Viteプラグインは`astro.config.mjs`内で設定することができます。

```js
import { imagetools } from 'vite-imagetools';

export default {
  vite: {
    plugins: [imagetools()],
  },
};
```

Viteプラグインの詳細については、Viteの[プラグインガイド](https://vitejs.dev/guide/using-plugins.html)をご覧ください。

#### レンダラーに関するViteの変更

Astro v0.21+では、プラグインは`viteConfig()`を使用するようになりました。

```diff
// renderer-svelte/index.js
+ import { svelte } from '@sveltejs/vite-plugin-svelte';

export default {
  name: '@astrojs/renderer-svelte',
  client: './client.js',
  server: './server.js',
-  snowpackPlugin: '@snowpack/plugin-svelte',
-  snowpackPluginOptions: { compilerOptions: { hydratable: true } },
+  viteConfig() {
+    return {
+      optimizeDeps: {
+        include: ['@astrojs/renderer-svelte/client.js', 'svelte', 'svelte/internal'],
+        exclude: ['@astrojs/renderer-svelte/server.js'],
+      },
+      plugins: [
+        svelte({
+          emitCss: true,
+          compilerOptions: { hydratable: true },
+        }),
+      ],
+    };
+  },
}
```

Viteプラグインの詳細については、Viteの[プラグインガイド](https://vitejs.dev/guide/using-plugins.html)をご覧ください。

> 以前のリリースでは、これらは`snowpackPlugin`または`snowpackPluginOptions`で設定されていました。


### エイリアス

Astro v0.21+ では、インポートエイリアスを`tsconfig.json`または`jsconfig.json`から追加できるようになりました。

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["src/components/*"]
    }
  }
}
```

_これらのエイリアスは、[VSCode](https://code.visualstudio.com/docs/languages/jsconfig)や他のエディタに自動的に統合されます_。

### インポート時の拡張子

Astro v0.21+では、ファイルはディスク上のものと同じ実際の拡張子で参照する必要があります。この例では、`Div.tsx`は`Div.jsx`ではなく`Div.tsx`として参照される必要があります。

```diff
- import Div from './Div.jsx' // Astro v0.20
+ import Div from './Div.tsx' // Astro v0.21
```

この変更は、`Div.scss`のようなコンパイル済みのCSSファイルにも同様に適用されます。

```diff
- <link rel="stylesheet" href={Astro.resolve('./Div.css')}>
+ <link rel="stylesheet" href={Astro.resolve('./Div.scss')}>
```

### 削除: Frontmatter内のコンポーネント

以前は、Astroのコンポーネント構文ではなくJSX構文を使って、AstroのFrontmatterの中にミニAstroコンポーネントを作成することができました。これは常にちょっとしたハックでしたが、新しいコンパイラではサポートが不可能になりました。Astroの将来のリリースでは、JSXではない別のAPIを使用して、この機能を再導入したいと考えています。

v0.21+に移行するには、すべてのJSX Astroコンポーネント（つまり、他のコンポーネントのFrontmatter内に作成されたAstroコンポーネント）を独立したコンポーネントに変換してください。

### スタイリングの変更

#### Autoprefixer

Autoprefixerは、デフォルトでは実行されなくなりました。有効にするには

1. 最新版をインストールする。（`npm i autoprefixer`）
2. プロジェクトルートに`postcss.config.cjs`ファイルを以下のように作成する。
   ```js
   module.exports = {
     plugins: {
       autoprefixer: {},
     },
   };
   ```

#### Tailwind CSS

PostCSSがインストールされていることを確認します。これは以前のリリースではオプションでしたが、現在は必須です。

1. 最新版のpostcssをインストールする(`npm i -D postcss`)
2. プロジェクトのルートに以下のように`postcss.config.cjs`ファイルを作成する。
   ```js
   module.exports = {
     plugins: {
       tailwindcss: {},
     },
   };
   ```
   詳しくは、[Tailwind CSSドキュメント](https://tailwindcss.com/docs/installation#add-tailwind-as-a-post-css-plugin)をご覧ください。


### 既知の問題

#### トップでのインポート

Astro v0.21+では、コンポーネント内のインポートがフロントマターの先頭になければならないバグがあります。

```astro
---
import Component from '../components/Component.astro'
const whereShouldIPutMyImports = "on top!"
---
```


[vite]: https://vitejs.dev
