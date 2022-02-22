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

### Automatic Setup

1. Run one of the following commands in your terminal to start the `create-astro` install wizard.

```shell
# npm
npm init astro

# yarn
yarn create astro

# pnpm
pnpm create astro
```

The installation wizard will allow you to
- Choose from a set of [starter templates](https://github.com/withastro/astro/tree/main/examples) (e.g. basic starter, blog, portfolio, documentation)
- Select which [additional frameworks](/en/core-concepts/component-hydration) (React, Svelte, Vue, Solid, Preact), if any, you would like to include in your project

2. Install your project's dependencies using npm or your package manager of choice.

```bash
# npm
npm install

# yarn
yarn

#pnmp
pnmp install

```

<details>
<summary style="font-weight: bold; font-size: 1.5em;">Prefer to install manually?</summary>

### Manual Install

#### Set up your project

1. Create an empty directory with the name of your project, and then navigate into it.
<br>

```bash
mkdir my-astro-project
cd my-astro-project
```
<br>
2. Run the following command to create a basic <code>package.json</code> file in your project.
<br>

```bash
npm init --yes
```


#### Install Astro

3. Install the Astro project dependencies inside your project.
<br>

```bash
npm install astro
```

<br>
4. Replace the placeholder "scripts" section of your <code>package.json</code> with the following:
<br>

```diff
  "scripts": \{
-    "test": "echo \"Error: no test specified\" && exit 1"
+    "dev": "astro dev",
+    "build": "astro build",
+    "preview": "astro preview"
  },
```

💡 The <code>dev</code> command launches the Astro Dev Server on <code>http://localhost:3000</code>. 
<br>
💡 The <code>build</code> command outputs your project to the <code>dist/</code> directory. 
<br>
📚 Read more about <a href="/en/guides/deploy">deploying Astro</a>.

#### Create your first page

In a text editor, and create a new file in your project:

1. Create a new file at `src/pages/index.astro`
2. Copy-and-paste the following snippet (including `---` dashes) into it.

```astro
---
// JS/TS code written in between the (---) code fences,
// runs only on the server!
console.log('See me in the Terminal')
---

<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>

<style lang='css||scss'>
  body{
    h1{
      color:orange;
    }
  }
</style>

<script>
 // JS Code written here is run in the browser
 console.log('See me in the devTools')
</script>
```

</details>

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

Astro sites are static, so they can be deployed to your favourite host:

- [AWS S3 bucket](https://aws.amazon.com/s3/)
- [Google Firebase](https://firebase.google.com/)
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- [Read more about deploying Astro in our Deploy guide.](/en/guides/deploy)


## Next Steps

Success! Now you're ready to start developing!

📚 Learn more about Astro’s project structure in our [Project Structure guide.](/en/core-concepts/project-structure)

📚 Learn more about Astro’s component syntax in our [Astro Components guide.](/en/core-concepts/astro-components)

📚 Learn more about Astro’s file-based routing in our [Routing guide.](/en/core-concepts/astro-pages)