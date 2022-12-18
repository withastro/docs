---
title: Using custom fonts
description: Looking to add some custom typefaces to an Astro website? Use Google Fonts with Fontsource or add a font of your choice.
i18nReady: true
layout: ~/layouts/MainLayout.astro
setup: |
    import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro';
---

Astro supports all common strategies for adding custom typefaces to your site design. This guide will show you two different options for including web fonts in your project.

## Using a local font file

If you want to add font files to your project, we recommend adding them to your [`public/` directory](/en/core-concepts/project-structure/#public). In your CSS you can then register fonts with an [`@font-face` statement](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) and use the `font-family` property to style your site.

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

    ```astro {10-12}
    ---
    // src/pages/example.astro
    ---

    <h1>In a galaxy far, far away...</h1>

    <p>Custom fonts make my headings much cooler!</p>

    <style>
    h1 {
      font-family: 'DistantGalaxy', sans-serif;
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
      npm install @fontsource/twinkle-star
      ```
      </Fragment>
      <Fragment slot="pnpm">
      ```shell
      pnpm install @fontsource/twinkle-star
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

3. Import the font package in the layout or component where you want to use the font. Usually, you will want to do this in a common layout component to make sure the font is available across your site.

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



### Using Fontsource with Tailwind CSS

To add custom fonts in to your project using Fontsource when you have the [Tailwind integration](/en/guides/integrations-guide/tailwind/) installed,

1. [Install the font you want from Fontsource](#using-fontsource) using the method described above.

2.  In `tailwind.config.cjs`,  import the font into your project. This example imports `Inter Variable` and `Inter` with default fallback fonts from Tailwind CSS.
    ```js {2,8-10}
    // tailwind.config.cjs
    const defaultTheme = require("tailwindcss/defaultTheme");

    module.exports = {
      // ...
      theme: {
        extend: {
          fontFamily: {
            sans: ["InterVariable", "Inter", ...defaultTheme.fontFamily.sans],
          },
        },
      },
      // ...
    };
    ```
  3. Import the font package in the component where you want to use the font. Usually, you will want to do this in a common layout component to make sure the font is available across your site.

    The following example imports the `Inter Variable` font.  The necessary `@font-face` rules needed to set up the font and a fallback to the default `Inter` font are automatically added.

    ```astro title="src/layouts/Layout.astro
    ---
    import '@fontsource/inter/variable.css';
    ---
    ```
  
Now, all sans-serif text (the default with Tailwind) in your project will use your chosen font. See [Tailwind’s docs on adding custom font families](https://tailwindcss.com/docs/font-family#using-custom-values) for more information.  

## More resources

### Learn how web fonts work

[MDN’s web fonts guide](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts) introduces the topic.

### Generate CSS for your font

[Font Squirrel’s Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator) can help prepare your font files for you.
