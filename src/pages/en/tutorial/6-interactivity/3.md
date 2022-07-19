---
layout: ~/layouts/MainLayout.astro
title: Using a UI Framework
---

## Goals

BY THE END OF THIS SECTION YOU WILL HAVE:

- used the `astro add` command to add an official integration (Preact) to your site

- created two UI Framework components (using Preact) and rendered them on an Astro page

- used different `client:directives` to customize the JavaScript hydration of your framework components, and renered a component with no directive at all to compare the output

Astro components are **templating components only**, so they require `<script>` tags to execute JavaScript in the browser. 

But, Astro can individually and selectively render other UI framework components, like the one above, and execute **their** JavaScript in its own island, with a `client:directive` component attribute.

## Add a UI Framework Component

1. Quit the dev server (`CTRL + C`) to have access to the terminal. Then, type the following command to automatically add the ability to use Preact components in your Astro project:
```bash
npx astro add preact
```

2. Follow the command line instructions to confirm (Y) two times -- once to add Preact to your `astro.config.mjs` file configuration, and then once to install the package itself.

3. Create a new file in `src/components/` named `Greeting.jsx`

Note the `.jsx` file extension used by Preact. This file will be written in JSX, not Astro syntax. You can even add existing `.jsx` files from other projects directly in to your Astro project (though, some libraries and external packages may not be supported).

## Preact Greeting Banner

This component will randomly select a greeting from an array received as props, and render it in a welcome message.

```jsx
import { h } from 'preact'

export default function Banner({messages}) {
    
    const greeting = messages[(Math.floor(Math.random() * 4))]
    
    return (
        <h3>{greeting}! Thank you for visiting!</h3>
    )
}
```
2. Import and use this component in your component template on your Home page `index.astro`:

```diff
---
  import BaseLayout from '../layouts/BaseLayout.astro';
+ import Greeting from '../components/Greeting.jsx';
---
  <BaseLayout title="Home Page">
	  <h2>My awesome blog subtitle</h2>
+ 	<Greeting messages={["Hi", "Hello", "Howdy", "Hola"]} />
  </BaseLayout>

```

Notice that this component, like many of our Astro components, *uses* JavaScript to render HTML. But, it doesn't necessarily **need** any JavaScript sent to the client because your user will not interact with it. 

To generate a single random message chosen every time your site builds, this Preact component functions exactly like an Astro component.

BUT, we **can** add a `client:load` attribute on our component which will cause the component to execute, and the message to update, on every page rerendering, just like it would do in a typical JavaScript SPA (single page application).

3. Add a second `<Greeting />` component with the `client:load` directive.

```diff
---
  import BaseLayout from '../layouts/BaseLayout.astro';
  import Greeting from '../components/Greeting.jsx';
---
  <BaseLayout title="Home Page">
	  <h2>My awesome blog subtitle</h2>
    <Greeting messages={["Hi", "Hello", "Howdy", "Hola"]} />
+ 	<Greeting client:load messages={["Hi", "Hello", "Howdy", "Hola"]} />
  </BaseLayout>
```
To see the difference in behaviour, we will need to view your built site, live on the web.

4. Commit your current progress to GitHub, and wait for Netlify to automatically build and republish your site to the web.

5. Visit your live website at your `netlify.app` URL. Refresh the page several times and compare the two greeting messages. 

#### Analyze the Pattern

Consider an Astro component with the following code:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import AstroBanner from '../components/AstroBanner.astro';
import PreactBanner from '../components/PreactBanner.jxs';
import SvelteCounter from '../components/SvelteCounter.svelte';
---
<BaseLayout>
  <AstroBanner />
  <PreactBanner />
  <PreactBanner client:load />
  <SvelteCounter />
  <SvelteCounter client:visible />
</BaseLayout>
```

1. Which of the five components will be **hydrated**, sending JavaScript to the client. _(3, 5)_

2. In what way(s) will the two `<PreactBanner />` components be the same? In what way(s) will they be different? _(Same: render the same HTML elements/look the same; both will load immediately Different: one will be generated at build time and never change; one will reload on every page rerender)_

3. If you didn't see the code, only the live published page, how would you tell which `<SvelteCounter />` component used a `client:directive`? _(Try clicking the buttons, and see which one works)_


## Preact Quote Generator

This component is interactive, written using Preact using popular hooks like `useState()` and `useEffect()`. It fetches a random quotation from an external API on page refresh, and also in response to a button click.

1. Copy the code below and paste it into a new file named `Quote.jsx` in `src/components`:

```jsx
import { h } from 'preact';
import { useState, useEffect } from "preact/hooks";

export default function Quotable() {
  const [data, setData] = useState(null);

  async function updateQuote() {
      const response = await fetch("https://api.quotable.io/random");
      const data = await response.json();
      setData(data);
  }

  useEffect(() => {
    updateQuote();
  }, []);

  if (!data) return null;

  return (
    <div>
      <blockquote >
        <p>{data.content}</p>
        <p> -- {data.author}</p>
      </blockquote>
      <button onClick={updateQuote}>New Quote</button>
    </div>
  );
}
```

2. Import and add this component to your Home page at `index.astro`.

```diff
---
  import BaseLayout from '../layouts/BaseLayout.astro';
  import Greeting from '../components/Greeting.jsx';
+ import Quote from '../components/Quote.jsx';
---
  <BaseLayout title="Home Page">
	  <h2>My awesome blog subtitle</h2>
    <Greeting messages={["Hi", "Hello", "Howdy", "Hola"]} />
    <Greeting client: load messages={["Hi", "Hello", "Howdy", "Hola"]} />
+ 	<Quote client:only="preact" />
  </BaseLayout>

```

3. Check your browser preview at `localhost:3000` and verify that your component automatically fetches a random quotation on page load, and in response to clicking the "New Quote" button.

4. Commit your changes to GitHub and wait for Netlify to automatically build and republish your site to the web.

5. Visit your live website at your `netlify.app` URL. Refresh the page several times and click the "New Quote" button and verify that both events fetch a new random quotation from the API.


## Before You Go

### Test your knowledge

### Checklist for moving on
