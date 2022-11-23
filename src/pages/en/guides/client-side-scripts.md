---
title: Scripts and Event Handling
description: How to add client-side interactivity to Astro components using native browser JavaScript APIs.
layout: ~/layouts/MainLayout.astro
i18nReady: false
---

You can add client interactivity to your Astro components without [using a UI framework](/en/core-concepts/framework-components/) like React, Svelte, Vue, etc. using standard HTML `<script>` tags. This allows you to send JavaScript to run in the browser and add functionality to your components.

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
- TypeScript is fully supported, including importing TypeScript files
- If your component is used several times on a page, the script will only be included once.

```astro title="src/components/Example.astro"
<script>
  // Processed! Bundled! TypeScript-supported!
  // ESM imports work, even to npm packages.
</script>
```

To avoid bundling the script, you can use the `is:inline` attribute.

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

Astro will build, optimize, and add these scripts to the page for you, following its [script bundling rules](#script-bundling-in-astro).

```astro title="src/components/LocalScripts.astro"
<!-- relative path to script in `src/` -->
<script src="./local-script.js"></script>

<!-- also works for local TypeScript files -->
<script src="./script-with-types.ts"></script>
```

#### Load external scripts

**When to use this:** If your JavaScript file lives inside of `public/` or on a CDN.

This approach skips the JavaScript processing, bundling, and optimizations that are provided by Astro when you import scripts as described above.

```astro title="src/components/ExternalScripts.astro" "is:inline"
<!-- absolute path to a script at `public/my-script.js` in your project -->
<script is:inline src="/my-script.js"></script>

<!-- full URL to a script on a remote server -->
<script is:inline src="https://analytics.example.com/script.js"></script>
```
