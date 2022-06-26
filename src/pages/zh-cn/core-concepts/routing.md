---
layout: ~/layouts/MainLayout.astro
title: 路由
description: 关于 Astro 路由的介绍。
---

Astro 使用**基于文件的路由**，它基于项目的 `src/pages` 目录中的文件结构来生成你的构建链接。当一个文件被添加到 `src/pages` 目录中，它将自动基于文件名生成与之对应的路由。

## 静态路由

`src/pages` 目录中的 Astro 组件（`.astro`）和 Markdown 文件（`.md`）将**自动成为网站页面**。每个页面的路由都和其在 `src/pages` 目录中的路径和文件名相对应。

```bash
# 示例：静态路由
src/pages/index.astro        -> mysite.com/
src/pages/about.astro        -> mysite.com/about
src/pages/about/index.astro  -> mysite.com/about
src/pages/about/me.astro     -> mysite.com/about/me
src/pages/posts/1.md         -> mysite.com/posts/1
```

:::tip
Astro 项目没有单独的路由配置。静态页面根据 `/src/pages/` 目录中的文件生成。
:::

## 动态路由

一个单独的 Astro 页面组件也可以在其文件名中指定动态路由参数，以生成符合给定条件的多个路由。你可以一次创建几个相关的页面，如作者页面，或为每个博客标签创建一个页面。命名参数允许你为这些路由设置给定值，而其余参数允许生成更灵活的全能路由。

:::note
动态创建的页面和路由会在构建时生成。
:::

Astro 页面创建动态路由必须：

1. 使用 `[bracket]` 标记来识别动态参数

2. 导出 `getStaticPaths()` 函数来明确要由 Astro 进行预渲染的路径。


### 命名参数

你可以通过向 `getStaticPaths()` 函数提供要使用的值来生成带有 `[named]` 参数的路由，如：


```astro
---
// src/pages/dogs/[dog].astro

export function getStaticPaths() {
  return [
    // Generates: /dogs/clifford
    {params: {dog: 'clifford'}},
    // Generates: /dogs/rover
    {params: {dog: 'rover'}},
    // Generates: /dogs/spot
    {params: {dog: 'spot'}},
  ];
}
---
```

📚 了解更多关于 [`getStaticPaths()`](/en/reference/api-reference/#getstaticpaths) 的信息。

路由可以根据在文件路径任一层级的多个参数生成：

- `pages/blog/[slug].astro` → (`/blog/hello-world`, `/blog/post-2`, etc.)
- `pages/[username]/settings.astro` → (`/fred/settings`, `/drew/settings`, etc.)
- `pages/[lang]-[version]/info.astro` → (`/en-v1/info`, `/fr-v2/info`, etc.)

#### `Astro.params` 对象

动态生成路由的 Astro 组件可以访问每个路由的 `Astro.params` 对象。这使得你可以在组件脚本和模板中使用那些生成的链接部分。

```astro
---
// Example: src/pages/posts/[id].astro
const { id } = Astro.params;
---
<p>Post: { id }</p>


// Astro.params object passed for the route `/post/abc`
{ "id": "abc" }
```


多个动态路由段可以结合起来以同样的方式工作。

```astro
---
// Example: src/pages/post/[id]/[comment].astro
const { id, comment } = Astro.params;
---

// Astro.params object passed for the route `/post/abc/a-comment`
{ "id": "abc", "comment": "a-comment" }
```

### 其他参数

如果你的链接路由需要更加灵活，你可以在 `.astro` 文件名中使用一个其他参数，作为任何深度的文件路径的通用集合，在括号内添加三个点（`...`）。

例如：

- `pages/post/[...slug].astro` → (`/post/a`, `/post/a/b`, `/post/a/b/c`, etc.)

匹配的参数将作为查询参数（例子中的 `slug`）传递给页面。

```json
// Astro.params object passed for the route `/post/a/b/c`
{ "slug": "a/b/c" }
```

:::tip
其他参数默认是可选的，所以 `pages/post/[...slug].astro` 也可以匹配 `/post/`。
:::

#### 示例：其他参数

一个真实示例，你可以用以下命名参数和其他参数来实现 GitHub 的文件查看器。

```
/[org]/[repo]/tree/[branch]/[...file]
```

在这个例子中，访问 `/withastro/astro/tree/main/docs/public/favicon.svg` 该页面将获得以下参数：

```js
{
	org: 'withastro',
	repo: 'astro',
	branch: 'main',
	file: 'docs/public/favicon.svg'
}
```

## 路由优先级顺序

一个链接可能匹配多个路由。例如下面的每个路由都会匹配 `/posts/create`。

```
└── pages/
│       ├── posts/
│       │   ├── create.astro
│       │   ├── [pid].astro
│       │   └── [...slug].astro

```

Astro 需要知道哪个路由应该被用来建立页面。为了做到这一点，它根据以下规则对它们进行排序。

- 没有路径参数的静态路由将优先于所有其他路由
- 使用命名参数的动态路由优先于其余参数
- 其他参数的优先级最低
- 平局则按字母顺序解决

鉴于上面的例子，下面是几个例子，说明规则如何将请求的URL与用于建立HTML的路由相匹配。

- `pages/posts/create.astro` - Will build `/posts/create`
- `pages/posts/[pid].astro` - Will build `/posts/1`, `/posts/abc`, etc. But not `/posts/create`
- `pages/posts/[...slug].astro` - Will build `/posts/1/2`, `/posts/a/b/c`, etc. But not `/posts/create`, `/posts/1`, `/posts/abc`

## 分页

Astro 支持内置分页，用于需要分割成多个页面的大型数据集合。Astro 会生成常见的分页属性，包括上一页/下一页链接、总页数，以及其他信息。

分页的路由名称应该使用与标准动态路由一样的 `[bracket]` 语法。例如，文件名 `/astronauts/[page].astro` 将生成 `/astronauts/1`、`/astronauts/2` 等路由，其中 `[page]` 是生成的页码。

你可以用 `paginate()` 函数根据数组值生成这些页面，像这样。

```astro
---
// Example: /src/pages/astronauts/[page].astro
export async function getStaticPaths({ paginate }) {
  const astronautPages = [{
    astronaut: 'Neil Armstrong',
  }, {
    astronaut: 'Buzz Aldrin',
  }, {
    astronaut: 'Sally Ride',
  }, {
    astronaut: 'John Glenn',
  }];
  // Generate pages from our array of astronauts, with 2 to a page
  return paginate(astronautPages, { pageSize: 2 });
}
// All paginated data is passed on the "page" prop
const { page } = Astro.props;
---

<!--Display the current page number. Astro.params.page can also be used!-->
<h1>Page {page.currentPage}</h1>
<ul>
  <!--List the array of astronaut info-->
  {page.data.map(({ astronaut }) => <li>{astronaut}</li>)}
</ul>
```

This generates the following pages, with 2 items to a page:
- `/astronauts/1` - Page 1: Displays "Neil Armstrong" and "Buzz Aldrin"
- `/astronauts/2` - Page 2: Displays "Sally Ride" and "John Glenn"


### `page` 参数

当你使用 `paginate()` 函数时，每个页面将通过 `page` 参数传递数据。`page` 参数有很多有用的属性，下面列出最为重要的：
- **page.data** - 数组，包含你传递给 `paginate()` 函数的页面的数据片段
- **page.url.next** - 链接到该集合中的下一个页面
- **page.url.prev** - 链接到集合中的上一个页面
 
```astro
---
// Example: /src/pages/astronauts/[page].astro
// Paginate same list of { astronaut } objects as the previous example
export async function getStaticPaths({ paginate }) { /* ... */ }
const { page } = Astro.props;
---
<h1>Page {page.currentPage}</h1>
<ul>
  {page.data.map(({ astronaut }) => <li>{astronaut}</li>)}
</ul>
{page.url.prev ? <a href={page.url.prev}>Previous</a> : null}
{page.url.next ? <a href={page.url.next}>Next</a> : null}
```


#### Complete API 参考

```ts
interface Page<T = any> {
	/** 结果 */
	data: T[];
	/** 元数据 */
	/** 第一个页面的序号，从 0 开始。 */
	start: number;
	/** 最后一个页面的序号，从 0 开始 */
	end: number;
	/** 结果总计数量 */
	total: number;
	/** 当前页面序号, 从 1 开始 */
	currentPage: number;
	/** 每个页面的项目数量（默认为 25) */
	size: number;
	/** 最后一页的序号 */
	lastPage: number;
	url: {
		/** 当前页面链接 */
		current: string;
		/** 前一页的链接（如果有） */
		prev: string | undefined;
		/** 下一页的链接（如果有） */
		next: string | undefined;
	};
}
```

## 嵌套分页

分页的一个更高级的用例是**嵌套分页**。当分页与其他动态路由参数相结合时，你可以使用嵌套式分页和一些属性或标签来将分页进行分类。

例如，如果你想通过一些标签来分组你的分页的 Markdown 帖子，你可以通过创建一个 `/src/pages/[tag]/[page].astro` 的页面来使用嵌套分页，该页面将匹配以下链接。

- `/red/1` (tag=red)
- `/red/2` (tag=red)
- `/blue/1` (tag=blue)
- `/green/1` (tag=green)

嵌套分页的工作方式是使用 `getStaticPaths()` 并返回每个分组的 `paginate()` 结果的数组。

在下面的例子中，我们将实现嵌套分页来建立上面列出的链接。

```astro
---
// Example: /src/pages/[tag]/[page].astro
export function getStaticPaths({paginate}) {
  const allTags = ['red', 'blue', 'green'];
  const allPosts = await Astro.glob('../../posts/*.md');
  // For every tag, return a paginate() result.
  // Make sure that you pass `{params: {tag}}` to `paginate()`
  // so that Astro knows which tag grouping the result is for.
  return allTags.map((tag) => {
    const filteredPosts = allPosts.filter((post) => post.frontmatter.tag === tag);
    return paginate(filteredPosts, {
      params: { tag },
      pageSize: 10
    });
  });
}
const { page } = Astro.props;
const params = Astro.params;
```
