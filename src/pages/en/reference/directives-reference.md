---
layout: ~/layouts/MainLayout.astro
title: Directives Reference
---

## UI Framework component directives

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


## Script and Style tag directives

### `define:vars`

Pass variables into a `<script>` or `<style>` tag. Any *serializable* front matter variable is supported, including props passed to your component through `Astro.props`.

 >⚠️ `define:vars` cannot be used on a script tag that has been opted-in to hosting and processing.
 >
 > e.g. `<script hoist type="module">`

```astro
---
const foregroundColor = "rgb(221 243 228)";
const backgroundColor = "rgb(24 121 78)";
const message = "Astro is awsome!";
---
<h1>Hello</h1>

<style define:vars={{ textColor: foregroundColor, backgroundColor }}>
  h1 {
    background-color: var(--backgroundColor);
    color: var(--textColor);
  }
</style>

<script define:vars={{ message }}>
  alert(message);
</script>
```

### `hoist`

Opt-in the contents of a `<script>` tag to being bundled and processed. ESM imports work, even to npm packages.

> TODO: Explain more here