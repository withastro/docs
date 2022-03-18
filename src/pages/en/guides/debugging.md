---
layout: ~/layouts/MainLayout.astro
title: Debugging
description: Debug in Astro using the Debug component
---

There are a few ways to debug your code with Astro. But it is important to remember that because **Astro runs on the server**, a `console.log()` in Astro frontmatter will output to the **terminal**, not the browser console.

```astro
---
const sum = (a)=>(b)=> a + b

console.log("Answer is: ", sum(2)(2))
---

```

This output is displayed directly inside your terminal.

```bash
Answer is: 4
```

To make the process of Debugging code more developer-friendly, Astro has a [built-in `<Debug>` component](/en/reference/builtin-components#debug-) which allows you to move your `console.log()` output from the terminal directly into the browser.

```astro
---
import { Debug } from 'astro/components';
const sum = (a)=>(b)=> a + b
---
<Debug {sum(2)(4)} />
```

## Debugging JS

Any code passed through using the `<script>` tags in your `.astro` file is printed to the console on the browser. The same is true for JavaScript within your UI components. You can also use any UI framework's own debugging tools inside your Astro project.
