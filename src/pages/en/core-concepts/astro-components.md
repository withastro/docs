---
layout: ~/layouts/MainLayout.astro
title: Components
description: An intro to the .astro component syntax.
---

**Astro components** are the basic building blocks of any Astro project. They are are HTML-only templating components with no client-side runtime.

Astro component syntax is a superset of HTML. The syntax was designed to feel familiar to anyone with experience writing HTML or JSX, and adds support for including components and JavaScript expressions. You can spot an Astro component by its file extension: `.astro`.

Astro components are extremely flexible. Often, an Astro component will contain some **reusable UI on the page**, like a header or a profile card. At other times, an Astro component may contain a smaller snippet of HTML, like a collection of common `<meta>` tags that make SEO easy to work with. Astro components can even contain an entire page layout.

The most important thing to know about Astro components is that they **render to HTML during your build.** Even if you run JavaScript code inside of your components, it will all run ahead-of-time, stripped from the final page that you send to your users. The result is a faster site, with zero JavaScript footprint added by default.


## Component Overview

An Astro component is made up of two main parts: the **Component Script** and the **Component Template**. Each part performs a different job, but together they aim to provide a framework that is both easy to use and expressive enough to handle whatever you might want to build.

```astro
---
// Component Script (JavaScript)
---
<!-- Component Template (HTML + JS Expressions) -->
```

You can use components inside of other components, to build more and more advanced UI. For example, a `Button` component could be used to create a `ButtonGroup` component like so:

```astro
---
// Example: ButtonGroup.astro
import Button from './Button.astro';
---
<div>
  <Button title="Button 1" />
  <Button title="Button 2" />
  <Button title="Button 3" />
</div>
```


### The Component Script

Astro uses a code fence (`---`) to identify the component script in your Astro component. If you've ever written Markdown before, you may already be familiar with a similar concept called *front matter.* Astro's idea of a component script was directly inspired by this concept.

You can use the component script to write any JavaScript code that you need to render your template. This can include:

- Importing other Astro components
- Importing other framework components, like React
- Importing data, like a JSON file
- fetching content from an API or database
- creating variables that you will reference in your template

```astro
---
import SomeAstroComponent from '../components/SomeAstroComponent.astro';
import SomeReactComponent from '../components/SomeReactComponent.jsx';
import someData from '../data/pokemon.json';

// Access passed-in component props, like `<X title="Hello, World" />`
const {title} = Astro.props;
// Fetch external data, even from a private API or database
const data = await fetch('SOME_SECRET_API_URL/users').then(r => r.json());
---
<!-- Your template here! -->
```

The code fence is designed to guarantee that the JavaScript that you write in it is "fenced in." It won't escape into your frontend application, or fall into your users hands. You can safely write code here that is expensive or sensitive (like a call to your private database) without worrying about it ever ending up in your user's browser.

>💡 *You can even write TypeScript in your component script!*

### The Component Template

Below the component script, sits the component template. The component template decides the HTML output of your component. 

If you write plain HTML here, your component will render that HTML in any Astro page it is imported and used.

However, Astro's component template syntax also supports **JavaScript expressions**, **imported components** and **special Astro directives**. Data and values defined (at page build time) in the component script can be used in the component template to produce dynamically-created HTML.

```astro
---
// Your component script here!
import ReactPokemonComponent from '../components/ReactPokemonComponent.jsx';
const myFavoritePokemon = [/* ... */];
---
<!-- HTML comments supported! -->

<h1>Hello, world!</h1>

<!-- Use props and other variables from the component script: -->
<p>My favorite pokemon is: {Astro.props.title}</p>

<!-- Include other components with a `client:` directive to hydrate: -->
<ReactPokemonComponent client:visible />

<!-- Mix HTML with JavaScript expressions, similar to JSX: -->
<ul>
  {myFavoritePokemon.map((data) => <li>{data.name}</li>)}
<ul>


```

### CSS Styles

CSS `<style>` tags are also supported inside of the component template. 

They can be used to style your components, and all style rules are automatically scoped to the component itself to prevent CSS conflicts in large apps. 

```astro
---
// Your component script here!
---
<style>
  /* scoped to the component, other H1s on the page remain the same */
  h1 { color: red }
</style>

<h1>Hello, world!</h1>
``` 

> ⚠️ The styles defined here apply only to content written directly in the component's own component template. Children, and any imported components will **not** be styled by default. 

📚 See our [Styling Guide](/en/guides/styling) for more information on applying styles.

### Client-Side Scripts

To send JavaScript to the browser without [using a framework component](/en/core-concepts/component-hydration) (React, Svelte, Vue, Preact, SolidJS, AlpineJS, Lit...) you can use a `<script>` tag in your Astro component template and send JavaScript to the browser that executes in the global scope.

```astro
---
let greeting = "Hello, World!"
---
<script>
  document.querySelector('h1').style.color = 'red';
</script>

<h1>{greeting}</h1>
```

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
 > ⚠️ Starting in `--experimental-static-build` (v0.23.x), you must opt-in to `<script>` element processing via the `hoist` attribute:

```astro
<script>
  // Will be rendered into the HTML exactly as written!
  // ESM imports will not be resolved relative to the file.
</script>
<script hoist>
  // Processed! Bundled! ESM imports work, even to npm packages.
</script>
```
#### Importing Scripts

**1. Absolute URL Path**

**Example:** `<script src="/some-external-script.js" />`  
**When to use this:** If your JavaScript file lives inside of `public/`.

Note that this approach skips the JavaScript processing, bundling and optimizations that are provided by Astro when you use the `import` method described below. 

**2. ESM Import via `<script hoist>`**

**Example:** `<script hoist>import './some-external-script.js';</script>`  
**When to use this:** If your external script lives inside of `src/` _and_ it supports the ESM module type.

Astro detects these JavaScript client-side imports and then builds, optimizes, and adds the CSS to the page automatically. 

```astro
<script hoist>
  import './some-external-script.js';
</script>
```

Note that Astro will bundle this external script with the rest of your client-side JavaScript, and load it in the `type="module"` script context. Some older JavaScript files may not be written for the `module` context, in which case they may need to be updated to use this method.

## Next Steps

📚 Read about [Astro's built-in components](https://docs.astro.build/en/reference/builtin-components/).

📚 Learn about using [JavaScript framework components](https://docs.astro.build/en/core-concepts/component-hydration/) in your Astro project.