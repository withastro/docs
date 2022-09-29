---
layout: ~/layouts/MainLayout.astro
title: Astro 群岛
description: "Astro 群岛（又称组件群岛）是 Astro 开创的一种新 Web 架构模式。“群岛架构”由 Etsy 前端架构工程师 Katie Sylor-Miller 于2019年首次提出，并由 Preact 的作者 Jason Miller 进行扩展。"
setup: |
  import IslandsDiagram from '~/components/IslandsDiagram.astro';
---

**Astro群岛**（又称组件群岛）是 Astro 开创的一种新Web架构模式。“群岛架构”由 Etsy 前端架构工程师 [Katie Sylor-Miller](https://twitter.com/ksylor) 于 2019 年首次提出，并由 Preact 的作者 Jason Miller 在[这篇文章](https://jasonformat.com/islands-architecture/)进行了扩展。

## 什么是 Astro 群岛

“Astro 群岛“指的是静态 HTML 中的交互性的 UI 组件。一个页面上可以有多个岛屿，并且每个岛屿都被独立呈现。你可以将它们想象成在一片由静态（不可交互）的 HTML 页面中的动态岛屿。

<IslandsDiagram>
    <Fragment slot="headerApp">页头（可交互岛屿）</Fragment>
    <Fragment slot="sidebarApp">侧边栏（静态HTML）</Fragment>
    <Fragment slot="main">
        静态内容（比如文本、图片...）
    </Fragment>
    <Fragment slot="carouselApp">图像轮播（可交互岛屿）</Fragment>
    <Fragment slot="footer">页脚（静态HTML）</Fragment>
    <Fragment slot="source">来源: [群岛架构: Jason Miller](https://jasonformat.com/islands-architecture/)</Fragment>
</IslandsDiagram>

在Astro中，你可以使用任何被支持的UI框架（比如React, Svelte, Vue）来在浏览器中呈现群岛。你可以在一个页面中混合或拼接许多不同的框架，或者仅仅使用自己最喜欢的。

The technique that this architectural pattern builds on is known as **partial** or **selective hydration.** Astro leverages this technique behind the scenes, powering your islands automatically. 
这个架构模式所依赖的技术为partial（局部依赖）或selective hydration（选择性混合）。

## 群岛如何在Astro中运作

**Astro默认生产没有客户端JavaScript的网站。** 使用前端框架[React](https://reactjs.org/)，[Preact](https://preactjs.com/), [Svelte](https://svelte.dev/)，[Vue](https://vuejs.org/)，[SolidJS](https://www.solidjs.com/)，[AlpineJS](https://alpinejs.dev/)或者 [Lit](https://lit.dev/)，Astro会自动提前将它们渲染为HTML，然后出去所有JavaScript。这使得Astro创建的网站默认非常迅速，因为Astro帮你自动清除了所有页面上的JavaScript。

```astro title="src/pages/index.astro"
---
// 例子：在此页面使用一个静态的React组件，没有JavaScript。
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- 100% HTML, 没有JavaScript在这个页面上！ -->
<MyReactComponent />
```

但是有些时候，响应式的 UI 是需要客户端 JavaScript 的。你不该将整个页面做成一个像 SPA（单页面应用）一样的 JavaScript 应用，相反，Astro 允许你创建岛屿。

```astro title="src/pages/index.astro" ins="client:load"
---
// 例子：在此页面上使用一个动态 React 组件
---
<!-- 现在这个组件是可交互性的了！
  网站的其他部分任然是静态、没有JavaScript的。 -->
<MyReactComponent client:load />
```

使用 Astro 群岛，你的大部分页面保持着纯正、轻盈的HTMl和CSS。在上面的例子中，你紧紧添加了一个简单的、孤立的**可响应岛屿**，而并没有改变任何页面其他部分的代码。

## 群岛的好处有哪些？

Astro 群岛的最明显的好处就是性能：你网站的大部分区域都被转换为了快速、静态的 HTML，JavaScript 只为单独组件而被加载。JavaScript 是一个加载得最慢的资源。每一个字节都影响着阅读者的体验！

另一个好处是并行加载。在上面的一些假想例子中，重要性更低的图像轮播不应该阻挡更重要的页头部分的加载。这两样东西被并行加载并被分别单独组建，这表明阅读者并不需要等着更沉重的图像轮播加载完毕就可以与页头交互了。

还有更棒的：你可以准确地告诉 Astro 如何以及何时渲染每个组件。如果该图像轮播的加载成本真的很高，你可以附加一个特殊的客户端指令，告诉 Astro 仅在轮播在页面上可见时才加载它。如果用户从未看到它，它永远不会被加载。

在 Astro 中，作为开发人员，你可以明确告诉 Astro 你的页面上的哪些组件也需要在客户端浏览器中运行。Astro 只会准确地补充页面上需要交互性的内容，并将您网站的其余部分保留为静态 HTML。

**群岛正是 Astro 在默认情况下能够如此迅速之秘诀！**
