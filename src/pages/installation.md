---
layout: ~/layouts/Main.astro
title: Installation
---

There are a few different ways to install

## Prerequisites

- **Node.js** - `v12.20.0`, `v14.13.1`, `v16.0.0`, or higher.
- **A text editor** - We recommend [VS Code](https://code.visualstudio.com/) with the [Astro extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).
- **A terminal** - Astro is mainly accessed by terminal command-line.

## Recommended Install

`npm init astro` is the easiest way to install Astro in a new project. Visit the [Quickstart guide](/quick-start) for a 30-second walkthrough to get up and running with Astro.

## Manual Install

### Set up your project

Create an empty directory with the name of your project, and then navigate into it:

```
mkdir <project-name>
cd <project-name>
# Note: Replace <project-name> with the name of your project.
```

Create a new `package.json` file for your project. Astro is designed to work with the npm ecosystem of packages, which is managed in a `package.json` project manifest. If you don't know what the `package.json` file is, we highly recommend you to have a quick read on [the npm documentation](https://docs.npmjs.com/creating-a-package-json-file).

```
# This command will create a basic package.json for you
npm init --yes
```

### Install Astro

If you've followed the instructions above, you should have a directory with a single `package.json` file inside of it. You can now install Astro in your project. 

We'll use `npm` in the examples below, but you could also use `yarn` or `pnpm` if you prefer an npm alternative. If you aren't familiar with `yarn` or `pnpm`, then we strongly recommend sticking with `npm`.

```
npm install astro
```

You can now replace the placeholder "scripts" section of your `package.json` file that `npm init` created for you with the following:

```diff
  "scripts": {
-    "test": "echo \"Error: no test specified\" && exit 1"
+    "start": "astro dev",
+    "build": "astro build",
  },
}
```

### Create your first page

Open up your favorite text editor, and create a new file in your project:

```astro
---
// 1. Create a new file at <project-directory>/src/pages/index.astro
// 2. Copy-and-paste this entire file (including `-` dashes) into it.
---
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
```

📚 Learn more about Astro's project structure in our [Project Structure guide](/core-concepts/project-structure).  
📚 Learn more about Astro's component syntax in our [Astro Components guide](/core-concepts/astro-components).


### Create a second page

You can create more pages in the `src/pages` directory, and Astro will automatically host them, using the file name to create your routes. Create a new file at `src/pages/about.astro` (you can reuse the previous snippet) and then visit [http://localhost:3000/about](http://localhost:3000/about) in your browser to see the page.

📚 Learn more about Astro's file-based routing in our [Routing guide](core-concepts/astro-pages).


## Start your project

Go back to your command-line terminal, and run the following command in your project directory:

```
npm start
```

Your application is now running on [http://localhost:3000](http://localhost:3000). Open this URL in your browser and you should see the text "Hello, World" that we copied in the previous step.

Astro will listen for file changes in your `src/` directory, so you do not need to restart the application as you make changes during development.


## Build your project

Go back to your command-line terminal, and run the following command in your project directory:

```
npm run build
```

This will build your site and write it to disk in the `dist/` directory. Astro sites are static, so they can be deployed to your favorite host (Vercel, Netlify, an S3 bucket, etc.).