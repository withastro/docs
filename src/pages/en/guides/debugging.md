---
layout: ~/layouts/MainLayout.astro
title: Debugging
description: Debug in Astro using the Debug component
---

There are a few ways to Debug you code with Astro. But first it is important to remember that **Astro runs on the server**. This means any code that is executed within the `---` Astro Front-matter would be `console.log()` to the **terminal**.

```astro
---
const sum = (a)=>(b)=> a + b

console.log("Answer is: ", sum(2)(2))
---

```

This would output would be displayed directly inside your terminal.

```bash
Answer is: 4
```

This can make the process of Debugging more complex code a bit arduous. Astro has a [built-in `<Debug>` component](/en/reference/builtin-components#debug-) which allows you to move your `console.log()` output from the terminal to the browser.

```astro
---
import { Debug } from 'astro/components';
const sum = (a)=>(b)=> a + b
---
<Debug {sum(2)(4)} />
```

This allows to debug the code being executed in an environment that is less taxing for most developers.

## Debugging JS

Where as any code passed through using the `<script>` tags in your `.astro` file would be printed to the console on the browser. This is the same for your UI components. If you use the UI frameworks corresponding debugging tools inside your browser, these two would work as normal with your Astro project.