---
layout: ~/layouts/MainLayout.astro
title: 模板指令参考
---

**模板指令**是特殊的 HTML 属性，它可以在任一 Astro 组件模板（`.astro` 文件）中使用。

模板指令用某种方式控制元素或组件行为。模板指令可以启用一些编译器功能，使你的生活更轻松（比如使用 `class:list` 而不是 `class`）。指令也可以让 Astro 编译器对该组件进行特殊处理（比如使用 `client:load` 激活组件）。

本页描述了 Astro 中所有可用的模板指令及其工作方式。

## 规则

有效的模板指令需要:

- 在其名称中包括冒号 `:`，使用 `X:Y` 的形式（例如：`client:load`）。
- 对编译器可见（例如：`<X {...attr}>`，如果 `attr` 包含了指令，则不会工作）。

部分模板指令，可以传递自定义值：

- `<X client:load />`（无法传递值）
- `<X class:list={['some-css-class']} />`（传递数组）

模板指令永远不会直接包含在组件的最终 HTML 输出中。

## 通用指令

### `class:list`

`class:list={...}` 接收 class 数组，并将其转换为 class 字符串。这是受流行的 @lukeed [clsx](https://github.com/lukeed/clsx)辅助库的启发，但直接内置在 Astro 里。

`class:list` 接收数组，其中有几种不同的可能值：

- `string`：添加到 `class` 元素
- `Object`：添加到键值对到 `class` 元素
- `Array`：扁平化
- `Set`：扁平化

```astro
<!-- 原先 -->
<span class:list={[ 'hello goodbye', { hello: true, world: true }, new Set([ 'hello', 'friend' ]) ]} />
<!-- 输出 -->
<span class="hello goodbye world friend"></span>
```

它会自动删除重复值。

### `set:html`

`set:html={string}` 将 HTML 字符串注入元素中，类似于设置 `el.innerHTML`。

**该值不会被 Astro 自动转义！**请确保你信任该值，或者在传递给模板前对其进行手动转义。忘记这样做可能会使你受到[跨网站脚本（XSS）攻击](https://owasp.org/www-community/attacks/xss/)。

```astro
---
const rawHTMLString = "Hello <strong>World</strong>"
---
<h1>{rawHTMLString}</h1>
  <!-- 输出：<h1>Hello &lt;strong&gt;World&lt;/strong&gt;</h1> -->
<h1 set:html={rawHTMLString} />
  <!-- 输出：<h1>Hello <strong>World</strong></h1> -->
```

你也可以在 `<Fragment>` 上使用 `set:html` 来避免添加不必要的包装元素。这在从 CMS 获取 HTML 时特别有用。

```astro
---
const cmsContent = await fetchHTMLFromMyCMS();
---
<Fragment set:html={cmsContent}>
```

### `set:text`

`set:text={string}` 将文本字符串注入元素中，类似于设置 `el.innerText`。与 `set:html` 不同的是，传递的 `string` 值会被 Astro 自动转义。

这相当于直接将变量传入模板表达式（例如：`<div>{someText}</div>`），因此这个指令并不不常用。

## 客户端指令

这些指令描述了如何激活 [UI 框架组件](/zh-cn/core-concepts/framework-components/)。

默认情况下，UI 框架组件不会在客户端激活。如果没有 `client:*` 指令，它的 HTML 将被渲染到页面上，而无需 JavaScript。

### `client:load`

- **优先级**：高
- **适用于**：立即可见的UI元素，需要尽快进行互动。

在页面加载时，立即加载并激活组件的 JavaScript。

```astro
<BuyButton client:load />
```

### `client:idle`

- **优先级**：中
- **适用于**：优先级较低的 UI 元素，不需要立即进行互动。

一旦页面完成了初始加载，并触发 `requestIdleCallback` 事件，就会加载并激活组件中的 JavaScript。如果你所在的浏览器不支持 [`requestIdleCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)，那么就会使用文档 [`load`](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event) 事件。

```astro
<ShowHideButton client:idle />
```

### `client:visible`

- **优先级**：低
- **适用于**：低优先级 UI 元素，这些元素要么在页面的下方（折叠中），要么加载时非常耗费资源，如果用户没有看到这些元素，你宁愿不加载它们。

一旦组件进入用户的视口，就加载组件的 JavaScript 并使其激活。这在其内部使用 `IntersectionObserver` 来跟踪无障碍。

```astro
<HeavyImageCarousel client:visible />
```

### `client:media`

- **优先级**：低
- **适用于**：侧边栏折叠或其他可能只在某些屏幕尺寸上可见的元素。

`client:media={string}` 一旦满足一定的 CSS 媒体查询条件，就会加载并激活组件的 JavaScript。

:::note
如果该组件在 CSS 中已隐藏，只在满足媒体查询条件时显示，那么只需使用 `client:visible` 就行，而不必传递相同的媒体查询给指令。
:::

```astro
<SidebarToggle client:media="(max-width: 50em)" />
```

### `client:only`

`client:only={string}` **跳过** HTML 服务端渲染，只在客户端进行渲染。它的作用类似于 `client:load`，它在页面加载时立即加载、渲染和润色组件。

**你必须正确传递组件所用框架！**因为 Astro 不会在构建过程中/在服务器上运行该组件，Astro 不知道你的组件使用什么框架，除非你明确告诉它。

```astro
<SomeReactComponent client:only="react" />
<SomePreactComponent client:only="preact" />
<SomeSvelteComponent client:only="svelte" />
<SomeVueComponent client:only="vue" />
<SomeSolidComponent client:only="solid-js" />
```

## 脚本和样式指令

这些指令只能用于 HTML 的 `<script>` 和 `<style>` 标签，以控制客户端 JavaScript 和 CSS 在页面上的处理方式。

### `is:global`

默认情况下，Astro 会自动将 `<style>` CSS 规则扩展到组件上。你可以用 `is:global` 指令禁用该行为。

`is:global` 使 `<style>` 标签的内容在包含该组件的页面上全面应用。这使得 Astro 的 CSS 作用域系统失效。这相当于用 `:global()` 来包装 `<style>` 标签内的所有选择器。

你可以在组件中同时使用 `<style>` 和 `style is:global>`，创建一些全局样式规则，同时仍对大部分组件 CSS 进行作用域控制。

📚 有关全局样式工作的更多细节，请参见[样式 & CSS](/zh-cn/guides/styling/#全局样式)页面。

```astro
<style is:global>
  body a { color: red; }
</style>
```

### `is:inline`

默认情况下，Astro 会处理、压缩和捆绑它在页面上看到的任何 `<script>` 和 `<style>` 标签。你可以用 `is:inline` 指令禁用该行为。

`is:inline` 可以让 Astro 将 `<script>` 或 `<style>` 标签原封不动地留在最终输出的 HTML 中。这些内容将不会被处理、压缩或捆绑。它限制了 Astro 的一些功能，比如导入 npm 包或使用像 Sass 这样的 CSS 编译语言。

`is:inline` 指令意味着 `<style>` 和 `<script>` 标签。

- 不会被捆绑到外部文件中。
- 不会被重复使用——该元素会在渲染时出现多次。
- 它的 `import`/`@import`/`url()` 引用不基于 `.astro` 文件地址进行解析。
- 将进行预处理，例如 `<style lang="sass">` 属性仍将生成纯 CSS。
- 将在最终输出的 HTML 中准确地呈现它所编写的位置。
- 样式将是全局性的，而不是对组件的范围。

:::caution
只要在 `<script>` 或 `<style>` 标签上使用除 `src` 以外的任何属性，就相当于使用 `is:inline` 指令。
:::

```astro
<style is:inline>
  /* 行内：不支持相对导入和 npm 包导入 */
  @import '/assets/some-public-styles.css';
  span { color: green; }
</style>

<script is:inline>
  /* 行内：不支持相对导入和 npm 包导入 */
  console.log('I am inlined right here in the final output HTML.');
</script>
```

📚 查看[客户端脚本](/zh-cn/corecepts/astro-components/#client-side-scripts)如何在 Astro 组件中工作。

### `define:vars`

`define:vars={...}` 可以将服务器端的变量从组件 frontmatter 传递给客户端的 `<script>` 或 `<style>`。支持任何**可序列化的**前端变量，包括通过 `Astro.props` 传递给组件的参数。

```astro
---
const foregroundColor = "rgb(221 243 228)";
const backgroundColor = "rgb(24 121 78)";
const message = "Astro is awesome!";
---
<style define:vars={{ textColor: foregroundColor, backgroundColor }}>
  h1 {
    background-color: var(--backgroundColor);
    color: var(--textColor);
  }
</style>

<script define:vars={{ message }}>
  alert(message);
</script>
```

:::caution
在 `<script>` 或 `<style>` 标签上使用 `define:vars` 相当于使用 [`is:inline` 指令](#isinline)，这意味着脚本或样式不会被捆绑，将直接内联到 HTML 中。
:::

## 高级指令

### `is:raw`

`is:raw` 会让 Astro 编译器将该元素的任何子项都视为文本。这意味着该组件中所有特殊的 Astro 模板语法都不会生效。

内部使用 `<Markdown />` 组件。

例如，如果你有一个自定义的 Katex 组件，它将一些文本转换为 HTML，你可以这样做：

```astro
---
import Katex from '../components/Katex.astro';
---
<Katex is:raw>Some conflicting {syntax} here</Katex>
```
