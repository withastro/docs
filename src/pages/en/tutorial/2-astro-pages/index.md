---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Create, style and navigate between Astro pages on your site
title: Astro Pages
description: Creating, styling and navigating between Astro pages.
setup: |
  import Checklist from '~/components/Checklist.astro';
  import Badge from '~/components/Badge.astro';
  import Goals from '~/components/tutorial/Goals.astro';
---

Now that you have a working site on the web, let's add pages and content to make it your own!

<Goals>
  - created new Astro pages (About, Blog) for your site that are full HTML documents
  - added content to an Astro page using HTML elements
  - defined variables in Astro frontmatter and used them in the component template
  - added scoped styling to an Astro page using Astro's `<style>` tags
</Goals>

In this section, you will add new pages and content to your Astro website using your code editor in your workspace, either locally on your computer, or in your online cloud workspace.

Before writing any code, you will open your code editor and use its terminal to run Astro in **dev (development) mode** so that can preview your changes while you work. 

Using the **continuous integration/deployment** system you have set up with GitHub and Netlify in the previous unit, any updates you **commit and push** (save) to your project's online repository at GitHub will be automatically discovered by Netlify and re-published to the web.

You will learn about the **two sections of a `.astro` file** and how they work together to create the content for a **single page** on your website. Want to make a new page? You'll add a new `.astro` file to your project!

### Anatomy of an Astro file
```astro title="src/pages/a-typical-astro-file"
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

### Test your knowledge

You want to add a new page to your website. Number the following steps in the correct order to explain how this happens:

|| &nbsp &nbsp 4 &nbsp &nbsp || Netlify will re-build my website including any updates, and deploy it at my URL.

|| &nbsp &nbsp 2 &nbsp &nbsp || I will create a new `.astro` file using my code editor.

|| &nbsp &nbsp 1 &nbsp &nbsp || I open my project in my code editor and run Astro in dev mode to see a live preview of my changes.

|| &nbsp &nbsp 3 &nbsp &nbsp || I will commit and push my changes to my repository stored on GitHub.


### Checklist for moving on

<Checklist key="pages">
- [ ] I am ready to make some new pages for my Astro website!
</Checklist>
