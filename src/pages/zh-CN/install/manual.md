---
title: 手动安装Astro
description: 如何通过NPM，PNPM，或Yarn 来手动安装Astro。
layout: ~/layouts/MainLayout.astro
setup: import InstallGuideTabGroup from '~/components/TabGroup/InstallGuideTabGroup.astro';
---
准备好安装Astro了？跟着我们的自动或手动设置教程来开始吧。
Ready to install Astro? Follow our automatic or manual set-up guide to get started.

#### 前提准备

- **Node.js** - `14.15.0`, `v16.0.0`, 或者更高版本.
- **Text editor** - 我们建议使用带Astro官方插件的 VS Code来作为编辑器。.
- **Terminal** - Astro 可以通过其命令行界面 (CLI) 来进行安装。

<InstallGuideTabGroup />

#### 安装

如果你不打算使用`create-astro`命令工具来自动创建项目，你可以按以下说明来自定义设置你的项目。

## 1. 创建项目目录

创建一个目录，目录名称是你打算使用的项目名称，并导航到该目录。

```bash
mkdir my-astro-project
cd my-astro-project
```

在该目录内，创建`package.json`文件，该文件将管理你的项目依赖，包括Astro，如果您不熟悉这种文件格式，可以运行下面的命令来直接创建一个。

```bash
npm init --yes
```

## 2. 安装Astro

首先，需要在你的项目目录内安装Astro的项目依赖。

```bash
npm install astro
```

然后，使用下面的代码来修改`package.json`文件的"scripts"小节内容：

```diff
  "scripts": \{
-    "test": "echo \"Error: no test specified\" && exit 1"
+    "dev": "astro dev",
+    "start": "astro dev",
+    "build": "astro build",
+    "preview": "astro preview"
  },
```

你将会在之后的教程中使用这些不同的命令来开始Astro项目。

## 3. 创建第一个页面

打开你的编辑器，在`src/pages/`目录创建一个新文件`index.astro`，这将会是你的第一个页面。

复制并粘贴以下内容到该页面`index.astro`内（包含`---`内的内容）。


```astro
---
// Welcome to Astro! Everything between these triple-dash code fences
// is your "component front matter". It never runs in the browser.
console.log('This runs in your terminal, not the browser!');
---
<!-- Below is your "component template." It's just HTML, but with
     some magic sprinkled in to help you build great templates. -->
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
<style>
  h1 {
    color: orange;
  }
</style>
```

## 4.创建静态文件

同样，你可以创建一个`public/`目录来存储你的静态文件。Astro会在最后的编译中包含进这些文件，以便你可以在你的组件模板内安全的引用他们。

在你的编辑器内，在`public/`目录下创建一个`robots.txt`的文件，该文件将会告诉类似Google这样的搜索引擎怎样去对待该站点。

针对该教程，复制并粘贴以下内容至`robots.txt`内：

```
# Example: Allow all bots to scan and index your site. 
# Full syntax: https://developers.google.com/search/docs/advanced/robots/create-robots-txt
User-agent: *
Allow: /
```

## 5. 创建`astro.config.mjs`配置文件

Astro使用`astro.config.mjs`来配置项目。这个文件是可选的，您可以选择不配置他，但还是希望你现在创建该文件。

在你的项目根目录创建`astro.config.mjs`文件，并复制粘贴下面的内容至该文件内：

```
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({});
```

如果你想集成像React,Svelte的[界面框架组件](/zh-CN/core-concepts/framework-components/),或者使用其他的类似Tailwind或Partytown的工具，你可以在[手动导入并配置集成])(/zh-CN/guides/integrations-guide)章节内获取更多信息。


📚 阅读Astro的[API配置引用](/zh-CN/reference/configuration-reference/)章节可以获得更多内容。


## 6. 接下来

如果你按上述一步步操作，你的项目目录应该看上去像这样的：

```
├── node_modules/
├── src/
│   └── pages/
│   │   └── index.astro
├── public/
│   ├── robots.txt
├── astro.config.mjs
├── package.json
└── package-lock.json (or: yarn.lock, pnpm-lock.yaml, etc.)
```

祝贺你，你现在可以去使用Astro了！

如果你完成了该向导的内容，你可以跳转至[步骤3：开始](/zh-CN/install/auto#3-start-astro-)来继续并学习首次怎样运行Astro.

