---
layout: ~/layouts/MainLayout.astro
title: Styling & CSS
description: Learn how to style components with Astro.
setup: |
  import Since from '../../../components/Since.astro';
---

Astro was designed to make styling and writing CSS a breeze. Write your own CSS directly inside of an Astro component or import your favorite CSS library like [Tailwind][tailwind]. Advanced styling languages like [Sass][sass] and [Less][less] are also supported.

## Styling in Astro

Styling an Astro component is as easy as adding a `<style>` tag to your component or page template. When you place a `<style>` tag inside of an Astro component, Astro will detect the CSS and handle your styles for you, automatically.

```astro
<style>
  h1 { color: red; }
</style>
```

### Scoped Styles

Astro `<style>` CSS rules are automatically **scoped by default.**. Scoped styles are compiled behind-the-scenes to only apply to HTML written inside of that same component. The CSS that you write inside of an Astro component is automatically encapsulated inside of that component. 

```diff
<style>
-  h1 { color: red; }
+  h1.astro-HHNQFKH6 { color: red; }
-  .text { color: blue; }
+  .text.astro-HHNQFKH6 { color: blue; }
</style>
```

Scopes styles don't leak and won't impact the rest of your site. In Astro, it is okay to use low-specificity selectors like `h1 {}` or `p {}` because they will be compiled with scopes in the final output. 

Scoped styles also won't apply to other Astro components contained inside of your template. If you need to style a child component, consider wrapping that component in a `<div>` (or other element) that you can then style. 
#### Global Styles

While we recommend scoped styles for most components, you may eventually find a valid reason to write global, unscoped CSS. You can opt-out of automatic CSS scoping with the `<style global>` attribute.

```html
<style global>
  /* Unscoped, delivered as-is to the browser.
     Applies to all <h1> tags on your site. */
  h1 { color: red; }
</style>
```

You can also mix global & scoped CSS rules together in the same `<style>` tag using the `:global()` selector. This becomes a powerful pattern for applying CSS styles to children of your component.

```astro
<style>
  /* Scoped to this component, only. */
  h1 { color: red; }
  /* Mixed: Applies to child `h1` elements only. */
  article :global(h1) {
    color: blue;
  }
</style>
<h1>Title</h1>
<article><slot /></article>
```

This is a great way to style things like blog posts, or documents with CMS-powered content where the contents live outside of Astro. But be careful: components whose appearance differs based on whether or not they have a certain parent component can become difficult to troubleshoot.

Scoped styles should be used as often as possible. Global styles should be used only as-needed.
### CSS Variables

<Since v="0.21.0" />

The Astro `<style>` can reference any CSS variables available on the page. You can also pass CSS variables directly from your component front matter using the `define:vars` directive.

```astro
---
const foregroundColor = "rgb(221 243 228)";
const backgroundColor = "rgb(24 121 78)";
---
<style define:vars={{ foregroundColor, backgroundColor }}>
  h1 {
    background-color: var(--backgroundColor);
    color: var(--foregroundColor);
  }
</style>
<h1>Hello</h1>
```

Any *serializable* front matter variable is supported, including props passed to your component through `Astro.props`.

## External Styles

There are two ways to resolve external global stylesheets: an ESM import for files located within your project source, and an absolute URL link for files in your `public/` directory, or hosted outside of your project. 

📚 Read more about using [static assets](/en/guides/imports) located in `public/` or `src/`.

### Import a Stylesheet

You can import stylesheets in your Astro component front matter using ESM import syntax. CSS imports work like any other ESM import, and should be referenced as relative to the component.

```astro
---
// Astro will bundle and optimize this CSS for you automatically
// This also works for preprocessor files like .scss, .styl, etc.
import '../styles/utils.css';
---
<html><!-- Your page here --></html>
```

CSS `import` via ESM are supported inside of any JavaScript file, including JSX components like React & Preact.  This can be useful for writing granular, per-component styles for your React components.

#### Advanced Use Cases

If you really need to control how styles are imported and included in the page, CSS can be imported directly without being bundled or optimized by Astro.

> ⚠️WARNING⚠️:
> Be careful when bypassing Astro's built-in CSS bundling! Styles won't be included in the built output - this is best used in combination with `set:html` to inline styles directly into the built HTML page.

```astro
---
import styles from '../styles/main.css?raw';
---

<!-- inline contents of main.css directly in the built HTML -->
<style set:html={styles}></style>
```

```astro
---
import stylesUrl from '../styles/main.css?url';
---

<!-- manually add a link and preload hint to the built CSS file -->
<link rel="preload" href={sytylesUrl} as="style">
<link rel="stylesheet" href={stylesUrl}>
```

See [Vite's docs](https://vitejs.dev/guide/assets.html#importing-asset-as-url) for full details. Take note of the [`assetsInlineLimit`](https://vitejs.dev/config/#build-assetsinlinelimit) option when using `?url` - a base64 string will be returned when the CSS file is below the inline filesize limit!

### Load an External Stylesheet

You can also use the `<link>` element to load a stylesheet on the page. This should be an absolute URL path to a CSS file located in your `/public` directory, or an URL to an external website. Relative `<link>` href values are not supported. 

```html
<head>
  <!-- Local: /public/styles/global.css -->
  <link rel="stylesheet" href="/styles/global.css" />
  <!-- External  -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.24.1/themes/prism-tomorrow.css">
</head>
```

Because this approach uses the `public/` directory, it skips the normal CSS processing, bundling and optimizations that are provided by Astro. If you need these transformations, use the [Import a Stylesheet](#import-a-stylesheet) method above.


## CSS Integrations

Astro comes with support for adding popular CSS libraries, tools and frameworks to your project like PostCSS, Tailwind and more! 

📚 See the [Integrations Guide](/en/guides/integrations-guide/) for instructions on installing, importing and configuring these integrations.


## CSS Preprocessors

Astro supports CSS preprocessors such as [Sass][sass], [Stylus][stylus], and [Less][less] through [Vite][vite-preprocessors].

### Sass

 ```
 npm install -D sass
 ````
 Use  `<style lang="scss">` or `<style lang="sass">` in `.astro` files

### Stylus

```
npm install -D stylus
``` 
Use `<style lang="styl">` or `<style lang="stylus">` in `.astro` files

### Less
```
npm install -D less
``` 
Use `<style lang="less">` in `.astro` files.


> You can also use all of the above CSS preprocessors within JS frameworks as well! Be sure to follow the patterns each framework recommends:

- **React** / **Preact**: `import Styles from './styles.module.scss'`;
- **Vue**: `<style lang="scss">`
- **Svelte**: `<style lang="scss">`

Additionally, PostCSS is supported as an [integration](/en/guides/integrations-guide/).


---

## Frameworks and Libraries

### 📘 React / Preact

`.jsx` files support both global CSS and CSS Modules. To enable the latter, use the `.module.css` extension (or `.module.scss`/`.module.sass` if using Sass).

```js
import './global.css'; // include global CSS
import Styles from './styles.module.css'; // Use CSS Modules (must end in `.module.css`, `.module.scss`, or `.module.sass`!)
```

### 📗 Vue

Vue in Astro supports the same methods as `vue-loader` does:

- [vue-loader - Scoped CSS][vue-scoped]
- [vue-loader - CSS Modules][vue-css-modules]

### 📕 Svelte

Svelte in Astro also works exactly as expected: [Svelte Styling Docs][svelte-style].



[less]: https://lesscss.org/
[sass]: https://sass-lang.com/
[stylus]: https://stylus-lang.com/
[svelte-style]: https://svelte.dev/docs#style
[tailwind]: https://tailwindcss.com
[vite-preprocessors]: https://vitejs.dev/guide/features.html#css-pre-processors
[vue-css-modules]: https://vue-loader.vuejs.org/guide/css-modules.html
[vue-scoped]: https://vue-loader.vuejs.org/guide/scoped-css.html
