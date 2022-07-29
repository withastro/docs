---
layout: ~/layouts/MainLayout.astro
title: Astroを選ぶ理由
description: "Astroは、コンテンツにフォーカスした高速なWebサイトを構築するためのオールインワンWebフレームワークです。詳しくはこちら。"
i18nReady: true
---

Astroは、**コンテンツにフォーカスした高速なWebサイト**を構築するための**オールインワンWebフレームワーク**です。

なぜ他のWebフレームワークではなく、Astroを選ぶのでしょうか？ここでは、Astroを構築した理由、Astroが解決すべき問題、そしてAstroがプロジェクトやチームに最適な理由を説明するための、5つの基本設計原則を紹介します。

#### Astroは……

1. [コンテンツ重視](#): Astroは、コンテンツが豊富なWebサイトのために設計されています。
2. [サーバーファースト](#): HTMLをサーバーでレンダリングすることで、Webサイトの動作が速くなります。
3. [デフォルトで高速](#): Astroで遅いウェブサイトを構築することは不可能です。
4. [簡単に使える](#): 専門家でなくても、Astroで何かを構築できます。
5. [充実した機能と柔軟性](#): 100以上のAstroインテグレーションから選択できます。


## コンテンツ重視

**Astroは、コンテンツが豊富なウェブサイトを構築するために設計されています。** これには、ほとんどのマーケティングサイト、出版サイト、ドキュメントサイト、ブログ、ポートフォリオ、一部のeコマースサイトが含まれます。

これに対して、最近のほとんどのWebフレームワークは、Webアプリケーションを構築するために設計されています。これらのフレームワークは、ブラウザ上でより複雑な、アプリケーションのような体験を構築するのに適しています。ログインした管理者のダッシュボード、受信トレイ、ソーシャルネットワーク、Todoリスト、さらにはFigmaやPingのようなネイティブに近いアプリケーションもそうです。

これはAstroを理解する上でもっとも重要な違いの1つです。Astroはコンテンツにフォーカスしているため、アプリケーションにフォーカスしたWebフレームワークでは実装する意味がないようなトレードオフを行い、比類ないパフォーマンス機能を提供できるのです。

:::tip
もし、プロジェクトが2番目の「アプリケーション」に該当する場合、Astroはプロジェクトに適していないかもしれません…… **それでもいいのです！** アプリケーションに特化したWebフレームワークとして、[Next.js](https://nextjs.org/)をチェックしてみてください。
:::


## サーバーファースト

**Astroは、クライアントサイドのレンダリングよりもサーバーサイドのレンダリングを可能な限り活用します。** これは、従来のサーバーサイドフレームワーク（PHP、WordPress、Laravel、Ruby on Railsなど）が何十年も使ってきたアプローチと同じです。しかし、そのために2つ目のサーバーサイド言語を学ぶ必要はないのです。Astroでは、すべてがHTML、CSS、JavaScript（お好みでTypeScript）だけでいいのです。

このアプローチは、Next.js、SvelteKit、Nuxt、Remixなど、他のモダンなJavaScriptウェブフレームワークとは対照的です。これらのフレームワークでは、ウェブサイト全体のクライアントサイドレンダリングが必要で、サーバーサイドレンダリングは主にパフォーマンス上の懸念へ対処するために行われます。このアプローチは、シングルページアプリケーション（SPA: Single Page App）と呼ばれ、Astroのマルチページアプリケーション（MPA: Multi Page App）アプローチと対照的です。

SPAモデルには利点があります。しかし、その代償として、さらなる複雑さとパフォーマンスのトレードオフが生じます。これらのトレードオフは、[インタラクティブになるまでの時間（TTI: Time To Interactive）](https://web.dev/interactive/)のような重要な指標を含むページパフォーマンスに悪影響を及ぼし、ファーストロードのパフォーマンスが不可欠なコンテンツ重視のWebサイトではあまり意味を成しません。

📚 [AstroのMPAアーキテクチャの特徴について、詳しくはこちらをご覧ください。](/ja/concepts/mpa-vs-spa/)


## デフォルトで高速

優れたパフォーマンスは常に重要ですが、コンテンツを重視したWebサイトでは**とくに**重要です。パフォーマンスが低いと、エンゲージメント、コンバージョン、お金が失われることは、十分に証明されています。たとえば、次のような例があります。

- 高速化100msごと → コンバージョン数1％増（[Mobify](https://web.dev/why-speed-matters/)、年間38万ドルの収益）
- 50%高速化 → 売上12%増（[AutoAnything](https://www.digitalcommerce360.com/2010/08/19/web-accelerator-revs-conversion-and-sales-autoanything/)）
- 20%高速化 → コンバージョン数10%アップ（[Furniture Village](https://www.thinkwithgoogle.com/intl/en-gb/marketing-strategies/app-and-mobile/furniture-village-and-greenlight-slash-page-load-times-boosting-user-experience/)）
- 40%高速化 → サインアップ15%増（[Pinterest](https://medium.com/pinterest-engineering/driving-user-growth-with-performance-improvements-cfc50dafadd7)）
- 850ms高速化 → コンバージョン数7%増（[COOK](https://web.dev/why-speed-matters/)）
- 1秒遅くなるごと → ユーザー数が10%減少（[BBC](https://www.creativebloq.com/features/how-the-bbc-builds-websites-that-scale)）

多くのウェブフレームワークでは、開発時には見栄えのするウェブサイトを構築しても、デプロイされるとロードがひどく遅くなることがよくあります。携帯電話や低消費電力デバイスでは、開発者のノートパソコンのスピードに及ばないため、多くの場合、JavaScriptが原因となっています。

Astroの魅力はコンテンツ重視とサーバーファーストのMPAアーキテクチャという、上で説明した2つの価値を組み合わせることで、他のフレームワークでは不可能なトレードオフを行い、機能を提供している点です。その結果、あらゆるWebサイトで、すぐに驚くようなWebパフォーマンスを発揮することができるのです。目標：**Astroを使えば、遅いウェブサイトを作るのはほぼ不可能になることです。**

Astroのウェブサイトは、もっとも人気のあるReactウェブフレームワークで構築された同じサイトよりも、[90%少ないJavaScriptで40%速く読み込むこと](https://twitter.com/t3dotgg/status/1437195415439360003)ができます。Solid.jsとMarkoの開発者であるRyan Carniatoが[言葉を失うほど](https://youtu.be/2ZEMb_H-LYE?t=8163)のAstroのパフォーマンスを見てください。


## 簡単に使える

**Astroの目標は、すべてのWeb開発者が利用できることです。** Astroは、Web開発のスキルレベルや過去の経験に関係なく、親しみやすいと感じられるように設計されています。

まず、すでに知っている好きなUIコンポーネント言語が使えるようにすることから始めました。React、Preact、Svelte、Vue、Solid、Litなど、Astroプロジェクトで新しいUIコンポーネントを作成するためにサポートされている言語がすべて揃っています。

また、Astroに優れた組み込みコンポーネント言語があることを確認したいと思いました。そのために、私たちは独自の`.astro` UI言語を作りました。HTMLの有効なスニペットは、すでにAstroの有効なコンポーネントなのです！これは、HTMLに大きく影響されています。しかし、JSX式（React）やデフォルトでのCSSスコープ（SvelteやVue）など、他のコンポーネント言語から借用した私たちのお気に入りの機能も兼ね備えています。

Astroは、他のUIフレームワークや言語よりも複雑でないように設計されています。その大きな理由のひとつは、Astroがブラウザ上ではなく、サーバ上でレンダリングするように設計されていることです。つまり、hooks（React）、stale closures（同じくReact）、refs（Vue）、observables（Svelte）、atoms、セレクター、リアクション、デリバティブなどを気にする必要がないのです。サーバーには反応性（reactivity）がないので、そのような複雑なものはすべて溶けてなくなります。

私たちの好きな言葉のひとつに、「**複雑さへのオプトイン**」というものがあります。Astroは、開発者の体験から「必要な複雑さ」を可能な限り取り除くように設計されています。Astroでは、HTMLとCSSだけで、「Hello World」のようなサンプルサイトを構築できます。そして、より強力なものを構築する必要があるときは、新しい機能やAPIに段階的に手を伸ばせます。


## 充実した機能と柔軟性

**Astroは、Webサイトを構築するために必要なものがすべて揃ったオールインワンのWebフレームワークです。** コンポーネント構文、ファイルベースのルーティング、アセットハンドリング、ビルドプロセス、バンドル、最適化、データフェッチなど、Astroにはさまざまな機能が搭載されています。Astroのコア機能だけで、優れたウェブサイトを構築できます。

さらにコントロールが必要な場合は、 [React](https://www.npmjs.com/package/@astrojs/react)、[Svelte](https://www.npmjs.com/package/@astrojs/svelte)、[Vue](https://www.npmjs.com/package/@astrojs/vue)、[Tailwind CSS](https://www.npmjs.com/package/@astrojs/tailwind)、[MDX](https://www.npmjs.com/package/@astrojs/mdx)、[画像最適化](https://www.npmjs.com/package/@astrojs/images)など、[100以上のインテグレーション](https://astro.build/integrations/)を使用してAstroを拡張できます。[お気に入りのCMSを接続](https://astro.build/integrations/)したり、[お気に入りのホストにデプロイ](/ja/guides/deploy/)するのも、コマンド1つでできます。

AstroはUIにとらわれず、**自分好みのUIフレームワークを持ち込めます（BYOF: Bring Your Own UI Framework）**。React、Preact、Solid、Svelte、Vue、LitはすべてAstroで公式にサポートされています。同じページで異なるフレームワークを混在もでき、将来の移行を容易にし、単一のフレームワークにプロジェクトが固定されるのを防げます。


<!-- Use your favorite UI framework with Astro, or mix-and-match UI components across different pages, websites, or even teams. You can even choose your UI framework component-by-component on each individual page for maximum flexibility with minimal committment. Astro also gives you a "Get out of (framework) jail free!" card, allowing you to convert your entire project incrementally, with no interruption to your site. -->

<!-- This has an added benefit for larger organizations: you can scale up the number of supported UI frameworks at your company without increasing the complexity of the server-side code. Every Astro site ships the same server runtime code, regardless of which UI frameworks you use. This greatly reduces the production complexity vs. running different sites built with Next.js, SvelteKit, and Nuxt. -->

<!-- 📚 TODO: Link to Multi-framework support?  -->

<!-- ## Fast by default -->

<!-- As we mentioned above, Astro builds fast websites. But our focus on performance isn't just on what's *possible* with Astro. We want good performance to be an *automatic default.*  -->

<!-- When we built Astro, we were fed up with web frameworks that *could* be fast in the right hands, but that otherwise felt slow to the average user who didn't know every option or best practice. We had a wild idea: you shouldn't even need to think about performance to build a fast site. Our goal was simple: **It should be incredibly difficult to build a slow website with Astro.** -->

<!-- This idea of fast-by-default has inspired plenty of other Astro design choices and default behaviors, other than Partial Hydration which was mentioned above. Your JavaScript and CSS are bundled by default. Your deployed server supports streaming HTML by default. THIRD THING??? DON"T FORGET TO DELETE THIS, FRED. (//`@astrojs/prefetch` maybe?//) As you build with Astro, you'll see how these design decisions shape how you work "in Astro."  -->

<!-- (// my thinking with this last line here is re: stated goal of priming the reader for thinking about how things work in Astro. With little nudges like this, the reader is more primed for THIS WORKS DIFFERENTLY AND I MIGHT HAVE TO ADJUST MY EXPECTATIONS //) -->



