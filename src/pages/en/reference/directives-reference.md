---
layout: ~/layouts/MainLayout.astro
title: Directives Reference
---

## UI Framework components

These can be used on components from any of the UI Frameworks that Astro supports. Lean more about UI Framework components on their [dedicated page](/en/core-concepts/framework-components).

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

## Script and Style tags

These can be used on `<script>` and `<style>` tags.

### `define:vars={variables}`

Pass variables into a `<script>` or `<style>` tag. Any *serializable* front matter variable is supported, including props passed to your component through `Astro.props`.

>⚠️ `define:vars` cannot be used on a `<script>` tag that makes use of the `hoist` directive.
>
> e.g. `<script hoist type="module" define:vars={{ myVariable }}>` will not work!

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

Astro detects these JavaScript client-side imports and then builds, optimizes, and adds the JS to the page automatically.

```astro
// ESM import
<script hoist type="module">
  import './some-external-script.js';
</script>
```

>⚠️ `hoist` Always needs to be used in conjunction with `type="module"`.
>
> e.g. `<script hoist type="module">`

### `global`

Make the contents of a `<style>` tag apply globaly on pages where the component is included by disabling Astro's CSS scoping system.

This is equivalent to wrapping all of the selectors within a `<style>` tag with `:global()`.

```astro
<style global>
  a {
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
</style>
<style>
  :global(a) {
    text-decoration: none;
  }
  :global(a:hover) {
    text-decoration: underline;
  }
</style>
```

## HTML elements

These can be used on any HTML element like a `<div>`.

### `set:html={html}`

Inject an HTML string into an element without it being escaped.

```astro
---
const title = "Hello <strong>World</strong>"
---
<h1>{title}</h1> <!-- <h1>Hello &lt;strong&gt;World&lt;/strong&gt;</h1> -->
<h1 set:html={title} /> <!-- <h1>Hello <strong>World</strong></h1> -->
```

You can also use it on a `<Fragment>` to avoid adding a wrapper element.

```astro
---
const cmsContent = await fetchDataFromMyCMS();
---
<Fragment set:html={cmsContent}>
```

### `set:text={text}`

The opposite of `set:html`. `set:text` ensures that any HTML content passed to it is escaped.

```astro
---
const potentialyDangerouContent = await fetchUserGeneratedContent();
---
<Fragment set:text={potentialyDangerouContent}>
```

## Everything

These directives are avalible on HTML elements, UI Framework components, Astro components, the works!

### `is:raw`

Instructs the Astro compiler to treat any children of that element as text, similar to the default behavior of `<script>` and `<style>` which don't support expressions. This means that all astro templating syntax will be ignored.

For example, if you had a custom Katex component that converted some text to HTML, you could have users do this:
  
```astro
---
import Katex from '../components/Katex.astro';
---

<Katex is:raw>Some conflicting {syntax} here</Katex>
```

### `class:list`

Serializes a JavaScript expression to a string of CSS class names. Similar to the [clsx](https://github.com/lukeed/clsx) helper library.

```astro
<!-- This -->
<span class:list={[ 'hello goodbye', { hello: true, world: true }, new Set([ 'hello', 'friend' ]) ]} />
<!-- Becomes -->
<span class="hello goodbye world friend"></span>
```
