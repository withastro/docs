---
layout: ~/layouts/Main.astro
---

# Installation

## Dependencies

### Node.js

To use astro you will need to have Node.js installed in your machine. If you don't have it yet, you can download it in the [official site](https://nodejs.org/).

> Important: Astro is built with ESM modules which are not supported in older version of Node.js. The minimum supported version is 14.15.1.

### Package Manager

You also need a package manager to use astro, if you already installed `Node.js` you already have [npm](https://docs.npmjs.com/about-npm).

If you prefer you can also use [yarn](https://yarnpkg.com/getting-started).

## Manual Installation

### Creating your project

- First you have to create a folder / directory for your project:

```bash
mkdir my-astro-project
```

- Go to the folder created

```bash
cd my-astro-project
```

- Create the file to manage your dependencies

```bash
type nul > package.json
```

- Using the editor or IDE of your choice, open the package.json file created in the previous step and add the following scripts:

```json
{
    "scripts": {
        "start": "astro dev",
        "build": "astro build"
    }
}
```

These scripts refer to the different stages of developing an application:

start - Runs `astro dev` which starts the application in development mode
build - Runs `astro build` which builds the application for production environment

- Install astro 

```bash
npm install astro
```

or

```bash
yarn add astro
```

And now you have astro installed and can start implementing your application.