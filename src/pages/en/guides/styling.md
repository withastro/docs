---
layout: ~/layouts/MainLayout.astro
title: Styling & CSS
description: Learn how to style components with Astro.
setup: |
  import Since from '../../../components/Since.astro';
---

Astro was designed to make styling and writing CSS a breeze. Write your own CSS directly inside of an Astro component or import your favorite CSS library like [Tailwind](#TODO). Advanced styling languages like [Sass](#TODO) and [Less](#TODO) are also supported.

## Styling in Astro

Styling an Astro component is as easy as adding a `<style>` tag to your component or page template. When you place a `<style>` tag inside of an Astro component, Astro will detect the CSS and handle your styles for you, automatically.

'''
TODO: SUPER SIMPLE EXAMPLE
Like, just a style tag in a basic component. 
No need to make the distinction between scoping and global just yet.
'''

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

Additionally, [PostCSS](#postcss) is supported, but the setup is slightly different.


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



[autoprefixer]: https://github.com/postcss/autoprefixer
[astro-component]: /en/core-concepts/astro-components#css-styles
[astro-resolve]: /en/reference/api-reference#astroresolve
[bem]: http://getbem.com/introduction/
[box-model]: https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/The_box_model
[browserslist]: https://github.com/browserslist/browserslist
[browserslist-defaults]: https://github.com/browserslist/browserslist#queries
[cassie-evans-css]: https://twitter.com/cassiecodes/status/1392756828786790400?s=20
[container-queries]: https://ishadeed.com/article/say-hello-to-css-container-queries/
[css-modules]: https://github.com/css-modules/css-modules
[css-treeshaking]: https://css-tricks.com/how-do-you-remove-unused-css-from-a-site/
[fouc]: https://en.wikipedia.org/wiki/Flash_of_unstyled_content
[layout-isolated]: https://web.archive.org/web/20210227162315/https://visly.app/blogposts/layout-isolated-components
[less]: https://lesscss.org/
[issues]: https://github.com/withastro/astro/issues
[magic-number]: https://css-tricks.com/magic-numbers-in-css/
[material-ui]: https://material.io/components
[peace-on-css]: https://didoo.medium.com/let-there-be-peace-on-css-8b26829f1be0
[sass]: https://sass-lang.com/
[sass-use]: https://sass-lang.com/documentation/at-rules/use
[smacss]: http://smacss.com/
[styled-components]: https://styled-components.com/
[stylus]: https://stylus-lang.com/
[styled-jsx]: https://github.com/vercel/styled-jsx
[stylelint]: https://stylelint.io/
[svelte-style]: https://svelte.dev/docs#style
[tailwind]: https://tailwindcss.com
[tailwind-utilities]: https://tailwindcss.com/docs/adding-new-utilities#using-css
[utility-css]: https://frontstuff.io/in-defense-of-utility-first-css
[vite-preprocessors]: https://vitejs.dev/guide/features.html#css-pre-processors
[vue-css-modules]: https://vue-loader.vuejs.org/guide/css-modules.html
[vue-scoped]: https://vue-loader.vuejs.org/guide/scoped-css.html
