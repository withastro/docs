---
layout: ~/layouts/MainLayout.astro
title: TypeScript
description: Learn how to use Astro's built-in TypeScript support.
i18nReady: true
---

Astro ships with built-in support for [TypeScript](https://www.typescriptlang.org/). You can import `.ts` and `.tsx` files in your Astro project, and even write TypeScript code directly inside your [Astro component](/en/core-concepts/astro-components/#the-component-script).

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
    // Add type definitions for our Vite runtime.
    "types": ["vite/client"],
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
const { greeting = 'Hello', name } = Astro.props
---
<h2>{greeting}, {name}!</h2>
```


📚 Read more about [`.ts` file imports](/en/guides/imports/#typescript) in Astro.  
📚 Read more about [TypeScript Configuration](https://www.typescriptlang.org/tsconfig/).
