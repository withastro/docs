---
layout: ~/layouts/MainLayout.astro
title: Astro vs. X
description: 比较 Astro 和诸如 Gatsby、Next.js、Nuxt、Hugo、Eleventy 之类的静态网站生成器。
---
<!-- TODO: UNcomment out the parts re: number of bytes of JS etc, once we decide which values/markers we'd like to use here. -->
我们经常会被问到这样一个问题“Astro 和我最喜欢的 **\_\_\_\_** 项目比起来怎么样？”

本指南就是为了回答这个问题而编写的，适用于几个流行的网站生成器和 Astro 替代品。

两个重要特性使得 Astro 与大多数替代品不同：

- [部分激活](/zh-CN/core-concepts/partial-hydration/)
- [使用你喜欢的框架](/zh-CN/core-concepts/framework-components/)

你可以在这个页面上通过我们的深入比较了解到更多细节。

如果你最喜欢的生成器没有列在下方，你可以[在 Discord 里问我们](https://astro.build/chat)。

## Docusaurus vs. Astro

[Docusaurus](https://docusaurus.io/) 是一个流行的文档网站生成器。Docusaurus 使用 React 来生成网站 UI，而 Astro 支持 React、Preact、Vue.js、Svelte、SolidJS、AlpineJS、Lit 和原始 HTML 模板。

Docusaurus 是为建立文档网站而设计的，它针对文档内置了一站功能，而 Astro 没有对文档专门提供。不过 Astro 通过官方的 [`docs`](https://github.com/withastro/astro/tree/main/examples/docs) 主题提供了特定的文档功能，你可以在自己的网站上使用。这个网站正是用这个模板建立的！

#### 比较 Docusaurus vs. Astro 性能

在大多数情况下，Astro 网站的加载速度将明显快于 Docusaurus 网站。这是因为 Astro 会自动从页面中剥离不必要的 JavaScript，只激活个别需要的组件。这个功能被称为[部分激活](/zh-CN/core-concepts/partial-hydration/)。

Docusaurus 不支持部分激活，而是让用户在浏览器中加载并重新激活整个页面，即便大部分的页面内容都是静态的，这也使得网站页面加载比较慢和性能比较差。在 Docusaurus 中没有办法禁用这种行为。

#### 案例：创建文档站点

[docusaurus.io/docs](https://docusaurus.io/docs) 是 Docusaurus 官方文档网站，不言而喻它自然是用 Docusaurus 构建的。与 Astro 官方文档网站相比较，二者的设计和功能十分相似。下面给出了两个站点生成器的**粗略但又真实**的比较。

- **Docusaurus 性能得分**：53 分（满分 100 分）[（全面检查）](/lighthouse/docusaurus/)
- **Astro 性能得分**：92 分（满分 100 分）[（全面检查）](/lighthouse/astro/)

<!-- One big reason behind this performance difference is Astro’s smaller JavaScript payload: [docusaurus.io/docs](https://docusaurus.io/docs) loads **238kb** of JavaScript on first page load while [docs.astro.build](https://docs.astro.build) loads **78.7kb** (67% less JavaScript, overall) _after_ first load.) -->

## Elder.js vs. Astro

[Elder.js](https://elderguide.com/tech/elderjs/) 是一个有态度、为 Svelte 打造的静态网站生成器。

Elder.js 使用 Svelte 来渲染网站内容。Astro 更灵活：你可以自由地使用任何流行的组件库（React、Preact、Vue、Svelte、Solid 和其他）或 Astro 的类似 HTML 的组件语法来构建 UI，它类似于 HTML + JSX。

Elder.js 在这个列表中是独一无二的，因为它是唯一个支持[部分激活](/zh-CN/core-concepts/partial-hydration/)的生成器。Astro 和 Elder.js 都会自动从页面中剥离不必要的 JavaScript，只激活个别需要的组件。Astro 与 Elder 的部分激活在 API 方面有点不同，Astro 支持一些 Elder.js 没有的功能（如 `client:media`)。然而就性能而言，这两个项目构建的网站基本一致。

Elder.js 使用自定义的路由解决方案，对于新的开发者来说可能会感到陌生。而 Astro 则使用[基于文件的路由](/zh-CN/core-concepts/routing/)，这对任何来自 Next.js\SvelteKit，甚至其他静态网站生成器如 Eleventy 的人来说都应该感到熟悉。

Elder.js 被设计用于大型网站，并声称可以在不到十分钟的时间内（在一个普通的虚拟机上）建立一个约两万个页面的网站。在写这篇文章的时候，Astro 在 66 秒内构建约一千个页面，但还没有在有两千个以上页面的项目上测试过。

Elder.js 同时支持静态网站生成（SSG）和服务器端渲染（SSR）。Astro 可以用 SSG 静态构建或用[适配器](/zh-CN/guides/server-side-rendering/#enabling-ssr-in-your-project)部署到 SSR 环境，像是 Deno、Vercel serverless、Netlify serverless 和 Node.js，并将支持更多服务。

## Eleventy vs. Astro

[Eleventy](https://www.11ty.dev/) 是一个由 Node.js 驱动的流行静态网站生成器。

Eleventy 使用几种[旧的 HTML 模板语言](https://www.11ty.dev/docs/languages/) 对网站进行渲染，Nunjucks、Liquid、Pug、EJS 和其他的模板语言。Astro 则能让你使用你喜欢的 UI 组件库（React、Preact、Vue、Svelte 等）或类用似于 HTML + JSX 的内置组件语法来创建页面。Eleventy 不支持使用现代 UI 组件进行 HTML 模板制作。

#### 比较 Eleventy vs. Astro 性能

从概念上讲，Eleventy 和 Astro 的“最小客户端 JavaScript”的网络开发方法是一致的。Eleventy 和 Astro 都提供类似的零 JavaScript 默认性能基准。

Eleventy 通过推动你完全避免使用 JavaScript 来实现这一目标。Eleventy 的网站通常很少或根本没有使用 JavaScript。当你确实需要使用客户端 JavaScript 时，这就成了一个问题。你可以自行为 Eleventy 创建资源构建 pipeline。这可能会耗时很久，并使得你不得不自己在捆绑、压缩和其他方面上进行复杂配置以实现优化。

相比之下，Astro 自动为你构建客户端 JavaScript 和 CSS。Astro 自动从页面中剥离不必要的 JavaScript，只激活个别需要的组件。这个功能被称为[部分激活](/zh-CN/core-concepts/partial-hydration/)。虽然在 Eleventy 中可以自己实现这个功能，但 Astro 内置了该功能。

#### 案例：创建文档站点

[11ty.dev/docs](https://www.11ty.dev/docs/) 是 11ty 的官方文档网站，由 11ty 建立。与 Astro 官方文档网站相比较，二者的设计和功能十分相似。下面给出了两个站点生成器的**粗略但又真实**的比较：

- **11ty 性能得分**：86 分（满分 100 分）[（全面检查）](/lighthouse/11ty/)
- **Astro 性能得分**：92 分（满分 100 分）[（全面检查）](/lighthouse/astro/)

## Gatsby vs. Astro

[Gatsby](https://www.gatsbyjs.com/) 是一个流行的 React 的网站和应用程序框架。

Gatsby 使用 React 来渲染网站内容。Astro 更加灵活：你可以自由地使用任何流行的组件库（React、Preact、Vue、Svelte、Solid 和其他）或 Astro 的类似 HTML 的组件语法来构建 UI，这与 HTML+JSX 相似。

Gatsby v4 同时支持静态网站生成（SSG）、增量重建、延迟静态生成（DSG）和服务端渲染（SSR）。Astro 可以用 SSG 静态构建或用[适配器](/zh-CN/guides/server-side-rendering/#enabling-ssr-in-your-project)部署到 SSR 环境，像是 Deno、Vercel serverless、Netlify serverless 和 Node.js，并将支持更多服务。

Gatsby 需要定制一个 GraphQL API 来处理你所有的网站内容。虽然有些开发者喜欢这种模式，但经常有对 Gatsby 的批评，认为这种模式会随着时间的推移和网站的增长，变得过于复杂和难以维护。Astro 没有对 GraphQL 需求，它提供熟悉的 API（如 `fetch ()` 和顶层的 `await`），以便在需要数据的地方加载数据。然而你可以随意选择将 Astro 和任何服务端或客户端的 GraphQL 库一起使用。

#### 比较 Gatsby vs. Astro 性能

在大多数情况下，Astro 网站的加载速度会明显快于 Gatsby 网站。这是因为 Astro 会自动将不必要的 JavaScript 从页面中剥离出来，只激活个别需要的组件。这个功能被称为[部分激活](/zh-CN/core-concepts/partial-hydration/)。

Gatsby 不支持部分激活，而是让用户在浏览器中加载和重新激活整个页面，即便大部分的页面内容都是静态的，这也使得网站页面加载比较慢和性能比较差。Gatsby 有用于移除页面中的所有 JavaScript 的[社区插件](https://www.gatsbyjs.com/plugins/gatsby-plugin-no-javascript/)，但这将破坏许多网站。这使得你不得不在在每个页面的交互性上做出一个全有或全无的决定。

Gatsby 有个伟大的插件生态系统，而 Astro 的[集成集合](https://astro.build/integrations/)刚刚起步但仍在不断成长。Gatsby 提供了用于高级图像优化的 [gatsby-plugin-image](https://www.gatsbyjs.com/plugins/gatsby-plugin-image/)。虽然 Astro 并没有提供类似的第一方解决方案，但流行的社区集成 [astro-imagetools](https://github.com/RafidMuhymin/astro-imagetools#readme) 可以用于优化图像、背景图像和生成响应式图像。

#### 案例：创建文档站点

[gatsbyjs.com/docs](https://www.gatsbyjs.com/docs/quick-start/) 是 Gatsby 的官方文档网站，用 Gatsby 构建。与 Astro 官方文档网站相比较，二者的设计和功能十分相似。下面给出了两个站点生成器的**粗略但又真实**的比较。

- **Gatsby 性能得分**：46 分（满分 100 分）[（全面检查）](/lighthouse/gatsby/)
- **Astro 性能得分**：92 分（满分 100 分）[（全面检查）](/lighthouse/astro/)

<!-- One big reason behind this performance difference is Astro’s smaller JavaScript payload: [gatsbyjs.com/docs](https://www.gatsbyjs.com/docs/quick-start/) loads **417kb** of JavaScript on first page load while [docs.astro.build](https://docs.astro.build) loads **78.7kb** (81% less JavaScript, overall) _after_ first load. -->

## Hugo vs. Astro

[Hugo](https://gohugo.io/) 是一个由 Go 驱动的流行静态网站生成器。

Hugo 使用自定义的[模板语言](https://gohugo.io/templates/introduction/)来渲染网站内容。Astro 让你使用你喜欢的 UI 组件库（React、Preact、Vue、Svelte 等）或类似于 HTML + JSX 的内置组件语法创建页面。Hugo 不支持使用现代 UI 组件进行 HTML 模板制作。

#### 比较 Hugo vs. Astro 性能

在概念上，Hugo 与 Astro 的“最小客户端 JavaScript”的网络开发方法是一致的。Hugo 和 Astro 都提供了类似的零 JavaScript 默认的性能基线。

Hugo 和 Astro 都提供了对构建、捆绑和最小化 JavaScript 的内置支持。Astro 会自动从页面中剥离不必要的 JavaScript，只激活个别需要的组件。这个功能被称为[部分激活](/zh-CN/core-concepts/partial-hydration/)。虽然在 Hugo 中可以自己实现这个功能，但 Astro 内置了该功能。

#### 案例：创建文档站点

[gohugo.io/documentation/](https://gohugo.io/documentation/) 是 Hugo 的官方文档网站，用 Hugo 构建。与 Astro 官方文档网站相比较，二者的设计和功能十分相似。下面给出了两个站点生成器的**粗略但又真实**的比较。

- **Hugo 性能得分**：98 分（满分 100 分）[（全面检查）](/lighthouse/hugo/)
- **Astro 性能得分**：92 分（满分 100 分）[（全面检查）](/lighthouse/astro/)

## Jekyll vs. Astro

[Jekyll](https://jekyllrb.com/) 是一个由 Ruby 驱动的流行静态网站生成器。

Jekyll 使用一种叫做 Liquid 的较早期[模板语言](https://jekyllrb.com/docs/liquid/)来渲染网站内容 。Astro 让你使用你最喜欢的 UI 组件库（React、Preact、Vue、Svelte 和其他）或类似于 HTML + JSX 的内置组件语法创建页面。Jekyll 不支持使用现代 UI 组件进行 HTML 模板制作。

#### 比较 Jekyll vs. Astro 性能

从概念上讲，Jekyll 与 Astro 的“最小客户端 JavaScript”的网页开发方法是一致的。Jekyll 和 Astro 都提供了类似的零 JavaScript 默认的性能基线。

Jekyll 通过推动你完全避免使用 JavaScript 来实现这一目标。Jekyll 的网站通常很少甚至没有使用 JavaScript，而是采用服务器端的 HTML 渲染。当你确实需要客户端的 JavaScript 时，这就成了一个问题。这取决于你是否为 Jekyll 创建自己的构建 pipeline。这可能会耗时很久，并使得你不得不自己在捆绑、压缩和其他方面上进行复杂配置以实现优化。

相比之下，Astro 自动为你构建客户端的 JavaScript。Astro 只向浏览器发送最低限度的 JavaScript，并对其进行压缩、捆绑和优化。虽然在 Jekyll 中可以自己实现这一点，但 Astro 内置了该功能。

#### 案例：创建文档站点

[jekyllrb.com/docs](https://jekyllrb.com/docs) 是 Jekyll 的官方文档网站，用 Jekyll 构建。与 Astro 官方文档网站相比较，二者的设计和功能十分相似。下面给出了两个站点生成器的**粗略但又真实**的比较。

- **Jekyll 性能得分**：96 分（满分 100 分）[（全面检查）](/lighthouse/jekyll/)
- **Astro 性能得分**：92 分（满分 100 分）[（全面检查）](/lighthouse/astro/)

## SvelteKit vs. Astro

[SvelteKit](https://kit.svelte.dev/) 是一个流行 Svelte 的网站和应用程序框架。

SvelteKit 使用 Svelte 来渲染网站内容。Astro 更加灵活：你可以自由地使用任何流行的组件库（React、Preact、Vue、Svelte、Solid 等）或 Astro 的类似 HTML 的组件语法来构建 UI，这类似于 HTML+JSX。

SvelteKit 和 Astro 都是构建网站的框架。SvelteKit 最适合高度动态的网站（如仪表盘和收件箱），而 Astro 最适合高度静态的网站（如内容和电商网站）。

SvelteKit 同时支持静态网站生成（SSG）和服务器端渲染（SSR）。Astro 可以用 SSG 静态构建或用[适配器](/zh-CN/guides/server-side-rendering/#enabling-ssr-in-your-project)部署到 SSR 环境，像是 Deno、Vercel serverless、Netlify serverless 和 Node.js，并将支持更多服务。

#### 比较 SvelteKit vs. Astro 性能

在大多数情况下，Astro 网站的加载速度会比 SvelteKit 网站快。这是因为 Astro 会自动将不必要的 JavaScript 从页面中剥离出来，只激活个别需要的组件。这个功能被称为[部分激活](/zh-CN/core-concepts/partial-hydration/)。

SvelteKit 不支持部分激活，而是让用户在浏览器中加载并重新激活整个页面，即使大部分的页面内容是静态的。这给你的网站带来了更慢的页面加载和更差的性能。SvelteKit 确实提供了对[页面级静态、零 JavaScript 页面](https://kit.svelte.dev/docs#ssr-and-javascript-hydrate)的支持。然而，没有计划对页面上的单个组件提供激活支持。这使得你在每个页面的交互性方面都不得不做出全有或全无的决定。

#### 案例：创建文档站点

[kit.svelte.dev](https://kit.svelte.dev/docs#ssr-and-javascript-hydrate) 是 SvelteKit 的官方文档网站，由 SvelteKit 构建。与 Astro 官方文档网站相比较，二者的设计和功能十分相似。下面给出了两个站点生成器的**粗略但又真实**的比较。

测试的两个网站之间有一个明显的区别。SvelteKit 的文档是作为一个单一的页面提供的，而 Astro 的文档被分成多个页面。这种较大的内容有效载荷应该会对性能产生轻微的负面影响，这与工具本身无关。

- **SvelteKit 性能得分**：91 分（满分 100 分）[（全面检查）](/lighthouse/sveltekit/)
- **Astro 性能得分**：92 分（满分 100 分）[（全面检查）](/lighthouse/astro/)

SvelteKit 在这项测试中的表现与 Astro 相当。

## Next.js vs. Astro

[Next.js](https://nextjs.org/) 是一个流行的 React 网站和应用程序框架。

Next.js 使用 React 来渲染网站内容。Astro 更灵活：你可以自由地使用任何流行的组件库（React、Preact、Vue、Svelte、Solid 等）或 Astro 的类似 HTML 的组件语法来构建 UI，这类似于 HTML + JSX。

Next.js 和 Astro 都是构建网站的框架。Next.js 对高度动态的网站（如仪表盘和收件箱）效果最好，而 Astro 对高度静态的网站（如内容和电子商务网站）效果最好。

Next.js 同时支持静态网站生成（SSG）和服务器端渲染（SSR）。Astro 可以用 SSG 静态构建或用[适配器](/zh-CN/guides/server-side-rendering/#enabling-ssr-in-your-project)部署到 SSR 环境，像是 Deno、Vercel serverless、Netlify serverless 和 Node.js，并将支持更多服务。

#### 比较 Next.js vs. Astro 性能

在大多数情况下，Astro 网站的加载速度会明显快于 Next.js 网站。这是因为 Astro 会自动将不必要的 JavaScript 从页面中剥离出来，只激活个别需要的组件。这个功能被称为[部分激活](/zh-CN/core-concepts/partial-hydration/)。

Next.js 不支持部分激活，而是让用户在浏览器中加载并重新激活整个页面，即使页面的大部分内容是静态的。这为您的网站创造了更慢的页面加载和更差的性能。Next.js 对完全静态的零 JavaScript 页面提供[实验性支持](https://piccalil.li/blog/new-year-new-website/#heading-no-client-side-react-code)。然而，目前还没有计划支持对页面上的单个组件进行激活。这让你在每个页面的交互性上都要做出全有或全无的决定。

Next.js 有很好的内置图像优化功能。虽然 Astro 没有类似的第一方解决方案，但有流行的社区[集成](https://astro.build/integrations/) [astro-imagetools](https://github.com/RafidMuhymin/astro-imagetools#readme) 用于优化图像、背景图像和生成响应式图像。

#### 案例：创建文档站点

[nextjs.org/docs](https://nextjs.org/docs/getting-started) 是 Next.js 的官方文档网站，用 Next.js 构建。与 Astro 官方文档网站相比较，二者的设计和功能十分相似。下面给出了两个站点生成器的**粗略但又真实**的比较。

- **Next.js 的性能得分**：71 分（满分 100 分）[（全面检查）](/lighthouse/next/)
- **Astro 性能得分**：92 分（满分 100 分）[（全面检查）](/lighthouse/astro/)

<!-- One big reason behind this performance difference is Astro’s smaller JavaScript payload: [nextjs.org/docs](https://nextjs.org/docs/getting-started) loads **463kb** of JavaScript on first page load while [docs.astro.build](https://docs.astro.build) loads **78.7kb** (83% less JavaScript, overall) _after_ first load. -->

## Nuxt vs. Astro

[Nuxt](https://nuxtjs.org/) 是一个流行的 Vue 的网站和应用程序框架。它类似于 Next.js。

Nuxt 使用 Vue 来渲染网站内容。Astro 更灵活：你可以用任何流行的组件库（React、Preact、Vue、Svelte、Solid 等）或 Astro 的类似 HTML 的组件语法自由构建 UI，这类似于 HTML + JSX。

Nuxt 和 Astro 都是构建网站的框架。Nuxt 最适合高度动态的网站（如仪表盘和收件箱），而 Astro 最适合高度静态的网站（如内容和电商网站）。

Nuxt 同时支持静态网站生成（SSG）和服务器端渲染（SSR）。Astro 可以用 SSG 静态构建或用[适配器](/zh-CN/guides/server-side-rendering/#enabling-ssr-in-your-project)部署到 SSR 环境，像是 Deno、Vercel serverless、Netlify serverless 和 Node.js，并将支持更多服务。

#### 比较 Nuxt vs. Astro 性能

在大多数情况下，Astro 网站的加载速度会明显快于 Nuxt 网站。这是因为 Astro 会自动将不必要的 JavaScript 从页面中剥离出来，只激活个别需要的组件。这个功能被称为[部分激活](/zh-CN/core-concepts/partial-hydration/)。

Nuxt 不支持部分激活，而是让用户在浏览器中加载和重新激活整个页面，即便大部分的页面内容都是静态的，这也使得网站页面加载比较慢和性能比较差。在 Nuxt 中没有办法禁用这种行为。

Nuxt 有很好的内置图片优化功能。虽然 Astro 没有类似的第一方解决方案，但有流行的社区[集成](https://astro.build/integrations/) [astro-imagetools](https://github.com/RafidMuhymin/astro-imagetools#readme) 用于优化图像，背景图像，并生成响应式图像。

#### 案例：创建文档站点

[nuxtjs.org/docs](https://nuxtjs.org/docs/2.x/get-started/installation) 是 Nuxt 的官方文档网站，用 Nuxt 构建。与 Astro 官方文档网站相比较，二者的设计和功能十分相似。下面给出了两个站点生成器的**粗略但又真实**的比较。

- **下一个性能得分**：50 分（满分 100 分）[（全面检查）](/lighthouse/nuxt/)
- **Astro 性能得分**：92 分（满分 100 分）[（全面检查）](/lighthouse/astro/)

<!-- One big reason behind this performance difference is Astro’s smaller JavaScript payload: [nuxtjs.org/docs](https://nuxtjs.org/docs/2.x/get-started/installation) loads **469kb** of JavaScript on first page load while [docs.astro.build](https://docs.astro.build) loads **78.7kb** (83% less JavaScript), _after_ first load. -->

## VuePress vs. Astro

[VuePress](https://vuepress.vuejs.org/guide/) 是 Vue.js 的创造者提供的一个流行的文档网站生成器。VuePress 使用 Vue.js 来生成你的网站用户界面，而 Astro 支持 React、Vue.js、Svelte 和原始 HTML 模板。

VuePress 是为文档网站设计的，并且有一些内置的、特定于文档的网站功能，而 Astro 并不支持开箱即用。相反，Astro 通过官方的 [`docs`](https://github.com/withastro/astro/tree/main/examples/docs) 主题提供了特定的文档功能，你可以为你的网站使用。这个网站就是用这个模板建立的！

Evan You（Vue.js 的创造者）目前正在开发 Vuepress 的新版本，名为 [VitePress](https://vitepress.vuejs.org/)。如果你想要一个现代的 VuePress 的替代品，[看看 Evan 的帖子](https://github.com/withastro/astro/issues/1159#issue-974035962)，为什么 VitePress 可能是一个更好的选择。

#### 比较 VuePress vs. Astro 性能

在大多数情况下，Astro 网站的加载速度会明显快于 VuePress 网站。这是因为 Astro 会自动将不必要的 JavaScript 从页面中剥离出来，只激活个别需要的组件。这个功能被称为[部分激活](/zh-CN/core-concepts/partial-hydration/)。

VuePress 不支持部分激活，而是让用户在浏览器中加载并重新激活整个页面，即便大部分的页面内容都是静态的，这也使得网站页面加载比较慢和性能比较差。在 VuePress 中没有办法禁用这种行为。

#### 案例：创建文档站点

[vuepress.vuejs.org](https://vuepress.vuejs.org/guide/) 是 VuePress 的官方文档网站，用 VuePress 建立。与 Astro 官方文档网站相比较，二者的设计和功能十分相似。下面面给出了两个站点生成器的**粗略但又真实**的比较。

- **Vuepress 的性能得分**：67 分（满分 100 分）[（全面检查）](/lighthouse/vuepress/)
- **Astro 性能得分**：92 分（满分 100 分）[（全面检查）](/lighthouse/astro/)

<!-- One big reason behind this performance difference is Astro’s smaller JavaScript payload: [vuepress.vuejs.org](https://vuepress.vuejs.org/guide/) loads **166kb** of JavaScript on first page load while [docs.astro.build](https://docs.astro.build) loads **78.7kb** (53% less JavaScript, overall) _after_ first load. -->

## Zola vs. Astro

[Zola](https://www.getzola.org/) 是一个由 Rust 驱动的流行且快速的静态网站生成器。

Zola 使用 [Tera](https://tera.netlify.app/) 来渲染网站内容。Astro 让你使用你喜欢的 UI 组件库（React、Preact、Vue、Svelte 等）或类似于 HTML + JSX 的内置组件语法来创建页面。Zola 不支持使用现代 UI 组件进行 HTML 模板制作。

#### 比较 Zola vs. Astro 性能

在概念上，Zola 与 Astro 的“最小客户端 JavaScript”的网络开发方法是一致的。Zola 和 Astro 都提供了类似的零 JavaScript 默认的性能基线。

Astro 提供了对构建、捆绑和最小化 JavaScript 的内置支持。Zola 需要使用另一个构建工具，如 Webpack 来捆绑和处理 JavaScript。Astro 会自动从页面中剥离不必要的 JavaScript，只激活个别需要的组件。这个功能被称为[部分激活](/zh-CN/core-concepts/partial-hydration/)。虽然在 Zola 中可以自己实现这个功能，但 Astro 内置了该功能。

#### 案例：创建文档站点

[getzola.org/documentation](https://getzola.org/documentation) 是 Zola 的官方文档网站，用 Zola 建立。与 Astro 官方文档网站相比较，二者的设计和功能十分相似。下面给出了两个站点生成器的**粗略但又真实**的比较。

- **Zola 性能得分**：91 分（满分 100 分）[（全面检查）](/lighthouse/zola/)
- **Astro 性能得分**：92 分（满分 100 分）[（全面检查）](/lighthouse/astro/)

## `.astro` vs `.jsx`

Astro 组件语法是 HTML 的超集。它设计让任何有 HTML 或 JSX 经验的人都感到熟悉。

**如果你已经了解 HTML了，那么你的现有知识就足以编写属于自己的第一个 Astro 组件。

| 特点             | Astro                                               | JSX                                                   |
| ---------------- | --------------------------------------------------- | ----------------------------------------------------- |
| 文件扩展名       | `.astro`                                            | `.jsx` 或 `.tsx`                                      |
| 用户定义的组件   | `<Capitalized>`                                     | `<Capitalized>`                                       |
| 表达式语法       | `{}`                                                | `{}`                                                  |
| 展开属性         | `{...props}`                                        | `{...props}`                                          |
| 布尔属性         | `autocomplete` === `autocomplete={true}`            | `autocomplete` === `autocomplete={true}`              |
| 行内函数         | `{items.map (item => <li>{item}</li>)}`             | `{items.map (item => <li>{item}</li>)}`               |
| 条件渲染         | `{condition &&  <p>text<p>}`                        | `{condition &&  <p>text<p>}`                          |
| IDE 支持         | [VS Code（包括 Open VSX）和 Nova](/zh-CN/editor-setup/) | Phenomenal                                            |
| 需要在 JS 中导入 | No                                                  | Yes，比如在作用域内使用 `jsxPragma`（`React` 或 `h`） |
| 片段             | 在顶级自动，在函数中使用 `<Fragment>` 或 `<>`       | 使用 `<Fragment>` 或 `<>` 包装                        |
| 单文件多框架     | Yes                                                 | No                                                    |
| 修改 `<head>`    | 只需要在顶级页面使用 `<head>`                       | 每个框架不同（如 `<Head>`, `<svelte:head>`）          |
| 注释风格         | `<!-- HTML -->`                                     | `{/_ JavaScript _/}`                                  |
| 特殊字符         | `&nbsp;`                                            | `&nbsp;`                                              |
| 属性             | `dash-case`                                         | `camelCase`                                           |
