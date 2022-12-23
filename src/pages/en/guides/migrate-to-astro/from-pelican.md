---
title: Migrating from Pelican
description: Tips for migrating an existing Pelican project to Astro
layout: ~/layouts/MigrationLayout.astro
stub: true
framework: Pelican
---

[Pelican](https://getpelican.com) is an open-source static site generator built on Python.

## Key Similarities between Pelican and Astro

Pelican and Astro share some similarities that will help you migrate your project:

- Pelican and Astro are both static-site generators, ideally suited to content-focused sites like blogs.

- Pelican and Astro both allow have built-in support for writing in Markdown, including frontmatter YAML properties for page meta data. However, Astro has very few reserved frontmatter properties compared to Pelican, and therefore almost all of your frontmatter will be user-defined. Even though many of your existing Pelican frontmatter properties will not be "special" in Astro, this meta data can be accessed and used by Astro components. So, you can continue to use your existing Markdown files and frontmatter values.

## Key Differences between Pelican and Astro

When you rebuild your Pelican site in Astro, you will notice some important differences:

- Pelican can process HTML (`.html`) files for page content. Astro can create pages from `.astro` files, which are written using a syntax that is a superset of HTML. You can write `.astro` files using exclusively valid HTML. But, `.html` files are not recognized by Astro.

## Community Resources

- Add your own!