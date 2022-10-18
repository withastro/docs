---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Save time and energy with reusable page layouts
title: Check in 
description: Using Astro layouts for your pages and posts.
setup: |
  import Badge from '~/components/Badge.astro';
  import Box from '~/components/tutorial/Box.astro';
  import Checklist from '~/components/Checklist.astro';
  import Goals from '~/components/tutorial/Goals.astro';
---
Now that you can build with components, let's create some custom layouts!

## Where are we now?

Click to run a working version of the code at this point in the tutorial right on this page.

 <iframe src="https://stackblitz.com/edit/astro-tutorial-3?ctl=1&embed=1&file=src/pages/index.astro"></iframe>
 Check your code against the tutorial example, or if you've just joined us, fork on StackBlitz to start coding along in your browser from here.

## Where are we going?

In this unit, you'll build layouts to share common elements and styles across your pages and blog posts.

To do this, you will:

- create reusable layout components
- pass content to your layouts with `<slot />`
- pass data from Markdown frontmatter to your layouts
- nest multiple layouts

## Before you go

<Box icon="check-list">

### Checklist for moving on

<Checklist key="markdown">
- [ ] I am ready take my page design to the next level with layouts!
</Checklist>
</Box>
