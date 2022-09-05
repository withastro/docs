---
title: Contentful & Astro
description: How to connect your Contentful CMS to your Astro site.
layout: ~/layouts/CmsGuideLayout.astro
---

[Contentful](https://www.contentful.com/) is a headless CMS that allows you to manage content, integrate with other services, and publish to multiple platforms. It is a great choice for Astro projects that need to pull in content from a CMS.

## Prerequisites

- **An Astro project** - If you don't have an Astro project yet, our [Installation guide](/install/auto/) will get you up and running in no time.

- **A Contentful account and Contentful space**. If you don't have an account, you can [sign up](https://www.contentful.com/sign-up/) for a free account and create a new Contentful space. You can also use an existing space if you have one.

- **Contentful credentials** - Find the following credentials in your Contentful space dashboard **Settings > API keys**:

  - **Contentful space ID** - The ID of your Contentful space. 
  - **Contentful delivery access token** - The access token to consume _published_ content from your Contentful space.
  - **Contentful preview access token** - The access token to consume _unpublished_ content from your Contentful space.

## Integrating Contentful with Astro

### Setting up credentials

To add your contentful credentials to Astro, create an `.env` file in the root of your project and add the following:

```ini title=".env"
CONTENTFUL_SPACE_ID=YOUR_SPACE_ID
CONTENTFUL_DELIVERY_TOKEN=YOUR_DELIVERY_TOKEN
CONTENTFUL_PREVIEW_TOKEN=YOUR_PREVIEW_TOKEN
```

if you would like to have IntelliSense for your Contentful environment variables, you can create a `env.d.ts` file in the `src/` directory and configure `ImportMetaEnv` like this:

```ts title="src/env.d.ts"
interface ImportMetaEnv {
  readonly CONTENTFUL_SPACE_ID: string;
  readonly CONTENTFUL_DELIVERY_TOKEN: string;
  readonly CONTENTFUL_PREVIEW_TOKEN: string;
}
```

### Installing the Contentful

Install the `contentful` package:

```bash
npm install contentful
```

Next, create a new file called `contentful.ts` in your project's `src/lib` directory. This file will create a contenful client that will query your Contentful space using your credentials.

```ts title="src/contentful.ts"
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
While in development mode, your content will be fetched from the **Contentful preview API**. This means that you will be able to see unplublished content from the Contentful web app. At built time, your content will be fetched from the **Contentful delivery API**. This means that only published content will be available in your Astro site. 
:::

## Fetching data from Astro components

Now that we have our Contentful client set up, you can fetch data from Contentful inside your Astro components. 

```astro
---
import contentfulClient from "../lib/contentful";
// more fetching options in https://contentful.github.io/contentful.js/contentful/9.1.34/ContentfulClientAPI.html
const { items } = await contentfulClient.getEntries();
---
<ul>
  {items.map((item) => (
    <li>{item.fields.title}</li>
  ))}
</ul>
```

You can find more querying options in the [contentful.js documentation](https://contentful.github.io/contentful.js/contentful/9.1.34/ContentfulClientAPI.html).
