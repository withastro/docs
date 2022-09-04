---
title: Contentful & Astro
description: How to connect your Contentful CMS to your Astro site.
layout: ""
---

[Contentful](https://www.contentful.com/) is a headless CMS that allows you to manage content, integrate with other services, and publish to multiple platforms. It is a great choice for Astro proyects that need to pull in content from a CMS.

## Prerequisites

- **An Astro project** - If you don't have an Astro project yet, our [Installation guide](/install/auto/) will get you up and running in no time.

- **A Contentful account and Contentful space**. If you don't have an account, you can [sign up](https://www.contentful.com/sign-up/) for a free account and create a new Contentful space. You can also use an existing space if you have one.

- **Contentful credentials** - You can find the following credentials in your Contentful space dashboard **Settings > API keys**:

  - **Contentful space ID** - ID of your Contentful space. 
  - **Contentful delivery access token** - Access token to consume _published_ content from your Contentful space.
  - **Contentful preview access token** - Access token to consume _unpublished_ content from your Contentful space.

## Adding Contentful to your Astro project

### Setting up credentials

To add your contentful credentials to Astro, create an `.env` file in the root of your project and add the following:

```ini title=".env"
CONTENTFUL_SPACE_ID=YOUR_SPACE_ID
CONTENTFUL_DELIVERY_TOKEN=YOUR_DELIVERY_TOKEN
CONTENTFUL_PREVIEW_TOKEN=YOUR_PREVIEW_TOKEN
```

if you would like to have IntelliSense for your Contentful credentials, you can create a `env.d.ts` file in the `src/` directory and configure `ImportMetaEnv` like this:

```ts title="src/env.d.ts"
interface ImportMetaEnv {
  readonly CONTENTFUL_SPACE_ID: string;
  readonly CONTENTFUL_DELIVERY_TOKEN: string;
  readonly CONTENTFUL_PREVIEW_TOKEN: string;
}
```

### Installing the Contentful

To integrate Contentful with Astro, install the `contentful` package:

```bash
npm install contentful
```

Next, create a new file called `contentful.ts` in your project's `src/lib` directory. This file will be used to fetch content from Contentful using your credentials.

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

## Querying the Contentful API

**References**
- [Contentful and Next.js Tutorial](https://www.contentful.com/nextjs-starter-guide/)
- [contentful.js](https://github.com/contentful/contentful.js)
- [contentful-nextjs-starter](https://github.com/vercel/next.js/tree/canary/examples/cms-contentful)
- [storyblok-astro-integration](https://www.storyblok.com/mp/announcing-storyblok-astro)
