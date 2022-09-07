---
layout: ~/layouts/MainLayout.astro
title: 服务端渲染
---

**服务器端渲染**，又称 SSR，你可以在 Astro 中启用它。启用后你可以：

- 在应用程序中实现登录状态会话。
- 用 `fetch` 动态调用 API 来渲染数据。
- 使用**适配器**将部署站带你。

:::note
SSR 是 Astro 的一个尝试，在 v1.0 稳定版之前可能发生变化。请在词了解最新的 API 变动。
:::

## 启用 SSR

为了启用 SSR，你需要使用适配器。这是因为 SSR 需要服务器**运行时**环境运行服务器端代码。服务器端代码可以调用该运行时提供的 API。

安装一个适配器可以让Astro访问相应的API，并允许Astro输出一个脚本，在那种服务器上运行你的项目。

现有以下适配器，未来将有更多适配器：

- [Cloudflare](https://github.com/withastro/astro/tree/main/packages/integrations/cloudflare)
- [Deno](https://github.com/withastro/astro/tree/main/packages/integrations/deno)
- [Netlify](https://github.com/withastro/astro/tree/main/packages/integrations/netlify)
- [Node.js](https://github.com/withastro/astro/tree/main/packages/integrations/node)
- [Vercel](https://github.com/withastro/astro/tree/main/packages/integrations/vercel)

你可以在上面的各个适配器链接中找到相关说明，并完成以下两个步骤启用 SSR（以下示例使用 `my-adapter` 作为占位符的）：

1. 通过 npm 或其他包管理器安装适配器：

   ```bash
      npm install --save-dev @astrojs/my-adapter
    ```

1. 在 `astro.config.mjs` 文件添加[适配器](/zh-cn/reference/configuration-reference/)导入和默认导出。

    ```diff
    // astro.config.mjs
    import { defineConfig } from 'astro/config';
    + import myAdapter from '@astrojs/my-adapter';
    export default defineConfig({
    +   adapter: myAdapter(),
    });
    ```

## 特性

Astro 在默认情况下仍是静态网站生成器。但是一旦你启用了服务器端渲染适配器，**你的页面目录中的每条路由都会成为服务器渲染的路由**，一些新的功能就可以为你所用。

### `Astro.request.headers`

你可以通过 `Astro.request.headers` 获取请求的 header 信息。[Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers) 对象类似 Map，你可以在此检索 cookie 等 header 信息。

```astro
---
const cookie = Astro.request.headers.get('cookie');
// ...
---
<html>
  <!-- Page here... -->
</html>
```

### `Astro.redirect`

在 `Astro` global 中，你可以用该方法重定向至另一页面。你可以在通过从 cookie 中获取到的用户会话来检查用户是否已经登录，然后之后再做这个动作。

```astro
---
import { isLoggedIn } from '../utils';

const cookie = Astro.request.headers.get('cookie');

// 如果用户没有登录，就把他们重定向到登录页面。
if(!isLoggedIn(cookie)) {
  return Astro.redirect('/login');
}
---
<html>
  <!-- Page here... -->
</html>
```

### `Response`

任何页面都可以返回 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)。可以在数据库中查找 ID 后，再动态返回 404 页面。

__[id].astro__

```astro
---
import { getProduct } from '../api';

const product = await getProduct(Astro.params.id);

// No product found
if(!product) {
  return new Response(null, {
    status: 404,
    statusText: 'Not found'
  });
}
---
<html>
  <!-- Page here... -->
</html>
```

#### API 路由

`src/pages/` 文件夹中的 `.js` 或 `.ts` 文件都是 API 路由，它接收 [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 并返回 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)数据。

__[id].js__
```js
import { getProduct } from '../db';

export async function get({ params }) {
  const { id } = params;
  const product = await getProduct(id);

  if(!product) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found'
    });
  }

  return new Response(JSON.stringify(product), {
    status: 200
  });
}
```
