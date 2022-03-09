---
layout: ~/layouts/MainLayout.astro
title: Styling & CSS
description: Learn how to style components with Astro.
---


INTRO BLAH BLAH: Astro includes special handling to make writing CSS as easy as possible. You can use your favorite libraries, write your own css files, or take advantage of Astro's own scoped styling to target UI frameworks at the component level.

Astro automatically minifies and bundles...

## Astro scoped `<style>`

Styling inside of Astro components is done by adding a `<style>` tag in the component template.

By default, all Astro component styles are **scoped**, meaning they only apply to the HTML elements written in the current component. Any HTML rendered via a child component import is **not** affected by the `<style>` tag.


```astro
// src/components/MyAstroPage.astro
---
import MyComponent from '../components/MyComponent.astro';
---
<style>
  /* Scoped class selector within the component */
  .text {
    font-family: cursive;
  }
  /* Scoped element selector within the component */
  h1 {
    color: red;
  }
</style>

<h1>I’m a scoped style and I’m red!</h1>
<p class="text">I'm a scoped style and I’m cursive!</p>

<!-- unaffected by styles in the `<style>` tag -->
<MyComponent / > 
```
⚠️ These styles won’t apply to any other `h1` tags outside this document. Not even child components!

### Styling children

If you’d like scoped styles to apply to children, you can use the special `:global()` function borrowed from [CSS Modules](https://github.com/css-modules/css-modules) to specifically target **a class and all its descendents**:

```astro
// src/components/MyComponent.astro
---
import PostContent from './Post.astro';
---
<style>
  /* Scoped to current component only */
  h1 {
    color: red;
  }

  /* Scoped to all descendents of the scoped .blog-post class */
  .blog-post :global(h1) {
    color: blue;
  }
</style>

<h1>Title</h1>
<article class="blog-post">
  <PostContent />
</article>
```

This is a great way to style things like blog posts, or documents with CMS-powered content where the contents live outside of Astro. But be careful: components that appear different based on whether or not they have a certain parent component can become difficult to troubleshoot.


## Astro `<style global>`

To apply styles globally, without the need for a .css file or stylesheet link, Astro allows you to use `<style global>` within any Astro component, page or layout to wrap style definitions. 

```html
<style global>
  /* Applies to all h1 tags in your entire site */
  h1 {
    font-size: 32px;
  }
</style>

<h1>Globally-styled</h1>
```

You can achieve the same by using the `:global()` function at the root of a selector:

```html
<style>
  /* Applies to all h1 tags in your entire site */
  :global(h1) {
    font-size: 32px;
  }

  /* normal scoped h1 that applies to this file only */
  h1 {
    color: blue;
  }
</style>
```

> ⚠️ These styles apply throughout your entire project, even in unrelated components! 

It may be easy to lose track of which Astro component is defining styles globally, and harder to troubleshoot errant global styles when they’re scattered around and not in a central CSS file. So, this method is recommended only when you cannot otherwise apply global styling via an import or `<link>`.


## External Styles

There are two ways to resolve global stylesheets: an ESM import for files located within your project source, and an absolute URL link for files in your /public directory, or hosted outside of your project.


### Import a Global Stylesheet
To import a global stylesheet, import it directly in an Astro component:

```astro
---
// This also works for preprocessor files like .scss, .styl, etc.
import '../styles/utils.css';
---
<!-- scoped Astro styles that apply only to the current page (not to children or other components) -->
<style>
  .title {
    font-size: 32px;
    font-weight: bold;
  }
</style>

<!-- the ".title" class is scoped, but we can also use our global "align-center" and "margin top: 4" utility classes from utils.css -->
<h1 class="title align-center mt4">Scoped Page Title</h1>
```

**Note**: At the moment, you must import styles before importing any other components. 

### Stylesheet Link

When your stylesheet is located in your `/public` directory, or when using a public stylesheet hosted offsite (e.g. a Prism theme), use a `<link href="/absoluteURL.css">` tag in your `head` 

```html
<head>
  <link rel="stylesheet" href="/styles/global.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.24.1/themes/prism-tomorrow.css">
</head>
```

_Note: CSS inside `public/` will **not** be transformed! Place it within `src/` instead._

## Variables in Styles

In Astro v0.21+, _serializable_ server-side variables can be passed into client-side `<style>`.

```astro
---
// tick.astro
const foregroundColor = "rgb(221 243 228)";
const backgroundColor = "rgb(24 121 78)";
---
<style define:vars={{ foregroundColor, backgroundColor }}>
h-tick {
  background-color: var(--backgroundColor);
  border-radius: 50%;
  color: var(--foregroundColor);
  height: 15px;
  width: 15px;
}
</style>
<h-tick>✓</h-tick>
```

## PostCSS

You can use Tailwind or any [PostCSS plugin](https://www.postcss.parts/) by adding a `postcss.config.cjs` file to the root of your project. Follow the documentation for the plugin you’re trying to install for configuration and setup.

Be aware that this plugin will run on all CSS in your project, including any files that compiled to CSS (like `.scss` Sass files, for example).

_Note: CSS in `public/` **will not be transformed!** Instead, place it within `src/` if you’d like PostCSS to run over your styles._

### Autoprefixer

[Autoprefixer][autoprefixer] is a PostCSS plugin that takes care of cross-browser CSS compatibility for you. Use it in astro by installing it (`npm install --save-dev autoprefixer`) and adding a `postcss.config.cjs` file to the root of your project:

```js
// postcss.config.cjs
module.exports = {
  plugins: {
    autoprefixer: {},
  },
};
```

### Tailwind

To configure [Tailwind][tailwind] 

1.Install the following dependencies:

```
npm install --save-dev tailwindcss
npm install --save-dev postcss
```


2. Create `tailwind.config.cjs` and `postcss.config.cjs` in your project root:

```js
// tailwind.config.cjs
module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{astro,js,jsx,svelte,ts,tsx,vue}',
  ],
  // more options here
};
```

```js
// postcss.config.cjs
module.exports = {
  plugins: {
    tailwindcss: {},
  },
};
```


3. Create a `src/styles/global.css` file with [Tailwind utilities][tailwind-utilities]:

```css
/* src/styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. Import your stylesheet to your Astro page (or layout template):

```astro
<head>
  <style global>
    @import "../styles/global.css";
  </style>
</head>
```

#### Migrating to v0.24

As of [version 0.24.0-next](https://github.com/withastro/astro/releases/tag/astro%400.24.0-next.0) Astro will no longer support [Astro.resolve()][astro-resolve]. See the [Migration Guide](/en/migrate) for more details.


## CSS Preprocessors

Astro supports CSS preprocessors such as [Sass][sass], [Stylus][stylus], and [Less][less] through [Vite][vite-preprocessors].

### Sass

 ```
 npm install -D sass
 ````
 Use  `<style lang="scss">` or `<style lang="sass">` (indented) in `.astro` files

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

Additionally, [PostCSS](#-postcss) is supported, but the setup is [slightly different](#-postcss).


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
