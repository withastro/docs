---
title: Contentful & Astro
description: How to connect your Contentful CMS to your Astro site.
setup: |
    import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro'
layout: ~/layouts/MainLayout.astro
---

[Contentful](https://www.contentful.com/) is a headless CMS that allows you to manage content, integrate with other services, and publish to multiple platforms.

## Integrating with Astro

In this guide we will use the [Contentful SDK](https://github.com/contentful/contentful.js) to connect your Contentful space to Astro with zero client side JavaScript.

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

Install the following packages with your favorite package manager:

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  # install contentful with npm
  npm install contentful @contentful/rich-text-html-renderer
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  # install contentful with pnpm
  pnpm install contentful @contentful/rich-text-html-renderer
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  # install contentful with yarn
  yarn add contentful @contentful/rich-text-html-renderer
  ```
  </Fragment>
</PackageManagerTabs>

Next, create a new file called `contentful.ts` in a `src/lib` directory in your project.

```ts title="src/lib/contentful.ts"
import contentful from "contentful";

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});

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
import { contentfulClient } from "../lib/contentful";

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

In this section we will use Astro to create a blog with Contentful as the CMS. 

### Prerequisites

1. A Contentful space.
2. An Astro project integrated with the [Contentful SDK](https://github.com/contentful/contentful.js). See [integrating with Astro](#integrating-with-astro) for more details on how to set up an Astro project with Contentful.

### Setting up a Contentful model

Inside your Contentful space, in **Content model** section, create a new content model with the following fields:

- **Name:** Blog Post
- **API identifier:** `blogPost`
- **Description:** This content type is for a blog post

In this newly created content type, create 5 new fields with the following parameters:

1. Text field
    - **Name:** title
    - **API identifier:** `title`
2. Date and time field
    - **Name:** date
    - **API identifier:** `date`
3. Text field
    - **Name:** slug
    - **API identifier:** `slug`
4. Text field
    - **Name:** description
    - **API identifier:** `description`
5. Rich text field
    - **Name:** content
    - **API identifier:** `content`

### Creating a blog post in Contentful

Now that we have our Contentful model set up, we can create a new blog post entry. In the **Content** section of your Contentful space, create a new entry with the following parameters:

- **Content type:** `blogPost`
- **Title:** `Astro is amazing!`
- **Slug:** `astro-is-amazing`
- **Description:** `Astro is a new static site generator that is blazing fast and easy to use.`
- **Date:** `2021-10-01`
- **Content:** `This is my first blog post!`

Feel free to add as many blog posts as you want. Now that you have some data in your Contentful space, let's switch to  Astro and start hacking!

### Creating astro components

Before listing our blog posts in the homepage, let's start by creating a new Astro component called `Card.astro` inside the `src/components` directory in your project. This component will be used to display blog post cards on the homepage. 

:::tip
Not familiar with `.astro` files? Read [Astro components](/en/core-concepts/astro-components/) for more information.
:::

```astro title="src/components/Card.astro"
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
    <h2>{title}</h2>
  </a>
  <time>{date}</time>
  <p>{description}</p>
</li>
```

Now that we have our `Card.astro` component, we will modify the `index.astro` file in `src/pages` to list our blog posts.

Let's start by creating a new interface called `blogPostFields` that will be used to type our blog posts entries. This interface will include all the fields that we created in our Contentful model.

```ts
interface blogPostFields {
  title: string;
  date: string;
  description: string;
  content: Document;
  slug: string;
}
```

Import the `contentfulClient` from the `src/lib/contentful.ts` file and use it to fetch all the blog posts entries from Contentful.

```astro title="src/pages/index.astro" ins={2,12,14-22}
---
import { contentfulClient } from "../lib/contentful";

interface blogPostFields {
  title: string;
  date: string;
  description: string;
  content: Document;
  slug: string;
}

const { items } = await contentfulClient.getEntries<blogPostFields>();

const posts = items.map((item) => {
  const { title, date, description, slug } = item.fields;
  return {
    title,
    slug,
    description,
    date: new Date(date).toLocaleDateString()
  };
});
---
```

Finally, import your `Card.astro` component and write your HTML markup to display the blog posts cards. 

```astro astro title="src/pages/index.astro" ins={3, 25-42}
---
import { contentfulClient } from "../lib/contentful";
import Card from "../components/Card.astro";

interface blogPostFields {
  title: string;
  date: string;
  description: string;
  content: Document;
  slug: string;
}

const { items } = await contentfulClient.getEntries<blogPostFields>();

const posts = items.map((item) => {
  const { title, date, description, slug } = item.fields;
  return {
    title,
    slug,
    description,
    date: new Date(date).toLocaleDateString()
  };
});
---
<html lang="en">
  <head>
    <title>My Blog</title>
  </head>
  <body>
    <h1>My Blog</h1>
    <ul>
      {posts.map((post) => (
        <Card
          title={post.title}
          description={post.description}
          date={post.date}
          url={post.slug}
        />
      ))}
    </ul>
  </body>
</html>
```

### Dynamic routes



### Webooks

### Server side rendering



