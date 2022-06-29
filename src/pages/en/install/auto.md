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

The `create-astro` wizard will walk you through setting up a new Astro project, by asking the following questions:

1. Where would you like to create your new Astro project?
    
    Astro must be installed in an empty folder. Type in a name for your new project directory.
    
    ```bash
    my-astro-site
    ```

1. Which template would you like to use?
    
    Select from the following list:
    - [Just the Basics](https://github.com/withastro/astro/tree/main/examples/basics) - includes a typical project structure as a model
    - [Blog](https://github.com/withastro/astro/tree/main/examples/blog) - includes an index page and a folder with first blog post
    - [Docs](https://github.com/withastro/astro/tree/main/examples/docs) - includes sidebar nav, page table of contents, and multi-language support
    - [Portfolio](https://github.com/withastro/astro/tree/main/examples/portfolio) - styled and ready to go with portfolio and about pages
    - [Completely Empty](https://github.com/withastro/astro/tree/main/examples/minimal) - just a single page


1. Would you like to install dependencies with your package manager? (Y/n)

    Don't want to do it now? You can install dependencies yourself after setup!

1. Initialize a Git repository? (Y/n)

    Don't want to do it now? You can run `git init` later!

<!-- You do not need to create a new directory for your project before running the wizard. As a part of setup, the `create-astro` wizard will ask you where your new project should live and will create a new folder for it if needed.

Before running, some package managers may prompt you to confirm that you want to install the latest version of `create-astro` (`create-astro@latest`). This is expected, and it is okay to accept this prompt so that the `create-astro` wizard can run on your machine. -->

## 2. Install NPM Dependencies

If you already installed your dependencies during `create-astro` setup, then you can skip this and move on to the next step.

Astro is distributed via the [npm ecosystem](https://www.npmjs.com/package/astro), so you will need to install it using `npm` or another npm package manager of your choice. 


```bash
# npm
npm install

# yarn
yarn

# pnpm
pnpm install
```

## 3. Start Astro ✨

Astro's built-in development server comes with everything that you need for project development. The `astro dev` command will start the local development server so that you can see your new website in action for the very first time.

Every starter template comes with a pre-configured `dev` script that runs `astro dev` for you. Use your package manager to run this script:

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

If you aren't able to open your project in the browser, go back to the terminal where you ran the `start` command and look to see if an error occurred, or if your project is being served at a different URL than the one linked to above.

## Next Steps

Success! You are now ready to start building with Astro! 🥳

Here are a few topics that we recommend exploring next. You can read them in any order. You can even leave our documentation for a bit and go play in your new Astro project codebase, coming back here whenever you run into trouble or have a question.

📚 **Add a framework:** Learn how to extend Astro with support for React, Svelte, Tailwind and more using `npx astro add` in our [Integrations guide](/en/guides/integrations-guide/).

📚 **Deploy your site:** Learn how to build and deploy an Astro project to the web in our [Deployment guide](/en/guides/deploy/).

📚 **Understand your codebase:** Learn more about Astro’s project structure in our [Project Structure guide](/en/core-concepts/project-structure/).
