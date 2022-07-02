---
layout: ~/layouts/MainLayout.astro
title: Astro 适配器 API
---

Astro 设计得易于部署到任何云提供商的 SSR（服务端渲染）服务，该功能由**适配器**[集成](/zh-cn/reference/integrations-reference/)提供。

## 什么是适配器

适配器是特殊的[集成](/zh-cn/reference/integrations-reference/)，它为服务器端渲染提供了入口。一个适配器做两件事。

- 使用仅限于主机的 API 来处理请求。
- 根据主机惯例配置构建

## 构建适配器

适配器是[集成](/zh-cn/reference/integrations-reference/)的一种，它可以做任何集成可以做的事情。

适配器__必须__在 `astro:config:done' 钩子中调用 `setAdapter` API，像这样：

```js
export default function createIntegration() {
  return {
    name: '@matthewp/my-adapter',
    hooks: {
      'astro:config:done': ({ setAdapter }) => {
        setAdapter({
          name: '@matthewp/my-adapter',
          serverEntrypoint: '@matthewp/my-adapter/server.js'
        });
      },
    },
  };
}
```

传入 `setAdapter` 的对象被定义为：

```ts
interface AstroAdapter {
	name: string;
	serverEntrypoint?: string;
	exports?: string[];
}
```

这些属性分别是：

* __name__：适配器的唯一名称，用于日志输出。
* __serverEntrypoint_：服务器端渲染入口。
* __exports__：当与 `createExports` 一起使用时，未命名导出数组（解释如下）。

### 服务端入口

Astro 的适配器 API 尝试与任何类型的主机一起工作，并有灵活的方式来配合主机 API。

#### 导出

一些无服务器主机希望你能导出一个函数，如 `handler'：

```js
export function handler(event, context) {
  // ...
}
```

在适配器 API 中，你通过在 `serverEntrypoint` 中的 `createExports` 来实现这一目标：

```js
import { App } from 'astro/app';

export function createExports(manifest) {
  const app = new App(manifest);

  const handler = (event, context) => {
    // ...
  };

  return { handler };
}
```

然后在集成中调用 `setAdapter` 的地方导出 `exports` 它。

```diff
export default function createIntegration() {
  return {
    name: '@matthewp/my-adapter',
    hooks: {
      'astro:config:done': ({ setAdapter }) => {
        setAdapter({
          name: '@matthewp/my-adapter',
          serverEntrypoint: '@matthewp/my-adapter/server.js',
+         exports: ['handler'],
        });
      },
    },
  };
}
```

#### 启动

有些主机希望你能自己**启动**服务器，例如通过监听一个端口。针对这些类型的主机，适配器 API 允许你导出 `start` 函数，它将在捆绑脚本运行时调用。

```js
import { App } from 'astro/app';

export function start(manifest) {
  const app = new App(manifest);

  addEventListener('fetch', event => {
    // ...
  });
}
```

#### `astro/app`

该模块用于渲染通过 `astro build` 预构建的页面。Astro 使用标准的[Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 和 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) 对象。有着不同的请求/响应 API 的主机应该在其适配器中转换为这些类型。

```js
import { App } from 'astro/app';
import http from 'http';

export function start(manifest) {
  const app = new App(manifest);

  addEventListener('fetch', event => {
    event.respondWith(
      app.render(event.request)
    );
  });
}
```

有以下几种方法：

##### `app.render(request)`

这个方法适合渲染匹配请求的 Astro 页面，并在 Promise 中返回 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) 对象。这也适用于不渲染页面的 API 路由。

```js
const response = await app.render(request);
```

##### `app.match(request)`

该方法用于确定请求是否适配 Astro 应用程序的路由规则。

```js
if(app.match(request)) {
  const response = await app.render(request);
}
```

你通常可以调用 `app.render(request)` 而无需使用 `.match`，因为如果有 `404.astro` 文件，Astro 会自动处理 404 页面。如果你想以不同的方式处理 404，请使用` app.match(request)`。
