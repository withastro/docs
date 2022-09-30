---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Fetching and working with data from your project files
title: Working with Data
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
  - created a blog post list using `Astro.glob()` to fetch data about all your Markdown files at once
  - generated multiple `tag` pages from a single Astro page component with dynamic route paramaters using `getStaticPaths()`
  - created an RSS feed for your blog at `rss.xml`
</Goals>

Astro's runtime API gives you access to some handy, pre-made functions you can use for common blog features like making a list of all your posts, creating individual pages for each blog post tag, and creating an RSS feed so that users can subscribe to your new posts in a feed reader. 

You'll see these functions in this unit: 
- `Astro.glob()` which allows you to access multiple files of your site at the same time
- `getStaticPaths()` which allows you to create multiple pages (routes) on your site from one single file
-`rss()`, which uses these to create your blog's feed.

## Before you go

### Test your knowledge

Match the Astro global function with the task it performs for you.

1. Which function loads information from multiple files at once into your Astro component script?

    <MultipleChoice>
      <Option>`rss()`</Option>
      <Option isCorrect>`Astro.glob()`</Option>
      <Option>`getStaticPaths()`</Option>
    </MultipleChoice>

2. Which function generates multiple pages on your website from one single file?

    <MultipleChoice>
      <Option>`rss()`</Option>
      <Option>`Astro.glob()`</Option>
      <Option isCorrect>`getStaticPaths()`</Option>
    </MultipleChoice>

3. Which function creates an XML document that can be interpreted by feed readers?

    <MultipleChoice>
      <Option isCorrect>`rss()`</Option>
      <Option>`Astro.glob()`</Option>
      <Option>`getStaticPaths()`</Option>
    </MultipleChoice>

### Checklist for moving on

<Checklist>
- [ ] I am ready to add some blog features to my Astro project!
</Checklist>
