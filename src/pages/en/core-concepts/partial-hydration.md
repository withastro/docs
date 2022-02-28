---
layout: ~/layouts/MainLayout.astro
title: Partial Hydration in Astro
description: Learn how partial hydration works using the "Islands Architecture" in Astro.
---

**Astro generates every website with zero client-side JavaScript, by default.** Use any frontend UI component that you'd like (React, Svelte, Vue, etc.) and Astro will automatically render it to HTML at build-time and strip away all JavaScript. This keeps every site fast by default.

```astro
---
// Example: Use a static React component on the page, without JavaScript.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- 100% HTML, Zero JavaScript! -->
<MyReactComponent />
```

But sometimes, client-side JavaScript is required for creating interactive UI. When you find yourself needing interactive UI on the page, Astro doesn't force you to go 100% JavaScript. Instead, Astro uses a new technology called **partial hydration** to only send down the essential JavaScript that you need to run your page. 

```astro
---
// Example: Use a dynamic React component on the page.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- This component is now interactive on the page! 
     The rest of your website remains the same. -->
<MyReactComponent client:load />
```

The vast majority of your site remains pure, lightweight HTML and CSS. By building partial hydration directly into Astro, you are able to leverage a kind of new web site & application architecture that we call **island architecture.** This guide explains these two new concepts in detail, and how you can use Astro to build faster websites.


## Concept: Partial Hydration

There are plenty of cases where you need an interactive UI component to run in the browser:

- An image carousel
- An auto-complete search bar
- A mobile sidebar open/close button
- A "Buy Now" button

In Astro, it’s up to you as the developer to explicitly "opt-in" any components on the page that need to run in the browser. Astro can then use this info to know exactly what JavaScript is needed, and only hydrate exactly what’s needed on the page. This technique is known as partial hydration.

**Partial hydration** -- the act of only hydrating the individual components that require JavaScript and leaving the rest of your site as static HTML -- may sound relatively straightforward. It should! Websites have been built this way for decades. It was only recently that Single-Page Applications (SPAs) introduced the idea that your entire website is written in JavaScript and compiled/rendered by every user in the browser.

_Note: Partial hydration is sometimes called "progressive enhancement" or "progressive hydration." While there are slight nuances between the terms, for our purposes you can think of these all as synonyms of the same concept._

**Partial hydration is the secret to Astro’s fast-by-default performance story.** Next.js, Gatsby, and other JavaScript frameworks cannot support partial hydration because they imagine your entire website/page as a single JavaScript application.

## Concept: Island Architecture

**Island architecture** is the idea of using partial hydration to build entire websites. Island architecture is an alternative to the popular idea of building your website into a client-side JavaScript bundle that must be shipped to the user.

> In an "islands" model, server rendering is not a bolt-on optimization aimed at improving SEO or UX. Instead, it is a fundamental part of how pages are delivered to the browser. The HTML returned in response to navigation contains a meaningful and immediately renderable representation of the content the user requested.
> <br/> -- [Jason Miller](https://jasonformat.com/islands-architecture/)

Besides the obvious performance benefits of sending less JavaScript down to the browser, there are two key benefits to island architecture:

- **Components load individually.** A lightweight component (like a sidebar toggle) will load and render quickly without being blocked by the heavier components on the page.
- **Components render in isolation.** Each part of the page is an isolated unit, and a performance issue in one unit won't directly affect the others.

![diagram](https://res.cloudinary.com/wedding-website/image/upload/v1596766231/islands-architecture-1.png)
