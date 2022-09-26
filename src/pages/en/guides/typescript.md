---
layout: ~/layouts/MainLayout.astro
title: TypeScript
description: Learn how to use Astro's built-in TypeScript support.
i18nReady: true
---

Astro ships with built-in support for [TypeScript](https://www.typescriptlang.org/). You can import `.ts` and `.tsx` files in your Astro project, write TypeScript code directly inside your [Astro component](/en/core-concepts/astro-components/#the-component-script), and even use an [`astro.config.ts`](/en/guides/configuring-astro/#the-astro-config-file) file if you like.

Astro doesn't perform any type checking itself. Type checking should be taken care of outside of Astro, either by your IDE or through a separate script. The [Astro VSCode Extension](/en/editor-setup/) automatically provides TypeScript hints and errors in your open files.

## Setup

Astro starter projects include a `tsconfig.json` file in your project. Even if you don't write TypeScript code, this file is important so that tools like Astro and VS Code know how to understand your project. Some features (like npm package imports) aren't fully supported in the editor without a `tsconfig.json` file. If you install Astro manually, be sure to create this file yourself.

Three extensible `tsconfig.json` templates are included in Astro: `base`, `strict`, and `strictest`. The `base` template enables support for modern JavaScript features and is also used as a basis for the other templates. We recommend using `strict` or `strictest` if you plan to write TypeScript in your project. You can view and compare the three template configurations at [astro/tsconfigs/](https://github.com/withastro/astro/blob/main/packages/astro/tsconfigs/).

To inherit from one of the templates, use [the `extends` setting](https://www.typescriptlang.org/tsconfig#extends):

```json title="tsconfig.json"
{
  "extends": "astro/tsconfigs/base"
}
```

Additionally, our templates include an `env.d.ts` file inside the `src` folder to provide [Vite's client types](https://vitejs.dev/guide/features.html#client-types) to your project:

```typescript title="env.d.ts"
/// <reference types="astro/client" />
```

Optionally, you can delete this file and instead add the [`types` setting](https://www.typescriptlang.org/tsconfig#types) to your `tsconfig.json`:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "types": ["astro/client"]
  }
}
```

### UI Frameworks

If your project uses a [UI framework](/en/core-concepts/framework-components/), additional settings depending on the framework might be needed. Please see your framework's TypeScript documentation for more information. ([Vue](https://vuejs.org/guide/typescript/overview.html#using-vue-with-typescript), [React](https://reactjs.org/docs/static-type-checking.html), [Preact](https://preactjs.com/guide/v10/typescript), [Solid](https://www.solidjs.com/guides/typescript))

## Type Imports

Use explicit type imports and exports whenever possible.

```js del={1} ins={2} ins="type"
import { SomeType } from './script';
import type { SomeType } from './script';
```

This way, you avoid edge cases where Astro's bundler may try to incorrectly bundle your imported types as if they were JavaScript.

In your `.tsconfig` file, you can instruct TypeScript to help with this. The [`importsNotUsedAsValues` setting](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues) can be set to `error`. Then, TypeScript will check your imports and tell you when  `import type` should be used. This setting is included by default in our `strict` and `strictest` templates.

```json title="tsconfig.json" ins={3}
{
  "compilerOptions": {
    "importsNotUsedAsValues": "error",
  }
}
```

## Import Aliases

Astro supports [import aliases](/en/guides/aliases/) that you define in your `tsconfig.json` & `jsconfig.json` `paths` configuration. [Read our guide](/en/guides/aliases/) to learn more.


```astro title="src/pages/about/nate.astro" "@components" "@layouts"
---
import HelloWorld from '@components/HelloWorld.astro';
import Layout from '@layouts/Layout.astro';
---
```

```json title="tsconfig.json" {5-6}
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

```astro title="src/components/HelloProps.astro" ins={2-5}
---
export interface Props {
  name: string;
  greeting?: string;
}
const { greeting = 'Hello', name } = Astro.props;
---
<h2>{greeting}, {name}!</h2>
```

:::tip

To type a component that denies props, you can pass `type Props = Record<string, never>;` for zero props and `type Props = { children: any; };` for no props except for the default slot.

:::

### Built-in attribute types

Astro provides JSX type definitions to check that your markup is using valid HTML attributes. You can use these types to help build component props. For example, if you were building a `<Link>` component, you could do the following to mirror the default HTML attributes in your component’s prop types.

```astro title="src/components/Link.astro" ins={2}
---
export type Props = astroHTML.JSX.AnchorHTMLAttributes;
const { href, ...attrs } = Astro.props;
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

```json title="package.json" del={2} ins={3} ins="astro check && tsc --noEmit && "
  "scripts": {
    "build": "astro build",
    "build": "astro check && tsc --noEmit && astro build",
  },
```

:::note
`astro check` only checks types within `.astro` files, and `tsc --noEmit` only checks types within `.ts` and `.tsx` files. To check types within Svelte and Vue files, you can use the [`svelte-check`](https://www.npmjs.com/package/svelte-check) and the [`vue-tsc`](https://www.npmjs.com/package/vue-tsc) packages respectively.
:::

📚 Read more about [`.ts` file imports](/en/guides/imports/#typescript) in Astro.
📚 Read more about [TypeScript Configuration](https://www.typescriptlang.org/tsconfig/).

## Troubleshooting

### Errors Typing multiple JSX frameworks at the same time

An issue may arise when using multiple JSX frameworks in the same project, as each framework requires different, sometimes conflicting, settings inside `tsconfig.json`.

**Solution**: Set the [`jsxImportSource` setting](https://www.typescriptlang.org/tsconfig#jsxImportSource) to `react` (default), `preact` or `solid-js` depending on your most-used framework. Then, use a [pragma comment](https://www.typescriptlang.org/docs/handbook/jsx.html#configuring-jsx) inside any conflicting file from a different framework.

For the default setting of `jsxImportSource: react`, you would use:

```jsx
// For Preact
/** @jsxImportSource preact */

// For Solid
/** @jsxImportSource solid-js */
```

### Vue components are mistakenly typed by the `@types/react` package when installed

The types definitions from the `@types/react` package are declared globally and therefore will be mistakenly used to typecheck `.vue` files when using [Volar](https://github.com/johnsoncodehk/volar).

**Status**: Expected behavior.

**Solution**: There's currently no reliable way to fix this, however a few solutions and more discussion can be found in [this GitHub discussion](https://github.com/johnsoncodehk/volar/discussions/592).
