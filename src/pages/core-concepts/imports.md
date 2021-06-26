---
layout: ~/layouts/Main.astro
title: Imports
---

## npm packages

Any npm package can be used in Astro, with one requirement: they must be written as ESM or ESM-compatible JavaScript. Legacy (Common.js) packages will be converted to ESM automatically, however some packages have trouble with this automatic conversion. 

In the future, this ESM requirement will be dropped for packages that only run at build-time and will be passed to Node directly.

## Node builtins

We encourage Astro users to avoid Node.js builtins (`fs`, `path`, etc) whenever possible. Astro aims to be compatible with multiple JavaScript runtimes in the future. This includes [Deno](https://deno.land/) and [Cloudflare Workers](https://workers.cloudflare.com/) which do not support Node builtin modules such as `fs`. 

Our aim is to provide Astro alternatives to common Node.js builtins. However, no such alternatives exist today. So, if you _really_ need to use these builtin modules we don't want to stop you. Astro supports Node.js builtins using Node's newer `node:` prefix. If you want to read a file, for example, you can do so like this:

```jsx
---
// Example: import the "fs/promises" builtin from Node.js
import fs from 'node:fs/promises';

const url = new URL('../../package.json', import.meta.url);
const json = await fs.readFile(url, 'utf-8');
const data = JSON.parse(json);
---

<span>Version: {data.version}</span>
```
