---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Getting Started
title: Introduction
description: Introduction to Astro's beginner tutorial. All the background knowledge you need to get started!
setup: |
  import Badge from '~/components/Badge.astro';
  import Checklist from '~/components/Checklist.astro';
  import Goals from '~/components/tutorial/Goals.astro';
---
In this tutorial, you will build a fully-functioning Astro blog website, step-by-step, taking you from zero to full launch! 🚀

You will also learn how to:
- set up your development environnment and start a new project
- create and edit pages for your website
- build with Astro components
- use Astro's run-time API
- add interativity to your site

Along the way, you'll see core Astro concepts like **Astro islands**, **component-based composition** and **file routing** in action. 

:::note
If you would rather start exploring Astro with a pre-built Astro site, you can visit https://astro.new and choose a starter template to open and edit in a in an online editor.
::: 

## Project: Build a blog

The blog that you will build has many of the features you would expect in a developer blog: a Home page, an About page, and a Blog Index page linking to individual blog posts. The finished blog will be deployed to the web, and can even be used as a personal website once you have completed this tutorial!

<!--
[UPDATE THIS]

```
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   └── Button.jsx
│   ├── layouts/
|   |   ├── BaseLayout.astro
│   │   └── PostLayout.astro
│   └── pages/
|   |   ├── about.astro
|   |   ├── blog.astro
│   │   ├── posts/
│   │   │   ├── post-1.md
│   │   │   ├── post-2.md
|   |   |   ├── post-3.md
│   │   │   └── post-4.md
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
└── package.json

```
-->
After completing the tutorial, your finished blog will look like this: 

[link to finished blog], [screenshots]

## About this tutorial

### Where to start

This tutorial is designed to accommmodate all levels of web development experience. Feel free to skip ahead to [Unit 2](/en/tutorial/2-astro-pages/) if you have already created a new Astro project, deployed it on the web, and are ready to jump right into the code.

### Additional Learning

In addition to the steps to complete your project, there are opportunities to test your knowlege along the way and links to further resources. These are not required, but may help solidify some of the core Astro concepts.

### Tracking your progress

At the end of each section, there is a checklist for moving on so you can be reminded of the knowledge and skills covered on each page. If you choose to complete these checklists, your progress will be visible in the tutorial navigation sidebar. (This is only set in your browser's local storage, and is not available elsewhere. No data is sent to, nor stored by Astro.)

## Before you go
### Checklist for moving on

<Checklist key="introduction">
- [ ] I'm ready to build with Astro! 🚀
</Checklist>
