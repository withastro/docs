---
layout: ~/layouts/MainLayout.astro
title: Markdown
description: Using Markdown with Astro
---
Markdown content is commonly used to author text-heavy content like blog posts and documentation. Astro includes built-in support for Markdown with some added features like support for JavaScript expressions and Astro components right in your Markdown.

## Markdown Pages

Astro treats any `.md` file inside of the `/src/pages` directory as a page. Placing a file in this directory, or any sub-directory, will automatically build a page route using the pathname of the file. 

📚 Read more about Astro's [file-based routing](/en/core-concepts/routing).
### Basic Example

The easiest way to start using Markdown in Astro is to create a `src/pages/index.md` homepage route in your project. Copy the basic template below into your project, and then view the rendered HTML at the homepage route of your project. Usually, this is at [http://localhost:3000](http://localhost:3000/).



```markdown
---
# Example: src/pages/index.md
title: Hello, World
---
# Hi there!

This is your first markdown page. It probably isn't styled much, although
Markdown does support **bold** and *italics.* 

To learn more about adding a layout to your page, read the next section on **Markdown Layouts.**
```

### Markdown Layouts

Markdown pages have a special frontmatter property for `layout` that defines the relative path to an `.astro` [layout component](/en/core-concepts/layouts). This component will wrap your Markdown content, providing a page shell and any other included page template elements. 

```markdown
---
layout: ../layouts/BaseLayout.astro
---
```

For a layout to work with a Markdown page:
1. The page's frontmatter data must be defined as the `content` prop.
2. The layout must have a default [`<slot />`](/en/guides/slots) for the Markdown content.


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

The `content` prop also contains an `astro` property with additional metadata about the page such as the complete Markdown `source` and a `headers` object.

An example blog post `content` object might look like:

```json
{
  /** Frontmatter from a blog post
  "title": "Astro 0.18 Release",
  "date": "Tuesday, July 27 2021",
  "author": "Matthew Phillips",
  "description": "Astro 0.18 is our biggest release since Astro launch.",
  "draft": false,
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
    "source": "# Astro 0.18 Release\\nA little over a month ago, the first public beta [...]"
  },
  "url": ""
}
```

> 💡 `astro` and `url` are the only guaranteed properties provided by Astro in the `content` prop. The rest of the object is defined by your frontmatter variables.

### Markdown Drafts

`draft: true` is an optional frontmatter value that will mark an individual `.md` page or post as "unpublished." By default, this page will be excluded from the site build.

Markdown pages without the `draft` property or those with `draft: false` are unaffected and will be included in the final build.

```markdown
src/pages/post/blog-post.md
---
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


> ⚠️ Although `draft: true` will prevent a page from being built on your site at that page route, `Astro.fetchContent()` currently returns **all your Markdown files**. 

To exclude the data (e.g. title, link, description) from a draft post from being included in your post archive, or list of most recent posts, be sure that your `Astro.fetchContent()` function also **filters to exclude any draft posts**.

⚙️ To enable building draft pages: 

Add `drafts: true` to `buildOptions` in `astro.config.mjs` 

```js
//astro.config.mjs

export default /** @type {import('astro').AstroUserConfig} */ ({
  < ... >
  buildOptions: {
    site: 'https://example.com/',
    drafts: true,
  },

});
``` 

 💡 You can also pass the `--drafts` flag when running `astro build` to build draft pages! 

## Authoring Markdown

In addition to supporting standard Markdown syntax, Astro also extends Markdown to make your content even more expressive. Below are some Markdown features that only exist in Astro.
### Using Variables in Markdown

frontmatter variables can be used directly in your Markdown as properties of the `frontmatter` object.

```markdown
---
author: Leon
age: 42
---
# About the Author

{frontmatter.author} is {frontmatter.age} and lives in Toronto, Canada.
```

### Using Components in Markdown

You can import components into your Markdown file with `setup` and use them alongside your Markdown content. The `frontmatter` object is also available to any imported components.

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

<!-- 

## Importing Markdown

https://github.com/withastro/rfcs/pull/147

TODO: This RFC will change how we import markdown, if accepted.
Therefore, I'd recommend not writing this section now and coming
back to it later.

-->

## Markdown Component

Astro has a dedicated component used to let you render Markdown in `.astro` files. 

You can import the [built-in Astro Markdown component](/en/reference/builtin-components#markdown) in your component script and then write any Markdown you want between `<Markdown> </Markdown>` tags.

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

### Remote Markdown

If you have Markdown in a remote source, you may pass it directly to the Markdown component through the `content` attribute.

```astro
---
import { Markdown } from 'astro/components';

const content = await fetch('https://raw.githubusercontent.com/withastro/docs/main/README.md').then(res => res.text());
---
<Layout>
  <Markdown content={content} />
</Layout>
```

### Nested Markdown

`<Markdown>` components can be nested. 

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

⚠️ Use of the `Markdown` component to render remote Markdown can open you up to a [cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) attack. If you are rendering untrusted content, be sure to _sanitize your content **before** rendering it_.


## Markdown Parsers

Astro comes with Markdown support powered by [remark](https://remark.js.org/). 

The `@astrojs/markdown-remark` package is included by default with the following plugins pre-enabled:

- [GitHub-flavored Markdown](https://github.com/remarkjs/remark-gfm)
- [remark-smartypants](https://github.com/silvenon/remark-smartypants)
- [rehype-slug](https://github.com/rehypejs/rehype-slug)


> ⚙️ You can include a custom Markdown parser inside `astro.config.mjs` by providing a function that follows the `MarkdownParser` type declared inside [this file](https://github.com/withastro/astro/blob/main/packages/astro/src/@types/astro.ts).

```js
// astro.config.mjs
export default {
  markdownOptions: {
    render: [
      'parser-name', // or import('parser-name') or (contents) => {...}
      {
        // options
      },
    ],
  },
};
```

### Remark and Rehype Plugins

Astro supports third-party plugins for Markdown. You can provide your plugins in `astro.config.mjs`.

> **Note:** Enabling custom `remarkPlugins` or `rehypePlugins` removes Astro’s built-in support for the plugins previously mentioned. You must explicitly add these plugins to your `astro.config.mjs` file, if desired.

### Add a Markdown plugin in Astro

1. Install the npm package dependency in your project.

2. Update `remarkPlugins` or `rehypePlugins` inside the `@astrojs/markdown-remark` options:

```js
// astro.config.mjs
export default {
  markdownOptions: {
    render: [
      '@astrojs/markdown-remark',
      {
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
    ],
  },
};
```

You can provide names of the plugins as well as import them:

```js
// astro.config.mjs
import autolinkHeadings from 'remark-autolink-headings';

export default {
  markdownOptions: {
    render: [
      '@astrojs/markdown-remark',
      {
        remarkPlugins: [[autolinkHeadings, { behavior: 'prepend' }]],
      },
    ],
  },
};
```

### Syntax Highlighting

Astro comes with built-in support for [Prism](https://prismjs.com/) and [Shiki](https://shiki.matsu.io/). 

By default, Prism is enabled but no Prism stylesheet is included. (Choose from the available [Prism Themes](https://github.com/PrismJS/prism-themes) and see the [list of languages supported by Prism](https://prismjs.com/#supported-languages) for options and usage.)

You can configure Astro to instead use Shiki or disable syntax highlighting entirely in the `@astrojs/markdown-remark` options:

```js
// astro.config.mjs
export default {
  markdownOptions: {
    render: [
      '@astrojs/markdown-remark',
      {
        // Pick a syntax highlighter. 
        // Can be 'prism' (default), 'shiki' or false to disable any highlighting.
        syntaxHighlight: 'prism',
        // If you are using shiki, here you can define a global theme and
        // add custom languages.
        shikiConfig: {
          theme: 'github-dark',
          langs: [],
          wrap: false,
        },
      },
    ],
  },
};
```

You can read more about custom Shiki [themes](https://github.com/shikijs/shiki/blob/main/docs/themes.md#loading-theme) and [languages](https://github.com/shikijs/shiki/blob/main/docs/languages.md#supporting-your-own-languages-with-shiki).

(See also the [`<Prism />` Astro component](/en/reference/builtin-components/#prism-) and the [`<Code />` Astro component](/en/reference/builtin-components/#code-) powered by Shiki.)
