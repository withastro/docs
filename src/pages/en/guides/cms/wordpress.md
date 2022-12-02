---
title: Headless WordPress & Astro
description: Add content to your Astro project using WordPress as a CMS
layout: ~/layouts/CMSLayout.astro
stub: false
service: WordPress
---

[WordPress](https://wordpress.org/) is a content management system that includes its own frontend, but can also be used as a headless CMS to provide content to your Astro project.

## Integrating with Astro
In this section, we will use the [WordPress REST API](https://developer.wordpress.org/rest-api/) to connect our WordPress site to Astro.

#### Prerequisites

To get started, you will need to have the following:

1. **An Astro project** - If you don't have an Astro project yet, our [Installation guide](/en/install/auto/) will get you up and running in no time.

2. **A WordPress site** - For this example we're going to use [this site](https://norian.studio/dinosaurs/) as our WordPress backend. However, you may use any site you want. Just go to `[YOUR_SITE]/wp-json/wp/v2/` to access your REST API. Check out [this article](https://wordpress.org/support/article/installing-wordpress-on-your-own-computer/) if you want to set up a WordPress on a local environment.

### Setting up WordPress
WordPress comes with a built in REST API, however, if you want to use GraphQL you need to install [WPGraphQL](https://wordpress.org/plugins/wp-graphql/) on your site. But do keep in mind that we're using REST for this example.

### Project structure
```ini title="Project Structure" ins={2, 3}
├── src/
├── lib/
│    └── api.js
├── astro.config.mjs
└── package.json
```

### API Calls
We're going to use `fetch` to send requests to our WordPress backend.

```js title="lib/api.js"
const API_URL = DOMAIN_NAME/wp-json/v2/;

// Gets post by API URL and given path
export async function fetchAPI(path) {
    const res = await fetch(`${API_URL}${path}`);
    const json = await res.json();

    return json;
}

export async function getPosts() {
    let posts = await fetchAPI('dinos?per_page=50&_embed');
    return posts;
}

export async function getPost(slug) {
    let posts = await fetchAPI(`dinos?slug=${slug}&_embed`);
    return posts[0];
}
```

Take a look at how we're sending requests to the `dinos` route as it is a custom post type on our WordPress site. Change this to be `posts` or whatever your custom post type is on your website. Make sure the post type has been exposed to the REST API. You can either [code it up](https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-rest-api-support-for-custom-content-types/) or if you're using CPT UI, you have to [expose it in the settings](https://stackoverflow.com/questions/48536646/how-can-i-get-data-from-custom-post-type-using-wp-rest-api).

## Rendering our posts

### Index page
```ini title="Project Structure" ins={3, 4}
├── src/
│   └── pages/
│         └── dinos/
│               └── [slug].astro
│         index.astro
├── astro.config.mjs
└── package.json
```

We're going to take advantage of Astro's [top level await](/en/guides/data-fetching/#fetch-in-astro) to fetch the posts to our pages.

```astro title="/src/pages/index.astro"
---
import Layout from '../layouts/Layout.astro';
import { getPosts } from 'lib/api';

let posts = await getPosts(); // It's that simple!
---

<Layout title="Dinos!">
  <section>
      {
          posts.map((post) => (
              <>
                  <h1 set:html="post.content.rendered" />
                  <p set:html="post.content.rendered" />
              </>
          ))
      }
  </section>
</Layout>
```

`posts` is an array of Objects that we recieve from the REST API. Each object has the following properties:
- `slug` - Contains the slug of the post, we'd need this later to generate single pages for our post.
- `title.rendered` - Contains the HTML rendering of the title of the post.
- `content.rendering` - Contains the HTML rendering of the content of the post

### Single post page

Now that we've rendered out posts on our homepage, let's make seperate pages for each post.

First, let's wrap our post title in an anchor tag.

```html title="/src/pages/index.astro"
<a href=/dinos/{post.slug}>
  <h1 set:html="post.content.rendered" />
</a>
```

Notice how we're using the `slug` property to get the slug of our post.

First, let's take a look at how we can fetch a post by slug:
```js title="/lib/api.js"
export async function getPost(slug) {
    let posts = await fetchAPI(`dinos?slug=${slug}`);
    return posts[0];
}
```

The REST API accepts a parameter named `slug` which would filter the posts by the slug. It returns an array of size 1 (because multiple posts can never have the same slug) which contains the post we want.

Now, let's go to our `dinos/[slug].astro` page.

```astro title="/src/pages/dinos/[slug].astro"
---
import { getPost, getPosts } from 'lib/api';

const { slug } = Astro.params;
const post = await getPost(slug);

import Layout from '~/layouts/Layout.astro';

export async function getStaticPaths() {
	let posts = await getPosts();

	return posts.map((post) => {
		return {
			params: { slug: post.slug },
			props: { post: post },
		};
	});
}
---

<Layout title={dino.title.rendered}>
    <section >
      <h2 set:html={post.title.rendered}>
      <article set:html={post.content.rendered} />
    </section>
</Layout>

```

`getStaticPaths()` is a function built into Astro to generate static pages for our site. You can learn more about it [here.](/en/reference/api-reference/#getstaticpaths) If you've opted for [SSR](/en/guides/server-side-rendering/), you won't need this function.

Now, if you visit [localhost](http://localhost:3000/dinos/rhizodus) you should see the post content on your page. 

### Featured images

To get featured images, we need to add the `_embed` query parameter to our request.

```js title="/lib/api.js" /&_embed/
export async function getPost(slug) {
    let posts = await fetchAPI(`dinos?slug=${slug}&_embed`);
    return posts[0];
}
```

Now, we can access the `_embedded['wp:featuredmedia']['0'].source_url` property to get the featured image of our post.

```astro title="/src/pages/dinos/[slug].astro"

<Layout title={post.title.rendered}>
    <section >
      <image src={post._embedded['wp:featuredmedia']['0'].source_url} />
      <h2 set:html={post.title.rendered}>
      <article set:html={post.content.rendered} />
    </section>
</Layout>
```

Congratulations! You have a working site built with the WordPress backend!

### Going beyond
If you would like to learn more how the WordPress REST API works check out WordPress' [docs.](https://developer.wordpress.org/rest-api/)

## Publishing your site
To deploy your site visit our [deployment guide](/en/guides/deploy/) and follow the instructions for your preferred hosting provider.

## Community Resources 

- [Building An Astro Website With WordPress As A Headless CMS](https://blog.openreplay.com/building-an-astro-website-with-wordpress-as-a-headless-cms/) by Chris Bongers.
- [Building with Astro x Wordpress](https://www.youtube.com/watch?v=Jstqgklvfnc) on Ben Holmes's stream.
- [Building a Headless WordPress Site with Astro](https://developers.wpengine.com/blog/building-a-headless-wordpress-site-with-astro) by Jeff Everhart

## Production Sites

The following sites use Astro + WordPress in production:

- [Soft Hard System](https://softhardsystem.com/) by Rafid Muhymin Wafi — [source code on GitHub](https://github.com/RafidMuhymin/softhardsystem)
- [Dinos!](https://wc-dinos.netlify.app/) by Anindo Neel Dutta — [source code on GitHub](https://github.com/leen-neel/astro-wordpress)
