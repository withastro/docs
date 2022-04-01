---
layout: ~/layouts/MainLayout.astro
title: Framework Components
description: Learn how to use React, Svelte, etc.
---
Build your Astro website without sacrificing your favorite component framework. Astro supports a variety of popular frameworks including [React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/) and [Lit](https://lit.dev/). 

## Installing Integrations

**New in v0.25!** 

Astro ships with optional integrations for React, Preact, Svelte, Vue, SolidJS and Lit. One or several of these Astro integrations can be installed and configured in your project.

To configure Astro to use these frameworks, first, install its integration and any associated peer dependencies:

```bash
npm install --save-dev @astrojs/react react react-dom
```

Then import and add the function to your list of integrations in `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import preact from '@astrojs/preact';
import svelte from '@astrojs/svelte';
import vue from '@astrojs/vue';
import solid from '@astrojs/solid-js';
import lit from '@astrojs/lit';

export default defineConfig({
	integrations: [react(), preact(),svelte(), vue(), solid() , lit()],
});
```

⚙️ View the [Integrations Guide](/en/guides/integrations-guide) for more details on installing and configuring Astro integrations.

## Using Framework Components

Use your JavaScript framework components in your Astro pages, layouts and components just like Astro components! All your components can live together in `/src/components`, or can be organized in any way you like.

To use a framework component, import it from its relative path, including file extension, in the component script. Then, use the component alongside other components, HTML elements and JSX-like expressions in the component template. 

```astro
---
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<html>
  <body>
    <h1>Use React components directly in Astro!</h1>
    <MyReactComponent />
  </body>
</html>
```

## Hydrating Interactive Components

A framework component can be hydrated using a `client:*` directive. This is a component attribute to define how your component should be **rendered** and **hydrated**. It describes whether your component should be rendered at build-time, and when your component's JavaScript should be loaded by the browser, client-side.

Most directives will render the component on the server at build time. Component JS will be sent to the client according to the specific directive. The component will hydrate when its JS has finished importing.

```astro
---
// Example: hydrating framework components in the browser.
import InteractiveButton from '../components/InteractiveButton.jsx';
import InteractiveCounter from '../components/InteractiveCounter.jsx';
---
<!-- This component's JS will begin importing when the page loads -->
<InteractiveButton client:load />

<!-- This component's JS will not be sent to the client until 
the user scrolls down and the component is visible on the page -->
<InteractiveCounter client:visible />
```

>⚠️ Any renderer JS necessary for the component's framework (e.g. React, Svelte) is downloaded with the page. The `client:*` directives only dictate when the component JS is imported and when the component is hydrated.

### Available Hydration Directives

There are serveral hydration directives available for UI framework components, such as `client:load`, `client:idle`, and more!

📚 See our [directives reference](/en/reference/directives-reference#ui-framework-components) page for the full list of hydration directives, and their usage.

## Mixing Frameworks

An **Astro component** can import and render components from multiple frameworks.

⚠️ *Note that components must be imported including their file extensions.*
```astro
// src/pages/MyAstroPage.astro
---
// Example: Mixing multiple framework components on the same page.
import MyReactComponent from '../components/MyReactComponent.jsx';
import MySvelteComponent from '../components/MySvelteComponent.svelte';
import MyVueComponent from '../components/MyVueComponent.vue';
---
<div>
  <MySvelteComponent />
  <MyReactComponent />
  <MyVueComponent />
</div>
```

## Nesting Framework Components

An **Astro component** can also nest components from multiple frameworks.

⚠️ *Note that framework components themselves (e.g. `.jsx`, `.svelte`) cannot mix multiple frameworks.*
```astro
// src/pages/MyAstroPage.astro
---
import MySidebar from '../components/MySidebar.jsx';
import MyButton from '../components/MyButton.svelte';
---
<MySidebar>
  <p>Here is a sidebar with some text and a button.</p>
  <MyButton client:load />
</MySidebar>
```

Framework components can only contain other components of the same framework. For example, a single React component can have an entire tree of React child components, but cannot contain Astro components or Vue components. Only Astro components can contain child components from any framework.

This allows you to build entire "apps" in your preferred JavaScript framework and render them, via a parent component, to an Astro page. This is a convenient pattern to allow related components to share state or context. 

## Can I Hydrate Astro Components?

 If you try to hydrate an Astro component with a `client:` modifier, you will get an error.

[Astro components](/en/core-concepts/astro-components) are HTML-only templating components with no client-side runtime. But, you can use a `<script>` tag in your Astro component template to send JavaScript to the browser that executes in the global scope.


📚 Learn more about [client-side `<scripts>` in Astro components](/en/core-concepts/astro-components#client-side-scripts) 


[mdn-io]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
[mdn-ric]: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
[mdn-mm]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia


