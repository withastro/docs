---
layout: ~/layouts/MainLayout.astro
title: MPAs vs. SPAs
description: TODO
i18nReady: true
---

Understanding the tradeoffs between Multi-Page Application (MPA) and Single-Page Application (SPA) architecture is key to understanding what makes Astro different from other web frameworks like Next.js and Remix.

## Terminology

**A Multi-Page Application (MPA)** is a website consisting of multiple HTML pages, mostly rendered on a server. When you navigate to a new page, your browser requests a new page of HTML from the server. **Astro is an MPA framework.** More traditional MPA frameworks also include Ruby on Rails, Python Django, PHP Laravel, Wordpress, and static site builders like Eleventy, Hugo and VitePress.

**A Single-Page Application (SPA)** is a website consisting of a JavaScript application that loads in the user's browser and then renders HTML locally. SPAs may *also* generate HTML on the server (especially for the the first page load) but SPAs are unique in their ability to render HTML locally when you navigate to a new page. Next.js, Nuxt, SvelteKit, Remix, Gatsby, and Create React App are all examples of SPA frameworks.

## Astro vs. other MPAs

Astro is an MPA framework. However, Astro is unique from other MPA frameworks due to its use of JavaScript as a server runtime. Traditional MPA frameworks would have you write one language on the server (Ruby, PHP, etc.) and JavaScript on the browser. In Astro, you're always writing JavaScript. You can also re-use UI components (like React and Svelte) on both the server and the client. 

The result is that Astro has a developer experience similar to that of Next.js or another modern SPA, even if the user experience is an entirely different MPA site architecture.

## MPAs vs. SPAs

There are three main differences to be aware of when comparing MPAs vs. SPAs:

#### Server rendering (MPA) vs. client rendering (SPA)

In MPAs, most of your HTML is rendered on the server. In SPAs, most HTML is rendered locally by running JavaScript in the browser. This has a dramatic impact on site behavior, performance, and SEO.

Rendering your HTML in the browser may sound like the faster option vs. requesting it from a remote server. However, a true SPAs (with no server rendering) will be consistently slower than an MPA. This is because an SPA has to download, parse, and run an entire JavaScript application in the browser just to render any HTML on the page. Then, your SPA will likely need to fetch remote data anyway, introducing even more wait time before your page is finished loading.

Most SPA frameworks will attempt to mitigate this performance problem by adding basic server-rendering on the first page load. Server rendering the first page gives your user something to look at while your site loads in the background. However, this can introduce a new "uncanny valley" problem where your site appears loaded but unresponsive, since the application logic is still loading in the background.

MPAs render all HTML on a remote server and often don't require much JavaScript to run. This gives MPAs a much faster first load experience than SPAs, which is essential for content-focused websites. But this comes with a tradeoff: future page navigation can't benefit from local rendering, so long-lived user experiences may feel slower in MPAs vs. SPAs.


#### Server routing (MPA) vs. client routing (SPA)

Where does your website router live? In an MPA, every request to the server decides which HTML to respond with, so the routing logic lives in the server. In an SPA, your router runs right in the browser, and hijacks any navigation to render the new page locally without ever hitting a server.

This is a similar tradeoff to the one described above: MPAs offer a faster first load experience, while SPAs sometimes ofer a faster second or third page load once the JavaScript application is fully loaded in the browser. 

SPAs can also offer a more seamless navigation experience because they control rendering across the entire transition. To mitigate this, MPAs leverage tools like Hotwire's [Turbo](https://turbo.hotwired.dev/) that mimic client routing by also controlling navigation in the browser. The HTML is still rendered on the server, but Turbo can now display a seamless transition between pages similar to client routing in an SPA.

#### Server state management (MPA) vs. client state management (SPA)

SPAs are the superior model for complex state management. Because the entire website runs as a single JavaScript application in the browser, SPAs don't need to worry about maintaining state across page transitions. Both MPAs and most SPAs need to worry about server-side state for server rendering.

SPAs really shine in complex websites that display lots of interactive data and need lots of JavaScript to run. Interactive, data-drive experiences like inboxes and admin dashboards do well as SPAs because the website itself is inherintely "app-like".

## Are MPAs Better than SPAs?

When comparing MPAs vs SPAs, there is no "better" or "worse" choice. It all comes down to tradeoffs.

**Astro prioritizes the performance and simplicity of MPAs because it makes the most sense for our usecase of content-focused websites.** More stateful, interaction-heavy websites may benefit from the app-like behavior that SPAs bring at the expense of performance.


## Case Studies

Below are all of the public Astro comparisons that we are aware of:

- [Astro vs. SPA (Next.js)](https://twitter.com/t3dotgg/status/1437195415439360003) - 94% less JavaScript
- [Astro vs. SPA (Next.js)](https://twitter.com/jlengstorf/status/1442707241627385860?lang=en) - 34% faster load
- [Astro vs. SPA (Remix, SvelteKit)](https://www.youtube.com/watch?v=2ZEMb_H-LYE&t=8163s) - "That [Lighthouse score] is incredible."
- [Astro vs. Qwik](https://www.youtube.com/watch?v=2ZEMb_H-LYE&t=8504s) - 43% faster TTI

If you know a public migration or benchmark and don't see it listed here, please create a PR to add it.
## More Resources 

If you'd like to learn more, Surma (Google) and Jake Archibald (Google) recorded a great back-and-forth discussion [on this exact topic.](https://www.youtube.com/watch?v=ivLhf3hq7eM)



<!-- ## Unapologetically server-rendered



If you are coming from a server language like PHP or Rails, Astro's server rendering will feel familiar. If you're coming from a JavaScript application framework like Next.js, then it may feel a bit unusual at first. 

Modern JavaScript application frameworks like Next.js are designed to run **isomorphically** on both the client and the server. When you build your website with one of these frameworks, you are essentially building an optimized Single Page Application, or SPA. EXPLAIN BENEFITS OF SPAs.

Astro isn't like other frameworks. Instead of building you an SPA, Astro builds you an MPA, or Multi Page Application. MPAs rely on server routing and rendering to do most of the work, with the user loading HTML from your site as they navigate from page to page.

MPAs have some serious benefits for the content-focused website (it's fast!) while SPAs are usually a better fit for more dynamic web applications. This is why Astro's content focus is so important to understand: MPAs are a better fit for Astro,  -->

<!-- and the tradeoffs that Astro can make happily.  -->

<!-- - It's fast.
- It's less complex: Make database reads and writes directly in your components.
- It's less boilerplate: With direct DB access, there's no need to create REST or GraphQL APIs. -->