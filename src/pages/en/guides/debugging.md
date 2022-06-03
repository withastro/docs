---
layout: ~/layouts/MainLayout.astro
title: Troubleshooting
description: Need help? Stuck on something? We've got you covered.
---

Astro provides several different tools to help you troubleshoot and debug your code.

## Common Error Messages

Here are some common error messages you might see in the terminal, what they might mean, and what to do about them.

### Transform failed with X error

This message often appears due to a current limitation in Astro requiring your import and export statements to be at the top of your `.astro` file.

**Solution**: Write your imports and exports at the top of your component script.

**Status**: Current limitation; fix is being worked on.

💡 Not sure that this is your problem? Check to see if anyone else has reported [this issue](https://github.com/withastro/astro/issues?q=is%3Aissue+is%3Aopen+Transform+failed+with+*+error)!

### Cannot use import statement outside a module

In Astro components, `<script>` tags are hoisted and loaded as [JS modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) by default. If you have included the [`is:inline` directive](/en/reference/directives-reference/#isinline) or any other attribute in your tag, this default behavior is removed.

**Solution**: If you have added any atributes to your `<script>` tag, you must also add the `type="module"` attribute to be able to use import statements.

**Status**: Expected Astro behavior, as intended.

💡 Not sure that this is your problem? Check to see if anyone else has reported [this issue](https://github.com/withastro/astro/issues?q=is%3Aissue+is%3Aopen+Cannot+use+import+statement)!

### Unable to render Component

This is indicates an error in a component you have imported and are using in your Astro template. 

**Solution**: Check the appropriate documentation for your [Astro](/en/core-concepts/astro-components/) or [UI framework](/en/core-concepts/framework-components/) component. Consider opening an Astro starter template from [astro.new](https://astro.new) and troubleshooting just your component in a minimal Astro project. 

> This can also be caused by attempting to access the `window` or `document` object at render time. 
 
By default, Astro will render your component [isomorphically](https://en.wikipedia.org/wiki/Isomorphic_JavaScript), meaning it runs on the server where the browser runtime is not available. You can disable this pre-render step using [the `client:only` directive](/en/reference/directives-reference/#clientonly).

**Solution**: Try to access those objects after rendering (ex: [`useEffect()`](https://reactjs.org/docs/hooks-reference.html#useeffect) in React or [`onMounted()`](https://vuejs.org/api/composition-api-lifecycle.html#onmounted) in Vue and Svelte)

**Status**: Expected Astro behavior, as intended.

💡 Not sure that this is your problem? Check to see if anyone else has reported [this issue](https://github.com/withastro/astro/issues?q=is%3Aissue+is%3Aopen+Unable+to+render+Component)!


### Expected a default export

This error can be thrown when trying to import or render an invalid component, or one that is not working properly. (This particular message occurs because of the way importing a UI component works in Astro.)

**Solution**: Try looking for errors in any component you are importing and rendering, and make sure it's working correctly. Consider opening an Astro starter template from [astro.new](https://astro.new) and troubleshooting just your component in a minimal Astro project. 

**Status**: Expected Astro behavior, as intended.

## Common "Gotchas" in Astro

### My component is not rendering

First, check to see that you have **imported the component** in your [`.astro` component script](/en/core-concepts/astro-components/#the-component-script) or [`.md` frontmatter](/en/guides/markdown-content/#using-components-in-markdown).

Then check your import statement:

- Is your import linking to the wrong place? (Check your import path.)

- Does your import have the same name as the imported component? (Check your component name and that it [follows the `.astro` syntax](/en/comparing-astro-vs-other-tools/#astro-vs-jsx).)

- Have you included the extension in the import? (Check that your imported file contains an extension. e.g. `.astro`, `.md`, `.jsx`, `.vue`)

### My component renders on the page, but is not responding to user interaction

If your component is rendering (see above) but is not interactive, then you may be missing a [`client:*` directive](/en/reference/directives-reference/#client-directives) to hydrate your component.

By default, a [UI Framework component is not hydrated in the client](/en/core-concepts/framework-components/#hydrating-interactive-components). If no `client:*` directive is provided, its HTML is rendered onto the page without JavaScript.

Note: [Astro components](/en/core-concepts/astro-components/) are HTML-only templating components with no client-side runtime. But, you can use a `<script>` tag in your Astro component template to send JavaScript to the browser that executes in the global scope.

### Cannot find package 'X'

See [Astro's integration guide](/en/guides/integrations-guide/) for instructions on adding framework renderers, CSS tools and other packages to Astro.

You may need to install peer dependencies for some integrations. If you see a “missing peer dependencies” warning, you can follow the instructions for  [handling dependencies](/en/guides/integrations-guide/#handling-integration-dependencies).

### `Astro.glob()`'s "No matches found"

When using `Astro.glob()` to import files, be sure to use the correct glob syntax that will match all the files you need. 

For example, use `src/components/**/*.js` to import both of the following files: 
- `src/components/MyComponent.js` 
- `src/components/includes/MyOtherComponent.js`

> Note that dynamic variables and string interpolation in `Astro.glob()` is not supported. 

This is not a bug in Astro. It is due to a limitation of [Vite's `import.meta.glob()` function](https://vitejs.dev/guide/features.html#glob-import) which only supports static string literals.

A common workaround is to instead import a larger set of files that includes all the files you need using `Astro.glob()`, then filter them:

```astro
---
// src/components/featured.astro
const { postSlug } = Astro.props
const pathToMyFeaturedPost = `src/pages/blog/${postSlug}.md`

const posts = await Astro.glob('../pages/blog/*.md');
const myFeaturedPost = posts.find(post => post.file.indexOf(pathToMyFeaturedPost) !== -1);
---

<p>
    Take a look at my favorite post, <a href={myFeaturedPost.url}>{myFeaturedPost.frontmatter.title}</a>!
</p>
```

## Tips and tricks

### Debugging with `console.log()`

`console.log()` is a simple-but-popular method of debugging your Astro code. Where you write your `console.log` statment will determine where your debugging output is printed.

#### Frontmatter

A `console.log()` statement in Astro frontmatter will always output to the **terminal** running the Astro CLI. This is because Astro runs on the server, and never in the browser.

```astro
---
const sum = (a, b) => a + b;

// Example: Outputs "4" to the CLI terminal
console.log(sum(2, 2));
---
```

#### JS Scripts

Code that is written or imported inside of an Astro `<script>` tag is run in the browser. Any `console.log()` statements or other debug output will be  printed to the console in your browser.

### Debugging Framework Components

Framework components (like React and Svelte) are unique: They render server-side by default, meaning that `console.log()` debug output will be visible in the terminal. However, they can also be hydrated for the browser, which may cause your debug logs to also appear in the browser.

This can be useful for debugging differences between the SSR output and the hydrated components in the browser.

### Astro `<Debug />` Component

To help you debug your Astro components, Astro provides a built-in [`<Debug />`](/en/reference/api-reference/#debug-) component which renders any value directly into your component HTML template. This is useful for quick debugging in the browser without having to flip back-and-forth between your terminal and your browser.

```astro
---
import { Debug } from 'astro/components';
const sum = (a, b) => a + b;
---

<!-- Example: Outputs {answer: 6} to the browser -->
<Debug answer={sum(2, 4)} />
```

The Debug component supports a variety of syntax options for even more flexible and concise debugging:

```astro
---
import { Debug } from 'astro/components';
const sum = (a, b) => a + b;
const answer = sum(2, 4);
---
<!-- Example: All three examples are equivalent. -->
<Debug answer={sum(2, 4)} />
<Debug {{answer: sum(2, 4)}} />
<Debug {answer} />
```

## Need more?

Come and chat with us on [Discord](https://astro.build/chat) and explain your issue in the `#support-threads` channel. We’re always happy to help!
