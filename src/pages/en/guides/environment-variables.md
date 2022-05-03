---
layout: ~/layouts/MainLayout.astro
title: Using environment variables
description: Learn how to use environment variables in an Astro project.
setup: |
  import ImportMetaEnv from '~/components/ImportMetaEnv.astro';
---

Astro uses Vite for environment variables, and allows you to [use any of its methods](https://vitejs.dev/guide/env-and-mode.html) to get and set environment variables.

Note that while _all_ environment variables are available in server-side code, only environment variables prefixed with `PUBLIC_` are available in client-side code for security purposes.

See the official [Environment Variables example](https://github.com/withastro/astro/tree/main/examples/env-vars) for best practices.

```ini
SECRET_PASSWORD=password123
PUBLIC_ANYBODY=there
```

In this example, `PUBLIC_ANYBODY` (accessible via `<ImportMetaEnv path=".PUBLIC_ANYBODY" />`) will be available in server or client code, while `SECRET_PASSWORD` (accessible via `<ImportMetaEnv path=".SECRET_PASSWORD" />`) will be server-side only.

## Default environment Variables

Astro includes a few environment variables out-of-the-box:

- `import.meta.env.MODE ('development' | 'production')`: the mode your site is running in. This is `development` when running `astro dev` and `production` when running `astro build`.

- `<ImportMetaEnv path=".BASE_URL" /> (string)`: the base url your site is being served from. This is determined by the [base config option](/en/reference/configuration-reference/#base).

- `<ImportMetaEnv path=".PROD" /> (boolean)`: whether your site is running in production.

- `<ImportMetaEnv path=".DEV" /> (boolean)`: whether your site is running in development (always the opposite of `<ImportMetaEnv path=".PROD" />`).
- `<ImportMetaEnv path=".SITE" /> (string)`: [The `site` option](/en/reference/configuration-reference/#site) specified in your project's `astro.config`.

## Setting environment variables

Environment variables can be loaded from `.env` files in your project directory.

You can also attach a mode (either `production` or `development`) to the filename, like `.env.production` or `.env.development`, which makes the environment variables only take effect in that mode.

Just create a `.env` file in the project directory and add some variables to it.

```bash
# .env
# This will only be available when run on the server!
DB_PASSWORD="foobar"
# This will be available everywhere!
PUBLIC_POKEAPI="https://pokeapi.co/api/v2"
```

```ini
.env                # loaded in all cases
.env.local          # loaded in all cases, ignored by git
.env.[mode]         # only loaded in specified mode
.env.[mode].local   # only loaded in specified mode, ignored by git
```

## Getting environment variables

<p>

Instead of using `process.env`, with Vite you use <ImportMetaEnv />, which uses the `import.meta` feature added in ES2020.
</p>
<p>

For example, use <ImportMetaEnv path=".PUBLIC_POKEAPI" /> to get the `PUBLIC_POKEAPI` environment variable.
</p>

```js
// When import.meta.env.SSR === true
const data = await db(import.meta.env.DB_PASSWORD);

// When import.meta.env.SSR === false
const data = fetch(`${import.meta.env.PUBLIC_POKEAPI}/pokemon/squirtle`);
```

_Don't worry about browser support! Vite replaces all <ImportMetaEnv /> mentions with static values._


> ⚠️WARNING⚠️:
> Because Vite statically replaces <ImportMetaEnv />, you cannot access it with dynamic keys like <ImportMetaEnv path="[key]" />.



## IntelliSense for TypeScript

<p>

By default, Vite provides type definition for <ImportMetaEnv /> in `vite/client.d.ts`. 
</p>

While you can define more custom env variables in `.env.[mode]` files, you may want to get TypeScript IntelliSense for user-defined env variables which are prefixed with `PUBLIC_`.

To achieve this, you can create an `env.d.ts` in `src/` and configure `ImportMetaEnv` like this:

```ts
interface ImportMetaEnv {
  readonly DB_PASSWORD: string;
  readonly PUBLIC_POKEAPI: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```
