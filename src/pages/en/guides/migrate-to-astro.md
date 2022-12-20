---
title: Migrate an existing site to Astro
description: Some tips and tricks for converting your site to Astro.
layout: ~/layouts/MainLayout.astro
setup: |
  import MigrationGuidesNav from '~/components/MigrationGuidesNav.astro';
i18nReady: true
---

**Ready to convert your site to Astro?** Follow one of our guides to migrate from a different project/framework.

## Migration Guides

<MigrationGuidesNav />

Note that many of these pages are **stubs**: they're collections of resources waiting for your contribution!

## Why migrate your site to Astro?

Astro provides many benefits: performance, simplicity, and many of the features you want built right in to the framework. When you do need to extend your site, Astro provides several official and 3rd-party community integrations.

Migrating may be less work than you think! Depending on your existing project, you may be able to fit some, or many of your files directly into Astro's project structure. Much of your site infrastructure may be reusable when converted to `.astro` components or as-is with our UI framework integrations. And, if you use Markdown/MDX files or a CMS, your site content can be brought directly into Astro.


## Which projects can I convert to Astro?

Many existing sites can be built with Astro. Astro is ideally suited for your existing content-based sites like blogs, landing pages, marketing sites and portfolios. Astro integrates with several popular headless CMSs, and allows you to connect eCommerce shop carts.

Astro allows you to choose between a statically-generated site and server-side rendering (SSR), making it a great replacement for SSGs or for sites that need to fetch some page data on the fly.

Because Astro's focus is shipping as little JavaScript as necessary [via its island architecture](/en/concepts/islands/#what-is-an-astro-island), it is well-suited to sites where client-side interactivity is localized to particular components.

## What will seem different when moving to an island architecture?

Migrating your site to Astro means thinking about your site in "islands" or isolated sections: which parts are static? which are dynamic? which are interactive? which ones really need to communicate with others?

Thinking about your site as "islands" may be a shift of thinking, which brings with it some additional considerations:

### Using JavaScript vs Shipping JavaScript

Your existing project may use a JS framework that ships JavaScript to the browser in order to build even the static presentation of your site. This can lead to significant slowdowns, as even small bundles can lead to long execution times on the client, forcing your ["Time To Interactive" (TTI)](https://web.dev/tti/) or other performance metrics to suffer.

Astro *uses* JavaScript to build your site, but this is done on the server and most of this JavaScript never makes it to the client. Astro only ships JavaScript for the parts of your site which require client-side interactivity.

This means your Astro project is not written as JS-based functions that return templating. Instead, your `.astro` files contain a code fence to "fence off" the JavaScript required to build your site. When outside of the code fence, you are writing the HTML templating directly that you want to render on the page.

```astro
---
// JavaScript goes here and stays on the server
---

<p>Markup goes here, and it shipped to the client</p>
```

 ### Rethinking Interactivity

 When you need to add interactivity somewhere on the page, you only need to consider that page, or even that single component, on its own: "How do I give that page interactivity? A client-side `<script>` tag? A UI framework component?"

 This will affect your design decisions because it forces you to consider which specific elements on the page are truly interactive.
 
 ### Rethinking State, Context and Data Persistence
 
 An Astro project is a Multi-Page Application (MPA) framework: each route is its own new page of HTML retrieved from the server. This gives you some important accessibility features such as managing focus states and announcing route changes by default. The tradeoff is that by default, your app is not wrapped with any shared state or context. 
 
 You will similarly be forced to consider which data needs to be shared or persist and design with solutions like nanostores or local storage.