---
title: Storyblok & Astro
description: Add content to your Astro project using Wordpress as a CMS
layout: ~/layouts/CMSLayout.astro
stub: true
---

Storyblok is an [official CMS partner](https://astro.build/blog/storyblok-partnership/). A full guide is coming soon!

[Storyblok](https://www.storyblok.com/) is a component based headless CMS that allows you to manage your content by creating reusable components.

## Integrating with Astro

In this section, we will use the [Storyblok integration](https://github.com/storyblok/storyblok-astro) to connect Storyblok to Astro.

### Prerequisites

To get started, you will need to have the following:

1. **An Astro project** - If you don't have an Astro project yet, our [Installation guide](/en/install/auto/) will get you up and running in no time.

2. **A Storyblok account and space** - If you don't have an account yet, you can [sign up for free](https://app.storyblok.com/#!/) and create a new space.

3. **Storyblok API tokens** - You can find your API token in your Storyblok space settings. 
    - **Preview token** - This token is used to fetch the draft/unpublished version of your content.
    - **Public token** - This token is used to fetch the published version of your content.

### Setting up credentials

To connect Storyblok to your Astro project, you will need to set up your credentials. You can find your API token in your Storyblok space settings.

Create a `.env` file in the root of your project and add your Storyblok API token:

```ini title=".env"
STORYBLOK_PREVIEW_TOKEN=YOUR_PREVIEW_TOKEN
STORYBLOK_PUBLIC_TOKEN=YOUR_PUBLIC_TOKEN
```

Now, you should be able to use these environment variables in your project.

Your root directory should now include these new files:

```ini title="Project Structure" ins={2}
├── src/
├── .env
├── astro.config.mjs
└── package.json
```

### Installing dependencies

To connect with your Storyblok space, install the official [Storyblok integration](https://github.com/storyblok/storyblok-astro) using the single command below for your preferred package manager:

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  npm install @storyblok/astro 
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  pnpm install @storyblok/astro
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  yarn add @storyblok/astro 
  ```
  </Fragment>
</PackageManagerTabs>

### Configuring Storyblok

Modify your Astro config file to include the Storyblok integration:

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config';
import storyblok from '@storyblok/astro';
import { loadEnv } from 'vite';

const env = loadEnv(import.meta.env.MODE, process.cwd(), 'STORYBLOK');

export default defineConfig({
  integrations: [
    storyblok({
      accessToken:
        import.meta.env.MODE === 'development'
          ? env.STORYBLOK_PREVIEW_TOKEN
          : env.STORYBLOK_PUBLIC_TOKEN,
      components: {
        // Add your components here
      },
      apiOptions: {
        // Choose your Storyblok space region 
        region: 'us',
      },
    })
  ],
});
```

The Storyblok integration requires an object with the following properties:

1. `accessToken` - The Storyblok API token you created in the previous step.

    :::tip
    Since the astro config file does not support environment variables. Use the `loadEnv` function from Vite to load the environment variables.
    :::

2. `components` - A mapping of Storyblok components to your local components. This is required to render your Storyblok components in your Astro project.

    :::note
    By default, the Storyblok integration will look for your components in the `src` directory.
    :::

3. `apiOptions` - An object containing [Storyblok API options](https://github.com/storyblok/storyblok-astro#options). 

    :::caution
    The default region is `eu`. If you are Storyblok space was created in the US region, you will need to set the `region: 'us'`.
    :::

### Connecting bloks to Astro components

Create a folder called `storyblok` in your `src` directory. This folder will contain all the Astro components that will match your bloks in your Storyblok blok library.

In this example, we will have a `blogPost` blok content type that will be mapped to a `BlogPost.astro` component.

```ini title="Project Structure"
├── src/
│   └── storyblok/
│       └── BlogPost.astro
├── .env
├── astro.config.mjs
└── package.json
```

Inside the `BlogPost.astro` component, you can render the content of your blok. You can access the blok content using the `blok` prop.

```astro title="src/storyblok/BlogPost.astro"
---
import { storyblokEditable, renderRichText } from '@storyblok/astro'

const { blok } = Astro.props
const content = renderRichText(blok.body)
---

<article {...storyblokEditable(blok)}>
  <h1>{blok.title}</h1>
  <p>{blok.description}</p>
  <Fragment set:html={content} />
</article>
```

The integration provides utility functions to help you render your content. `storyblokEditable` will enable the Storyblok editor to edit your content and `renderRichText` will render your rich text content to HTML.

Finally add the `BlogPost` component to your Astro config file:

```js title="astro.config.mjs" ins={15}
import { defineConfig } from 'astro/config';
import storyblok from '@storyblok/astro';
import { loadEnv } from 'vite';

const env = loadEnv(import.meta.env.MODE, process.cwd(), 'STORYBLOK');

export default defineConfig({
  integrations: [
    storyblok({
      accessToken:
        import.meta.env.MODE === 'development'
          ? env.STORYBLOK_PREVIEW_TOKEN
          : env.STORYBLOK_PUBLIC_TOKEN,
      components: {
        blogPost: 'storyblok/BlogPost',
      },
      apiOptions: { 
        region: 'us',
      },
    })
  ],
});
```

## Making a blog with Astro and Storyblok

## Official Resources
- Storyblok provides an [Astro Integration](https://www.storyblok.com/mp/announcing-storyblok-astro) to add Storyblok to your project.

## Community Resources 
- Add yours!
