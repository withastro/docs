---
setup: |
    import { Markdown } from 'astro/components'
layout: ~/layouts/MainLayout.astro
title: Installation
description: How to install Astro with NPM, PNPM, or Yarn.
---
Use npm, pnpm or yarn to create and set up a new Astro project locally!


## Prerequisites

- **Node.js** - `14.15.0`, `v16.0.0`, or higher.
- **Text editor** - We recommend [VS Code](https://code.visualstudio.com/) with our [Official Astro extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).
- **Terminal** - Astro is accessed through its command-line interface (CLI).

## Create Your Project

<div class="install-container">
    <div id="install-quick" class="active-toggle" style="padding: 1.5em; padding-bottom:0.5em; cursor: pointer;">
        <h5>Quick Setup with <code>create-astro</code></h5>
    </div>
    <div id="install-manual" class="" style="padding: 1.5em; padding-bottom:0.5em; cursor:pointer;">
        <h5>Manual Setup</h5>
    </div>
</div>

<div id="quick" class="install">

#### 1. Create your project

Run one of the following commands in your terminal to start our handy install wizard, `create-astro`. This will walk you through creating your very first Astro project in whatever directory you run it in.

```shell
# npm
npm init astro

# yarn
yarn create astro

# pnpm
pnpm create astro
```


If `create-astro` starts successfully, you will see a short list of starter templates to choose from: 
- `starter`: A great starter template for anyone wanting to explore Astro.
- `minimal`: A template that just includes the bare minimium to get started.
- `blog, portfolio, docs, etc`: opinionated themes for specific use-cases.

If you choose the `starter` template, you will also be asked to select which [additional frameworks](/en/core-concepts/framework-components) (React, Svelte, Vue, Solid, Preact), if any, you would like to include in your project. (Additional frameworks can also be added manually later.)

> 💡 Or, you can install any of our [many starter templates](https://github.com/withastro/astro/tree/main/examples) directly via the command line: 
```shell
# npm
npm init astro -- --template framework-svelte

# yarn
yarn create astro -- --template with-nanostores

# pnpm
pnpm create astro -- --template with-tailwindcss
```

#### 2. Install

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

</div>

<div id="manual" class=" install hidden-toggle"">

If you do not wish to use a [starter template](https://github.com/withastro/astro/tree/main/examples), you can install Astro dependencies manually and create a new project with a `package.json` file, `index.astro` and `astro.config.mjs`.

#### 1. Create your directory

Create an empty directory with the name of your project, and then navigate into it.

```bash
mkdir my-astro-project
cd my-astro-project
```

Once you are in your new directory, create your project `package.json` file. This is how you will manage your project dependencies, including Astro. If you aren't familiar with this file format, run the following command to create one.

```bash
npm init --yes
```


#### 2. Install Astro

First, install the Astro project dependencies inside your project.

```bash
npm install astro
```

Then, replace any placeholder "scripts" section of your `package.json` with the following:

```diff
  "scripts": \{
-    "test": "echo \"Error: no test specified\" && exit 1"
+    "dev": "astro dev",
+    "build": "astro build",
+    "preview": "astro preview"
  },
```

You'll use these scripts later in the guide to start Astro and run its different commands.

#### 3. Create your first page

In your text editor, create a new file in your directory at `src/pages/index.astro`. This will be your first Astro page in the project. 

For this guide, copy-and-paste the following code snippet (including `---` dashes) into your new file:

```astro
---
// Welcome to Astro! Everything between these "---" code fences
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

#### 4. Create your first static asset

You will also want to create a `public/` directory to store your static assets. Astro will always include these assets in your final build, so you can safely reference them from inside your component templates.

In your text editor, create a new file in your directory at `public/robots.txt`. `robots.txt` is a simple file that most sites will include to tell search bots like Google how to treat your site.

For this guide, copy-and-paste the following code snippet into your new file:

```
# Example: Allow all bots to scan and index your site. 
# Full syntax: https://developers.google.com/search/docs/advanced/robots/create-robots-txt
User-agent: *
Allow: /
```

#### 5. Create astro.config.mjs

Astro is configured using `astro.config.mjs`. This file is optional if you do not need to configure Astro, but you may wish to create it now. 

Create `astro.config.mjs` at the root of your project, and copy the code below into it:

```
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({});
```

If you want to include [UI framework components](/en/core-concepts/framework-components/) such as React, Svelte, etc. or use other tools such as Tailwind or Partytown in your project, here is where you will [manually import and configure integrations](/en/guides/integrations-guide).

📚 Read Astro's [API configuration reference](/en/reference/configuration-reference/) for more information.

#### 6. Next steps

If you have followed the steps above, your project directory should now look like this:

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

Congratulations, you're now set up to use Astro!
</div>

-----

## Start Astro ✨

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

## Deploy to the web

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
