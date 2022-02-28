---
layout: ~/layouts/MainLayout.astro
title: Framework Components
description: Learn how to use React, Svelte, etc.
---

- TODO: Talk about what frameworks we support, including links to them (React, Preact, Svelte, Vue, Lit, Solid.js)
- TODO: Link to the custom renderer docs

## Hydrate Interactive Components

Astro renders every component on the server **at build time**, unless [client:only](#mycomponent-clientonly-) is used. To hydrate components on the client **at runtime**, you may use any of the following `client:*` directives. A directive is a component attribute (always with a `:`) which tells Astro how your component should be rendered.

```astro
---
// Example: hydrating a React component in the browser.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- "client:visible" means the component won't load any client-side
     JavaScript for the component until it becomes visible in the
     user’s browser. -->
<MyReactComponent client:visible />
```

Note that the renderer JS (e.g. React) and the component’s CSS are downloaded with the page. The `client:*` directives only dictate when the component JS is imported and when the component is hydrated.

### `<MyComponent client:load />`

Start importing the component JS at page load. Hydrate the component when import completes.

### `<MyComponent client:idle />`

Start importing the component JS as soon as main thread is free (uses [requestIdleCallback()][mdn-ric]). Hydrate the component when import completes.

### `<MyComponent client:visible />`

Start importing the component JS as soon as the element enters the viewport (uses [IntersectionObserver][mdn-io]). Hydrate the component when import completes. Useful for content lower down on the page.

### `<MyComponent client:media={QUERY} />`

Start importing the component JS as soon as the browser matches the given media query (uses [matchMedia][mdn-mm]). Hydrate the component when import completes. Useful for sidebar toggles, or other elements that should only display on mobile or desktop devices.

### `<MyComponent client:only />`

Start importing the component JS at page load and hydrate when the import completes, similar to `client:load`. The component will be **skipped** at build time, useful for components that are entirely dependent on client-side APIs. This is best avoided unless absolutely needed, in most cases it is best to render placeholder content on the server and delay any browser API calls until the component hydrates in the browser.

If more than one renderer is included in the Astro [config](/en/reference/configuration-reference), `client:only` needs a hint to know which renderer to use for the component. For example, `client:only="react"` would make sure that the component is hydrated in the browser with the React renderer. For custom renderers not provided by `@astrojs`, use the full name of the renderer provided in your Astro config, i.e. `<client:only="my-custom-renderer" />`.

## Can I Hydrate Astro Components?

[Astro components](/en/core-concepts/astro-components) (`.astro` files) are HTML-only templating components with no client-side runtime. If you try to hydrate an Astro component with a `client:` modifier, you will get an error.

To make your Astro component interactive, you will need to convert it to the frontend framework of your choice: React, Svelte, Vue, etc. If you have no preference, we recommend React or Preact as they are most similar to Astro’s syntax. Using a frontend framework provides a client-side runtime that encapsulates the JavaScript and allows usage of `client:` modifiers per component instance.

Alternatively, you could add a `<script>` tag to your Astro component HTML template and send JavaScript to the browser that way, but this script will execute in the global scope and there will be no client-side component to attach a `client:` modifier to. While this is fine for the simple stuff, we recommend a frontend framework for more complex interactive components.

```astro
---
// Example: Using Astro with script tags
---
<h1>Not clicked</h1>
<button>Click to change heading</button>
<script>
document.querySelector("button").addEventListener("click",() => {
    document.querySelector("h1").innerText = "clicked"
})
</script>
```


## TODO

- Talk about using Preact + React + Solid together in the same project (Fred: this is a bit technically tricky, I can write this section if you leave it for me)
- anything else? I can't think of anything!


[mdn-io]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
[mdn-ric]: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
[mdn-mm]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
