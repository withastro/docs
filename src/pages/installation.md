---
layout: ~/layouts/Main.astro
title: Installation
---

There are a few ways to get started with Astro. Outlined below are instructions on how to go about setting up Astro either manually or by using the Astro Installer.

## System Requirements

- **Node.js** - [`v12.20.0`](https://nodejs.org/en/download/releases/), [`v14.13.1`](https://nodejs.org/en/download/), [`v16.0.0`](https://nodejs.org/en/download/current/), or higher.
- **Text Editor** - We recommend [VS Code](https://code.visualstudio.com/) with our own [Astro extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) for the complete Developer Experience.
- **Terminal** - Astro is mainly accessed by the terminal's Command Line Interface (CLI).

## Quick Start

You can get started quickly with Astro. The following CLI instructions would help you get started with one of our Official Astro [Starter Templates]() 
<!-- TODO: Link to the Project Starter Templates page once it is written up -->

```shell
# Make a new project directory & navigate "cd" into it "$_"
mkdir <project_name> && cd $_

# Prepare for liftoff...
npm init astro

# Install dependencies
npm install

# Start developing!
npm run start

# Launch when ready: Build your static site to `./dist`
npm run build
```

The Astro CLI Installer will setup and deploy your project using Astro's own recommended [Project Structure](/core-concepts/project-structure). Letting you too fully explore the capabilities and possibilities that Astro brings to you.

## Self Install

You can setup Astro without the aide of the Astro Installer. Similar to the actions above, here we will elaborate a bit further with each step to help you understand the installation process a lot better.

### Set up your project

Create an empty directory with the name of your project, and then enter the project:

```bash
# Note: Replace <project-name> with the name of your project.
mkdir <project-name> 
cd <project-name> || cd $_ 
```

Astro is designed to work with the entire [npm](https://www.npmjs.com/) ecosystem, which is managed completely by the `package.json` project manifest.

To create a new [`package.json`](https://docs.npmjs.com/creating-a-package-json-file) file for your project, run the following command:

```bash
# To skip the package manifest questionnaire use flag --yes
npm init (--yes)
```

Once your directory and `package.json` file is setup. You can now install Astro in your project.

For the purposes of the illustrations provided throughout our documentation, we will use [`npm`](https://www.npmjs.com/) as the default package manager.

You can however choose to use whichever package manager that you prefer. For further information on using alternative package managers with Astro, [click here]().

<!-- TODO: Create an installers page to explain the use of alternative pkg mngrs  -->

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

Astro purposely trys to be as unopinionated as it can be. That being said Astro behaves expectedly when certain project requirements are met.

We recommend starting out by creating an `./src` folder in your project with the following structure:

```
├── src/
│   ├── components/
│   └── pages/
│       └── index.astro
├── public/
└── package.json
```

- `./src/components/*` : where your reusable components go. You can place these anywhere, but we recommend having single folder to keep them organized.
- `./src/pages/*` : this is a special folder responsible for [routing](/core-concepts/astro-pages) your Astro Project.

You can create pages in the `src/pages` directory, and Astro will use the filename to create new pages on your site. For example, if you create a new file at `src/pages/about.astro` (reusing the previous snippet), Astro will generate a new page at the `/about` URL.

### Create your first Astro page

Open up your favourite text editor, and create a new file inside your project:

```astro
---
// 1. Create a new file at ./src/pages/index.astro
// 2. Copy-and-paste this entire file (including `---` dashes) into it.
---
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>

<style lang='scss'>
  body{
    h1{
      color:'blue';
    }
  } 
```

`.astro` files are HTML files combined with JSX. It is a very intuitive format to express yourself in. The code block above displays an example of a typical Astro file would comprise of. 

First we have a `frontmatter` **code fence** this is distinguished by the three-dashes (`---`). Inside this code fence we can place our server-side JavaScript or TypeScript code.

Underneath we can place our HTML and even use JSX to enhance the Astro Component's functionality. Placing our Styles for the component directly into the same Astro file, using either standard CSS or SASS for our styling needs.

### Next Steps

Congratulations, you are now ready to start developing!

There is still a few more things that we would like to brief you about Astro to help you on your way to getting the most out of Astro for your projects. 

We highly recommend that you keep reading our documentation to get a better understanding


📚 Learn more about Astro's project structure in our [Project Structure guide](/core-concepts/project-structure).  
📚 Learn more about Astro's component syntax in our [Astro Components guide](/core-concepts/astro-components).  
📚 Learn more about Astro's file-based routing in our [Routing guide](core-concepts/astro-pages).
