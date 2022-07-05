---
layout: ~/layouts/MainLayout.astro
title: Astro Integration API
i18nReady: true
---

**Astro集成**只需几行代码就能为你的项目添加新的功能和行为。

这个参考页是为任何想要编写集成的人准备的。要学习如何在项目中使用集成，请查看我们的[使用集成](/zh-cn/guides/integrations-guide/)指南。

## 示例

当你创建自己的集成时，可以参考官方的 Astro 集成。

- **渲染器**：[`lit`](https://github.com/withastro/astro/blob/main/packages/integrations/lit/src/index.ts), [`svelte`](https://github.com/withastro/astro/blob/main/packages/integrations/svelte/src/index.ts), [`react`](https://github.com/withastro/astro/blob/main/packages/integrations/react/src/index.ts), [`preact`](https://github.com/withastro/astro/blob/main/packages/integrations/preact/src/index.ts), [`vue`](https://github.com/withastro/astro/blob/main/packages/integrations/vue/src/index.ts), [`solid`](https://github.com/withastro/astro/blob/main/packages/integrations/solid/src/index.ts)
- **库**：[`tailwind`](https://github.com/withastro/astro/blob/main/packages/integrations/tailwind/src/index.ts), [`partytown`](https://github.com/withastro/astro/blob/main/packages/integrations/partytown/src/index.ts)
- **功能**：[`sitemap`](https://github.com/withastro/astro/blob/main/packages/integrations/sitemap/src/index.ts)

## API 快速参考

```ts
interface AstroIntegration {
    name: string;
    hooks: {
        'astro:config:setup'?: (options: {
            config: AstroConfig;
            command: 'dev' | 'build';
            updateConfig: (newConfig: Record<string, any>) => void;
            addRenderer: (renderer: AstroRenderer) => void;
            injectScript: (stage: InjectedScriptStage, content: string) => void;
            injectRoute: ({ pattern: string, entryPoint: string }) => void;
        }) => void;
        'astro:config:done'?: (options: { config: AstroConfig }) => void | Promise<void>;
        'astro:server:setup'?: (options: { server: vite.ViteDevServer }) => void | Promise<void>;
        'astro:server:start'?: (options: { address: AddressInfo }) => void | Promise<void>;
        'astro:server:done'?: () => void | Promise<void>;
        'astro:build:start'?: (options: { buildConfig: BuildConfig }) => void | Promise<void>;
        'astro:build:setup'?: (options: {
          vite: ViteConfigWithSSR;
          pages: Map<string, PageBuildData>;
          target: 'client' | 'server';
        }) => void | Promise<void>;
        'astro:build:ssr'?: (options: { manifest: SerializedSSRManifest }) => void | Promise<void>;
        'astro:build:done'?: (options: { pages: { pathname: string }[]; dir: URL; routes: RouteData[] }) => void | Promise<void>;
    };
}
```

## 钩子

### `astro:config:setup`

**上一个钩子**：[`astro:config:done`](#astroconfigdone)

**时机**：初始化时，在 [Vite](https://vitejs.dev/config/) 或[Astro 配置](/zh-cn/reference/configuration-reference/) 解析前。

**用途**：扩展项目配置。包括更新 [Astro 配置](/zh-cn/reference/configuration-reference/)、应用 [Vite 插件](https://vitejs.dev/guide/api-plugin.html)、添加组件渲染器，以及向页面注入脚本。

```js
'astro:config:setup'?: (options: {
    config: AstroConfig;
    command: 'dev' | 'build';
    updateConfig: (newConfig: Record<string, any>) => void;
    addRenderer: (renderer: AstroRenderer) => void;
    injectScript: (stage: InjectedScriptStage, content: string) => void;
    injectRoute: ({ pattern: string, entryPoint: string }) => void;
}) => void;
```

#### `config` 选项

**类型**：`AstroConfig`

用户提供的 [Astro 配置](/zh-cn/reference/configuration-reference/)只读副本。这是在任何其他集成运行之前进行解析的。如果在所有集成完成配置更新后需要配置副本，[见`astro:config:done` 钩子](#astroconfigdone)。

#### `command` 选项

**类型**：`'dev' / 'build'`

- `dev` - 项目执行 `astro dev` 或 `astro preview`
- `build` - 项目执行 `astro build`

#### `updateConfig` 选项

**类型**：`(newConfig: Record<string, any>) => void;`

用来更新用户提供的[Astro 配置](/zh-cn/reference/configuration-reference/)的回调函数。你提供的任何配置**将与用户配置+其他集成配置的更新合并**，所以你可以随意省略键名!

例如，假设你需要在项目使用 [Vite](https://vitejs.dev/) 插件：

```js
import bananaCSS from '@vitejs/official-banana-css-plugin';

export default {
  name: 'banana-css-integration',
  hooks: {
    'astro:config:setup': ({ updateConfig }) => {
      updateConfig({
        vite: {
          plugins: [bananaCSS()],
        }
      })
    }
  }
}
```

#### `addRenderer` 选项

**类型**：`(renderer:` [`AstroRenderer`](https://github.com/withastro/astro/blob/fdd607c5755034edf262e7b275732519328a33b2/packages/astro/src/%40types/astro.ts#L872-L883) `) => void;`
**示例**：[`lit`](https://github.com/withastro/astro/blob/main/packages/integrations/lit/src/index.ts)、[`svelte`](https://github.com/withastro/astro/blob/main/packages/integrations/svelte/src/index.ts)、[`react`](https://github.com/withastro/astro/blob/main/packages/integrations/react/src/index.ts)、[`preact`](https://github.com/withastro/astro/blob/main/packages/integrations/preact/src/index.ts)、[`vue`](https://github.com/withastro/astro/blob/main/packages/integrations/vue/src/index.ts)、[`solid`](https://github.com/withastro/astro/blob/main/packages/integrations/solid/src/index.ts)

用于添加组件框架渲染器（即 React、Vue、Svelte 等）的回调函数。你可以浏览上面的例子和类型定义，了解更多的高级选项，但需要注意两个注意选项：

- `clientEntrypoint` - 当组件被使用时，在客户端执行的文件的路径。这主要是为了使用 JS 渲染或填充你的组件。
- `serverEntrypoint` - 文件路径，在服务器端请求或静态构建时，只要使用组件就会执行。这些文件应该将组件渲染成静态标记，并在适当的时候使用钩子进行激活。[React 的 `renderToString` 回调函数](https://reactjs.org/docs/react-dom-server.html#rendertostring)是个典型例子。

#### `injectRoute` 选项

**类型**：`({ pattern: string, entryPoint: string }) => void;`

用于向 Astro 项目注入路由的回调函数。注入的路由可以是 [`.astro`页面](/zh-cn/core-concepts/astro-pages/) 或 [`.js`和`.ts`路由处理程序](/zh-cn/core-concepts/astro-pages/#non-html-pages)。

`injectRoute` 接收带有 `pattern` 和 `entryPoint` 的对象值。

- `pattern` - 应该在浏览器中使用的路由，例如 `/foo/bar`。`pattern` 可以使用 Astro 的文件路径语法来表示动态路由，例如 `/foo/[bar]` 或 `/foo/[...bar]`。请注意，在 `pattern` 中**无需**文件扩展名。
- `entryPoint` — 裸模块指定器，指向 `.astro` 页面或 `.js`/`.ts` 路由处理程序，处理`pattern` 中指定路由。

使用示例：

```js
injectRoute({
  pattern: '/foo/[dynamic]',
  entryPoint: 'foo/dynamic-page.astro'
});
```

#### `injectScript` 选项

**类型**：`(stage: InjectedScriptStage, content: string) => void;`

回调函数，在每个页面上注入 JavaScript 内容。

**`stage`** 表示这个脚本（`content`）应该如何插入。有些阶段允许不加修改地插入脚本，而有些阶段允许在 [Vite 的捆绑步骤](https://vitejs.dev/guide/build.html)中进行压缩。。

- `head-inline`：注入每个页面的 `<head>` 中的脚本标签。**不**由 Vite 压缩或解析。
- `before-hydration`：在激活脚本运行之前导入客户端。由Vite优化和解决。
- `page`：与 `head-inline` 类似，只是注入片段由 Vite 进行处理，并与页面上 Astro 组件内定义的其他 `<script>` 标签捆绑在一起。该脚本将在最终的页面输出中以 `<script type="module">` 的形式加载，并由 Vite 压缩和解析。
- `page-ssr`：在每个 Astro 页面组件的 frontmatter 中作为单独的模块被导入。因为这个阶段导入你的脚本，无法使用全局 `Astro`，脚本只会在 `import` 第一次 evaluate 时运行一次。

    `page-ssr` 阶段的主要是将 CSS `import` 注入到每个页面，并由 Vite 进行优化和解析。

    ```js
    injectScript('page-ssr', 'import "global-styles.css";');
    ```

### `astro:config:done`

**上一个钩子**：[`astro:config:setup`](#astroconfigsetup)

**下一个钩子**：当在开发或预览模式下运行时为 [`astro:server:setup`](#astroserversetup)，在生产构建时为 [astro:build:start](#astrobuildstart)

**时机**：在 Astro 配置解析后，其他集成已经运行 `astro:config:setup` 钩子后。

**原因**：检索最终的配置，以便在其他钩子中使用。

```js
'astro:config:done'?: (options: { config: AstroConfig }) => void | Promise<void>;
```

#### `config` 选项

**类型**：`AstroConfig`

用户提供的 [Astro 配置](/zh-cn/reference/configuration-reference/)的只读副本。这在其他集成运行后进行解析。

### `astro:server:setup`

**上一个钩子**：[`astro:config:done`](#astroconfigdone)

**下一个钩子**：[`astro:server:start`](#astroserverstart)

**时机**：在开发或预览模式下创建 Vite 服务器后，但在 `listen()` 事件触发前。详见[Vite 的 createServer API](https://vitejs.dev/guide/api-javascript.html#createserver)。

**用途**：更新 Vite 服务端选项和中间件。

```js
'astro:server:setup'?: (options: { server: vite.ViteDevServer }) => void | Promise<void>;
```

#### `server` 选项

**类型**：[`ViteDevServer`](https://vitejs.dev/guide/api-javascript.html#vitedevserver)

在开发和预览模式下使用的 Vite 服务器的可变实例。例如，[在 Partytown 集成中使用](https://github.com/withastro/astro/tree/main/packages/integrations/partytown)，以注入 Partytown 服务器作为中间件。

```js
import

'astro:server:setup': ({ server }) => {
  server.middlewares.use(
    partytownServer(partytownLibDirectory, {
      mount: '/~partytown',
      ...
    })
  );
}
```

### `astro:server:start`

**上一个钩子**：[`astro:server:setup`](#astroserversetup)

**下一个钩子**：[`astro:server:done`](#astroserverdone)

**时机**：在服务端 `listen()` 事件触发之后。

**用途**：拦截指定地址的网络请求。如果你打算将这个地址用于中间件，请考虑使用 `astro:server:setup` 来代替。

```js
'astro:server:start'?: (options: { address: AddressInfo }) => void | Promise<void>;
```

#### `address` 选项

**类型**：[`AddressInfo`](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_net_d_._net_.addressinfo.html)

由 [NodeJS Net 模块](https://nodejs.org/api/net.html)提供的地址、协议族名和端口。

### `astro:server:done`

**上一个钩子**：[`astro:server:start`](#astroserverstart)

**时机**：在开发服务器关闭后。

**用途**：在运行 `astro:server:setup` 或 `astro:server:start` 钩子中可能触发的清理事件。

```js
'astro:server:done'?: () => void | Promise<void>;
```

### `astro:build:start`

**上一个钩子**：[`astro:config:done`](#astroconfigdone)

**下一个钩子**：[`astro:build:setup`](#astrobuildsetup)

**时机**：在 `astro:config:done` 事件之后，但在生产构建开始前。

**用途**：设置生产构建过程中需要的任何全局对象或客户端。这也可以扩展[适配器 API](/zh-cn/reference/adapter-reference/)中的构建配置选项。

```js
'astro:build:start'?: (options: { buildConfig: BuildConfig }) => void | Promise<void>;
```

### `astro:build:setup`

**上一个钩子**：[`astro:build:start`](#astrobuildstart)

**下一个钩子**：[`astro:build:ssr`](#astrobuildssr)

**何时**：在 `astro:build:start` 钩子后，在构建之前立即运行。

**用途**：此时，用于构建的 Vite 配置已经完全建成，这是你修改它的最后机会。例如，这可以用来覆盖一些默认值。如果你不确定你应该使用这个钩子还是 `astro:build:start`，请使用 `astro:build:start`。

```js
'astro:build:setup'?: (options: {
  vite: ViteConfigWithSSR;
  pages: Map<string, PageBuildData>;
  target: 'client' | 'server';
}) => void | Promise<void>;

```

### `astro:build:ssr`

**上一个钩子**：[`astro:build:setup`](#astrobuildsetup)

**时机**：在生产构建（SSG 或 SSR）完成后。

**原因**：获取 SSR manifest，这在插件或集成中创建自定义 SSR 构建时很有用。

```js
'astro:build:ssr'?: (options: { manifest: SerializedSSRManifest }) => void | Promise<void>;
```

### `astro:build:done`

**上一个钩子**：[`astro:build:ssr`](#astrobuildssr)

**何时**：在生产构建（SSG 或 SSR）完成后。

**用途**：访问生成的路由和资产进行扩展（例如，将内容复制到生成的 `/assets` 目录）。如果你打算转换生成的资源，我们建议探索 [Vite 插件 API](https://vitejs.dev/guide/api-plugin.html) 和[通过 `astro:config:setup` 进行配置](#updateconfig-option)来代替。

```js
'astro:build:done'?: (options: { dir: URL; routes: RouteData[] }) => void | Promise<void>;
```

#### `dir` option

**类型**：[`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL)

指向构建输出目录的链接。注意，如果你需要有效的绝对路径字符串，你应该使用 Node 内置的 [`fileURLToPath`](https://nodejs.org/api/url.html#urlfileurltopathurl) 工具。

```js
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export default function myIntegration() {
  return {
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const metadata = await getIntegrationMetadata();
        // Use fileURLToPath to get a valid, cross-platform absolute path string 
        const outFile = fileURLToPath(new URL('./my-integration.json', dir));
        await fs.writeFile(outFile, JSON.stringify(metadata));
      }
    }
  }
}
```

#### `routes` option

**类型**：[`RouteData[]`](https://github.com/withastro/astro/blob/main/packages/astro/src/%40types/astro.ts#L973)

所有生成的路由及其相关元数据的列表。**使用SSR适配器时，这将是空的！**

你可以参考下面完整的 `RouteData` 类型，但最常见的属性是。

- `component` - 相对于项目根的输入文件路径
- `pathname` - 输出文件的URL（对于使用 `[dynamic]` 和 `[...spread]` 参数的路由未定义）。

**`RouteData` type reference**

```ts
interface RouteData {
  /** Whether a given route is an HTML page or non-HTML endpoint */
  type: 'page' | 'endpoint';
  /** Source component URL */
  component: string;
  /**
   * Output URL pathname where this route will be served
   * note: will be undefined for [dynamic] and [...spread] routes
   */
  pathname?: string;
  /** 
   * regex used for matching an input URL against a requested route
   * ex. "[fruit]/about.astro" will generate the pattern: /^\/([^/]+?)\/about\/?$/
   * where pattern.test("banana/about") is "true"
   */
  pattern: RegExp;
  /**
   * Dynamic and spread route params
   * ex. "/pages/[lang]/[..slug].astro" will output the params ['lang', '...slug']
   */
  params: string[];
  /**
   * Similar to the "params" field, but with more associated metadata
   * ex. "/pages/[lang]/index.astro" will output the segments
   * [[ { content: 'lang', dynamic: true, spread: false } ]]
   */
  segments: { content: string; dynamic: boolean; spread: boolean; }[][];
  /** 
   * Function to render component in-place from a set of input data.
   * This is typically for internal use, so call with caution!
   */
  generate: (data?: any) => string;
}
```

## 集成排序

所有的集成都是按照配置的顺序运行的。例如，在 `astro.config.*` 中的数组 `[react(), svelte()]`，`react` 将在 `svelte` 之前运行。

你的集成最好能以任何顺序运行。如果不行我们建议在文档中注明你的集成需要排在 `integrations` 配置数组的第一位或最后一位。

## 合并预置集成

一个集成也可以写成多个较小集成的集合。我们称这些集合为**预设**。预设不是创建返回单个集成对象的工厂函数，而是返回集成对象的**数组**。这对于从多个集成中构建复杂的功能非常有用。

```js
integrations: [
  // Example: where examplePreset() returns: [integrationOne, integrationTwo, ...etc]
  examplePreset()
]
```
