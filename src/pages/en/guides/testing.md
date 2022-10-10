---
layout: ~/layouts/MainLayout.astro
title: Testing
description: An intro to testing in Astro
i18nReady: false
setup: import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro'
---

## Playwright

In their own words, Playwright is a testing framework that let's you write end-to-end testing for modern web apps. You can do this cross browser, cross platform, and across multiple languages, but for our purposes the scope is clearly Javascript/Typescript. 

### Quickstart

The fastest way to get started is to install Playwright within your Astro project. This will guide you through CLI steps to choose Javascript/Typescript, name your test folder, and add an optional Github Actions workflow.

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  npm init playwright@latest
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  pnpm dlx create-playwright
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  yarn create playwright
  ```
  </Fragment>
</PackageManagerTabs>

### Create your first Playwright test

With the example page below:

```html
<html lang="en">
  <head>
    <title>Astro is awesome!</title>
    <meta name='description' content="Pull content from anywhere and serve it fast with Astro's next-gen island architecture." />
  </head>
  <body></body>
</html>
```

Add a test to verify that your meta information is correct:

```jsx
// test/index.spec.ts

test('meta is correct', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Astro is awesome!');
});
```

You can use `page.goto("/")` instead of `page.goto("http://localhost:3000/")`, if you add [`"baseURL": "http://localhost:3000"`](https://playwright.dev/docs/api/class-testoptions#test-options-base-url) to the `playwright.config.ts` configuration file.

### Running your Playwright tests

Playwright is testing a real application, so you will need to do a little bit prior to starting Playwright. It is recommended to run your tests against your production code to more closely resemble how your real site will be when deployed. Be sure to add a test script to your `package.json` file in the project root, such as `"test:e2e": "yarn playwright"`. 

First, you can also have Playwright start your server when you run your testing script by uncommenting the [`webServer`](https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests) block of the configuration file, then update the command value to `yarn preview`. Run `yarn build`, then run `yarn test:e2e` to run the Playwright tests.

More information about Playwright can be found in the links below:

- [Getting started with Playwright](https://playwright.dev/docs/intro)
- [Use a development server](https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests)
