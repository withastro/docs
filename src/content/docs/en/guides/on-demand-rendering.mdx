---
title: On-demand rendering
description: Generate server-rendered pages and routes on demand with an adapter.
i18nReady: true
---
import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro';
import { Steps } from '@astrojs/starlight/components';
import RecipeLinks from '~/components/RecipeLinks.astro';
import IntegrationsNav from '~/components/IntegrationsNav.astro';
import ReadMore from '~/components/ReadMore.astro';

Your Astro project code must be **rendered** to HTML in order to be displayed on the web. 

By default, Astro pages, routes, and API endpoints will be pre-rendered at build time as static pages. However, you can choose to render some or all of your routes on demand by a server when a route is requested.

On-demand rendered pages and routes are generated per visit, and can be customized for each viewer. For example, a page rendered on demand can show a logged-in user their account information or display freshly updated data without requiring a full-site rebuild.

On-demand rendering on the server at request time is also known as **server-side rendering (SSR)**.

## Server adapters

To render any page on demand, you need to add an **adapter**. Each adapter allows Astro to output a script that runs your project on a specific **runtime**: the environment that runs code on the server to generate pages when they are requested (e.g. Netlify, Cloudflare).

You may also wish to add an adapter even if your site is entirely static and you are not rendering any pages on demand. For example, the [Netlify adapter](/en/guides/integrations-guide/netlify/) enables Netlify's Image CDN, and [server islands](/en/guides/server-islands/) require an adapter installed to use `server:defer` on a component.

<IntegrationsNav category="adapter"/>

Astro maintains official adapters for [Node.js](https://nodejs.org/), [Netlify](https://www.netlify.com/), [Vercel](https://vercel.com/), and [Cloudflare](https://www.cloudflare.com/). You can find both [official and community adapters in our integrations directory](https://astro.build/integrations/?search=&categories%5B%5D=adapters). Choose the one that corresponds to your [deployment environment](/en/guides/deploy/).

### Add an Adapter

You can add any of the [official adapter integrations maintained by Astro](/en/guides/integrations-guide/#official-integrations) with the following `astro add` command. This will install the adapter and make the appropriate changes to your `astro.config.mjs` file in one step. 

For example, to install the Netlify adapter, run:

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  npx astro add netlify
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  pnpm astro add netlify
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  yarn astro add netlify
  ```
  </Fragment>
</PackageManagerTabs>

You can also [add an adapter manually by installing the NPM package](/en/guides/integrations-guide/#installing-an-npm-package) (e.g. `@astrojs/netlify`) and updating `astro.config.mjs` yourself.

Note that different adapters may have different configuration settings. Read each adapter's documentation, and apply any necessary config options to your chosen adapter in `astro.config.mjs`

## Enabling on-demand rendering

**By default, your entire Astro site will be prerendered**, and static HTML pages will be sent to the browser. However, you may opt out of prerendering on any routes that require server rendering, for example, a page that checks for cookies and displays personalized content.

First, [add an adapter integration](#add-an-adapter) for your server runtime to enable on-demand server rendering in your Astro project.

Then, add `export const prerender = false` at the top of the individual page or endpoint you want to render on demand. The rest of your site will remain a static site:

```astro title="src/pages/page-rendered-on-demand.astro" ins={2}
---
export const prerender = false
---
<html>
<!--
This content will be server-rendered on demand!
Just add an adapter integration for a server runtime!
All other pages are statically-generated at build time!
-->
<html>
```

The following example shows opting out of prerendering in order to display a random number each time the endpoint is hit:

```js title="src/pages/randomnumber.js" ins={1}
export const prerender = false;

export async function GET() {
  let number = Math.random();
  return new Response(
    JSON.stringify({
      number,
      message: `Here's a random number: ${number}`,
    }),
  );
}
```
### `'server'` mode

For a **highly dynamic app**, after adding an adapter, you can [set your build output configuration to `output: 'server'`](/en/reference/configuration-reference/#output) to **server-render all your pages by default**. This is the equivalent of opting out of prerendering on every page.

Then, if needed, you can choose to prerender any individual pages that do not require a server to execute, such as a privacy policy or about page.

```astro title="src/pages/about-my-app.astro" ins={2}
---
export const prerender = true
---
<html>
<!--
`output: 'server'` is configured, but this page is static!
The rest of my site is rendered on demand!
-->
<html>
```

Add `export const prerender = true` to any page or route to prerender a static page or endpoint:

```js title="src/pages/myendpoint.js" ins={1}
export const prerender = true;

export async function GET() {
  return new Response(
    JSON.stringify({
      message: `This is my static endpoint`,
    }),
  );
}
```

:::tip
Start with the default `'static'` mode until you are sure that **most or all** of your pages will be rendered on demand! This ensures that your site is as performant as possible, not relying on a server function to render static content.

The `'server'` output mode does not bring any additional functionality. It only switches the default rendering behavior.
:::

<ReadMore>See more about the [`output` setting](/en/reference/configuration-reference/#output) in the configuration reference.</ReadMore>


## On-demand rendering features

### HTML streaming

With HTML streaming, a document is broken up into chunks, sent over the network in order, and rendered on the page in that order. Astro uses HTML streaming in on-demand rendering to send each component to the browser as it renders them. This makes sure the user sees your HTML as fast as possible, although network conditions can cause large documents to be downloaded slowly, and waiting for data fetches can block page rendering.

<RecipeLinks slugs={["en/recipes/streaming-improve-page-performance"]}/>

:::caution
Features that modify the [Response headers](https://developer.mozilla.org/en-US/docs/Glossary/Response_header) are only available at the **page level**. (You can't use them inside of components, including layout components.) By the time Astro runs your component code, it has already sent the Response headers and they cannot be modified.

:::

### Cookies

A page or API endpoint rendered on demand can check, set, get, and delete cookies.

The example below updates the value of a cookie for a page view counter:

```astro title="src/pages/index.astro" {6,7,12}
---
export const prerender = false; // Not needed in 'server' mode

let counter = 0

if (Astro.cookies.has('counter')) {
  const cookie = Astro.cookies.get('counter')
  const value = cookie?.number()
  if (value !== undefined && !isNaN(value)) counter = value + 1
}

Astro.cookies.set('counter', String(counter))
---
<html>
  <h1>Counter = {counter}</h1>
</html>
```

See more details about [`Astro.cookies` and the `AstroCookie` type](/en/reference/api-reference/#cookies) in the API reference.

### `Response`

[`Astro.response`](/en/reference/api-reference/#response) is a standard [`ResponseInit`](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#options) object. It can be used to set the response status and headers.

The example below sets a response status and status text for a product page when the product does not exist:

```astro title="src/pages/product/[id].astro" {10,11}
---
export const prerender = false; // Not needed in 'server' mode

import { getProduct } from '../api';

const product = await getProduct(Astro.params.id);

// No product found
if (!product) {
  Astro.response.status = 404;
  Astro.response.statusText = 'Not found';
}
---
<html>
  <!-- Page here... -->
</html>
```

#### `Astro.response.headers`

You can set headers using the `Astro.response.headers` object:

```astro title="src/pages/index.astro" {4}
---
export const prerender = false; // Not needed in 'server' mode

Astro.response.headers.set('Cache-Control', 'public, max-age=3600');
---
<html>
  <!-- Page here... -->
</html>
```

#### Return a `Response` object

You can also return a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object directly from any page using on-demand rendering either manually or with [`Astro.redirect`](/en/reference/api-reference/#redirect). 

The example below looks up an ID in the database on a dynamic page and either it returns a 404 if the product does not exist, or it redirects the user to another page if the product is no longer available, or it displays the product:

```astro title="src/pages/product/[id].astro" {10-13, 18}
---
export const prerender = false; // Not needed in 'server' mode

import { getProduct } from '../api';

const product = await getProduct(Astro.params.id);

// No product found
if (!product) {
  return new Response(null, {
    status: 404,
    statusText: 'Not found'
  });
}

// The product is no longer available
if (!product.isAvailable) {
  return Astro.redirect("/products", 301);
}
---
<html>
  <!-- Page here... -->
</html>
```

### `Request`

`Astro.request` is a standard [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object. It can be used to get the `url`, `headers`, `method`, and even the body of the request.

You can access additional information from this object for pages that are not statically generated.

#### `Astro.request.headers`

The headers for the request are available on `Astro.request.headers`. This works like the browser's [`Request.headers`](https://developer.mozilla.org/en-US/docs/Web/API/Request/headers). It is a [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) object where you can retrieve headers such as the cookie.

```astro title="src/pages/index.astro" {4}
---
export const prerender = false; // Not needed in 'server' mode

const cookie = Astro.request.headers.get('cookie');
// ...
---
<html>
  <!-- Page here... -->
</html>
```

#### `Astro.request.method`

The HTTP method used in the request is available as `Astro.request.method`. This works like the browser's [`Request.method`](https://developer.mozilla.org/en-US/docs/Web/API/Request/method). It returns the string representation of the HTTP method used in the request.

```astro title="src/pages/index.astro" {4}
---
export const prerender = false; // Not needed in 'server' mode

console.log(Astro.request.method) // GET (when navigated to in the browser)
---
```

See more details about [`Astro.request`](/en/reference/api-reference/#request) in the API reference.

### Server Endpoints

A server endpoint, also known as an **API route**, is a special function exported from a `.js` or `.ts` file within the `src/pages/` folder. A powerful feature of server-side rendering on demand, API routes are able to securely execute code on the server.

The function takes an [endpoint context](/en/reference/api-reference/) and returns a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response). 

To learn more, see our [Endpoints Guide](/en/guides/endpoints/#server-endpoints-api-routes).
