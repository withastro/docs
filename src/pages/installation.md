---
layout: ~/layouts/Main.astro
title: Installation
---

There are a few different ways to install

## Prerequisites

- **Node.js** - `v12.20.0`, `v14.13.1`, `v16.0.0`, or higher.
- **A text editor** - We recommend [VS Code](https://code.visualstudio.com/) with the [Astro extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).
- **A terminal** - Astro is mainly accessed by terminal command-line.


## create-astro

Astro has its own unique Installer named : `create-astro`. The Installer helps assist you by setting up scaffolding for your Astro Projects. 
<!-- TODO: Link to the Project Starter Templates page once it is written up -->

```shell
# With NPM
npm init astro

# Yarn
yarn create astro
```

[`create-astro`](https://github.com/snowpackjs/astro/tree/main/packages/create-astro) will setup and deploy your project using Astro's own recommended [Project Structure](/core-concepts/project-structure). 

Letting you too fully explore the capabilities and possibilities that Astro brings to you.

Once completed, jump over to our [Quickstart Guide](/quick-start#start-your-project) for a 30-second walkthrough on how to start & build your new Astro project!

## Manual Install

### Set up your project

Create an empty directory with the name of your project, and then navigate into it:

```bash
mkdir <project-name>
cd <project-name>
# Note: Replace <project-name> with the name of your project.
```

Create a new `package.json` file for your project. Astro is designed to work with the npm ecosystem of packages, which is managed in a `package.json` project manifest. If you don't know what the `package.json` file is, we highly recommend you to have a quick read on [the npm documentation](https://docs.npmjs.com/creating-a-package-json-file).

```bash
# This command will create a basic package.json for you
npm init --yes
```

### Install Astro

If you've followed the instructions above, you should have a directory with a single `package.json` file inside of it. You can now install Astro in your project.

We'll use `npm` in the examples below, but you could also use `yarn` or `pnpm` if you prefer an npm alternative. If you aren't familiar with `yarn` or `pnpm`, then we strongly recommend sticking with `npm`.

```bash
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

You can [configure](/reference/configuration-reference.md) Astro even further to work with your preferred type of [UI Framework's]() or [Style System](/integrations/styles-and-css-libraries).

<!-- TODO: Create a Page for the UI Frameworks, there isn't really one that talks about the whole BYOF  -->

### Project Structure

Astro purposely tries to be as unopinionated as it can be. That being said Astro behaves expectedly when certain project requirements are met.

Open up your favorite text editor, and create a new file in your project:

```astro

---<!--Start of Astro Code Fence-->
// 1. Create a new file at ./src/pages/index.astro
// 2. Copy-and-paste this entire file (including `---` dashes) into it.
---<!--End of Astro Code Fence-->

<!-- HTML & JSX -->
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>

<!-- Styles -->
<style lang='scss'>
  body{
    h1{
      color:'blue';
    }
  } 
```

`.astro` files are HTML files combined with JSX. It is a very intuitive format to express yourself in. The code block above displays an example of a typical Astro file would comprise of.

First we have a `frontmatter` **code fence** this is distinguished by the three-dashes (`---`). Inside this code fence we can place our server-side JavaScript or TypeScript code.

Underneath we can place our HTML and even use JSX to enhance the Astro Component's functionality. Placing our Styles for the component directly into the same Astro file, using either standard CSS or SASS for our styling needs. Further information on Styling in Astro can be found [here](/guides/styling)

## Start Astro

To launch Astro's **dev** server, simply enter:

```bash
npm start
```

Astro would serve your application on [http://localhost:3000](http://localhost:3000).

Astro's Development Server provides you with all the tools that you need to work effortlessly with functionality such as live-reloading, and serving files from your `src/` instantly.

### Next Steps

Congratulations, you are now ready to start developing!

There is still a few more things that we would like to brief you about Astro to help you on your way to getting the most out of Astro for your projects. 

We highly recommend that you keep reading our documentation to get a better understanding

📚 Learn more about Astro's project structure in our [Project Structure guide](/core-concepts/project-structure).  
📚 Learn more about Astro's component syntax in our [Astro Components guide](/core-concepts/astro-components).  
📚 Learn more about Astro's file-based routing in our [Routing guide](core-concepts/astro-pages).
