---
layout: ~/layouts/Main.astro
title: Installation
---

There are a few ways to get started with Astro. Outlined below are instructions on how to go about setting up Astro either manually or by using the Astro Installer.

## System Requirements

- **Node.js** - [`v12.20.0`](https://nodejs.org/en/download/releases/), [`v14.13.1`](https://nodejs.org/en/download/), [`v16.0.0`](https://nodejs.org/en/download/current/), or higher.
- **Text Editor** - We recommend [VS Code](https://code.visualstudio.com/) with our own [Astro extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) for the complete Developer Experience.
- **Terminal** - Astro is mainly accessed by the terminal's Command Line Interface (CLI).

## create-astro

Astro has its own unique Installer named [`create-astro`](https://github.com/snowpackjs/astro/tree/main/packages/create-astro). It works by setting up scaffolding for your Astro Projects, using either the predefined Install options or templates from our [Official Astro Templates](https://github.com/snowpackjs/astro/tree/main/examples)

```shell
# With NPM
npm init astro

# Yarn
yarn create astro
```

`create-astro` automatically runs in interactive mode, but you can also specify your project name and template with command line arguments.

```bash
# npm 6.x
npm init astro my-astro-project --template [EXAMPLE_NAME]

# npm 7+, extra double-dash is needed:
npm init astro my-astro-project -- --template [EXAMPLE_NAME]

# yarn
yarn create astro my-astro-project --template [EXAMPLE_NAME]
```

You can also use any Github repo as a template

```bash
npm init astro my-astro-project -- --template [GITHUB_USER]/[REPO_NAME]
```

Paths to examples nested inside of a repo are also supported:

```bash
npm init astro --template [GITHUB_USER]/[REPO_NAME]/path/to/example
```

The `create-astro` installer is a novel mechanism for getting up and started with Astro. With our Installer you can work on various repo's and projects effortlessly.

## Manual Install

For those who wish to setup Astro, without the use of our `create-astro` Installer, can do so using a more manual approach.

For the purposes of the illustrations provided throughout our documentation, we use [`npm`](https://www.npmjs.com/) as the default package manager.

You can however choose to use whichever package manager that you prefer. For further information on using alternative package managers with Astro, [click here]().
<!-- TODO: link to a pkg mngr page  -->
### Set up your project

Create an empty directory with the name of your project, and then navigate into it:

```bash
mkdir my-astro-project

cd my-astro-project 
```

Astro is designed to work with the entire npm ecosystem, which is managed completely by the `package.json` project manifest.

```bash
# To skip the package manifest questionnaire use flag --yes
npm init [--yes]
```

With your directory and `package.json` file setup. You can now install Astro in your project.

### Install Astro

```bash
npm install astro
```

This command pulls Astro from the npm registry and saves it as a direct dependency inside your project manifest.

To use Astro add the following within the "scripts" section of your `package.json` file.

```diff
  "scripts": {
-    "test": "echo \"Error: no test specified\" && exit 1"
+    "start": "astro dev",
+    "build": "astro build",
  },
```

You can [configure](/reference/configuration-reference.md) Astro even further to work with your preferred type of [UI Framework's]() or [Style System](/integrations/styles-and-css-libraries).

<!-- TODO: Create a Page for the UI Frameworks, there isn't really one that talks about the whole BYOF  -->

### Project Structure

Astro purposely tries to be as unopinionated as it can be. That being said Astro behaves expectedly when certain project requirements are met.

We recommend starting out by creating an `./src` folder in your project with the following structure:

```bash
├── src/
│   ├── components/
│   └── pages/
│       └── index.astro
├── public/
└── package.json
```

- `./src/components/*` : where your reusable components go. You can place these anywhere, but we recommend having single folder to keep them organized.
- `./src/pages/*` : this is a special folder responsible for [routing](/core-concepts/astro-pages) your Astro Project.

### Create your first Astro page

`.astro` files are HTML files combined with JSX. It is a very intuitive format to express yourself in. The code block below displays an example of atypical Astro file.

```astro
---
// 1. Create a new file at ./src/pages/index.astro
// 2. Copy-and-paste this entire file (including `---` dashes) into it.
const welcome:string = "Hello World"
---

<!-- HTML & JSX -->
<html>
  <body>
    <h1>{welcome}</h1>
  </body>
</html>

<!-- Styles -->
<style lang='scss'>
  body{
    h1{
      color:'blue';
    }
  } 
</style>
```



First we have a `frontmatter`  **code fence** this is distinguished by the three-dashes (`---`). Inside this code fence we can place our server-side JavaScript or TypeScript code.

Underneath which we place our HTML and even use JSX to enhance the Astro Component's functionality.

Styling the component directly in the same Astro file! Using either standard CSS or SASS for your styling needs. Further information on Styling in Astro can be found [here](/guides/styling)

## Start Astro

To launch Astro's **dev** server, simply enter:

```bash
npm start
```

Astro would serve your application on [http://localhost:3000](http://localhost:3000).

Astro's Development Server provides you with all the expected developer features. Functionality such as fast load times and live-reloading, lets you effortlessly develop your Astro projects.

### Next Steps

Congratulations, you are now ready to start developing with Astro!

To help you on your way to getting the most from Astro, we highly recommend exploring our documentation further.

📚 Learn more about Astro's project structure in our [Project Structure guide](/core-concepts/project-structure).  
📚 Learn more about Astro's component syntax in our [Astro Components guide](/core-concepts/astro-components).  
📚 Learn more about Astro's file-based routing in our [Routing guide](core-concepts/astro-pages).
