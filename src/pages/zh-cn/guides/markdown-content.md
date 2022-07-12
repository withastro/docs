---
layout: ~/layouts/MainLayout.astro
title: Markdown
description: 在 Astro 中使用 Markdown
---

Markdown 内容通常用于创作长文本内容，例如博客文章和文档。Astro 内置了 Markdown 支持并增加了一些功能，例如在 Markdown 中支持 JavaScript 表达式和 Astro 组件。

## Markdown 页面

Astro 将 `/src/pages` 目录中的任一 `.md` 文件视为一个页面。将文件放在此目录或其的任何一个子目录中，则将用文件的路径名自动构建页面路由。

📚 阅读更多关于 Astro 的[基于文件的路由](/zh-cn/core-concepts/routing/)。

### 基本示例

在 Astro 中使用 Markdown 的最简单方法就是在项目中创建一个 `src/pages/index.md` 主页路由。然后再将下面的基本模板复制到你的项目中，这样你就可以在项目主页路径中查看渲染后的 HTML。通常是 [http://localhost:3000/](http://localhost:3000/)。

```markdown
---
# 示例：src/pages/index.md
title: Hello, World
---

# Hi there!

This is your first markdown page. It probably isn't styled much, although
Markdown does support **bold** and _italics._

To learn more about adding a layout to your page, read the next section on **Markdown Layouts.**
```

### Markdown 布局

Markdown 页面有一个用于指定 `layout` 的特殊 frontmatter 属性，它定义了 Astro [布局组件](/zh-cn/core-concepts/layouts/)的相对路径。该组件将包装你的 Markdown 内容，提供页面骨架和任何其他包含的页面模板元素。

```markdown
---
layout: ../layouts/BaseLayout.astro
---
```

Markdown 页面指定布局的方式有：

1. 通过 content 属性访问 Markdown 页面的 frontmatter 数据。
2. [`<slot />`](/zh-cn/core-concepts/astro-components/#插槽) 将指定 Markdown 内容的默认显示位置。

```astro
---
// src/layouts/BaseLayout.astro
// 1. The content prop gives access to frontmatter data
const { content } = Astro.props;
---
<html>
  <head>
    <!-- Add other Head elements here, like styles and meta tags. -->
    <title>{content.title}</title>
  </head>
  <body>
    <!-- Add other UI components here, like common headers and footers. -->
    <h1>{content.title} by {content.author}</h1>
    <!-- 2. Rendered HTML will be passed into the default slot. -->
    <slot />
    <p>Written on: {content.date}</p>
  </body>
</html>
```

`content` 属性还包含一个 `astro` 属性，其中包含有关页面的其他元数据，例如完整的 Markdown `source` 和 `headers` 对象。

一个示例博客文章 `content` 对象，类似于下方示例：

```json
{
  /** Frontmatter from a blog post
  "title": "Astro 0.18 Release",
  "date": "Tuesday, July 27 2021",
  "author": "Matthew Phillips",
  "description": "Astro 0.18 is our biggest release since Astro launch.",
  "draft": false,
  "keywords": ["astro", "release", "announcement"]
  **/
  "astro": {
    "headers": [
      {
        "depth": 1,
        "text": "Astro 0.18 Release",
        "slug": "astro-018-release"
      },
      {
        "depth": 2,
        "text": "Responsive partial hydration",
        "slug": "responsive-partial-hydration"
      }
      /* ... */
    ],
    "source": "# Astro 0.18 Release\nA little over a month ago, the first public beta [...]"
  },
  "url": ""
}
```

> 💡 `content` 属性中的 `astro` 和 `url` 是唯一受到 Astro 保护的属性。对象的其余部分则由你的 frontmatter 变量定义。

### 使用 Frontmatter 属性

任何 Astro 组件（不仅仅是布局！）都可以将 Markdown frontmatter 中定义的值作为属性。你可以使用 YAML frontmatter 指定各种类型的数据，并从每篇博客文章中获取整个 Astro 网站中使用的更丰富的元信息。

如上所述，就像在布局中一样，在任何 `.astro` 文件中都可以使用它们。

### 标题 ID

Astro 将使用 [github-slugger](https://github.com/Flet/github-slugger) 为 Markdown 文件中的所有标题自动生成 id。但是如果指定了自定义 id 不会被覆盖。

这些 id 会在所有其他插件执行后添加，因此如果你有像 `rehype-toc` 这样需要用到 id 的插件，你应该自行添加 slugging 插件（例如 `rehype-slug`）。

### Markdown 草稿

`draft: true` 是一个可选的 frontmatter 值，它将标记单个 `.md` 页面或发布为“未发布”。默认情况下，站点构建时会排除该页面。

没有 `draft` 属性或带有 `draft: false` 的 Markdown 页面不受影响，将包含在最终构建中。

```markdown
---
# src/pages/post/blog-post.md
layout: ../../layouts/BaseLayout.astro
title: My Blog Post
draft: true
---

This is my in-progress blog post.

No page will be built for this post.

To build and publish this post:

- update the frontmatter to `draft: false` or
- remove the `draft` property entirely.
```

> ⚠️ 虽然设置了 `draft: true`，你的站点就不会生成该页面路由，但 `Astro.glob()` 仍会返回**你所有的 Markdown 文件**。

不想在帖子存档或最新帖子列表中显示，则要在数据（例如标题、链接、描述）中排除草稿，所以请确保你的 `Astro.glob()` 函数也**过滤了全部草稿**。

⚙️ 如果想要在构建时生成草稿页面：

在 `astro.config.mjs` 中的 `markdown` 添加 `drafts: true`

```js
// astro.config.mjs
export default defineConfig({
  markdown: {
    drafts: true,
  },
});
```

💡 你还可以给 `astro build` 传递 `--drafts` 标志来构建草稿页面！

## 增强 Markdown

除了支持标准 Markdown 语法外，Astro 对其进行了扩展以使你的内容更具表现力。以下是一些仅限于 Astro 中的 Markdown 功能。

### 在 Markdown 中使用变量

frontmatter 变量可以直接在 Markdown 中用 `frontmatter` 对象属性使用。

```markdown
---
author: Leon
age: 42
---

# About the Author

{frontmatter.author} is {frontmatter.age} and lives in Toronto, Canada.
```

### 在 Markdown 中使用组件

你可以在 Markdown 文件使用 `setup` 导入组件并一起使用。`frontmatter` 对象也可用于导入的组件。

```markdown
---
layout: ../layouts/BaseLayout.astro
setup: |
  import Author from '../../components/Author.astro'
  import Biography from '../components/Biography.jsx'
author: Leon
---

<Author name={frontmatter.author}/>
<Biography client:visible>
  {frontmatter.author} lives in Toronto, Canada and enjoys photography.
</Biography>
```

## 导入 Markdown

你可以将 Markdown 文件直接导入到你的 Astro 文件中！你可以用 `import` 导入单个指定页面，也可以使用 `Astro.glob()` 导入多个指定页面。

```astro
---
// Import some markdown. Dynamic import() is also supported!
import * as greatPost from '../pages/post/great-post.md';

// Also, you can import multiple files with Astro.glob
const posts = await Astro.glob('../pages/post/*.md');
---

Great post: <a href={greatPost.url}>{greatPost.frontmatter.title}</a>

<ul>
  {posts.map(post => <li>{post.frontmatter.title}</li>)}
</ul>
```

每个 Markdown 文件都导出以下属性：

- `frontmatter`：此文件的 YAML frontmatter 中指定的任何数据。
- `file`：此文件的绝对路径（例如 `/home/user/projects/.../file.md`）。
- `url`：如果是页面，则为页面的 URL（例如 `/en/guides/markdown-content`）。
- `getHeaders()`：返回 Markdown 文件标题的异步函数。 响应遵循这种类型：`{ depth: number; 蛞蝓：字符串； 文本：字符串}[]`。
- `Content`：渲染 Markdown 文件内容的组件。以下是个示例：

  ```astro
  ---
  import {Content as PromoBanner} from '../components/promoBanner.md';
  ---

  <h2>Today's promo</h2>
  <PromoBanner />
  ```

你可以选用 TypeScript 泛型为 `frontmatter` 变量提供类型：

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
  <!-- post.title will be `string`! -->
</ul>
```

## Markdown 组件

> 注意：`<Markdown />` 组件在 SSR 中没有，且可能会在 v1.0 中被删除。尽可能避免使用它。要在模板中使用 Markdown，请使用单独的 `.md` 文件，然后用 [`import` Markdown](/zh-cn/guides/markdown-content/#导入-markdown) 将其作为组件添加到模板中。

你可以在你的组件脚本中导入[内置 Astro Markdown 组件](/zh-cn/reference/api-reference/#markdown-)，然后在 `<Markdown></Markdown>` 标签之间写下你想要的 Markdown 内容。

````astro
---
import { Markdown } from 'astro/components';
import Layout from '../layouts/Layout.astro';

const expressions = 'Lorem ipsum';
---
<Layout>
  <Markdown>
    # Hello world!

    **Everything** supported in a `.md` file is also supported here!

    There is _zero_ runtime overhead.

    In addition, Astro supports:
    - Astro {expressions}
    - Automatic indentation normalization
    - Automatic escaping of expressions inside code blocks

    ```js
      // This content is not transformed!
      const object = { someOtherValue };
    ```

    - Rich component support like any `.astro` file!
    - Recursive Markdown support (Component children are also processed as Markdown)
  </Markdown>
</Layout>
````

### 远程 Markdown

> 注意：`<Markdown />` 组件在 SSR 中没有，且可能会在 v1.0 中被删除。尽可能避免使用它。要在模板中使用 Markdown，请使用单独的 `.md` 文件，然后用 [`import` Markdown](/zh-cn/guides/markdown-content/#导入-markdown) 将其作为组件添加到模板中。阅读此 [RFC 讨论](https://github.com/withastro/rfcs/discussions/179)以了解更多信息。

如果你在远程中有 Markdown，你可以写入 `content` 属性将其直接传递给 Markdown 组件。

```astro
---
import { Markdown } from 'astro/components';

const content = await fetch('https://raw.githubusercontent.com/withastro/docs/main/README.md').then(res => res.text());
---
<Layout>
  <Markdown content={content} />
</Layout>
```

### 嵌套 Markdown

> 注意：`<Markdown />` 组件在 SSR 中没有，且可能会在 v1.0 中被删除。尽可能避免使用它。要在模板中使用 Markdown，请使用单独的 `.md` 文件，然后用 [`import` Markdown](/zh-cn/guides/markdown-content/#导入-markdown) 将其作为组件添加到模板中。阅读此 [RFC 讨论](https://github.com/withastro/rfcs/discussions/179)以了解更多信息。

`<Markdown />` 组件可以嵌套使用。

```astro
---
import { Markdown } from 'astro/components';

const content = await fetch('https://raw.githubusercontent.com/withastro/docs/main/README.md').then(res => res.text());
---

<Layout>
  <Markdown>
    ## Markdown example

    Here we have some __Markdown__ code. We can also dynamically render remote content.

    <Markdown content={content} />
  </Markdown>
</Layout>
```

⚠️ 使用 `Markdown` 组件来渲染远程 Markdown 可能会使你面临 [cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) 攻击。如果你正在渲染不受信任的内容，比如在渲染前对内容进行无害化处理。

## 配置 Markdown

你可以通过修改 `astro.config.mjs` 来自定义 Markdown 解析。[你在这里可以阅读完整的相关内容](/zh-cn/reference/configuration-reference/#markdown-选项)。

### Markdown 插件

Astro 支持 第三方 [remark](https://github.com/remarkjs/remark) 和 [rehype](https://github.com/rehypejs/rehype) 插件以增强 Markdown。你可以在 `astro.config.mjs` 中添加插件。

> **注：**Astro 默认自带 [GitHub-flavored Markdown](https://github.com/remarkjs/remark-gfm) 支持并预启用 [remark-smartypants](https://github.com/silvenon/remark-smartypants)。如果启用自定义 `remarkPlugins` 或 `rehypePlugins` 将移除这些内置插件，如果还要用就需要显式添加这些插件。

#### 如何在 Astro 中添加 Markdown 插件

1. 在你的项目中安装 npm 包。
2. 更新 `markdown` 选项中的 `remarkPlugins` 或 `rehypePlugins`：

   ```js
   // astro.config.mjs
   export default {
     markdown: {
       remarkPlugins: [
         // Add a Remark plugin that you want to enable for your project.
         // If you need to provide options for the plugin, you can use an array and put the options as the second item.
         // ['remark-autolink-headings', { behavior: 'prepend'}],
       ],
       rehypePlugins: [
         // Add a Rehype plugin that you want to enable for your project.
         // If you need to provide options for the plugin, you can use an array and put the options as the second item.
         // 'rehype-slug',
         // ['rehype-autolink-headings', { behavior: 'prepend'}],
       ],
     },
   };
   ```

   你也可以使用插件名并导入它们：

   ```js
   // astro.config.mjs
   import autolinkHeadings from 'remark-autolink-headings';

   export default {
     markdown: {
       remarkPlugins: [[autolinkHeadings, { behavior: 'prepend' }]],
     },
   };
   ```

### 语法高亮

Astro 内置了对 [Shiki](https://shiki.matsu.io/) 和 [Prism](https://prismjs.com/) 的支持。这为以下内容提供了即时语法高亮支持：

- 在 markdown（`.md`）文件和[内置的 `<Markdown />` 组件](#markdown-组件) 中使用的所有代码块（\`\`\`）。
- [内置的 `<Code />` 组件](/zh-cn/reference/api-reference/#code-)(由 Shiki 提供支持))或 [`<Prism />` 组件](/zh-cn/reference/api-reference/#prism-) 中的内容（由 Prism 提供支持）。

Shiki 默认启用，预配置了 `github-dark` 主题。 编译后的输出将被限制为内联样式，没有任何无关的 CSS 类、样式表或客户端 JS。

如果你选择使用 Prism，我们将改为应用 Prism 的 CSS 类。 请注意，**你需要带上自己的 CSS 样式表**才能显示语法高亮！ 有关详细信息，请参阅 [Prism 配置部分](#prism-配置)。

#### 选择语法高亮器

我们的默认语法高亮器是 Shiki。如果你想改用 `'prism'` 或禁用语法高亮。你可以配置 `markdown` 对象：

```js
// astro.config.mjs
export default {
  markdown: {
    // Can be 'shiki' (default), 'prism' or false to disable highlighting
    syntaxHighlight: 'prism',
  },
};
```

#### Shiki 配置

要使用 Shiki，你需要在 `shikiConfig` 配置所有选项，像是这样：

```js
// astro.config.mjs
export default {
  markdown: {
    shikiConfig: {
      // Choose from Shiki's built-in themes (or add your own)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: 'dracula',
      // Add custom languages
      // Note: Shiki has countless langs built-in, including .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Enable word wrap to prevent horizontal scrolling
      wrap: true,
    },
  },
};
```

我们还建议[进一步研究他们的主题文档](https://github.com/shikijs/shiki/blob/main/docs/themes.md#loading-theme)，探索加载自定义主题、浅色与深色模式切换，或通过 CSS 变量进行自定义样式。

#### Prism 配置

要使用 Prism，你需要在先在你的项目中添加一个样式表以实现语法高亮。如果你刚开始使用且喜欢使用 Prism 而不是 Shiki，我们建议：

1. 在你的 `@astrojs/markdown-remark` 配置中[设置 `syntaxHighlight: 'prism'`](#选择语法高亮器)。
2. 从可供挑选的 [Prism 主题](https://github.com/PrismJS/prism-themes)中选择一个预设好的样式表。
3. 将此样式表添加到[你项目的 `public/` 目录](/zh-cn/core-concepts/project-structure/#public)。
4. 通过 `<link>` 标签将其添加到[你的页面的 `<head>` 中](/zh-cn/core-concepts/astro-pages/#页面-html)。

你也可以访问 [Prism 支持的语言列表](https://prismjs.com/#supported-languages)了解相关的选项和用法。
