---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Create page layouts
title: Introduction -- redo this page!
description: Using Markdown to create blog posts on your site.
setup: |
  import Badge from '~/components/Badge.astro';
  import Checklist from '~/components/Checklist.astro';
  import Goals from '~/components/tutorial/Goals.astro';
---
Now that you have created a few pages for your website, let's add some blog posts in this Module!

<Goals>
  - Written three blog posts in Markdown (`.md`) files
  - Created a second Astro layout to display these Markdown files differently from your main pages
  - Added a list of your blog posts to your Blog page with links to the individual posts
</Goals>

**Markdown** is a language that is popular for writing longer-form text like articles and blog posts. It includes shorthand symbols for common HTML elements such as headers, font styling, lists and even more complicated items like tables. 

Writing content with Markdown allows you to focus on your text by providing some basic formatting options so you don't need need to wrap words in standard HTML tags. Markdown files also have a frontmatter section for defining properties such as `title` and `date` written in a language called YAML.

In Astro, you can add Markdown (`.md`) files anywhere within `src/pages` to automatically create pages for your website. Because formatting options are limited in Markdown, Astro allows you to specify a layout as one of the frontmatter properties. This can be your regular Astro layout component, or a different one that is customized for your Markdown files.

## Before you go

### Test your knowledge

Fill in the blanks with **layout**, **formatting**, **Markdown**, **`src/pages/`** and **blog post**:

|| **Markdown** || is a popular language for writing long-form content such as articles and blog posts. Markdown lets you include some basic text || **formatting** || using shorthand symbols instead of typing out full HTML element tags. 

The content of a || **blog post** || (or any page) in Astro can be written in an `.md` file and placed within || **`src/pages/`** || to create a page on your website. Don't forget to specify an Astro component as a || **layout** || for your file, or all you will see is your text content! 


### Checklist for moving on

<Checklist key="markdown">
- [ ] I am ready to add some blog posts to my Astro project!
</Checklist>
