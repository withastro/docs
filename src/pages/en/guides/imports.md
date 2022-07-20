---
layout: ~/layouts/MainLayout.astro
title: Static Assets
description: Learn how to import different content types with Astro.
i18nReady: true
---

Astro supports most static assets with zero configuration required. You can use the `import` statement anywhere in your project JavaScript (including your Astro front matter script) and Astro will include a built, optimized copy of that static asset in your final build. `@import` is also supported inside of CSS & `<style>` tags.

## Supported File Types

The following file types are supported out-of-the-box by Astro:

- Astro Components (`.astro`)
- Markdown (`.md`)
- JavaScript (`.js`, `.mjs`)
- TypeScript (`.ts`, `.tsx`)
- NPM Packages
- JSON (`.json`)
- JSX (`.jsx`, `.tsx`)
- CSS (`.css`)
- CSS Modules (`.module.css`)
- Images & Assets (`.svg`, `.jpg`, `.png`, etc.)

If you don't see the asset type that you're looking for, check out our [Integrations Library](https://astro.build/integrations/). You can extend Astro to add support for different file types, like Svelte and Vue components.

This guide details how different types of assets are built by Astro, and how to import them successfully.

Remember that you can also place any static asset in the [`public/` directory](/en/core-concepts/project-structure/#public) of your project, and Astro will copy them directly into your final build. `public/` files are not built or bundled by Astro, which means that any type of file is supported. You can reference a `public/` file by a URL path directly in your HTML templates.

## JavaScript

```js
import { getUser } from './user.js';
```

JavaScript can be imported using normal ESM `import` & `export` syntax. This works as expected, based on default Node.js and browser behavior.

## TypeScript

```js
import { getUser } from './user';
import type { UserType } from './user';
```

Astro includes built-in support for [TypeScript](https://www.typescriptlang.org/). You can import `.ts` and `.tsx` files directly in your Astro project, and even write TypeScript code directly inside your [Astro component script](/en/core-concepts/astro-components/#the-component-script) and any [hoisted script tags](/en/core-concepts/astro-components/#client-side-scripts).

**Astro doesn't perform any type checking itself.** Type checking should be taken care of outside of Astro, either by your IDE or through a separate script. For type checking Astro files, the [`astro check` command](/en/reference/cli-reference/#astro-check) is provided.

:::note[TypeScript and file extensions]
Per [TypeScript's module resolution rules](https://www.typescriptlang.org/docs/handbook/module-resolution.html), `.ts` and `.tsx` file extensions should not be used when importing TypeScript files. Instead, either use `.js`/`.jsx` file extensions or completely omit the file extension.

```ts
import { getUser } from './user.js'; // user.ts
import MyComponent from "./MyComponent"; // MyComponent.tsx
```

:::

📚 Read more about [TypeScript support in Astro](/en/guides/typescript/).

## JSX / TSX

```js
import { MyComponent } from './MyComponent.jsx';
```

Astro includes built-in support for JSX (`*.jsx` and `*.tsx`) files in your project. JSX syntax is automatically transpiled to JavaScript.

While Astro understands JSX syntax out-of-the-box, you will need to include a framework integration to properly render frameworks like React, Preact and Solid. Check out our [Using Integrations](/en/guides/integrations-guide/) guide to learn more.

:::note
**Astro does not support JSX in `.js`/`.ts` files.** JSX will only be handled inside of files that end with the `.jsx` and `.tsx` file extensions.
:::

## NPM Packages

```js
// Returns the React & React-DOM npm packages
import React from 'react';
import ReactDOM from 'react-dom';
```

Astro lets you import npm packages directly in the browser. Even if a package was published using a legacy format, Astro will up-convert the package to ESM before serving it to the browser.

## JSON

```js
// Load the JSON object via the default export
import json from './data.json';
```

Astro supports importing JSON files directly into your application. Imported files return the full JSON object in the default import.

## CSS

```js
// Load and inject 'style.css' onto the page
import './style.css';
```

Astro supports importing CSS files directly into your application. Imported styles expose no exports, but importing one will automatically add those styles to the page. This works for all CSS files by default, and can support compile-to-CSS languages like Sass & Less via plugins.

If you prefer not to write CSS, Astro also supports all popular CSS-in-JS libraries (ex: styled-components) for styling.

## CSS Modules

```jsx
// 1. Converts './style.module.css' classnames to unique, scoped values.
// 2. Returns an object mapping the original classnames to their final, scoped value.
import styles from './style.module.css';

// This example uses JSX, but you can use CSS Modules with any framework.
return <div className={styles.error}>Your Error Message</div>;
```

Astro supports CSS Modules using the `[name].module.css` naming convention. Like any CSS file, importing one will automatically apply that CSS to the page. However, CSS Modules export a special default `styles` object that maps your original classnames to unique identifiers.

CSS Modules help you enforce component scoping & isolation on the frontend with uniquely-generated class names for your stylesheets.

## Other Assets

```jsx
import imgReference from './image.png'; // img === '/src/image.png'
import svgReference from './image.svg'; // svg === '/src/image.svg'
import txtReference from './words.txt'; // txt === '/src/words.txt'

// This example uses JSX, but you can use import references with any framework.
<img src={imgReference} />;
```

All other assets not explicitly mentioned above can be imported via ESM `import` and will return a URL reference to the final built asset. This can be useful for referencing non-JS assets by URL, like creating an image element with a `src` attribute pointing to that image.

It can also be useful to place images in the `public/` folder as explained on the [project-structure page](/en/core-concepts/project-structure/#public).

## WASM

```js
// Loads and initializes the requested WASM file
const wasm = await WebAssembly.instantiateStreaming(fetch('/example.wasm'));
```

Astro supports loading WASM files directly into your application using the browser’s [`WebAssembly`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly) API.


## Node Builtins

We encourage Astro users to avoid Node.js builtins (`fs`, `path`, etc.) whenever possible. Astro aims to be compatible with multiple JavaScript runtimes in the future. This includes [Deno](https://deno.land/) and [Cloudflare Workers](https://workers.cloudflare.com/) which do not support Node builtin modules such as `fs`.

Our aim is to provide Astro alternatives to common Node.js builtins. However, no such alternatives exist today. So, if you _really_ need to use these builtin modules we don't want to stop you. Astro supports Node.js builtins using Node’s newer `node:` prefix. If you want to read a file, for example, you can do so like this:

```astro
---
// Example: import the "fs/promises" builtin from Node.js
import fs from 'node:fs/promises';

const url = new URL('../../package.json', import.meta.url);
const json = await fs.readFile(url, 'utf-8');
const data = JSON.parse(json);
---

<span>Version: {data.version}</span>
```
