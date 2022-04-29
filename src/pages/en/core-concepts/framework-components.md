---
layout: ~/layouts/MainLayout.astro
title: Framework Components
description: Learn how to use React, Svelte, etc.
---
Build your Astro website without sacrificing your favorite component framework. 

Astro supports a variety of popular frameworks including [React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/) and [Lit](https://lit.dev/). 

## Installing Integrations

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

⚙️ Want to see an example for the framework of your choice? Visit [astro.new](https://astro.new) and select one of the framework templates.

## Using Framework Components

Use your JavaScript framework components in your Astro pages, layouts and components just like Astro components! All your components can live together in `/src/components`, or can be organized in any way you like.

To use a framework component, import it from its relative path (including file extension) in your Astro component script. Then, use the component alongside other components, HTML elements and JSX-like expressions in the component template. 

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

>💡 _Remember: all imports must live at the **top** of your Astro component script!_

By default, your framework components will render as static HTML. This is useful for templating components that are not interactive and avoids sending any unnecessary JavaScript to the client.

## Hydrating Interactive Components

A framework component can be made interactive (hydrated) using a `client:*` directive. This is a component attribute to define how your component should be **rendered** and **hydrated**.

This [client directive](en/reference/directives-reference/#client-directives) describes whether or not your component should be rendered at build-time, and when your component's JavaScript should be loaded by the browser, client-side.

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

>⚠️ Any renderer JS necessary for the component's framework (e.g. React, Svelte) is downloaded with the page. The `client:*` directives only dictate when the _component JS_ is imported and when the _component_ is hydrated.

### Available Hydration Directives

There are serveral hydration directives available for UI framework components: `client:load`, `client:idle`, `client:visible`, `client:media={QUERY}` and `client:only=" "`.

📚 See our [directives reference](/en/reference/directives-reference#client-directives) page for a full description of these hydration directives, and their usage.

## Mixing Frameworks

You can import and render components from multiple frameworks in the same Astro component.

>⚠️ *Only **Astro** components (`.astro`)can contain components from multiple frameworks.*
```astro
---
// src/pages/MyAstroPage.astro
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

Inside of an Astro component, you can also nest components from multiple frameworks.

```astro
// src/pages/MyAstroPage.astro
---
import MyReactSidebar from '../components/MyReactSidebar.jsx';
import MySvelteButton from '../components/MySvelteButton.svelte';
---
<MyReactSidebar>
  <p>Here is a sidebar with some text and a button.</p>
  <MySvelteButton client:load />
</MyReactSidebar>
```

⚠️ *Remember: framework component files themselves (e.g. `.jsx`, `.svelte`) cannot mix multiple frameworks.*

This allows you to build entire "apps" in your preferred JavaScript framework and render them, via a parent component, to an Astro page. This is a convenient pattern to allow related components to share state or context.

Each framework has its own patterns for nesting: `children` props and [render props](https://reactjs.org/docs/render-props.html) for React and Solid; `<slot>` with or without names for Svelte and Vue, for example. 

Note, however, that you can't pass render props or named slots to a framework component from a `.astro` file, even if the framework component supports it. This is due to a limitation in Astro's compiler.

## Can I Hydrate Astro Components?

 If you try to hydrate an Astro component with a `client:` modifier, you will get an error.

[Astro components](/en/core-concepts/astro-components) are HTML-only templating components with no client-side runtime. But, you can use a `<script>` tag in your Astro component template to send JavaScript to the browser that executes in the global scope.


📚 Learn more about [client-side `<scripts>` in Astro components](/en/core-concepts/astro-components#client-side-scripts) 


[mdn-io]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
[mdn-ric]: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
[mdn-mm]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia


