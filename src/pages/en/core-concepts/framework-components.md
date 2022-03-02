---
layout: ~/layouts/MainLayout.astro
title: Framework Components
description: Learn how to use React, Svelte, etc.
---
Astro allows you to build your site using JavaScript UI components from a variety of popular frameworks. Astro will run your [React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/) and [Lit](https://lit.dev/) components at build time, then render your entire site to static HTML by default, removing all the JavaScript from the final page!

You can use any of these frameworks as templating languages to build static pages, taking advantage of the syntax and tooling you already know and love. This allows you to build with components you're familiar with, maybe even the exact same ones you've already written! And, you won't send any unnecessary JavaScript to the client to render static elements, even dynamically generated ones.

For client-side interactivity, Astro allows you to opt-in to load a single component's JavaScript and dpendencies only when and where that component is used.

> 📚 Read more about Astro's [partial hydration](/en/core-concepts/partial-hydration)

## Configure Framework Renderers

Your Astro configuration must include the renderer for each framework you use. You can find, and manually edit, your project's current list of available renderers in `astro.config.mjs`.

```js
export default ({
// No renderers are needed for AlpineJS support, just use Astro components!
renderers: [
    '@astrojs/renderer-svelte',
    '@astrojs/renderer-vue',
    '@astrojs/renderer-react',
    '@astrojs/renderer-preact',
    '@astrojs/renderer-lit',
    '@astrojs/renderer-solid',
  ],

});
```

⚙️ See the [Renderer Reference](/en/reference/renderer-reference) to learn about configuring custom renderers.

## Build With Components

Use your JavaScript framework components in your Astro pages, layouts and components just like Astro components! All your components can live together in `/src/components`, or can be organized in any way you like.

### Render on a Page

To use a framework component, import it from its relative path, including file extension, in the component script. Then, use the component alongside other components, HTML elements and JSX-like expressions in the component template. 
```astro
---
import MyReactComponent from '../components/MyReactComponent.jsx';
import MySvelteComponent from '../components/MySvelteComponent.svelte';
import MyAstroComponent from '../components/MyAstroComponent.astro';
const title="My Astro Page"
---
<h1>{title}</h1>
<My AstroComponent />

<h2>Using a Svelte Component:</h2>
<MySvelteComponent client: load>
    <p>Here is some text.<p>
</MySvelteComponent>

<h2>Using a React Component:</h2>
<MyReactComponent client:visible />
```

## Hydrate Interactive Components

A framework component can be hydrated using a `client:*` directive. This is a component attribute to define how your component should be **rendered** and **hydrated**. It describes whether your component should be rendered at build-time, and when your component's JavaScript should be loaded by the browser, client-side.

Most directives will render the component on the server at build time. Component JS will be sent to the client according to the specific directive. The component will hydrate when its JS has finished importing.

```astro
---
// Example: hydrating framework components in the browser.
import MyReactComponent from '../components/MyReactComponent.jsx';
import MySvelteComponent from '../components/MySvelteComponent.svelte';
---
<!-- This component's JS will begin importing when the page loads -->
<MySvelteComponent client:load />

<!-- This component's JS will not be sent to the client until 
the user scrolls down and the component is visible on the page -->
<MyReactComponent client:visible />
```

>⚠️ Any renderer JS necessary for the component's framework (e.g. React, Svelte) is downloaded with the page. The `client:*` directives only dictate when the component JS is imported and when the component is hydrated.

### `client:load`

Start importing the component JS at page load.

💡 *Useful for immediately-visible UI elements that need to be interactive as soon as possible.*

### `client:idle`

Start importing the component JS as soon as main thread is free.

💡 *Useful for items that don't need to be immediately interactive.*

### `client:visible`

Start importing the component JS as soon as the element enters the viewport.

💡 *Useful for content lower down on the page.*

### `client:media={QUERY}`

Start importing the component JS as soon as the browser matches the given media query.

💡 *Useful for sidebar toggles, or other elements that might be used only for certain screen sizes.*

> ⚠️ Remember, this directive only refers to making the component *interactive* at certain media queries. This does not affect the component being *rendered to the screen*, nor its *visibility*!

### `client:only=" "`

Start importing the component JS at page load, similar to `client:load`.

 >⚠️ This component will be **skipped** at build time, and to assist the client, you should specify which renderer to use from the array in your [`astro.config.mjs` configuration](/en/reference/configuration-reference).
 >
 > e.g. `<client:only="react" />` or `<client:only="my-custom-renderer" />`
 
 💡 *Useful for components that are entirely dependent on client-side APIs.* 

## Nesting Framework Components

Framework components can only contain other components of the same framework. For example, a single React component can have an entire tree of React child components, but cannot contain Astro components or Vue components. Only Astro components can contain child components from any framework.

This allows you to build entire "apps" in your preferred JavaScript framework and render them, via a parent component, to an Astro page. This is a convenient pattern to allow related components to share state or context.

## Interactivity in Astro Components

[Astro components](/en/core-concepts/astro-components) (`.astro` files) are HTML-only templating components with no client-side runtime. 

### Can I Hydrate Astro Components?

No! If you try to hydrate an Astro component with a `client:` modifier, you will get an error.

📚 Learn more about [interactivity in Astro components](/en/core-concepts/astro-components#client-side-scripts) 

## TODO

- Talk about using Preact + React + Solid together in the same project (Fred: this is a bit technically tricky, I can write this section if you leave it for me)
- anything else? I can't think of anything!


[mdn-io]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
[mdn-ric]: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
[mdn-mm]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
