---
layout: ~/layouts/MainLayout.astro
title: État de partage
i18nReady: true
setup: |
  import UIFrameworkTabs from '~/components/tabs/UIFrameworkTabs.astro'
  import LoopingVideo from '~/components/LoopingVideo.astro'
  import JavascriptFlavorTabs from '~/components/tabs/JavascriptFlavorTabs.astro'
---

Lors de la construction d'un site Web Astro [architecture Islands / hydratation partielle](/fr/concepts/islands/), Vous avez peut-être rencontré ce problème: **Je veux partager l'état entre mes composants.**

Les frameworks d'interface utilisateur comme React ou Vue peuvent encourager ["context" providers](https://reactjs.org/docs/context.html). Mais quand [composants partiellement hydratés](/fr/core-concepts/framework-components/#hydrating-interactive-components) dans Astro ou Markdown, vous ne pouvez pas utiliser ces emballages de contexte..

Astro recommande une solution différente pour le stockage partagé côté client: [**Nano Stores**](https://github.com/nanostores/nanostores).

## Pourquoi Nano Stores?

La librairie [Nano Stores](https://github.com/nanostores/nanostores) vous permet de créer des magasins avec lesquels n'importe quel composant peut interagir. Nous recommandons Nano Stores car
:
- **Ils sont légers.** Nano Stores expédie le strict minimum JS dont vous aurez besoin (moins de 1 Ko) sans aucune dépendance.
- **Ils sont indépendants du framework.** Cela signifie que le partage d'état entre les frameworks sera transparent ! Astro est basé sur la flexibilité, nous aimons donc les solutions qui offrent une expérience de développeur similaire, quelle que soit votre préférence.

Pourtant, il existe un certain nombre d'alternatives que vous pouvez explorer. Ceux-ci inclus:
- [Svelte's built-in stores](https://svelte.dev/tutorial/writable-stores)
- [Solid signals](https://www.solidjs.com/docs/latest) en dehors d'un contexte de composant
- [Envoi d'événements de navigateur personnalisés](https://developer.mozilla.org/fr/docs/Web/Events/Creating_and_triggering_events) entre les composants

:::note[FAQ]

<details>
<summary>**🙋 Puis-je utiliser Nano Stores dans des fichiers `.astro` ou d'autres composants côté serveur ?
**</summary>

Nano Stores _peut_ être importé, écrit et lu dans les composants côté serveur, **mais nous ne le recommandons pas !** Cela est dû à quelques restrictions:
- L'écriture dans un store à partir d'un fichier `.astro` ou [composant non hydraté](/fr/core-concepts/framework-components/#hydrating-interactive-components) n'affectera _pas_ la valeur reçue par [composants côté client] (/fr/reference/directives-reference/#client-directives).
- Vous ne pouvez pas transmettre un Nano Store en tant que `prop` aux composants côté client.
- Vous ne pouvez pas transmettre un Nano Store en tant que `prop` aux composants côté client.

Si vous comprenez ces restrictions et que vous trouvez toujours un cas d'utilisation, vous pouvez essayer Nano Stores ! N'oubliez pas que les Nano Stores sont conçus pour être réactifs aux changements sur le **client** spécifiquement.

</details>

<details>
<summary>**🙋 How do Svelte stores compare to Nano Stores?**</summary>

**Nano Stores and [Svelte stores](https://svelte.dev/tutorial/writable-stores) are very similar!** In fact, [nanostores allow you to use the same `$` shortcut](https://github.com/nanostores/nanostores#svelte) for subscriptions that you might use with Svelte stores.

If you want to avoid third-party libraries, [Svelte stores](https://svelte.dev/tutorial/writable-stores) are a great cross-island communication tool on their own. Still, you might prefer Nano Stores if a) you like their add-ons for ["objects"](https://github.com/nanostores/nanostores#maps) and [async state](https://github.com/nanostores/nanostores#lazy-stores), or b) you want to communicate between Svelte and other UI frameworks like Preact or Vue.
</details>

<details>
<summary>**🙋 How do Solid signals compare to Nano Stores?**</summary>

If you've used Solid for a while, you may have tried moving [signals](https://www.solidjs.com/docs/latest#createsignal) or [stores](https://www.solidjs.com/docs/latest#createstore) outside of your components. This is a great way to share state between Solid islands! Try exporting signals from a shared file:

```js
// sharedStore.js
import { createSignal } from 'solid-js';

export const sharedCount = createSignal(0);
```
...and all components importing `sharedCount` will share the same state. Though this works well, you might prefer Nano Stores if a) you like their add-ons for ["objects"](https://github.com/nanostores/nanostores#maps) and [async state](https://github.com/nanostores/nanostores#lazy-stores), or b) you want to communicate between Solid and other UI frameworks like Preact or Vue.
</details>
:::

## Installing Nano Stores

To get started, install Nano Stores alongside their helper package for your favorite UI framework:

<UIFrameworkTabs>
  <Fragment slot="preact">
  ```shell
  npm install nanostores @nanostores/preact
  ```
  </Fragment>
  <Fragment slot="react">
  ```shell
  npm install nanostores @nanostores/react
  ```
  </Fragment>
  <Fragment slot="solid">
  ```shell
  npm install nanostores @nanostores/solid
  ```
  </Fragment>
  <Fragment slot="svelte">
  ```shell
  npm install nanostores
  ```
  :::note
  No helper package here! Nano Stores can be used like standard Svelte stores.
  :::
  </Fragment>
  <Fragment slot="vue">
  ```shell
  npm install nanostores @nanostores/vue
  ```
  </Fragment>
</UIFrameworkTabs>

You can jump into the [Nano Stores usage guide](https://github.com/nanostores/nanostores#guide) from here, or follow along with our example below!

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
    <!-- ... -->
    </AddToCartForm>
  </main>
  <CartFlyout client:load />
</body>
</html>
```

### Using "atoms"

Let's start by opening our `CartFlyout` whenever `CartFlyoutToggle` is clicked. 

First, create a new JS  or TS file to contain our store. We'll use an ["atom"](https://github.com/nanostores/nanostores#atoms) for this:

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

### Using "maps"

:::tip
**[Maps](https://github.com/nanostores/nanostores#maps) are a great choice for objects you write to regularly!** Alongside the standard `get()` and `set()` helpers an `atom` provides, you'll also have a `.setKey()` function to efficiently update individual object keys.
:::

Now, let's keep track of the items inside your cart. To avoid duplicates and keep track of "quantity," we can store your cart as an object with the item's ID as a key. We'll use a [Map](https://github.com/nanostores/nanostores#maps) for this.

Let's add a `cartItem` store to our `cartStore.js` from earlier. You can also switch to a TypeScript file to define the shape if you're so inclined.

<JavascriptFlavorTabs>
  <Fragment slot="js">
  ```js
  // src/cartStore.js
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
  <Fragment slot="ts">
  ```ts
  // src/cartStore.ts
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
</JavascriptFlavorTabs>

Now, let's export an `addCartItem` helper for our components to use.
- **If that item doesn't exist in your cart**, add the item with a starting quantity of 1.
- **If that item _does_ already exist**, bump the quantity by 1.

<JavascriptFlavorTabs>
  <Fragment slot="js">
  ```js
  // src/cartStore.js
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
  <Fragment slot="ts">
  ```ts
  // src/cartStore.ts
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
</JavascriptFlavorTabs>

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
import { addCartItem, isCartOpen } from '../cartStore';

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
import { addCartItem, isCartOpen } from '../cartStore';

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
import { addCartItem, isCartOpen } from '../cartStore';

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
  import { addCartItem, isCartOpen } from '../cartStore';

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
  import { addCartItem, isCartOpen } from '../cartStore';

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
