---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Add, style and link to pages on your site
title: Check in
description: Adding, styling and navigating between Astro pages.
setup: |
  import Checklist from '~/components/Checklist.astro';
  import Badge from '~/components/Badge.astro';
  import Box from '~/components/tutorial/Box.astro';
  import Goals from '~/components/tutorial/Goals.astro';
---
Now that you have a working site on the web, let's add pages and posts!

## Where are we now?

Click to run a working version of the code at this point in the tutorial right on this page.

 <iframe src="https://stackblitz.com/edit/astro-tutorial-1?ctl=1&embed=1&file=src/pages/index.astro"></iframe>
 Check your code against the tutorial example, or if you've just joined us, fork on StackBlitz to start coding along in your browser from here.


## Where are we going?

<Goals>

  - created new Astro pages (About, Blog)
  - added three blogs post in Markdown
  - styled your About page using Astro's `<style>` tags
</Goals>

 In this unit, you will write code in the **two sections of a `.astro` file** and see how they work together to create the content for a page on your website. 
 
 You'll also add blog posts written as Markdown (`.md`) files with YAML frontmatter. 
 
 So let's add some new pages! All it takes is adding new `.astro` or `.md` files to your project in the right place.

<!-- ### Anatomy of an Astro file

astro title="src/pages/a-typical-astro-file.astro"
--- 
// Astro Script (frontmatter) 
// Written in JavaScript/TypeScript
// used for imports, variables, functions…
--- -->
<!-- Astro Template (body) -->  
<!-- Written in Astro (HTML with additional JSX-like features) -->
<!-- contains HTML elements, components, JX/JSX espressions -->

<!--
[.astro file example image, annotated - CAN WE GET A HIPPO SAMPLE WITH THE NEW CODE COMMENTS??]
-->

## Before you go

<Box icon="check-list">
### Checklist for moving on

<Checklist key="pages">
- [ ] I am ready to make some new pages for my Astro website!
</Checklist>
</Box>
