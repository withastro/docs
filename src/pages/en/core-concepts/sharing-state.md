---
layout: ~/layouts/MainLayout.astro
title: Sharing State
i18nReady: false
setup: |
  import UIFrameworkTabs from '~/components/tabs/UIFrameworkTabs.astro'
  import LoopingVideo from '~/components/LoopingVideo.astro'
---

> We have islands, but we need boats. ~ [@bholmesdev](https://twitter.com/BHolmesDev)

When building an Astro website with [islands architecture / partial hydration](/en/core-concepts/partial-hydration/), you may have run into this problem: **I want to share state between my components.**

"Typical" UI frameworks like React, Vue, or Svelte may encourage ["context" providers](https://reactjs.org/docs/context.html) for other components to consume. But when [partially hydrating components](/en/core-concepts/framework-components/#hydrating-interactive-components) within Astro or Markdown, you cannot use these context wrappers 😳

We'll need a different solution to create shared stores your components can read and write from: [**nanostores**](https://github.com/nanostores/nanostores).

## Why nanostores?

The [nanostores](https://github.com/nanostores/nanostores) library allows you to author stores that any component can interact with. We recommend nanostores because:
- **They're lightweight.** Nanostores ship the bare minimum JS you'll need (less than 1 KB) with zero dependencies.
- **They're framework-agnostic.** This means sharing state between Preact, Svelte, and Vue should be seemless! Astro is built on flexibility, so we love solutions that offer a similar developer experience no matter your preference.

Still, there are a number of alternatives you can explore. These might include:
- [React Recoil](https://recoiljs.org/)
- [Svelte's built-in stores](https://svelte.dev/tutorial/writable-stores)
- [Sending custom browser events](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events) between components

:::note

<details>
<summary>**🙋 How do Svelte stores compare to nanostores?**</summary>

**Nanostores and [Svelte stores](https://svelte.dev/tutorial/writable-stores) are very similar!** In fact, [nanostores allow you to use the same `$` shortcut](https://github.com/nanostores/nanostores#svelte) for subscriptions that you might use with Svelte stores.

If you want to avoid third party libraries, [Svelte stores](https://svelte.dev/tutorial/writable-stores) are a great cross-island communication tool on their own. Still, you might prefer nanostores if a) you like their add-ons for ["objects"](https://github.com/nanostores/nanostores#maps) and [async state](https://github.com/nanostores/nanostores#lazy-stores), or b) you want to communicate between Svelte and other UI frameworks like Preact or Vue.
</details>

:::

## Installing nanostores

To get started, install nanostores alongside their helper package for your favorite UI framework:

<UIFrameworkTabs>
  <Fragment slot="preact">
  ```shell
  npm i nanostores @nanostores/preact
  ```
  </Fragment>
  <Fragment slot="react">
  ```shell
  npm i nanostores @nanostores/react
  ```
  </Fragment>
  <Fragment slot="solid">
  ```shell
  npm i nanostores @nanostores/solid
  ```
  </Fragment>
  <Fragment slot="svelte">
  ```shell
  npm i nanostores
  ```
  :::note
  No helper package here! Nanostores can be used like standard Svelte stores.
  :::
  </Fragment>
  <Fragment slot="vue">
  ```shell
  npm i nanostores @nanostores/vue
  ```
  </Fragment>
</UIFrameworkTabs>

You can jump into the [nanostore usage guide](https://github.com/nanostores/nanostores#guide) from here, or follow along with our example below!

## Usage example - ecommerce cart flyout

Let's say we're building a simple ecommerce interface with three interactive elements:
- An "add to cart" submission form
- A cart flyout to display those added items
- A cart flyout toggle

<LoopingVideo sources={[{ src: '/videos/stores-example.mp4', type: 'video/mp4' }]} />

Your base Astro file may look like this:

```astro
---
// Example: src/pages/index.astro
import CartFlyoutToggle from '../components/CartFlyoutToggle';
import CartFlyout from '../components/CartFlyout';
import AddToCartForm from '../components/AddToCartForm';
---

<!DOCTYPE html>
<html lang="en">
<head>...</head>
<body>
  <header>
    <nav>
      <a href="/">Astro storefront</a>
      <CartFlyoutToggle client:load />
    </nav>
  </header>
  <main>
    <AddToCartForm client:load>
    ...
    </AddToCartForm>
  </main>
  <CartFlyout client:load />
</body>
</html>
```

Let's start by opening our `CartFlyout` whenever `CartFlyoutToggle` is clicked. First, create a new JS  or TS file to contain our store. We'll use a [nanostore "atom"](https://github.com/nanostores/nanostores#atoms) for this:

```js
// src/cartStore.js
import { atom } from 'nanostores';

export const isCartOpen = atom(false);
```

Now, we can import this store into any file that needs to read or write. We'll start by wiring up our `CartFlyoutToggle`:

<UIFrameworkTabs>
<Fragment slot="preact">
```jsx
// src/components/CartFlyoutToggle.jsx
import { useStore } from '@nanostores/preact';
import { isCartOpen } from '../store';

export default function CartButton() {
  // read the store value with the `useStore` hook
  const $isCartOpen = useStore(isCartOpen);
  // write to the imported store using `.set`
  return (
    <button onClick={() => isCartOpen.set(!$isCartOpen)}>Cart</button>
  )
}
```
</Fragment>
<Fragment slot="react">
```jsx
// src/components/CartFlyoutToggle.jsx
import { useStore } from '@nanostores/react';
import { isCartOpen } from '../store';

export default function CartButton() {
  // read the store value with the `useStore` hook
  const $isCartOpen = useStore(isCartOpen);
  // write to the imported store using `.set`
  return (
    <button onClick={() => isCartOpen.set(!$isCartOpen)}>Cart</button>
  )
}
```
</Fragment>
<Fragment slot="solid">
```jsx
// src/components/CartFlyoutToggle.jsx
import { useStore } from '@nanostores/solid';
import { isCartOpen } from '../store';

export default function CartButton() {
  // read the store value with the `useStore` hook
  const $isCartOpen = useStore(isCartOpen);
  // write to the imported store using `.set`
  return (
    <button onClick={() => isCartOpen.set(!$isCartOpen)}>Cart</button>
  )
}
```
</Fragment>
<Fragment slot="svelte">
```svelte
<!--src/components/CartFlyoutToggle.svelte-->
<script>
  import { isCartOpen } from '../store';
</script>

<!--use "$" to read the store value-->
<button on:click={() => isCartOpen.set(!$isCartOpen)}>Cart</button>
```
</Fragment>
<Fragment slot="vue">
```vue
<!--src/components/CartFlyoutToggle.vue-->
<template>
  <!--write to the imported store using `.set`-->
  <button @click="isCartOpen.set(!$isCartOpen)">Cart</button>
</template>

<script setup>
  import { isCartOpen } from '../store';
  import { useStore } from '@nanostores/vue';
  
  // read the store value with the `useStore` hook
  const $isCartOpen = useStore(isCartOpen);
</script>
```
</Fragment>
</UIFrameworkTabs>

Then, we can read `isCartOpen` from our `CartFlyout` component:

<UIFrameworkTabs>
<Fragment slot="preact">
```jsx
// src/components/CartFlyout.jsx
import { useStore } from '@nanostores/preact';
import { isCartOpen } from '../store';

export default function CartFlyout() {
  const $isCartOpen = useStore(isCartOpen);

  return $isCartOpen ? <aside>...</aside> : null;
}
```
</Fragment>
<Fragment slot="react">
```jsx
// src/components/CartFlyout.jsx
import { useStore } from '@nanostores/react';
import { isCartOpen } from '../store';

export default function CartFlyout() {
  const $isCartOpen = useStore(isCartOpen);

  return $isCartOpen ? <aside>...</aside> : null;
}
```
</Fragment>
<Fragment slot="solid">
```jsx
// src/components/CartFlyout.jsx
import { useStore } from '@nanostores/solid';
import { isCartOpen } from '../store';

export default function CartFlyout() {
  const $isCartOpen = useStore(isCartOpen);

  return $isCartOpen ? <aside>...</aside> : null;
}
```
</Fragment>
<Fragment slot="svelte">
```svelte
<!--src/components/CartFlyout.svelte-->
<script>
  import { isCartOpen } from '../store';
</script>

{#if $isCartOpen}
<aside>...</aside>
{/if}
```
</Fragment>
<Fragment slot="vue">
```vue
<!--src/components/CartFlyout.vue-->
<template>
  <aside v-if="$isCartOpen">...</aside>
</template>

<script setup>
  import { isCartOpen } from '../store';
  import { useStore } from '@nanostores/vue';

  const $isCartOpen = useStore(isCartOpen);
</script>
```
</Fragment>
</UIFrameworkTabs>
