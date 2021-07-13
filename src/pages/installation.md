---
layout: ~/layouts/Main.astro
title: Installation
---

There are a few ways to getting started with Astro. Outlined below are instructions on how to go about installing Astro either manually or by our Astro Installer.

## System Requirements

- **Node.js** - [`v12.20.0`](https://nodejs.org/en/download/releases/), [`v14.13.1`](https://nodejs.org/en/download/),[ `v16.0.0`](https://nodejs.org/en/download/current/), or higher.
- **A text editor** - We recommend [VS Code](https://code.visualstudio.com/) with our own [Astro extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) for the complete DX.
- **A terminal** - Astro is mainly accessed by the terminal's Command Line Interface (CLI).

## Astro Installer
<!-- Feels like this needed stronger prominence in the text than it had previously -->
```bash
npm init astro
```

Run this command in your terminal to start our `create-astro` Installer. Letting you walk through setting up a new project.

```bash
mkdir <project-name>
cd <project-name>
npm init astro
```

Follow along with the CLI instructions to install Astro with one of our official project starter templates.

Once completed, jump over to our [QuickStart Guide](/quick-start#start-your-project) for a walk-through on how to **Start & Build** your new Astro project!

## Manual Install

You can install Astro without the aide of the Astro Installer. Below demonstrates the best way to go about starting your project

### Set up your project

Create an empty directory with the name of your project, and then navigate into it:

```bash
# Note: Replace <project-name> with the name of your project.
mkdir <project-name>
cd <project-name>
```

Astro is designed to work with the entire [npm](https://www.npmjs.com/) ecosystem, which is managed by the `package.json` project manifest.

To create a new [`package.json`](https://docs.npmjs.com/creating-a-package-json-file)file for your project, run the following command:

```bash
npm init --yes
```

Once your project is setup, you should have a directory with a single `package.json` file inside of it. You can now install Astro in your project.

We use [`npm`](https://www.npmjs.com/) in the examples below, but you could also use [`yarn`](https://yarnpkg.com/) or [`pnpm`](https://pnpm.io/) if you prefer an npm alternative. If you're not familiar with either `yarn` or `pnpm`, then we highly recommend sticking with `npm`.

### Install Astro

```bash
npm install astro
```

This command pulls Astro from the npm registry and saves this as a direct(?) dependency in your project manifest. 

To use Astro add the following, within the "scripts" section of your `package.json` file.

```diff
  "scripts": {
-    "test": "echo \"Error: no test specified\" && exit 1"
+    "start": "astro dev",
+    "build": "astro build",
  },
}
```

You can [configure](/reference/configuration-reference.md) you Astro Project further to work with your preferred type of (UI Framework)/ or Style System

### Create your first page

Open up your favourite text editor, and create a new file inside your project:

```astro
---
// 1. Create a new file at <project-directory>/src/pages/index.astro
// 2. Copy-and-paste this entire file (including `---` dashes) into it.
---
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

You can create more pages in the `src/pages` directory, and Astro will use the filename to create new pages on your site. For example, you can create a new file at `src/pages/about.astro` (reusing the previous snippet) and Astro will generate a new page at the `/about` URL.

### Next Steps

Success! You're now ready to start developing! Jump over to our [Quickstart Guide](/quick-start#start-your-project) for a 30-second walkthrough on how to start & build your new Astro project!

📚 Learn more about Astro's project structure in our [Project Structure guide](/core-concepts/project-structure).  
📚 Learn more about Astro's component syntax in our [Astro Components guide](/core-concepts/astro-components).  
📚 Learn more about Astro's file-based routing in our [Routing guide](core-concepts/astro-pages).

