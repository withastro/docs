---
title: Working with integrations
description: Learn how to add, configure, and build integrations for your Astro project.
i18nReady: true
---

import IntegrationsNav from '~/components/IntegrationsNav.astro';
import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro';
import { Steps } from '@astrojs/starlight/components';
import { FileTree } from '@astrojs/starlight/components';

**Astro integrations** add new functionality and behaviors for your project with only a few lines of code. You can use an official integration, [integrations built by the community](#finding-more-integrations) or even [build a custom integration yourself](#building-your-own-integration).

Integrations can…

- Unlock React, Vue, Svelte, Solid, and other popular UI frameworks with a [renderer](/en/guides/framework-components/).
- Enable on-demand rendering with an [SSR adapter](/en/guides/on-demand-rendering/).
- Integrate tools like MDX, and Partytown with a few lines of code.
- Add new features to your project, like automatic sitemap generation.
- Write custom code that hooks into the build process, dev server, and more.

:::tip[Integrations directory]
Browse or search the complete set of hundreds of official and community integrations in our [integrations directory](https://astro.build/integrations/). Find packages to add to your Astro project for authentication, analytics, performance, SEO, accessibility, UI, developer tools, and more.
:::

## Official integrations

The following integrations are maintained by Astro.

<IntegrationsNav />

## Automatic integration setup

Astro includes an `astro add` command to automate the setup of official integrations. Several community plugins can also be added using this command. Please check each integration's own documentation to see whether `astro add` is supported, or whether you must [install manually](#manual-installation).

Run the `astro add` command using the package manager of your choice and our automatic integration wizard will update your configuration file and install any necessary dependencies.

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  npx astro add react
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  pnpm astro add react
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  yarn astro add react
  ```
  </Fragment>
</PackageManagerTabs>

It's even possible to add multiple integrations at the same time!

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  npx astro add react sitemap partytown
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  pnpm astro add react sitemap partytown
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  yarn astro add react sitemap partytown
  ```
  </Fragment>
</PackageManagerTabs>

:::note[Handling integration dependencies]
If you see any warnings like `Cannot find package '[package-name]'` after adding an integration, your package manager may not have installed [peer dependencies](https://nodejs.org/en/blog/npm/peer-dependencies/) for you. To install these missing packages, run the following command:

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  npm install [package-name]
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  pnpm add [package-name]
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  yarn add [package-name]
  ```
  </Fragment>
</PackageManagerTabs>
:::

### Manual installation

Astro integrations are always added through the `integrations` property in your `astro.config.mjs` file.

There are three common ways to import an integration into your Astro project:

1. [Install an npm package integration](#installing-an-npm-package).
2. Import your own integration from a local file inside your project.
3. Write your integration inline, directly in your config file.

    ```js
    // astro.config.mjs
    import { defineConfig } from 'astro/config';
    import installedIntegration from '@astrojs/vue';
    import localIntegration from './my-integration.js';

    export default defineConfig({
      integrations: [
        // 1. Imported from an installed npm package
        installedIntegration(),
        // 2. Imported from a local JS file
        localIntegration(),
        // 3. An inline object
        { name: 'namespace:id', hooks: { /* ... */ } },
      ]
    });
    ```

Check out the [Integration API](/en/reference/integrations-reference/) reference to learn all of the different ways that you can write an integration.

#### Installing an npm package

Install an npm package integration using a package manager, and then update `astro.config.mjs` manually.

For example, to install the `@astrojs/sitemap` integration:

<Steps>
1. Install the integration to your project dependencies using your preferred package manager:

   <PackageManagerTabs>
     <Fragment slot="npm">
     ```shell
     npm install @astrojs/sitemap
     ```
     </Fragment>
     <Fragment slot="pnpm">
     ```shell
     pnpm add @astrojs/sitemap
     ```
     </Fragment>
     <Fragment slot="yarn">
     ```shell
     yarn add @astrojs/sitemap
     ```
     </Fragment>
   </PackageManagerTabs>

2. Import the integration to your `astro.config.mjs` file, and add it to your `integrations[]` array, along with any configuration options:

    ```js title="astro.config.mjs" ins={2} ins="sitemap()"
    import { defineConfig } from 'astro/config';
    import sitemap from '@astrojs/sitemap';

    export default defineConfig({
      // ...
      integrations: [sitemap()],
      // ...
    });
    ```

    Note that different integrations may have different configuration settings. Read each integration's documentation, and apply any necessary config options to your chosen integration in `astro.config.mjs`.
</Steps>

### Custom options

Integrations are almost always authored as factory functions that return the actual integration object. This lets you pass arguments and options to the factory function that customize the integration for your project.

```js
integrations: [
  // Example: Customize your integration with function arguments
  sitemap({ filter: true })
]
```

### Toggle an integration

Falsy integrations are ignored, so you can toggle integrations on & off without worrying about left-behind `undefined` and boolean values.

```js
integrations: [
  // Example: Skip building a sitemap on Windows
  process.platform !== 'win32' && sitemap()
]
```

## Upgrading integrations

To upgrade all official integrations at once, run the `@astrojs/upgrade` command. This will upgrade both Astro and all official integrations to their latest versions.

### Automatic upgrading

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  # Upgrade Astro and official integrations together to latest
  npx @astrojs/upgrade
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  # Upgrade Astro and official integrations together to latest
  pnpm dlx @astrojs/upgrade
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  # Upgrade Astro and official integrations together to latest
  yarn dlx @astrojs/upgrade
  ```
  </Fragment>
</PackageManagerTabs>

### Manual upgrading

To upgrade one or more integrations manually, use the appropriate command for your package manager.

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  # Example: upgrade React and Partytown integrations
  npm install @astrojs/react@latest @astrojs/partytown@latest
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  # Example: upgrade React and Partytown integrations
  pnpm add @astrojs/react@latest @astrojs/partytown@latest
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  # Example: upgrade React and Partytown integrations
  yarn add @astrojs/react@latest @astrojs/partytown@latest
  ```
  </Fragment>
</PackageManagerTabs>

## Removing an integration

<Steps>
1. To remove an integration, first uninstall the integration from your project.

    <PackageManagerTabs>
      <Fragment slot="npm">
      ```shell
      npm uninstall @astrojs/react
      ```
      </Fragment>
      <Fragment slot="pnpm">
      ```shell
      pnpm remove @astrojs/react
      ```
      </Fragment>
      <Fragment slot="yarn">
      ```shell
      yarn remove @astrojs/react
      ```
      </Fragment>
    </PackageManagerTabs>

2. Next, remove the integration from your `astro.config.*` file:

    ```js title="astro.config.mjs" del={2,6}
    import { defineConfig } from 'astro/config';
    import react from '@astrojs/react';

    export default defineConfig({
      integrations: [
        react()
      ]
    });
    ```
</Steps>

## Finding more integrations

You can find many integrations developed by the community in the [Astro Integrations Directory](https://astro.build/integrations/). Follow links there for detailed usage and configuration instructions.

## Building your own integration

Astro's Integration API is inspired by Rollup and Vite, and designed to feel familiar to anyone who has ever written a Rollup or Vite plugin before.

Check out the [Integration API](/en/reference/integrations-reference/) reference to learn what integrations can do and how to write one yourself.

## Publishing your integration to npm

Publishing an Astro component is a great way to reuse your existing work across your projects, and to share with the wider Astro community at large. Astro components can be published directly to and installed from npm, just like any other JavaScript package.

Looking for inspiration? Check out some of our favorite [themes](https://astro.build/themes/) and [components](https://astro.build/integrations/) from the Astro community. You can also [search npm](https://www.npmjs.com/search?q=keywords:astro-component,withastro) to see the entire public catalog.

:::tip[Don't want to go it alone?]
Check out [Astro community's component template](https://github.com/Princesseuh/component-template) for a community-supported, out-of-the-box template!
:::

### Quick start

To get started developing your component quickly, you can use a template already set up for you.

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  # Initialize the Astro Component template in a new directory
  npm create astro@latest my-new-component-directory -- --template component
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  # Initialize the Astro Component template in a new directory
  pnpm create astro@latest my-new-component-directory -- --template component
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  # Initialize the Astro Component template in a new directory
  yarn create astro my-new-component-directory --template component
  ```
  </Fragment>
</PackageManagerTabs>

### Creating a package

:::note[Prerequisites]
Before diving in, it will help to have a basic understanding of:

- [Node Modules](https://docs.npmjs.com/creating-node-js-modules)
- [Package Manifest (`package.json`)](https://docs.npmjs.com/creating-a-package-json-file)
- [Workspaces](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#workspaces)
:::

To create a new package, configure your development environment to use **workspaces** within your project. This will allow you to develop your component alongside a working copy of Astro.

<FileTree>
- my-new-component-directory/
  - demo/
    - ... for testing and demonstration
  - package.json
  - packages/
    - my-component/
      - index.js
      - package.json
      - ... additional files used by the package
</FileTree>

This example, named `my-project`, creates a project with a single package, named `my-component`, and a `demo/` directory for testing and demonstrating the component.

This is configured in the project root's `package.json` file:

```json
{
  "name": "my-project",
  "workspaces": ["demo", "packages/*"]
}
```

In this example, multiple packages can be developed together from the `packages` directory. These packages can also be referenced from `demo`, where you can install a working copy of Astro.

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  npm create astro@latest demo -- --template minimal
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  pnpm create astro@latest demo -- --template minimal
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  yarn create astro demo --template minimal
  ```
  </Fragment>
</PackageManagerTabs>

There are two initial files that will make up your individual package: `package.json` and `index.js`.

#### `package.json`

The `package.json` in the package directory includes all of the information related to your package, including its description, dependencies, and any other package metadata.

```json
{
  "name": "my-component",
  "description": "Component description",
  "version": "1.0.0",
  "homepage": "https://github.com/owner/project#readme",
  "type": "module",
  "exports": {
    ".": "./index.js",
    "./astro": "./MyAstroComponent.astro",
    "./react": "./MyReactComponent.jsx"
  },
  "files": ["index.js", "MyAstroComponent.astro", "MyReactComponent.jsx"],
  "keywords": ["astro-component", "withastro", "... etc", "... etc"]
}
```

##### `description`

A short description of your component used to help others know what it does.

```json
{
  "description": "An Astro Element Generator"
}
```

##### `type`

The module format used by Node.js and Astro to interpret your `index.js` files.

```json
{
  "type": "module"
}
```

Use `"type": "module"` so that your `index.js` can be used as an entrypoint with `import` and `export` .

##### `homepage`

The url to the project homepage.

```json
{
  "homepage": "https://github.com/owner/project#readme"
}
```

This is a great way to direct users to an online demo, documentation, or homepage for your project.

##### `exports`

The entry points of a package when imported by name.

```json
{
  "exports": {
    ".": "./index.js",
    "./astro": "./MyAstroComponent.astro",
    "./react": "./MyReactComponent.jsx"
  }
}
```

In this example, importing `my-component` would use `index.js`, while importing `my-component/astro` or `my-component/react` would use `MyAstroComponent.astro` or `MyReactComponent.jsx` respectively.

##### `files`

An optional optimization to exclude unnecessary files from the bundle shipped to users via npm. Note that **only files listed here will be included in your package**, so if you add or change files necessary for your package to work, you must update this list accordingly.

```json
{
  "files": ["index.js", "MyAstroComponent.astro", "MyReactComponent.jsx"]
}
```

##### `keywords`

An array of keywords relevant to your component, used to help others [find your component on npm](https://www.npmjs.com/search?q=keywords:astro-component,withastro) and in any other search catalogs.

Add `astro-component`, `astro-integration`, or `withastro` as a special keyword to maximize its discoverability in the Astro ecosystem.

```json
{
  "keywords": ["astro-component", "withastro", "... etc", "... etc"]
}
```

:::tip
Keywords are also used by our [integrations library](https://astro.build/integrations/)! [See below](#integrations-library) for a full list of keywords we look for in npm.
:::

---

#### `index.js`

The main **package entrypoint** used whenever your package is imported.

```js
export { default as MyAstroComponent } from './MyAstroComponent.astro';
export { default as MyReactComponent } from './MyReactComponent.jsx';
```

This allows you to package multiple components together into a single interface.

##### Example: Using named imports

```astro
---
import { MyAstroComponent } from 'my-component';
import { MyReactComponent } from 'my-component';
---
<MyAstroComponent />
<MyReactComponent />
```

##### Example: Using namespace imports

```astro
---
import * as Example from 'example-astro-component';
---
<Example.MyAstroComponent />
<Example.MyReactComponent />
```

##### Example: Using individual imports

```astro
---
import MyAstroComponent from 'example-astro-component/astro';
import MyReactComponent from 'example-astro-component/react';
---
<MyAstroComponent />
<MyReactComponent />
```

---

### Developing your package

Astro does not have a dedicated "package mode" for development. Instead, you should use a demo project to develop and test your package inside of your project. This can be a private website only used for development, or a public demo/documentation website for your package.

If you are extracting components from an existing project, you can even continue to use that project to develop your now-extracted components.

### Testing your component

Astro does not currently ship a test runner. _(If you are interested in helping out with this, [join us on Discord!](https://astro.build/chat))_

In the meantime, our current recommendation for testing is:

<Steps>
1. Add a test `fixtures` directory to your `demo/src/pages` directory.

2. Add a new page for every test that you'd like to run.

3. Each page should include some different component usage that you'd like to test.

4. Run `astro build` to build your fixtures, then compare the output of the `dist/__fixtures__/` directory to what you expected.
   <FileTree>
   - my-project/demo/src/pages/\_\_fixtures\_\_/
     - test-name-01.astro
     - test-name-02.astro
     - test-name-03.astro
   </FileTree>
</Steps>


### Publishing your component

Once you have your package ready, you can publish it to npm using the `npm publish` command. If that fails, make sure that you have logged in via `npm login` and that your `package.json` is correct. If it succeeds, you're done!

Notice that there was no `build` step for Astro packages. Any file type that Astro supports natively, such as `.astro`, `.ts`, `.jsx`, and `.css`, can be published directly without a build step. 

If you need another file type that isn't natively supported by Astro, add a build step to your package. This advanced exercise is left up to you.

### Integrations library

Share your hard work by adding your integration to our [integrations library](https://astro.build/integrations/)!

:::tip
Do you need some help building your integration, or just want to meet other integrations builders? We have a dedicated `#integrations` channel on our [Discord server](https://astro.build/chat). Come say hi!
:::

#### `package.json` data

The library is automatically updated weekly, pulling in every package published to npm with the `astro-component`, `astro-integration`, or `withastro` keyword.

The integrations library reads the `name`, `description`, `repository`, and `homepage` data from your `package.json`.

Avatars are a great way to highlight your brand in the library! Once your package is published you can [file a GitHub issue](https://github.com/withastro/astro.build/issues/new/choose) with your avatar attached and we will add it to your listing.

:::tip
Need to override the information our library reads from npm? No problem! [File an issue](https://github.com/withastro/astro.build/issues/new/choose) with the updated information and we'll make sure the custom `name`, `description`, or `homepage` is used instead.
:::

#### Categories

In addition to the required `astro-component`, `astro-integration`, or `withastro` keyword, special keywords are also used to automatically organize packages. Including any of the keywords below will add your integration to the matching category in our integrations library.

| category          | keywords                                     |
|------------------ | -------------------------------------------- |
| Accessibility     | `a11y`, `accessibility`                      |
| Adapters          | `astro-adapter`                              |
| Analytics         | `analytics`                                  |
| CSS + UI          | `css`, `ui`, `icon`, `icons`, `renderer`     |
| Frameworks        | `renderer`                                   |
| Content Loaders   | `astro-loader`                               |
| Images + Media    | `media`, `image`, `images`, `video`, `audio` |
| Performance + SEO | `performance`, `perf`, `seo`, `optimization` |
| Dev Toolbar       | `devtools`, `dev-overlay`, `dev-toolbar`     |
| Utilities         | `tooling`, `utils`, `utility`                |

Packages that don't include any keyword matching a category will be shown as `Uncategorized`.

### Share

We encourage you to share your work, and we really do love seeing what our talented Astronauts create. Come and share what you create with us in our [Discord](https://astro.build/chat) or mention [@astrodotbuild](https://twitter.com/astrodotbuild) in a Tweet!
