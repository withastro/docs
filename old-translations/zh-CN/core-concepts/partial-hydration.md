---
layout: ~/layouts/MainLayout.astro
title: Astro 中的部分激活
description: 学习如何在 Astro 使用“群岛结构”实现部分激活。
setup: |
  import IslandsDiagram from '~/components/IslandsDiagram.astro';
---

**默认情况下 Astro 生成的每个网站都没有客户端 JavaScript**。使用由 [React](https://reactjs.org/)、[Preact](https://preactjs.com/)、[Svelte](https://svelte.dev/)、[Vue](https://vuejs.org/)、[SolidJS](https://www.solidjs.com/)、[AlpineJS](https://alpinejs.dev/) 和 [Lit](https://lit.dev/) 构建的前端 UI 组件，Astro 会在构建时自动渲染成 HTML 并剥离掉所有 JavaScript。这可以使得每个网站在默认情况下就已经很快。

```astro
---
// 示例：在页面中不用 JavaScript 使用 React 静态组件。
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- 100% HTML，零 JavaScript！-->
<MyReactComponent />
```

但有时需要用客户端 JavaScript 来创建交互式 UI。当你发现自己需要在页面上实现交互式 UI 时，Astro 也不会强制你在页面上 100% 使用 JavaScript。相反，Astro 使用叫做**部分激活**的技术，让你可以在页面上激活单个组件。这样一来，你只需分发必不可少的 JavaScript 就能运行页面。

```astro
---
// 示例：在页面中使用 React 动态组件。
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- 现在页面上的这个组件是可交互的！ 
     而网站的其他部分则保持不变 -->
<MyReactComponent client:load />
```

绝大部分网站内容仍是轻量级的纯 HTML 和 CSS 以及独立的**交互岛屿**。

## 部分激活

有很多情况下，你需要在浏览器中运行一个交互式 UI 组件：

- 图片轮播
- 自动补全的搜索栏
- 移动端侧边栏的打开 / 关闭按钮
- “立即购买” 按钮

在 Astro 中，开发者需要明确指出页面中需要在浏览器中运行的所有组件。Astro 将只激活页面需要的内容，并将网站的其余部分转为静态 HTML。这种技术被称为**部分激活**。

**部分激活是 Astro 在不人为进行优化情况下保持高效性能的秘密。**

## 群岛架构

**群岛架构**是用部分激活来构建整个网站的想法。群岛架构是对网站构建成必须分发给用户客户端的 JavaScript 捆绑包这一常见过程的替代。

> 群岛架构的总体思路看似简单：在服务器上渲染 HTML 页面，并在高度动态的区域周围注入占位符或插槽。
> <br/> -- [Islands Architecture: Jason Miller](https://jasonformat.com/islands-architecture/)

除了向浏览器发送较少 JavaScript 而具有明显性能优势外，群岛架构还有两个关键的好处：

- **单独加载组件**。轻量级的组件（如侧边栏的切换器）将使得加载和渲染速度极快，且不会受页面中较重的组件所影响。
- **独立组件渲染**。页面的每一部分都是一个独立的单元，一个单元的性能问题不会直接影响其他单元。

<IslandsDiagram>
    <Fragment slot="headerApp">页眉应用</Fragment>
    <Fragment slot="sidebarApp">侧边栏应用</Fragment>
    <Fragment slot="main">
        像文本、图片之类的服务端渲染 HTML 内容
    </Fragment>
    <Fragment slot="carouselApp">图片轮播应用</Fragment>
    <Fragment slot="advertisement">广告<br/>（服务端渲染）</Fragment>
    <Fragment slot="footer">页尾（服务端渲染 HTML）</Fragment>
</IslandsDiagram>

**来源：[Islands Architecture: Jason Miller](https://jasonformat.com/islands-architecture/)**
