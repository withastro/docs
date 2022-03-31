---
layout: ~/layouts/MainLayout.astro
title: TypeScript
description: Using TypeScript in Astro.
---
Astro includes built-in support for TypeScript (`*.ts`) files in your project. 

TypeScript adds additional syntax to JavaScript, helping you describe the shape of objects and functions in your code and catch errors in your editor.

> 💡 Don't forget to [configure your editor](/en/editor-setup) with the [Astro VS Code Extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) for TypeScript Diagnostics and more!

Each [Astro starter template](https://github.com/withastro/astro/tree/main/examples) includes a `tsconfig.json` file at project the root. This file specifies the compiler options required to compile the project.

If you need to create this file yourself, you can include the following code in a `ts.config` file at the root of your project:

```json
{
  "compilerOptions": {
    "moduleResolution": "node"
  }
}
```

## Aliases

You can add import aliases to create shortcuts for your imports.

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

## Client Types
<!-- This is taken from vite's page, and by seeing what's in the Astro Ink template, but I SUSPECT it might not be necessary in Astro? Is there any reason to include something about this? -->

You can add `vite/client` to `compilerOptions.types` of your `tsconfig`:

```json
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

This will provide the following type shims:

- [Asset imports](/en/guides/imports) (e.g. importing an `.svg` file)
- Types for the Vite-injected [env variables](/en/guides/environment-variables) on `import[dot]meta[dot]env
- Types for the HMR API on import[dot]meta[dot]hot


Here are some other things you might want to configure... 
<!-- IS THERE ANYTHING ELSE a TYPESCRIPT USER WOULD TYPICALLY CONFIGURE?? -->

## Using TypeScript in Astro Components

You can define your props with TypeScript by exporting a `Props` type interface. Astro will automatically pick up any exported `Props` interface and give type warnings/errors for your project. 

```astro
---
// src/components/GreetingHeadline.astro
export interface Props {
  name: string;
  greeting?: string;
}

const { greeting, name } = Astro.props
---
<h2>{greeting}, {name}!</h2>
```

📚 Read more about [`.ts` file imports](/en/guides/imports#typescript) in Astro.

📚 Read more about [TypeScript Configuration](https://www.typescriptlang.org/tsconfig).
