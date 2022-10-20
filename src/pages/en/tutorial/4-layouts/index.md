---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Save time and energy with reusable page layouts
title: "Check in: Unit 4 - Layouts"
description: "Tutorial: Build your first Astro blog —\nUse Astro layouts to share common elements and styles across your pages and posts"
setup: |
  import Badge from '~/components/Badge.astro';
  import Box from '~/components/tutorial/Box.astro';
  import Checklist from '~/components/Checklist.astro';
  import StackblitzIntro from '~/components/tutorial/StackblitzIntro.astro';
---
Now that you can build with components, let's create some custom layouts!

## Where are we now?

<StackblitzIntro slug="astro-tutorial-3"/>

## Where are we going?

In this unit, you'll build layouts to share common elements and styles across your pages and blog posts.

To do this, you will:

- Create reusable layout components
- Pass content to your layouts with `<slot />`
- Pass data from Markdown frontmatter to your layouts
- Nest multiple layouts

## Before you go

<Box icon="check-list">

### Checklist for moving on

<Checklist>
- [ ] I am ready take my page design to the next level with layouts!
</Checklist>
</Box>
