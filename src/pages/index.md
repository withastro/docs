---
layout: ~/layouts/Main.astro
---


<img src="https://github.com/snowpackjs/astro/blob/main/assets/social/banner.png?raw=true" alt="Astro" width="638" height="320" >

## What is Astro?

**Astro** is a _fresh but familiar_ approach to building websites. Astro combines proven performance and best practices along with modern DX improvements from the new component-oriented ESM era.

With Astro, you can use your favourite JavaScript framework and automatically ship the bare-minimum amount of JavaScript — by default, which is preferably none at all!

## Project Status

⚠️ **Astro is still an early beta, missing features and bugs are to be expected!** If you can stomach it, then Astro-built sites are production ready and several production websites built with Astro already exist in the wild. We will update this note once we get closer to a stable, v1.0 release.

Here are a few production websites already built with Astro existing in the wild right now.

<!-- I think we should include a few links to a couple of astro sites, if we know of any-->

- [Snowpack.dev](https://www.snowpack.dev)

As we get closer to launching Astro `v.1.0` we will be updating this section with more information. You can stay in touch by following us on [Twitter](https://twitter.com/astrodotbuild) or joining us on our own [Discord channel](https://t.co/oD9FVTRY9E?amp=1)

## 🔧 Quick Start

> __Important__: Astro is built with [ESM modules](https://nodejs.org/api/esm.html). The minimum supported version of [Node.js](https://nodejs.org) that allows you to use Astro is [__14.16.1__](https://nodejs.org/en/download/). To find out ways to upgrade Node.js you can find out more [here](https://github.com/nvm-sh/nvm)

```bash
# create your project
mkdir new-project-directory
cd new-project-directory
npm init astro

# install your dependencies
npm install

# start the dev server and open your browser
npm start
```

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

```
npm run start
```

To build for production, run the following command:

```
npm run build
```

To deploy your Astro site to production, upload the contents of `/dist` to your favourite static site host.
