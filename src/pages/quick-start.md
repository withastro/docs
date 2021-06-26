---
layout: ~/layouts/Main.astro
title: Quick Start
---

> **Important**: Astro is built with [ESM modules](https://nodejs.org/api/esm.html) which are not supported in older versions of Node.js. The minimum supported version is **14.15.1**.

```bash
# create a project directory
mkdir new-project-directory
cd new-project-directory

npm init astro
# or
yarn init astro

# install dependencies
npm install

# start the dev server and open your browser
npm run start
```

### pnpm

If you are using [pnpm](https://pnpm.io/), add the following to `.npmrc`, which should be at the root of your directory before installing:

`shamefully-hoist = true`

### Yarn

[Yarn](https://yarnpkg.com/) works as a package manager in Astro apps. However, **Yarn 2** changes how module resolution works in Node apps, and doesn't support modules written in ESM at the moment. Since Astro is written entirely in ESM, you can't use Yarn 2 in Astro apps. We'll continue to track Yarn 2 as they fix these code bugs.

### 🚀 Build & Deployment

The default Astro project has the following `scripts` in the `/package.json` file:

```json
{
  "scripts": {
    "start": "astro dev",
    "build": "astro build"
  }
}
```

For local development, run:

```bash
npm run start
# or
yarn start
```

To build for production, run the following command:

```bash
npm run build
# or
yarn build
```

To deploy your Astro site to production, upload the contents of `/dist` to your favorite static site host.
