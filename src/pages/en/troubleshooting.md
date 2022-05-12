---
layout: ~/layouts/MainLayout.astro
title: Troubleshooting
description: Need help? Stuck on something? Got you covered.
---

## Common errors

### Transform failed with X error

In the majority of cases, this is due to your imports not being at the top of your `.astro` file, check if they are.

If it's not the case, [ask us on discord](#need-more)

💡 Not sure? Check if [you're not the only one](https://github.com/withastro/astro/issues?q=is%3Aissue+is%3Aopen+Transform+failed+with+*+error) with this issue!

### Cannot use import statement outside a module

In Astro components, `<script>` tags are by default loaded as [JS modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules). Be careful, it's this behavior will be disabled if `type="module"` or any other attribute is added to the tag. Same as applying the [`is:inline` directive](/en/reference/directives-reference#isinline).

You choose to set the `is:inline` directive don't forget to also add the `type="module"` attribute to the script to be able to use import statements.

💡 Not sure? Check if [you're not the only one](https://github.com/withastro/astro/issues?q=is%3Aissue+is%3Aopen+Cannot+use+import+statement) with this issue!

### Unable to render Component

This is usually due to errors in your component, check the corresponding documentation for your component and make sure it's working correctly.

> This can also be due from accessing the `window` or `document` object at render time. By default, Astro will render your component outside of the browser (exept for the `client:only` directive). Try to access those objects after rendering (ex: [`useEffect()`](https://reactjs.org/docs/hooks-reference.html#useeffect) in react or [`onMounted()`](https://vuejs.org/api/composition-api-lifecycle.html#onmounted) in vue and svelte)

💡 Not sure? Check if [you're not the only one](https://github.com/withastro/astro/issues?q=is%3Aissue+is%3Aopen+Unable+to+render+Component) with this issue!

## Common mistakes

### My component is not rendering

Check if you forgot to import it in your [`.astro` component script](/en/core-concepts/astro-components/#the-component-script) or [`.md` frontmatter](/en/guides/markdown-content/#using-components-in-markdown). If it's not the case, try the following:

- Is your import linking to the wrong place ? (check your import path)
- Has your import the same name as the components ? (check your component name and [following the `.astro` syntax](/en/comparing-astro-vs-other-tools/#astro-vs-jsx))
- Included the extension in the import ? (ex: `.astro`, `.md`, `.jsx`, `.vue`)

### My component is not working

It could be due to a few reasons:

- You forgot to add a [`client:*` directive](/en/reference/directives-reference/#client-directives) to your component.
- Have you tried to check if it comes from one of the above section ?

### Cannot find package 'X'

Managing packages can be a bit of a challenge. Especially when you're using [Astro's integrations](/en/guides/integrations-guide/).

- Check if the package need to be installed, if an Astro integration was installed manually, you need to keep an eye out for any “missing peer dependencies” warnings. Follow instructions [here](/en/guides/integrations-guide/#handling-integration-dependencies).

## Tips and tricks

### Debugging

If you're having trouble with solving your issue, you can take a look at the [debugging guide](/en/guides/debugging/) for more tools and tips to help you.

## Need more?

Come and chat with us on [Discord](https://astro.build/chat) and explain your issue on the `#support-threads` channel. We’re always happy to help!
