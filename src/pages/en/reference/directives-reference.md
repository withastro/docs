---
layout: ~/layouts/MainLayout.astro
title: Directives Reference
---

And UI Framework components. Directives can only be used inside of Astro components.
Directives are special properties that can be passed to HTML elements, Astro components, And UI Framework components.

Directives are Astro-specific attributes, used in your `.astro` component to "direct" Astro as it renders your HTML template.

This page describes the options available for directing Astro to render different types of content on your page.

## Universally available directives

These directives are available on HTML elements, UI Framework components, Astro components, the works!

### `is:raw`

Instructs the Astro compiler to treat any children of that element as text. This means that all special Astro templating syntax will be ignored.

Used internally by the `<Markdown>` component.

For example, if you had a custom Katex component that converted some text to HTML, you could have users do this:
  
```astro
---
import Katex from '../components/Katex.astro';
---

<Katex is:raw>Some conflicting {syntax} here</Katex>
```

### `class:list`

Serializes a JavaScript expression to a string of CSS class names. Similar to the [clsx](https://github.com/lukeed/clsx) helper library.

The final `class` string is passed to the component/element as the `class` prop.

```astro
<!-- This -->
<span class:list={[ 'hello goodbye', { hello: true, world: true }, new Set([ 'hello', 'friend' ]) ]} />
<!-- Becomes -->
<span class="hello goodbye world friend"></span>
```

>⚠️ `class:list` will not be parsed if its value is not an expression.
>
> e.g. `<Component class:list="test" />` will not work.

## UI Framework components

These directives can be used on components from any of the UI Frameworks that Astro supports. Lean more about UI Framework components on their [dedicated page](/en/core-concepts/framework-components).

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

💡 *Useful for components that are entirely dependent on client-side APIs.*

>⚠️ This component will be **skipped** at build time, and to assist the client, you should specify which renderer to use from the array in your [`astro.config.mjs` configuration](/en/reference/configuration-reference).
>
> e.g. `<client:only="react" />` or `<client:only="my-custom-renderer" />`

## Script and Style tags

These directives can be used on HTML `<script>` and `<style>` tags.

### `define:vars={variables}`

Pass variables into a `<script>` or `<style>` tag. Any *serializable* front matter variable is supported, including props passed to your component through `Astro.props`.

```astro
---
const foregroundColor = "rgb(221 243 228)";
const backgroundColor = "rgb(24 121 78)";
const message = "Astro is awsome!";
---
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

>⚠️ using `define:vars` on a `<script>` or `<style>` tag implies the `is:inline` directive, which means your scripts or styles won't be bundled and will be inlined directly into the HTML. See the [dedicated section](#isinline) on `is:inline` for more details.

### `is:inline`

Opt-out a `<script>` or `<stlye>` tag from being bundled.

This means that whatever you put in the tag is directly inlined into the page. In `<script>` tags, that means you can't use ESM imports to NPM modules.

The `is:inline` directive means that `<style>` and `<script>` tags:

- Will not be bundled into an external file.
- Will not be deduplicated—the element will appear as many times as it is rendered.
- Will be pre-processed, for example a `<style lang="sass">` attribute will still generate plain CSS.
- Will be rendered in the final output HTML where it is authored.

> ⚠️ The `is:inline` directive is implied whenever any attribute other than `src` is used on a `<script>` or `<style>` tag.

```astro
<style is:inline>
  span { color: green; }
</style>

<script is:inline>
  console.log('I am literally inlined here on the page');
</script>

<style>
  @import './dep.css'; /* Vite imports supported, including npm packages! */
  h1 { color: red; }
</style>

<script>
  import cowsay from 'cowsay'; // Here too!
  console.log(cowsay('I am bundled with the rest of the website JS!'));
</script>
```

### `is:global`

Make the contents of a `<style>` tag apply globaly on pages where the component is included by disabling Astro's CSS scoping system.

This is equivalent to wrapping all of the selectors within a `<style>` tag with `:global()`.

📚 See the [Styling & CSS](/en/guides/styling/#global-styles) page for more details about how global styles work.

```astro
<!-- This: -->
<style is:global>
  a {
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
</style>

<!-- Is equivilent to this: -->
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

These directives can be used on any HTML element, even the lowly `<div>`.

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

This is the default behavior without using any directives though, so there aren't really any use cases for it other than making it clear that the content is being escaped properly.

```astro
---
const potentialyDangerousContent = await fetchUserGeneratedContent();
---
<Fragment set:text={potentialyDangerousContent}>
```
