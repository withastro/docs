---
title: Install Astro with the Automatic CLI
description: How to install Astro with NPM, PNPM, or Yarn via the create-astro CLI tool.
layout: ~/layouts/MainLayout.astro
setup: import InstallGuideTabGroup from '~/components/TabGroup/InstallGuideTabGroup.astro';
i18nReady: true
---
Ready to install Astro? Follow our automatic or manual set-up guide to get started.

#### Prerequisites

- **Node.js** - `14.15.0`, `v16.0.0`, or higher.
- **Text editor** - We recommend [VS Code](https://code.visualstudio.com/) with our [Official Astro extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).
- **Terminal** - Astro is accessed through its command-line interface (CLI).

<InstallGuideTabGroup />

#### Installation

`create-astro` is the fastest way to start a new Astro project from scratch.

:::tip[Online previews]
Prefer to try Astro in your browser? Visit [astro.new](https://astro.new/) to browse our starter templates and spin up a new Astro project without ever leaving your browser.
:::
## 1. Run the Setup Wizard

Run the following command in your terminal to start our handy install wizard, `create-astro`.

```shell
# npm
npm create astro@latest

# yarn
yarn create astro

# pnpm
pnpm create astro@latest
```

The `create-astro` wizard will walk you through every step of setting up your new Astro project. You can run it anywhere on your machine, so there's no need to create a new empty directory for your project before you begin. If you don't have an empty directory yet for your new project, the wizard will help create one for you automatically.

If all goes well, you should see a "Ready for liftoff!" message followed by some recommended "Next steps". `cd` into your new project directory to begin using Astro. 

If you skipped the `npm install` step during the `create-astro` wizard, then be sure to install your dependencies before continuing.

## 2. Start Astro ✨

Astro comes with a built-in development server that has everything you need for project development. The `astro dev` command will start the local development server so that you can see your new website in action for the very first time.

Every starter template comes with a pre-configured script that will run `astro dev` for you. Use your favorite package manager to run this command and start the Astro development server.

```bash
# npm
npm run dev

# yarn
yarn run dev

# pnpm
pnpm run dev
```

If all goes well, Astro should now be serving your project on [http://localhost:3000/](http://localhost:3000/)!

Astro will listen for live file changes in your `src/` directory, so you will not need to restart the server as you make changes during development.

If you aren't able to open your project in the browser, go back to the terminal where you ran the `dev` command and look to see if an error occurred, or if your project is being served at a different URL than the one linked above.

## Next Steps

Success! You are now ready to start building with Astro! 🥳

Here are a few topics that we recommend exploring next. You can read them in any order. You can even leave our documentation for a bit and go play in your new Astro project codebase, coming back here whenever you run into trouble or have a question.

📚 **Add a framework:** Learn how to extend Astro with support for React, Svelte, Tailwind and more using `npx astro add` in our [Integrations guide](/en/guides/integrations-guide/).

📚 **Deploy your site:** Learn how to build and deploy an Astro project to the web in our [Deployment guide](/en/guides/deploy/).

📚 **Understand your codebase:** Learn more about Astro’s project structure in our [Project Structure guide](/en/core-concepts/project-structure/).
