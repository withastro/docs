---
layout: ~/layouts/Main.astro
---

# Installing Astro

Welcome to Astro, we are really excited that you are here and would like to assist you in getting up and started with Astro in no time.

<!--
    Quick Install
    Manual Install
    Troubleshooting
 -->

## Preflight

Before we begin, let us check to make sure that everything is in order.

To use Astro you need to have Node.js already installed and working on your machine. If you haven't got Node.js installed, you can download it from their site.

⚠️ **Important**: Astro is built and uses ESM modules as default. This is only supported from Node versions 12 and above,. However, to use Astro you would need to have at least version `14.16.1` installed on your machine.

You would also need a package manager to install and use Astro.

Node.js ships their own package manager during installation, so you would have **npm** on your system. You are not restricted to using only npm, you can use your preferred package manager if you so wish:
    - [npm](https://docs.npmjs.com/about-npm)
    - [Yarn](https://yarnpkg.com/getting-started)
    - [pnpm](https://pnpm.io/installation)

We ask that your table and chairs and in upright postilions, and you remain seated until after we take-off.

Lastly remember, "Don't Panic, and carry a towel."

That is it for the preflight checks, now we can get you started.

## Quickstart

To quickly get up and running with Astro, simply enter the following commands into your terminal

```bash
# create your project
mkdir new-project-directory
cd new-project-directory
npm init astro || yarn add astro

# install your dependencies
npm install || yarn

# start the dev server and open your browser
npm run start || yarn start
```

👍 You are now good to go with Astro...

##   Astro Setup

You can choose to install Astro via the **CLI**. This way you can kick off with some starter projects or view some demo projects to get familiar with Astro.

First create your directory that we would be deploying Astro in.

```bash
mkdir my-astro-project
```

Inside your directory, we would first install Astro using your preferred package manager:

```bash
npm init astro || yarn add astro
```

You would be asked if you wish to download the Astro packages to the System, enter `Y` to accept.

Next our **CLI tool** would start up to walk you through the rest of installation.

It would ask you which *template* you wish to use, here we have a few options for you to choose from to get started.

- **Starter Kit** - This is our base project that allows you to take Astro and start building anything you wish
- **Blog** - Astro's Blog template. This will let you explore and build your own Astro blogging site
- **Documentation** - Astro's Doc's template, see how Astro builds and creates Documentation Sites
- **Portfolio** - Astro's Portfolio Starter Template. Here  you can experiment and build professional portfolio sites with Astro
<!-- I think we should have guides for each of these templates, perhaps in a template section, with tutorials on building something with each of them, -->

We would recommend to start with the 'Starter Kit' template. This would give us a solid platform to liftoff from.

Astro will begin to create and setup the project files for you, once done you will be prompted with the post-installation next steps.

```bash
  1: npm install (or pnpm install, yarn, etc)
  2: git init && git add -A && git commit -m "Initial commit" (optional step)
  3: npm start (or pnpm, yarn, etc)
```

At this stage, Astro has merely been copied to your new project. We would need to install the Astro dependencies and setup our `node_modules` folder inside the project.

```bash
npm install || yarn
```

This process will first, fetch the required dependencies from the npm registry, and then link and build the packages out for Astro to be able to use.

```bash
git init && git add -A && git commit -m "Initial commit"
```

This step, is optional, we do recommend setting up and adding `git` to the project. This combined command will let you set this up with ease.

Astro adds only two commands to the `scripts` in the `package.json` file:

```js
{
  "scripts": {
    "start": "astro dev",
    "build": "astro build"
  }
}

```
To develop your site in Astro, run the following command:

```bash
npm run start || yarn start || pnpm start
```

It starts the Astro **dev** server. This would start [Snowpack](https://snowpack.dev), which prepares all the Astro dependencies. This is a 'one-time' step and the results of which would be cached for the lifetime of the project.

Once Snowpack has completed its task, you would be able to view the `dev` server at the default address of: `http://127.0.0.1:3000/`

<!-- This would be a great place to tie in an Explore Astro Section or link to -->

To build your Astro project ready for deployment, enter:

```bash
npm run build || yarn build || pnpm build
```

Astro would now build your site and outputs the compiled HTML and assets to the newly created `./dist` directory in your project root. This can then be deployed to any of your favourite hosting provider.

## Manual Installation

If you choose to setup Astro, without the use of Astro's CLI Tool, you can do so. A lot of the setup is similar to the process outlined above, with subtle differences. In this part we will walk you through how to get setup with Astro using good old elbow grease.

- First lets create the directory for your project:

```bash
mkdir my-Astro-project
```

- Navigate into the folder:

```bash
cd my-Astro-project
```

- Create a `package.json` file:

```bash
npm init (-y?) || yarn init 
```
<!-- Can someone check that npm init flag for me plz  -->
- Install Astro:

```bash
npm install astro || yarn add astro || pnpm i astro
```

- Using the editor of your choice, open the `package.json` file created in the previous step and add the following scripts:

```json
{
    "scripts": {
        "start": "astro dev",
        "build": "astro build"
    }
}
```

And now you have Astro setup within your project, so you can start building your application out as you wish.

We would recommend that you read our [**Basic Usage**]() guide next, to give you a better understanding to using Astro in your project.

Welcome onboard Astronaut, we wish you the best of luck Commander 🖖
