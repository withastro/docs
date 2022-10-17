---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Welcome, world!
title: About this Tutorial
description: Introduction to Astro's beginner tutorial. All the background knowledge you need to get started!
setup: |
  import Badge from '~/components/Badge.astro';
  import Checklist from '~/components/Checklist.astro';
  import Goals from '~/components/tutorial/Goals.astro';
---
## Project: Build a blog

In this tutorial, you'll learn Astro's key features by building a fully-functioning blog, from zero to full launch! 🚀

Along the way, you'll: 
- set up your development environment 
- create and edit pages and blog posts for your website
- build with Astro components
- query and work with local files
- add interactivity to your site 

Click to run a working version of the finished project:

<iframe src="https://stackblitz.com/edit/astro-tutorial-completed?ctl=1&embed=1&file=src/pages/index.astro"></iframe>

The finished blog will be **deployed to the web**, and can even be used as a personal website once you have completed this tutorial.

:::note
If you would rather start exploring Astro with a pre-built Astro site, you can visit https://astro.new and choose a starter template to open and edit in a in an online editor.
::: 

## About this tutorial

### Where do I start?

**New to web dev?** [Unit 1](/en/tutorial/1-setup/) will make sure you have the development tools and online accounts you'll need to complete the tutorial, whether you're using a local setup with VS Code or a browser-based Stackblitz setup. It will walk you through creating a new Astro project, storing it on GitHub and deploying to Netlify.

**Ready to jump right into code?** [Create a new Astro project](/en/install/auto) on your own, deploy it to the web, and skip ahead to [Unit 2](/en/tutorial/2-astro-pages/)!

### Do I have to go through the lessons in order?

This tutorial is meant to be followed in order, starting with creating and immediately deploying to the web an empty Astro project that you'll keep improving as you go. 

Each unit builds on code used in the last lesson and assumes that you have completed the earlier lessons.

### Do I _really_ have to go through the lessons in order?

We hear you! The beginning of each unit has an embedded StackBlitz with the current state of the project. 

If you want to dive in partway through, open the StackBlitz in your browser and join us along the path.

### Tracking your progress

At the end of each page, you'll find a clickable checklist of tasks you should now be able to.

If you choose to complete these checklists, you'll see your progress in the tutorial navigation sidebar. (This is only set in your browser's local storage, and is not available elsewhere. No data is sent to, nor stored by Astro.) 

### Additional Learning

In addition to the steps to complete your project, there are opportunities to test your knowlege along the way and links to further resources. These are not required, but may help solidify some of the core Astro concepts.

## Before you go

### Checklist for moving on

<Checklist key="introduction">
- [ ] I'm ready to build this thing!
</Checklist>
