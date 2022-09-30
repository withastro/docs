---
layout: ~/layouts/MainLayout.astro
title: 组件岛
description: "组件岛（Astro Islands）是由 Astro 开创的一种 Web 架构模式。 “岛屿架构”由 Etsy 的前端架构师 Katie Sylor-Miller 在 2019 年首次提出，并由 Preact 的创建者 Jason Miller 进行了扩展。"
i18nReady: true
setup: |
  import IslandsDiagram from '~/components/IslandsDiagram.astro';
---

**Astro Islands**（又名组件岛）是由 Astro 开创的一种 Web 架构模式。 “岛屿架构”的概念最初是由 Etsy 的前端架构师 [Katie Sylor-Miller](https://twitter.com/ksylor) 在 2019 年提出的，并在 [this post](https://jasonformat.com) 中进行了扩展 /islands-architecture/) 由 Preact 创建者 Jason Miller 编写。

## 什么是组件岛？

术语“Astro Island”指的是 HTML 静态页面上的交互式 UI 组件。 一个页面上可以存在多个孤岛，一个孤岛总是孤立地呈现。 将它们视为静态、非交互式 HTML 海洋中的岛屿。

<IslandsDiagram>
    <Fragment slot="headerApp">Header (interactive island)</Fragment>
    <Fragment slot="sidebarApp">Sidebar (static HTML)</Fragment>
    <Fragment slot="main">
        Static content like text, images, etc.
    </Fragment>
    <Fragment slot="carouselApp">Image carousel (interactive island)</Fragment>
    <Fragment slot="footer">Footer (static HTML)</Fragment>
    <Fragment slot="source">Source: [Islands Architecture: Jason Miller](https://jasonformat.com/islands-architecture/)</Fragment>
</IslandsDiagram>

在 Astro 中，您可以使用任何支持的 UI 框架（React、Svelte、Vue 等）在浏览器中渲染岛屿。 您可以在同一页面上混合和匹配不同的框架，或者只选择您喜欢的。

这种架构模式所基于的技术被称为 **部分的** 或 **可选择成分的** Astro 在幕后利用这种技术，自动为您的岛屿供电。

## 岛屿如何在 Astro 中工作？

**Astro 默认使用零客户端 JavaScript 生成每个网站。** 使用使用 [React](https://reactjs.org/)、[Preact](https://preactjs.com) 构建的前端 UI 组件 /)、[Svelte](https://svelte.dev/)、[Vue](https://vuejs.org/)、[SolidJS](https://www.solidjs.com/)、[AlpineJS] (https://alpinejs.dev/) 或 [Lit](https://lit.dev/)，Astro 会提前自动将其呈现为 HTML，然后去除所有 JavaScript。 默认情况下，这会通过从页面中删除所有未使用的 JavaScript 来保持每个站点的快速运行。

```astro title="src/pages/index.astro"
---
// Example: Use a static React component on the page, without JavaScript.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- 100% HTML, Zero JavaScript loaded on the page! -->
<MyReactComponent />
```

但有时，创建交互式 UI 需要客户端 JavaScript。 Astro 不是强迫你的整个页面变成一个类似于 SPA 的 JavaScript 应用程序，而是要求你创建一个岛。

```astro title="src/pages/index.astro" ins="client:load"
---
// Example: Use a dynamic React component on the page.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- This component is now interactive on the page! 
     The rest of your website remains static and zero JS. -->
<MyReactComponent client:load />
```
在 Astro Islands，大部分网站仍然是纯的、轻量级的 HTML和CSS。 在上面的示例中，我们只是向单个孤立岛屿添加了交互式功能，而无需更改页面的其余部分。

## 岛屿有什么好处？

使用 Astro Islands 构建最明显的好处是性能：您的大部分网站都转换为快速、静态的 HTML，并且 JavaScript 只为需要它的单个组件加载。 JavaScript 是您可以按字节加载的最慢的资源之一，因此每个字节都很重要。

另一个好处是并行加载。 在上面的示例图中，低优先级的“图像轮播”岛不需要阻止高优先级的“标题”岛。 两者并行加载并隔离填充，这意味着标题立即变得可交互，而无需等待页面下方较重的轮播。

更好的是，您可以准确地告诉 Astro 如何以及何时渲染每个组件。 如果该图像轮播真的很大，您可以附加一个特殊的[客户端指令]（/zh-cn/reference/directives-reference/#client-directives），告诉Astro仅在页面上可见时加载轮播。 如果用户从未看到它，它永远不会加载。

在 Astro 中，作为开发人员，您可以明确告诉 Astro 页面上的哪些组件也需要在浏览器中运行。 Astro 只会准确地补充页面上需要的内容，并将您网站的其余部分保留为静态 HTML。

**岛屿是 Astro 默认快速性能故事的秘密！**
