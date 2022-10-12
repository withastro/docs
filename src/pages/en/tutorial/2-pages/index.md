---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Create, style and navigate between pages on your site
title: Intro
description: Creating, styling and navigating between Astro pages.
setup: |
  import Checklist from '~/components/Checklist.astro';
  import Badge from '~/components/Badge.astro';
  import Goals from '~/components/tutorial/Goals.astro';
---

Now that you have a working site on the web, let's add pages and posts!

<Goals>
  - created new Astro pages (About, Blog)
  - added three blogs post in Markdown
  - styled your About page using Astro's `<style>` tags
</Goals>

 In this Module, you will learn about the **two sections of a `.astro` file** and how they work together to create the content for a page on your website. You'll also add blog posts written as Markdown (`.md`) files. Want to make a new page? You'll add a new `.astro` or `.md` file to your project.

 <iframe src="https://stackblitz.com/edit/github-ateemj?embed=1&file=src/pages/index.astro&theme=dark"></iframe>

### Anatomy of an Astro file
```astro title="src/pages/a-typical-astro-file.astro"
--- 
// Astro Script (frontmatter) 
// Written in JavaScript/TypeScript
// used for imports, variables, functions…
---
<!-- Astro Template (body) -->  
<!-- Written in Astro (HTML with additional JSX-like features) -->
<!-- contains HTML elements, components, JX/JSX espressions -->
```

[.astro file example image, annotated - CAN WE GET A HIPPO SAMPLE WITH THE NEW CODE COMMENTS??]

## Before you go

### Checklist for moving on

<Checklist key="pages">
- [ ] I am ready to make some new pages for my Astro website!
</Checklist>
