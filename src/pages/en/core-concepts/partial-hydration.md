---
layout: ~/layouts/MainLayout.astro
title: Partial Hydration in Astro
description: Learn how Astro improves performance with partial hydration.
---

**Astro generates every website with zero client-side JavaScript, by default.** Use any frontend UI component that you'd like ([React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/) and [Lit](https://lit.dev/)) and Astro will automatically render it to HTML at build-time and strip away all JavaScript. This keeps every site fast by default.

```astro
---
// Example: Use a static React component on the page, without JavaScript.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- 100% HTML, Zero JavaScript! -->
<MyReactComponent />
```

But sometimes, client-side JavaScript is required for creating interactive UI. When you find yourself needing interactive UI on the page, Astro doesn't force you to go 100% JavaScript on the entire page. Instead, Astro uses a technique called **partial hydration** that lets you hydrate individual components on the page. This way, you only send down the absolutely essential JavaScript that you need to run your page. 

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

In Astro, it’s up to you as the developer to explicitly opt in any components on the page that need to run in the browser. Astro will only hydrate exactly what’s needed on the page and leave the rest of your site as static HTML. This technique is known as **partial hydration**.

**Partial hydration is the secret to Astro’s fast-by-default performance story.**

📚 Read about how partial hydration is the foundation of Astro's ["Islands Architecture"](/en/core-concepts/islands-architecture)
