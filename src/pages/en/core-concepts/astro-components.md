---
layout: ~/layouts/MainLayout.astro
title: Components
description: An intro to the .astro component syntax.
i18nReady: true
---

**Astro components** are the basic building blocks of any Astro project. They are HTML-only templating components with no client-side runtime.

Astro component syntax is a superset of HTML. The syntax was [designed to feel familiar to anyone with experience writing HTML or JSX](/en/comparing-astro-vs-other-tools/#astro-vs-jsx), and adds support for including components and JavaScript expressions. You can spot an Astro component by its file extension: `.astro`.

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

Astro uses a code fence (`---`) to identify the component script in your Astro component. If you've ever written Markdown before, you may already be familiar with a similar concept called *frontmatter.* Astro's idea of a component script was directly inspired by this concept.

You can use the component script to write any JavaScript code that you need to render your template. This can include:

- Importing other Astro components
- Importing other framework components, like React
- Importing data, like a JSON file
- fetching content from an API or database
- creating variables that you will reference in your template


```astro
---
// Note: Imports must live at the top of your file.
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

However, Astro's component template syntax also supports **JavaScript expressions**, **imported components** and [**special Astro directives**](/en/reference/directives-reference/). Data and values defined (at page build time) in the component script can be used in the component template to produce dynamically-created HTML.

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

<!-- Use a template directive to inject an unescaped HTML string into an element: -->
<p set:html={rawHTMLString} />
```

### Dynamic JSX Expressions

Astro components can define local variables inside of the frontmatter component script. Any script variables are then automatically available in the component's HTML template below.

#### Dynamic Values

These local variables can be used in curly braces to pass values to be used as HTML output:

```astro
---
const name = "Astro";
---
<div>
  <h1>Hello {name}!</h1>
</div>
```

#### Dynamic Attributes

These local variables can be used in curly braces to pass attribute values to HTML elements and components:

```astro
---
const name = "Astro";
---
<h1 class={name}>Attribute expressions are supported</h1>

<MyComponent templateLiteralNameAttribute={`MyNameIs${name}`} />
```

#### Dynamic HTML

These local variables can be used in JSX-like functions to produce dynamically-generated HTML elements:

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

#### Fragments & Multiple Elements

Remember: an Astro component template can render multiple elements with no need to wrap everything in a single `<div>` or `<>`.

However, when using an Astro JSX-like expression to dynamically create elements, you must wrap these multiple elements inside of a **Fragment** just like you would in JavaScript or JSX. Astro supports using either `<Fragment> </Fragment>` or `<> </>`.

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


### Component Props

An Astro component can define and accept props. These props then become available to the component template for rendering HTML. Props are available on the `Astro.props` global in your frontmatter script.

Here is an example of a component that receives a `greeting` prop and a `name` prop. Notice that the props to be received are destructured from the global `Astro.props` object.

```astro
---
// Example: GreetingHeadline.astro
// Usage: <GreetingHeadline greeting="Howdy" name="Partner" />
const { greeting, name } = Astro.props
---
<h2>{greeting}, {name}!</h2>
```

You can also define your props with TypeScript by exporting a `Props` type interface. Astro will automatically pick up any exported `Props` interface and give type warnings/errors for your project. These props can also be given default values when destructured from `Astro.props`

```astro
---
// src/components/GreetingHeadline.astro
export interface Props {
  name: string;
  greeting?: string;
}

const { greeting = "Hello", name } = Astro.props as Props;
---
<h2>{greeting}, {name}!</h2>
```

This component, when imported and rendered in other Astro components, layouts or pages, can be passed these props as attributes:

```astro
---
// src/components/GreetingCard.astro
import GreetingHeadline from './GreetingHeadline.astro';
const name = "Astro"
---
<h1>Greeting Card</h1>
<GreetingHeadline greeting="Hi" name={name} />
<p>I hope you have a wonderful day!</p>
```

### Slots

The `<slot />` element is a placeholder for external HTML content, allowing you to inject (or "slot") child elements from other files into your component template.

By default, all child elements passed to a component will be rendered in its `<slot />`

> 💡Unlike _props_, which are attributes passed to an Astro component available for use throughout your component with `Astro.props()`, _slots_ render child HTML elements where they are written.

```astro
---
// src/components/Wrapper.astro
import Header from './Header.astro';
import Logo from './Logo.astro';
import Footer from './Footer.astro';

const { title } = Astro.props
---
<div id="content-wrapper">
  <Header />
  <Logo />
  <h1>{title}</h1>
  <slot />  <!-- children will go here -->
  <Footer />
</div>
```

```astro
---
// src/pages/fred.astro
import Wrapper from '../components/Wrapper.astro';
---
<Wrapper title="Fred's Page">
  <h2>All about Fred</h2>
  <p>Here is some stuff about Fred.</p>
</Wrapper>
```

This pattern is the basis of an Astro layout component: an entire page of HTML content can be “wrapped” with `<Layout></Layout>` tags and sent to the Layout component to render inside of common page elements.



#### Named Slots

An Astro component can also have named slots. This allows you to pass only HTML elements with the corresponding slot name into a slot's location.

```astro
---
// src/components/Wrapper.astro
import Header from './Header.astro';
import Logo from './Logo.astro';
import Footer from './Footer.astro';

const { title } = Astro.props
---
<div id="content-wrapper">
  <Header />
  <slot name="after-header"/>  <!--  children with the `slot="after-header"` attribute will go here -->
  <Logo />
  <h1>{title}</h1>
  <slot />  <!--  children without a `slot`, or with `slot="default"` attribute will go here -->
  <Footer />
  <slot name="after-footer"/>  <!--  children with the `slot="after-footer"` attribute will go here -->
</div>
```

```astro
---
// src/pages/fred.astro
import Wrapper from '../components/Wrapper.astro';
---
<Wrapper title="Fred's Page">
  <img src="https://my.photo/fred.jpg" slot="after-header">
  <h2>All about Fred</h2>
  <p>Here is some stuff about Fred.</p>
  <p slot="after-footer">Copyright 2022</p>
</Wrapper>
```


Use a `slot="my-slot"` attribute on the child element that you want to pass through to a matching `<slot name="my-slot" />` placeholder in your component.

> ⚠️ This only works when you’re passing slots to other Astro components. Learn more about including other [UI framework components](/en/core-concepts/framework-components/) in Astro files.


#### Fallback Content for Slots
Slots can also render **fallback content**. When there are no matching children passed to a slot, a `<slot />` element will render its own placeholder children.

```astro
---
// src/components/Wrapper.astro
import Header from './Header.astro';
import Logo from './Logo.astro';
import Footer from './Footer.astro';

const { title } = Astro.props
---
<div id="content-wrapper">
  <Header />
  <Logo />
  <h1>{title}</h1>
  <slot>
    <p>This is my fallback content, if there is no child passed into slot</p>
  </slot>
  <Footer />
</div>
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

To send JavaScript to the browser without [using a framework component](/en/core-concepts/framework-components) (React, Svelte, Vue, Preact, SolidJS, AlpineJS, Lit) or an [Astro integration](https://astro.build/integrations/) (e.g. astro-XElement), you can use a `<script>` tag in your Astro component template and send JavaScript to the browser that executes in the global scope.

```astro
<script>
  // Processed! Bundled! ESM imports work, even to npm packages.
</script>

<script is:inline>
  // Will be rendered into the HTML exactly as written!
  // ESM imports will not be resolved relative to the file.
</script>
```

📚 See our [directives reference](/en/reference/directives-reference#script--style-directives) page for more information about the directives available  on `<script>` tags.

#### Loading External Scripts

**When to use this:** If your JavaScript file lives inside of `public/`.

Note that this approach skips the JavaScript processing, bundling and optimizations that are provided by Astro when you use the `import` method described below.

```astro
// absolute URL path
<script is:inline src="/some-external-script.js"></script>
```
#### Using Hoisted Scripts

**When to use this:** If your external script lives inside of `src/` _and_ it supports the ESM module type.

Astro detects these JavaScript client-side imports and then builds, optimizes, and adds the JS to the page automatically.

```astro
// ESM import
<script>
  import './some-external-script.js';
</script>
```


## Next Steps

📚 Read about [Astro's built-in components](https://docs.astro.build/en/reference/api-reference/#built-in-components).

📚 Learn about using [JavaScript framework components](https://docs.astro.build/en/core-concepts/framework-components/) in your Astro project.
