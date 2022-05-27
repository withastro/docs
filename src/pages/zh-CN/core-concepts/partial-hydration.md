---
layout: ~/layouts/MainLayout.astro
title: Astro 中的部分激活
description: 学习如何在 Astro 使用“群岛结构”实现部分激活。
---

**Astro 默认生成的每个网站都没有客户端 JavaScript**。你可以使用任何你喜欢的前端 UI 组件（[React](https://reactjs.org/)、[Preact](https://preactjs.com/)、[Svelte](https://svelte.dev/)、[Vue](https://vuejs.org/)、[SolidJS](https://www.solidjs.com/)、[AlpineJS](https://alpinejs.dev/) 和 [Lit](https://lit.dev/)），Astro 会在构建时自动渲染成 HTML 并剥离掉所有 JavaScript。这可以使得每个网站在默认情况下就已经很快。

```astro
---
// 示例：在页面中不用 JavaScript 使用 React 静态组件。
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- 100% HTML, Zero JavaScript! -->
<MyReactComponent />
```

但有时需要用客户端 JavaScrip 来创建交互式 UI 。当你发现自己需要在页面上实现交互式 UI 时，Astro 并不强制你在页面上完全使用 JavaScript。相反，Astro 使用一种叫做**部分激活**的技术，让你在页面上激活单个组件。这样一来，你只需分发必不可少的 JavaScript 就能运行页面。

```astro
---
// 示例：在页面中使用 React 动态组件。
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- This component is now interactive on the page! 
     The rest of your website remains the same. -->
<MyReactComponent client:load />
```

你的网站的绝大部分仍然是纯粹的、轻量级的 HTML 和 CSS 以及孤立的**交互岛屿**。

## 部分激活

有很多情况下，你需要在浏览器中运行一个交互式 UI 组件：

- 图片轮播
- 自动补全的搜索栏
- 移动端侧边栏的打开 / 关闭按钮
- “立即购买” 按钮

在 Astro 中，开发者需要明确指出页面中需要在浏览器中运行的所有组件。Astro 将只激活页面需要的内容，并将网站的其余部分转为静态 HTML。这种技术被称为**部分激活**。

**部分激活是 Astro 在不人为进行优化情况下保持高效性能的秘密。**

## 区域结构

**群岛架构**是用部分激活来构建整个网站的想法。群岛架构是对网站构建成必须分发给用户客户端的 JavaScript 捆绑包这一常见过程的替代。

> 群岛架构的总体思路看似简单：在服务器上渲染 HTML 页面，并在高度动态的区域周围注入占位符或插槽。
>
> [Islands Architecture: Jason Miller](https://jasonformat.com/islands-architecture/)

除了向浏览器发送较少 JavaScript 而具有明显性能优势外，群岛架构还有两个关键的好处：

- **单独加载组件**。轻量级的组件（如侧边栏的切换器）将使得加载和渲染速度极快，且不会受页面中较重的组件所影响。
- **独立组件渲染**。页面的每一部分都是一个独立的单元，一个单元的性能问题不会直接影响其他单元。

![diagram](https://res.cloudinary.com/wedding-website/image/upload/v1596766231/islands-architecture-1.png)
