---
layout: ~/layouts/MainLayout.astro
title: 静的アセット
description: Astroでさまざまな種類のコンテンツをインポートする方法を説明します。
i18nReady: true
---

Astroは、ほとんどの静的アセットを設定不要でサポートしています。プロジェクトのJavaScript（Astro front-matterスクリプトを含む）のどこでも`import`文を使用でき、Astroは最終ビルドにその静的アセットのビルドされた最適化されたコピーを含めます。また、`@import`はCSSと`<style>`タグの中でもサポートされています。


## サポートされるファイルタイプ

Astroは、標準で以下のファイル形式をサポートしています。

- Astroコンポーネント（`.astro`）
- Markdown（`.md`）
- JavaScript（`.js`、`.mjs`）
- TypeScript（`.ts`、`.tsx`）
- NPMパッケージ
- JSON（`.json`）
- JSX（`.jsx`、`.tsx`）
- CSS（`.css`）
- CSS Modules（`.module.css`）
- イメージとアセット（`.svg`、`.jpg`、`.png`など）

お探しのアセットタイプがない場合は、[インテグレーションライブラリ](https://astro.build/integrations/)をご確認ください。SvelteやVueコンポーネントのように、Astroを拡張して異なるファイルタイプに対応させることができます。

このガイドでは、さまざまな種類のアセットがAstroによってどのように構築されるか、また、それらをうまくインポートする方法について詳しく説明します。

また、プロジェクトの[`public/`ディレクトリ](/ja/core-concepts/project-structure/#public)に任意の静的アセットを置くこともでき、Astroはそれらを最終ビルドに直接コピーすることを覚えておいてください。`public/`ファイルはAstroによってビルドやバンドルされないので、どのようなタイプのファイルでもサポートされます。`public/`ファイルは、HTMLテンプレート内で、直接URLパスで指定すると参照できます。


## JavaScript

```js
import { getUser } from './user.js';
```

JavaScriptは、通常のESMの`import`と`export`の構文でインポートできます。これは、デフォルトのNode.jsとブラウザの動作に基づき、期待通りに動作します。


## TypeScript

```js
import { getUser } from './user.ts';
import type { UserType } from './user.ts';
```

Astroには、[TypeScript](https://www.typescriptlang.org/)のサポートが組み込まれています。Astroプロジェクトで`.ts`や`.tsx`ファイルを直接インポートでき、[Astroコンポーネント](/ja/core-concepts/astro-components/#コンポーネントスクリプト)の中で直接TypeScriptコードを記述できます。

**型チェックは、IDEや別のスクリプトなど、Astroの外部で行う必要があります。** [Astro VSCode Extension](/ja/editor-setup/)は、自動的にTypeScriptのヒントとエラーを開いているファイル内に表示します。

📚 [AstroのTypeScriptサポート](/ja/guides/typescript/)の詳細はこちら。


## JSX / TSX

```js
import { MyComponent } from './MyComponent.jsx';
```

Astroには、プロジェクトにJSX（`*.jsx`と`*.tsx`）ファイルのサポートが組み込まれています。JSXの構文は、自動的にJavaScriptにトランスパイルされます。

AstroはJSX構文を標準で理解できますが、React、Preact、Solidなどのフレームワークを適切にレンダリングするには、フレームワークのインテグレーションを含める必要があります。詳しくは、[インテグレーションガイド](/ja/guides/integrations-guide/)をご覧ください。

:::note
**Astroは`.js`/`.ts`ファイル内のJSXをサポートしません。** JSXは、`.jsx`と`.tsx`のファイル拡張子で終わるファイル内でのみ扱われます。
:::


## NPMパッケージ

```js
// ReactとReact-DOMのnpmパッケージを返します。
import React from 'react';
import ReactDOM from 'react-dom';
```

Astroを使うと、ブラウザ上で直接npmパッケージをインポートできます。パッケージがレガシーなフォーマットで公開されていても、Astroはブラウザへ提供する前にパッケージをESMへアップコンバートします。


## JSON

```js
// デフォルトのインポートでJSONオブジェクトをロードします。
import json from './data.json';
```

Astroは、JSONファイルをアプリケーションへ直接インポートできます。インポートされたファイルは、デフォルトのインポートで完全なJSONオブジェクトを返します。


## CSS

```js
// 'style.css'を読み込んで、ページに注入します。
import './style.css';
```

Astroは、CSSファイルをアプリケーションに直接インポートすることをサポートしています。インポートされたスタイルはエクスポートされませんが、インポートすることで自動的にそれらのスタイルがページに追加されます。これはデフォルトですべてのCSSファイルに対して機能し、プラグインによってSassやLessのようなコンパイル可能なCSS言語もサポートします。

CSSを書きたくない場合は、AstroはCSS-in-JSライブラリ（例：styled-components）にも対応しており、スタイリングできます。


## CSSモジュール

```jsx
// 1. './style.module.css'のクラス名をユニークでスコープされた値に変換します。
// 2. 元のクラス名と、最終的にスコープされた値をマッピングしたオブジェクトを返します。
import styles from './style.module.css';

// この例ではJSXを使っていますが、CSSモジュールはどんなフレームワークでも使うことができます。
return <div className={styles.error}>Your Error Message</div>;
```

Astroは、`[name].module.css`という命名規則を使用してCSSモジュールをサポートしています。他のCSSファイルと同様に、インポートすると自動的にそのCSSがページに適用されます。しかし、CSSモジュールは特別なデフォルトの `styles` オブジェクトをエクスポートし、オリジナルのクラス名を一意の識別子にマップします。

CSSモジュールは、スタイルシートのために一意に生成されたクラス名によって、フロントエンドでコンポーネントのスコープと分離を強制するのに役立ちます。


## その他のアセット

```jsx
import imgReference from './image.png'; // img === '/src/image.png'
import svgReference from './image.svg'; // svg === '/src/image.svg'
import txtReference from './words.txt'; // txt === '/src/words.txt'

// この例ではJSXを使用していますが、どのようなフレームワークでもインポート参照を使用できます。
<img src={imgReference} />;
```

上記で明示されていないその他のアセットは、ESMの `import` を使ってインポートすることができ、最終的にビルドされたアセットへのURLリファレンスを返します。これは、JS以外のアセットをURLで参照する場合に便利です。たとえば、画像要素を作成して、その画像を指す`src`属性を指定できます。

また、[ディレクトリ構造](/ja/core-concepts/project-structure/#public)で説明されているように、画像は`public/`フォルダに配置するのも便利です。


## WASM

```js
// 要求されたWASMファイルをロードして初期化する
const wasm = await WebAssembly.instantiateStreaming(fetch('/example.wasm'));
```

Astroは、ブラウザの[`WebAssembly`](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly) APIを使用して、WASMファイルをアプリケーションに直接読み込むことをサポートしています。


## Nodeビルトイン

Astroのユーザーには、可能な限りNode.jsのビルトイン（`fs`、`path`など）を避けることをおすすめします。Astroは、将来的に複数のJavaScriptランタイムと互換性を持つことを目指しています。これには、`fs`などのNode組み込みモジュールをサポートしない[Deno](https://deno.land/)や[Cloudflare Workers](https://workers.cloudflare.com/)が含まれます。

私たちの目的は、一般的なNode.jsのビルトインに対するAstroの代替機能を提供することです。しかし、今のところそのような代替機能は存在しません。ですから、もし本当にこれらのビルトインモジュールを使う必要があるのなら、それを止めたいとは思いません。AstroはNode.jsのビルトインを、Nodeの新しいプレフィックスである`node:`を使ってサポートしています。たとえば、ファイルを読み込む場合、次のようにします。

```astro
---
// 例: Node.js から "fs/promises" ビルトインをインポートします。
import fs from 'node:fs/promises';

const url = new URL('../../package.json', import.meta.url);
const json = await fs.readFile(url, 'utf-8');
const data = JSON.parse(json);
---

<span>Version: {data.version}</span>
```
