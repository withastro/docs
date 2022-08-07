---
setup: |
  import Since from '~/components/Since.astro';
  import Tabs from '../../../components/tabs/Tabs';
layout: ~/layouts/MainLayout.astro
title: API Reference
i18nReady: true
---

## `Astro` global

The `Astro` global is available in all contexts in `.astro` files. It has the following functions:

### `Astro.glob()`

`Astro.glob()` is a way to load many local files into your static site setup.

```astro
---
// ./src/components/my-component.astro
const posts = await Astro.glob('../pages/post/*.md'); // returns an array of posts that live at ./src/pages/post/*.md
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

`.glob()` only takes one parameter: a relative URL glob of which local files you'd like to import. It’s asynchronous, and returns an array of the exports from matching files.

`.glob()` can't take variables or strings that interpolate them, as they aren't statically analyzable. (See [the troubleshooting guide](/en/guides/troubleshooting/#supported-values) for a workaround.) This is because `Astro.glob()` is a wrapper of Vite's [`import.meta.glob()`](https://vitejs.dev/guide/features.html#glob-import).

:::note
You can also use `import.meta.glob()` itself in your Astro project. You may want to do this when:
- You need this feature in a file that isn't `.astro`, like an API route. `Astro.glob()` is only available in `.astro` files, while `import.meta.glob()` is available anywhere in the project.
- You don't want to load each file immediately. `import.meta.glob()` can return functions that import the file content, rather than returning the content itself.
- You want access to each file's path. `import.meta.glob()` returns a map of a file's path to its content, while `Astro.glob()` returns a list of content.
- You want to pass multiple patterns; for example, you want to add a "negative pattern" that filters out certain files. `import.meta.glob()` can optionally take an array of glob strings, rather than a single string.

Read more in the [Vite documentation](https://vitejs.dev/guide/features.html#glob-import).
:::
#### Markdown Files

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

### `Astro.props`

`Astro.props` is an object containing any values that have been passed as [component attributes](/en/core-concepts/astro-components/#component-props). Layout components for `.md` and `.mdx` files receive frontmatter values as props.

```astro {3}
---
// ./src/components/Heading.astro
const { title, date } = Astro.props;
---
<div>
    <h1>{title}</h1>
    <p>{date}</p>
</div>
```

```astro /title=".+"/ /date=".+"/
---
// ./src/pages/index.astro
import Heading from '../components/Heading.astro';
---
<Heading title="My First Post" date="09 Aug 2022" />
```

📚 Learn more about how [Markdown and MDX Layouts](/en/guides/markdown-content/#markdown-and-mdx-layouts) handle props.

📚 Learn how to add [Typescript type definitions for your props](/en/guides/typescript/#component-props).

#### Astro Files

Astro files have the following interface:

```ts
export interface AstroInstance {
	default: AstroComponent;
}
```

#### Other Files

Other files may have various different interfaces, but `Astro.glob()` accepts a TypeScript generic if you know exactly what an unrecognized file type contains.

```ts
---
interface CustomDataFile {
  default: Record<string, any>;
}
const data = await Astro.glob<CustomDataFile>('../data/**/*.js');
---
```

### `Astro.request`

`Astro.request` is a standard [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. It can be used to get the `url`, `headers`, `method`, and even body of the request. 

```astro
<p>Received a {Astro.request.method} request to "{Astro.request.url}".</p>
<p>Received request headers: <code>{JSON.stringify(Object.fromEntries(Astro.request.headers))}</code>
```

See also: [`Astro.url`](#astrourl)
### `Astro.response`

`Astro.response` is a standard [ResponseInit](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#init) object. It is used to set the `status`, `statusText`, and `headers` for a page's response.

```astro
---
if(condition) {
  Astro.response.status = 404;
  Astro.response.statusText = 'Not found';
}
---
```

Or to set a header:

```astro
---
Astro.response.headers.set('Set-Cookie', 'a=b; Path=/;');
---
```

### `Astro.canonicalURL`

:::caution[Deprecated]
Use [`Astro.url`](#astrourl) to construct your own canonical URL. 
:::

The [canonical URL][canonical] of the current page.

### `Astro.url`

<Since v="1.0.0-rc" />

A [URL](https://developer.mozilla.org/en-US/docs/Web/API/URL) object consructed from the current `Astro.request.url` URL string value. Useful for interacting with individual properties of the request URL, like pathname and origin. 

Equivalent to doing `new URL(Astro.request.url)`. 

```astro
<h1>The current URL is: {Astro.url}</h1>
<h1>The current URL pathname is: {Astro.url.pathname}</h1>
<h1>The current URL origin is: {Astro.url.origin}</h1>
```

You can also use `Astro.url` to create new URLs by passing it as an argument to [`new URL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL).

```astro
---
// Example: Construct a canonical URL using your production domain
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
// Example: Construct a URL for SEO meta tags using your current domain
const socialImageURL = new URL('/images/preview.png', Astro.url);
---
<link rel="canonical" href={canonicalURL} />
<meta property="og:image" content={socialImageURL} />
```

### `Astro.clientAddress`

<Since v="1.0.0-rc" />

Specifies the [IP address](https://en.wikipedia.org/wiki/IP_address) of the request. This property is only available when building for SSR (server-side rendering) and should not be used for static sites.

```astro
---
const ip = Astro.clientAddress;
---

<div>Your IP address is: <span class="address">{ ip }</span></div>
```

### `Astro.site`

`Astro.site` returns a `URL` made from `site` in your Astro config. If undefined, this will return a URL generated from `localhost`.


### `Astro.slots`

`Astro.slots` contains utility functions for modifying an Astro component's slotted children.

| Name           | Type                                              | Description                                        |
| :------------- | :------------------------------------------------ | :------------------------------------------------- |
| `has`          | `(name: string) => boolean`                       | Whether content for this slot name exists          |
| `render`       | `(name: string, args?: any[]) => Promise<string>` | Asychronously renders this slot and returns HTML   |

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

`Astro.self` allows Astro components to be recursively called. This behaviour lets you render an Astro component from within itself by using `<Astro.self>` in the component template. This can be helpful for iterating over large data stores and nested data-structures.

```astro
---
// NestedList.astro
const { items } = Astro.props;
---
<ul class="nested-list">
  {items.map((item) => (
    <li>
      <!-- If there is a nested data-structure we render `<Astro.self>` -->
      <!-- and can pass props through with the recursive call -->
      {Array.isArray(item) ? (
        <Astro.self items={item} />
      ) : (
        item
      )}
    </li>
  ))}
</ul>
```

This component could then be used like this:

```astro
---
import NestedList from './NestedList.astro';
---
<NestedList items={['A', ['B', 'C'], 'D']} />
```

And would render HTML like this:

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

If a page uses dynamic params in the filename, that component will need to export a `getStaticPaths()` function.

This function is required because Astro is a static site builder. That means that your entire site is built ahead of time. If Astro doesn't know to generate a page at build time, your users won't see it when they visit your site.

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

The `getStaticPaths()` function should return an array of objects to determine which paths will be pre-rendered by Astro.

:::caution
The `getStaticPaths()` function executes in its own isolated scope once, before any page loads. Therefore you can't reference anything from its parent scope, other than file imports. The compiler will warn if you break this requirement.
:::

### `params`

The `params` key of every returned object tells Astro what routes to build. The returned params must map back to the dynamic parameters and rest parameters defined in your component filepath.

`params` are encoded into the URL, so only strings and numbers are supported as values. The value for each `params` object must match the parameters used in the page name.

For example, suppose that you have a page at `src/pages/posts/[id].astro`. If you export `getStaticPaths` from this page and return the following for paths:

```astro
---
export async function getStaticPaths() {
  return [
    { params: { id: '1' } },
    { params: { id: '2' } },
    { params: { id:  3  } }  // Can be a number too!
  ];
}

const { id } = Astro.params;
---
<h1>{id}</h1>
```

Then Astro will statically generate `posts/1`, `posts/2`, and `posts/3` at build time.

### Data Passing with `props`

To pass additional data to each generated page, you can also set a `props` value on every returned path object. Unlike `params`, `props` are not encoded into the URL and so aren't limited to only strings.

For example, suppose that you generate pages based off of data fetched from a remote API. You can pass the full data object to the page component inside of `getStaticPaths`:

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

You can also pass a regular array, which may be helpful when generating or stubbing a known list of routes.

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

Then Astro will statically generate `posts/1` and `posts/2` at build time using the page component in `pages/posts/[id].astro`. The page can reference this data using `Astro.props`:

### `paginate()`

Pagination is a common use-case for websites that Astro natively supports via the `paginate()` function. `paginate()` will automatically generate the array to return from `getStaticPaths()` that creates one URL for every page of the paginated collection. The page number will be passed as a param, and the page data will be passed as a `page` prop.

```js
export async function getStaticPaths({ paginate }) {
  // Load your data with fetch(), Astro.glob(), etc.
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=150`);
  const result = await response.json();
  const allPokemon = result.results;

  // Return a paginated collection of paths for all posts
  return paginate(allPokemon, { pageSize: 10 });
}

// If set up correctly, The page prop now has everything that
// you need to render a single page (see next section).
const { page } = Astro.props;
```

`paginate()` assumes a file name of `[page].astro` or `[...page].astro`. The `page` param becomes the page number in your URL:

- `/posts/[page].astro` would generate the URLs `/posts/1`, `/posts/2`, `/posts/3`, etc.
- `/posts/[...page].astro` would generate the URLs `/posts`, `/posts/2`, `/posts/3`, etc.

#### The pagination `page` prop

Pagination will pass a `page` prop to every rendered page that represents a single page of data in the paginated collection. This includes the data that you've paginated (`page.data`) as well as metadata for the page (`page.url`, `page.start`, `page.end`, `page.total`, etc). This metadata is useful for things like a "Next Page" button or a "Showing 1-10 of 100" message.

| Name               |         Type          | Description                                                                                                                       |
| :----------------- | :-------------------: | :-------------------------------------------------------------------------------------------------------------------------------- |
| `page.data`        |        `Array`        | Array of data returned from `data()` for the current page.                                                                        |
| `page.start`       |       `number`        | Index of first item on current page, starting at `0` (e.g. if `pageSize: 25`, this would be `0` on page 1, `25` on page 2, etc.). |
| `page.end`         |       `number`        | Index of last item on current page.                                                                                               |
| `page.size`        |       `number`        | How many items per-page.                                                                                                          |
| `page.total`       |       `number`        | The total number of items across all pages.                                                                                       |
| `page.currentPage` |       `number`        | The current page number, starting with `1`.                                                                                       |
| `page.lastPage`    |       `number`        | The total number of pages.                                                                                                        |
| `page.url.current` |       `string`        | Get the URL of the current page (useful for canonical URLs)                                                                       |
| `page.url.prev`    | `string \| undefined` | Get the URL of the previous page (will be `undefined` if on page 1).                                                              |
| `page.url.next`    | `string \| undefined` | Get the URL of the next page (will be `undefined` if no more pages).                                                              |

## `import.meta`

All ESM modules include a `import.meta` property. Astro adds `import.meta.env` through [Vite](https://vitejs.dev/guide/env-and-mode.html).

**`import.meta.env.SSR`** can be used to know when rendering on the server. Sometimes you might want different logic, for example a component that should only be rendered in the client:

```jsx
import { h } from 'preact';

export default function () {
  return import.meta.env.SSR ? <div class="spinner"></div> : <FancyComponent />;
}
```
## Built-in Components

Astro includes several built-in components for you to use in your projects. All built-in components are available in `.astro` files via `import {} from 'astro/components';`.

### `<Markdown />`

The Markdown component is no longer built into Astro. See how to [import Markdown into your Astro files](/en/guides/markdown-content/#importing-markdown) on our Markdown page.

### `<Code />`

```astro
---
import { Code } from 'astro/components';
---
<!-- Syntax highlight some JavaScript code. -->
<Code code={`const foo = 'bar';`} lang="js" />
<!-- Optional: customize your theme. -->
<Code code={`const foo = 'bar';`} lang="js" theme="dark-plus" />
<!-- Optional: Enable word wrapping. -->
<Code code={`const foo = 'bar';`} lang="js" wrap />
```

This component provides syntax highlighting for code blocks at build time (no client-side JavaScript included). The component is powered internally by Shiki and it supports all popular [themes](https://github.com/shikijs/shiki/blob/main/docs/themes.md) and [languages](https://github.com/shikijs/shiki/blob/main/docs/languages.md). Plus, you can add your custom themes and languages by passing them to `theme` and `lang` respectively.

### `<Prism />`

:::note[Installation]

To use the `Prism` highlighter component, first **install** the `@astrojs/prism` package:

<Tabs client:visible>
  <Fragment slot="tab.1.npm">npm</Fragment>
  <Fragment slot="tab.2.yarn">yarn</Fragment>
  <Fragment slot="tab.3.pnpm">pnpm</Fragment>
  <Fragment slot="panel.1.npm">
  ```shell
  npm i @astrojs/prism
  ```
  </Fragment>
  <Fragment slot="panel.2.yarn">
  ```shell
  yarn add @astrojs/prism
  ```
  </Fragment>
  <Fragment slot="panel.3.pnpm">
  ```shell
  pnpm i @astrojs/prism
  ```
  </Fragment>
</Tabs>
:::

```astro
---
import { Prism } from '@astrojs/prism';
---
<Prism lang="js" code={`const foo = 'bar';`} />
```

This component provides language-specific syntax highlighting for code blocks by applying Prism's CSS classes. Note that **you need to provide a Prism CSS stylesheet** (or bring your own) for syntax highlighting to appear! See the [Prism configuration section](/en/guides/markdown-content/#prism-configuration) for more details.

See the [list of languages supported by Prism](https://prismjs.com/#supported-languages) where you can find a language’s corresponding alias. And, you can also display your Astro code blocks with `lang="astro"`!

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

This component provides a way to inspect values on the client-side, without any JavaScript.


[canonical]: https://en.wikipedia.org/wiki/Canonical_link_element
