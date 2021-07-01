---
layout: ~/layouts/Main.astro
title: Astro Components
---

**Astro Components** (`.astro` files) are the foundation of server-side templating in Astro. You can think of the Astro component syntax as HTML enhanced with JavaScript. If you're familiar with JSX, Astro should also feel familiar.

Learning a new syntax can be intimidating, but the Astro component syntax has been carefully designed to feel familiar to web developers. It borrows heavily from patterns you likely already know: components, frontmatter, props, and JSX expressions. We're confident that this guide will have you writing Astro components in no time.

If you're already familiar with HTML & JavaScript, you'll likely feel comfortable with the Astro component syntax right away.

## Syntax Overview

Astro components are a type of Single-File Component (SFC). Svelte and Vue are two other examples of this component type, where a single `.astro` file represents a single Astro component. 

Below is a walk-through of the different parts of your component.
### HTML Template

Astro component syntax is a superset of HTML. **If you know HTML, you already know enough to write your first Astro component.**


```html
<!-- components/Example1.astro - This HTML is a valid Astro component! -->
<div class="example-1">
  <h1>Hello world!</h1>
</div>
```

Usually, an Astro component represents some reusable snippet of HTML. However, an Astro component can also represent an entire page including `<html>`, `<head>` and `<body>` elements. See our guide on [Astro Pages](/guides/astro-pages) to learn how to build your first full HTML page with Astro.

**Every Astro component must include an HTML template.** While you can enhance your component in several ways (see below) at the end of the day its the HTML template that dictates what your rendered Astro component will look like.

### Frontmatter Script

Astro supports more than just static HTML. To build a dynamic components, we introduce the idea of a frontmatter component script. [Frontmatter](https://jekyllrb.com/docs/front-matter/) is a common pattern in Markdown, where some config/metadata is contained inside a code fence (`---`) at the top of the file. Astro does something similar, but with full support for JavaScript & TypeScript in your components.

Remember that Astro is a server-side templating language, so your component script will run during the build but only the HTML is rendered to the browser. To send JavaScript to the browser, you can use a `<script>` tag in your HTML template or [convert your component to use a frontend framework](/core-concepts/component-hydration) like React, Svelte, Vue, etc.

```astro
---
// Anything inside the `---` code fence is your component script.
// This JavaScript code runs at build-time, and unlocks a bunch of new features.
// See below to learn more about what you can do.
console.log('Read this in the CLI output');
// Tip: TypeScript is supported out-of-the-box!
const thisWorks: number = 42;
---
<div class="example-1">
  <h1>Hello world!</h1>
</div>
```


### Component Imports

Astro components can be imported just like anything else in your frontmatter component script. This forms the foundation of our component system: build new components and then import them inside other components.

An Astro component is always the file's default import.

```astro
---
// Import your components in your component script...
import SomeComponent from './SomeComponent.astro';
---
<!-- ... then use them in your HTML! -->
<div>
  <SomeComponent />
</div>
<!-- Astro components MUST start with an uppercase letter. 
     This would NOT work as expected: <somecomponent /> -->
```

📚 You can also import and use components from other frontend frameworks like React, Svelte, and Vue.  Read our guide on [Component Hydration](/core-concepts/component-hydration) to learn more.

### Dynamic JSX Expressions

Instead of inventing our own custom syntax for dynamic templating, we give you direct access to JavaScript values inside of your HTML, using something that feels just like [JSX](https://reactjs.org/docs/introducing-jsx.html).

Astro components can define local variables inside of the Frontmatter script. Any script variables are then automatically available in the HTML template below.

#### Dynamic Values

```astro
---
const name = "Your name here";
---
<div>
  <h1>Hello {name}!</h1>
</div>
```
#### Dynamic Attributes

```astro
---
const name = "Your name here";
---
<div>
  <div data-name={name}>Attribute expressions supported</div>
  <div data-hint={`Use JS template strings to mix ${"variables"}.`}>So good!</div>
</div>
```

#### Dynamic HTML

```astro
---
const items = ["Dog", "Cat", "Platipus"];
---
<ul>
  {items.map((item) => (
    <li>{item}</li>
  ))}
</ul>
```


### Component Props

An Astro component can define and accept props. Props are available on the `Astro.props` global in your frontmatter script.

```astro
---
// Example: <SomeComponent greeting="(Optional) Hello" name="Required Name" />
const { greeting = 'Hello', name } = Astro.props;
---
<div>
    <h1>{greeting}, {name}!</h1>
</div>
```

You can define your props with TypeScript by exporting a `Props` type interface. Astro will automatically pick up any exported `Props` interface and give type warnings/errors for your project.

```astro
---
// Example: <SomeComponent />  (WARNING: "name" prop is required)
export interface Props {
  name: string;
  greeting?: string;
}
const { greeting = 'Hello', name } = Astro.props;
---
<div>
    <h1>{greeting}, {name}!</h1>
</div>
```

### Fragments & Multiple Elements

At the top-level of an `.astro` file, you are safe to render as many top-level elements as you'd like. This is possible because HTML makes it easy. 

```html
<!-- An Astro component can render multiple HTML elements: -->
<div id="a" />
<div id="b" />
<div id="c" />
```

Inside of a JSX expression, you must wrap multiple elements inside of a Fragment. Fragments let you group a list of children without adding extra nodes to the DOM. This is due to a limitation of JavaScript: You can never `return` more than one thing from an expression or function. 

A Fragment must open with `<>` and close with `</>`. Don't worry if you forget this, Astro's compiler will warn you that you need to add one.

```astro
---
const items = ["Dog", "Cat", "Platipus"];
---
<ul>
  {items.map((item) => (
    <>
      <li>Red {item}</li>
      <li>Blue {item}</li>
      <li>Green {item}</li>
    </>
  ))}
</ul>
```

### Slots

Sometimes, an Astro component will be passed children. This is especially common for components like sidebars or Dialog boxes that represent generic "wrappers” around custom content. 

```astro
<WrapChildrenWithText>
  <img src="https://placehold.co/400" />
<WrapChildrenWithText>
```

Astro provides a `<slot />` component to control where any children are rendered within the component. This is heavily inspired by the [`<slot>` HTML element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot).

If you don't provide a `<slot />` component in your HTML template, any children will not be rendered.


```astro
---
// Example: components/WrapChildrenWithText.astro
// Usage: <WrapChildrenWithText><img src="https://placehold.co/400" /><WrapChildrenWithText>
// Renders: <h1>Begin</h1><img src="https://placehold.co/400" /><h1>End</h1>
---
<h1>Begin</h1>
<!-- slot: any given children are injected here -->
<slot /> 
<h1>End</h1>
```


## Comparing `.astro` versus `.jsx`

`.astro` files can end up looking very similar to `.jsx` files, but there are a few key differences. Here's a comparison between the two formats.

| Feature                      | Astro                                      | JSX                                                |
| ---------------------------- | ------------------------------------------ | -------------------------------------------------- |
| File extension               | `.astro`                                   | `.jsx` or `.tsx`                                   |
| User-Defined Components      | `<Capitalized>`                            | `<Capitalized>`                                    |
| Expression Syntax            | `{}`                                       | `{}`                                               |
| Spread Attributes            | `{...props}`                               | `{...props}`                                       |
| Boolean Attributes           | `autocomplete` === `autocomplete={true}`   | `autocomplete` === `autocomplete={true}`           |
| Inline Functions             | `{items.map(item => <li>{item}</li>)}`     | `{items.map(item => <li>{item}</li>)}`             |
| IDE Support                  | WIP - [VS Code][code-ext]                  | Phenomenal                                         |
| Requires JS import           | No                                         | Yes, `jsxPragma` (`React` or `h`) must be in scope |
| Fragments                    | Automatic top-level, `<>` inside functions | Wrap with `<Fragment>` or `<>`                     |
| Multiple frameworks per-file | Yes                                        | No                                                 |
| Modifying `<head>`           | Just use `<head>`                          | Per-framework (`<Head>`, `<svelte:head>`, etc)     |
| Comment Style                | `<!-- HTML -->`                            | `{/* JavaScript */}`                               |
| Special Characters           | `&nbsp;`                                   | `{'\xa0'}` or `{String.fromCharCode(160)}`         |
| Attributes                   | `dash-case`                                | `camelCase`                                        |

## URL resolution

It’s important to note that Astro **won’t** transform HTML references for you. For example, consider an `<img>` tag with a relative `src` attribute inside `src/pages/about.astro`:

```html
<!-- ❌ Incorrect: will try and load `/about/thumbnail.png` -->
<img src="./thumbnail.png" />
```

Since `src/pages/about.astro` will build to `/about/index.html`, you may not have expected that image to live at `/about/thumbnail.png`. So to fix this, choose either of two options:

#### Option 1: Absolute URLs

```html
<!-- ✅ Correct: references public/thumbnail.png -->
<img src="/thumbnail.png" />
```

The recommended approach is to place files within `public/*`. This references a file it `public/thumbnail.png`, which will resolve to `/thumbnail.png` at the final build (since `public/` ends up at `/`).

#### Option 2: Asset import references

```astro
---
//  ✅ Correct: references src/thumbnail.png
import thumbnailSrc from './thumbnail.png';
---

<img src={thumbnailSrc} />
```

If you’d prefer to organize assets alongside Astro components, you may import the file in JavaScript inside the component script. This works as intended but this makes `thumbnail.png` harder to reference in other parts of your app, as its final URL isn’t easily-predictable (unlike assets in `public/*`, where the final URL is guaranteed to never change).


[code-ext]: https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode


