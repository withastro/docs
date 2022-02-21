---
layout: ~/layouts/MainLayout.astro
title: Astro Components
description: An intro to the .astro component syntax.
---

An `.astro` file represents **some snippet of HTML** in your project. This can be a reusable component that generates UI item such as a header or a profile card, or a [Page component](/en/core-concepts/astro-pages) that renders an entire HTML document including `<html>`, `<head>` and `<body>` elements.

Astro produces static HTML at build time by combining the two parts of an .astro file: first running any JavaScript/TypeScript in the **Component Script**, and then making the resulting data available to the **Component Template**, written in Astro's own JSX-like syntax.

The Astro syntax is rendered to HTML once, at build time, and only this HTML is used to build your web pages and shipped to the browser. (The front matter JS/TS functions and JSX-like dynamic renderings are never re-run, nor are they visible in your built code.)

The final, rendered HTML is created with data coming from sources such as 
- JavaScript/Typescript in the front matter (variables, functions...)
- imports (other Astro components, framework components, library/package components...)
- props passed from parent components
- child components rendered via Astro's `<slot />` tag
- additional CSS via `<style>` tags that gets bundled with any separate CSS files
- `<script>` tags


## Component Script

Astro uses a code fence (`---`) to contain the Component Script: the first section of an Astro component file.

### JavaScript/TypeScript

The Component Script of an `.astro` file provides full support for JavaScript & TypeScript code.

### Component Imports

An Astro Component Script can import other Astro components. Once imported, these Astro components can be used alongside native HTML elements.

📚 Learn about Astro's [Built-in Components](/en/reference/builtin-components).

📚 You can also import and use components from other frontend frameworks like React, Svelte, and Vue. Read about [Framework Components](/en/core-concepts/component-hydration) to learn more.

### Dynamic JSX Expressions

An Astro Component Script can define local variables inside of the Component Script. Any script variables are then automatically available in the HTML template below. These local variables can:

- pass dynamic values to be used as HTML output
- pass dynamic attributes to HTML elements and components
- be used in JSX-like functions to to produce dynamically-generated HTML elements

### Component Props

An Astro component can define and accept props via [`Astro.props`](/en/reference/api-reference/) in your front matter script. These props then become available to the Component Template for rendering HTML. 

You can also define your props with TypeScript by exporting a `Props` type interface. Astro will automatically pick up any exported `Props` interface and give type warnings/errors for your project.


## Component Template

The Component Template returns HTML elements to render along with any imported components, and can also contain `<script>` and `<style>` tags.

### HTML

The Content Template can include a combination of native HTML elements and Astro/framework components, in a JSX-like syntax.

### Slots

The `<slot>` element is a placeholder for HTML which will be passed in to the component as "children."

A component that uses the `<slot />` element can be thought of as a reusable "wrapper" around other content, and this pattern is the basis of an Astro [Layout component](/en/core-concepts/layouts).

Slots can be **named** to allow you to specify where certain children elements should be placed, and slots can also define **fallback content** to render when there are no matching children passed to a `<slot>`.


### CSS Styles

CSS rules inside of a `<style>` tag are automatically scoped to that component. That means that you can reuse class names across multiple components without worrying about conflicts. 

You can import styled components into other components and styles will not be applied to child, nor sibling elements. Styles are automatically extracted and optimized in the final build so that you don't need to worry about style loading.

A  `<style global>` tag can be used to override automatic scoping by the `<style>` tag. 

Sass (an alternative to CSS) is also available via `<style lang="scss">`.

📚 Read our full guide on [Component Styling](/en/guides/styling) to learn more.


### Scripts

To send JavaScript to the browser without [using a framework component](/en/core-concepts/component-hydration) (React, Svelte, Vue, Preact, Solid...) you can use a `<script>` tag in your Astro component body.

Scripts can be hoisted out of components and moved to the top of the page, and then later bundled together in production.