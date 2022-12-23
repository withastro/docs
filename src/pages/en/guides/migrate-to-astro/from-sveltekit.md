---
title: Migrating from SvelteKit
description: Tips for migrating an existing Sveltekit project to Astro
layout: ~/layouts/MigrationLayout.astro
stub: true
framework: Sveltekit
---

[SvelteKit](https://kit.svelte.dev) is a framework for building web applications on top of Svelte.

## Key Similarities between SvelteKit and Astro

SvelteKit and Astro share some similarities that will help you migrate your project:

- Both SvelteKit and Astro are modern Javascript static-site generators with similar project file structures. Both use a `src/` folder for your project files and a special folder for file-based routing. Creating and managing pages for your site should feel familiar.

- Astro has [an official integration for using Svelte components](/en/guides/integrations-guide/svelte/) and support for NPM packages and community integrations, including several for Svelte. You will be able to write Svelte UI components for interactivity, and may be able to keep some or all of your existing components and dependencies.

- Astro and SvelteKit both allow you to use Headless CMSs, APIs or Markdown-files for data. You can continue to use your preferred authoring system, and will be able to keep your existing content.

## Key Differences between SvelteKit and Astro

When you rebuild your SvelteKit site in Astro, you will notice some important differences:

## Community Resources

- Blog Post: [Rewriting my blog from SvelteKit to Astro](https://kharann.com/blog/rewriting-my-blog/)

- Add your own!