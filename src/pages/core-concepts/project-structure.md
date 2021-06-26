---
layout: ~/layouts/Main.astro
title: Project Structure
---

Astro includes an opinionated project structure. Every Astro project must have these two directories:

- `src/` - The project source code, including all components and pages.
- `public/` - Assets that should be added in your final build.

The easiest way to set up your project is `npm init astro`. Check out our [Getting Started Quickstart Guide](/quick-start) to learn more.
## Basic Structure

```
├── src/
│   ├── components/
│   ├── layouts/
│   └── pages/
│       └── index.astro
├── public/
└── package.json
```

### `src/`

The src folder is where three types of subfolders live in.

### `src/components`

Components are reusable parts of your pages.
Components can currently be created with the following default extensions:
- .astro an Astro component
- .jsx a React / Preact component
- .svelte a Svelte component
- .tsx a TypeScript React / Preact component
- .vue a Vue component

The extension handling can be configured with the [extensions property](https://6c2de08d-66d6-482f-9f8d-a61627d40e28.vscode-webview-test.com/vscode-resource/file///Users/jan-martinfruehwacht/Dendron/personal/technology/tech.astro.documentation.config.md)

### `src/layouts`
The layouts folder can be used for holding markdown layouts. These layouts can then be imported in the frontmatter part of markdown files to render them in the layout.

### `src/pages`
The pages is the folder with all the entry points to your web page or application. Possible files in this folder are:
- .astro files
- .md Markdown files
  
### `public/`

For most users, the majority of your files will live inside of the `src/` directory so that Astro can properly handle and optimize them in your final build. By contrast, the `public/` directory is the place for any files to live outside of the Astro build process.

If you put a file into the public folder, it will not be processed by Astro. Instead it will be copied into the build folder untouched. This can be useful for assets like images and fonts, or when you need to include a specific file like `robots.txt` or `manifest.webmanifest`.