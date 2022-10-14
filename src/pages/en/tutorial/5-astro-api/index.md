---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Beef up your blog
title: Check in
description: Fetching and using data from project files to dynamically generate page content and routes.
setup: |
  import Checklist from '~/components/Checklist.astro';
  import Badge from '~/components/Badge.astro';
  import Goals from '~/components/tutorial/Goals.astro';
  import MultipleChoice from '~/components/tutorial/MultipleChoice.astro';
  import Option from '~/components/tutorial/Option.astro';
---

Now that you have some blog posts, let's use Astro's API to work with your files!

## Where are we now?

Click to run a working version of the code at this point in the tutorial right on this page.

 <iframe src="https://stackblitz.com/edit/astro-tutorial-4?ctl=1&embed=1&file=src/pages/index.astro"></iframe>
 Check your code against the tutorial example, or if you've just joined us, fork on StackBlitz to start coding along in your browser from here.

## Where are we going?

<Goals>

  - fetched from your local files to create your list of blog posts
  - created dynamically-generated `tag` pages
  - added an RSS feed for your blog at `rss.xml`

</Goals>

Astro's API gives you access to some handy, pre-made functions you can use to collect data from your existing files to build common blog features like a blog archive, and individual pages for each blog tag. 

Astro also has a package for creating an RSS feed so that users can subscribe to your new posts in a feed reader. 

You'll see these functions and helpers in this unit: 
- `Astro.glob()` which allows you to access data from your local files
- `getStaticPaths()` which allows you to create multiple pages (routes) at once
- `rss()`, which uses both of these functions to create a feed for your blog.

## Before you go

### Checklist for moving on

<Checklist>
- [ ] I am ready to add some blog features to my Astro project!
</Checklist>
