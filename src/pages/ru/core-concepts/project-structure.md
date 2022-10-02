---
layout: ~/layouts/MainLayout.astro
title: Структура проекта
description: Изучите структуру Astro проекта.
i18nReady: true
---

Ваш новый проект Astro, созданный с помощью `create-astro`, уже включает в себя некоторые файлы и папки.
Другие вы создадите сами и добавите в существующую файловую структуру Astro.

Вот как организован проект Astro, и некоторые файлы, которые вы найдете в своем новом проекте.

## Директории и Файлы

В корне проекта Astro должны находится следующие каталоги и файлы:

- `src/*` - Исходный код вашего проекта (компоненты, страницы, стили, и т.д.)
- `public/*` - Статичные файлы (шрифты, иконки, и т.д.)
- `package.json` - Манифест проекта.
- `astro.config.mjs` - Конфигурационный файл Astro. (recommended)
- `tsconfig.json` - Конфигурационный файл TypeScript. (recommended)

### Пример дерева проекта

Структура обычного Astro проекта может выглядеть так:

```
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   └-─ Button.jsx
│   ├── layouts/
│   │   └-─ PostLayout.astro
│   └── pages/
│   │   ├── posts/
│   │   │   ├── post1.md
│   │   │   ├── post2.md
│   │   │   └── post3.md
│   │   └── index.astro
│   └── styles/
│       └-─ global.css
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └-─ social-image.png
├── astro.config.mjs
├── package.json
└── tsconfig.json

```

### `src/`

Директория `src/` это место, где живет ваш код. Это включает:

- [Страницы](/ru/core-concepts/astro-pages/)
- [Макеты](/ru/core-concepts/layouts/)
- [Astro компоненты](/ru/core-concepts/astro-components/)
- [Компоненты UI фреймворков](/ru/core-concepts/framework-components/)
- [Стили (CSS, Sass)](/ru/guides/styling/)
- [Markdown](/ru/guides/markdown-content/)

Astro обрабатывает, оптимизирует и бандлит ваши файлы в "src/" для создания веб-сайта, который будет доставлен до браузера.
В отличие от статического каталога `public/`, ваши файлы в `src/` обрабатывает за вас Astro.

Некоторые файлы (например, Astro компоненты) не отправляются в браузер в том виде, в каком они написаны, а вместо этого отображаются в статическом HTML.
Другие файлы (например, CSS) отправляются в браузер, но могут быть оптимизированы или объединены с другими файлами CSS для повышения производительности.

### `src/components`

**Components** are reusable units of code for your HTML pages. These could be [Astro components](/en/core-concepts/astro-components/), or [UI framework components](/en/core-concepts/framework-components/) like React or Vue.  It is common to group and organize all of your project components together in this folder.

This is a common convention in Astro projects, but it is not required. Feel free to organize your components however you like!

### `src/layouts`

[Layouts](/en/core-concepts/layouts/) are a special kind of component that wrap some content in a larger page layout. These are most often used by [Astro pages](/en/core-concepts/astro-pages/) and [Markdown or MDX pages](/en/guides/markdown-content/) to define the layout of the page.

Just like `src/components`, this directory is a common convention but not required.

### `src/pages`

[Pages](/en/core-concepts/astro-pages/) are a special kind of component used to create new pages on your site. A page can be an Astro component, or a Markdown file that represents some page of content for your site.

:::caution
`src/pages` is a **required** sub-directory in your Astro project. Without it, your site will have no pages or routes!
:::

### `src/styles`

It is a common convention to store your CSS or Sass files in a `src/styles` directory, but this is not required. As long as your styles live somewhere in the `src/` directory and are imported correctly, Astro will handle and optimize them.

### `public/`

The `public/` directory is for files and assets that do not need to be processed during Astro's build process. These files will be copied into the build folder untouched.

This behavior makes `public/` ideal for common assets like images and fonts, or special files such as `robots.txt` and `manifest.webmanifest`.

You can place CSS and JavaScript in your `public/` directory, but be aware that those files will not be bundled or optimized in your final build.

:::tip
As a general rule, any CSS or JavaScript that you write yourself should live in your `src/` directory.
:::

### `package.json`

This is a file used by JavaScript package managers to manage your dependencies. It also defines the scripts that are commonly used to run Astro (ex: `npm start`, `npm run build`).

There are [two kinds of dependencies](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file) you can specify in a `package.json`: `dependencies` and `devDependencies`. In most cases, these work the same: Astro needs all dependencies at build time, and your package manager will install both. We recommend putting all of your dependencies in `dependencies` to start, and only use `devDependencies` if you find a specific need to do so.

For help creating a new `package.json` file for your project, check out the [manual setup](/en/install/manual/) instructions.

### `astro.config.mjs`

This file is generated in every starter template and includes configuration options for your Astro project. Here you can specify integrations to use, build options, server options, and more.

See the [Configuring Astro Guide](/en/guides/configuring-astro/) for details on setting configurations.

### `tsconfig.json`

This file is generated in every starter template and includes TypeScript configuration options for your Astro project. Some features (like npm package imports) aren’t fully supported in the editor without a `tsconfig.json` file. 

See the [TypeScript Guide](/en/guides/typescript/) for details on setting configurations.
