---
layout: ~/layouts/MainLayout.astro
title: Configuring Astro
i18nReady: true
---

Customize how Astro works by adding an `astro.config.mjs` file in your project. This is a common file in Astro projects, and all official example templates and themes ship with one by default.

📚 Read Astro's [API configuration reference](/en/reference/configuration-reference/) for a full overview of all supported configuration options.
## The Astro Config File

A valid Astro config file exports its configuration using the `default` export, using the recommended `defineConfig` helper:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // your configuration options here...
  // https://docs.astro.build/en/reference/configuration-reference/
})
```

Using `defineConfig()` is recommended for automatic type hints in your IDE, but it is also optional. An absolutely bare-minimum, valid configuration file would look like this:

```js
// Example: Bare minimum, empty configuration file
export default {}
```

## Supported Config File Types

Astro supports several file formats for its JavaScript configuration file: `astro.config.js`, `astro.config.mjs`, `astro.config.cjs` and `astro.config.ts`.

TypeScript config file loading is handled using [`tsm`](https://github.com/lukeed/tsm) and will respect your project tsconfig options.

## Config File Resolving

Astro will automatically try to resolve any of the above config files inside your project root or a top-level `config/` directory. If no config file is found in either your project root or a top-level `config/` directory, Astro's default options will be used.

```bash
# Example: Reads your configuration from ./astro.config.mjs
astro build
```

You can explicitly set a config file to use with the `--config` CLI flag. This CLI flag always resolves relative to the current working directory where you ran the `astro` CLI command.

```bash
# Example: Reads your configuration from this file
astro build --config my-config-file.js
```

## Environment Variables

Astro is unable to load `.env` files by default as the files to load can only be determined after evaluating the Astro config. However, you can use the included `loadEnv` helper to load the correct `.env` files from `process.cwd()` **before** evaluating the Astro config if needed. The values traditionally exposed on `process.env` will also be available.

```js
import { defineConfig, loadEnv } from 'astro/config'
const { MODE } = loadEnv();

export default defineConfig({
	site: MODE === 'production' ? `https://stargazers.club` : `https://${MODE}.stargazers.club`
})
```

## Config Intellisense

Astro recommends using the `defineConfig()` helper in your configuration file. `defineConfig()` provides automatic IntelliSense in your IDE. Editors like VSCode are able to read Astro's TypeScript type definitions and provide automatic jsdoc type hints, even if your configuration file isn't written in TypeScript.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // your configuration options here...
  // https://docs.astro.build/en/reference/configuration-reference/
})
```

You can also provide type definitions manually to VSCode, using this JSDoc notation:

```js
// astro.config.mjs
 export default /** @type {import('astro').AstroUserConfig} */ ({
  // your configuration options here...
  // https://docs.astro.build/en/reference/configuration-reference/
}
```

## Referencing Relative Files

If you provide a relative path to `root` or the `--root` CLI flag, Astro will resolve it against the current working directory where you ran the `astro` CLI command.

```js
export default defineConfig({
    // Resolves to the "./foo" directory in your current working directory
    root: 'foo'
})
```

Astro will resolve all other relative file and directory strings as relative to the project root:

```js
export default defineConfig({
    // Resolves to the "./foo" directory in your current working directory
    root: 'foo',
    // Resolves to the "./foo/public" directory in your current working directory
    publicDir: 'public',
})
```

To reference a file or directory relative to the configuration file, use `import.meta.url` (unless you are writing a common.js `astro.config.cjs` file).

```js
export default defineConfig({
    // Resolves to the "./foo" directory, relative to this config file
    root: new URL("./foo", import.meta.url),
    // Resolves to the "./public" directory, relative to this config file
    publicDir: new URL("./public", import.meta.url),
})
```

## Configuration Reference

📚 Read Astro's [API configuration reference](/en/reference/configuration-reference/) for a full overview of all supported configuration options.

