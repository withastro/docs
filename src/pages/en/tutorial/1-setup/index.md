---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Create and deploy your first Astro site
title: How your tools work together
description: Create an Astro site, and deploy it to the web.
setup: |
  import Badge from '~/components/Badge.astro';
  import Checklist from '~/components/Checklist.astro';
  import Goals from '~/components/tutorial/Goals.astro';
---

Now that you know what you're going to build, let's set up all the tools and accounts you'll need!

Skip ahead to [Chapter 2](/en/tutorial/2-pages/) if you already have a working development environment, and can [create](/en/install/auto) and deploy the [Astro minimal starter template](https://github.com/withastro/astro/tree/main/examples/minimal) to the web on your own.

<Goals>
  - created a new Astro project and be ready to code in an editor
  - created a repository in GitHub, and connected it to Netlify
  - published an Astro site on the web
</Goals>

### How your tools work together

After completing this module, you will have **created a new project** that is **stored online in GitHub** and **connected to Netlify**. 

As you write code, you will periodically commit your changes to GitHub. Netlify will use the files in your GitHub repository to build your website, and then publish it on the internet at a unique address where anyone can view it.

Netlify will continuously monitor your GitHub repository for any committed changes, and will rebuild and republish your site to reflect those changes.

[diagram of relationship of interconnected tools/services]

## Before you go

### Checklist for moving on

<Checklist key="setup">
- [ ] I am ready to get my new Astro project launched!
</Checklist>
