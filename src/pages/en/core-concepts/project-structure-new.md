---
layout: ~/layouts/MainLayout.astro
title: Project Structure
description: Learn how to structure a project with Astro.
---

Astro includes an opinionated folder layout for your project. Every Astro project must include these directories and files:

- `src/*` - Your project source code (components, pages, etc.)
- `public/*` - Your non-code assets (fonts, icons, etc.) that do not require processing at build time
- `package.json` - A project manifest.

## Project Structure

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

The src folder is where most of your project source code lives. This includes:

- [Astro Components](/en/core-concepts/astro-components)
- [Pages](/en/core-concepts/astro-pages)
- [Layouts](/en/core-concepts/layouts)
- [Frontend JS Components](/en/core-concepts/component-hydration)
- [Styling (CSS, Sass)](/en/guides/styling)
- [Markdown](/en/guides/markdown-content)

Astro processes, optimizes, and bundles these files during build to create the final code that is shipped to the browser. 

Some files (like Astro components) are not sent directly to the browser as written, but are instead rendered to static HTML. Other files (like CSS) are sent to the browser but may be bundled and optimized with other files.

### `src/components`

[Components](/en/core-concepts/astro-components) are reusable units of code for your HTML pages. Conventionally, they are placed within this directory, but this is not a requirement. Both Astro components and framework components (React, Preact, Svelte, Vue, etc.) can exist together in the same folder and can be organized into directories and subdirectories. 

### `src/layouts`

[Layouts](/en/core-concepts/layouts) are special components used to create HTML page layouts. It is strongly recommended (but not required) that you put your layout components in this directory. 

### `src/pages`

Astro uses file-based routing to create a unique page route for every `.astro` and `.md` file located in `src/pages` or any subdirectory. **Only files within this folder can create pages for your website.** Astro can also dynamically create page routes from special `.astro` files which must also be within this directory.

### `public/`

The `public/` directory is for any files that do not need to be processed during Astro's build process.

These files will be copied into the build folder untouched, and commonly include assets like images and fonts, or special files such as`robots.txt` and `manifest.webmanifest`. 

These may also include .css and .js files that will not be bundled and optimized, but instead sent directly to the browser.
