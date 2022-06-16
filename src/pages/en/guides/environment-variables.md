---
layout: ~/layouts/MainLayout.astro
title: Using environment variables
description: Learn how to use environment variables in an Astro project.
i18nReady: true
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
<p>
In this example, <code>PUBLIC_ANYBODY</code> (accessible via <ImportMetaEnv path=".PUBLIC_ANYBODY" />) will be available in server or client code, while <code>SECRET_PASSWORD</code> (accessible via <ImportMetaEnv path=".SECRET_PASSWORD" />) will be server-side only.
</p>

## Default environment Variables

Astro includes a few environment variables out-of-the-box:
<ul>
<li> <ImportMetaEnv path=".MODE" /> (<code>development</code> | <code>production</code>): the mode your site is running in. This is <code>development</code> when running <code>astro dev</code> and <code>production</code> when running <code>astro build</code>.</li>

<li> <ImportMetaEnv path=".BASE_URL" /> (<code>string</code>): the base url your site is being served from. This is determined by the <a href="/en/reference/configuration-reference/#base"><code>base</code> config option</a>.</li>

<li> <ImportMetaEnv path=".PROD" /> (<code>boolean</code>): whether your site is running in production.</li>

<li> <ImportMetaEnv path=".DEV" /> (<code>boolean</code>): whether your site is running in development (always the opposite of <ImportMetaEnv path=".PROD" />).</li>
<li><ImportMetaEnv path=".SITE" /> (<code>string</code>): <a href="/en/reference/configuration-reference/#site">The <code>site</code> option</a> specified in your project's <code>astro.config</code>.</li>
</ul>

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

:::tip[Don't worry about browser support!]
Vite replaces all <ImportMetaEnv /> mentions with static values.
:::

<p>

For example, use <ImportMetaEnv path=".PUBLIC_POKEAPI" /> to get the `PUBLIC_POKEAPI` environment variable.
</p>

```js
// When import.meta.env.SSR === true
const data = await db(import.meta.env.DB_PASSWORD);

// When import.meta.env.SSR === false
const data = fetch(`${import.meta.env.PUBLIC_POKEAPI}/pokemon/squirtle`);
```

:::caution
Because Vite statically replaces <ImportMetaEnv />, you cannot access it with dynamic keys like <ImportMetaEnv path="[key]" />.
:::


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

## Multiple Environments

:::caution
Astro does not pass thru build command line options to Vite. Thus, `--mode` does not work and therefore Astro is limited to the included modes (development and production).
:::

To achieve more than two build environments (e.g. development, staging and production) you can add environment variables to your build command.

```bash
$ astro build PUBLIC_STAGING=true
```

To increase the ease of use you can add the command in your package.json file: 
```ts
...
"scripts": {
    ...
    "build-staging": "PUBLIC_STAGING=true astro build",
    "build-production": "PUBLIC_PRODUCTION=true astro build",
    ...
    }
...
```

You might want to go even further by adding an environment.ts file to your project with the following code: 

```ts
const localEnv = {
  plugin_iframe_url: "http://localhost:8080",
};

const stagingEnv = {
  plugin_iframe_url: "https://plugin.staging.example.com/",
};

const productionEnv = {
  plugin_iframe_url: "https://plugin.example.com/",
};

export default import.meta.env.PUBLIC_PRODUCTION
  ? productionEnv
  : import.meta.env.PUBLIC_STAGING
  ? stagingEnv
  : localEnv;

```

This way you can use environment variables at scale. Typechecking and IntelliSense are working out of the box.

