---
title: Migrate an existing site to Astro
description: Some tips and tricks for converting your site to Astro.
layout: ~/layouts/MainLayout.astro
setup: |
  import CMSGuidesNav from '~/components/CMSGuidesNav.astro';
i18nReady: true
---

SARAH ROUGH NOTES

**Ready to convert your site to Astro?** Follow one of our guides to migrate from a different project/framework.

## Migration Guides

<CMSGuidesNav />

Note that many of these pages are **stubs**: they're collections of resources waiting for your contribution!

## Why migrate your site to Astro?

Astro provides many benefits: performance, simplicity and several built-in and available integrations!

Depending on your existing project, you may be able to bring some, or much of your existing files. However, Astro's project structure is likely to be different than the one you're using. So, there are some key concepts that will help you make the transition to Astro.


## Which projects can I convert to Astro?

Many existing sites can be built with Astro! Astro is ideally suited for your existing content-based sites like blogs, landing pages, marketing sites and portfolios. Astro integrates with several popular headless CMSs, and allows you to connect eCommerce shop carts.

Astro allows you to choose between a statically-generated site and server-side rendering (SSR), making it a great replacement for SSGs or for sites that need to fetch some page data on the fly.

Because Astro's focus is shipping as little JavaScript as necessary via its island architecture, it is well-suited to sites where client-side interactivity is localized to particular components.

## What changes will I encounter when moving to an island architecture?

Migrating your site to Astro means thinking about your site in "islands" or isolated sections: which parts are static? which are dynamic? which are interactive?

### Using JavaScript vs Shipping JavaScript

Your existing project may use a JS framework that ships JavaScript to the browser in order to build even the static presentation of your site. Astro *uses* JavaScript to build your site, but this is done on the server and most of this JavaScript never makes it to the client. Astro only ships JavaScript for the parts of your site which require client-side interactivity.

This means your Astro project is not written as JS-based functions that return templating. Instead, your `.astro` files contain a code fence to "fence off" the JavaScript required to build your site. Otherwise, you are now writing the HTML templating directly, maybe dynamically, that you want to render on the page. Then, only when interactivity on the page is needed, you will consider that part of your site in isolation: "How do I give that page interactivity? A client-side script? A UI framework component?"

### Routes are Pages

- you'll end up with amany endpoints that are their onen entire page when built
- PRO: accessibility, ... ; DIFFS: page transitions, ...;
- also affects design because each page needs to exist on its own e.g. page shell (not one "config" or "assumed page wrapper")


### Islands (might) Need Boats

- By default, Islands are self-contained, isolated (for minimal JS load)
- solutions like nanostores, localStorage etc. are needed to share state/context
- affects design because forces you to consider which data needs to persist, which needs to be shared, exactly where... not just available throughout