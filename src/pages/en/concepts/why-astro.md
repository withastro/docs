---
layout: ~/layouts/MainLayout.astro
title: Why Astro?
description: DESCRIPTION
i18nReady: true
---

Astro is an **all-in-one** **web framework** for building **fast,** **content-focused websites.**

Why choose Astro over another web framework? Here are five core design principles to help explain why we built Astro, the problems that it exists to solve, and why Astro may be the best choice for your project or team.

#### Astro is...

1. [Content-focused](#) -- Astro is designed for building content-rich websites.
2. [Server-first](#) -- Websites work better when they do more work on the server.
3. [Fast by default](#) -- It should be impossible to build a slow website in Astro.
4. [Easy to use](#) -- You don't need to be a JavaScript expert to build with Astro.
5. [Fully-featured, but flexible](#) -- Extend Astro with over 100+ integrations.

<!-- 6. [Innovative](#) -- Astro is the leader in exploring a new islands-based site architecture. -->
<!-- 6. [Fast by default](#) -- It should be hard to build a slow website in Astro. -->
<!-- 4. [**Easy to learn, easy to use**](#) -- All youAstro was designed to support beginners and experts alike. -->

## Content-focused

**Astro was designed for building content-rich websites.** This includes most marketing sites, publishing sites, documentation sites, blogs, portfolios, and some ecommerce sites.

By contrast, most other web frameworks are designed for building *data-rich web applications*. This includes websites that deal with lots of user interaction, state, and other data-driven experiences in the browser: Admin dashboards, web inboxes, lots of logged-in interactions, social networks, todo lists, and even full native-like software applications can run in your browser like Figma and Ping.

This is one of the most important differences to understand about Astro. It's this focus that allows Astro to make tradeoffs and deliver innovative features that other frameworks simply cannot. Partial hydration, islands, and multi-framework support all wouldn't be possible without this focus.


:::tip
If you fall into the second "application" camp, Astro probably isn't the right choice for your project. **And that's okay!** Check out [Next.js](https://nextjs.org/) for a great application-focused web framework alternative.
:::


<!-- 📚 [Read more about MPA Architecture and why Astro was built on it.](/en/concepts/mpa-vs-spa/) -->






<!-- This focus on content over applications is surprisingly unique for a web framework. But it completely defines Astro as a framework, and is probably the most important thing to understand about Astro. By prioritizing for content, Astro is able to make tradeoffs and deliver features for this use-case where other frameworks cannot.  -->


<!-- Astro features like Partial Hydration and Zero Lock-in don't make sense in rich web applications. But, they make a ton of sense in most sites that, when you really look closely, only require sprinkles of interactivity. Astro focuses on the latter to deliver a better user experience with a great developer experience as well. -->

<!-- But, by thinking of every website as an entire application to be run, these frameworks can't separate out the concern (solved problem?) of simply displaying your content, something that HTML and CSS have been doing effectively and efficiently for decades. -->

<!--The theory is that if you think of every website as an application, then your framework is the right pick for every website. Unfortunately, in practice, this is incorrect. -->

<!-- :::note
There's nothing wrong with those other frameworks! If you are building a rich web application or dealing with a lot of dynamic or interactive data, then a more traditional web framework like Next.js, Nuxt, or SvelteKit would probably be a great pick. However, after learning about Astro, many people realize they are in the other camp --- the "content" camp --- and Astro was designed for that!
::: -->

## Server-first

**Astro leverages server-side rendering and minimizes client-side rendering as much as possible.** This is a time-tested approach that traditional server-side frameworks -- PHP, Wordpress, Laravel, Ruby on Rails, etc. etc. -- have been using for decades. But with Astro, you don't need to learn a second server-side language for your server code. It's all just HTML, CSS, and JavaScript/TypeScript.

This approach stands in contrast to most modern JavaScript web frameworks, like Next.js, SvelteKit, Nuxt, Remix and others. These frameworks rely on client-side rendering of your entire website and will include server-side rendering mainly to address performance concerns. This approach has been dubbed the **Single Page App (SPA)**, in contrast with Astro's **Multi Page App (MPA)** approach.

The SPA model has its benefits, however they come at the expense of complexity and performance tradeoffs that don't make much sense for content-focused websites. Astro renders your components to static HTML on the server, where an SPA like Next.js would need to ship them to the user's browser as JavaScript to re-render a second time. This extra work harms page performance, including critical metrics like [Time to Interactive (TTI)](https://web.dev/interactive/).
<!-- 

Astro's MPA approach is optimal for content-rich websites because it shifts rendering work to the server and out of your users browser.



Astro renders your components to HTML on the server *without* also shipping that component JavaScript code to your user's browser. You might be suprised to learn that 

  to render a second time. This improves page loading times, including the critical [Time to Interactive (TTI)](https://web.dev/interactive/) metric.



Astro isn't the only web framework to leverage server rendering for performance. Next.js, SvelteKit, Nuxt, Remix, and most other modern JavaScript frameworks will all render your first page to HTML on the server. They do this to help mitigate the slow startup of the JavaScript cost caused by their need to run JavaScript in the browser. After that, the web application is loaded in the browser as JavaScript and takes over rendering of all future page loads. -->

<!-- 
Most web frameworks use an **SPA Architecture**, which stands for Single-Page Application. Next.js, SvelteKit, Nuxt, Remix, and other modern JavaScript frameworks use an SPA architecture because it supports building complex web applications with JavaScript. However, this power comes at the expense of complexity and performance tradeoffs that don't make much sense for content-focused websites.

Astro instead leverages an **MPA Architecture**, which stands for Multi-Page Application. This architecture is battle-tested and optimal for content-rich websites because it shifts work to the server and out of your users browser. 

Unlike an SPA like Next.js, Astro renders your JavaScript code to HTML on the server *without* also shipping the entire page's JavaScript code to your user's browser to render a second time. This improves page loading times, including the critical [Time to Interactive (TTI)](https://web.dev/interactive/) metric. -->

📚 [Read more about Astro's MPA Architecture and why we chose it.](/en/concepts/mpa-vs-spa/)

<!-- We should use this somehow: https://youtu.be/2ZEMb_H-LYE?t=8163 -->

<!-- To start, Astro strips all unused JavaScript from your website automatically. When you build with Astro, you don't ship a single byte of unnecessary JavaScript to the user. Even if you use a JavaScript UI framework like React or Vue, your users will only ever see the fast, static, server-rendered HTML and CSS. -->

<!-- What happens when you need to add an interactive component to your page? Most web frameworks will be forced to download and run an entire page worth of JavaScript just for that one component. Astro websites only pay to load that one, interactive component.  -->

<!-- This process is called Partial Hydration, and very few web frameworks besides Astro support it today. -->



## Fast by default

Good performance is always important, but it is *especially critical* for content-focused websites. Poor performance leaves engagement, conversion, and money on the table. For example:

- Every 100ms faster → 1% more conversions ([Mobify](https://web.dev/why-speed-matters/), earning +$380,000/yr)
- 50% faster → 12% more sales ([AutoAnything](https://www.digitalcommerce360.com/2010/08/19/web-accelerator-revs-conversion-and-sales-autoanything/))
- 20% faster → 10% more conversions ([Furniture Village](https://www.thinkwithgoogle.com/intl/en-gb/marketing-strategies/app-and-mobile/furniture-village-and-greenlight-slash-page-load-times-boosting-user-experience/))
- 40% faster → 15% more sign-ups ([Pinterest](https://medium.com/pinterest-engineering/driving-user-growth-with-performance-improvements-cfc50dafadd7))
- 850ms faster → 7% more conversions ([COOK](https://web.dev/why-speed-matters/))
- 1 seconds slowness → 10% less users ([BBC](https://www.creativebloq.com/features/how-the-bbc-builds-websites-that-scale))

**You shouldn't need to be an expert on web performance to build a fast website.** Astro's magic is in how it combines the two points above -- a content focus with a server-first MPA architecture -- to make tradeoffs and deliver features that other SPA frameworks cannot. The result is amazing web performance for every website, built into Astro itself.

An Astro website can [load 40% faster with 90% less JavaScript](https://twitter.com/t3dotgg/status/1437195415439360003) than the same site built with the most popular React web framework. But don't take our word for it: Watch Astro's performance leave Ryan Carniato (creator of Solid.js and Marko) [speechless](https://youtu.be/2ZEMb_H-LYE?t=8163).


## Easy to use

**Astro's goal is to be accessible to every web developer.** Astro was designed to feel familiar and approachable to a new developer, regardless of that person's skill level or past experience. 

To do this, we created our own `.astro` component syntax for rendering HTML on the server. You can always use your favorite component framework if you prefer (React, Svelte, Vue, and others are all supported) but we wanted to make sure that Astro had a great built-in component syntax as well. It's based on HTML, but has some of our favorite features borrowed from other component libraries like JSX-expressions for templating (React) and CSS scoping built-in (Svelte and Vue). 

Because Astro was designed for the server, it's language is incredibly simple when compared to other UI libraries that were originally designed for the client. You don't need to worry about hooks (React), stale closures (also React), refs (Vue), observables (Svelte), atoms, selectors, reactions, or derivations. There is no reactivity to worry about on the server, so all of that complexity melts away.

One of our favorite sayings is: **opt in to complexity.** We designed Astro to remove as much "required complexity" as possible from the developer experience, especially as you onboard for the first time. You can build a "Hello World" example website in Astro with just HTML and CSS. Then, when you need to build something more powerful, you can incrementally reach for new features and APIs as you go.


## Fully-featured, but flexible

**Astro is an all-in-one web framework that comes with everything you need to build a website.** Astro includes a component syntax, file-based routing, asset handling, a build process, bundling, optimizations, data-fetching and more. You can build great websites without ever reaching outside of Astro's core featureset.

If you need more control, you can extend Astro with over [100+ integrations](https://astro.build/integrations/) like [React](https://www.npmjs.com/package/@astrojs/react), [Svelte](https://www.npmjs.com/package/@astrojs/svelte), [Vue](https://www.npmjs.com/package/@astrojs/vue), [Tailwind CSS](https://www.npmjs.com/package/@astrojs/tailwind), [MDX](https://www.npmjs.com/package/@astrojs/mdx), [image optimizations](https://www.npmjs.com/package/@astrojs/images), and more. [Connect your favorite CMS](https://astro.build/integrations/) or [deploy to your favorite host](https://www.npmjs.com/package/@astrojs/netlify) with just a single command.

Where other SPA frameworks lock you into a single UI framework for your entire project, Astro has this idea of **Bring Your Own Framework (BYOF).** React, Preact, Solid, Svelte, Vue and Lit are all officially supported in Astro via a single, drop-in integration. You can even mix-and-match different frameworks on the same page, allowing for an easy migration in the future without framework lock-in.

<!-- Use your favorite UI framework with Astro, or mix-and-match UI components across different pages, websites, or even teams. You can even choose your UI framework component-by-component on each individual page for maximum flexibility with minimal committment. Astro also gives you a "Get out of (framework) jail free!" card, allowing you to convert your entire project incrementally, with no interruption to your site. -->

<!-- This has an added benefit for larger organizations: you can scale up the number of supported UI frameworks at your company without increasing the complexity of the server-side code. Every Astro site ships the same server runtime code, regardless of which UI frameworks you use. This greatly reduces the production complexity vs. running different sites built with Next.js, SvelteKit, and Nuxt. -->

<!-- 📚 TODO: Link to Multi-framework support?  -->

<!-- ## Fast by default -->

<!-- As we mentioned above, Astro builds fast websites. But our focus on performance isn't just on what's *possible* with Astro. We want good performance to be an *automatic default.*  -->

<!-- When we built Astro, we were fed up with web frameworks that *could* be fast in the right hands, but that otherwise felt slow to the average user who didn't know every option or best practice. We had a wild idea: you shouldn't even need to think about performance to build a fast site. Our goal was simple: **It should be incredibly difficult to build a slow website with Astro.** -->

<!-- This idea of fast-by-default has inspired plenty of other Astro design choices and default behaviors, other than Partial Hydration which was mentioned above. Your JavaScript and CSS are bundled by default. Your deployed server supports streaming HTML by default. THIRD THING??? DON"T FORGET TO DELETE THIS, FRED. (//`@astrojs/prefetch` maybe?//) As you build with Astro, you'll see how these design decisions shape how you work "in Astro."  -->

<!-- (// my thinking with this last line here is re: stated goal of priming the reader for thinking about how things work in Astro. With little nudges like this, the reader is more primed for THIS WORKS DIFFERENTLY AND I MIGHT HAVE TO ADJUST MY EXPECTATIONS //) -->



