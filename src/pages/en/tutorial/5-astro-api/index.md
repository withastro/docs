---
layout: ~/layouts/TutorialLayout.astro
title: Using Astro’s API
---

## Goals

BY THE END OF THIS SECTION, YOU WILL HAVE:

- used `Astro.glob()` to fetch data about all your Markdown files at once and create a blog post archive

- generated multiple pages with a single Astro component with dynamic route paramaters using `getStaticPaths()`

- created an RSS feed for your blog at `rss.xml`

Now that you have some blog posts, let's use Astro's API to add some typical blog features!

## Summary

Astro's runtime API gives you access to some handy, pre-made functions you can use for common blog features like making a list of all your posts, creating individual pages for each blog post tag, and creating an RSS feed so that users can subscribe to your new posts in a feed reader. 

The functions we will see in this unit are `Astro.glob()` which allows you to access multiple files of your site at the same time, and `getStaticPaths()` which allows you to multiple create pages (route paths) on your site from one single file. Then we will use Astro's provided `rss()` function which uses both of these to create your blog's feed.


## Before You Go

### Test your knowledge

Match the Astro global function with the task it performs for you:

1. `rss()` || C ||   -    A. loads the information from multiple files at once into your Astro component script

2. `Astro.glob()` || B || -  B. generates multiple pages on your website from one single file

3. `getStaticPaths()` || A || - C. creates an RSS .xml document that can be interpreted by feed readers

### Checklist for moving on
[ ] I am ready to add some blog features to my Astro project!
