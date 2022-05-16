---
title: 通过自动命令行来安装 Astro
description: 如何通过 create-astro 命令行工具使用 NPM、PNPM 或 Yarn 安装 Astro。
layout: ~/layouts/MainLayout.astro
setup: import InstallGuideTabGroup from '~/components/TabGroup/InstallGuideTabGroup.astro';
---
准备好安装 Astro 了吗？跟着我们的自动化或手动设置教程来开始吧。

#### 前提准备

- **Node.js** - `14.15.0`，`v16.0.0` 或更高版本。
- **文本编辑器** - 我们建议使用安装有 [Astro 官方扩展](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)的 [VS Code](https://code.visualstudio.com/)。
- **终端（Terminal）** - Astro 可以通过其命令行界面 (CLI) 访问。

<InstallGuideTabGroup />

#### 安装

`create-astro` 命令是从零开始一个全新的 Astro 项目最快、最简单的方法。

## 1. 通过命令行（CLI）运行

在终端内使用 `create-astro` 可以快速的启动安装向导。这将会在你运行该命令的目录下指引你一步步去创建第一个 Astro 项目。

不需要事先创建新目录！向导将自动为你创建项目文件夹。
```shell
# npm
npm create astro@latest

# yarn
yarn create astro

# pnpm
pnpm create astro@latest
```

根据你所使用的包管理器不同 ，你可能会收到要你确认安装 `create-astro@latest` 的提示。然后会要求你指定项目文件夹（例如：`./my-astro-site`），它将创建一个新的目录。
### 选择入门模板

你将看到可供你挑选的简短入门模板列表：
  
- `Just the basics`：对于想要探索 Astro 的人而言，这是个很好的入门模板。
- `Blog`、`Documentation`、 `Portfolio`：根据具体用例提供参考的模板。
- `Completely empty`：仅供入门使用的最小模板。

使用箭头键（向上和向下）导航到你要安装的模板，然后按回车（Enter）提交。

> 💡 想在选择前先在浏览器中查看一下模板吗？[前往 astro.new](https://astro.new/)

### 安装依赖（可选）

向导将在此时提出运行 `install` 命令的交易，你可以选择现在安装或者等会自行安装。

> ⚠️如果你此时不这样做，那么就需要在向导完成后，在开始运行项目前[安装依赖](/en/install/auto#2-install-dependencies)。

### 安装任一官方 Astro 集成（可选）

此时你可以选择添加任何[额外的 UI 框架](/en/core-concepts/framework-components)（如 React、Svelte、Vue、Solid、Preact、Lit），然后再通过运行 `astro add --yes` 添加其他 Astro 官方集成（如 Tailwind、Partytown、Sitemap）。

要怎么选择想要再项目中使用的 Astro 集成？使用方向键（向上和向下）导航，空格键在选定的状态之间切换。你可以一次选择多个项目，或者你可以不选择任何集成就直接仅进行下一步。

当你对你的选择感到满意时，按回车（Enter）提交。

> 这些集成以及其他的 [Astro 社区集成](https://astro.build/integrations)，在日后也可以按照我们的[集成指南](/en/guides/integrations-guide)所写的另行添加。

在选完要添加的集成后，你应该看到类似下方的终端信息，告知你 `create-astro` 将对项目中的 `astro.config.mjs` 进行改变。

```bash
Astro will make the following changes to your config file:
```

看到这条消息意味着你所选择的集成已经成功添加到你的项目配置中。(如果没有的话，你可以稍后手动添加它们）。

### 初始化 .git 仓库（可选）

在这最后一步，你可以选择在你的新目录下初始化 git 仓库。你可以随意选择是否要初始化，但如果你打算在项目中使用 [Git](https://git-scm.com/) 工具的话这就大有脾益。

### 下一步

当 `create-astro` 安装向导执行完毕后，你应该在屏幕上看到一些建议性说明（"Next Steps"），这些说明将帮助你完成设置并开始新项目。


## 2. 安装依赖

如果你没有跟随向导安装项目依赖，现在你就需要使用喜欢的包管理器来安装依赖。

```bash
# npm
npm install

# yarn
yarn

# pnpm
pnpm install

```

如果你打算在项目内使用 [Git](https://git-scm.com/)，直接在项目根目录运行 `git init` 即可。


## 3. 开始使用 Astro ✨

在大部分项目开发中使用 Astro 的内置开发服务器都可以来完成开发。这将演示怎样在本地开发环境中运行你的项目。

首先，使用包管理器运行预置的启动脚本：

```bash
# npm
npm start

# yarn
yarn start

# pnpm
pnpm run start
```

如果一切都正常，Astro 将会在 [http://localhost:3000](http://localhost:3000) 运行你的项目！


Astro 将实时监听 `src/` 目录下的文件更改，所以在开发过程中，如果你做了修改，不需去重启服务。


如果你无法在浏览器中正常打开你的项目，返回运行 `start` 命令的终端内看看有没有什么错误提示。


## 4. 部署到网络

是时候去部署你的项目到互联网了！在你的项目内运行 `build` 命令就可以在项目的 `dist/` 目录内生成部署所需的所有静态文件。


```bash
# npm
npm run build

# yarn
yarn build

# pnpm
pnpm run build
```

当命令运行结束，在项目目录内你可以看到名为 `dist/` 的新目录，现在你可以直接把它部署到你喜欢的网络服务器上了。

想开始免费托管你的网页，可以考虑下我们的骄傲的托管合作伙伴，例如 [Netlify](https://www.netlify.com/)。获取更多的部署说明，请查阅我们的[部署文档](/zh-CN/guides/deploy)。


## 接下来...

好了！你现在已经准备好开始进行开发了！

📚到[项目结构](/zh-CN/core-concepts/project-structure)章节学习更多关于 Astro 的项目结构的内容。

📚到[组件](/zh-CN/core-concepts/astro-components)章节学习关于 Astro 组件语法的内容。

📚 到[页面](/zh-CN/core-concepts/astro-pages)章节学习关于 Astro 基于文件的路由的相关知识。

