---
title: Install Astro with the Automatic CLI
description: How to install Astro with NPM, PNPM, or Yarn via the create-astro CLI tool.
layout: ~/layouts/MainLayout.astro
setup: import InstallGuideTabGroup from '~/components/TabGroup/InstallGuideTabGroup.astro';
---
Ready to install Astro? Follow our automatic or manual set-up guide to get started.

#### Prerequisites

- **Node.js** - `14.15.0`, `v16.0.0`, or higher.
- **Text editor** - We recommend [VS Code](https://code.visualstudio.com/) with our [Official Astro extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).
- **Terminal** - Astro is accessed through its command-line interface (CLI).

<InstallGuideTabGroup />

#### Installation

`create-astro` is the fastest, easiest way to start a new Astro project from scratch.

## 1. Run the CLI

Run the following command in your terminal to start our handy install wizard, `create-astro`. This will walk you through creating your very first Astro project in whichever directory you run it in.

```shell
# npm
npm create astro@latest

# yarn
yarn create astro

# pnpm
pnpm create astro@latest
```

If `create-astro` starts successfully, you will see a short list of starter templates to choose from: 
- `starter`: A great starter template for anyone wanting to explore Astro.
- `minimal`: A template that just includes the bare minimium to get started.
- `blog, portfolio, docs, etc`: opinionated themes for specific use-cases.

If you choose the `starter` template, you will also be asked to select which [additional frameworks](/en/core-concepts/framework-components) (React, Svelte, Vue, Solid, Preact), if any, you would like to include in your project. Additional frameworks can also be added later.

## 2. Install Dependencies

When the `create-astro` install wizard is complete, you should see some recommended instructions on your screen to follow that will help you complete setup and start your new project. 

The only required step remaining is to install your project's dependencies using a package manager like npm:

```bash
# npm
npm install

# yarn
yarn

# pnpm
pnpm install

```

This is also a great chance to run `git init` in your new directory, if you plan to use the tool [Git](https://git-scm.com/) in your project.

## 3. Start Astro ✨

You can expect to use Astro's built-in dev server for most of your project development. This is how you will run your project locally during development. 

To start, use your package manager to run your pre-configured start script:

```bash
# npm
npm start

# yarn
yarn start

# pnpm
pnpm run start
```

If all goes well, Astro should now be serving your project on [http://localhost:3000](http://localhost:3000)! 

Astro will listen for live file changes in your `src/` directory, so you will not need to restart the server as you make changes during development.

If you aren't able to open your project in the browser, go back to the terminal where you ran the `start` command to see what went wrong.

## 4. Deploy to the web

It's time to deploy your project to the web! Run the `build` command in your project to build your static website to a new `dist/` folder in your project.

```bash
# npm
npm run build

# yarn
yarn build

# pnpm
pnpm run build
```

When the command finishes, you should have a new `dist/` folder in your project that you can deploy directly to your favorite web host. 

To get started hosting your website for free, check out our proud hosting partner, [Netlify](https://www.netlify.com/). For instructions on deploying to whatever host you choose, read our detailed [deployment guide](/en/guides/deploy).

## Next Steps

Success! Now you're ready to start developing!

📚 Learn more about Astro’s project structure in our [Project Structure guide](/en/core-concepts/project-structure).

📚 Learn more about Astro’s component syntax in our [Astro Components guide](/en/core-concepts/astro-components).

📚 Learn more about Astro’s file-based routing in our [Routing guide](/en/core-concepts/astro-pages).
