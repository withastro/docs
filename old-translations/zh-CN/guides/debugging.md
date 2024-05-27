---
layout: ~/layouts/MainLayout.astro
title: 调试
description: 使用调试组件调试 Astro
---

Astro 提供了几个不同的工具来帮助你更容易和更快地调试代码。

## 使用 `console.log()` 调试

`console.log()` 是一种简单却十分受欢迎的调试 Astro 代码方式。你在哪里写下的 `console.log` 语句将决定你的调试输出在哪里。

### Frontmatter

在 Astro frontmatter 中的 `console.log()` 语句将输出到运行 Astro CLI 的**终端**中。这是因为 Astro 运行在服务器上，而不是运行在浏览器上。

```astro
---
const sum = (a, b) => a + b;

// 示例：在 CLI 终端中输出 "4"
console.log(sum(2, 2));
---
```

### JS Script

在 Astro `<script>` 标签内编写或导入的代码会在直接浏览器运行。`console.log()` 语句或其他调试输出都将打印到浏览器的控制台中。

## 调试框架组件

框架组件（如 React 和 Svelte）是特别的。它们默认在服务器端渲染，这意味着 `console.log()` 调试输出将在终端可见。然而，它们也可以在浏览器上进行激活，这可能导致你的调试日志同时也出现在浏览器上。

这对于调试 SSR 输出和浏览器中激活组件间的差异很有用。

## Astro `<Debug />` 组件

为了帮助你调试 Astro 组件，Astro 提供了内置的 [`<Debug />`](/zh-CN/reference/api-reference/#debug-) 组件，任何值都可以直接将渲染传递到组件的 HTML 模板中。这对于在浏览器中进行快速调试非常有用的，使得开发者不必在终端和浏览器之间来回翻转。

```astro
---
import { Debug } from 'astro/components';
const sum = (a, b) => a + b;
---

<!-- 示例：在浏览器中输出 {answer: 6} -->
<Debug answer={sum(2, 4)} />
```

调试组件支持多种语法选项，使调试更加灵活和简明。

```astro
---
import { Debug } from 'astro/components';
const sum = (a, b) => a + b;
const answer = sum(2, 4);
---
<!-- 示例：三个示例是等效的 -->
<Debug answer={sum(2, 4)} />
<Debug {{answer: sum(2, 4)}} />
<Debug {answer} />
```
