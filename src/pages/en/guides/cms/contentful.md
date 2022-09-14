---
title: Contentful & Astro
description: How to connect your Contentful CMS to your Astro site.
setup: |
    import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro'
layout: ~/layouts/MainLayout.astro
---

[Contentful](https://www.contentful.com/) is a headless CMS that allows you to manage content, integrate with other services, and publish to multiple platforms.

In this guide we will use [`contentful.js`](https://github.com/contentful/contentful.js) to connect your Contentful CMS space to Astro with zero client side JavaScript.

## Setting up

To get started, you will need to have the following:

1. **An Astro project** - If you don't have an Astro project yet, our [Installation guide](/en/install/auto/) will get you up and running in no time.

2. **A Contentful account and Contentful space**. If you don't have an account, you can [sign up](https://www.contentful.com/sign-up/) for a free account and create a new Contentful space. You can also use an existing space if you have one.

3. **Contentful credentials** - Find the following credentials in your Contentful space dashboard **Settings > API keys**:

    - **Contentful space ID** - The ID of your Contentful space. 
    - **Contentful delivery access token** - The access token to consume _published_ content from your Contentful space.
    - **Contentful preview access token** - The access token to consume _unpublished_ content from your Contentful space.

## Integrating with Astro

### Setting up credentials

To add your contentful credentials to Astro, create an `.env` file in the root of your project and add the following:

```ini title=".env"
CONTENTFUL_SPACE_ID=YOUR_SPACE_ID
CONTENTFUL_DELIVERY_TOKEN=YOUR_DELIVERY_TOKEN
CONTENTFUL_PREVIEW_TOKEN=YOUR_PREVIEW_TOKEN
```

Now, you should be able to use these environment variables in your project. If you would like to have IntelliSense for your Contentful environment variables, you can create a `env.d.ts` file in the `src/` directory and configure `ImportMetaEnv` like this:

```ts title="src/env.d.ts"
interface ImportMetaEnv {
  readonly CONTENTFUL_SPACE_ID: string;
  readonly CONTENTFUL_DELIVERY_TOKEN: string;
  readonly CONTENTFUL_PREVIEW_TOKEN: string;
}
```

For more information on how to use environment variables, check out [environment variables](/en/guides/environment-variables/).

Your root directory should now look like this:

```ini title="" ins={2-3}
├── src/
│   └── env.d.ts
├── .env
├── astro.config.mjs
└── package.json
```

### Installing dependencies

Install [contentful.js](https://github.com/contentful/contentful.js) with your favorite package manager:

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  # install contentful with npm
  npm install contentful
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  # install contentful with pnpm
  pnpm install contentful
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  # install contentful with yarn
  yarn add contentful
  ```
  </Fragment>
</PackageManagerTabs>

Next, create a new file called `contentful.ts` in a `src/lib` directory in your project.

```ts title="src/lib/contentful.ts"
import contentful from "contentful";

const client = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});

export default client;
```

The above code snippet is creating a new contentful client and passing in the credentials from the `.env` file. In development mode (`import.meta.env.DEV = true`), the client will use the preview token and preview host. In production mode, the client will use the delivery token and delivery host.

:::caution
While in development mode, your content will be fetched from the **Contentful preview API**. This means that you will be able to see unplublished content from the Contentful web app. At built time, your content will be fetched from the **Contentful delivery API**. This means that only published content will be available at build time. 
:::

Finally, your root directory should now look like this:

```ini ins={2-3}
├── src/
│   └── lib/
│       └── contentful.ts
├── .env
├── astro.config.mjs
└── package.json
```

## Fetching data

Now that we have our Contentful client set up, you can fetch data from Contentful inside your Astro components. 

```astro
---
import contentfulClient from "../lib/contentful";
const { items } = await contentfulClient.getEntries<{ title: string }>();
---
<ul>
  {items.map((item) => (
    <li>{item.fields.title}</li>
  ))}
</ul>
```

You can find more querying options in the [contentful.js documentation](https://contentful.github.io/contentful.js/contentful/9.1.34/ContentfulClientAPI.html).
