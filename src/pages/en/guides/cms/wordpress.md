---
title: Headless WordPress & Astro
description: Add content to your Astro project using WordPress as a CMS
layout: ~/layouts/CMSLayout.astro
stub: false
service: WordPress
---

[WordPress](https://wordpress.org/) is a content management system that includes its own frontend, but can also be used as a headless CMS to provide content to your Astro project.

## Integrating with Astro

WordPress comes with a built-in [WordPress REST API](https://developer.wordpress.org/rest-api/) to connect your WordPress data to Astro. You can optionally install [WPGraphQL](https://wordpress.org/plugins/wp-graphql/) on your site to use GraphQL.

### Prerequisites

To get started, you will need to have the following:

1. **An Astro project** - If you don't have an Astro project yet, our [Installation guide](/en/install/auto/) will get you up and running in no time.

2. **A WordPress site** - Your site's REST API is `[YOUR_SITE]/wp-json/wp/v2/` and is available by default with any WordPress site. It is also possible to [set up WordPress on a local environment](https://wordpress.org/support/article/installing-wordpress-on-your-own-computer/).

### Setting up Credentials

Your WordPress REST API is available to external requests for data fetching of your posts without authentication by default. This does not allow users to modify your data or site settings and allows you to use your data in your Astro project without any credentials.

You may choose to [require authentication](https://developer.wordpress.org/rest-api/frequently-asked-questions/#require-authentication-for-all-requests) if necessary.

### Installing Depenencies

There are no dependencies required to fetch your WordPress data from Astro via the REST API.

### Fetching Data

You will fetch your WordPress data through your site's unique REST API URL and the route for your content. (For a blog, this will commonly be `posts`.) Then, you can render your post's properties using Astro's `set:html=""` directive. For example, to display a list of post titles and their content:

```astro title="src/pages/index.html
---
import Layout from '../layouts/Layout.astro';
const response = await fetch("https://[YOUR-SITE]/wp-json/wp/v2/posts")
const allPosts = await response.json()
---
<Layout>
<h1>My Posts</h1>
{
  allPosts.map((post) => (
    <>
      <h2 set:html="post.title.rendered" />
      <p set:html="post.content.rendered" />
    </>
  ))
}
</Layout>
```

The WordPress REST API includes [global parameters](https://developer.wordpress.org/rest-api/using-the-rest-api/global-parameters/) such as `_fields` and `embed`. 

A large quantity of data is available to you via this API, so you may wish to only fetch certain fields. You can restrict your response by adding the `_fields` paramater to the API URL, for example: `[YOUR-SITE]/wp/v2/posts?_fields=author,id,excerpt,title,link` 

The API can also return content related to your post, such as a link to the parent post, or to comments on the post. You can add the `_embed` parameter to the API URL (e.g. `[YOUR-SITE]/wp/v2/posts?_embed`) to indicate to the server that the response should include these embedded resources.

## Using WordPress Data in Astro

This example fetches data from the public WordPress API of [https://norian.studio/dinosuars/](https://norian.studio/dinosaurs/). This WordPress site stores information about individual dinosaurs under the `dinos` route, just as a blog would store individual blog posts under the `posts` route.

This example shows how to reproduce this site structure in Astro: an index page that lists dinosaurs with links to dynamically-generated individual dinosaur pages.

:::note
To use [Custom Post Types (CPT)](https://learn.wordpress.org/lesson-plan/custom-post-types/) in your WordPress API (not just `post` and `page`), you will have to [configure them in your WordPress dashboard](https://stackoverflow.com/questions/48536646/how-can-i-get-data-from-custom-post-type-using-wp-rest-api) or [add REST API Support For Custom Content Types](https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-rest-api-support-for-custom-content-types/) in WordPress.

This example fetches data from a WordPress site whose content types have already been configured and exposed to the REST API.
:::

### Writing WordPress API calls

You may find it helpful to create a file `src/lib/api.js` to store the functions that will make the necessary API calls.

```ini title="Project Structure" {2-3}
├── src/
├── lib/
│    └── api.js
├── pages/
│    └── index.astro
│    └── dinos/
│         └── [slug].astro
├── astro.config.mjs
└── package.json
```

In `src/lib/api.js`, you can export the `fetch` functions to send requests to the WordPress backend. This file defines a `fetchAPI()` function, as well as functions that use it to fetch all posts, and just a single post.

```js title="lib/api.js"
const API_URL = "https://norian.studio/wp-json/wp/v2/";

// Get post data by API URL and given path
export async function fetchAPI(path) {
    const res = await fetch(`${API_URL}${path}`);
    const json = await res.json();
    return json;
}

export async function getPosts() {
    let posts = await fetchAPI('dinos?per_page=50&_embed');
    return posts;
}

// Filters the posts by slug, returns the matching post
export async function getPost(slug) {
    let posts = await fetchAPI(`dinos?slug=${slug}&_embed`);
    return posts[0];
}
```

### Index page

The page `src/pages/index.astro` lists each dinosaur, with a description and link to its own page.

```ini title="Project Structure" {4-5}
├── src/
├── lib/
│    └── api.js
├── pages/
│    └── index.astro
│    └── dinos/
│         └── [slug].astro
├── astro.config.mjs
└── package.json
```

Fetching via the API returns an object that includes the properties:
- `title.rendered` - Contains the HTML rendering of the title of the post.
- `content.rendered` - Contains the HTML rendering of the content of the post.
- `slug` - Contains the slug of the post. (This provides the link to the dynamically-generated individual dinosaur pages.)

```astro title="/src/pages/index.astro"
---
import Layout from '../layouts/Layout.astro';
import { getPosts } from '../lib/api';

let posts = await getPosts();
---

<Layout title="Dinos!">
  <h1>List of Dinosaurs</h1>
  <section>
    {
      posts.map((post) => (
        <>
          <a href={`/dinos/${post.slug}/`}>
            <h2 set:html="post.title.rendered" />
          </a>
          <p set:html="post.content.rendered" />
        </>
      ))
    }
  </section>
</Layout>
```

### Using the WordPress API to generate pages

The page `src/pages/dinos/[slug].astro` dynamically-generates a page for each dinosaur.

```astro title="/src/pages/dinos/[slug].astro"
---
import Layout from '../layouts/Layout.astro';
import { getPost, getPosts } from '../../lib/api';

const { slug } = Astro.params;
const post = await getPost(slug);

// getStaticPaths() is required for static Astro sites
// if using SSR, you will not need this function
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

<Layout title={post.title.rendered}>
  <section >
    <h2 set:html={post.title.rendered}>
    <article set:html={post.content.rendered} />
  </section>
</Layout>

```

### Returning embedded resources

The `_embed` query parameter of `getPost()` instructs the server to return embedded resources.

```js title="src/lib/api.js" /&_embed/
export async function getPost(slug) {
    let posts = await fetchAPI(`dinos?slug=${slug}&_embed`);
    return posts[0];
}
```

In this case, the `_embedded['wp:featuredmedia']['0'].source_url` property is returned, and can be used to display the featured image on each dinosuar page.

```astro title="/src/pages/dinos/[slug].astro" {3}
<Layout title={post.title.rendered}>
  <section >
    <img src={post._embedded['wp:featuredmedia']['0'].source_url} />
    <h2 set:html={post.title.rendered}>
    <article set:html={post.content.rendered} />
  </section>
</Layout>
```

### Publishing your site
To deploy your site visit our [deployment guide](/en/guides/deploy/) and follow the instructions for your preferred hosting provider.

## Community Resources 

- [Building An Astro Website With WordPress As A Headless CMS](https://blog.openreplay.com/building-an-astro-website-with-wordpress-as-a-headless-cms/) by Chris Bongers.
- [Building with Astro x Wordpress](https://www.youtube.com/watch?v=Jstqgklvfnc) on Ben Holmes's stream.
- [Building a Headless WordPress Site with Astro](https://developers.wpengine.com/blog/building-a-headless-wordpress-site-with-astro) by Jeff Everhart

## Production Sites

The following sites use Astro + WordPress in production:

- [Soft Hard System](https://softhardsystem.com/) by Rafid Muhymin Wafi — [source code on GitHub](https://github.com/RafidMuhymin/softhardsystem)
- [Dinos!](https://wc-dinos.netlify.app/) by Anindo Neel Dutta — [source code on GitHub](https://github.com/leen-neel/astro-wordpress)
