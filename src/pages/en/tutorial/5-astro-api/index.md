---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Add Blog Infrastructure
title: Introduction - Astro's API for working with your files 
description: Fetching and using data from project files to dynamically generate page content and routes.
setup: |
  import Checklist from '~/components/Checklist.astro';
  import Badge from '~/components/Badge.astro';
  import Goals from '~/components/tutorial/Goals.astro';
  import MultipleChoice from '~/components/tutorial/MultipleChoice.astro';
  import Option from '~/components/tutorial/Option.astro';
---

Now that you have some blog posts, let's use Astro's API to add some typical blog features!

<Goals>
  - listed of all your blog posts on your Blog page
  - created new `tag` pages to view all posts containing a certain tag
  - added an RSS feed for your blog at `rss.xml`
</Goals>

Astro's API gives you access to some handy, pre-made functions you can use for common blog features like making a list of all your posts, creating individual pages for each blog post tag, as well as a package for creating an RSS feed so that users can subscribe to your new posts in a feed reader. 

You'll see these functions and helpers in this unit: 
- `Astro.glob()` which allows you to access multiple files of your site at the same time
- `getStaticPaths()` which allows you to create multiple pages (routes) on your site from one single file
- `rss()`, which uses these to create your blog's feed.

## Before you go

### Checklist for moving on

<Checklist>
- [ ] I am ready to add some blog features to my Astro project!
</Checklist>
