---
layout: ~/layouts/MainLayout.astro
title: Component Islands
description: TODO
i18nReady: true
setup: |
  import IslandsDiagram from '~/components/IslandsDiagram.astro';
---

**Component Islands** are a pattern of web architecture pioneered by Astro. The term was first coined by Etsy's frontend architect [Katie Sylor-Miller](https://twitter.com/ksylor) in 2019, and expanded on in [this post](https://jasonformat.com/islands-architecture/) by Preact creator Jason Miller.

## What is a Component Island?

Component Island (or just "Island" for short) refers to an interactive UI component on an otherwise static page of HTML. Multiple islands can exist on a page, and an island always renders in isolation. Think of them as islands in a sea of static, non-interactive HTML.

<IslandsDiagram>
    <Fragment slot="headerApp">Header (interactive island)</Fragment>
    <Fragment slot="sidebarApp">Sidebar (static HTML)</Fragment>
    <Fragment slot="main">
        Static content like text, images, etc.
    </Fragment>
    <Fragment slot="carouselApp">Image carousel (interactive island)</Fragment>
    <Fragment slot="footer">Footer (static HTML)</Fragment>
</IslandsDiagram>

You can use any UI framework (React, Svelte, Vue, etc) to render islands in the browser. You can mix and match different frameworks on the same page, or just pick your favorite.

The technique that this architectural pattern builds on is known as **partial** or **selective hydration.** Astro leverages this technique behind the scenes, powering your islands automatically. 

## How Do Islands Work in Astro?

**Astro generates every website with zero client-side JavaScript, by default.** Use a frontend UI component built with [React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/) or [Lit](https://lit.dev/) and Astro will automatically render it to HTML at build-time and strip away all JavaScript. This keeps every site fast by default.

```astro
---
// Example: Use a static React component on the page, without JavaScript.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- 100% HTML, Zero JavaScript! -->
<MyReactComponent />
```

But sometimes, client-side JavaScript is required for creating interactive UIs. Astro doesn't force you to go 100% JavaScript to render the entire page. Instead, Astro will have you create an island.

```astro
---
// Example: Use a dynamic React component on the page.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- This component is now interactive on the page! 
     The rest of your website remains static and zero JS. -->
<MyReactComponent client:load />
```

The vast majority of your site remains pure, lightweight HTML and CSS. All you've added is a single, isolated **island of interactivity.**

## What are the benefits of Islands?

The most obvious benefit to islands architecture is performance: the majority of your website is converted to fast, static HTML and JavaScript is only loaded for the individual components that need it. JavaScript is one of the slowest assets that you can load per-byte, so every byte counts.

Another benefit is non-blocking loading. In the example illustration above, the low-priority "image carosel" island doesn't block the high-priority "header" island. The two load in parallel and hydrate in isolation, meaning that the header becomes interactive immediately without having to wait for the heavier carosel lower down the page.

Even better, you can tell Astro exactly how and when to render each component. If that image carosel is really expensive to load, you can attach an special **client-directive** that tells Astro to only load the carosel when it becomes visible on the page. If the user never sees it, it never loads.

In Astro, it’s up to you as the developer to explicitly opt in any components on the page that need to run in the browser. Astro will only hydrate exactly what’s needed on the page and leave the rest of your site as static HTML. 

**Islands are the secret to Astro’s fast-by-default performance story.**
