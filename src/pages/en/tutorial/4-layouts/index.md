---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Save time and energy with reusable page layouts
title: Check in 
description: Using Astro layouts for your pages and posts.
setup: |
  import Badge from '~/components/Badge.astro';
  import Checklist from '~/components/Checklist.astro';
  import Goals from '~/components/tutorial/Goals.astro';
---
Now that you can build with components, let's create some custom layouts!

## Where are we now?

Click to run a working version of the code at this point in the tutorial right on this page.

 <iframe src="https://stackblitz.com/edit/astro-tutorial-3?ctl=1&embed=1&file=src/pages/index.astro"></iframe>
 Check your code against the tutorial example, or if you've just joined us, fork on StackBlitz to start coding along in your browser from here.

## Where are we going?

In this unit, you'll build two layouts to share common elements and styles across your pages and blog posts.

To do this, you'll learn how to: 

- create reusable layout components
- pass content to your layouts with `<slot />`
- pass data from Markdown frontmatter to your layouts
- nest multiple layouts

<!-- 
**Markdown** is a language that is popular for writing longer-form text like articles and blog posts. It includes shorthand symbols for common HTML elements such as headers, font styling, lists and even more complicated items like tables. 

Writing content with Markdown allows you to focus on your text by providing some basic formatting options so you don't need need to wrap words in standard HTML tags. Markdown files also have a frontmatter section for defining properties such as `title` and `date` written in a language called YAML.

In Astro, you can add Markdown (`.md`) files anywhere within `src/pages` to automatically create pages for your website. Because formatting options are limited in Markdown, Astro allows you to specify a layout as one of the frontmatter properties. This can be your regular Astro layout component, or a different one that is customized for your Markdown files.

## Before you go

### Test your knowledge

Fill in the blanks with **layout**, **formatting**, **Markdown**, **`src/pages/`** and **blog post**:

|| **Markdown** || is a popular language for writing long-form content such as articles and blog posts. Markdown lets you include some basic text || **formatting** || using shorthand symbols instead of typing out full HTML element tags. 

The content of a || **blog post** || (or any page) in Astro can be written in an `.md` file and placed within || **`src/pages/`** || to create a page on your website. Don't forget to specify an Astro component as a || **layout** || for your file, or all you will see is your text content! 
-->

### Checklist for moving on

<Checklist key="markdown">
- [ ] I am ready take my page design to the next level with layouts!
</Checklist>
