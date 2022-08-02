---
layout: ~/layouts/MainLayout.astro
title: Images
description: Learn how to use images in Astro.
i18nReady: true
setup: |
  import Since from '../../../components/Since.astro';
---
Astro provides several ways for you to use images inside of your projects.

Astro uses standard HTML `<img>` or JSX `<img />` elements to display images within your `.astro` files. 

You can use standard Markdown `![]()` or HTML syntax in your Markdown files, and both Markdown and JSX syntax in MDX files.

```astro
// src/pages/index.astro
---
import rocket from './images/rocket.svg'; // `src/images/rocket.svg`
---
<img src="https://astro.build/assets/press/full-logo-light.png" alt="Astro logo">
<img src="./images/astronaut.jpg" alt="An astronaut."> <!-- stored in src -->
<img src="/stars.png" alt="A starry night sky."> <!-- stored in public -->
<img src={rocket} alt="A rocketship in space."/>
```

```markdown
// src/pages/post-1.md
![An astronaut on the moon.](./images/astronaut.png)
<img src="/stars.png" alt="A starry night sky.">
```


```mdx
// src/pages/post-2.mdx
export const src='./images/rocket.svg';

![An astronaut on the moon.](./images/astronaut.png)
<img src="/stars.png" alt="A starry night sky." />
<img src={rocket} alt="A rocketship in space." />
```

## Where to keep images

### `src/`
Your images kept in `src/` can be imported and used by other components, and will be processed during Astro's build process. These images are referenced **relative to the file path of project root**.

```
src/images/animals/cat.png --> <img src="./images/animals/cat.png" />
```

### `public/`

The `public/` directory is for files and assets that do not need to be processed during Astro’s build process. These files will be copied into the build folder untouched. These are referenced **relative to the URL path of the public folder**

```
public/images/animals/cat.png --> <img src="/images/animals/cat.png" />
```

## Astro's Image Integration

Astro's [official image integration](/en/guides/integrations-guide/image/) provides two different components for rendering optimized images: `<Image />` and `<Picture />`

### `<Image />`

Astro's [`<Image />` component](/en/guides/integrations-guide/image/#image-) allows you to provide different sizes of a single image. By doing so, your user's browser can choose which image resolution to render based on factors like screen size and bandwidth. This component is useful to serve a single image responsively.

### `<Picture /> `

Astro's [`<Picture />` component](/en/guides/integrations-guide/image/#picture-) can be used to provide multiple image formats and layouts, and specify rules that the browser must follow based on media queries. This component is useful to control what your user sees at various screen sizes (e.g. the full photo on large screen sizes, but a cropped square view on smaller screen sizes).

## Images in Markdown/MDX

## Using Images from a CMS or CDN

## Background Images