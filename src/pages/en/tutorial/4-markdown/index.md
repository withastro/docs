---
layout: ~/layouts/TutorialLayout.astro
title: Markdown Blog Posts
---

## Goals

BY THE END OF THIS SECTION YOU WILL HAVE:
- Written three blog posts in Markdown (`.md`) files
- Created a second Astro layout to display these Markdown files differently from your main pages
- Added an automatically generated list of your blog posts to your Blog page

Now that you have created a few pages for your website, let's add some blog posts!

## Summary

**Markdown** is a language that is popular for writing longer-form text like articles and blog posts. It includes shorthand symbols for common HTML elements such as headers, font styling, lists and even more complicated items like tables that several applications can render as HTML. Writing content with Markdown allows you to focus on your text, while providing some basic formatting options without the need to wrap words in standard HTML tags.

In Astro, you can add Markdown files (`.md`) anywhere within `src/pages` in your project to automatically create pages for your website. Because formatting options are limited in Markdown, Astro allows you to specify a specific `layout` property for each file, which can be your regular Astro layout component, or a special one, just for displaying Markdown files.

## Before You Go

### Test your knowledge

Fill in the blanks with **layout**, **styles and formatting**, **Markdown**, **`src/pages/`** and **blog post**:

|| **Markdown** || is a popular language for writing long-form content such as articles and blog posts. Markdown lets you include some basic text || **styles and formatting** || using shorthand symbols instead of typing out full HTML element tags. 

The content of a || **blog post** || (or any page) in Astro can be written in an `.md` file and placed within || **`src/pages/`** || to create a page on your website. Don't forget to specify an Astro component as a || **layout** || for your file, or all you will see is your text content! 


### Checklist for moving on
[ ] I am ready to add some blog posts to my Astro project!
