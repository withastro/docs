---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Beef up your blog
title: Check in
description: Fetching and using data from project files to dynamically generate page content and routes.
setup: |
  import Badge from '~/components/Badge.astro';
  import Box from '~/components/tutorial/Box.astro';
  import Checklist from '~/components/Checklist.astro';
  import MultipleChoice from '~/components/tutorial/MultipleChoice.astro';
  import Option from '~/components/tutorial/Option.astro';
---

Now that you have some blog posts, let's use Astro's API to work with your files!

## Where are we now?

Click to run a working version of the code at this point in the tutorial right on this page.

 <iframe src="https://stackblitz.com/edit/astro-tutorial-4?ctl=1&embed=1&file=src/pages/index.astro"></iframe>
 Check your code against the tutorial example, or if you've just joined us, fork on StackBlitz to start coding along in your browser from here.

## Where are we going?

In this unit, you'll supercharge your blog with an index page, tag pages, and an RSS feed. 

Along the way, you'll learn how to use:
- `Astro.glob()` to access data from files in your project
- `getStaticPaths()` to create multiple pages (routes) at once
- The Astro RSS package to create an RSS feed

## Before you go

<Box icon="check-list">

### Checklist for moving on

<Checklist>
- [ ] I am ready to add some blog features to my Astro project!
</Checklist>
</Box>
