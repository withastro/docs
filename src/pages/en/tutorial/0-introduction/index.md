---
layout: ~/layouts/TutorialLayout.astro
title: Introduction
description: Introduction to Astro's beginner tutorial. All the background knowledge you need to get started!
setup: |
  import Badge from '~/components/Badge.astro';
  import Checklist from '~/components/Checklist.astro';
  import Goals from '~/components/tutorial/Goals.astro';
---
In this tutorial, you will build a fully-functioning Astro blog website, step-by-step, taking you from zero to full launch! 🚀

Along the way, you'll see core Astro concepts like **partial hydration**, **component-based composition** and **file routing** in action. 

You'll build with Astro using established web development practices such as **refactoring**, **semantic HTML tags**, and **mobile-first, responsive design**. 

And you will also learn how to:
- set up your development environnment and start a new project
- create and edit pages for your website
- build with Astro components
- use Astro's run-time API
- add interativity to your site


:::note
If you would rather start exploring Astro with a pre-built Astro site, you can visit https://astro.new and choose a starter template to open and edit in a in an online editor.
::: 

:::tip
You can also visit https://astro.build/play to see how Astro component-based composition works in a single page.
:::

## Project - Build a blog

The "My Learning Astro Blog" that you will build has many of the features you would expect in a developer blog: an About page, a Contact page, and a Blog Index page linking to individual blog posts. The finished blog will be deployed to the web, and can even be used as a personal website once you have completed this tutorial!

After completing the tutorial, your finished blog will look like this: 

[link to finished blog], [screenshots]

## About this tutorial

### Where to start

This tutorial is designed to accommmodate all levels of web development experience. Feel free to skip ahead to [Unit 2](/en/tutorial/2-astro-pages/) if you have already created a new Astro project and are ready to jump right into the code.

### Additional Learning

In addition to the steps to complete your project, there are opportunities to test your knowlege along the way and links to further resources. These are not required, but may help solidify some of the core Astro concepts.

### Tracking your progress

At the end of each section, there is a checklist for moving on so you can be sure you are familiar with the knowledge and skills covered on each page. If you choose to complete these checklists, your progress will be visible in the tutorial navigation sidebar. (This is only set in your browser's local storage, and is not available elswhere. No data is sent to, nor stored by Astro.)

### Checklist for moving on

<Checklist key="introduction">
- [ ] I'm ready to build with Astro! 🚀
</Checklist>

---

## Background Knowledge

### Section Goals

<Goals>
  - learned what background programming knowledge you will need to get started building with Astro
  - chosen and installed any tools that you will use to build your Astro website
  - set up the necessary online accounts to deploy your site to the web
</Goals>

### Pre-Requisites

This tutorial is designed to be accessible to new web developers, as well as devs who are simply new to Astro. It assumes some basic familiarity with **HTML**, **Markdown**, **CSS**, and a little **JavaScript**. But, you will be able to learn a lot of what you need to know during the tutorial itself!

## Development Tools


:::tip
You can also complete this tutorial using a web browser **instead of installing any local software**! You can access both the command line and a code editor together in a cloud development environment like [StackBlitz](https://stackblitz.com) or [CodeSandbox](https://codesandbox.io).

Visit [astro.new](https://astro.new) and click to open the "Completely Empty" project in the editor of your choice.  "Fork" the project to save it to your own account. Then, skip ahead to setting up [Source Control](#source-control) for your tutorial project.
:::

### Terminal

You will use the **command line (terminal)** to create your Astro project and to run key commands to build, develop, and test your site.

You can access the command line through a local terminal program for your operating system. Common applications include: **Terminal** (MacOS/Linux), **Command Prompt** (Windows), **Termux** (Android) and one of these will probably already be on your machine. 

You will also need to have **Node.js** installed. To check to see whether you already have a compatible version installed 

1. Launch your terminal and type the following into the command line:

    ```sh
    node -v
    ```

2. If necessary, follow the instructions to [install Node.js (v.14.15.0 or v16.0.0 or higher)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) via the command line.

### Code Editor

Additionally, you will need to download and install a **code editor** to write your code. We will use **VS Code** in this tutorial, but you can use any editor for your operating system.

1. [Download and install VS Code](https://code.visualstudio.com/#alt-downloads) or another code editor of your choice. 


### Source Control

Many software projects use a version control system to track changes in a project over time. In this tutorial, you will use a free **online git provider** and will not need to know how to use git commands in the terminal. All git actions in this tutorial will be performed through menu items in your code editor and will sync your **repository** (files and version history) to the cloud. This tutorial will use **GitHub** for online source control, but you are welcome to use your preferred online git provider.

1. Create a free account at [GitHub](https://github.com) (or your preferred cloud git provider).

    Make a note of your username. You will view your account, and any projects you create at `https://github.com/username`

### Continuous Build and Deployment
Once your project is stored online, you will connect your repository to a free **web host** to build and deploy your site live on the web every time you commit a change to your code. This tutorial will use **Netlify**, but you are welcome to use your preferred hosting service for deploying your site to the internet.

1. Create a free account at [Netlify](https://netlify.com) (or your preferred hosting service).

    Make a note of your username. You will view your dashboard and any sites you create at `https://app.netlify.com/teams/username`

## Before you go

### Checklist for moving on

#### PRE-REQUISITES
<Checklist key="prerequisites">
- [ ] I have some basic familiarity with HTML, CSS and JavaScript.
</Checklist>

#### TOOLS
<Checklist key="tools">
- [ ] I can access the command line via an application like Terminal (MacOS/Linux) or Command Prompt (Windows)
- [ ] I have Node.js `v14.15.0`, `v16.0.0` or higher installed
- [ ] I have a code editor (e.g. VS Code) locally installed
<Fragment slot="alternative">
- [ ] I have created an account with an online cloud development environment (e.g. StackBlitz, CodeSandbox) and forked the "Completely Empty" template.
</Fragment>
</Checklist>

#### ACCOUNTS
<Checklist key="accounts">
- [ ] I have an account with an online git provider like GitHub or GitLab.
- [ ] I have an account with an online hosting service like Netlify or Vercel.
</Checklist>

### Resources

- <p>[FreeCodeCamp.org](https://freecodecamp.org) <Badge>external</Badge> — a free educational site with full courses or quick refreshers in HTML, CSS, JS and more.</p>
