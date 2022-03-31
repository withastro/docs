---
layout: ~/layouts/MainLayout.astro
title: Islands Architecture
description: Learn about "Islands Architecture" in Astro.
---

**Islands architecture** is the idea of building isolated areas, or "islands," of interactivity within otherwise static, server-rendered content. 

> The general idea of an “Islands” architecture is deceptively simple: render HTML pages on the server, and inject placeholders or slots around highly dynamic regions.
> <br/> -- [Islands Architecture: Jason Miller](https://jasonformat.com/islands-architecture/)

A typical website contains more static content than you think! Blogs and portfolio sites are often filled with static images and text. Even eCommerce sites contain static product descriptions and support pages. 

Islands architecture is an alternative to the common process of building your website as a single, client-side JavaScript bundle responsible for both static and interactive elements on the page.

Using techniques such as [partial hydration](/en/core-concepts/partial-hydration) and component-based design, Islands architecture gives you control over independent regions on your page. You determine when and how an "island" becomes interactive on the client.

By adpoting the "islands" model, Astro can render an entire static page on the server, including placeholders for dynamic content. Through component directives, JavaScript is only sent to the client to make individual components interactive, and only for the individual components that need it.

![diagram](https://res.cloudinary.com/wedding-website/image/upload/v1596766231/islands-architecture-1.png)

Besides the obvious performance benefits of sending less JavaScript down to the browser, there are two key performance benefits to island architecture:

- **Components load individually.** A lightweight component (like a sidebar toggle) will load and render quickly without being blocked by the heavier components on the page.

- **Components render in isolation.** Each part of the page is an isolated unit, and a performance issue in one unit won't directly affect the others.


In Astro, your most important content is always available as soon as possible. It's easy to find, and easy to navigate.

> Content reaches your user quickly.
> 
> Pages are SEO-friendly. 
>
> HTML links improve accessibility.
