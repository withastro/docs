---
title: Use a CMS with Astro
description: How to use a CMS to add content to Astro
layout: ~/layouts/MainLayout.astro
setup: 
i18nReady: true
---

**Ready to connect a Headless CMS to your Astro project?** Follow one of our guides to integrate a CMS.

Note that many of these pages are **stubs**: they're collections of resources waiting for your contribution!

## Why use a CMS?

A Content Managament System lets you write content and manage assets outside of your Astro project.

This unlocks new features for working with content. Most CMSes give you a visual content editor, the ability to specify standard types of content, and a way to collaborate with others.
It's up to you to determine what content on your site is managed by the CMS, and where on your site you want to display it.

You might use a CMS to build a blog for someone who doesn't know Markdown — they can write posts using a CMS's rich text editor instead. If you're building an ecommerce shop, you might use a CMS to organize and edit shop items. You can configure your CMS to hold certain pieces of information about each shop item, even making them required to avoid incomplete listings, and your Astro project can then fetch and display them.


## Which CMSes work well with Astro?

Because Astro takes care of the _presentation_ of your content, you'll want to choose a _headless_ CMS, like those in the list above. This means that the CMS helps you write your content, but doesn't generate a site that displays it. Instead, you fetch the content data and use in your Astro project. 

Some CMSes, like Storyblok, provide an Astro [integration](/en/guides/integrations-guide/) that helps fetch the content specifically for an Astro site. Others provide a JavaScript SDK, a library that you install and use to fetch your remote content.

## Can I use Astro without a CMS?

Yes! Astro provides built-in ways to [author content](/en/guides/content/), including support for Markdown pages.

