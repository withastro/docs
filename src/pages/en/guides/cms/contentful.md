---
title: Contentful & Astro
description: How to connect your Contentful CMS to your Astro site.
setup: |
    import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro'
layout: ~/layouts/MainLayout.astro
---

[Contentful](https://www.contentful.com/) is a headless CMS that allows you to manage content, integrate with other services, and publish to multiple platforms.

## Integrating with Astro

In this guide we will use [`contentful.js`](https://github.com/contentful/contentful.js) to connect your Contentful space to Astro with zero client side JavaScript.

### Prerequisites

To get started, you will need to have the following:

1. **An Astro project** - If you don't have an Astro project yet, our [Installation guide](/en/install/auto/) will get you up and running in no time.

2. **A Contentful account and a Contentful space**. If you don't have an account, you can [sign up](https://www.contentful.com/sign-up/) for a free account and create a new Contentful space. You can also use an existing space if you have one. 

    :::tip
    If you have an empty Contentful space, check out [setting up a Contentful model](#setting-up-a-contentful-model) to learn how to create a basic blog model for your content.
    :::

3. **Contentful credentials** - Find the following credentials in **Settings > API keys**. If you don't have any API keys, create one by clicking in **Add API key**.

    - **Contentful space ID** - The ID of your Contentful space. 
    - **Contentful delivery access token** - The access token to consume _published_ content from your Contentful space.
    - **Contentful preview access token** - The access token to consume _unpublished_ content from your Contentful space.

### Setting up credentials

To add your Contentful space's credentials to Astro, create an `.env` file in the root of your project with the following code:

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

Your root directory should now include these new files:

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

Finally, your root directory should now include these new files:

```ini ins={3-4}
├── src/
│   └── env.d.ts
│   └── lib/
│       └── contentful.ts
├── .env
├── astro.config.mjs
└── package.json
```

### Fetching data

Now that you have your Contentful client set up, you can fetch data from Contentful inside your Astro components. 

```astro
---
import contentfulClient from "../lib/contentful";

interface ShopItem {
    name: string,
    description: string,
    price: number
}

const { items } = await contentfulClient.getEntries<ShopItem>();
---
<ul>
  {items.map((item) => (
    <li>
      <h2><{item.fields.name}</h2>
      <p><{item.fields.description}</p>
      <span>{item.fields.price}</span>
    </li>
  ))}
</ul>
```

You can find more querying options in the [contentful.js documentation](https://contentful.github.io/contentful.js/contentful/9.1.34/ContentfulClientAPI.html).

## Creating a blog with Astro and Contentful

In this section we will use Astro to create a static blog with Contentful as the CMS. 

### Prerequisites

1. A Contentful space.
2. An Astro project integrated with `contentful.js`. Check [integrating with Astro](#integrating-with-astro) for more details on how to set up an Astro project with Contentful.

### Setting up a Contentful model

In your Contentful space, in the **Content model** section, create a new content model with the following fields:

- **Name:** Blog Post
- **API identifier:** `blogPost`
- **Description:** This content type is for a blog post

Inside the newly created content type, create 3 new fields with the following parameters:

1. Text field
    - **Name:** Title
    - **API identifier:** `title`
2. Date and time field
    - **Name:** Date
    - **API identifier:** `date`
3. Rich text field
    - **Name:** Content
    - **API identifier:** `content`

### Creating a blog post

Now that we have our Contentful model set up, we can create a new blog post entry. In the **Content** section of your Contentful space, create a new entry with the following parameters:

- **Content type:** `blogPost`
- **Title:** `My first blog post`
- **Date:** `2021-10-01`
- **Content:** `This is my first blog post!`

Feel free to add as many blog posts as you want. Now that you have some data in your Contentful space, you can switch to your Astro project and start fetching data from Contentful.

### Creating an index page

Create a new file called `index.astro` in the `src/pages` directory of your Astro project. 



## Creating components

```ts
export interface blogPostFields {
  title: string;
  date: string;
  description: string;
  content: Document;
  slug: string;
}
```

```astro
---
export interface Props {
  title: string;
  description: string;
  url: string;
  date: string;
}

const { url, title, description, date } = Astro.props;
---

<li>
  <a href={`/posts/${url}/`}>
    <h2>
      {title}
      <span>&rarr;</span>
    </h2>
  </a>
  <time>{date}</time>
  <p>
    {description}
  </p>
</li>

```

## dynamic routes

## Webooks

## Server side rendering



