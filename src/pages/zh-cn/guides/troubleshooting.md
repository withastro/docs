---
layout: ~/layouts/MainLayout.astro
title: 故障排查
description: 需要帮助吗？卡在什么地方了？我们已经帮你解决了。
---

Astro 提供了几个不同的工具来帮助你排除故障和调试你的代码。

## 常见错误信息

下面是你在终端可能看到的一些常见错误信息，它们可能意味着什么，以及如何处理它们。

### 转化失败，出现 X 错误

这条信息经常出现，因为目前 Astro 要求导入和导出语句必须在 `.astro`文件顶层。

**解决方案**：把你的导入和导出语句写在你的组件脚本的顶部。

**状态**：现有限制，正在进行修复。

**不确定这是否是你的问题？**
检查一下是否有其他人报告过[这个问题](https://github.com/withastro/astro/issues?q=is%3Aissue+is%3Aopen+Transform+failed+with+*+error)!

### 不能在模块外使用导入语句

在 Astro 组件中，`<script> `标签会被挂起并默认作为 [JS 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)加载。如果你在标签中包含了 [`is:inline` 指令](/zh-cn/reference/directives-reference/#isinline)或任何其他属性，将不使用该行为。

**解决方案**：如果你在 `<script>` 标签中添加了任何属性，你也必须添加 `type="module"` 属性，以便能够使用导入语句。

**状态**：预期 Astro 行为。

**不确定这是你的问题？**
检查一下是否有其他人报告过[这个问题](https://github.com/withastro/astro/issues?q=is%3Aissue+is%3Aopen+Cannot+use+import+statement)!

### 无法渲染组件

这表示你已经导入并在你的Astro模板中使用的组件出现了错误。

#### 常见原因

这可能是由于在渲染时试图访问 `window` 或 `document` 对象造成的。默认情况下，Astro 会[同构](https://en.wikipedia.org/wiki/Isomorphic_JavaScript)渲染你的组件，这意味着它在浏览器运行时间不可用的服务器上运行。你可以使用 [`client:only` 指令](/zh-cn/reference/directives-reference/#clientonly)禁用预渲染步骤。

**解决方法**：尝试在渲染后访问这些对象（如 React 中的[`useEffect()`](https://reactjs.org/docs/hooks-reference.html#useeffect) 或 Vue 中的 [`onMounted()`](https://vuejs.org/api/composition-api-lifecycle.html#onmounted) 和 Svelte中的 [`onMount()`](https://svelte.dev/docs#run-time-svelte-onmount) ）。

**状态**：预期 Astro 行为。

#### 不是这个？

**解决方案**：检查你的 [Astro](/zh-cn/core-concepts/astro-components/) 或 [UI 框架](/zh-cn/core-concepts/framework-components/)组件的相应文档。考虑从 [astro.new](https://astro.new) 中打开 Astro 入门模板，并在最小的 Astro 项目中对组件进行故障排除。

**不确定这是你的问题？**
检查一下是否有其他人报告过[这个问题](https://github.com/withastro/astro/issues?q=is%3Aissue+is%3Aopen+Unable+to+render+Component)!


### 预期的默认导出

当试图导入或渲染无效组件，或无法正常工作的组件时，会出现这个错误。（该特定消息是因为 Astro 中导入 UI 组件方式造成的）

**解决办法**：尝试寻找你正在导入和渲染的任何组件的错误，并确保它工作正常。考虑从 [astro.new](https://astro.new) 打开 Astro 入门模板，并在最小的 Astro 项目中对组件进行故障排除。

**状态**：预期 Astro 行为。

## 常见问题

### 我的组件无法渲染

首先，检查你是否在 [`.astro` 组件脚本](/zh-cn/core-concepts/astro-components/#组件-script)或 [`.md` frontmatter](/zh-cn/guides/markdown-content/#在-markdown-中使用组件) 中**导入了该组件**。

然后检查你的导入语句。

- 你的导入链接到了错误的地方吗？（检查你的导入路径）

- 你的导入与导入的组件有名称相同吗？（检查你的组件名称和它是否[遵循 `.astro` 语法](/zh-cn/comparing-astro-vs-other-tools/#astro-vs-jsx)）

- 你在导入时是否包含了扩展名？（检查你导入的文件是否包含扩展名。例如：`.astro`、`.md`、`.jsx`、`.vue`）

### 我的组件没有互动

如果你的组件正在渲染（见上文），但对用户的交互没有反应，那么你可能缺少 [`client:*`指令](/zh-cn/reference/directives-reference/#client-directives) 来对组件进行激活。

默认情况下，[UI 框架组件在客户端不会激活](/zh-cn/core-concepts/framework-components/#hydrating-interactive-components) 。如果没有提供 `client:*` 指令，它的 HTML 将直接渲染到页面上，而无需 JavaScript。

::tip
[Astro 组件](/zh-cn/core-concepts/astro-components/)是纯 HTML 的模板组件，没有客户端运行时。但是，你可以在 Astro 组件模板中使用 `<script>` 标签，向浏览器传递要在全局范围内执行的 JavaScript。
:::

### 无法找到软件包 'X'

请参阅 [Astro 的集成指南](/zh-cn/guides/integrations-guide/)，了解关于向 Astro 添加框架渲染器、CSS 工具和其他包的说明。

你可能需要为一些集成安装对等依赖。如果你看到 `missing peer dependencies` 的警告，你可以按照[处理依赖](/zh-cn/guides/integrations-guide/#handling-integration-dependencies)的说明进行处理。

### `Astro.glob()` - 没有找到匹配项

当使用`Astro.glob()`导入文件时，请确保使用正确的glob语法，以匹配所有你需要的文件。

#### 文件路径

例如，在 `src/pages/index.astro` 中使用 `.../components/**/*.js` 来导入以下两个文件：
- `src/components/MyComponent.js`。
- `src/components/includes/MyOtherComponent.js`。

#### 支持的值

 `Astro.glob()` 不支持动态变量和字符串插值。

这不是 Astro 的错误。这是由于 [Vite 的 `import.meta.glob()` 函数](https://vitejs.dev/guide/features.html#glob-import)的限制，它只支持静态字符串字面量。

通常可以使用 `Astro.glob()` 导入包括所有你需要的文件集，然后对其进行过滤。

```astro
---
// src/components/featured.astro
const { postSlug } = Astro.props
const pathToMyFeaturedPost = `src/pages/blog/${postSlug}.md`

const posts = await Astro.glob('../pages/blog/*.md');
const myFeaturedPost = posts.find(post => post.file.includes(pathToMyFeaturedPost));
---

<p>
    Take a look at my favorite post, <a href={myFeaturedPost.url}>{myFeaturedPost.frontmatter.title}</a>!
</p>
```

### 和 Yarn 2+（Berry）一起使用 Astro

Yarn 2+，又名 Berry，使用名叫 [Plug'n'Play (PnP)](https://yarnpkg.com/features/pnp) 的技术来存储和管理 Node 模块，这在使用 `create-astro` 初始化新 Astro 项目或在使用 Astro 工作时可能[导致问题](https://github.com/withastro/astro/issues/3450)。解决办法是在 `yarnrc.yml` 中将 [`nodeLinker` 属性](https://yarnpkg.com/configuration/yarnrc#nodeLinker)设置为 `node-modules`。

```yaml
nodeLinker: "node-modules"
```

## 技巧和窍门

### 用 `console.log()` 调试

`console.log()`是一种简单但普遍的调试Astro代码的方法。你在哪里写`console.log`语句将决定你的调试输出被打印在哪里。

#### Frontmatter

在 Astro Frontmatter 中的 `console.log()` 语句总是输出到运行  Astro CLI 的 **终端**上。这是因为 Astro 运行在服务器上，而不是在浏览器上。

```astro
---
const sum = (a, b) => a + b;

// 示例：在命令行终端输出 "4"
console.log(sum(2, 2));
---
```

#### JS脚本

在Astro `<script>`标签内编写或导入的代码会在浏览器中运行。任何`console.log()`语句或其他调试输出将被打印到浏览器的控制台。

### 调试框架组件

[框架组件](/zh-cn/core-concepts/framework-components/)（如React 和 Svelte）是独特的。它们默认在服务器端渲染，这意味着 `console.log()` 的调试输出将在终端中可见。然而，在浏览器中它们也可能会被激活，这可能导致你的调试日志也出现在浏览器中。

这对于调试 SSR 输出和浏览器中的激活组件之间的差异非常有用。

### Astro `<Debug />` 组件

为了帮助你调试 Astro 组件，Astro 提供了内置 [`<Debug />`](/zh-cn/reference/api-reference/#debug-) 组件，你可以用它直接组件 HTML 模板中渲染任何值。这对于在浏览器中进行快速调试是很有用的，而不必在终端和浏览器之间来回来回。

```astro
---
import { Debug } from 'astro/components';
const sum = (a, b) => a + b;
---

<!-- 示例：在浏览器中输出 {answer: 6} -->
<Debug answer={sum(2, 4)} />
```

调试组件支持多种语法选项，使调试更加灵活和简明。

```astro
---
import { Debug } from 'astro/components';
const sum = (a, b) => a + b;
const answer = sum(2, 4);
---
<!-- 示例：三者等效-->
<Debug answer={sum(2, 4)} />
<Debug {{answer: sum(2, 4)}} />
<Debug {answer} />
```

## 需要更多帮助？

请在 [Discord](https://astro.build/chat) 上与我们交流，并在 `#support-threads` 频道中解释你的问题。我们很乐于提供帮助!

查看当前的 [Astro 中打开的 issues](https://github.com/withastro/astro/issues/)，看看你是否遇到了已知的问题，也可以提交错误报告。

你还可以访问 [RFC 讨论](https://github.com/withastro/rfcs/discussions/)，看看你是否发现了 Astro 的已知限制，并检查是否有与你的使用情况相关的提案。
