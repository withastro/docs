---
layout: ~/layouts/MainLayout.astro
title: Server-side Rendering (experimental)
---

**Server-side Rendering**, aka SSR, is enabled in Astro behind an experimental flag. When you enable SSR you can:

- Implement sessions for login state in your app.
- Render data from an API called dynamically with `fetch`.
- Deploy your site to a host using an *adapter*.

> SSR is marked as __experimental__ in Astro and changes will occur before it becomes stable. Use only if you can handle API changes.

## Enabling SSR in Your Project

To enable SSR you need to use an adapter. The following adapters are available today with more to come in the future:

- [Netlify](https://github.com/withastro/astro/tree/main/packages/integrations/netlify)
- [Node.js](https://github.com/withastro/astro/tree/main/packages/integrations/node)

In this example we will use `@astrojs/netlify` to build for Netlify. First install the adapter:

```bash
npm install --save-dev @astrojs/netlify
```

Once your packages have been installed, add two new lines to your `astro.config.mjs` project configuration file. 

```diff
  // astro.config.mjs
  import { defineConfig } from 'astro/config';
+ import netlify from '@astrojs/netlify/functions';

  export default defineConfig({
+   adapter: netlify(),
  });
``` 

With Netlify you can deploy from git, their web UI, or from the cli. Here we'll use the [Netlify CLI](https://docs.netlify.com/cli/get-started/) to deploy.

First build your site as normal:

```bash
npm run build
```

This creates `netlify/functions/` which contains your SSR code. Deploying your site will deploy this function which contains all of your Astro pages ready to be rendered.

```bash
netlify deploy
```

After the deploy is complete it should provide you a preview URL to see your site.

## Features

Astro will remain a static-site generator by default, but once you enable a server-side rendering adapter a few new features become available to you.

### Astro.request.headers

The headers for the request are available on `Astro.request.headers`. It is a [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) object, a Map-like object where you can retrieve headers such as the cookie.

```astro
---
const cookie = Astro.request.headers.get('cookie');
// ...
---
<html>
  <!-- Page here... -->
</html>
```

### Astro.redirect

On the `Astro` global, this method allows you to redirect to another page. You might do this after checking if the user is logged in by getting their session from a cookie.

```astro
---
import { isLoggedIn } from '../utils';

const cookie = Astro.request.headers.get('cookie');

// if the user is not logged in, redirect them to the login page.
if(!isLoggedIn(cookie)) {
  return Astro.redirect('/login');
}
---
<html>
  <!-- Page here... -->
</html>
```

### Response

You can also return a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) from any page. You might do this to return a 404 on a dynamic page after looking up an id in the database.

__[id].astro__

```astro
---
import { getProduct } from '../api';

const product = await getProduct(Astro.params.id);

// No product found
if(!product) {
  return new Response(null, {
    status: 404,
    statusText: 'Not found'
  });
}
---
<html>
  <!-- Page here... -->
</html>
```

#### API Routes

A [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can also be returned from an API route.

```js
import { getProduct } from '../db';

export function get({ id }) {
  const product = await getProduct(id);

  if(!product) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found'
    });
  }

  return new Response(JSON.stringify(product), {
    status: 200
  });
}
```
