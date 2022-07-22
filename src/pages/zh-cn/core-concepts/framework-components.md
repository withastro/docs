---
layout: ~/layouts/MainLayout.astro
title: 框架组件
description: 学习如何使用 React，Svelte 等框架。
---

你可以在无需舍弃你所喜欢的组件框架的情况下使用 Astro 构建站点。

Astro 支持多个受欢迎的框架，包括[React](https://reactjs.org/)、[Preact](https://preactjs.com/)、[Svelte](https://svelte.dev/)、[Vue](https://vuejs.org/)、[SolidJS](https://www.solidjs.com/)、[AlpineJS](https://alpinejs.dev/) 和 [Lit](https://lit.dev/)。

## 安装集成

Astro 有可供选择的 React、Preact、Svelte、Vue、SolidJS 和 Lit 集成。你可以可以在项目中安装和配置这些 Astro 集成中的一个或几个。


要在 Astro 中使用这些框架，首先要安装该集成以及任何相关的对等依赖。

```bash
npm install --save-dev @astrojs/react react react-dom
```

然后在  `astro.config.mjs` 中导入并添加函数到集成列表中：

```js
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import preact from '@astrojs/preact';
import svelte from '@astrojs/svelte';
import vue from '@astrojs/vue';
import solid from '@astrojs/solid-js';
import lit from '@astrojs/lit';

export default defineConfig({
	integrations: [react(), preact(), svelte(), vue(), solid() , lit()],
});
```

⚙️ 阅读[集成指引](/zh-cn/guides/integrations-guide/)获取更多关于安装和配置 Astro 集成和信息。

⚙️ 想要看看你选择的框架的示例？访问 [astro.new](https://astro.new/) 然后选择一个框架模板。

## 使用框架组件

在 Astro 页面、布局和组件中就像 Astro 组件一样使用你的 JavaScript 框架组件。所有组件都可放在 `/src/components` 目录中，或者你也可以放在任何你喜欢的地方。

要使用框架组件，你需要在 Astro 组件脚本中使用相对路径（包括文件扩展名）导入它们。然后在其他组件、HTML 元素和类 JSX 表达式中使用它们。

```astro
---
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<html>
  <body>
    <h1>Use React components directly in Astro!</h1>
    <MyReactComponent />
  </body>
</html>
```

:::tip
记住：所有导入必须在 Astro 组件脚本的**顶部**。
:::

默认情况下，你的框架组件将渲染为静态 HTML。这对于模板组件而言非常有用，它不需要交互和避免分发没用的 JavaScript 给用户。

## 激活组件

框架组件可以使用 `client:*` 指令实现激活。它是个用来定义你的组件应该如何被**渲染**和激活的属性。


[客户端指令](/zh-cn/reference/directives-reference/#客户端指令)描述了你的组件是否应该在构建时被渲染，以及你的组件的 JavaScript 何时应该被浏览器加载.

大多数指令会在构建时在服务器上渲染组件。组件 JS 将根据特定的指令被分发到客户端。当组件的 JS 导入完成后，组件将进行激活。

```astro
---
// 示例：浏览器中的激活框架组件。
import InteractiveButton from '../components/InteractiveButton.jsx';
import InteractiveCounter from '../components/InteractiveCounter.jsx';
---
<!-- 该组件 JS 将在页面加载开始时导入 -->
<InteractiveButton client:load />

<!-- 该组件 JS 将不会分发给客户端直到用户向下滚动，该组件在页面上是可见的 -->
<InteractiveCounter client:visible />
```

:::caution
Any renderer JS necessary for the component's framework (e.g. React, Svelte) is downloaded with the page. The `client:*` directives only dictate when the _component JS_ is imported and when the _component_ is hydrated.
框架组件所必须的渲染 JS（如 React、Svelte）都会随着页面一同下载。`client:*` 指令只决定了何时导入**组件 JS**，以及何时激活框架。
:::

### 可用激活指令

这里有几个适用于 UI 框架组件的激活指令：`client:load`、`client:idle`、`client:visible`、`client:media={QUERY}` and `client:only={FRAMEWORK}`。

📚 查看[指令参考](/zh-cn/reference/directives-reference/#客户端指令) 页面获取这些激活指令的详细描述以及用法。

## 混合框架

你可以在同一个 Astro 组件中导入并渲染来自多个框架的组件。

```astro
---
// src/pages/MyAstroPage.astro
// 示例：在同一个页面混合多个框架的组件。
import MyReactComponent from '../components/MyReactComponent.jsx';
import MySvelteComponent from '../components/MySvelteComponent.svelte';
import MyVueComponent from '../components/MyVueComponent.vue';
---
<div>
  <MySvelteComponent />
  <MyReactComponent />
  <MyVueComponent />
</div>
```

:::caution
只有 **Astro** 组件（`.astro`）可以包括多个框架的组件
:::

## 向框架组件传递字组件

在 Astro 组件中，你可以向框架组件传递子组件。每个框架都有自己的模式来引用这些子组件：React、Preact 和 Solid 均使用一个特殊的属性名 `children`，而 Svelte 和 Vue 则使用 `<slot />` 元素。


```astro
---
// src/pages/MyAstroPage.astro
import MyReactSidebar from '../components/MyReactSidebar.jsx';
---
<MyReactSidebar>
  <p>Here is a sidebar with some text and a button.</p>
</MyReactSidebar>
```

另外你可以使用[命名插槽](/zh-cn/core-concepts/astro-components/#命名插槽)来区分特定的子组件。

针对 React、Preact 和 Solid 的插槽都会转换成顶级属性。使用 `kebab-case` 的插槽名会转换成 `camelCase`。


```astro
---
// src/pages/MyAstroPage.astro
import MySidebar from '../components/MySidebar.jsx';
---
<MySidebar>
  <h2 slot="title">Menu</h2>
  <p>Here is a sidebar with some text and a button.</p>
  <ul slot="social-links">
    <li><a href="https://twitter.com/astrodotbuild">Twitter</a></li>
    <li><a href="https://github.com/withastro">GitHub</a></li>
  </ul>
</MySidebar>
```

```jsx
// src/components/MySidebar.jsx
export default function MySidebar(props) {
  return (
    <aside>
      <header>{props.title}</header>
      <main>{props.children}</main>
      <footer>{props.socialLinks}</footer>
    </aside>
  )
}
```

针对 Svelte 和 Vue 的插槽会使用 `<slot>` 元素进行引用。而使用 `kebab-case` 的插槽名会保留。

```jsx
// src/components/MySidebar.svelte
<aside>
  <header><slot name="title" /></header>
  <main><slot /></main>
  <footer><slot name="social-links" /></footer>
</aside>
```

## 嵌套框架组件

在 Astro 文件中，框架组件子项也是激活组件。这意味着你可以嵌套地使用这些框架组件。

```astro
---
// src/pages/MyAstroPage.astro
import MyReactSidebar from '../components/MyReactSidebar.jsx';
import MyReactButton from '../components/MyReactButton.jsx';
import MySvelteButton from '../components/MySvelteButton.svelte';
---

<MyReactSidebar>
  <p>Here is a sidebar with some text and a button.</p>
  <div slot="actions">
    <MyReactButton client:idle />
    <MySvelteButton client:idle />
  </div>
</MyReactSidebar>
```

:::caution
记住：框架组件文件（例如 `.jsx`、`.svelte`）不能混合多个框架。
:::

这使得你可以用喜欢的 JavaScript 框架中建立整个应用，并通过在 Astro 页面中使用父组件来渲染它们。

:::note
即使 Astro 组件包括激活框架组件，它也会被渲染成静态 HTML。这意味着，你只能传递不做任何 HTML 渲染的参数。在 Astro 组件中向框架组件传递 React 的“渲染参数”是行不通的，因为 Astro 组件无法提供该模式所需要的客户端运行时行为。所以它选择使用命名插槽。
:::

## 我可以给激活 Astro 组件吗？

如果你试图用 `client:` 修改器来激活 Astro 组件，你会看到错误行为。

[Astro 组件](/zh-cn/core-concepts/astro-components/)是纯 HTML 的模板组件，没有客户端运行时。但是，你可以在 Astro 组件模板中使用 `<script>` 标签，向浏览器发送在全局范围内执行的 JavaScript。

📚 了解更多关于 [Astro 组件中的客户端 `<script>`](/zh-cn/core-concepts/astro-components/#客户端脚本)的信息

[mdn-io]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
[mdn-ric]: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
[mdn-mm]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
