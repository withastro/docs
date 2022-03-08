---
layout: ~/layouts/MainLayout.astro
title: Framework Components
description: Learn how to use React, Svelte, etc.
---
Build your Astro website without sacrificing your favorite component framework. Astro supports a variety of popular frameworks including [React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/) and [Lit](https://lit.dev/). 

## Using Framework Components

Use your JavaScript framework components in your Astro pages, layouts and components just like Astro components! All your components can live together in `/src/components`, or can be organized in any way you like.

To use a framework component, import it from its relative path, including file extension, in the component script. Then, use the component alongside other components, HTML elements and JSX-like expressions in the component template. 

```astro
---
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<html>
  <body>
    <h1>Use React components directly in Astro!</h1>
    <MyReactComponent />
  </body>
</html>
```

## Hydrating Interactive Components

A framework component can be hydrated using a `client:*` directive. This is a component attribute to define how your component should be **rendered** and **hydrated**. It describes whether your component should be rendered at build-time, and when your component's JavaScript should be loaded by the browser, client-side.

Most directives will render the component on the server at build time. Component JS will be sent to the client according to the specific directive. The component will hydrate when its JS has finished importing.

```astro
---
// Example: hydrating framework components in the browser.
import InteractiveButton from '../components/InteractiveButton.jsx';
import InteractiveCounter from '../components/InteractiveCounter.jsx';
---
<!-- This component's JS will begin importing when the page loads -->
<InteractiveButton client:load />

<!-- This component's JS will not be sent to the client until 
the user scrolls down and the component is visible on the page -->
<InteractiveCounter client:visible />
```

>⚠️ Any renderer JS necessary for the component's framework (e.g. React, Svelte) is downloaded with the page. The `client:*` directives only dictate when the component JS is imported and when the component is hydrated.

### Available Hydration Directives

#### `client:load`

Start importing the component JS at page load.

💡 *Useful for immediately-visible UI elements that need to be interactive as soon as possible.*

#### `client:idle`

Start importing the component JS as soon as main thread is free.

💡 *Useful for items that don't need to be immediately interactive.*

#### `client:visible`

Start importing the component JS as soon as the element enters the viewport.

💡 *Useful for content lower down on the page.*

#### `client:media={QUERY}`

Start importing the component JS as soon as the browser matches the given media query.

💡 *Useful for sidebar toggles, or other elements that might be used only for certain screen sizes.*

> ⚠️ Remember, this directive only refers to making the component *interactive* at certain media queries. This does not affect the component being *rendered to the screen*, nor its *visibility*!

#### `client:only=" "`

Start importing the component JS at page load, similar to `client:load`.

 >⚠️ This component will be **skipped** at build time, and to assist the client, you should specify which renderer to use from the array in your [`astro.config.mjs` configuration](/en/reference/configuration-reference).
 >
 > e.g. `<client:only="react" />` or `<client:only="my-custom-renderer" />`
 
 💡 *Useful for components that are entirely dependent on client-side APIs.* 

## Mixing Frameworks

TODO: mention that its okay to include multiple frameworks on the same page. 

```astro
---
// Example: Mixing multiple framework components on the same page.
import MyReactComponent from '../components/MyReactComponent.jsx';
import MySvelteComponent from '../components/MySvelteComponent.svelte';
import MyVueComponent from '../components/MyVueComponent.vue';
---
<div>
  <MySvelteComponent />
  <MyReactComponent />
  <MyVueComponent />
</div>
```

## Nesting Framework Components

TODO: mention that its okay to nest framework components within each other.  

```astro
---
import MySidebar from '../components/MySidebar.jsx';
import MyButton from '../components/MyButton.svelte';
---
<MySidebar>
  <p>Here is a sidebar with some text and a button.</p>
  <MyButton client:load />
</MySidebar>
```

Framework components can only contain other components of the same framework. For example, a single React component can have an entire tree of React child components, but cannot contain Astro components or Vue components. Only Astro components can contain child components from any framework.

This allows you to build entire "apps" in your preferred JavaScript framework and render them, via a parent component, to an Astro page. This is a convenient pattern to allow related components to share state or context. 

## Can I Hydrate Astro Components?

 If you try to hydrate an Astro component with a `client:` modifier, you will get an error.

[Astro components](/en/core-concepts/astro-components) are HTML-only templating components with no client-side runtime. But, you can use a `<script>` tag in your Astro component template to send JavaScript to the browser that executes in the global scope.


📚 Learn more about [client-side `<scripts>` in Astro components](/en/core-concepts/astro-components#client-side-scripts) 


[mdn-io]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
[mdn-ric]: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
[mdn-mm]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia


## Customize Your Frameworks

By default, Astro ships with support out-of-the-box for React, Preact, Svelte and Vue. You can configure Astro to add new frameworks or remove support for any that you are not using.

You can edit your project's current list of available renderers in your `astro.config.mjs` file:

```js
export default ({
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

⚙️ View the [Renderer Reference API](/en/reference/renderer-reference) to learn how to build your own framework renderers.