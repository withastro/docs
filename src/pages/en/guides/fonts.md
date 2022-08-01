---
title: Using custom fonts
description: Looking to add some custom typefaces to an Astro website? Use Google Fonts with Fontsource or add a font of your choice.
layout: ~/layouts/MainLayout.astro
setup: |
    import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro';
---

Astro supports all common strategies for adding custom typefaces to your site design. This guide will show you two different options for including web fonts in your project.

## Using a local font file

If you want to add font files to your project, we recommend adding them to your [`public/` directory](http://localhost:3000/en/core-concepts/project-structure/#public). In your CSS you can then register fonts with an [`@font-face` statement](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) and use the `font-family` property to style your site.

### Example

Let’s imagine you have a `DistantGalaxy.woff` font file.

1. Add your font file to `public/fonts/`.

2. Add an `@font-face` statement to your CSS. This could be in a global `.css` file you import or in a `<style>` block in the layout or component where you want to use this font.

    ```css
    /* Register our custom font family and tell the browser where to find it. */
    @font-face {
      font-family: 'DistantGalaxy';
      src: url('/fonts/DistantGalaxy.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    ```

    :::note
    We don’t include `public` in the font’s source URL because all files in `public` get added to your site’s root directory.
    :::

3. Use the `font-family` from the `@font-face` statement to style elements in your component or layout. In this example, the `<h1>` heading will have the custom font applied, while the paragraph `<p>` will not.

    ```astro
    ---
    ---

    <h1>In a galaxy far, far away...</h1>

    <p>Custom fonts make my headings much cooler!</p>

    <style>
    h1 {
      font-family: 'DistantGalaxy';
    }
    </style>
    ```

## Using Fontsource

The [Fontsource](https://fontsource.org/) project simplifies using Google Fonts and other open source fonts. It provides npm modules you can install for the fonts you want to use.

1. Find the font you want to use in [Fontsource’s catalog](https://fontsource.org/fonts). For this example, we’ll use [Twinkle Star](https://fontsource.org/fonts/twinkle-star).
2. Install the package for your chosen font.

    <PackageManagerTabs>
      <Fragment slot="npm">
      ```shell
      npm i @fontsource/twinkle-star
      ```
      </Fragment>
      <Fragment slot="pnpm">
      ```shell
      pnpm i @fontsource/twinkle-star
      ```
      </Fragment>
      <Fragment slot="yarn">
      ```shell
      yarn add @fontsource/twinkle-star
      ```
      </Fragment>
    </PackageManagerTabs>

    :::tip
    You’ll find the correct package name in the “Quick Installation” section of each font page on Fontsource’s website. It will start with `@fontsource/` followed by the name of the font.
    :::

3. Import the font package in the layout or component where you want to use the font. Usually you will want to do this in a common layout component to make sure the font is available across your site.

    The import will automatically add the necessary `@font-face` rules needed to set up the font.

    ```astro
    ---
    // src/layouts/BaseLayout.astro
    import '@fontsource/twinkle-star';
    ---
    ```

4. Use the `font-family` as shown on that font’s Fontsource page. This will work anywhere you can write CSS in your Astro project.

    ```css
    h1 {
      font-family: "Twinkle Star", cursive;
    }
    ```
