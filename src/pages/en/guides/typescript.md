---
layout: ~/layouts/MainLayout.astro
title: TypeScript
description: Learn how to use Astro's built-in TypeScript support.
i18nReady: true
---

Astro ships with built-in support for [TypeScript](https://www.typescriptlang.org/). You can import `.ts` and `.tsx` files in your Astro project, write TypeScript code directly inside your [Astro component](/en/core-concepts/astro-components/#the-component-script), and even use an [`astro.config.ts`](/en/guides/configuring-astro/#the-astro-config-file) file if you like.

Astro doesn't perform any type checking itself. Type checking should be taken care of outside of Astro, either by your IDE or through a separate script. The [Astro VSCode Extension](/en/editor-setup/) automatically provides TypeScript hints and errors in your open files.

## Setup

It is **strongly recommended** that you create a `tsconfig.json` file in your project, so that tools like Astro and VSCode know how to understand your project. Some features (like npm package imports) aren't fully supported in TypeScript without a `tsconfig.json` file.

Some TypeScript configuration options require special attention in Astro. Below is our recommended starter `tsconfig.json` file, which you can copy-and-paste into your own project. Every [astro.new template](https://astro.new/) includes this `tsconfig.json` file by default.

```json
// Example: starter tsconfig.json for Astro projects
{
  "compilerOptions": {
    // Enable top-level await and other modern ESM features.
    "target": "ESNext",
    "module": "ESNext",
    // Enable node-style module resolution, for things like npm package imports.
    "moduleResolution": "node",
    // Enable JSON imports.
    "resolveJsonModule": true,
    // Enable stricter transpilation for better output.
    "isolatedModules": true,
    // Add type definitions for our Astro runtime.
    "types": ["astro/client"],
    // Tell TypeScript where your build output is
    "outDir": "./dist"
  }
}
```

## Type Imports

Use type imports & exports whenever possible. This will help you avoid edge-cases where Astro's bundler may try to incorrectly bundle your imported types as if they were JavaScript.

```diff
- import { SomeType } from './script';
+ import type { SomeType } from './script';
```

## Import Aliases

Astro supports [import aliases](/en/guides/aliases/) that you define in your `tsconfig.json` & `jsconfig.json` `paths` configuration. [Read our guide](/en/guides/aliases/) to learn more.


```ts
import HelloWorld from '@components/HelloWorld.astro';
import Layout from '@layouts/Layout.astro';
```

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"]
    }
  }
}
```

## Component Props

Astro supports typing your component props via TypeScript. To enable, export a TypeScript `Props` interface from your Astro component. The [Astro VSCode Extension](/en/editor-setup/) will automatically look for the `Props` export and give you proper TS support when you use that component inside another template.

```astro
---
// Example: HelloWorld.astro
export interface Props {
  name: string;
  greeting?: string;
}
const { greeting = 'Hello', name } = Astro.props as Props;
---
<h2>{greeting}, {name}!</h2>
```

### Built-in attribute types

Astro provides JSX type definitions to check that your markup is using valid HTML attributes. You can use these types to help build component props. For example, if you were building a `<Link>` component, you could do the following to mirror the default HTML attributes in your component’s prop types.

```astro
---
export type Props = astroHTML.JSX.AnchorHTMLAttributes;
const { href, ...attrs } = Astro.props as Props;
---
<a {href} {...attrs}>
  <slot />
</a>
```

It is also possible to extend the default JSX definitions to add non-standard attributes by redeclaring the `astroHTML.JSX` namespace in a `.d.ts` file.

```ts
// src/custom-attributes.d.ts

declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    'data-count'?: number;
    'data-label'?: string;
  }
}
```

:::note
`astroHTML` is injected globally inside `.astro` components. To use it in TypeScript files, use a [triple-slash directive](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html):

```ts
/// <reference types="astro/astro-jsx" />

type MyAttributes = astroHTML.JSX.ImgHTMLAttributes;
```
:::

## Type checking

To see type errors in your editor, please make sure that you have the [Astro VS Code extension](/en/editor-setup/) installed. Please note that the `astro start` and `astro build` commands will transpile the code with esbuild, but will not run any type checking. To prevent your code from building if it contains TypeScript errors, change your "build" script in `package.json` to the following:

```diff
-    "build": "astro build",
+    "build": "astro check && tsc --noEmit && astro build",
```

:::note
`astro check` only checks types within `.astro` files, and `tsc --noEmit` only checks types within `.ts` and `.tsx` files. To check types within Svelte and Vue files, you can use the [`svelte-check`](https://www.npmjs.com/package/svelte-check) and the [`vue-tsc`](https://www.npmjs.com/package/vue-tsc) packages respectively.
:::

📚 Read more about [`.ts` file imports](/en/guides/imports/#typescript) in Astro.  
📚 Read more about [TypeScript Configuration](https://www.typescriptlang.org/tsconfig/).
