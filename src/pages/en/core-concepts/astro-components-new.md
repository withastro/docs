---
layout: ~/layouts/MainLayout.astro
title: Astro Components
description: An intro to the .astro component syntax.
---

**Astro components** are the basic building blocks of any Astro project. 

Astro components are written using the Astro component syntax, a superset of HTML that adds support for things like components and JavaScript expressions. You can spot an Astro component by it's file extension: `.astro`.

Astro components are extremely flexible. Often, an Astro component will contain some **reusable UI on the page**, like a header or a profile card. At other times, and Astro component may contain a smaller snippet of HTML, like a collection of common `<meta>` tags that make SEO easy to work with. Astro components can even contain an entire page layout.

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

Astro uses a code fence (`---`) to identify the component script in your Astro Component. If you've every written markdown before, you may already be familiar with a similar concept called *front matter.* Astro idea of a component script was directly inspired by this concept.

You can use the component script to write any JavaScript code that you need to render your template. This can include:

- Importing other Astro components
- Importing other components, like React
- Importing data, like a JSON file
- fetching content from an API or database
- creating variables that you will reference in your template

```astro
---
import SomeAstroComponent from '../components/SomeAstroComponent.astro';
import SomeReactComponent from '../components/SomeReactComponent.astro';
import someData from '../data/pokemon.json';

// Access passed-in component props, like `<X title="Hello, World" />`
const {title} = Astro.props;
// Fetch external data, even from a private API or database
const data = await fetch('SOME_SECRET_API_URL/users').then(r => r.json());
---
<!-- Your template here! -->
```

The code fence is designed to guarantee that the JavaScript that you write in it is "fenced in." It won't escape into your frontend application, or into your users hands. You can safely write code here that is expensive or sensitive (like a call to your private database) without worrying about it ever ending on your user's browser.

You can even write TypeScript in your component script!

### The Component Template

Below the component script, sits the component template. The component template decides the HTML output of your component. If you write HTML here, your component will render that HTML onto the page when its used!

The component template syntax that is a super-set of HTML that adds support for JavaScript expressions and special Astro directives. The syntax was designed to feel familiar to anyone with experience writing HTML or JSX.

```astro
---
// Your component script here!
const myFavoritePokemon = [/* ... */];
---
<!-- HTML comments supported! -->
<h1>Hello, world!</h1>
<!-- Use props and other variables from the component script: -->
<p>My favorite pokemon is: {Astro.props.title}</p>
<!-- Mix HTML with JavaScript expressions, similar to JSX: -->
<ul>
  {myFavoritePokemon.map((data) => <li>{data.name}</li>)}
<ul>
```

### CSS Styles

CSS `<style>` tags are also supported inside of the component template. They can be used to style your components, and all style rules are automatically scoped to the component to prevent CSS conflicts in large apps.

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

### Client-Side Scripts

To send JavaScript to the browser without [using a framework component](/en/core-concepts/component-hydration) (React, Svelte, Vue, Preact, Solid...) you can use a `<script>` tag in your Astro component body.

```astro
---
// Your component script here!
---
<script>
  document.querySelector('h1').style.color = 'red';
</script>
<h1>Hello, world!</h1>
```


## Next Steps

TODO(sarah): For more, check out our full reference on Astro components


