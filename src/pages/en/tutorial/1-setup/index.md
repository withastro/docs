---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Create and deploy your first Astro site
title: "Check in: Unit 1 - Setup"
description: "Tutorial: Build your first Astro blog —\nPrepare your development environment, and create and deploy your first Astro site"
setup: |
  import Badge from '~/components/Badge.astro';
  import Checklist from '~/components/Checklist.astro';
  import Box from '~/components/tutorial/Box.astro';
---

Now that you know what you're going to build, let's set up all the tools and accounts you'll need!

Skip ahead to [Unit 2](/en/tutorial/2-pages/) if you already have a working development environment, and can [create](/en/install/auto/) and deploy the [Astro minimal starter template](https://github.com/withastro/astro/tree/main/examples/minimal) to the web on your own.

### Where are we going?

In this unit, you will **create a new project** that is **stored online in GitHub** and **connected to Netlify**. 

As you write code, you will periodically commit your changes to GitHub. Netlify will use the files in your GitHub repository to build your website, and then publish it on the internet at a unique address where anyone can view it.

Netlify will continuously monitor your GitHub repository for any committed changes, and will rebuild and republish your site to reflect those changes.

## Before you go

<Box icon="check-list">
### Checklist for moving on

<Checklist>
- [ ] Let's get set up for building an Astro project!
</Checklist>
</Box>
