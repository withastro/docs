---
layout: ~/layouts/MainLayout.astro
title: Content Collections (Experimental)
description: Content collections help organize your Markdown and type-check your frontmatter with schemas.
i18nReady: false
---

Content collections help organize your Markdown or MDX and type-check your frontmatter with schemas. You may reach for collections if you:
- Have a medium-to-large number of documents to manage and fetch (exmaple: a blog with 50+ posts).
- Want to enforce frontmatter fields, and fail if fields are missing (example: every blog post should have a title and description).
- Plan to use content in multiple areas of your site (landing pages, footers, navigation, etc).

## Glossary

We'll be using the words "schema," "collection," and "entry" throughout these docs. Let's define them:

- **Schema:** a way to codify the "structure" of your data. In this case, frontmatter data
- **Collection:** a set of data that share a common schema. In this case, Markdown and MDX files
- **Entry:** A piece of data (Markdown or MDX file) belonging to a given collection
