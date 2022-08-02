---
layout: ~/layouts/MainLayout.astro
title: Astro vs. X
description: Astroと他の静的サイトジェネレーター（Gatsby、Next.js、Nuxt、Hugo、Eleventyなど）の比較
i18nReady: true
---
<!-- TODO: UNcomment out the parts re: number of bytes of JS etc, once we decide which values/markers we'd like to use here. -->
「Astroは、私が気に入っているプロジェクトの○○と比べてどうですか？」という質問をよく聞かれます。

このガイドは、いくつかの人気のある静的サイトジェネレーターや、Astroに類似するツールについて、その質問に答えるために書かれました。

Astroは、2つの主要な機能により、ほとんどの類似するツールとは異なっています。

- [パーシャルハイドレーション](/ja/concepts/islands/)
- [好みのUIフレームワークが使える](/ja/core-concepts/framework-components/)

詳しくは、このページの詳細な比較をご覧ください。

もし、お気に入りの静的サイトジェネレーターが掲載されていなければ、[Discordで聞いてみてください](https://astro.build/chat)。


## Docusaurus vs. Astro

[Docusaurus](https://docusaurus.io/)は、人気のドキュメントサイト生成ツールです。DocusaurusはReactを使ってWebサイトのUIを生成します。AstroはReact、Preact、Vue.js、Svelte、SolidJS、AlpineJS、Lit、生のHTMLテンプレートをサポートしています。

Docusaurusは、ドキュメントWebサイトを構築するために設計されていて、Astroにはない、ドキュメントに特化したWebサイト機能をいくつか備えています。その代わり、Astroでは、ドキュメントに特化した機能を、公式の[`docs`](https://github.com/snowpackjs/astro/tree/main/examples/docs)テーマを通じて提供しています。このWebサイトは、そのテーマのテンプレートを使って構築されています。

#### DocusaurusとAstroのパフォーマンス比較

ほとんどの場合、AstroのWebサイトはDocusaurusのWebサイトよりも大幅に速く読み込まれます。これは、Astroがページ内の不要なJavaScriptを自動的に取り除き、必要なコンポーネントのみをハイドレーションするためです。この機能を[パーシャルハイドレーション](/ja/concepts/islands/)と呼びます。

Docusaurusはパーシャルハイドレーションに対応しておらず、ページコンテンツのほとんどが静的なものであっても、ユーザーがブラウザでページ全体を読み込んで再ハイドレーションするようになっています。これにより、ページの読み込みが遅くなり、Webサイトのパフォーマンスが低下します。Docusaurusでは、この動作を無効にする方法はありません。

#### ケーススタディ：ドキュメントサイトの構築

[docusaurus.io/docs](https://docusaurus.io/docs)は、Docusaurusで構築されたDocusaurusの公式ドキュメントサイトです。このサイトは、Astroの公式ドキュメントサイトと比較しても、十分に似たデザインと機能を提供しています。これにより、2つのサイトビルダーを**大雑把に実際のサイト**で比較できます。

- **Docusaurus のパフォーマンススコア**: 53 / 100 [（テスト結果）](/lighthouse/docusaurus/)
- **Astro のパフォーマンススコア**: 92 / 100 [（テスト結果）](/lighthouse/astro/)

<!-- このパフォーマンス差の大きな理由の1つは、AstroのJavaScriptペイロードが小さいことです。
[docusaurus.io/docs](https://docusaurus.io/docs)が最初のページ読み込み時に**238kb**の JavaScriptをロードするのに対し、[docs.astro.build](https://docs.astro.build)は最初の読み込み後に**78.7kb**（全体で 67％の JavaScript 削減）の JavaScript をロードします。 -->


## Elder.js vs. Astro

[Elder.js](https://elderguide.com/tech/elderjs/)は、Svelteのために作られたこだわりの強い静的サイトジェネレーターです。

Elder.jsはSvelteを使ってWebサイトをレンダリングします。Astroはより柔軟で、人気のあるコンポーネントライブラリ（React、Preact、Vue、Svelte、Solidなど）や、AstroのHTML + JSXに似たコンポーネント構文を使ってUIを自由に構築できます。

Elder.jsは、[パーシャルハイドレーション](/ja/concepts/islands/)をサポートするサイトビルダーとして、このリストの中でもユニークな存在です。AstroもElder.jsも、ページから不要なJavaScriptを自動的に取り除き、必要な個々のコンポーネントだけをハイドレーションします。ElderのパーシャルハイドレーションのAPIは少し違っていて、AstroはElder.jsがサポートしていない、いくつかの機能（`client:media`など）をサポートしています。しかし、パフォーマンス的には、どちらのプロジェクトも非常に似通ったサイトを構築できます。

Elder.jsは独自のルーティングを採用しており、新しい開発者には馴染みがないかもしれません。Astroは[ファイルベースのルーティング](/ja/core-concepts/routing/)を採用していて、Next.jsやSvelteKit、またはEleventyのような静的サイトジェネレーターを使っている人には馴染みがあると感じられるはずです。

Elder.jsは、大規模なWebサイトで動作するように設計されていて、20,000ページ程度のWebサイトを（手頃なVM上で）10分以内に構築できると謳っています。執筆時点では、Astroは1,000ページを66秒で構築していますが、20,000ページ以上のプロジェクトではまだテストされていません。

Elder.jsは静的サイト生成（SSG）とサーバーサイドレンダリング（SSR）の両方をサポートしています。AstroはSSGによる静的ビルドと、[アダプター](/ja/guides/server-side-rendering/#enabling-ssr-in-your-project)によるSSR環境へデプロイを行えます。Deno、Vercel serverless、Netlify serverless、Node.js、今後も追加予定です。


## Eleventy vs. Astro

[Eleventy](https://www.11ty.dev/) は、Node.jsを採用した、人気の高い静的サイトジェネレーターです。

Eleventyは、いくつかの[古いHTMLテンプレート言語](https://www.11ty.dev/docs/languages/) を使用してWebサイトをレンダリングします。サポートしているテンプレート言語には、Nunjucks、Liquid、Pug、EJSなどがあります。Astroでは、お気に入りのUIコンポーネントライブラリ（React、Preact、Vue、Svelteなど）や、HTML + JSXに似た、組み込みのコンポーネント構文を使ってページを作成できます。 Eleventyは、モダンなUIコンポーネントを使ったHTMLのテンプレート化には対応していません。

#### EleventyとAstroのパフォーマンス比較

Eleventyのコンセプトは、Astroの「クライアントサイドのJavaScriptを最小限にする」というWeb開発のアプローチと一致しています。EleventyとAstroは、どちらも同様に、デフォルトではJavaScriptを使用しないパフォーマンスを基本としています。

Eleventyは、JavaScriptを完全に避けることでこれを実現しています。Eleventyのサイトは、多くの場合、JavaScriptをほとんど、あるいはまったく使わずに書かれています。これは、クライアントサイドの JavaScriptが必要なときに問題となります。もちろん、あなたがEleventyのために独自のアセットビルドパイプラインを作成することはできます。しかし、これは時間がかかり、バンドルやミニファイなどの複雑な最適化を自分で設定することを強いられるでしょう。

これに対して、Astroは、クライアントサイドのJavaScriptとCSSを自動的に構築します。Astroでは、ページ内の不要なJavaScriptを自動的に取り除き、必要な個々のコンポーネントのみをハイドレーションします。この機能を[パーシャルハイドレーション](/ja/concepts/islands/)と呼びます。この機能は、Eleventyでも自分で用意すれば実現可能ですが、Astroでは、デフォルトで組み込まれています。

#### ケーススタディ：ドキュメントサイトの構築

[11ty.dev/docs](https://www.11ty.dev/docs/)は、Eleventyで構築された11tyの公式ドキュメントサイトです。このサイトは、Astroの公式ドキュメントサイトと比較しても、十分に似たデザインと機能を提供しています。これにより、2つのサイトビルダーを**大雑把に実際のサイト**で比較できます。

- **11tyのパフォーマンススコア**: 86 / 100 [（テスト結果）](/lighthouse/11ty/)
- **Astroのパフォーマンススコア**: 92 / 100 [（テスト結果）](/lighthouse/astro/)


## Gatsby vs. Astro

[Gatsby](https://www.gatsbyjs.com/)は、Reactの人気のあるWebサイト＆アプリケーションフレームワークです。

GatsbyはReactを使ってWebサイトをレンダリングします。Astroはより柔軟で、人気のあるコンポーネントライブラリ（React、Preact、Vue、Svelte、Solidなど）や、HTML + JSXに似たAstroのHTMLライクなコンポーネント構文を使ってUIを自由に構築できます。

Gatsby v4は、インクリメンタル・リビルドによる静的サイト生成 (SSG)、Deferred Static Generation (DSG)、サーバーサイドレンダリング (SSR)のすべてをサポートしています。AstroはSSGによる静的ビルドと、[アダプター](/ja/guides/server-side-rendering/#enabling-ssr-in-your-project)によるSSR環境へデプロイを行えます。Deno、Vercel serverless、Netlify serverless、Node.js、今後も追加予定です。

Gatsbyでは、サイトのすべてのコンテンツを扱うために、カスタムのGraphQL APIが必要です。開発者の中にはこのモデルを好む人もいますが、Gatsbyに対する一般的な批判は、このモデルが複雑になりすぎて、とくにサイトの成長に伴って維持するのが難しくなるというものです。Astroでは、GraphQLを必要とせず、代わりに（`fetch()`やトップレベル`await`のような）使い慣れたAPIを提供し、データが必要とされる場所の近くでデータを読み込めます。なお、Astroでは、サーバーサイドまたはクライアントサイドのGraphQLライブラリを自由に選択できます。


#### GatsbyとAstroのパフォーマンス比較

ほとんどの場合、AstroのWebサイトは、GatsbyのWebサイトよりも大幅に速く読み込まれます。これは、Astroがページ内の不要なJavaScriptを自動的に取り除き、必要なコンポーネントのみをハイドレーションするためです。この機能を[パーシャルハイドレーション](/ja/concepts/islands/)と呼びます。

Gatsbyはパーシャルハイドレーションをサポートしておらず、ページコンテンツのほとんどが静的なものであっても、ユーザーがブラウザでページ全体を読み込んで再ハイドレーションするようになっています。これにより、ページの読み込みが遅くなり、Webサイトのパフォーマンスが低下します。Gatsbyには、ページからすべてのJavaScriptを削除するための[コミュニティプラグイン](https://www.gatsbyjs.com/plugins/gatsby-plugin-no-javascript/)がありますが、これでは多くのWebサイトが壊れてしまいます。このプラグインを使うなら、各ページごとに、「インタラクティブなページ」か「JavaScriptを使用しない」かの決断を迫られることになります。

Gatsbyは素晴らしいプラグインエコシステムを持っています。一方、Astroの[インテグレーション](https://astro.build/integrations/)は小さいですが、成長し続けています。Gatsbyは、高度な画像最適化のための[gatsby-plugin-image](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/)を提供しています。Astroには公式で同等の方法はありませんが、[astro-imagetools](https://github.com/RafidMuhymin/astro-imagetools#readme)は画像、背景画像の最適化、レスポンシブ画像生成のための、人気のあるコミュニティのインテクレーションです。

#### ケーススタディ：ドキュメントサイトの構築

[gatsbyjs.com/docs](https://www.gatsbyjs.com/docs/quick-start/)は、Gatsbyで構築されたGatsbyの公式ドキュメントサイトです。このWebサイトは、Astroの公式ドキュメントWebサイトと比較して、十分に似たデザインと機能セットを提供しています。これにより、この一般的なユースケースにおける、2つのサイトビルダーの**大雑把に実際のサイト**で比較できます。

- **Gatsbyのパフォーマンススコア**: 46 / 100 [（テスト結果）](/lighthouse/gatsby/)
- **Astroのパフォーマンススコア**: 92 / 100 [（テスト結果）](/lighthouse/astro/)

<!-- このパフォーマンス差の大きな理由の1つは、AstroのJavaScriptペイロードの小ささです。[gatsbyjs.com/docs](https://www.gatsbyjs.com/docs/quick-start/)では、最初のページ読み込み時に**417kb**のJavaScriptをロードするのに対し、[docs.astro.build](https://docs.astro.build)では、最初の読み込み後に**78.7kb**（全体で81%のJavaScript削減）のJavaScriptをロードします。 -->


## Hugo vs. Astro

[Hugo](https://gohugo.io/)は、人気のある静的サイトジェネレーターで、Goで書かれています。

Hugoは独自の[テンプレート言語](https://gohugo.io/templates/introduction/)を使ってWebサイトを作成します。Astroでは、お気に入りのUIコンポーネントライブラリ（React、Preact、Vue、Svelteなど）や、HTML + JSXに似た組み込みのコンポーネント構文を使ってページを作成できます。Hugoは、モダンなUIコンポーネントを使ったHTMLのテンプレート化をサポートしていません。

#### HugoとAstroのパフォーマンスの比較

Hugoのコンセプトは、Astroの「クライアントサイドのJavaScriptを最小限にする」というWeb開発のアプローチと一致しています。HugoとAstroは、どちらも同様に、デフォルトでJavaScriptを使用しないパフォーマンスを基本としています。

HugoもAstroも、JavaScriptのビルド、バンドル、ミニファイをサポートします。Astroは、ページから不要なJavaScriptを自動的に取り除き、必要な個々のコンポーネントのみをハイドレーションします。この機能を[パーシャルハイドレーション](/ja/concepts/islands/)と呼びます。Hugoでもこの機能を実現できますが、Astroではデフォルトでこの機能が組み込まれています。

#### ケーススタディ：ドキュメントサイトの構築

[gohugo.io/documentation/](https://gohugo.io/documentation/)は、Hugoで構築されたHugoの公式ドキュメントサイトです。このWebサイトは、Astroの公式ドキュメントWebサイトと比較して、十分に似たデザインと機能セットを提供しています。これにより、この一般的なユースケースにおける、2つのサイトビルダーの**大雑把に実際のサイト**で比較できます。

- **Hugoのパフォーマンススコア**: 98 / 100 [（テスト結果）](/lighthouse/hugo/)
- **Astroのパフォーマンススコア**: 92 / 100 [（テスト結果）](/lighthouse/astro/)


## Jekyll vs. Astro

[Jekyll](https://jekyllrb.com/)は、Rubyで書かれた人気の高い静的サイトジェネレーターです。

Jekyllは、[Liquidと呼ばれる古いテンプレート言語](https://jekyllrb.com/docs/liquid/)を使ってWebサイトをレンダリングします。Astroは、お気に入りのUIコンポーネントライブラリ（React、Preact、Vue、Svelteなど）や、HTML + JSXに似た組み込みのコンポーネント構文を使ってページを作成できます。Jekyllは、モダンなUIコンポーネントを使ったHTMLのテンプレートをサポートしていません。

#### JekyllとAstroのパフォーマンスの比較

Jekyllのコンセプトは、Astroの「クライアントサイドのJavaScriptを最小限にする」というWeb開発アプローチと一致しています。JekyllとAstroは、どちらも同じように、デフォルトでJavaScriptを使用しないパフォーマンスを基本としています。

Jekyllは、JavaScriptを完全に避けることでこれを実現しています。Jekyllのサイトは、多くの場合、JavaScriptをほとんど、あるいはまったく使わずに書かれていて、代わりにサーバーサイドでのHTML生成を推進しています。これは、クライアントサイドのJavaScriptが必要なときに問題となります。もちろん、あなたがJekyllのために独自のアセットビルドパイプラインを作成することはできます。しかし、これは時間がかかり、バンドルやミニファイなどの最適化を自分で設定することを強いられるでしょう。

これに対してAstroは、クライアントサイドのJavaScriptを自動的に構築します。Astroは、ブラウザに送信するJavaScriptを最低限にして、ミニファイ、バンドルされ、本番環境のために最適化されています。これはJekyllでも実現可能ですが、Astroでは、デフォルトで組み込まれています。

#### ケーススタディ：ドキュメントサイトの構築

[jekyllrb.com/docs](https://jekyllrb.com/docs)は、Jekyllで構築されたJekyllの公式ドキュメントサイトです。このWebサイトは、Astroの公式ドキュメントWebサイトと比較して、十分に似たデザインと機能セットを提供しています。これにより、この一般的なユースケースにおける、2つのサイトビルダーの**大雑把に実際のサイト**での比較が可能になりました。

- **Jekyllのパフォーマンススコア**: 96 / 100 [（テスト結果）](/lighthouse/jekyll/)
- **Astroのパフォーマンススコア**: 92 / 100 [（テスト結果）](/lighthouse/astro/)


## SvelteKit vs. Astro

[SvelteKit](https://kit.svelte.dev/)は、Svelte用のWebサイト＆アプリケーションフレームワークとして人気があります。

SvelteKitは、Svelteを使ってWebサイトを生成します。Astroはより柔軟で、人気のあるコンポーネントライブラリ（React、Preact、Vue、Svelte、Solidなど）や、HTML + JSXに似たAstroのHTMLライクなコンポーネント構文を使ってUIを自由に構築できます。

SvelteKitもAstroも、Webサイトを構築するためのフレームワークです。SvelteKitは動的なWebサイト（ダッシュボードや受信トレイなど）に適しており、Astroは静的なWebサイト（コンテンツやeコマースサイトなど）に適しています。

SvelteKitは静的サイト生成 (SSG) とサーバーサイドレンダリング (SSR)の両方をサポートしています。AstroはSSGによる静的ビルドと、[アダプター](/ja/guides/server-side-rendering/#enabling-ssr-in-your-project)によるSSR環境へデプロイを行うことが可能です。Deno、Vercel serverless、Netlify serverless、Node.js、今後も追加予定です。

#### SvelteKitとAstroのパフォーマンス比較

ほとんどの場合、AstroのWebサイトはSvelteKitのWebサイトよりも速く読み込まれます。これは、Astroがページから不要なJavaScriptを自動的に取り除き、必要なコンポーネントのみをハイドレーションするためです。この機能は、[パーシャルハイドレーション](/ja/concepts/islands/)と呼ばれています。

SvelteKitはパーシャルハイドレーションに対応しておらず、ページコンテンツのほとんどが静的なものであっても、ユーザーがブラウザでページ全体を読み込んで再ハイドレーションするようになっています。これにより、ページの読み込みが遅くなり、Webサイトのパフォーマンスが低下します。SvelteKitは、[ページレベルの静的なJavaScriptを使わないページ](https://kit.svelte.dev/docs#ssr-and-javascript-hydrate)をサポートしています。しかし、ページ上の個々のコンポーネントをハイドレートするためのサポートは予定されていません。各ページごとに、「インタラクティブなページ」か「JavaScriptを使用しない」かの決断を迫られることになります。

#### ケーススタディ：ドキュメントサイトの構築

[kit.svelte.dev](https://kit.svelte.dev/docs#ssr-and-javascript-hydrate)は、SvelteKitで構築されたSvelteKitの公式ドキュメントサイトです。このWebサイトは、Astroの公式ドキュメントWebサイトと比較して、十分に似たデザインと機能を提供しています。これにより、この一般的なユースケースにおける2つのサイトビルダーの**大雑把に実際のサイト**で比較できます。

今回テストした2つのサイトの注目すべき違いが1つあります。SvelteKitのドキュメントは1つのページとして提供されるのに対し、Astroのドキュメントは複数のページに分かれています。この大きなコンテンツペイロードは、ツール自体とは関係なく、パフォーマンスに若干のマイナス影響を与えるはずです。

- **SvelteKitのパフォーマンススコア**: 91 / 100 [（テスト結果）](/lighthouse/sveltekit/)
- **Astroのパフォーマンススコア**: 92 / 100 [（テスト結果）](/lighthouse/astro/)

このテストでは、SvelteKitはAstroと同等のパフォーマンスを発揮しました。

## Next.js vs. Astro

[Next.js](https://nextjs.org/)は、ReactのWebサイト＆アプリケーションフレームワークとして人気があります。

Next.jsはReactを使ってWebサイトをレンダリングします。Astroはより柔軟で、人気のあるコンポーネントライブラリ（React、Preact、Vue、Svelte、Solidなど）や、HTML + JSXに似たAstroのHTMLライクなコンポーネント構文を使ってUIを自由に構築できます。

Next.jsもAstroも、Webサイトを構築するためのフレームワークです。Next.jsはダッシュボードや受信トレイなどの動的なWebサイトに適しており、Astroはコンテンツやeコマースサイトなどの静的なWebサイトに適しています。

Next.jsは静的サイト生成 (SSG) とサーバーサイドレンダリング (SSR)の両方をサポートしています。AstroはSSGによる静的ビルドと、[アダプター](/ja/guides/server-side-rendering/#enabling-ssr-in-your-project)によるSSR環境へデプロイを行うことが可能です。Deno、Vercel serverless、Netlify serverless、Node.js、今後も追加予定です。


#### Next.jsとAstroのパフォーマンスの比較

ほとんどの場合、AstroのWebサイトはNext.jsのWebサイトよりも圧倒的に速く読み込まれます。これは、Astroがページから不要なJavaScriptを自動的に取り除き、必要なコンポーネントのみをハイドレーションするためです。この機能を[パーシャルハイドレーション](/ja/concepts/islands/)と呼びます。

Next.jsはパーシャルハイドレーションをサポートしておらず、ページコンテンツのほとんどが静的なものであっても、ユーザーがブラウザでページ全体を読み込んで再ハイドレーションするようになっています。そのため、ページの読み込みが遅くなり、Webサイトのパフォーマンスが低下します。Next.jsは、完全に静的な、JavaScriptを使用しないページを[実験的にサポート](https://piccalil.li/blog/new-year-new-website/#heading-no-client-side-react-code)しています。しかし、ページ上の個々のコンポーネントをハイドレートするためのサポートは予定されていません。各ページごとに、「インタラクティブなページ」か「JavaScriptを使用しない」かの決断を迫られることになります。

Next.jsは、すばらしい画像最適化機能が組み込まれています。Astroには同等の公式の方法はありませんが、[astro-imagetools](https://github.com/RafidMuhymin/astro-imagetools#readme)は画像、背景画像の最適化、レスポンシブ画像生成のための、人気のコミュニティ[インテクレーション](https://astro.build/integrations/)です。

#### ケーススタディ：ドキュメントサイトの構築

[nextjs.org/docs](https://nextjs.org/docs/getting-started)は、Next.jsで構築されたNext.jsの公式ドキュメントサイトです。このWebサイトは、Astroの公式ドキュメントWebサイトと比較して、十分に似たデザインと機能を提供しています。これにより、この一般的なユースケースにおける2つのサイトビルダーの**大雑把に実際のサイト**での比較ができます。

- **Next.jsのパフォーマンススコア**: 71 / 100 [（テスト結果）](/lighthouse/next/)
- **Astroのパフォーマンススコア**: 92 / 100 [（テスト結果）](/lighthouse/astro/)

<!-- このパフォーマンス差の大きな理由の1つは、AstroのJavaScriptペイロードの小ささです。
[nextjs.org/docs](https://nextjs.org/docs/getting-started)が最初のページ読み込み時に**463kb**のJavaScriptをロードするのに対し、[docs.astro.build](https://docs.astro.build)は最初の読み込み後に**78.7kb**（全体では83％のJavaScript削減）のJavaScriptをロードします。 -->


## Nuxt vs. Astro

[Nuxt](https://nuxtjs.org/)は、人気のあるVueのWebサイト＆アプリケーションフレームワークです。Next.jsに似ています。

NuxtはVueを使ってWebサイトを生成します。Astroはより柔軟で、人気のあるコンポーネントライブラリ（React、Preact、Vue、Svelte、Solidなど）や、HTML + JSXに似たAstroのHTMLライクなコンポーネント構文を使ってUIを自由に構築できます。

NuxtもAstroも、Webサイトを構築するためのフレームワークです。Nuxtは動的なWebサイト（ダッシュボードや受信トレイなど）に最適で、Astroは静的なWebサイト（コンテンツやeコマースサイトなど）に最適です。

Nuxtは静的サイト生成 (SSG) とサーバーサイドレンダリング (SSR)の両方をサポートしています。AstroはSSGによる静的ビルドと、[アダプター](/ja/guides/server-side-rendering/#enabling-ssr-in-your-project)によるSSR環境へデプロイを行うことが可能です。Deno、Vercel serverless、Netlify serverless、Node.js、今後も追加予定です。

#### NuxtとAstroのパフォーマンスの比較

ほとんどの場合、AstroのWebサイトはNuxtのWebサイトよりも圧倒的に速く読み込まれます。これは、Astroがページから不要なJavaScriptを自動的に取り除き、必要なコンポーネントのみをハイドレーションするためです。この機能は、[パーシャルハイドレーション](/ja/concepts/islands/)と呼ばれています。

Nuxtはパーシャルハイドレーションに対応しておらず、ページコンテンツのほとんどが静的なものであっても、ユーザーがブラウザでページ全体を読み込んで再ハイドレーションします。これにより、ページの読み込みが遅くなり、Webサイトのパフォーマンスが低下します。この動作を無効にする方法は、Nuxtにはありません。

Nuxtは、すばらしい画像最適化機能が組み込まれています。Astroには同等の公式の方法はありませんが、[astro-imagetools](https://github.com/RafidMuhymin/astro-imagetools#readme)は画像、背景画像の最適化、レスポンシブ画像生成のための、人気のコミュニティ[インテクレーション](https://astro.build/integrations/)です。

#### ケーススタディ：ドキュメントサイトの構築

[nuxtjs.org/docs](https://nuxtjs.org/docs/2.x/get-started/installation)は、Nuxtで構築されたNuxtの公式ドキュメントサイトです。このWebサイトは、Astroの公式ドキュメントサイトと比較しても、十分に似たデザインと機能を備えています。これにより、2つのサイトビルダーを、この一般的なユースケースにおいて、**大雑把に実際のサイト**で比較できます。

- **Nuxtのパフォーマンススコア**: 50 / 100 [（テスト結果）](/lighthouse/nuxt/)
- **Astroのパフォーマンススコア**: 92 / 100 [（テスト結果）](/lighthouse/astro/)

<!-- このパフォーマンスの差の大きな理由の1つは、AstroのJavaScriptペイロードの小ささです。
[nuxtjs.org/docs](https://nuxtjs.org/docs/2.x/get-started/installation)が最初のページ読み込み時に**469kb**のJavaScriptをロードするのに対し、[docs.astro.build](https://docs.astro.build)は最初の読み込み後に**78.7kb**（83%減）のJavaScriptをロードします。 -->

## Remix vs. Astro

[Remix](https://remix.run/)は、React RouterをベースとしたReactフレームワークです。

RemixはWebサイトのレンダリングにReactを使用します。Astroはより柔軟で、一般的なコンポーネントライブラリ（React、Preact、Vue、Svelte、Solidなど）やAstroのHTML + JSXに似たコンポーネント構文を使ってUIを自由に構築できます。

Remixはサーバーサイドレンダリング（SSR）のみをサポートしています。AstroはSSGによる静的ビルドと、[アダプター](/ja/guides/server-side-rendering/#enabling-ssr-in-your-project)によるSSR環境でのデプロイが可能です。Deno、Vercel serverless、Netlify serverless、Node.jsに対応しており、今後も対応予定です。

#### ケーススタディ：ドキュメントサイトの構築

[remix.run/docs](https://remix.run/docs/)は、Remixで構築されたRemixの公式ドキュメントサイトです。このWebサイトは、Astroの公式ドキュメントサイトと比較しても、十分に似たデザインと機能を備えています。これにより、2つのサイトビルダーを、この一般的なユースケースにおいて、**大雑把に実際のサイト**で比較できます。

- **Remixのパフォーマンススコア**: 89 / 100 [（テスト結果）](/lighthouse/remix/)
- **Astroのパフォーマンススコア**: 92 / 100 [（テスト結果）](/lighthouse/astro/)

## VuePress vs. Astro

[VuePress](https://vuepress.vuejs.org/guide/)は、Vue.jsの作者が開発した、人気の高いドキュメントWebサイト生成ツールです。VuePressはVue.jsを使用してWebサイトのUIを生成し、AstroはReact、Vue.js、Svelte、生のHTMLテンプレートをサポートしています。

VuePressは、ドキュメントサイト用に設計されており、Astroではサポートしていないドキュメントに特化したWebサイトの機能がいくつか組み込まれています。その代わり、Astroでは、ドキュメントに特化した機能を公式の[`docs`](https://github.com/snowpackjs/astro/tree/main/examples/docs)テーマで提供しており、サイトに使用できます。このWebサイトは、そのテンプレートを使って作られています。

EvanYou氏（Vue.jsの作者）は現在、[VitePress](https://vitepress.vuejs.org/)というVuePressの新バージョンを開発しています。VuePressに代わるモダンなツールをお求めの方は、なぜ、VitePressがより良い選択肢なのか、[Evan氏の投稿](https://github.com/snowpackjs/astro/issues/1159#issue-974035962)をご覧ください。

#### VuePressとAstroのパフォーマンス比較

ほとんどの場合、AstroのWebサイトはVuePressのWebサイトよりも圧倒的に速く読み込まれます。これは、Astroがページから不要なJavaScriptを自動的に取り除き、必要なコンポーネントのみをハイドレーションするためです。この機能は、[パーシャルハイドレーション](/ja/concepts/islands/)と呼ばれています。

VuePressはパーシャルハイドレーションに対応しておらず、ページコンテンツのほとんどが静的なものであっても、ユーザーがブラウザでページ全体を読み込んで再ハイドレーションするようになっています。これにより、ページの読み込みが遅くなり、Webサイトのパフォーマンスが低下します。VuePressでは、この動作を無効にする方法はありません。

#### ケーススタディ：ドキュメントサイトの構築

[vuepress.vuejs.org](https://vuepress.vuejs.org/guide/)は、VuePressで構築された、VuePressの公式ドキュメントサイトです。このサイトは、Astroの公式ドキュメントサイトと比較しても、十分に似たデザインと機能セットを提供しています。これにより、2つのサイトビルダーを、この一般的なユースケースにおいて、**大雑把に実際のサイト**で比較できます。

- **Vuepressのパフォーマンススコア**: 67 / 100 [（テスト結果）](/lighthouse/vuepress/)
- **Astroのパフォーマンススコア**: 92 / 100 [（テスト結果）](/lighthouse/astro/)

<!-- このパフォーマンス差の大きな理由の1つは、AstroのJavaScriptペイロードの小ささです。[vuepress.vuejs.org](https://vuepress.vuejs.org/guide/)が最初のページ読み込みで**166kb**のJavaScriptをロードするのに対し、[docs.astro.build](https://docs.astro.build)は最初の読み込み後に**78.7kb**（全体で53％のJavaScript削減）のJavaScriptをロードします。 -->

## Zola vs. Astro

[Zola](https://www.getzola.org/)は、Rustを使った人気が高く、高速な静的サイトジェネレーターです。

Zolaは[Tera](https://tera.netlify.app/)を使ってWebサイトを生成します。Astroは、お気に入りのUIコンポーネントライブラリ（React、Preact、Vue、Svelteなど）や、HTML + JSXに似た組み込みのコンポーネント構文を使ってページを作成できます。ZolaはモダンなUIコンポーネントを使ったHTMLのテンプレート化には対応していません。

#### ZolaとAstroのパフォーマンス比較

Zolaのコンセプトは、Astroの「クライアントサイドのJavaScriptを最小限にする」というWeb開発アプローチと一致しています。ZolaとAstroは、どちらも同じように、デフォルトでJavaScriptを使用しないパフォーマンスを基本としています。

Astroは、JavaScriptのビルド、バンドル、ミニファイをサポートしています。Zolaでは、JavaScriptをバンドルして処理するために、webpackのような別のビルドツールを使用する必要があります。Astroでは、ページから不要なJavaScriptを自動的に外し、必要な個々のコンポーネントのみをハイドレーションします。この機能を[パーシャルハイドレーション](/ja/concepts/islands/)と呼びます。Zolaでもこの機能を実現することは可能ですが、Astroではデフォルトでこの機能が組み込まれています。


#### ケーススタディ：ドキュメントサイトの構築

[getzola.org/documentation](https://www.getzola.org/documentation/getting-started/overview/)は、Zolaで構築された、Zolaの公式ドキュメントサイトです。このサイトは、Astroの公式ドキュメントサイトと比較しても、十分に似たデザインと機能セットを提供しています。これにより、2つのサイトビルダーを、この一般的なユースケースにおいて、**大雑把に実際のサイト**で比較できます。

- **Zolaのパフォーマンススコア**: 91 / 100 [（テスト結果）](/lighthouse/zola/)
- **Astroのパフォーマンススコア**: 92 / 100 [（テスト結果）](/lighthouse/astro/)

## `.astro` vs `.jsx`

Astroコンポーネントの構文は、HTMLのスーパーセットです。HTMLやJSXの経験がある人なら誰でも馴染みがあると感じられるように設計されています。

**HTMLをご存知の方なら、Astroコンポーネントをはじめて作成するのに十分な知識があります。**

| 機能                          | Astro | JSX  |
| ---------------------------- | ----- | --------- |
| ファイル拡張子                 | `.astro` | `.jsx` または `.tsx` |
| ユーザー定義コンポーネント       | `<Capitalized>` | `<Capitalized>`  |
| 式の構文                     | `{}` | `{}` |
| スプレッド属性                | `{...props}` | `{...props}` |
| ブーリアン属性                | `autocomplete` === `autocomplete={true}` | `autocomplete` === `autocomplete={true}` |
| インライン関数                | `{items.map(item => <li>{item}</li>)}`  | `{items.map(item => <li>{item}</li>)}` |
| 条件付きレンダリング            | `{condition &&  <p>text<p>}`  | `{condition &&  <p>text<p>}` |
| IDEサポート                  | [VS Code (incl. Open VSX), Nova](/ja/editor-setup/) | 驚異的 |
| JSインポート                  | 不要    | 必要、`jsxPragma`（`React`か`h`）はスコープ内に必要 |
| フラグメント                    | 自動的にトップレベル、関数内では `<Fragment>` か `<>` | `<Fragment>` か `<>` で囲む |
| ファイルごとに複数のフレームワーク | 利用可能 | 不可 |
| `<head>` の変更               | トップレベルのページで `<head>` を使うだけ | フレームワーク単位 (`<Head>`、`<svelte:head>`など) |
| コメント形式                  | `<!-- HTML -->` | `{/* JavaScript */}`  |
| 特殊文字                       | `&nbsp;`  | `&nbsp;`  |
| 属性                          | `dash-case` | `camelCase`|
