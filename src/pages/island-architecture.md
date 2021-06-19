---
layout: ~/layouts/Main.astro
---
<!-- 
    I have been spending most the day learning more about Island Architecture, wrote plenty of notes, listened to Fred K Schott's interview on Speakeasy(https://www.youtube.com/watch?v=mgkwZqVkrwo) and the interview with Jason Lengstrof (https://www.youtube.com/watch?v=z15YLsLMtu4)
    Figured I might give writing this a wee go,

    I wanted to take this from the direction of it being more of a critique of the past and present state of affairs in web dev
    Post structure:
    1)Start with an introduction to Islands Arch
    2)Talk about the different Architectures that can be used in Web-dev
    3)MVC/StaticSites - SPA's
    4)Frameworks, get some external links onto the page
    4)Moving to ESM
    5)Benefits of ESM
    6)

 -->

# Island Architecture

<!-- Intro -->

> "No man is an island. However, Web Components should be"

The concept behind Island architecture comes from [Jason Miller](https://twitter.com/_developit), The creator of [Preact](https://preactjs.com/) and a Google, DevRel Engineer.

In the summer of 2020, he managed to formulated his thoughts of how web architecture should be, in the idyllic sense, and placed them onto his [blog post](https://jasonformat.com/islands-architecture/).

His seminal post outlines and discusses the general concept of 'islands' as an architectural design process that could be used in Web Development, allowing for better improvements in overall site performance, SEO, UX, and everywhere else. His given explanation describing this new paradigm, was extraordinarily succinct:

> "The general idea of an *“Islands”* architecture is deceptively simple: Render HTML pages on the server, and inject placeholders or slots around highly dynamic regions. These placeholders/slots contain the server-rendered HTML output from their corresponding widget. They denote regions that can then be "hydrated" on the client into small self-contained widgets, reusing their server-rendered initial HTML."-Jason Miller

To develop a better understanding of what Jason meant with his proposal, let's quickly explore the backdrop, before we explain 'Island Architecture' and how it is applied into Astro as our primary ethos.

## Programming Paradigms

Think of a simple webpage. On which are many different types of components that are shown on this page, components that are shared across the site, others contain fixed content, some are a bit more elaborate that may perhaps use different state's or need to fetch multiple data streams from external sources.

Such an site would would have very few actual 'moving' pieces, or *dynamic* elements. For the most part the content tends to be fixed, and static. In order to allow for dynamism and interactivity we are often left making overly complex solutions to deliver the slightest form of action on the application.

Complexity becomes inherent in the design process of the application. As a result, developers have to adopt some dogma, that comes from certain architectural design styles and patterns.

Given the [catalogue of patterns](https://en.wikipedia.org/wiki/List_of_software_architecture_styles_and_patterns) that are available, utilizing the right architecture for the application often comes from a lot of trial & error and experience.

Web developers tend to gravitate towards tried and tested practices, and none fit the requirements better than the [Model-View-Controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) (**MVC**) design pattern.

Where the *Model* contains the data structures and logic that governs the use of the data in the application, *Views* are the visual representation of the data that the user sees, and the *Controller* connects the views to their relevant data *Models* based on their interactions with the User.

This design pattern works well for our [client-server](https://en.wikipedia.org/wiki/Client%E2%80%93server_model) based applications. Since the models are placed on the *servers*, the views that are sent back over the wire tend to be static *documents*, controllers are sent along with the static files to facilitate the behaviours that web developers created for their application, in the form of *scripts*.

## Rise of the Frameworks

In part by abstracting much of the complexity needed in implementing architectural design decisions away from the developer.

A vast swathe of libraries, frameworks and tooling rose up to meet the challenges of providing a Developer Experience (DX) that would let them create their applications, *'freely'*.

The likes of; [ASP.NET](https://dotnet.microsoft.com/learn/aspnet/what-is-aspnet-core) and [Blazor](https://dotnet.microsoft.com/apps/aspnet/web-apps/blazor) for [.NET](https://dotnet.microsoft.com/), [Ruby On Rails](https://rubyonrails.org/), [Laravel](https://laravel.com/) & [Symphony](https://symfony.com/) for [PHP](https://www.php.net/), are examples of the MVC patterns seen in other server-side programming languages.

For along time, JavaScript was solely restricted to the Browser, then [Node.js](https://nodejs.org/en/) appeared. Node.js is a standalone JavaScript runtime built on the Chrome V8 engine.

This was a seismic shift that occurred in Web Development, by allowing JavaScript to escape the browser and operate on the server, developers could use JS on both; Front & Back-ends, when developing their applications.

Within the new JavaScript + Node ecosystem, MVC frameworks began to appear, e.g: [BackboneJS](https://backbonejs.org/), [ExpressJS](https://expressjs.com/), [Ember](https://emberjs.com/), [MeteorJS](https://www.meteor.com/), to name but a few.

This pattern of statically generated content on the server was becoming a bit of a performance bottleneck. Where some asset-heavy page would take longer to render on the server than a lighter page.

This would block subsequent requests being made to the server, and more crucially responses being sent back from the server.

Server performance and optimisation only addressed the problem so far, but with larger payloads and pages being sent more frequently, something had to be done.

Frameworks, rose again to the challenge of delivering a better User Experience (UX) began to ship [Single Page Applications](https://en.wikipedia.org/wiki/Single-page_application) (**SPA**) to the client.

SPA's became a fast and effective ways to sending feature-rich applications to the client without the load being placed on the server.

Instead rendering the application would now be carried out wholly on the client device. Thus allowing the Server to send a single, simple, page to the client.

There are many benefits in providing a SPA to Clients. SPA's never needs a page refresh, since all the files (HTML/CSS/JS) had already been sent over the wire.

This only required the End-User's web browser to then read and render the application to the screen.

But SPA's came with their own hidden cost that comes with abstracting away the complexity. Recognising the many issues with SPA's from a holistic DX to a seamless UX/UI.

Frameworks began to appear in the ecosystem that allowed developers to build even more advanced Single-Page-Applications.

Some of these were developed by industry leaders, such as Google with their [Angular Project](https://angularjs.org/), [React](https://reactjs.org/) which was open sourced by Facebook. Or by the JS community themselves driving changes with [Preact](https://preactjs.com/), [Vue](https://vuejs.org/) and [Svelte](https://svelte.dev/), [Webpack](https://webpack.js.org/) & [Babel](https://babeljs.io/setup)

## The Status Quo

Its slightly hubris to suggest that the web development ecosystem had at all settled for any period of time, well at least long enough for a Status Quo to coalesce.

However, given the vibrancy and versatility of the ecosystem, a status quo had indeed began to take hold.

Rooted in the deepest annals of the developers psyche, was the slow conformity towards embracing UI frameworks to build the whole site as applications instead of the dynamic components that it was meant for.

Everything ended up being sent to the Client. From Rendering to Routing, bundled payload sizes drastically increased, and client devices were asked to do a lot more.

By placing the onus on the client, Server stress was indeed lessened. But there was a cost to this status quo.

The End-User experience was drastically suffering, for their devices now became the bottleneck, unable to execute the massive payloads that were being sent back from the server.

As demonstrated, JavaScript and its community are quick to change in certain places and slow in others. The gradual adoption of [EcmaScript Modules](https://tc39.es/ecma262/#sec-modules)(**ESM**) as a standard to the JavaScript spec was a complete sea-change to the ecosystem.

Prior to the formalisation of ESM, module usage in JS were often limited to libraries and were difficult to use outside the browser.

Using community developed conventions, helped push the goal of a modular ecosystem with [CommonJS](https://en.wikipedia.org/wiki/CommonJS)(**CJS**).

Node v12 shipped with ESM Modules as part of the standard in node. Signalling the start of something entirely new.

## The Great Migration

ESM adoption was indeed slow, the gradual migration from `require()` to `import()` took a while.

Now developing in an ESM world, allows for certain advantages to be exploited.

This wanting exploitation of new features have given way for another influx of new libraries, frameworks, tooling and a whole suite of new methods of writing JS.

We are now experiencing new tools in the ecosystem that feature ESM as defaults. By doing so they can take full advantage of unbundled developer environments, allowing for projects to start-up in the tens of milliseconds, instead of seconds and minutes.

Using ESM in the Browser, tools can build once and cache forever. Tree-shaking and code optimisations can occur, more frequently and with greater efficacy. Reducing massive bundle sizes down to a few hundred Kilobytes.

Tools like [Snowpack](https://www.snowpack.dev/) and [Vite](https://vitejs.dev/) introduce an whole new experience that developers were previously denied in their development process and that is speed.

With cut-edge DX features like [HMR](https://npm.io/package/esm-hmr) has quickly became the industry de facto, and build times reduced by a factor of 100x. This new generation of build tools in an ESM era is extremely encouraging for web developers.

## A Brave New World

Into this new age ESM world, we have had a dearth of innovation from the established frameworks to address some of the root issues that plagued web development over its time.

Basic questions of Websites or WebApp's were still unresolved. Where to render the site, on the server or on the client,perhaps a bit of both? What determines the need for dynamic content and what specifies content to be static?

Witnessing frameworks slowly go full circle and return to Server-Side-Rendering their applications was in part only allowed to be considered in an ESM world, however it was but of an admission of culpability of sorts.

By inadvertently admitting that the current model is flawed, opened up the space for a new form of discourse to enter, and help redefine the ecosystem moving forward.

Jason Miller's narrative of an 'Island'-styled approach is only adds to this new discussion in new ways of thinking about Website and Application development.

## Island Architecture Explained
