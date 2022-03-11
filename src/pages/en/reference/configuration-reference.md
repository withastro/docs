---
# NOTE: This file is auto-generated from 'scripts/docgen.mjs'
# Do not make edits to it directly, they will be overwritten.

layout: ~/layouts/MainLayout.astro
title: Configuration Reference
---

To configure Astro, add an `astro.config.mjs` file to the root of your project.

```js
export default /** @type {import('astro').AstroUserConfig} */ ({
  // all options are optional; these values are the defaults
  projectRoot: './',
  public: './public/',
  dist: './dist/',
  src: './src/',
  pages: './src/pages/',
  renderers: [
    '@astrojs/renderer-svelte',
    '@astrojs/renderer-vue',
    '@astrojs/renderer-react',
    '@astrojs/renderer-preact',
  ],
  vite: {},
});
```
## Top-Level Options

### projectRoot

**Type:** `string`  
**CLI:** `--project-root`  
**Default:** `"."` (current working directory)

You should only provide this option if you run the `astro` CLI commands in a directory other than the project root directory. Usually, this option is provided via the CLI instead of the `astro.config.js` file, since Astro needs to know your project root before it can locate your config file.

If you provide a relative path (ex: `--project-root: './my-project'`) Astro will resolve it against your current working directory.

#### Examples

```js
{
  projectRoot: './my-project-directory'
}
```
```bash
$ astro build --project-root ./my-project-directory
```


### dist

**Type:** `string`  
**Default:** `"./dist"`

Set the directory that `astro build` writes your final build to.

The value can be either an absolute file system path or a path relative to the project root.

```js
{
  dist: './my-custom-build-directory'
}
```


### public

**Type:** `string`  
**Default:** `"./public"`

Set the directory for your static assets. Files in this directory are served at `/` during dev and copied to your build directory during build. These files are always served or copied as-is, without transform or bundling.

The value can be either an absolute file system path or a path relative to the project root.

```js
{
  public: './my-custom-public-directory'
}
```


### renderers

**Type:** `Array.<string>`  
**Default:** `['@astrojs/renderer-svelte','@astrojs/renderer-vue','@astrojs/renderer-react','@astrojs/renderer-preact']`

Set the UI framework renderers for your project. Framework renderers are what power Astro's ability to use other frameworks inside of your project, like React, Svelte, and Vue.

Setting this configuration will disable Astro's default framework support, so you will need to provide a renderer for every framework that you want to use.

```js
{
  // Use Astro + React, with no other frameworks.
  renderers: ['@astrojs/renderer-react']
}
```


### markdownOptions

**Type:** `Object`  

Configure how markdown files (`.md`) are rendered.

```js
{
  markdownOptions: {
    // Add a Remark plugin to your project.
    remarkPlugins: [
      ['remark-autolink-headings', { behavior: 'prepend'}],
    ],
    // Add a Rehype plugin to your project.
    rehypePlugins: [
      'rehype-slug',
      ['rehype-autolink-headings', { behavior: 'prepend'}],
    ],
    // Customize syntax highlighting
	   syntaxHighlight: 'shiki',
  },
}
```
**See Also:**
- [Markdown guide](/en/guides/markdown-content/)


## Build Options

### site

**Type:** `string`  

Your final, deployed URL. Astro uses this full URL to generate your sitemap and canonical URLs in your final build. It is strongly recommended that you set this configuration to get the most out of Astro.

Astro will match the site pathname during development so that your development experience matches your build environment as closely as possible. In the example below, `astro dev` will start your server at `http://localhost:3000/docs`.

```js
{
  buildOptions: {
    // Example: Tell Astro the final URL of your deployed website.
	   site: 'https://www.my-site.dev/docs'
  }
}
```


### sitemap

**Type:** `boolean`  
**Default:** `true`

Generate a sitemap for your build. Set to false to disable.

Astro will automatically generate a sitemap including all generated pages on your site. If you need more control over your sitemap, consider generating it yourself using a [Non-HTML Page](/en/core-concepts/astro-pages/#non-html-pages).

```js
{
  buildOptions: {
    // Example: Disable automatic sitemap generation
	   sitemap: false
  }
}
```


### sitemapFilter

**Type:** `(page: string) => boolean`  

By default, all pages are included in your generated sitemap.
You can filter included pages by URL using `buildOptions.sitemapFilter`.

The `page` function parameter is the full URL of your rendered page, including your `buildOptions.site` domain.
Return `true` to include a page in your sitemap, and `false` to remove it.

```js
{
  buildOptions: {
	   sitemap: true
	   sitemapFilter: (page) => page !== 'http://example.com/secret-page')
  }
}
```
**See Also:**
- buildOptions.sitemap


### pageUrlFormat

**Type:** `'file' | 'directory'`  
**Default:** `'directory'`

Control the output file format of each page.
  - If 'file', Astro will generate an HTML file (ex: "/foo.html") for each page.
  - If 'directory', Astro will generate a directory with a nested `index.html` file (ex: "/foo/index.html") for each page.

```js
{
  buildOptions: {
    // Example: Generate `page.html` instead of `page/index.html` during build.
	   pageUrlFormat: 'file'
  }
}
```


### drafts

**Type:** `boolean`  
**Default:** `false`

Control if markdown draft pages should be included in the build.

A markdown page is considered a draft if it includes `draft: true` in its front matter. Draft pages are always included & visible during development (`astro dev`) but by default they will not be included in your final build.

```js
{
  buildOptions: {
    // Example: Include all drafts in your final build
	   drafts: true,
  }
}
```


## Dev Options

### host

**Type:** `string | boolean`  
**Default:** `false`

Set which network IP addresses the dev server should listen on (i.e. 	non-localhost IPs).
- `false` - do not expose on a network IP address
- `true` - listen on all addresses, including LAN and public addresses
- `[custom-address]` - expose on a network IP address at `[custom-address]`


### hostname

**Type:** `string`  
**Default:** `'localhost'`

> **This option is deprecated.** Consider using `host` instead.

Set which IP addresses the dev server should listen on. Set this to 0.0.0.0 to listen on all addresses, including LAN and public addresses.


### port

**Type:** `number`  
**Default:** `3000`

Set which port the dev server should listen on.

If the given port is already in use, Astro will automatically try the next available port.


### trailingSlash

**Type:** `'always' | 'never' | 'ignore'`  
**Default:** `'always'`

Set the route matching behavior of the dev server. Choose from the following options:
  - 'always' - Only match URLs that include a trailing slash (ex: "/foo/")
  - 'never' - Never match URLs that include a trailing slash (ex: "/foo")
  - 'ignore' - Match URLs regardless of whether a trailing "/" exists

Use this configuration option if your production host has strict handling of how trailing slashes work or do not work.

You can also set this if you prefer to be more strict yourself, so that URLs with or without trailing slashes won't work during development.

```js
{
  devOptions: {
    // Example: Require a trailing slash during development
	   trailingSlash: 'always'
  }
}
```
**See Also:**
- buildOptions.pageUrlFormat


### vite

**Type:** `vite.UserConfig`  

Pass additional configuration options to Vite. Useful when Astro doesn't support some advanced configuration that you may need.

View the full `vite` configuration object documentation on [vitejs.dev](https://vitejs.dev/config/).

#### Examples

```js
{
  vite: {
	   ssr: {
     // Example: Force a broken package to skip SSR processing, if needed
		external: ['broken-npm-package'],
    }
  }
}
```

```js
{
  vite: {
    // Example: Add custom vite plugins directly to your Astro project
	   plugins: [myPlugin()],
  }
}
```


