---
title: Storyblok & Astro
description: Add content to your Astro project using Wordpress as a CMS
layout: ~/layouts/CMSLayout.astro
setup: |
    import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro'
stub: true
---


[Storyblok](https://www.storyblok.com/) is a component based headless CMS that allows you to manage your content by creating reusable components.

## Integrating with Astro

In this section, we will use the [Storyblok integration](https://github.com/storyblok/storyblok-astro) to connect Storyblok to Astro.

### Prerequisites

To get started, you will need to have the following:

1. **An Astro project** - If you don't have an Astro project yet, our [Installation guide](/en/install/auto/) will get you up and running in no time.

2. **A Storyblok account and space** - If you don't have an account yet, you can [sign up for free](https://app.storyblok.com/#/signup) and create a new space.

3. **Storyblok API tokens** - You can find and generate your API tokens in the Access Tokens tab of your Storyblok space settings. 
    - **Preview token** - This token will be used to fetch drafts or unpublished versions of your content.
    - **Public token** - This token will be used to fetch only published content.

### Setting up credentials

To add your Storyblok credentials to Astro, create a `.env` file in the root of your project with the following variables:

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

To connect Astro with your Storyblok space, install the official [Storyblok integration](https://github.com/storyblok/storyblok-astro) using the single command below for your preferred package manager:

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

1. `accessToken` - This are the Storyblok API tokens that we added in the previous step. We will use the preview token in development and the public token in production.

    :::tip
    Since the astro config file does not support environment variables. Use the `loadEnv` function from Vite to load the environment variables.
    :::

2. `components` - An object that maps Storyblok component names to paths to your local components. This is required to render your Storyblok components in Astro.

    :::note
    The component paths are relative to the `src` directory.
    :::

3. `apiOptions` - An object containing [Storyblok API options](https://github.com/storyblok/storyblok-astro#options). 

    :::caution
    The default region is `eu`. If your Storyblok space was created in the US region, you will need to set the `region: 'us'`.
    :::

### Connecting bloks to Astro components

To connect your bloks to Astro, create a new folder named `storyblok` in the `src` directory. This folder will contain all the Astro components that will match your bloks in your Storyblok blok library.

In this example, we have a `blogPost` blok content type in our Storyblok library with the following fields:

- `title` - A text field
- `description` - A text field
- `content` - A rich text field

Our goal is to create the equivalent Astro component that will use these fields to render its content. To do this, create a new file named `BlogPost.astro` inside `src/storyblok` with the following content:

```astro title="src/storyblok/BlogPost.astro"
---
import { storyblokEditable, renderRichText } from '@storyblok/astro'

const { blok } = Astro.props
const content = renderRichText(blok.content)
---

<article {...storyblokEditable(blok)}>
  <h1>{blok.title}</h1>
  <p>{blok.description}</p>
  <Fragment set:html={content} />
</article>
```

The `blok` property is the data that we will receive from Storyblok. It will contain the values of the fields that we defined in the previous step.

To render our content, the integration provides utility functions such as:

- `storyblokEditable` - it adds the necessary attributes to the elements so that you can edit them in Storyblok.
- `renderRichText` - it transforms the rich text field into HTML.

Your root directory should include these new files:

```ini title="Project Structure" ins={3}
├── src/
│   └── storyblok/
│       └── BlogPost.astro
├── .env
├── astro.config.mjs
└── package.json
```

Finally, to connect the `blogPost` blok to the `BlogPost` component, add a new property to your components object in your Astro config file. The key is the name of the blok and the value is the path to the component.

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
To test the setup, create a new story with the `blogPost` content type. Then fetch and render your story directly into a page:

```astro title="pages/test.astro"
---
import { useStoryblokApi } from '@storyblok/astro'
import StoryblokComponent from '@storyblok/astro/StoryblokComponent.astro'

const storyblokApi = useStoryblokApi()

const { data } = await storyblokApi.get("cdn/stories/test-post", { version: "draft" });

const content = data.story.content;
---
<StoryblokComponent blok={content} />
```

## Making a blog with Astro and Storyblok

## Official Resources

- Storyblok provides an [Astro Integration](https://www.storyblok.com/mp/announcing-storyblok-astro) to add Storyblok to your project.

## Community Resources 

- Add yours!
