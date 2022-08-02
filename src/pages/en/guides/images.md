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

Astro's [official image integration](/en/guides/integrations-guide/image/) provides two different Astro components for rendering optimized images: `<Image />` and `<Picture />`. Import these components wherever you can use Astro components, including `.mdx` files!

### `<Image />`

Astro's [`<Image />` component](/en/guides/integrations-guide/image/#image-) allows you to optimize a single image and specify width, height and/or aspect ratio. You can even transform your image to a particular output, if needed. This is useful for images where you want to keep a consistent size across displays, or closely control the quality of an image (e.g. logos).

#### Local Images

Image files in your project's `src` directory can be imported in frontmatter and passed directly to the `<Image />` component. All other properties are optional and will default to the original image file's properties if not provided.

#### Remote Images

For remote images, you must either provide `width` and `height`, or one of the dimensions plus the required `aspectRatio` to the `<Image />` component.

```astro
---
// src/pages/index.astro
import { Image } from '@astrojs/image/components';
import localImage from '../assets/local.png';
const imageUrl = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
---

// optimized image, keeping the original width, height, and image format
<Image src={localImage} />

// height will be recalculated to match the original aspect ratio
<Image src={localImage} width={300} />

// cropping to a specific width and height
<Image src={localImage} width={300} height={600} />

// cropping to a specific aspect ratio and converting to an avif format
<Image src={localImage} aspectRatio="16:9" format="avif" />

// image imports can also be inlined directly
<Image src={import('../assets/local.png')} />

// cropping to a specific width and height
<Image src={imageUrl} width={544} height={184} />

// height will be recalculated to match the aspect ratio
<Image src={imageUrl} width={300} aspectRatio={16/9} />

// cropping to a specific height and aspect ratio and converting to an avif format
<Image src={imageUrl} height={200} aspectRatio="16:9" format="avif" />
```

### `<Picture /> `

Astro's [`<Picture />` component](/en/guides/integrations-guide/image/#picture-) can be used to provide truly responsive images on your site, including multiple image sizes, formats and layouts. You can let the user's browser choose appropriate image sizes, resolutions and file types based on factors like screen size and bandwidth. Or, you can specify rules that the browser must follow based on media queries. This component is useful to optimize what your user sees at various screen sizes.

Check out [MDN](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#art_direction) for more about responsive images and art direction.

By default, the picture will include formats for `avif` and `webp` in addition to the image's original format.

For remote images, an `aspectRatio` is required to ensure the correct `height` can be calculated at build time.

```astro
---
import { Picture } from '@astrojs/image/components';
import hero from '../assets/hero.png';

const imageUrl = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
---

// Local image with multiple sizes
<Picture src={hero} widths={[200, 400, 800]} sizes="(max-width: 800px) 100vw, 800px" alt="My hero image" />

// Remote image (aspect ratio is required)
<Picture src={imageUrl} widths={[200, 400, 800]} aspectRatio="4:3" sizes="(max-width: 800px) 100vw, 800px" alt="My hero image" />

// Inlined imports are supported
<Picture src={import("../assets/hero.png")} widths={[200, 400, 800]} sizes="(max-width: 800px) 100vw, 800px" alt="My hero image" />
```

## Images in Markdown/MDX

## Using Images from a CMS or CDN

## Background Images