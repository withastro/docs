---
layout: ~/layouts/MainLayout.astro
title: Interactivity in Astro
---

## Goals

BY THE END OF THIS SECTION, YOU WILL HAVE:

- used client-side JavaScript in `<script>` tags to create a light/dark theme toggle and responsive mobile navigation header

- used the `astro-add` command to add an official Astro integration

- created an interactive UI framework (Preact) component that fetches data from an external API

- rendered Preact components on `index.astro`, controling each one's hydration method using a different `client:directive`

Now that you have a fully-featured blog, let's add some interactivity to extend your site!

## Summary

All the content on your site is **static**. A reader can navigate your site through links, but othwerwise, there is nothing for them to interact with.

We have used some build-time JavaScript to create and render parts of your site dynamically, but we do not yet have any client-side JavaScript, nor UI framework components (e.g. React, Svelte, Vue), that allow your readers to trigger any changes to the site.

Let's do that now!

## Before You Go

### Test your knowledge

Fill in the blanks with: **`<script>`**, **JSX-like expressions**, **interactivity**, **build**, **code fences**, **browser**

`.astro` files can contain JavaScript between the ____________________to define variables, receive props and run functions to help generate the HTML template. You can even write ________________ within the Astro component template to dynamically generate your HTML. But, all of this JavaScript is executed at ________ time, on the server, and is not available in the ______________.

For ________________ on your site, you need to write client-side JS (e.g in _________ tags) or use a UI framework component.


### Checklist for moving on
[ ] I am ready to add some interactivity to my site!
