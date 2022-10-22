---
title: 部署你的 Astro 站点至 Cloudflare Pages
description: 如何使用 Cloudflare Pages 将你的 Astro 网站部署到网络上。
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

你可以将你的 Astro 项目部署在 [Cloudflare Pages](https://pages.cloudflare.com/) 上。 Cloudflare Pages 是一个供前端开发人员协作和部署静态 (JAMstack) 或 SSR 网站的平台。

本指南包含有关通过 Pages Dashboard 或使用 Wrangler Cloudflare CLI (命令行) 来部署到 CLoudflare Pages 的相关说明。

## 前提条件

开始之前，你需要：

- 一个 Cloudflare 账户。如果你暂时还没有，你可以现在免费去 Cloudflare 官网注册一个。
- 你的源代码存储在一个 [GitHub](https://github.com/) 或者 [GitLab](https://about.gitlab.com/) 仓库里。

## 如何使用 Git 部署一个站点

1. 在 Cloudflare Pages 设置一个新项目。
2. 将你的代码提交到一个 Git 仓库中 (GitHub, GitLab)。
3. 登陆 Cloudflare 仪表盘并在 **Account Home** > **Pages** 选择你的 Github 或 Gitlab 账户。
4. 选择 **Create a new Project**（创建一个新项目）和 **Connect Git**（连接 Git） 选项。
5. 选择你想部署到 Git 项目并点击 **Begin setup**（初始设置）。
6. 使用以下的构建设置：

    - **Framework preset（框架预设）:**: `Astro`
    - **Build command（构建命令）:** `npm run build`
    - **Build output directory（构建输出目录）:** `dist`
    - **Environment variables (advanced) （环境变量：进阶）**: Cloudflare Pages 默认使用Node.js 12.18.0，但是 Astro [需要一个更高的版本](/en/install/auto/#prerequisites)。添加一个**变量名称**为`NODE_VERSION`且值为 `16.13.0` 或**更高**的环境变量，以告诉 Cloudflare 使用兼容的节点版本。或者，将 `.nvmrc` 文件添加到你的项目更目录以指定 Node.js 版本。

7. 点击 **Save and Deploy**（保存并部署） 按钮。

## 如何使用 Wrangler 部署一个站点

1. 安装 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/).
2. 使用 `wrangler login` 在 Wrangler 登陆 Cloudflare 账户并授权。
3. 运行你的构建命令（比如 `npm run build`）。
4. 使用 `npx wrangler pages publish dist` 进行部署。

```bash
# 安装 Wrangler CLI（命令行）
npm install -g wrangler
# 在 CLI 中登陆 Cloudflare 账户
wrangler login
# 运行你的构建命令
npm run build
# 创建新的部署
npx wrangler pages publish dist
```

After your assets are uploaded, Wrangler will give you a preview URL to inspect your site. When you log into the Cloudflare Pages dashboard, you will see your new project.
上传所有文件后，Wrangler 将为你提供一个预览 URL 以检查你的站点。当你登录 Cloudflare Pages 仪表板时，你将看到你的新项目。

### 使用 Wrangler 在本地启用预览

要使预览版正常工作，你必须安装 `wrangler`

```bash
pnpm install wrangler --save-dev
```

然后可以将你的预览脚本更新了，在 `package.json` 添加新脚本 `"preview": "wrangler pages dev ./dist"`

## 如何部署 SSR 站点

你还可以使用 [`@astrojs/cloudflare` 适配器](/en/guides/integrations-guide/cloudflare/)将 Astro SSR 站点部署到 Cloudflare Pages 。

使用以下 `astro add` 命令添加 Cloudflare 适配器以在你的 Astro 项目中启用 SSR。这将安装适配器并一步对你的文件 `astro.config.mjs` 进行适当的更改。

```bash
npx astro add cloudflare
```

如果你想要手动安装适配器，请完成以下两个步骤：

1. 使用你喜欢的包管理器将 `@astrojs/cloudflare` 添加到项目的依赖项中。如果你正在使用 npm 或不确定是那个包管理器，请在终端中运行：

```bash
npm install @astrojs/cloudflare
```

2. 将以下内容添加到你的 `astro.config.mjs` 文件中：

```js title="astro.config.mjs" ins={2, 5-6}
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare()
});
```

### 模式

现在使用 [`@astrojs/cloudflare`](https://github.com/withastro/astro/tree/main/packages/integrations/cloudflare#readme) 适配器部署到 Pages Functions 时有两种模式。

1. **advanced**（高级）模式: 

> 如果没有设置任何模式，默认模式是 `"advanced"`。

2. **directory**（目录）模式: This mode is used when you want to run your function in `directory` mode, which means the adapter will compile the client side part of you app the same way, but it will move the worker script into a `functions` folder in the project root. The adaptor will only ever place a `[[path]].js` in that folder, allowing you to add additional plugins and pages middleware which can be checked into version control.

```ts title="astro.config.mjs" "directory"
export default defineConfig({
  adapter: cloudflare({ mode: "directory" }),
});
```
### Using Pages Functions

[Pages Functions](https://developers.cloudflare.com/pages/platform/functions/) enable you to run server-side code to enable dynamic functionality without running a dedicated server.

To get started, create a `/functions` directory at the root of your project. Writing your Functions files in this directory automatically generates a Worker with custom functionality at the predesignated routes. To learn more about writing Functions, see the [Pages Functions documentation](https://developers.cloudflare.com/pages/platform/functions/).

📚 Read more about [SSR in Astro](/en/guides/server-side-rendering/).

## Troubleshooting

If you're encountering errors, double-check the version of `node` you're using locally (`node -v`) matches the version you're specifying in the environment variable.

Cloudflare requires [node `v16.13`](https://miniflare.dev/get-started/cli#installation), which is a more recent version than Astro’s out-of-the-box minimum, so double check you’re using at least `v16.13`.
