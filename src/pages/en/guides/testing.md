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

You can run a single test or several tests at once, testing one or multiple browsers. By default, your test results will be shown in the terminal. Optionally, you can open the HTML Test Reporter to show a fulfl report and filter test results.

1. To run our test from the previous example using the command line, use the `test` command. Optionally, include the file name to run just the single test:

```sh
npx playwright test index.spec.ts
```

2. To see the full HTML Test Report, open it using the following command:
```sh
npx playwright show-report
```

:::tip
Run your tests against your production code to more closely resemble your live, deployed site. 
:::

#### Advanced: Launching a development web server during the tests

You can also have Playwright start your server when you run your testing script by using the [`webServer`](https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests) option in the Playwright configuration file. 

Here is an example of the configuration and commands required when using Yarn:

1. Add a test script to your `package.json` file in the project root, such as `"test:e2e": "yarn playwright"`. 

2. In `playwright.config.ts`, add the `webServer` object and update the command value to `yarn preview`. 

```js title="playwright.config.ts" ins={3-8} "yarn preview"
import type { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
  webServer: {
    command: 'yarn preview',
    url: 'http://localhost:3000/app/',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000/app/',
  },
};
export default config;
```

3. Run `yarn build`, then run `yarn test:e2e` to run the Playwright tests.

More information about Playwright can be found in the links below:

- [Getting started with Playwright](https://playwright.dev/docs/intro)
- [Use a development server](https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests)
