---
layout: ~/layouts/MainLayout.astro
title: Sharing State
i18nReady: false
setup: |
  import Tabs from '../../../components/tabs/Tabs'
  import UIFrameworkTabs from '~/components/tabs/UIFrameworkTabs.astro'
  import LoopingVideo from '~/components/LoopingVideo.astro'
---

When building an Astro website with [islands architecture / partial hydration](/en/core-concepts/partial-hydration/), you may have run into this problem: **I want to share state between my components.**

UI frameworks like React or Vue may encourage ["context" providers](https://reactjs.org/docs/context.html) for other components to consume. But when [partially hydrating components](/en/core-concepts/framework-components/#hydrating-interactive-components) within Astro or Markdown, you can't use these context wrappers.

We'll need a different solution to create shared stores your components can read and write from: [**nanostores**](https://github.com/nanostores/nanostores).

## Why nanostores?

The [nanostores](https://github.com/nanostores/nanostores) library allows you to author stores that any component can interact with. We recommend nanostores because:
- **They're lightweight.** Nanostores ship the bare minimum JS you'll need (less than 1 KB) with zero dependencies.
- **They're framework-agnostic.** This means sharing state between Preact, Svelte, and Vue should be seemless! Astro is built on flexibility, so we love solutions that offer a similar developer experience no matter your preference.

Still, there are a number of alternatives you can explore. These might include:
- [Svelte's built-in stores](https://svelte.dev/tutorial/writable-stores)
- [Solid signals](https://www.solidjs.com/docs/latest) outside of a component context
- [Sending custom browser events](https://developer.mozilla.org/en-US/docs/Web/Events/Creating_and_triggering_events) between components

:::note[Comparisons]

<details>
<summary>**🙋 How do Svelte stores compare to nanostores?**</summary>

**Nanostores and [Svelte stores](https://svelte.dev/tutorial/writable-stores) are very similar!** In fact, [nanostores allow you to use the same `$` shortcut](https://github.com/nanostores/nanostores#svelte) for subscriptions that you might use with Svelte stores.

If you want to avoid third-party libraries, [Svelte stores](https://svelte.dev/tutorial/writable-stores) are a great cross-island communication tool on their own. Still, you might prefer nanostores if a) you like their add-ons for ["objects"](https://github.com/nanostores/nanostores#maps) and [async state](https://github.com/nanostores/nanostores#lazy-stores), or b) you want to communicate between Svelte and other UI frameworks like Preact or Vue.
</details>

<details>
<summary>**🙋 How do Solid signals compare to nanostores?**</summary>

If you've used Solid for a while, you may have tried moving [signals](https://www.solidjs.com/docs/latest#createsignal) or [stores](https://www.solidjs.com/docs/latest#createstore) outside of your components. This is a great way to share state between Solid islands! Try exporting signals from a shared file:

```js
// sharedStore.js
import { createSignal } from 'solid-js';

export const sharedCount = createSignal(0);
```
...and all components importing `sharedCount` will share the same state. Though this works well, you might prefer nanostores if a) you like their add-ons for ["objects"](https://github.com/nanostores/nanostores#maps) and [async state](https://github.com/nanostores/nanostores#lazy-stores), or b) you want to communicate between Solid and other UI frameworks like Preact or Vue.
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

You can jump into the [nanostores usage guide](https://github.com/nanostores/nanostores#guide) from here, or follow along with our example below!

## Usage example - ecommerce cart flyout

Let's say we're building a simple ecommerce interface with three interactive elements:
- An "add to cart" submission form
- A cart flyout to display those added items
- A cart flyout toggle

<LoopingVideo sources={[{ src: '/videos/stores-example.mp4', type: 'video/mp4' }]} />

_[**Try the completed example**](https://github.com/withastro/astro/tree/main/examples/with-nanostores) on your machine or online via Stackblitz._

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

### Using nanostore "atoms"

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
import { isCartOpen } from '../cartStore';

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
import { isCartOpen } from '../cartStore';

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
import { isCartOpen } from '../cartStore';

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
  import { isCartOpen } from '../cartStore';
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
  import { isCartOpen } from '../cartStore';
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
import { isCartOpen } from '../cartStore';

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
import { isCartOpen } from '../cartStore';

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
import { isCartOpen } from '../cartStore';

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
  import { isCartOpen } from '../cartStore';
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
  import { isCartOpen } from '../cartStore';
  import { useStore } from '@nanostores/vue';

  const $isCartOpen = useStore(isCartOpen);
</script>
```
</Fragment>
</UIFrameworkTabs>

### Using nanostore "maps"

:::tip
**[Nanostore `map`s](https://github.com/nanostores/nanostores#maps) are a great choice for objects you write to regularly!** Alongside the standard `get()` and `set()` helpers an `atom` provides, you'll also have a `.setKey()` function to efficiently update individual object keys.
:::

Now, let's keep track of the items inside your cart. To avoid duplicates and keep track of "quantity," we may store your cart as an object with the item's ID as a key. We'll use a [nanostore `map`](https://github.com/nanostores/nanostores#maps) for this.

Let's add a `cartItem` store to our `cartStore.js` from earlier. You can also switch to a TypeScript file to define the shape if you're so inclined.


<Tabs client:visible sharedStore="js-ts">
<Fragment slot="tab.js">JavaScript</Fragment>
<Fragment slot="tab.ts">TypeScript</Fragment>
<Fragment slot="panel.js">
```js
// clientStore.js
import { atom, map } from 'nanostores';

export const isCartOpen = atom(false);

/**
 * @typedef {Object} CartItem
 * @property {string} id
 * @property {string} name
 * @property {string} imageSrc
 * @property {number} quantity
 */

/** @type {import('nanostores').MapStore<Record<string, CartItem>>} */
export const cartItems = map({});

```
</Fragment>
<Fragment slot="panel.ts">
```ts
// clientStore.ts
import { atom, map } from 'nanostores';

export const isCartOpen = atom(false);

export type CartItem = {
  id: string;
  name: string;
  imageSrc: string;
  quantity: number;
}

export const cartItems = map<Record<string, CartItem>>({});
```
</Fragment>
</Tabs>

Now, let's export an `addCartItem` helper for our components to use.
- **If that item doesn't exist in your cart**, add the item with a starting quantity of 1.
- **If that item _does_ already exist**, bump the quantity by 1.

<Tabs client:visible sharedStore="js-ts">
<Fragment slot="tab.js">JavaScript</Fragment>
<Fragment slot="tab.ts">TypeScript</Fragment>
<Fragment slot="panel.js">
```js
// clientStore.js
...
export function addCartItem({ id, name, imageSrc }) {
  const existingEntry = cartItems.get()[id];
  if (existingEntry) {
    cartItems.setKey(id, {
      ...existingEntry,
      quantity: existingEntry.quantity + 1,
    })
  } else {
    cartItems.setKey(
      id,
      { id, name, imageSrc, quantity: 1 }
    );
  }
}
```
</Fragment>
<Fragment slot="panel.ts">
```ts
// clientStore.ts
...
type ItemDisplayInfo = Pick<CartItem, 'id' | 'name' | 'imageSrc'>;
export function addCartItem({ id, name, imageSrc }: ItemDisplayInfo) {
  const existingEntry = cartItems.get()[id];
  if (existingEntry) {
    cartItems.setKey(id, {
      ...existingEntry,
      quantity: existingEntry.quantity + 1,
    });
  } else {
    cartItems.setKey(
      id,
      { id, name, imageSrc, quantity: 1 }
    );
  }
}
```
</Fragment>
</Tabs>

:::note
<details>

<summary>**🙋 Why use `.get()` here instead of a `useStore` helper?**</summary>

You may have noticed we're calling `cartItems.get()` here, instead of grabbing that `useStore` helper from our React / Preact / Solid / Vue examples. This is because **useStore is meant to trigger component re-renders.** In other words, `useStore` should be used whenever the store value is being rendered to the UI. Since we're reading the value when an **event** is triggered (`addToCart` in this case), and we aren't trying to render that value, we don't need `useStore` here.
</details>
:::

With our store in place, we can call this function inside our `AddToCartForm` whenever that form is submitted. We'll also open the cart flyout so you can see a full cart summary.

<UIFrameworkTabs>
<Fragment slot="preact">
```jsx
// src/components/AddToCartForm.jsx
import { addCartItem, isCartOpen } from './cart/store';

export default function AddToCartForm({ children }) {
  // we'll hardcode the item info for simplicity!
  const hardcodedItemInfo = {
    id: 'astronaut-figurine',
    name: 'Astronaut Figurine',
    imageSrc: '/images/astronaut-figurine.png',
  }

  function addToCart(e) {
    e.preventDefault();
    isCartOpen.set(true);
    addCartItem(hardcodedItemInfo);
  }

  return (
    <form onSubmit={addToCart}>
      {children}
    </form>
  )
}
```
</Fragment>
<Fragment slot="react">
```jsx
// src/components/AddToCartForm.jsx
import { addCartItem, isCartOpen } from './cart/store';

export default function AddToCartForm({ children }) {
  // we'll hardcode the item info for simplicity!
  const hardcodedItemInfo = {
    id: 'astronaut-figurine',
    name: 'Astronaut Figurine',
    imageSrc: '/images/astronaut-figurine.png',
  }

  function addToCart(e) {
    e.preventDefault();
    isCartOpen.set(true);
    addCartItem(hardcodedItemInfo);
  }

  return (
    <form onSubmit={addToCart}>
      {children}
    </form>
  )
}
```
</Fragment>
<Fragment slot="solid">
```jsx
// src/components/AddToCartForm.jsx
import { addCartItem, isCartOpen } from './cart/store';

export default function AddToCartForm({ children }) {
  // we'll hardcode the item info for simplicity!
  const hardcodedItemInfo = {
    id: 'astronaut-figurine',
    name: 'Astronaut Figurine',
    imageSrc: '/images/astronaut-figurine.png',
  }

  function addToCart(e) {
    e.preventDefault();
    isCartOpen.set(true);
    addCartItem(hardcodedItemInfo);
  }

  return (
    <form onSubmit={addToCart}>
      {children}
    </form>
  )
}
```
</Fragment>
<Fragment slot="svelte">
```svelte
<!--src/components/AddToCartForm.svelte-->
<form on:submit|preventDefault={addToCart}>
  <slot></slot>
</form>

<script>
  import { addCartItem, isCartOpen } from './cart/store';

  // we'll hardcode the item info for simplicity!
  const hardcodedItemInfo = {
    id: 'astronaut-figurine',
    name: 'Astronaut Figurine',
    imageSrc: '/images/astronaut-figurine.png',
  }

  function addToCart() {
    isCartOpen.set(true);
    addCartItem(hardcodedItemInfo);
  }
</script>
```
</Fragment>
<Fragment slot="vue">
```vue
<!--src/components/AddToCartForm.vue-->
<template>
  <form @submit="addToCart">
    <slot></slot>
  </form>
</template>

<script setup>
  import { addCartItem, isCartOpen } from './cart/store';

  // we'll hardcode the item info for simplicity!
  const hardcodedItemInfo = {
    id: 'astronaut-figurine',
    name: 'Astronaut Figurine',
    imageSrc: '/images/astronaut-figurine.png',
  }

  function addToCart(e) {
    e.preventDefault();
    isCartOpen.set(true);
    addCartItem(hardcodedItemInfo);
  }
</script>
```
</Fragment>
</UIFrameworkTabs>

Finally, we'll render those cart items inside our `CartFlyout`:

<UIFrameworkTabs>
<Fragment slot="preact">
```jsx
// src/components/CartFlyout.jsx
import { useStore } from '@nanostores/preact';
import { isCartOpen, cartItems } from '../cartStore';

export default function CartFlyout() {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);

  return $isCartOpen ? (
    <aside>
      {Object.values($cartItems).length ? (
        <ul>
          {Object.values($cartItems).map(cartItem => (
            <li>
              <img src={cartItem.imageSrc} alt={cartItem.name} />
              <h3>{cartItem.name}</h3>
              <p>Quantity: {cartItem.quantity}</p>
            </li>
          ))}
        </ul>
      ) : <p>Your cart is empty!</p>}
    </aside>
  ) : null;
}
```
</Fragment>
<Fragment slot="react">
```jsx
// src/components/CartFlyout.jsx
import { useStore } from '@nanostores/react';
import { isCartOpen, cartItems } from '../cartStore';

export default function CartFlyout() {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);

  return $isCartOpen ? (
    <aside>
      {Object.values($cartItems).length ? (
        <ul>
          {Object.values($cartItems).map(cartItem => (
            <li>
              <img src={cartItem.imageSrc} alt={cartItem.name} />
              <h3>{cartItem.name}</h3>
              <p>Quantity: {cartItem.quantity}</p>
            </li>
          ))}
        </ul>
      ) : <p>Your cart is empty!</p>}
    </aside>
  ) : null;
}
```
</Fragment>
<Fragment slot="solid">
```jsx
// src/components/CartFlyout.jsx
import { useStore } from '@nanostores/solid';
import { isCartOpen, cartItems } from '../cartStore';

export default function CartFlyout() {
  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);

  return $isCartOpen ? (
    <aside>
      {Object.values($cartItems).length ? (
        <ul>
          {Object.values($cartItems).map(cartItem => (
            <li>
              <img src={cartItem.imageSrc} alt={cartItem.name} />
              <h3>{cartItem.name}</h3>
              <p>Quantity: {cartItem.quantity}</p>
            </li>
          ))}
        </ul>
      ) : <p>Your cart is empty!</p>}
    </aside>
  ) : null;
}
```
</Fragment>
<Fragment slot="svelte">
```svelte
<!--src/components/CartFlyout.svelte-->
<script>
  import { isCartOpen, cartItems } from '../cartStore';
</script>

{#if $isCartOpen}
  {#if Object.values($cartItems).length}
    <aside>
      {#each Object.values($cartItems) as cartItem}
      <li>
        <img src={cartItem.imageSrc} alt={cartItem.name} />
        <h3>{cartItem.name}</h3>
        <p>Quantity: {cartItem.quantity}</p>
      </li>
      {/each}
    </aside>
  {#else}
    <p>Your cart is empty!</p>
  {/if}
{/if}
```
</Fragment>
<Fragment slot="vue">
```vue
<!--src/components/CartFlyout.vue-->
<template>
  <aside v-if="$isCartOpen">
    <ul v-if="Object.values($cartItems).length">
      <li v-for="cartItem in Object.values($cartItems)" v-bind:key="cartItem.name">
        <img :src=cartItem.imageSrc :alt=cartItem.name />
        <h3>{{cartItem.name}}</h3>
        <p>Quantity: {{cartItem.quantity}}</p>
      </li>
    </ul>
    <p v-else>Your cart is empty!</p>
  </aside>
</template>

<script setup>
  import { cartItems, isCartOpen } from '../cartStore';
  import { useStore } from '@nanostores/vue';

  const $isCartOpen = useStore(isCartOpen);
  const $cartItems = useStore(cartItems);
</script>
```
</Fragment>
</UIFrameworkTabs>

Now, you should have a fully interactive ecommerce example with the smallest JS bundle in the galaxy 🚀

[**Try the completed example**](https://github.com/withastro/astro/tree/main/examples/with-nanostores) on your machine or online via Stackblitz!
