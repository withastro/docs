---
layout: ~/layouts/MainLayout.astro
title: Markdown & MDX
description: Learn how to create content using Markdown or MDX with Astro
i18nReady: true
---

[Markdown](https://daringfireball.net/projects/markdown/) is commonly used to author text-heavy content like blog posts and documentation. Astro includes built-in support for standard Markdown (`.md`, `.markdown`, `.mdown`, `.mkdn`, `.mkd`, `.mdwn`) files. 

With the [@astrojs/mdx integration](/en/guides/integrations-guide/mdx/) installed, Astro also supports [MDX](https://mdxjs.com/) (`.mdx`) files which bring added features like support for JavaScript expressions and components in your Markdown content. 

Use either or both types of files to write your Markdown content!

## Markdown and MDX Pages

### File-based Routing

Astro treats any `.md` (or alternative supported extension) or `.mdx` file inside of the `/src/pages/` directory as a page.

Placing a file in this directory, or any sub-directory, will automatically build a page route using the pathname of the file.

```markdown
---
# Example: src/pages/page-1.md
title: Hello, World
---

# Hi there!

This Markdown file creates a page at `your-domain.com/page-1/`
```

📚 Read more about Astro's [file-based routing](/en/core-concepts/routing/).

### Frontmatter `layout`

Astro provides Markdown and MDX pages with a special frontmatter property for `layout`.

This must be a relative path (or [alias](/en/guides/aliases/)) to an Astro [layout component](/en/core-concepts/layouts/#markdown-layouts). This component will wrap your Markdown content, providing a page shell and any other included page template elements.

**`src/pages/posts/post-1.md`**

```markdown {2}
---
layout: ../../layouts/BlogPostLayout.astro
title: Astro in brief
author: Himanshu
description: Find out what makes Astro awesome!
--- 
This is a post written in Markdown.
```

When a Markdown or MDX file includes a layout, it passes a `frontmatter` property to the `.astro` component which includes the frontmatter properties and the final HTML output of the page.


**`src/layouts/BlogPostLayout.astro`**

```astro /frontmatter(?:.\w+)?/
---
const {frontmatter} = Astro.props;
---
<html>
  <!-- ... -->
  <h1>{frontmatter.title}</h1>
  <h2>Post author: {frontmatter.author}</h2>
  <p>{frontmatter.description}<p>
  <slot /> <!-- Markdown content is injected here -->
   <!-- ... -->
</html>
```

📚 Learn more about [Markdown Layouts](/en/core-concepts/layouts/#markdown-layouts).


### Heading IDs

Using headings in Markdown and MDX will automatically give you anchor links so you can link directly to certain sections of your page.

```markdown title="src/pages/page-1.md"
---
title: My page of content
---
## Introduction

I can link internally to [my conclusion](#conclusion) on the same page when writing Markdown.

## Conclusion

I can use the URL `https://my-domain.com/page-1/#introduction` to navigate directly to my Introduction on the page. 
```

### Draft Pages

`draft: true` is an optional frontmatter value that will mark an individual Markdown or MDX page or post as "unpublished." By default, this page will be excluded from the site build.

Pages without the `draft` property or those with `draft: false` are unaffected and will be included in the final build.

```markdown {5}
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

:::caution[Drafts and Astro.glob()]
Although `draft: true` will prevent a page from being built on your site at that page route, [`Astro.glob()`](/en/reference/api-reference/#astroglob) currently returns **all your Markdown files**.
:::

To exclude draft posts from being included in a post archive, or list of most recent posts, you can filter the results returned by your `Astro.glob()`.

```js
const posts = await Astro.glob('../pages/post/*.md');
const nonDraftPosts = posts.filter((post) => !post.frontmatter.draft);
```

To enable building draft pages by default, update `astro.config.mjs` by adding `drafts: true` to `markdown` or to the `mdx` integration:

```js ins={4, 7}
// astro.config.mjs
export default defineConfig({
  markdown: {
    drafts: true,
  },
  integrations: [mdx({
    drafts: true,
  })],
});
```

:::tip
You can also pass the `--drafts` flag when running `astro build` to build draft pages!
:::

### Escaping special characters

Certain characters have a special meaning in Markdown and MDX. You may need to use a different syntax if you want to display them. To do this, you can use [HTML entities](https://developer.mozilla.org/en-US/docs/Glossary/Entity) for these characters instead.

For example, to prevent `<` being interpreted as the beginning of an HTML element, write `&lt;`. Or, to prevent `{` being interpreted as the beginning of a JavaScript expression in MDX, write `&lcub;`.

### Variables and Components

Adding the Astro [MDX integration](/en/guides/integrations-guide/mdx/) enhances your Markdown authoring with JSX variables, expressions and components. It also adds support for using [frontmatter in MDX](https://mdxjs.com/guides/frontmatter/) by default.

`.mdx` files must be written in [MDX syntax](https://mdxjs.com/docs/what-is-mdx/#mdx-syntax) rather than Astro’s HTML-like syntax.

#### Using Exported Variables in MDX

MDX supports using `export` statements to add variables to your MDX content. These variables are accessible both in the template itself *and* as named properties when [importing the the file](#importing-markdown) somewhere else.

For example, you can export a `title` field from an MDX page or component to use as a heading with `{JSX expressions}`:

```mdx
export const title = 'My first MDX post'

# {title}
```
#### Using Frontmatter in MDX

The Astro MDX integration includes support for using frontmatter in MDX by default. Add frontmatter properties just as you would in Markdown files, and these variables are accessible to use in the template, in its [`layout` component](#frontmatter-layout), *and* as named properties when [importing the the file](#importing-markdown) somewhere else. 

```mdx
---
layout: '../../layouts/BlogPostLayout.astro'
title: 'My first MDX post'
---

# {title}
```

#### Using Components in MDX

After installing the MDX integration, you can import and use both [Astro components](/en/core-concepts/astro-components/#component-props) and [UI framework components](/en/core-concepts/framework-components/#using-framework-components) in MDX (`.mdx`) files just as you would use them in any other Astro component. 

Don't forget to include a `client:directive` on your UI framework components, if necessary!

```astro title="src/pages/import-frameworks.mdx"
import Banner from '..components/Banner.astro';
import Counter from '../components/Counter.svelte';

<Banner title="Welcome" />

Here is my Svelte counter on an MDX page:
<Counter client:visible />
```

See more examples of using import and export statements in the [MDX docs](https://mdxjs.com/docs/what-is-mdx/#esm).

:::caution[Deprecated in Markdown]
Since Astro v1.0, the ability to use [frontatter variables, components or JSX in Markdown pages is no longer enabled by default](/en/migrate/#deprecated-components-and-jsx-in-markdown). Support will eventually be removed entirely. 

Astro config supports a [legacy flag](/en/reference/configuration-reference/#legacyastroflavoredmarkdown) that will re-enable these features in Markdown pages until you are able to migrate to MDX in Astro. The Astro MDX integration is the recommended path forward if you need more features than standard Markdown provides.
:::

## Importing Markdown

You can import Markdown and MDX files directly into your Astro files. This gives you access to their Markdown content, as well as other properties such as frontmatter values that can be used within Astro's JSX-like expressions. 

You can import one specific page with an `import` statement, or multiple pages with [`Astro.glob()`](/en/guides/imports/#astroglob).

```astro title="src/pages/index.astro" {3,6}
---
// Import some markdown. Dynamic import() is also supported!
import * as greatPost from '../pages/post/great-post.md';

// Also, you can import multiple files with Astro.glob
const posts = await Astro.glob('../pages/post/*.md');
---

A Great Post: <a href={greatPost.url}>{greatPost.frontmatter.title}</a>

<ul>
  {posts.map(post => <li>{post.frontmatter.title}</li>)}
</ul>
```

You can optionally provide a type for the `frontmatter` variable using a TypeScript generic:

```astro title="src/pages/index.astro" ins={2-5} ins="<Frontmatter>"
---
interface Frontmatter {
  title: string;
  description?: string;
}
const posts = await Astro.glob<Frontmatter>('../pages/post/*.md');
---

<ul>
  {posts.map(post => <li>{post.frontmatter.title}</li>)}
  <!-- post.frontmatter.title will be `string`! -->
</ul>
```

### Exported Properties

:::note[imports vs frontmatter layout]
The following properties are available to a `.astro` component when using an `import` statement or `Astro.glob()`. 

See the [properties exported to an Astro layout component](/en/core-concepts/layouts/#layout-props) when using [Astro's special Markdown/MDX frontmatter `layout:` property](#frontmatter-layout) instead.
:::

Markdown and MDX files both export the following properties when imported by an Astro component in its frontmatter:

#### `frontmatter`

Contains any data specified in the file's frontmatter.

MDX additionally exports any variable exports declared.

#### `file`

The absolute path of the file (e.g. `/home/user/projects/.../file.md`).

#### `url`

The page URL for files within `src/pages/`.

For example, `src/pages/en/about.mdx` provides `/en/about/`. 

For files outside of `src/pages`, `url` will be `undefined`.

#### `getHeadings()`

An async function that returns an array of all headings (i.e. `h1 -> h6` elements) in the file. Each heading’s `slug` corresponds to the generated ID for a given heading and can be used for anchor links.

The response follows this type:

```ts
{ depth: number; slug: string; text: string }[]
```

#### `Content`

A component that returns the full rendered contents of the file:

```astro title="src/pages/content.astro" "Content"
---
import {Content as PromoBanner} from '../components/promoBanner.md';
---

<h2>Today's promo</h2>
<PromoBanner />
```

When using `getStaticPaths` and `Astro.glob()` to generate pages from Markdown files, you can pass the `<Content/>` component through the page’s `props`. You can then retrieve the component from `Astro.props` and render it in your template. 

```astro title="src/pages/[slug].astro" {9-11} "Content" "Astro.props.post"
---
export async function getStaticPaths() {
  const posts = await Astro.glob('../posts/**/*.md')

  return posts.map(post => ({
    params: { 
      slug: post.frontmatter.slug 
    },
    props: {
      post
    },
  }))
}

const { Content } = Astro.props.post
---
<article>
  <Content/>
</article>
```

### Markdown-only Exports

The following properties are exported only by Markdown files. To access raw or compiled content from an MDX file, you can render your imported MDX component. Use the [`set:html` directive](/en/reference/directives-reference/#sethtml) when necessary.

#### `rawContent()`

A function that returns the raw content of the Markdown file (excluding the frontmatter block) as a string.

:::tip
If you plan to use `rawContent` for calculating values like "reading time," we suggest using a remark or rehype plugin to inject frontmatter instead! See [our reading time example](#example-calculate-reading-time) for more.
:::

#### `compiledContent()`

A function that returns the parsed HTML document from your Markdown file's contents as a string. Note **this does not include layouts configured in your frontmatter**! Only the Markdown document itself will be returned as HTML. 

:::caution
**[For `legacy.astroFlavoredMarkdown` users](/en/reference/configuration-reference/#legacyastroflavoredmarkdown):** This does not parse `{jsx expressions}` or `<Components />`. Only standard Markdown blocks like `## headings` and `- lists` will be parsed to HTML.
:::

### MDX-only Exports

MDX files can also export any variables with an `export` statement.

For instance, you can export a `title` field from an MDX page or component to use as a heading with `{JSX expressions}`:

```mdx
export const title = 'My first MDX post'
```

This `title` will be accessible from `import` and [Astro.glob()](/en/reference/api-reference/#astroglob) statements as well:

```astro
---
// src/pages/index.astro
const posts = await Astro.glob('./*.mdx');
---

{posts.map(post => <p>{post.title}</p>)}
```

## Configuring Markdown

Markdown support in Astro is powered by [remark](https://remark.js.org/), a powerful parsing and processing tool with an active ecosystem. Other Markdown parsers like Pandoc and markdown-it are not currently supported.

You can customize how remark parses your Markdown in `astro.config.mjs`. See [the reference documentation](/en/reference/configuration-reference/#markdown-options) for full configuration details or follow our guides below on how to add remark plugins and customize syntax highlighting.

:::note[mdx]
The instructions below are for configuring standard Markdown. To configure MDX plugins and frontmatter options, please see the relevant section in the [MDX integration guide](/en/guides/integrations-guide/mdx/#configuration).
:::

### Markdown Plugins

Astro supports third-party [remark](https://github.com/remarkjs/remark) and [rehype](https://github.com/rehypejs/rehype) plugins for Markdown and MDX. These plugins allow you to extend your Markdown with new capabilities, like [auto-generating a table of contents](https://github.com/remarkjs/remark-toc), [applying accessible emoji labels](https://github.com/florianeckerstorfer/remark-a11y-emoji), and more. We encourage you to browse [awesome-remark](https://github.com/remarkjs/awesome-remark) and [awesome-rehype](https://github.com/rehypejs/awesome-rehype) for popular plugins!

This example applies the [remark-toc](https://github.com/remarkjs/remark-toc) and [rehype-minify](https://github.com/rehypejs/rehype-minify) plugins. See each project's README for installation instructions.

:::tip
Astro applies the [GitHub-flavored Markdown](https://github.com/remarkjs/remark-gfm) and [Smartypants](https://github.com/silvenon/remark-smartypants) plugins by default. This brings some niceties like generating clickable links from text and formatting quotes for readability. When adding your own plugins, you can preserve these defaults with the `extendDefaultPlugins` flag.
:::

```js title="astro.config.mjs" ins={2,3,7,8,11}
import { defineConfig } from 'astro/config';
import remarkToc from 'remark-toc';
import rehypeMinifyHtml from 'rehype-minify';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkToc],
    rehypePlugins: [rehypeMinifyHtml],
    // Preserve Astro's default plugins: GitHub-flavored Markdown and Smartypants
    // default: false
    extendDefaultPlugins: true,
  },
}
```

#### Remark-rehype options

Markdown content is transformed into HTML through remark-rehype which has [a number of options](https://github.com/remarkjs/remark-rehype#options).

You can use remark-rehype options in your config file like so:

```js
// astro.config.mjs
export default {
  markdown: {
    remarkRehype: {
      footnoteLabel: 'Catatan kaki',
      footnoteBackLabel: 'Kembali ke konten',
    },
  },
};
```

Astro will add autogenerated ids to all headings in Markdown files automatically using [github-slugger](https://github.com/Flet/github-slugger). But, if a custom id is specified, it won't be overridden.

These ids will be added _after_ all the other plugins are executed, so if you have a plugin like `rehype-toc` that needs ids, you should add your own slugging plugin (like `rehype-slug`).


### Injecting frontmatter

You may want to add frontmatter properties to your Markdown files programmatically. By using a [remark or rehype plugin](#markdown-plugins), you can generate these properties based on a file's contents.

You can append to the `data.astro.frontmatter` property from your plugin's `file` argument like so:

```js title="example-remark-plugin.mjs"
export function exampleRemarkPlugin() {
  // All remark and rehype plugins return a separate function
  return function (tree, file) {
    file.data.astro.frontmatter.customProperty = 'Generated property';
  }
}
```

After applying this plugin to your `markdown` config:

```js title="astro.config.mjs" "import { exampleRemarkPlugin } from './example-remark-plugin.mjs';" "remarkPlugins: [exampleRemarkPlugin],"
import { exampleRemarkPlugin } from './example-remark-plugin.mjs';

export default {
  markdown: {
    remarkPlugins: [exampleRemarkPlugin],
    extendDefaultPlugins: true,
  },
};

```

...every Markdown file will have `customProperty` in its frontmatter! This is available when [importing your markdown](#importing-markdown) and from [the `Astro.props.frontmatter` property in your layouts](#frontmatter-layout).

#### Example: calculate reading time

You can use a [remark plugin](https://github.com/remarkjs/remark) to add a reading time to your frontmatter. We recommend two helper packages:
- [`reading-time`](https://www.npmjs.com/package/reading-time) to calculate minutes read
- [`mdast-util-to-string`](https://www.npmjs.com/package/mdast-util-to-string) to extract all text from your markdown

```shell
npm install reading-time mdast-util-to-string
```

We can apply these packages to a remark plugin like so:

```js title="remark-reading-time.mjs"
import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function remarkReadingTime() {
  return function (tree, { data }) {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage);
    // readingTime.text will give us minutes read as a friendly string,
    // i.e. "3 min read"
    data.astro.frontmatter.minutesRead = readingTime.text;
  };
}
```

Once you apply this plugin to your config:

```js title="astro.config.mjs" "import { remarkReadingTime } from './remark-reading-time.mjs';" "remarkPlugins: [remarkReadingTime],"
import { remarkReadingTime } from './remark-reading-time.mjs';

export default {
  markdown: {
    remarkPlugins: [remarkReadingTime],
    extendDefaultPlugins: true,
  },
};

```

...all Markdown documents will have a calculated `minutesRead`. You can use this to include an "X min read" banner in a [markdown layout](#markdown-and-mdx-pages), for instance:

```astro title="src/layouts/BlogLayout.astro" "const { minutesRead } = Astro.props.frontmatter;" "<p>{minutesRead}</p>"
---
const { minutesRead } = Astro.props.frontmatter;
---

<html>
  <head>...</head>
  <body>
    <p>{minutesRead}</p>
    <slot />
  </body>
</html>
```

### Syntax Highlighting

Astro comes with built-in support for [Shiki](https://shiki.matsu.io/) and [Prism](https://prismjs.com/). This provides instant syntax highlighting for:

- all code fences (\`\`\`) used in a Markdown (`.md` or `.markdown` etc.) or MDX (`.mdx`) file.
- content within the [built-in `<Code />` component](/en/reference/api-reference/#code-) (powered by Shiki), or the [`<Prism />` component](/en/reference/api-reference/#prism-) (powered by Prism).

Shiki is enabled by default, preconfigured with the `github-dark` theme. The compiled output will be limited to inline `style`s without any extraneous CSS classes, stylesheets, or client-side JS.

If you opt to use Prism, we will apply Prism's CSS classes instead. Note that **you need to bring your own CSS stylesheet** for syntax highlighting to appear! See the [Prism configuration section](#prism-configuration) for more details.

#### Choose a syntax highlighter

Shiki is our default syntax highlighter. If you'd like to switch to `'prism'` or disable syntax highlighting entirely, you can use the `markdown` config object:

```js ins={5}
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

#### Adding your own theme

Instead of using one of Shiki’s predefined themes, you can import a custom theme from a local file.

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config';
import customTheme from './my-shiki-theme.json';

export default defineConfig({
  markdown: {
    shikiConfig: { theme: customTheme },
  },
});
```

We also suggest [diving into their theme documentation](https://github.com/shikijs/shiki/blob/main/docs/themes.md#loading-theme) to explore more about themes, light vs dark mode toggles, or styling via CSS variables.

#### Prism configuration

When using Prism, you'll need to add a stylesheet to your project for syntax highlighting. If you're just getting started and prefer to use Prism over Shiki, we suggest:

1. [Setting `syntaxHighlight: 'prism'`](#choose-a-syntax-highlighter) from your `@astrojs/markdown-remark` config.
1. Choosing a premade stylesheet from the available [Prism Themes](https://github.com/PrismJS/prism-themes).
2. Adding this stylesheet to [your project's `public/` directory](/en/core-concepts/project-structure/#public).
3. Loading this [into your page's `<head>`](/en/guides/troubleshooting/#using-head-in-a-component) via a `<link>` tag.

You can also visit the [list of languages supported by Prism](https://prismjs.com/#supported-languages) for options and usage.

## Fetching Remote Markdown

Astro was primarily designed for local Markdown files that could be saved inside of your project directory. However, there may be certain cases where you need to fetch Markdown from a remote source. For example, you may need to fetch and render Markdown from a remote API when you build your website (or when a user makes a request to your website, when using [SSR](/en/guides/server-side-rendering/)).

**Astro does not include built-in support for remote Markdown!** To fetch remote Markdown and render it to HTML, you will need to install and configure your own Markdown parser from npm. This **will not** inherit from any of Astro's built-in Markdown and MDX settings that you have configured. Be sure that you understand these limitations before implementing this in your project. 

```astro title="src/pages/remote-example.astro"
---
// Example: Fetch Markdown from a remote API 
// and render it to HTML, at runtime.
// Using "marked" (https://github.com/markedjs/marked)
import { marked } from 'marked';
const response = await fetch('https://raw.githubusercontent.com/wiki/adam-p/markdown-here/Markdown-Cheatsheet.md');
const markdown = await response.text();
const content = marked.parse(markdown);
---
<article set:html={content} />
```
