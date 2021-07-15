---
layout: ~/layouts/Main.astro
title: Quick Start
---

## System Requirements

- **Node.js** - [`v12.20.0`](https://nodejs.org/en/download/releases/), [`v14.13.1`](https://nodejs.org/en/download/), [`v16.0.0`](https://nodejs.org/en/download/current/), or higher.
- **Text Editor** - We recommend [VS Code](https://code.visualstudio.com/) with our own [Astro extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) for the complete Developer Experience.
- **Terminal** - Astro is mainly accessed by the terminal's Command Line Interface (CLI).


Getting started with Astro is a very quick and straightforward process. The following CLI instructions would help you get setup using our own [`create-astro`](https://github.com/snowpackjs/astro/tree/main/packages/create-astro) Installer.

```shell
# prerequisite: check that Node.js is 12.20.0+, 14.13.1+, or 16+
node --version

# create a new project directory, and `cd` into it
mkdir <project name> && cd $_

# prepare for liftoff...
npm init astro

# install dependencies
npm install

# start developing!
npm run start

# when you're ready: build your static site to `dist/`
npm run build
```

## Start your project

Inside you project directory, enter the following launch command into your terminal:

```bash
npm start
```

Your application is now running on [http://localhost:3000](http://localhost:3000). Open this URL in your browser and you should see the welcoming text "Hello, World".

Astro will listen for file changes in your `src/` directory, so you do not need to restart the application as you make changes during development.

## Build your project

To build your project, from inside your directory enter the following build command into your terminal:

```bash
npm run build
```

This will instruct Astro to build your site and save it directly to disk. Your application is now ready in the `dist/` directory.

Astro sites are static, so they can be deployed to your favourite host:

- Vercel,
- Netlify,
- S3 bucket,
- Google Firebase
- More...

Further information on deploying your Astro Site can be found [here](/guides/deploy)