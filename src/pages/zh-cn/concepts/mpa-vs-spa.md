---
layout: ~/layouts/MainLayout.astro
title: MPAs vs. SPAs
description: "要理解为什么 Astro 与像 Next.js 或者 Remix 这种 web 框架与众不同，就必须理解多页应用（MPA）和单页应用（SPA）之间的权衡"
i18nReady: true
---

要理解 Astro 与像 Next.js 或者 Remix 等 web 框架的与众不同，就必须理解多页应用（MPA）和单页应用（SPA）之间的权衡

## 术语

**多页应用 (MPA)** 是由许多 HTML 组成的页面, 大部分都直接在服务端完成渲染. 
当你导航到一个新的页面的时候，你的浏览器会向服务器请求一个新的 HTML 页面。  
 传统的多页应用框架很多，例如 Ruby on Rails, Python Django, PHP Laravel, WordPress, Joomla, Drupal，以及像 Eleventy、Hugo 这种静态页面生成器.  
 **Astro 是一种多页应用的框架。**    

**单页应用（SPA）** 主要由一个 JavaScript 应用组成，在用户浏览器本地进行HTML渲染。
SPA*也*可能在服务端生成 HTML， 但是SPA特别之处在于，在导航到新页面的时候，新页面是由客户端的 JavaScript 渲染完成的，而不必要向服务端再次请求新的 HTML 页面。
Next.js, Nuxt, SvelteKit, Remix, Gatsby, 以及 Create React App 都是典型的 SPA 框架。

## Astro vs. 其他的 MPA 框架

Astro 是一个 MPA 框架。但是，Astro 和其他 MPA 框架相比非常与众不同。
这里主要的区别在于，Astro 使用 JavaScript 作为其服务端语言和运行时。
对于传统的 MPA 框架，我们会使用不同的语言（如 Ruby，PHP）构建服务端，并使用 JavaScript 实现浏览器中的逻辑。
但是对于Astro，我们只是在写 JavaScript，HTML 和 CSS。
这样，我们可以在同时服务器和客户端渲染 UI组件（如React和Svelte）。
在Astro中，开发人员的体验感觉很像Next.js和其他现代Web框架，但Astro的性能特征更像传统的MPA网站架构。
## MPA与SPA

在比较MPA与SPA时，有三个主要区别需要注意。

#### 服务器渲染（MPA）与客户端渲染（SPA）的比较

在 MPA 中，页面的大部分 HTML 是在服务器上渲染的。在 SPA 中，大部分 HTML 是通过在浏览器中运行 JavaScript 在本地呈现的。这两种架构对网站的行为、性能和 SEO 有不同影响。

在浏览器中渲染你的 HTML，似乎比从远程服务器上请求它更快。然而事实却是，除非使用服务器渲染，否则 SPA 与 MPA 相比，在第一次页面加载时的表现会一直较慢。这是因为SPA需要在浏览器中下载、解析和运行整个 JavaScript 应用程序，之后才渲染页面 HTML 完成。其次，SPA 很可能需要去服务端获取数据，这导致在页面完成加载之前有更多的等待时间。

大多数SPA框架将试图通过在第一次页面加载时增加一些基本的服务器渲染（部分预渲染）来缓解这一性能问题。这是一个改进，但它引入了新的复杂性，因为页面渲染现在需要在多种环境（服务器、浏览器）中用不同方式实现。这也引入了一个新的问题，即你的网站看起来已经加载了（HTML），但却没有反应，因为应用程序的 JavaScript 逻辑仍在后台加载。

MPA 在远程服务器上渲染所有的HTML，但是在浏览器上通常不需要很多（如果有的话）JavaScript 来运行。这个特性使得 MPA 的首次加载体验比 SPA 快得多，这对以聚焦于内容的网站来说是至关重要的。但 MPA 的代价是：未来的页面导航用时更多，所以在第一次页面加载后，长期的用户体验将不会非常受益。


#### 服务器路由（MPA）与客户端路由（SPA）的对比

页面路由在哪里实现的呢？在MPA中，服务器接受到每个请求，服务端决定用哪个 HTML 来响应，所以 MPA 的页面路由在服务端实现。在 SPA 中，页面路由总是在本地的浏览器中运作：它劫持了浏览器默认的导航行为、使用 JavaScript 来渲染新的页面，而甚至不一定需要再往服务端发请求。

这是一个类似于上述的权衡。MPA 提供了更快的首页加载体验，而一旦 JavaScript 应用程序在浏览器中完全加载，SPA可能提供更快的第二或第三页加载。

SPA 还可以提供极为强大的跨页面导航动画过渡功能，因为他们对页面渲染控制力很强。为了实现 SPA 的动画和过渡，MPA 需要利用 Hotwire 的 [Turbo](https://turbo.hotwired.dev/) 等工具，通过在浏览器中控制导航来模拟客户端路由。HTML 仍然是在服务器上渲染的，但 Turbo 显示页面之间的无缝过渡，这也类似于 SPA 中的客户端路由。

#### 服务器状态管理（MPA）与客户端状态管理（SPA）的对比

对于处理复杂的、多页面状态管理的网站来说，SPA 是一种优秀的架构（想想：Gmail）。这是因为SPA将整个网站作为一个单一的 JavaScript 应用程序运行，这让应用程序在多个页面上保持状态和内存。像收件箱、管理面板这样的交互式、数据驱动的体验，用 SPA 实现就会表现良好，因为网站本身就 "类似于应用程序"。


## MPA比SPA好吗？

在比较 MPA 和 SPA 时，没有 "更好 "或 "更坏 "的选择。这一切需要因地制宜做不同权衡。

**Astro优先考虑MPA的性能和简单性，因为它对我们以内容为重点的网站的用例最有意义。

:::note[Accessibility]
MPAs 的导航使用标准的 `<a>` 元素。 这提供了重要的无障碍功能，如焦点状态管理和默认触发路由变化的浏览器行为。
:::

## 案例对比

以下是我们所知道的所有的Astro比较。

- [Astro vs. SPA (Next.js)](https://twitter.com/t3dotgg/status/1437195415439360003) - 少 94% JavaScript
- [Astro vs. SPA (Next.js)](https://twitter.com/jlengstorf/status/1442707241627385860?lang=en) - 快 34% 的加载速度 
- [Astro vs. SPA (Next.js)](https://vanntile.com/blog/next-to-astro) – 少 65% 的网络流量 
- [Astro vs. SPA (Remix, SvelteKit)](https://www.youtube.com/watch?v=2ZEMb_H-LYE&t=8163s) - " [Lighthouse 分数] 非常惊人"
- [Astro vs. Qwik](https://www.youtube.com/watch?v=2ZEMb_H-LYE&t=8504s) - 43% 更快的 TTI


如果你知道一个别的 Benchmark，但没有看到它列在这里，请创建一个PR来添加它。

## 更多资源

如果想要了解更多, Surma (Google) 和 Jake Archibald (Google)  [在这个话题里](https://www.youtube.com/watch?v=ivLhf3hq7eM)记录了一个很棒的来回讨论


