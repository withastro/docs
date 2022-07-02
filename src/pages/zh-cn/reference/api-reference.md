---
layout: ~/layouts/MainLayout.astro
title: API 参考
---

## `Astro`

`Astro` 在所有 `.astro` 文件中均可用。它有以下功能：

### `Astro.glob()`

`Astro.glob()` 可以在静态网站 setup 中加载本地文件：

```astro
---
// ./src/components/my-component.astro
const posts = await Astro.glob('../pages/post/*.md'); // 返回 ./src/pages/post/*.md 的数组
---

<div>
{posts.slice(0, 3).map((post) => (
  <article>
    <h1>{post.frontmatter.title}</h1>
    <p>{post.frontmatter.description}</p>
    <a href={post.frontmatter.url}>Read more</a>
  </article>
))}
</div>
```

`.glob()` 只需要一个参数：你想导入的本地文件全局相对链接。它异步返回匹配文件的数组。

#### Markdown 文件

Markdown 文件有以下接口：

```ts
export interface MarkdownInstance<T extends Record<string, any>> {
  /* 在此文件的 YAML frontmatter 中指定的任何数据 */
 frontmatter: T;
  /* 该文件的文件路径 */
 file: string;
  /* 该文件的渲染路径 */
 url: string | undefined;
  /* 渲染此文件内容的 Astro 组件 */
 Content: AstroComponent;
  /* 返回该文件中 h1...h6 元素数组的函数 */
 getHeaders(): Promise<{ depth: number; slug: string; text: string }[]>;
}
```

你可以选择使用 TypeScript 泛型指定 `frontmatter` 变量类型：

```astro
---
interface Frontmatter {
  title: string;
  description?: string;
}
const posts = await Astro.glob<Frontmatter>('../pages/post/*.md');
---

<ul>
  {posts.map(post => <li>{post.title}</li>)}
</ul>
```

#### Astro 文件

Astro 文件有以下接口：

```ts
export interface AstroInstance {
 default: AstroComponent;
}
```

#### 其他文件

其他文件可能有各种不同的接口，但 `Astro.glob()` 均接受 TypeScript 泛型，如果你明确知道未被识别的文件类型包含些什么：

```ts
---
interface CustomDataFile {
  default: Record<string, any>;
}
const data = await Astro.glob<CustomDataFile>('../data/**/*.js');
---
```

### `Astro.request`

`Astro.request` 是标准的 [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 对象。它可以用来获取请求的 `url`、`headers'、`method`，甚至是`body`。可以使用`new URL(Astro.request.url)` 来获得链接对象。

```astro
---
const url = new URL(Astro.request.url);
---
<h1>Origin {url.origin}</h1>
```

### `Astro.response`

`Astro.response` 是标准的 [ResponseInit](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#init)对象。它用于设置页面响应中的 `status`、`statusText` 和 `headers`

```astro
---
if(condition) {
  Astro.response.status = 404;
  Astro.response.statusText = 'Not found';
}
---
```

或者设置 header：

```astro
---
Astro.response.headers.set('Set-Cookie', 'a=b; Path=/;');
---
```

### `Astro.canonicalURL`

当前页面的[规范链接][canonical]。如果设置了 `site` 选项，网站的源将是该链接的源。

你也可以使用 `canonicalURL` 来获取当前页面的 `pathname`。

```astro
---
const path = Astro.canonicalURL.pathname;
---

<h1>Welcome to {path}</h1>
```

### `Astro.site`

`Astro.site` 返回根据 Astro 配置中的 `.site` 生成的 `URL`。如果没指定，将返回根据 `localhost` 生成的链接。

### `Astro.slots`

`Astro.slots` 包含修改 Astro 组件插槽的实用函数。

| 名称     | 类型                                              | 描述                      |
| :------- | :------------------------------------------------ | :------------------------ |
| `has`    | `(name: string) => boolean`                       | 此插槽是否存在内容        |
| `render` | `(name: string, args?: any[]) => Promise<string>` | 异步渲染该插槽并返回 HTML |

```astro
---
let html: string = '';
if (Astro.slots.has('default')) {
  html = await Astro.slots.render('default')
}
---
<Fragment set:html={html} />
```
<!-- Waiting for bug fix from Nate; reformat CAREFULLY when un-uncommenting out!

`Astro.slots.render` optionally accepts a second argument, an array of parameters that will be forwarded to any function children. This is extremely useful for custom utility components.

Given the following `Message.astro` component...

tick tick tick astro
---
let html: string = '';
if (Astro.slots.has('default')) {
  html = await Astro.slots.render('default', Astro.props.messages)
}
---
<Fragment set:html={html} />
```

You could pass a callback function that renders our the message:

tick tick tick astro
<div><Message messages={['Hello', 'world!']}>{(messages) => messages.join(' ')}</Message></div>
 renders as // make this a code comment again
<div>Hello world!</div>
```
-->

### `Astro.self`

`Astro.self` 允许 Astro 组件被递归调用。这使得你可以通过在组件模板中使用 `<Astro.self>` 从自身内部渲染 Astro 组件。这对迭代大型数据存储和嵌套数据结构很有帮助。

```astro
---
// NestedList.astro
const { items } = Astro.props;
---
<ul class="nested-list">
  {items.map((item) => (
    <li>
      <!-- 如果有嵌套的数据结构，将渲染 `<Astro.self>` -->
      <!-- 并可以通过递归调用来传递参数 -->
      {Array.isArray(item) ? (
        <Astro.self items={item} />
      ) : (
        item
      )}
    </li>
  ))}
</ul>
```

然后，这个组件可以这样用：

```astro
---
import NestedList from './NestedList.astro';
---
<NestedList items={['A', ['B', 'C'], 'D']} />
```

并渲染这样的 HTML：

```html
<ul class="nested-list">
  <li>A</li>
  <li>
    <ul class="nested-list">
      <li>B</li>
      <li>C</li>
    </ul>
  </li>
  <li>D</li>
</ul>
```

## `getStaticPaths()`

如果页面在文件名中使用动态参数，该组件将需要导出一个 `getStaticPaths()` 函数。

必须要有该函数，因为 Astro 是静态站点生成器。这意味着整个网站是预构建的。如果 Astro 不知道在构建时生成什么页面，你的用户在访问你的网站时就看不到它。

```astro
---
export async function getStaticPaths() {
  return [
    { params: { /* required */ }, props: { /* optional */ } },
    { params: { ... } },
    { params: { ... } },
    // ...
  ];
}
---
<!-- Your HTML template here. -->
```

`getStaticPaths()` 函数应该返回对象数组，以确定哪些路径会被 Astro 预渲染。

:::caution
`getStaticPaths()` 函数在会任何页面加载之前，在它自己的隔离范围内执行一次。因此，除了文件导入之外，你不能从它的父作用域中引用任何东西。如果你违反了这个要求，编译器会发出警告。
:::

### `params`

每个返回对象的 `params` 键都会告诉 Astro 要建立什么路径。返回参数必须映射到你的组件文件路径中定义的动态参数和其余参数。

`params` 被编码到链接中，所以只能由字符串和数字。每个 `params` 对象的值必须与页面名称中使用的参数一致。

比如说有 `src/pages/posts/[id].astro` 页面。如果你从这个页面导出 `getStaticPaths` 并返回以下的路由：

```astro
---
export async function getStaticPaths() {
  return [
    { params: { id: '1' } },
    { params: { id: '2' } },
    { params: { id:  3  } }  // 也可以是数字！
  ];
}

const { id } = Astro.params;
---
<h1>{id}</h1>
```

然后 Astro 会在构建时静态地生成 `posts/1`、`posts/2` 和 `posts/3`。

### 通过 `props` 传递数据

为了给每个生成的页面传递额外的数据，你也可以在每个返回的路径对象上设置 `props` 值。与 `params` 不同的是，`props` 没有被编码到链接中，所以并不局限于字符串。

例如，假设你根据从远程 API 获取的数据来生成页面。你可以将完整的数据对象传递给 `getStaticPaths` 中的页面组件。

```astro
---
export async function getStaticPaths() {
  const data = await fetch('...').then(response => response.json());

  return data.map((post) => {
    return {
      params: { id: post.id },
      props: { post },
    };
  });
}

const { id } = Astro.params;
const { post } = Astro.props;
---
<h1>{id}: {post.name}</h1>
```

你也可以传递普通数组，这在生成或缓存已知路径列表时可能会有帮助。

```astro
---
export async function getStaticPaths() {
  const posts = [
    {id: '1', category: "astro", title: "API Reference"},
    {id: '2', category: "react", title: "Creating a React Counter!"}
  ];
  return posts.map((post) => {
    return {
      params: { id: post.id },
      props: { post }
    };
  });
}
const {id} = Astro.params;
const {post} = Astro.props;
---
<body>
  <h1>{id}: {post.title}</h1>
  <h2>Category: {post.category}</h2>
</body>
```

然后 Astro 将在构建时使用 `pages/posts/[id].astro` 中的页面组件静态地生成 `posts/1` 和 `posts/2`。页面可以使用 `Astro.props` 引用这些数据。

### `paginate()`

分页是 Astro 通过 `paginate()` 函数原生支持网站的常见用例。`paginate()` 将自动生成数组，从`getStaticPaths()`返回，为分页集合的每个页面创建一个URL。页面编号将作为参数传递，而页面数据将作为`page`道具传递。

```js
export async function getStaticPaths({ paginate }) {
  // 用 fetch()、Astro.glob() 等加载你的数据
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=150`);
  const result = await response.json();
  const allPokemon = result.results;

  // 返回包含分页的所有帖子的路由集合
  return paginate(allPokemon, { pageSize: 10 });
}

// 如果设置正确，现在页面已经具备了渲染单页所需的一切参数（见下一节）。
const { page } = Astro.props;
```

`paginate()`：假定文件名为 `[page].astro` 或 `[...page].astro`。`page` 参数将是链接中的页数。

- `/posts/[page].astro`：会产生 `/posts/1`、`/posts/2`、`/posts/3` 等链接。
- `/posts/[...page].astro`：将产生 `/posts`、`/posts/2`
`/posts/3` 等链接。

#### `page` 分页参数

分页会给每个渲染的页面传递 `page` 参数，代表分页集合中的单页数据。这包括你分页的数据（`page.data`）以及该页的元数据（`page.url`、`page.start`、`page.end`、`page.total` 等）。这些元数据对诸如“下一页”按钮或“显示 100 个中前十个”的信息很有用。

| 名称               |         类型          | 描述                                                                                                         |
| :----------------- | :-------------------: | :----------------------------------------------------------------------------------------------------------- |
| `page.data`        |        `Array`        | 从 `data()` 中返回当前页面数据数组                                                                           |
| `page.start`       |       `number`        | 当前页第一个项目的索引，从 `0` 开始（例如，如果 `pageSize: 25`，第一页该值未 `0`，第二页为`25`，以此类推）。 |
| `page.end`         |       `number`        | 当前页面最后一个项目的索引                                                                               |
| `page.size`        |       `number`        | 每个页面有多少项目                                                                                        |
| `page.total`       |       `number`        | 所有项目的总数量                                                                                    |
| `page.currentPage` |       `number`        | 当前页码，从 `1` 开始                                                                                        |
| `page.lastPage`    |       `number`        | 总页数                                                                                   |
| `page.url.current` |       `string`        | 获取当前页面的链接（对规范链接很有用）。                                                  |
| `page.url.prev`    | `string \| undefined` | 获取上一页链接（如果在首页，将是`undefined`）。.                                         |
| `page.url.next`    | `string \| undefined` | 获取下一页链接（如果没有更多的页面，将是`undefined`）                                         |

### `rss()`

RSS馈送是Astro原生支持的另一个常见用例。调用`rss()`函数为你的项目生成一个`/rss.xml`feed，使用你为这个页面加载的相同数据。这个文件的位置可以自定义（见下文）。

```js
// 示例：/src/pages/posts/[...page].astro
// 把该函数放在 Astro 组件脚本中
export async function getStaticPaths({rss}) {
  const allPosts = Astro.glob('../post/*.md');
  const sortedPosts = allPosts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  // 根据集合生成 RSS 摘要
  rss({
    // RSS 摘要的标题、描述和自定义元数据
    title: 'Don’s Blog',
    description: 'An example blog on Astro',
    customData: `<language>en-us</language>`,
    // 排序后的 RSS 摘要的项目列表
    items: sortedPosts.map(item => ({
      title: item.frontmatter.title,
      description: item.frontmatter.description,
      link: item.url,
      pubDate: item.frontmatter.fetdate,
    })),
    // 可选，自定义文件输出位置
    // 默认为 "/rss.xml"
    dest: "/my/custom/feed.xml",
  });

  // 返回分页中所有帖子的路由集合
  return [ ... ];
}
```

```ts
// rss() 函数参数的完整类型定义。
interface RSSArgument {
  /** （必需）RSS 摘要标题 */*.
  title: string;
  /** （必需）RSS 摘要描述 */
  description: string;
  /** 在 <xml> 标签上指定任意的元数据 */ 。
  xmlns?: Record<string, string>;
  /** 在打开文件时指定自定义数据 *//
  customData?: string;
  /**
   * 指定 RSS xml 文件写入位置
   * 相对于最终构建目录。例如：'/foo/bar.xml'
   * 默认为 '/rss.xml'
   */
  dest?: string;
  /** 返回关于每个项目的数据 */
  items: {
    /**（必需）项目标题 */
    title: string;
    /** （必需）项目链接 */
    link: string;
    /** 项目的发布日期 */
    pubDate?: Date;
    /** 项目描述 */
    description?: string;
    /** 附加其他 XML 数据 */ 。
    customData?: string;
  }[];
}
```

## `import.meta`

所有 ESM 模块都包含 `import.meta` 属性。Astro 基于 [Vite](https://vitejs.dev/guide/env-and-mode.html) 增加了 `import.meta.env`。

**`import.meta.env.SSR`** 可以用来了解服务器上渲染时长。有时你可能想要不同的逻辑，例如，某个组件应该只在客户端渲染。

```jsx
import { h } from 'preact';

export default function () {
  return import.meta.env.SSR ? <div class="spinner"></div> : <FancyComponent />;
}
```

## 内置组件

Astro 包括几个内置的组件供你在你的项目中使用。在 `.astro` 文件中可以通过 `import {} from 'astro/components';` 引用所有的内置组件。

### `<Markdown />`

:::caution[废弃]
无法在 SSR 中使用 `<Markdown />` 组件，它也将在 v1.0 发布前将迁移至独立包中。可以考虑用[导入 Markdown 内容](/zh-cn/guides/markdown-content/#导入-markdown)来代替。
:::

```astro
---
import { Markdown } from 'astro/components';
---
<Markdown>
  # Markdown syntax is now supported! **Yay!**
</Markdown>
```

参见我们的 [Markdown 指南](/zh-cn/guides/markdown-content/)以获得更多信息。

<!-- TODO: We should move some of the specific component info here. -->

### `<Code />`

```astro
---
import { Code } from 'astro/components';
---
<!-- 使用语法凸显部分 JavaScript 代码-->
<Code code={`const foo = 'bar';`} lang="js" />
<!-- 可选：定制你的主题 -->
<Code code={`const foo = 'bar';`} lang="js" theme="dark-plus" />
<!-- 可选：启用文字包装 -->
<Code code={`const foo = 'bar';`} lang="js" wrap />
```

该组件在构建时为代码块提供语法高亮（不包括客户端 JavaScript）。该组件由 Shiki 驱动，它支持所有流行的[主题](https://github.com/shikijs/shiki/blob/main/docs/themes.md)和[语言](https://github.com/shikijs/shiki/blob/main/docs/languages.md)。另外，你可以通过给 `theme` 和 `lang` 传递自定义主题和语言分别添加它们。

### `<Prism />`

```astro
---
import { Prism } from '@astrojs/prism';
---
<Prism lang="js" code={`const foo = 'bar';`} />
```

:::caution[Deprecated]
**`@astrojs/prism`** 将来会被提取到独立、可安装包中。
:::

这个组件通过应用 Prism 的 CSS 类为代码块提供特定语言的语法高亮。注意，**你需要提供 Prism 的 CSS 样式表**（或用自己的），以启用语法高亮! 参见 [Prism 配置部分](/zh-cn/guides/markdown-content/#prism-配置)了解更多细节。

参见 [Prism 支持的语言列表](https://prismjs.com/#supported-languages)，在那里你可以找到一种语言的对应别名。而且，你也可以用 `lang="astro"` 来展示 Astro 代码块!

### `<Debug />`

```astro
---
import { Debug } from 'astro/components';
const serverObject = {
  a: 0,
  b: "string",
  c: {
    nested: "object"
  }
}
---
<Debug {serverObject} />
```

这个组件提供了无需 JavaScript 在客户端检查数值的方法。

[canonical]: https://en.wikipedia.org/wiki/Canonical_link_element
