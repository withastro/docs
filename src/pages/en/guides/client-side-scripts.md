---
title: Scripts and Event Handling
description: How to add client-side interactivity to Astro components using native browser JavaScript APIs.
layout: ~/layouts/MainLayout.astro
i18nReady: false
---

You can add interactivity to your Astro components without [using a UI framework](/en/core-concepts/framework-components/) like React, Svelte, Vue, etc. using standard HTML `<script>` tags. This allows you to send JavaScript to run in the browser and add functionality to your Astro components.

## Using `<script>` in Astro

In `.astro` files, you can add client-side JavaScript by adding one (or more) `<script>` tags.

In this example, adding the `<Hello />` component to a page will log a message to the browser console.

```astro title="src/components/Hello.astro"
<h1>Welcome, world!</h1>

<script>
  console.log('Welcome, browser console!');
</script>
```

### Script bundling

By default, `<script>` tags are processed by Astro.

- Any imports will be bundled, allowing you to import local files or Node modules.
- The processed script will be injected into your page’s `<head>` with [`type="module"`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules).
- TypeScript is fully supported, including importing TypeScript files.
- If your component is used several times on a page, the script will only be included once.

```astro title="src/components/Example.astro"
<script>
  // Processed! Bundled! TypeScript-supported!
  // ESM imports work, even to npm packages.
</script>
```

To avoid bundling the script, you can use the `is:inline` directive.

```astro title="src/components/InlineScript.astro" "is:inline"
<script is:inline>
  // Will be rendered into the HTML exactly as written!
  // ESM imports will not be resolved relative to the file.
</script>
```

:::note
Adding `type="module"` or any other attribute to a `<script>` tag will disable Astro's default bundling behavior, treating the tag as if it had an `is:inline` directive.
:::

📚 See our [directives reference](/en/reference/directives-reference/#script--style-directives) page for more information about the directives available on `<script>` tags.

### Script loading

You may want to write your scripts as separate `.js`/`.ts` files or need to reference an external script on another server. You can do this by referencing these in a `<script>` tag’s `src` attribute.

#### Import local scripts

**When to use this:** If your script lives inside of `src/`.

Astro will build, optimize, and add these scripts to the page for you, following its [script bundling rules](#script-bundling).

```astro title="src/components/LocalScripts.astro"
<!-- relative path to script in `src/` -->
<script src="./local-script.js"></script>

<!-- also works for local TypeScript files -->
<script src="./script-with-types.ts"></script>
```

#### Load external scripts

**When to use this:** If your JavaScript file lives inside of `public/` or on a CDN.

To load scripts outside of your project's `src/` folder, include the `is:inline` directive. This approach skips the JavaScript processing, bundling, and optimizations that are provided by Astro when you import scripts as described above.

```astro title="src/components/ExternalScripts.astro" "is:inline"
<!-- absolute path to a script at `public/my-script.js` -->
<script is:inline src="/my-script.js"></script>

<!-- full URL to a script on a remote server -->
<script is:inline src="https://my-analytics.com/script.js"></script>
```

## Common script patterns

### Handle `onclick` and other events

Some UI frameworks use custom syntax for event handling like `onclick={...}` (React/Preact) or `@click="..."` (Vue). Astro components follow web standards and recommend using [`addEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener) in a `<script>` tag to handle user interactions.

```astro title="src/components/AlertButton.astro"
<button data-alert>Click me!</button>

<script>
  // Find all buttons with the `data-alert` attribute on the page.
  const buttons = document.querySelectorAll('button[data-alert]');

  // Handle clicks on each button.
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      alert('Button was clicked!');
    });
  });
</script>
```

:::note
Because this script will run once even if we add many instances of `<AlertButton />` to a page, we use `querySelectorAll` to get all instances of our component and add listeners to each one instead of using `querySelector`, which would only return the first button it found.
:::

### Web components with custom elements

[Custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) provide a standard API that allows you to define your own HTML elements with custom behavior. Defining a custom element in a `.astro` component can be a good way to build interactivity without reaching for a UI framework library.

In this example, we define a new `<astro-heart>` HTML element that tracks how many times you click the heart button and updates the `<span>` with the latest count.

```astro title="src/components/AstroHeart.astro"
<!-- Wrap the component elements in our custom element “astro-heart”. -->
<astro-heart>
  <button aria-label="Heart">💜</button> × <span>0</span>
</astro-heart>

<script>
  // Define the behaviour for our new type of HTML element.
  class AstroHeart extends HTMLElement {
    constructor() {
			super();
      let count = 0;

      const heartButton = this.querySelector('button');
      const countSpan = this.querySelector('span');

      // Each time the button is clicked, update the count.
			heartButton.addEventListener('click', () => {
        count++;
        countSpan.textContent = count;
      });
		}
  }

  // Tell the browser to use our AstroHeart class for <astro-heart> elements.
  customElements.define('astro-heart', AstroHeart);
</script>
```

This is similar to how you might handle user input without a custom element. But, instead of using `document.querySelector()`, we used `this.querySelector()` to get DOM elements. `this.querySelector()` only searches within the current custom element instance, so it’s easier to work with the children of one component instance at a time. Because the browser understands that this code is for a custom element, it will automatically run it for you each time it finds `<astro-heart>` on the page.

📚 You can learn more about custom elements in [web.dev’s Reusable Web Components guide](https://web.dev/custom-elements-v1/) and [MDN’s introduction to custom elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements).

### Pass frontmatter variables to scripts

In Astro components, the code in [the frontmatter](/en/core-concepts/astro-components/#the-component-script) between the `---` fences runs on the server and is not available in the browser. To send variables from the server to the client, we need a way to store our variables and then read them when JavaScript runs in the browser.

One way to do this is to use [`data-*` attributes](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes) to store the value of variables in your HTML output. Scripts, including custom elements, can then read these once your HTML loads in the browser.

In this example component, a `message` prop is stored in a `data-message` attribute. Data attributes are available in JavaScript using an element’s `dataset` property, so the custom element logic can read `this.dataset.message` and get the value of the prop in the browser.

```astro title="src/components/AstroGreet.astro" {2} /data-message={.+}/ "this.dataset.message"
---
const { message = 'Welcome, world!' } = Astro.props;
---

<!-- Store the message prop as a data attribute. -->
<astro-greet data-message={message}>
  <button>Say hi!</button>
</astro-greet>

<script>
  class AstroGreet extends HTMLElement {
    constructor() {
			super();

      // Read the message from the data attribute.
      const message = this.dataset.message;
      const button = this.querySelector('button');
      button.addEventListener('click', () => {
        alert(message);
      });
		}
  }

  customElements.define('astro-greet', AstroGreet);
</script>
```

Now we can use our component multiple times and be greeted by a different message for each one.

```astro title="src/pages/example.astro"
---
import AstroGreet from '../components/AstroGreet.astro';
---

<!-- Uses the default message: “Welcome, world!” -->
<AstroGreet />

<!-- Use custom messages passed as a props. -->
<AstroGreet message="Lovely day to build components!" />
<AstroGreet message="Glad you made it! 👋" />
```

:::tip[Did you know?]
This is actually what Astro does behind the scenes when you pass props to a component written using a UI framework like React! For components with a `client:*` directive, it creates an `<astro-island>` custom element with a `props` attribute that stores your server-side props in the HTML output.
:::
