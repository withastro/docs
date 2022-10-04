---
title: Contentful & Astro
description: How to connect your Contentful CMS to your Astro site.
setup: |
    import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro'
layout: ~/layouts/MainLayout.astro
---

[Contentful](https://www.contentful.com/) is a headless CMS that allows you to manage content, integrate with other services, and publish to multiple platforms.

## Integrating with Astro

In this section, we'll use the [Contentful SDK](https://github.com/contentful/contentful.js) to connect your Contentful space to Astro with zero client side JavaScript.

### Prerequisites

To get started, you will need to have the following:

1. **An Astro project** - If you don't have an Astro project yet, our [Installation guide](/en/install/auto/) will get you up and running in no time.

2. **A Contentful account and a Contentful space**. If you don't have an account, you can [sign up](https://www.contentful.com/sign-up/) for a free account and create a new Contentful space. You can also use an existing space if you have one. 

3. **Contentful credentials** - You can find the following credentials in your contentful dashboard **Settings > API keys**. If you don't have any API keys, create one by clicking in **Add API key**.

    - **Contentful space ID** - The ID of your Contentful space. 
    - **Contentful delivery access token** - The access token to consume _published_ content from your Contentful space.
    - **Contentful preview access token** - The access token to consume _unpublished_ content from your Contentful space.

### Setting up credentials

To add your Contentful space's credentials to Astro, create an `.env` file in the root of your project with the following variables:

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
:::tip
Check out [Using environment variables](/en/guides/environment-variables/) for more information about environment variables and `.env` files in Astro.
:::

Your root directory should now include these new files:

```ini title="Project Structure" ins={2-3}
├── src/
│   └── env.d.ts
├── .env
├── astro.config.mjs
└── package.json
```

### Installing dependencies

To connect with your Contentful space, install [`contentful.js`](https://github.com/contentful/contentful.js), official Contentful SDK for JavaScript, and [`rich-text-html-renderer`](https://github.com/contentful/rich-text/tree/master/packages/rich-text-html-renderer), a package to render rich text fields in HTML.

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  # install contentful and @contentful/rich-text-html-renderer with npm 
  npm install contentful @contentful/rich-text-html-renderer
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  # install contentful and @contentful/rich-text-html-renderer with pnpm
  pnpm install contentful @contentful/rich-text-html-renderer
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  # install contentful and @contentful/rich-text-html-renderer with yarn
  yarn add contentful @contentful/rich-text-html-renderer
  ```
  </Fragment>
</PackageManagerTabs>

Next, create a new file called `contentful.ts` in `src/lib` directory in your project.

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

The above code snippet creates a new Contentful client, passing in credentials from the `.env` file. 

:::caution
While in development mode, your content will be fetched from the **Contentful preview API**. This means that you will be able to see unpublished content from the Contentful web app. At build time, your content will be fetched from the **Contentful delivery API**. This means that only published content will be available at build time. 
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

Now that you have your Contentful client set up, you can fetch data from Contentful inside your Astro components. For example, if the content type in your Contentful space has a text field for a title and a rich text for content your component may look like this:

```astro
---
import { contentfulClient } from "../lib/contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import type { Document } from "@contentful/rich-text-types";

interface blogPost {
    title: string,
    content: Document
}

const { items } = await contentfulClient.getEntries<blogPost>({
  content_type: "blogPost",
});
---
<body>
  {items.map((item) => (
    <section>
      <h2>{item.fields.name}</h2>
      <article set:html={documentToHtmlString(items.fields.content)}></article>
    </section>
  ))}
</body>
```

:::tip
If you have an empty Contentful space, check out [setting up a Contentful model](#setting-up-a-contentful-model) to learn how to create a basic blog model for your content.
:::

You can find more querying options in the [contentful.js documentation](https://contentful.github.io/contentful.js/contentful/9.1.34/ContentfulClientAPI.html).

## Making a blog with Astro and Contentful

In this section we'll use our Contentful–Astro setup to create a blog with Contentful as the CMS. 

### Prerequisites

1. **A Contentful space** - For this tutorial we recommend starting with an empty space. If you already have a content model, feel free to use it, but you will need to modify our code snippets to match your content model.
2. **An Astro project integrated with the [Contentful SDK](https://github.com/contentful/contentful.js)** - See [integrating with Astro](#integrating-with-astro) for more details on how to set up an Astro project with Contentful.

### Setting up a Contentful model

Inside your Contentful space, in **Content model** section, create a new content model with the following fields:

- **Name:** Blog Post
- **API identifier:** `blogPost`
- **Description:** This content type is for a blog post

In your newly created content type, use the **Add Field** button to add 5 new fields with the following parameters:

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

Click **Save** to save your changes. In the **Content** section of your Contentful space, create a new entry by clicking the **Add Entry** button. Then, fill in the fields:

- **Title:** `Astro is amazing!`
- **Slug:** `astro-is-amazing`
- **Description:** `Astro is a new static site generator that is blazing fast and easy to use.`
- **Date:** `2021-10-01`
- **Content:** `This is my first blog post!`

Click **Publish** to save your entry. Feel free to add as many blog posts as you want, then switch to your favorite code editor to start hacking with Astro!

### Displaying blog posts previews

Create a new interface called `blogPost` and add it to your `contentful.ts` file in `src/lib`. This interface will match the fields of your blog post content type in Contentful and it will be used to type your blog post entries.

```ts title="src/lib/contentful.ts" ins={2,4-10}
import contentful from "contentful";
import type { Document } from "@contentful/rich-text-types";

export interface blogPost {
  title: string;
  date: string;
  description: string;
  content: Document;
  slug: string;
}

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.DEV
    ? import.meta.env.CONTENTFUL_PREVIEW_TOKEN
    : import.meta.env.CONTENTFUL_DELIVERY_TOKEN,
  host: import.meta.env.DEV ? "preview.contentful.com" : "cdn.contentful.com",
});

```

Go to your `index.astro` file in `src/pages` and import your `blogPost` interface and  `contentfulClient` from `src/lib/contentful.ts`. 

Using the `getEntries` method from `contentfulClient`, fetch all the entries with a content type of `blogPost`. You can pass the `blogPost` interface to the `getEntries` method to type your response. 

```astro title="src/pages/index.astro"
---
import { contentfulClient } from "../lib/contentful";
import type { blogPost } from "../lib/contentful";

const entries = await contentfulClient.getEntries<blogPost>({
  content_type: "blogPost",
});
---
```

The items property of `entries` contains the list of blog posts. You can use the `map` method to iterate over the list and format the response. In this example, you are deestructuring the `fields` property of each item and formating the date to display it in a more readable format.

```astro title="src/pages/index.astro" ins={9-17}
---
import { contentfulClient } from "../lib/contentful";
import type { blogPost } from "../lib/contentful";

const entries = await contentfulClient.getEntries<blogPost>({
  content_type: "blogPost",
});

const posts = entries.items.map((item) => {
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

Finally, you can use the `posts` variable to write the markup of your blog posts previews.

```astro astro title="src/pages/index.astro" ins={19-37}
---
import { contentfulClient } from "../lib/contentful";
import type { blogPost } from "../lib/contentful";

const entries = await contentfulClient.getEntries<blogPost>({
  content_type: "blogPost",
});

const posts = entries.items.map((item) => {
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
        <li>
          <a href={`/posts/${slug}/`}>
            <h2>{title}</h2>
          </a>
          <time>{date}</time>
          <p>{description}</p>
        </li>
      ))}
    </ul>
  </body>
</html>
```

### Dynamic routes

To generate your blog posts pages, you will use [dynamic routes](/en/core-concepts/routing/#dynamic-routes) and the `getStaticPaths()` function. This function will be called at build time to generate the list of paths that will be rendered to HTML.

First, create a new file called `[slug].astro` in `src/pages/posts/` and import the `blogPost` interface and `contentfulClient` from `src/lib/contentful.ts`. 

The `contentfulClient` will be used to query your Contentful space and the `blogPost` interface will be passed to the `getEntries` method to type the response as a list of objects with those fields. 

```astro title="src/pages/posts/[slug].astro"
---
import { contentfulClient } from "../../lib/contentful";
import type { blogPostFields } from "../../lib/contentful";

export async function getStaticPaths() {
  const entries = await contentfulClient.getEntries<blogPostFields>({
    content_type: "blogPost",
  });
}
---
```

Inside the `getStaticPaths()` function, fetch the list of blog posts using the `getEntries` method of the `contentfulClient`.

The items property of the response contains a list of blog posts. You can use the `map` method to iterate over the list and return the slug of each blog post.

```astro title="src/pages/posts/[slug].astro" ins={3,11-19}
---
import { contentfulClient } from "../../lib/contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import type { blogPostFields } from "../../lib/contentful";

export async function getStaticPaths() {
  const entries = await contentfulClient.getEntries<blogPostFields>({
    content_type: "blogPost",
  });

  const pages = entries.items.map((item) => ({
    params: { slug: item.fields.slug },
    props: {
      title: item.fields.title,
      content: documentToHtmlString(item.fields.content),
      date: new Date(item.fields.date).toLocaleDateString(),
    },
  }));
  return pages;
}
---
```

In this example, `getStaticPaths()` returns an array of objects with the `params` and `props` properties. The `params` property has the `slug` property, which will be used to generate the URL of each page. The `props` property has the `title`, `content`, and `date` properties. These properties will be passed to the page component as props.

Finally, you can use the page `props` to display your blog post.

<!-- Finally, you can use the props to display your blog post. -->

```astro title="src/pages/posts/[slug].astro" ins={21,23-32}
---
import { contentfulClient } from "../../lib/contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import type { blogPost } from "../../lib/contentful";

export async function getStaticPaths() {
  const { items } = await contentfulClient.getEntries<blogPost>({
    content_type: "blogPost",
  });
  const pages = items.map((item) => ({
    params: { slug: item.fields.slug },
    props: {
      title: item.fields.title,
      content: documentToHtmlString(item.fields.content),
      date: new Date(item.fields.date).toLocaleDateString(),
    },
  }));
  return pages;
}

const { content, title, date } = Astro.props;
---
<html lang="en">
  <head>
    <title>{title}</title>
  </head>
  <body>
    <h1>{title}</h1>
    <time>{date}</time>
    <article set:html={content} />
  </body>
</html>
```
### Webhooks

If your project is generated using SSG (Static Site Generation), you will need to set up a webhook to trigger a new build when your content changes. Netlify and Vercel provide a webhook feature that you can use to trigger a new build. 

In Netlify, go to your Netlify site dashboard and click on **Build & deploy**. Under the **Continuous Deployment** tab, find the **Build hooks** section and click on **Add build hook**. Provide a name for your webhook and select the branch you want to trigger the build on. Click on **Save** and copy the generated URL.

In Vercel, go to your Vercel project dashboard and click on **Settings**. Under the **Git** tab, find the **Deploy Hooks** section. Provide a name for your webhook and the branch you want to trigger the build on. Click on **Add** and copy the generated URL.

In your Contentful space **settings**, click on the **Webhooks** tab and create a new webhook by clicking the **Add Webhook** button. Provide a name for your webhook and paste the webook URL you copied. Finally, hit **Save** to create the webhook.

Now, whenever you publish a new blog post in Contentful, a new build will be triggered and your blog will be updated.

### Server side rendering

If you want to use server side rendering (SSR), you will use the `id` of your blog post to query your Contentful space using the `getEntry()` method. If the `id` is not valid, you can trigger a redirect using Astro API routes.

<!-- For server side rendering (SSR), you will use the `getEntry()` method to fetch a single blog post and use the  -->

```astro title="src/pages/posts/[id].astro"
---
import { contentfulClient } from "../../lib/contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import type { blogPostFields } from "../../lib/contentful";

let post;
const { id } = Astro.params;
try {
  post = await contentfulClient.getEntry<blogPostFields>(String(id)).then((entry) => ({
    title: entry.fields.title,
    date: entry.fields.date,
    content: documentToHtmlString(entry.fields.content),
  }));
} catch {
  return Astro.redirect('/404')
}
---
<html lang="en">
  <head>
    <title>{post.title}</title>
  </head>
  <body>
    <h1>{post.title}</h1>
    <time>{post.date}</time>
    <article set:html={post.content} />
  </body>
</html>
```
