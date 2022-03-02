---
layout: ~/layouts/MainLayout.astro
title: Slots
description: An intro to aliases with Astro.
---
The `<slot>` element is a placeholder for HTML which will be passed in from outside of the component by "children" (as they are called in React or Preact). Slots are a way of passing data into an Astro component and are useful when you will want to reuse an "outer" component, rendered "around" data coming from an external source.

A component that uses the `<slot />` element can be thought of as a reusable "wrapper" around other content, and this pattern is the basis of an Astro [Layout component](/en/core-concepts/layouts).


```astro
// src/components/Wrapper.astro
---
import Header from './Header.astro';
import Logo from './Logo.astro';
import Footer from './Footer.astro';

const { name } = Astro.props
---
<div id="content-wrapper">
  <Header />
  <Logo />
  <h1>{name}</h1>
  <slot />  <!-- children will go here -->
  <Footer />
</div>

// src/components/Person.astro

<Wrapper name = "Astro">
  <h2>I am a person.</h2>
  <p>Here is some stuff about me.</p>
</Wrapper>
```

#### Named Slots

Slots can also be **named**. Rather than a single `<slot>` element which renders _all_ children, named slots allow you to specify multiple places where children should be placed.

```astro
// src/components/Wrapper.astro
---
import Header from './Header.astro';
import Logo from './Logo.astro';
import Footer from './Footer.astro';

const { name } = Astro.props
---
<div id="content-wrapper">
  <Header />
  <slot name="after-header"/>  <!--  children with the `slot="after-header"` attribute will go here -->
  <Logo />
  <h1>{name}</h1>
  <slot />  <!--  children without a `slot`, or with `slot="default"` attribute will go here -->
  <Footer />
  <slot name="after-footer"/>  <!--  children with the `slot="after-footer"` attribute will go here -->
</div>

// src/components/Person.astro

<Wrapper name = "Astro">
  <img src="https://my.photo/astro.jpg" slot="after-header">
  <h2>I am a person.</h2>
  <p slot="after-footer">Here is some stuff about me.</p>
</Wrapper>

```
#### Fallback Content for Slots
Slots can also render **fallback content**. When there are no matching children passed to a `<slot>`, a `<slot>` element will render its own placeholder children.

```astro
// src/components/Wrapper.astro
---
import Header from './Header.astro';
import Logo from './Logo.astro';
import Footer from './Footer.astro';

const { name } = Astro.props
---
<div id="content-wrapper">
  <Header />
  <Logo />
  <h1>{name}</h1>
  <slot>
    <p>This is my fallback content, if there is no child passed into slot</p>
  </slot>
  <Footer />
</div>
```