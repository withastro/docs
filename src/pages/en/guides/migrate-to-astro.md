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

Astro provides many benefits: performance, simplicity, and many of the features you want built right in to the framework. When you do need to extend your site, Astro provides several [official and 3rd-party community integrations](https://astro.build/integrations).

Migrating may be less work than you think!

Depending on your existing project, you may be able to use your existing:

- [UI framework components](/en/core-concepts/framework-components/) directly in Astro. 

- [CSS stylesheets or libraries](/en/guides/styling/) including Taliwind. 

- [Markdown/MDX files](/en/guides/markdown-content/), configured using your existing [remark and rehype plugins](/en/guides/markdown-content/#configuring-markdown-and-mdx).

- [Content from a CMS](/en/guides/cms/) through an integration or API.


## Which projects can I convert to Astro?

[Many existing sites can be built with Astro](/en/concepts/why-astro/). Astro is ideally suited for your existing content-based sites like blogs, landing pages, marketing sites and portfolios. Astro integrates with several popular headless CMSs, and allows you to connect eCommerce shop carts.

Astro allows you to choose between a statically-generated site and [server-side rendering (SSR)](/en/guides/server-side-rendering/), making it a great replacement for SSGs or for sites that need to fetch some page data on the fly.

Because Astro's focus is shipping as little JavaScript as necessary [via its island architecture](/en/concepts/islands/#what-is-an-astro-island), it is well-suited to sites where client-side interactivity is localized to particular components.

## How will I build differently with Astro?

When you migrate to Astro, you will think about the individual pieces of your site: which elements are static? which are dynamic? which are interactive? which ones really need to communicate with others?

This may have you rethinking how you design your site as you build with Astro:

### Use JavaScript vs Ship JavaScript

Your existing project may use a JS framework that ships JavaScript to the browser to build even the static presentation of your site.

Astro **uses JavaScript** to build your site, but this is done on the server and most of this JavaScript never makes it to the client. Astro only **ships JavaScript** for the parts of your site which require client-side interactivity.

This means your Astro project is not written as JS-based functions that return templating. Instead, your `.astro` files contain a code fence to "fence off" the JavaScript required to build each component. When outside of the code fence, you are writing the HTML templating that you want to render on the page.

```astro
---
// JavaScript goes here and stays on the server
---

<p>Markup goes here, and is shipped to the client</p>
```

 ### Design for islands of interactivity

 When you need to add interactivity somewhere on the page, you only need to consider that page, or even that single component, on its own: "How do I give this item interactivity: a [client-side `<script>` tag](/en/guides/client-side-scripts/)? a [UI framework component](/en/core-concepts/framework-components/)?"

 This will affect your design decisions as you consider which elements on the page require client-side interactivity.
 
 ### Solutions for State, Context and Data Persistence
 
 An Astro project is a [Multi-Page Application (MPA)](/en/concepts/mpa-vs-spa/) framework: each route is its own new page of HTML retrieved from the server. This gives you some important accessibility features such as managing focus states and announcing route changes by default. The tradeoff is that by default, your app is not wrapped with any shared state or context. 
 
 You will find yourself looking closely at exactly which data needs to be shared between Astro Islands or persist across pages, and will design with [solutions for sharing state](/en/core-concepts/sharing-state/) like nanostores or local storage instead of app-wide hooks or wrappers.