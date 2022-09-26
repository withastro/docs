---
layout: ~/layouts/MainLayout.astro
title: CLI Reference
i18nReady: true
setup: |
    import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro'
---

You can use the Command-Line Interface (CLI) provided by Astro to develop, build, and preview your project from a terminal window.

Use the CLI by running one of the **commands** documented on this page, optionally followed by any **flags**. Flags customize the behavior of a command. For example, to start the development server on port `8080`, you would combine the `astro dev` command with the `--port` flag: `astro dev --port 8080`.

In most cases you will use the CLI via your package manager:

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  npx astro dev --port 8080
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  pnpm astro dev --port 8080
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  yarn astro dev --port 8080
  ```
  </Fragment>
</PackageManagerTabs>

If you started your project using [the `create astro` wizard](/en/install/auto/#1-run-the-setup-wizard), you can also use the scripts in `package.json` for a shorter version of these commands. See the `README.md` in your project for details of which commands are available.

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  # run the dev server on port 8080 using the `start` script in `package.json`
  npm run start -- --port 8080
  ```
  (The extra `--` before the `--port` flag is necessary for `npm` to pass your flags to the `astro` command.)
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  # run the dev server on port 8080 using the `start` script in `package.json`
  pnpm start --port 8080
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  # run the dev server on port 8080 using the `start` script in `package.json`
  yarn start --port 8080
  ```
  </Fragment>
</PackageManagerTabs>

## `astro dev`

Runs  Astro's development server. It starts an HTTP server which responds to requests for routes or pages that are specified within `src/pages` directory (unless overridden by your `pages` option set in the project [configuration](/en/reference/configuration-reference/)).

<h3>Flags</h3>

Use these flags to customize the behavior of the Astro dev server. For flags shared with other Astro commands, see [common flags](#common-flags) below.

#### `--port <number>`

Specifies which port to run on. Defaults to `3000`.

#### `--host [optional host address]`

Sets which network IP addresses the dev server should listen on (i.e. non-localhost IPs). This can be useful for testing your project on local devices like a mobile phone during development.

- `--host` — listen on all addresses, including LAN and public addresses
- `--host <custom-address>` — expose on a network IP address at `<custom-address>`

:::caution
Do not use the `--host` flag to expose the dev server in a production environment. The dev server is designed for local use while developing your site only.
:::

## `astro build`

Builds your site for deployment. By default, this will generate static files and place them in a `dist/` directory. If [SSR is enabled](/en/guides/server-side-rendering/), this will generate the necessary server files to serve your site.

<h3>Flags</h3>

Use these flags to customize your build. For flags shared with other Astro commands, see [common flags](#common-flags) below.

#### `--drafts`

Includes [Markdown draft pages](/en/guides/markdown-content/#markdown-drafts) in the build.

## `astro preview`

Starts a local file server to serve your static `dist/` directory.

This command is useful for previewing your static build locally, before deploying it. It is not designed to be run in production. For help with production hosting, check out our guide on [Deploying an Astro Website](/en/guides/deploy/).

Can be combined with the [common flags](#common-flags) documented below.

:::caution
`astro preview` does not work for SSR builds, which require the server runtime that corresponds to your adapter.
:::

## `astro check`

Runs diagnostics (such as type-checking within `.astro` files) against your project and reports errors to the console. If any errors are found the process will exit with a code of **1**.

This command is intended to be used in CI workflows.

:::note
This command only checks types within `.astro` files.  
:::

📚 Read more about [TypeScript support in Astro](/en/guides/typescript/).

## `astro add`

Adds an integration to your configuration. Read more in [the integrations guide](/en/guides/integrations-guide/#automatic-integration-setup).

## `astro docs`

Launches the Astro Docs website directly from the terminal.

## `astro telemetry`

Sets telemetry configuration for the current user. Telemetry is anonymous data that provides insights into which features are most often used.

Telemetry can be disabled with this CLI command:

```shell
astro telemetry disable
```

Telemetry can later be re-enabled with:

```shell
astro telemetry enable
```

The `clear` command resets the telemetry data:

```shell
astro telemetry clear
```

:::tip[Want to disable telemetry in CI environments?]
Make sure you add the `astro telemetry disable` command to your CI scripts.
:::

## Common flags

### `--root <path>`

Specifies the path to the project root. If not specified, the current working directory is assumed to be the root.

The root is used for finding the Astro configuration file.

```shell
astro --root myRootFolder/myProjectFolder dev
```

### `--config <path>`

Specifies the path to the config file relative to the project root. Defaults to `astro.config.mjs`. Use this if you use a different name for your configuration file or have your config file in another folder.

```shell
astro --config config/astro.config.mjs dev
```

### `--verbose`

Enables verbose logging, which is helpful when debugging an issue.

### `--silent`

Enables silent logging, which will run the server without any console output.

## Global flags

Use these flags to get information about the `astro` CLI.

### `--version`

Prints the Astro version number and exits.

### `--help`

Prints the help message and exits.
