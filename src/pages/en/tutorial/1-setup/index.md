---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Create and deploy your first Astro site
title: Create and Deploy an Astro Site
description: Create an Astro site, and deploy it to the web.
setup: |
  import Badge from '~/components/Badge.astro';
  import Checklist from '~/components/Checklist.astro';
  import Goals from '~/components/tutorial/Goals.astro';
---

Now that you have the required tools and accounts to begin building an Astro website, let's put all the pieces together in Module 1!

<Goals>
  - created a new Astro project and be ready to code in an editor
  - created a repository in an online code hosting platform, and connected it to a web host
  - published a live, Astro site on the web!
</Goals>

### How your tools work together

After completing this module, you will have **created a new project** that is **stored online in GitHub** and **connected to Netlify**. 

As you write code, you will periodically commit your changes to GitHub. Netlify will use the files in your GitHub repository to build your website, and then publish it on the internet at a unique address where anyone can view it.

Netlify will continuously monitor your GitHub repository for any committed changes, and will rebuild and republish your site to reflect those changes.

[diagram of relationship of interconnected tools/services]

## Before you go

### Checklist for moving on

<Checklist key="setup">
- [ ] I am ready to create a new Astro site, and connect it to GitHub and Netlify for continuous deployment!
</Checklist>
