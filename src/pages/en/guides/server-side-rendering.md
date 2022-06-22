---
layout: ~/layouts/MainLayout.astro
title: Server-side Rendering
i18nReady: true
---

**Server-side Rendering**, aka SSR, can be enabled in Astro. When you enable SSR you can:

- Implement sessions for login state in your app.
- Render data from an API called dynamically with `fetch`.
- Deploy your site to a host using an *adapter*.

:::note
SSR is new in Astro and changes will occur before v1.0 stable release. Please keep up to date with API changes here.
:::

## Enabling SSR in Your Project

To enable SSR you need to use an adapter. This is because SSR requires a server _runtime_: the environment that runs your server-side code. This runtime provides an API that your server-side code can use.

Installing an adapter gives Astro access to the corresponding API, and allows Astro to output a script that runs your project on that kind of server.

The following adapters are available today with more to come in the future:

- [Cloudflare](https://github.com/withastro/astro/tree/main/packages/integrations/cloudflare)
- [Deno](https://github.com/withastro/astro/tree/main/packages/integrations/deno)
- [Netlify](https://github.com/withastro/astro/tree/main/packages/integrations/netlify)
- [Node.js](https://github.com/withastro/astro/tree/main/packages/integrations/node)
- [Vercel](https://github.com/withastro/astro/tree/main/packages/integrations/vercel)

You can find instructions at the individual adapter links above to complete the following two steps (using `my-adapter` as an example placeholder) to enable SSR.
1. Install the adapter to your project dependencies via npm or your package manager of choice

   ```bash
      npm install --save-dev @astrojs/my-adapter
    ```
1. [Add the adapter](/en/reference/configuration-reference) to your `astro.config.mjs` file's import and default export

    ```diff
    // astro.config.mjs
    import { defineConfig } from 'astro/config';
    + import adapter from '@astrojs/my-adapter';
    export default defineConfig({
    +   adapter: my-adapter(),
    });
    ```

## Features

Astro will remain a static-site generator by default. But once you enable a server-side rendering adapter, **every route in your pages directory becomes a server-rendered route** and a few new features become available to you.

### `Astro.request.headers`

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

### `Astro.redirect`

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

### `Response`

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

An API route is a `.js` or `.ts` file within the `src/pages/` folder that takes a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) and returns a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response).

__[id].js__
```js
import { getProduct } from '../db';

export async function get({ params }) {
  const { id } = params;
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
