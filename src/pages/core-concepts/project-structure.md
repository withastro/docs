---
layout: ~/layouts/Main.astro
title: Project Structure
---

## Basic Structure

├── src/
│   ├── components/
│   └── pages/
│       └── index.astro
├── public/
└── package.json

## Src Folder

The src folder is where three types of subfolders live in.

## Components Folder

Components are reusable parts of your pages.
Components can currently be created with the following default extensions:
- .astro an Astro component
- .jsx a React / Preact component
- .svelte a Svelte component
- .tsx a TypeScript React / Preact component
- .vue a Vue component

The extension handling can be configured with the [extensions property](https://6c2de08d-66d6-482f-9f8d-a61627d40e28.vscode-webview-test.com/vscode-resource/file///Users/jan-martinfruehwacht/Dendron/personal/technology/tech.astro.documentation.config.md)

## Data folder
This folders purpose is to hold static data.
An example would a json file.
The data can then be imported in the frontmatter part of components.

## Layouts folder
The layouts folder can be used for holding markdown layouts. These layouts can then be imported in the frontmatter part of markdown files to render them in the layout.

## Pages folder
The pages is the folder with all the entry points to your web page or application. Possible files in this folder are:
- .astro files
- .md Markdown files
  
See also [Routing](https://6c2de08d-66d6-482f-9f8d-a61627d40e28.vscode-webview-test.com/vscode-resource/file///Users/jan-martinfruehwacht/Dendron/personal/technology/tech.astro.documentation.routing.md)

