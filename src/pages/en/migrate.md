---
layout: ~/layouts/MainLayout.astro
title: Migration Guide
description: How to migrate your project to latest version of Astro.
---

Until Astro reaches v1.0, we expect to make some breaking changes across minor versions (ex: `v0.1 -> v0.2`). This guide exists to help you migrate to the latest versions of Astro and keep your codebase up-to-date.
## Planned Deprecations

Astro is currently testing its next build engine behind an opt-in flag: `--experimental-static-build`. You can learn more about this project by reading our blog post [Scaling Astro to 10,000+ Pages.](https://astro.build/blog/experimental-static-build/)

In a future version of Astro, this will become the default build behavior. To prepare for the transition, be aware of the following changes that will be required to move to this new build engine. You can make these changes to your codebase at any time so that you are ready ahead of schedule.

### Deprecated: Astro.resolve()

`Astro.resolve()` allows you to get resolved URLs to assets that you might want to reference in the browser. This was most commonly used inside of  `<link>` and `<img>` tags to load CSS files and images as needed. Unfortunately, this will no longer work in future versions of Astro. Instead, you'll want to upgrade your asset references to one of the following future-proof options available going forward:

#### How to Resolve CSS Files

**1. ESM Import (Recommended)**

**Example:** `import './style.css';`  
**When to use this:** If your CSS file lives inside of the `src/` directory, and you want your CSS to be bundled and optimized by Astro.

Use an ESM import to add some CSS onto the page. Astro detects all CSS imports and is able to build, optimize, and add your CSS to the page automatically.

```astro
---
// Example: Astro will include and optimize this CSS for you automatically
import './style.css';
---
<html><!-- Your page here --></html>
```

This type of reference should work anywhere that ESM imports are supported, including:
- any JavaScript/TypeScript file
- Astro component front matter
- non-Astro components like React, Svelte, and others


**2. Absolute URL Path**

**Example:** `<link href="/style.css">`  
**When to use this:** If your CSS file lives inside of `public/`, and you prefer to create your HTML `link` element yourself.

You can references files inside of the `public/` directory by absolute URL path, without adding an `import`. This is a good option if you want to control the `<link>` tag on the page yourself. However, this approach also skips the CSS processing, bundling and optimizations provided by Astro out of the box.

For the best possible CSS, we recommend using the first approach in most cases.

#### How to Resolve Images & Other Assets


**1. Absolute URL Path (Recommended)**

**Example:** `<img src="/penguin.png">`
**When to use this:** If your asset lives inside of `public/`.

If you place your images inside of `public/` you can safely reference them by absolute URL path. This is the simplest form that you can use today, and recommend for most users.

**1. ESM Import**

**Example:** `import imgUrl from './penguin.png'`
**When to use this:** If your asset lives inside of the `src/` directory.

This works inside of any JavaScript or Astro component, and returns a resolved URL to the final image. Once you have the resolved URL, you can use it anywhere inside of the component template.

```astro
---
// Example: Astro will include this image file in your final build
import imgUrl from './penguin.png';
---
<img src={imgUrl} />
```

While this is a bit more code than our recommended option, the use of `import` allows Astro to perform some simple build optimizations on the asset. For example, any asset inside of `src/` that is imported using an ESM import (`import imgUrl from './penguin.png'`) will have its filename hashed automatically. This can let you cache the file more aggressively on the server, improving performance. In the future, Astro may add more optimizations like image processing for any images inside of your `src/` folder.

**Tip:** If you dislike static ESM imports, Astro also supports dynamic ESM imports. We only recommend this option if you prefer this syntax: `<img src={(await import('./penguin.png')).default} />`.

### Deprecated: `<script>` Default Processing

Previously, all `<script>` elements were read from the final HTML output and processed + bundled automatically. This behavior is no longer the default. Starting in `--experimental-static-build`, you must opt-in to `<script>` element processing via the `hoist` attribute:

```astro
<script>
  // Will be rendered into the HTML exactly as written!
  // ESM imports will not be resolved relative to the file.
</script>
<script hoist>
  // Processed! Bundled! ESM imports work, even to npm packages.
</script>
```


## Migrate to v0.23

### Missing Sass Error

```
Preprocessor dependency "sass" not found. Did you install it?
```

In our quest to reduce npm install size, we've moved [Sass](https://sass-lang.com/) out to an optional dependency. If you use Sass in your project, you'll want to make sure that you run `npm install sass --save-dev` to save it as a dependency. 

### Deprecated: Unescaped HTML

In Astro v0.23+, unescaped HTML content in expressions is now deprecated.
In future releases, content within expressions will have strings escaped to protect against unintended HTML injection.

```diff
- <h1>{title}</h1> <!-- <h1>Hello <strong>World</strong></h1> -->
+ <h1>{title}</h1> <!-- <h1>Hello &lt;strong&gt;World&lt;/strong&gt;</h1> -->
```

To continue injecting unescaped HTML, you can now use `set:html`.

```diff
- <h1>{title}</h1>
+ <h1 set:html={title} />
```

To avoid a wrapper element, `set:html` can work alongside `<Fragment>`.

```diff
- <h1>{title}!</h1>
+ <h1><Fragment set:html={title}>!</h1>
```

You can also protect against unintended HTML injection with `set:text`.

```astro
<h1 set:text={title} /> <!-- <h1>Hello &lt;strong&gt;World&lt;/strong&gt;</h1> -->
```

## Migrate to v0.21

### Vite

Starting in v0.21, Astro is built with [Vite].
As a result, configurations written in `snowpack.config.mjs` should be moved into `astro.config.mjs`.

```js
// @ts-check

/** @type {import('astro').AstroUserConfig} */
export default {
  renderers: [],
  vite: {
    plugins: [],
  },
};
```

To learn more about configuring Vite, please visit their [configuration guide](https://vitejs.dev/config/).

#### Vite Plugins

In Astro v0.21+, Vite plugins may be configured within `astro.config.mjs`.

```js
import { imagetools } from 'vite-imagetools';

export default {
  vite: {
    plugins: [imagetools()],
  },
};
```

To learn more about Vite plugins, please visit their [plugin guide](https://vitejs.dev/guide/using-plugins.html).

#### Vite Changes to Renderers

In Astro v0.21+, plugins should now use `viteConfig()`.

```diff
// renderer-svelte/index.js
+ import { svelte } from '@sveltejs/vite-plugin-svelte';

export default {
  name: '@astrojs/renderer-svelte',
  client: './client.js',
  server: './server.js',
-  snowpackPlugin: '@snowpack/plugin-svelte',
-  snowpackPluginOptions: { compilerOptions: { hydratable: true } },
+  viteConfig() {
+    return {
+      optimizeDeps: {
+        include: ['@astrojs/renderer-svelte/client.js', 'svelte', 'svelte/internal'],
+        exclude: ['@astrojs/renderer-svelte/server.js'],
+      },
+      plugins: [
+        svelte({
+          emitCss: true,
+          compilerOptions: { hydratable: true },
+        }),
+      ],
+    };
+  },
}
```

To learn more about Vite plugins, please visit their [plugin guide](https://vitejs.dev/guide/using-plugins.html).

> In prior releases, these were configured with `snowpackPlugin` or `snowpackPluginOptions`.


### Aliasing

In Astro v0.21+, import aliases can be added from `tsconfig.json` or `jsconfig.json`.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["src/components/*"]
    }
  }
}
```

_These aliases are integrated automatically into [VSCode](https://code.visualstudio.com/docs/languages/jsconfig) and other editors._

### File Extensions in Imports

In Astro v0.21+, files need to be referenced by their actual extension, exactly as it is on disk. In this example, `Div.tsx` would need to be referenced as `Div.tsx`, not `Div.jsx`.

```diff
- import Div from './Div.jsx' // Astro v0.20
+ import Div from './Div.tsx' // Astro v0.21
```

This same change applies to a compile-to-css file like `Div.scss`:

```diff
- <link rel="stylesheet" href={Astro.resolve('./Div.css')}>
+ <link rel="stylesheet" href={Astro.resolve('./Div.scss')}>
```

### Removed: Components in Frontmatter

Previously, you could create mini Astro Components inside of the Astro Frontmatter, using JSX syntax instead of Astro’s component syntax. This was always a bit of a hack, but in the new compiler it became impossible to support. We hope to re-introduce this feature in a future release of Astro using a different, non-JSX API.

To migrate to v0.21+, please convert all JSX Astro components (that is, any Astro components created inside of another component’s frontmatter) to standalone components.


### Styling Changes

#### Autoprefixer

Autoprefixer is no longer run by default. To enable:

1. Install the latest version (`npm i autoprefixer`)
2. Create a `postcss.config.cjs` file at the root of your project with:
   ```js
   module.exports = {
     plugins: {
       autoprefixer: {},
     },
   };
   ```

#### Tailwind CSS

Ensure you have PostCSS installed. This was optional in previous releases, but is required now:

1. Install the latest version of postcss (`npm i -D postcss`)
2. Create a `postcss.config.cjs` file at the root of your project with:
   ```js
   module.exports = {
     plugins: {
       tailwindcss: {},
     },
   };
   ```
   For more information, read the [Tailwind CSS documentation](https://tailwindcss.com/docs/installation#add-tailwind-as-a-post-css-plugin)


### Known Issues

#### Imports on top

In Astro v0.21+, a bug has been introduced that requires imports inside components to be at the top of your front matter.

```astro
---
import Component from '../components/Component.astro'
const whereShouldIPutMyImports = "on top!"
---
```


[vite]: https://vitejs.dev
