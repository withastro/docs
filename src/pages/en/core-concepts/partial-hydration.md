---
layout: ~/layouts/MainLayout.astro
title: Partial Hydration in Astro
description: Learn how partial hydration works using "Islands Architecture" in Astro.
setup: |
  import IslandsDiagram from '~/components/IslandsDiagram.astro';
i18nReady: true
---

**Astro generates every website with zero client-side JavaScript, by default.** Use a frontend UI component built with [React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/) or [Lit](https://lit.dev/) and Astro will automatically render it to HTML at build-time and strip away all JavaScript. This keeps every site fast by default.

```astro
---
// Example: Use a static React component on the page, without JavaScript.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- 100% HTML, Zero JavaScript! -->
<MyReactComponent />
```

But sometimes, client-side JavaScript is required for creating interactive UIs. When you find yourself needing interactive UI on the page, Astro doesn't force you to go 100% JavaScript on the entire page. Instead, Astro uses a technique called **partial hydration** that lets you hydrate individual components on the page. This way, you only send down the absolutely essential JavaScript that you need to run your page. 

```astro
---
// Example: Use a dynamic React component on the page.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- This component is now interactive on the page! 
     The rest of your website remains the same. -->
<MyReactComponent client:load />
```

The vast majority of your site remains pure, lightweight HTML and CSS, with isolated **islands of interactivity.**


## Partial Hydration

There are plenty of cases where you need an interactive UI component to run in the browser:

- An image carousel
- An auto-complete search bar
- A mobile sidebar open/close button
- A "Buy Now" button

In Astro, it’s up to you as the developer to explicitly opt-in any components on the page that need to run in the browser. Astro will only hydrate exactly what’s needed on the page and leave the rest of your site as static HTML. This technique is known as **partial hydration**.

**Partial hydration is the secret to Astro’s fast-by-default performance story.**

## Islands Architecture

**Islands architecture** is the idea of using partial hydration to build entire websites. Islands architecture is an alternative to the common process of building your website into a client-side JavaScript bundle that must be shipped to the user.

> The general idea of an “Islands” architecture is deceptively simple: render HTML pages on the server, and inject placeholders or slots around highly dynamic regions.
> <br/> -- [Islands Architecture: Jason Miller](https://jasonformat.com/islands-architecture/)

Besides the obvious performance benefits of sending less JavaScript down to the browser, there are two key benefits to islands architecture:

- **Components load individually.** A lightweight component (like a sidebar toggle) will load and render quickly without being blocked by the heavier components on the page.
- **Components render in isolation.** Each part of the page is an isolated unit, and a performance issue in one unit won't directly affect the others.

<IslandsDiagram>
    <Fragment slot="headerApp">Header "app"</Fragment>
    <Fragment slot="sidebarApp">Sidebar "app"</Fragment>
    <Fragment slot="main">
        Server-rendered HTML content like text, images, etc.
    </Fragment>
    <Fragment slot="carouselApp">Image carousel "app"</Fragment>
    <Fragment slot="advertisement">Advertisement<br/>(server-rendered)</Fragment>
    <Fragment slot="footer">Footer (server-rendered HTML)</Fragment>
</IslandsDiagram>

_Source: [Islands Architecture: Jason Miller](https://jasonformat.com/islands-architecture/)_
