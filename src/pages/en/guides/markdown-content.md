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
Markdown does support **bold** and _italics._

To learn more about adding a layout to your page, read the next section on **Markdown Layouts.**
```

### Markdown Layouts

Markdown pages have a special frontmatter property for `layout` that defines the relative path to an Astro [layout component](/en/core-concepts/layouts). This component will wrap your Markdown content, providing a page shell and any other included page template elements.

```markdown
---
layout: ../layouts/BaseLayout.astro
---
```

A typical layout for Markdown pages includes:

1. the content prop to access the Markdown page's frontmatter data.
2. a default [`<slot />`](/en/core-concepts/astro-components#slots) to indicate where the page's Markdown content should be rendered.

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

> 💡 `astro` and `url` are the only guaranteed properties provided by Astro in the `content` prop. The rest of the object is defined by your frontmatter variables.

### Frontmatter as Props

Any Astro component (not just layouts!) can receive the values defined in your Markdown frontmatter as props. You can specify several types of data using YAML frontmatter, and capture even richer meta information from each blog post to use throughout your Astro site.

Access these values in any `.astro` file as you would in a layout, as described above.

### Markdown Drafts

`draft: true` is an optional frontmatter value that will mark an individual `.md` page or post as "unpublished." By default, this page will be excluded from the site build.

Markdown pages without the `draft` property or those with `draft: false` are unaffected and will be included in the final build.

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

> ⚠️ Although `draft: true` will prevent a page from being built on your site at that page route, `Astro.glob()` currently returns **all your Markdown files**.

To exclude the data (e.g. title, link, description) from a draft post from being included in your post archive, or list of most recent posts, be sure that your `Astro.glob()` function also **filters to exclude any draft posts**.

⚙️ To enable building draft pages:

Add `drafts: true` to `markdown` in `astro.config.mjs`

```js
// astro.config.mjs
export default defineConfig({
  markdown: {
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

## Importing Markdown

You can import Markdown files directly into your Astro files! You can import one specific page with `import` or multiple with `Astro.glob()`

```astro
---
// You can use `import ... from`
import * as greatPost from '../pages/post/great-post.md';

// Or even `await import()`
const aboutUs = await import('../pages/internal/about-us.md');

// Lastly, you can import multiple files with Astro.glob
const posts = await Astro.glob<Frontmatter>('../pages/post/*.md');
---

Great post: <a href={greatPost.url}>{greatPost.frontmatter.title}</a>

<h2>About us</h2>
<aboutUs.Content />

<ul>
  {posts.map(post => <li>{post.frontmatter.title}</li>)}
</ul>
```

Markdown files have the following interface:

```ts
export interface MarkdownInstance<T extends Record<string, any>> {
  /* Any data specified in this file's YAML frontmatter */
  frontmatter: T;
  /* The file path of this file */
  file: string;
  /* The rendered path of this file */
  url: string | undefined;
  /* Astro Component that renders the contents of this file */
  Content: AstroComponent;
  /* Function that returns array of h1...h6 element in this file */
  getHeaders(): Promise<{ depth: number; slug: string; text: string }[]>;
}
```

You can optionally provide a type for the `frontmatter` variable using a TypeScript generic.

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

## Markdown Component

Astro has a dedicated component used to let you render Markdown in `.astro` files.

You can import the [built-in Astro Markdown component](/en/reference/api-reference#markdown-) in your component script and then write any Markdown you want between `<Markdown> </Markdown>` tags.

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

## Markdown Configuration

You can customize the Markdown parsing by modifing your `astro.config.mjs`. [Here you can read the full reference](/en/reference/configuration-reference/#markdown-options).

### Remark and Rehype Plugins

Astro supports third-party [remark](https://github.com/remarkjs/remark) and [rehype](https://github.com/rehypejs/rehype) plugins for Markdown. You can provide your plugins in `astro.config.mjs`.

By default, Astro comes with [GitHub-flavored Markdown](https://github.com/remarkjs/remark-gfm) and [remark-smartypants](https://github.com/silvenon/remark-smartypants) pre-enabled. Take into account that enabling custom `remarkPlugins` or `rehypePlugins` will remove these built-in plugins and you would need to explicitly add these plugins if desired.

#### Add a Markdown plugin in Astro

1. Install the npm package dependency in your project.

2. Update `remarkPlugins` or `rehypePlugins` inside the `markdown` options:

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
      // ['rehype-autolink-headings', { behavior: 'prepend'}],
    ],
  },
};
```

You can provide names of the plugins as well as import them:

```js
// astro.config.mjs
import autolinkHeadings from 'remark-autolink-headings';

export default {
  markdown: {
    remarkPlugins: [[autolinkHeadings, { behavior: 'prepend' }]],
  },
};
```

### Syntax Highlighting

Astro comes with built-in support for [Shiki](https://shiki.matsu.io/) and [Prism](https://prismjs.com/). This provides instant syntax highlighting for:

- all code fences (\`\`\`) used in a markdown (`.md`) file and the [built-in `<Markdown />` component](#markdown-component).
- content within the [built-in `<Code />` component](/en/reference/api-reference/#code-) (powered by Shiki), or the [`<Prism />` component](/en/reference/api-reference/#prism-) (powered by Prism).

Shiki is enabled by default, preconfigured with the `github-dark` theme. The compiled output will be limited to inline `style`s without any extraneous CSS classes, stylesheets, or client-side JS.

If you opt to use Prism, we will apply Prism's CSS classes instead. Note that **you need to bring your own CSS stylesheet** for syntax highlighting to appear! See the [Prism configuration section](#prism-configuration) for more details.

#### Choose a syntax highlighter

Shiki is our default syntax highlighter. If you'd like to switch to `'prism'` or disable syntax highlighting entirely, you can use the `markdown` config object:

```js
// astro.config.mjs
export default {
  markdown: {
    // Can be 'shiki' (default), 'prism' or false to disable highlighting
    syntaxHighlight: 'prism',
  },
};
```

#### Shiki configuration

When using Shiki, you'll configure all options via the `shikiConfig` object like so:

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

We also suggest [diving into their theme documentation](https://github.com/shikijs/shiki/blob/main/docs/themes.md#loading-theme) to explore loading custom theme, light vs dark mode toggles, or styling via CSS variables.

#### Prism configuration

When using Prism, you'll need to add a stylesheet to your project for syntax highlighting. If you're just getting started and prefer to use Prism over Shiki, we suggest:

1. [Setting `syntaxHighlight: 'prism'`](#choose-a-syntax-highlighter) from your `@astrojs/markdown-remark` config.
1. Choosing a premade stylesheet from the available [Prism Themes](https://github.com/PrismJS/prism-themes).
1. Adding this stylesheet to [your project's `public/` directory](https://docs.astro.build/en/core-concepts/project-structure/#public).
1. Loading this [into your page's `<head>`](https://docs.astro.build/en/core-concepts/astro-pages/#page-html) via a `<link>` tag.

You can also visit the [list of languages supported by Prism](https://prismjs.com/#supported-languages) for options and usage.

## Notes

- Astro will add autogenerated ids to all the headings automatically using [github-slugger](https://github.com/Flet/github-slugger). If a custom id is specified, it won't be overriden.
