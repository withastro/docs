---
layout: ~/layouts/MainLayout.astro
title: Template Directives Reference
---

**Template directives** are a special kind of HTML attribute available inside of any Astro component template (`.astro` files). 

Template directives are used to control an element or component's behavior in some way. A template directive could enable some compiler feature that makes your life easier (like using `class:list` instead of `class`). Or, a directive could tell the Astro compiler to do something special with that component (like hydrating with `client:load`). 

This page describes all of the template directives available to you in Astro, and how they work.
## Rules

For a template directive to be valid, it must:

- Include a colon `:` in its name, using the form `X:Y` (ex: `client:load`).
- Be visible to the compiler (ex: `<X {...attr}>` would not work if `attr` contained a directive).

Some template directives, but not all, can take a custom value:
- `<X client:load />` (takes no value)
- `<X class:list={['some-css-class']} />` (takes an array)

A template directive is never included directly in the final HTML output of a component.

## Common Directives
### class:list

`class:list={...}` takes an array of class values and converts them into a class string. This is inspired by @lukeed's popular [clsx](https://github.com/lukeed/clsx) helper library, but built directly into Astro itself.

`class:list` takes an array of several different possible value kinds:
- `string`: Added to the element `class`
- `Object`: All truthy keys are added to the element `class`
- `Array`: flattened
- `Set`: flattened

```astro
<!-- This -->
<span class:list={[ 'hello goodbye', { hello: true, world: true }, new Set([ 'hello', 'friend' ]) ]} />
<!-- Becomes -->
<span class="hello goodbye world friend"></span>
```

Duplicate values are removed automatically.

### `set:html`

`set:html={string}` injects an HTML string into an element, similar to setting `el.innerHTML`. 

**The value is not automatically escaped by Astro!** Be sure that you trust the value, or that you have escaped it manually before passing it to the template. Forgetting to do this will open you up to [Cross Site Scripting (XSS) attacks.](https://owasp.org/www-community/attacks/xss/)

```astro
---
const rawHTMLString = "Hello <strong>World</strong>"
---
<h1>{rawHTMLString}</h1> 
  <!-- Output: <h1>Hello &lt;strong&gt;World&lt;/strong&gt;</h1> -->
<h1 set:html={rawHTMLString} /> 
  <!-- Output: <h1>Hello <strong>World</strong></h1> -->
```

You can also use `set:html` on a `<Fragment>` to avoid adding an unnecessary wrapper element. This can be especially useful when fetching HTML from a CMS.

```astro
---
const cmsContent = await fetchHTMLFromMyCMS();
---
<Fragment set:html={cmsContent}>
```

### `set:text`

`set:text={string}` injects a text string into an element, similar to setting `el.innerText`. Unlike `set:html`, the `string` value that is passed is automatically escaped by Astro.

This is equivalent to just passing a variable into a template expression directly (ex: `<div>{someText}</div>`) and therefore this directive is not commonly used.
## Client Directives

These directives control how [UI Framework components](/en/core-concepts/framework-components) are hydrated on the page.

By default, a UI Framework component is not hydrated in the client. If no `client:*` directive is provided, its HTML is rendered onto the page without JavaScript.

### `client:load`

- **Priority:** High
- **Useful for:** Immediately-visible UI elements that need to be interactive as soon as possible.

Load and hydrate the component JavaScript immediately on page load.

```astro
<BuyButton client:load />
```
### `client:idle`

- **Priority:** Medium
- **Useful for:** Lower-priority UI elements that don't need to be immediately interactive.

Load and hydrate the component JavaScript once the page is done with its initial load and the `requestIdleCallback` event has fired. If you are in a browser that doesn't support [`requestIdleCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback), then the document [`load`](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event) event is used.

```astro
<ShowHideButton client:idle />
```
### `client:visible`

- **Priority:** Low
- **Useful for:** Low-priority UI elements that are either far down the page ("below the fold") or so resource-intensive to load that you would prefer not to load them at all if the user never saw the element.

Load and hydrate the component JavaScript once the component has entered the user's viewport. This uses an `IntersectionObserver` internally to keep track of visibility. 

```astro
<HeavyImageCarousel client:visible />
```

### `client:media`

- **Priority:** Low
- **Useful for:** Sidebar toggles, or other elements that might only be visible on certain screen sizes.

`client:media={string}` loads and hydrates the component JavaScript once a certain CSS media query is met. 

Note: If the component is already hidden and shown by a media query in your CSS, then it can be easier to just use `client:visible` and not pass that same media query into the directive.

```astro
<SidebarToggle client:media="(max-width: 50em)" />
```
### `client:only`

`client:only={string}` **skips** HTML server-rendering, and renders only on the client. It acts similar to `client:load` in that it loads, renders and hydrates the component immediately on page load.

**You must pass the component's correct framework as a value!** Because Astro doesn't run the component during your build / on the server, Astro doesn't know what framework your component uses unless you tell it explicitly.

```astro
<SomeReactComponent client:only="react" />
<SomePreactComponent client:only="preact" />
<SomeSvelteComponent client:only="svelte" />
<SomeVueComponent client:only="vue" />
<SomeSolidComponent client:only="solid-js" />
```

## Script & Style Directives

These directives can only be used on HTML `<script>` and `<style>` tags, to control how your client-side JavaScript and CSS are handled on the page.
### `is:global`

By default, Astro automatically scopes `<style>` CSS rules to the component. You can opt-out of this behavior with the `is:global` directive.

`is:global` makes the contents of a `<style>` tag apply globally on the page when the component is included. This disabled Astro's CSS scoping system. This is equivalent to wrapping all of the selectors within a `<style>` tag with `:global()`.

You can combine `<style>` and `<style is:global>` together in the same component, to create some global style rules while still scoping most of your component CSS.

📚 See the [Styling & CSS](/en/guides/styling/#global-styles) page for more details about how global styles work.

```astro
<style is:global>
  body a { color: red; }
</style>
```

### `is:inline`

By default, Astro will process, optimize, and bundle any `<script>` and `<style>` tags that it sees on the page. You can opt-out of this behavior with the `is:inline` directive.

`is:inline` tells Astro to leave the `<script>` or `<style>` tag as-is in the final output HTML. The contents will not be processed, optimized, or bundled. This limits some Astro features, like importing an npm package or using a compile-to-CSS language like Sass.

The `is:inline` directive means that `<style>` and `<script>` tags:

- Will not be bundled into an external file.
- Will not be deduplicated—the element will appear as many times as it is rendered.
- Will not have its `import`/`@import`/`url()` references resolved relative to the `.astro` file.
- Will be pre-processed, for example a `<style lang="sass">` attribute will still generate plain CSS.
- Will be rendered in the final output HTML exactly where it is authored.
- Styles will be global and not scoped to the component.

> ⚠️ The `is:inline` directive is implied whenever any attribute other than `src` is used on a `<script>` or `<style>` tag.

```astro
<style is:inline>
  /* inline: relative & npm package imports are not supported. */
  @import '/assets/some-public-styles.css';
  span { color: green; }
</style>

<script is:inline>
  /* inline: relative & npm package imports are not supported. */
  console.log('I am inlined right here in the final output HTML.');
</script>
```

### `define:vars`

`define:vars={...}` can pass server-side variables from your component front matter into the client `<script>` or `<style>`. Any *serializable* front matter variable is supported, including props passed to your component through `Astro.props`.

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

>⚠️ Using `define:vars` on a `<script>` or `<style>` tag implies the `is:inline` directive, which means your scripts or styles won't be bundled and will be inlined directly into the HTML. See the [dedicated section](#isinline) on `is:inline` for more details.

## Advanced Directives
### `is:raw`

`is:raw` instructs the Astro compiler to treat any children of that element as text. This means that all special Astro templating syntax will be ignored inside of this component.

Used internally by the `<Markdown>` component.

For example, if you had a custom Katex component that converted some text to HTML, you could have users do this:
  
```astro
---
import Katex from '../components/Katex.astro';
---
<Katex is:raw>Some conflicting {syntax} here</Katex>
```
