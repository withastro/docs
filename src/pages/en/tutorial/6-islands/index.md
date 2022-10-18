---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Set sail for Astro islands
title: Check in
description: Using client-side Javascript and UI Framework components in Astro to provide interactivity.
setup: |
  import Badge from '~/components/Badge.astro';
  import Box from '~/components/tutorial/Box.astro';
  import Checklist from '~/components/Checklist.astro';
  import Goals from '~/components/tutorial/Goals.astro';
  import MultipleChoice from '~/components/tutorial/MultipleChoice.astro';
  import Option from '~/components/tutorial/Option.astro';
---
Now that you have a fully functioning blog, let's add some interactive islands to your site!

## Where are we now?

Click to run a working version of the code at this point in the tutorial right on this page.

 <iframe src="https://stackblitz.com/edit/astro-tutorial-5?ctl=1&embed=1&file=src/pages/index.astro"></iframe>
 Check your code against the tutorial example, or if you've just joined us, fork on StackBlitz to start coding along in your browser from here.

## Where are we going?

In this unit, you'll use **Astro islands** to bring frontend framework components into your Astro site. 

You will:
- Add a UI framework, Preact, to your Astro project
- Use Preact to create a greeting component and an interactive quote generator
- Learn when you might _not_ choose islands for interactivity

## Before you go
<Box icon="check-list">

### Checklist for moving on

<Checklist key ="interactivity">
- [ ] I am ready to add some interactivity to my site, and start living that island life!
</Checklist>
</Box>
