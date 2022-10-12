---
layout: ~/layouts/TutorialLayout.astro
unitTitle: Add interactive UI elements to your site
title: Introduction -- Using JavaScript in Astro
description: Using client-side Javascript and UI Framework components in Astro to provide interactivity.
setup: |
  import Checklist from '~/components/Checklist.astro';
  import Badge from '~/components/Badge.astro';
  import Goals from '~/components/tutorial/Goals.astro';
  import MultipleChoice from '~/components/tutorial/MultipleChoice.astro';
  import Option from '~/components/tutorial/Option.astro';
---
Now that you have a fully functioning blog, let's add some interactivity to extend your site!

<Goals>
  - used client-side JavaScript in `<script>` tags to create a responsive mobile navigation header and a light/dark theme toggle
  - used the `astro add` command to use other framework components in Astro
  - controlled whether or not any JavaScript is sent to the browser for each componentusing the `client:load` directive
</Goals>

Even though you have used some JavaScript in places to build your site, all of the content on your site is **static**. A reader can navigate your site through links, but othwerwise, there is nothing for them to interact with. And, no content will change or update until Netlify builds and deploys your site again.

The JavaScript you have used so far to create and render parts of your site dynamically runs at build time. You do not yet have any client-side JavaScript that runs in the browser, nor any UI framework components (e.g. React, Svelte, Vue), which would allow your readers to trigger any changes to the site.

Let's do that now!

## Current State of the Code

Jumping in here, or want to compare your code to the tutorial at this point?

 <iframe src="https://stackblitz.com/edit/astro-tutorial-5?embed=1&file=src/pages/index.astro&theme=dark"></iframe>


## Before you go

### Checklist for moving on

<Checklist key ="interactivity">
- [ ] I am ready to add some interactivity to my site!
</Checklist>
