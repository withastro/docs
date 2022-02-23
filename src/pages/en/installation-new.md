---
layout: ~/layouts/MainLayout.astro
title: Installation
description: How to install Astro with NPM, PNPM, or Yarn.
---
## Prerequisites

- **Node.js** - `14.15.0`, `v16.0.0`, or higher.
- **Text editor** - We recommend [VS Code](https://code.visualstudio.com/) with our [Official Astro extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).
- **Terminal** - Astro is mainly accessed via the terminal’s command-line.

## Install Astro

1. Run one of the following commands in your terminal to start the `create-astro` install wizard.

```shell
# npm
npm init astro

# yarn
yarn create astro

# pnpm
pnpm create astro
```

The installation wizard will allow you to choose from a set of [starter templates](https://github.com/withastro/astro/tree/main/examples) (e.g. basic starter, blog, portfolio, documentation). 

Depending on the template chosen, you may also be asked to select which [additional frameworks](/en/core-concepts/component-hydration) (React, Svelte, Vue, Solid, Preact), if any, you would like to include in your project. (Additional frameworks can also be added manually later.)

2. Install your project's dependencies using npm or your package manager of choice.

```bash
# npm
npm install

# yarn
yarn

#pnmp
pnmp install

```

## Start Astro

Start astro in development mode using the command for your package manager.

```bash
# npm
npm run dev

#yarn
yarn start

#pnpm
pnpm run dev
```

Astro will now start serving your application on `http://localhost:3000`. The server will listen for live file changes in your `src/` directory, so you do not need to restart the application as you make changes during development.

## Build Astro

Built your static site to `dist/` using the command for your package manager.

```bash
# npm
npm run build

#yarn
yarn build

#pnpm
pnpm run build
```

## Deploy your project

Astro sites are static, so they can be deployed to [Netlify](https://www.netlify.com/) or another host:

- [Vercel](https://vercel.com/)
- [AWS S3 bucket](https://aws.amazon.com/s3/)
- [Google Firebase](https://firebase.google.com/)

Read more about deploying Astro in our [Deploy guide.](/en/guides/deploy)

🛠️ You can also see instructions for [manual setup](/en/guides/manual-setup-new).

## Next Steps

Success! Now you're ready to start developing!

📚 Learn more about Astro’s project structure in our [Project Structure guide.](/en/core-concepts/project-structure)

📚 Learn more about Astro’s component syntax in our [Astro Components guide.](/en/core-concepts/astro-components)

📚 Learn more about Astro’s file-based routing in our [Routing guide.](/en/core-concepts/astro-pages)