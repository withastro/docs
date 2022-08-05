---
layout: ~/layouts/MainLayout.astro
title: Images
description: Learn how to use images in Astro.
i18nReady: true
setup: |
  import Since from '../../../components/Since.astro';
---
Astro provides several ways for you to use images on your site, whether they are stored locally inside your project, linked to remotely, or stored in a CMS or CDN!

### In `.astro` files

Astro uses standard HTML `<img>` or `<img />` elements to display images within your `.astro` files. All HTML image attributes are supported.

```astro
---
// src/pages/index.astro
import rocket from '../images/rocket.svg';
---
<!-- Remote image on another server -->
<img src="https://astro.build/assets/logo.png" width="25" alt="Astro">

<!-- Local image stored at public/assets/stars.png -->
<img src="/assets/stars.png" alt="A starry night sky.">

<!-- Local image stored at src/images/rocket.svg -->
<img src={rocket} alt="A rocketship in space."/>
```

### In `.md` files

You can use standard Markdown `![]()` syntax or standard HTML `<img>` tags in your `.md` files for images located in your `public/` folder, or remote images on another server.


```md
// src/pages/post-1.md

# My Markdown Page

<!-- Local image stored at public/assets/stars.png -->
![A starry night sky.](/assets/stars.png)
<img src="/assets/stars.png" alt="A starry night sky.">

<!-- Remote image on another server -->
![Astro](https://astro.build/assets/logo.png)
<img src="https://astro.build/assets/logo.png" width="25" alt="Astro">
```

### In `.mdx` files

You can use standard Markdown `![]()` syntax or  JSX `<img />` tags in your `.mxd` files. Just like Markdown files, MDX files can display images from your `public/` folder or remote servers. They can also import and use images located in your project's `src` directory, like Astro components.

```mdx
// src/pages/post-1.md

import rocket from '../images/rocket.svg';

# My MDX Page

// Local image stored at src/images/rocket.svg
<img src={rocket} alt="A rocketship in space."/>

// Local image stored at public/assets/stars.png
![A starry night sky.](/assets/stars.png)
<img src="/assets/stars.png" alt="A starry night sky." />

// Remote image on another server
![Astro](https://astro.build/assets/logo.png)
<img src="https://astro.build/assets/logo.png" width="25" alt="Astro" />
```

### In UI Framework Components

When adding images in a [UI framework component](/en/core-concepts/framework-components/) (e.g React, Svelte), use the image syntax appropriate for that particular component's framework.

## Where to store images

### `src/`
Your images stored in `src/` can be used by other components by first importing them from a **relative file path** or [import alias](/en/guides/aliases/) and then using the import as the image's `src` attribute. 


```astro
---
// src/pages/index.astro

// Access images in `src/images/`
import logo from '../images/logo.png';
---
<img src={logo} width="40" alt="Astro" />
```

### `public/`

The [`public/` directory](/en/core-concepts/project-structure/#public) is for files and assets that do not need to be processed during Astro’s build process. Images stored here will be copied into the build folder untouched. These are not imported into your `.astro` file, and the image's `src` attribute is **relative to the public folder**.

```astro
---
// src/pages/index.astro

// Access images in `public/images/`
---
<img src="/images/logo.png" />
```

## Astro's Image Integration

:::caution
When you install the `@astrojs/image` integration, `.astro` files will no longer be able to use standard HTML `<img>` tags for images located in your project `src`. All local images must use the integration components instead.

See the [image integration guide](/en/guides/integrations-guide/image/) for more notes about this new, experimental feature!
:::

Astro's official image integration provides two different Astro components for rendering optimized images: `<Image />` and `<Picture />`.

After [installing the integration](/en/guides/integrations-guide/image/#installation), you can import and use these two components wherever you can use Astro components, including `.mdx` files!

:::note
Astro's `<Image />` and `<Picture />` components cannot be used with images in your `public/` folder. Use standard HTML or Markdown image syntax instead.
:::

### `<Image />`

Astro's [`<Image />` component](/en/guides/integrations-guide/image/#image-) allows you to optimize a single image and specify width, height, and/or aspect ratio. You can even transform your image to a particular output format, which can be used to avoid checking the file type of remote images. 

This component is useful for images where you want to keep a consistent size across displays, or closely control the quality of an image (e.g. logos).

#### Local Images

Image files in your project's source directory can be imported in frontmatter and passed directly to the `<Image />` component's `src` attribute. All other properties are optional and will default to the image file's original properties if not provided.

#### Remote Images

Remote images require a full URL as the image `src`. Also, you must either provide `width` and `height`, or one of the dimensions plus the required `aspectRatio` to the `<Image />` component.

#### Examples

```astro
---
// src/pages/index.astro
import { Image } from '@astrojs/image/components';
import localImage from '../assets/local.png';
const imageUrl = 'https://astro.build/assets/logo.png';
---

// optimized local image, keeping the original width, height, and image format
<Image src={localImage} />

// height will be recalculated to match the original (local only) or specified aspect ratio
<Image src={localImage} width={300} />
<Image src={imageUrl} width={300} aspectRatio={16/9} />

// cropping to a specific width and height
<Image src={localImage} width={300} height={600} />
<Image src={imageUrl} width={544} height={184} />

// cropping to a specific aspect ratio and converting to an avif format
<Image src={localImage} aspectRatio="16:9" format="avif" />
<Image src={imageUrl} height={200} aspectRatio="16:9" format="avif" />

// local image imports can also be inlined directly
<Image src={import('../assets/local.png')} />
```

### `<Picture /> `

Astro's [`<Picture />` component](/en/guides/integrations-guide/image/#picture-) can be used to provide responsive images on your site, including multiple image sizes, formats, and layouts. You can let the user's browser choose appropriate image sizes, resolutions, and file types based on factors like screen size and bandwidth. Or, you can specify rules that the browser must follow based on media queries. 

This component is useful to optimize what your user sees at various screen sizes, or for art direction.

:::tip
Check out MDN's guide for more information about [responsive images and art direction](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#art_direction).
:::

By default, the `<Picture />` component will include formats for `avif` and `webp` in addition to the image's original format.

#### Local Images

Local image files in your project's `src` directory can be imported in frontmatter and passed directly to the `<Picture />` component. `src`, `widths`, and  `sizes` are required properties.

#### Remote Images 

In addition to `src`, `widths`, and  `sizes`, `aspectRatio` is also required to ensure the correct `height` can be calculated at build time.

#### Examples

```astro
---
import { Picture } from '@astrojs/image/components';
import localImage from '../assets/localImage.png';
const imageUrl = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
---

// Local image with multiple sizes and formats
<Picture src={localImage} widths={[200, 400, 800]} sizes="(max-width: 800px) 100vw, 800px" formats=['avif', 'jpeg', 'png', 'webp'] alt="My local image" />

// Remote image (aspect ratio is required)
<Picture src={imageUrl} widths={[200, 400, 800]} aspectRatio="4:3" sizes="(max-width: 800px) 100vw, 800px" alt="My remote image" />

// Inlined imports are supported
<Picture src={import("../assets/localImage.png")} widths={[200, 400, 800]} sizes="(max-width: 800px) 100vw, 800px" alt="My local image" />
```

### Using in MDX

In `.mdx` files, `<Image />` and `<Picture />` can receive your image `src` through imports and exports.

```mdx
// src/pages/index.mdx

import { Image, Picture } from '@astrojs/image/component';
import rocket from '../assets/rocket.png';
export const galaxy = 'https://astro.build/assets/galaxy.jpg';

<Image src={import('../assets/logo.png')} alt="Astro"/>
<Image src={rocket} width={300} alt="Spaceship approaching the moon.">
<Picture src={rocket} widths=[{200, 400, 800}] sizes="(max-width: 800px) 100vw, 800px" alt="A rocket blasting off." />
<Picture src={galaxy} widths=[{200, 400, 800}] aspectRatio={16/9} sizes="(max-width: 800px) 100vw, 800px" alt="Outer space." />
```

## Using Images from a CMS or CDN

Image CDNs work with Astro. Use their URL as an image’s `src` attribute as you would when writing HTML or JSX, or as a remote image's `src` attribute with the `<Image />` and `<Picture />` components.

Alternatively, if the CDN provides a Node.js SDK, you can use that in your project. For example, [Cloudinary’s SDK](https://cloudinary.com/documentation/node_integration) can generate the `<img>` tag with the appropriate `src` for you.

## Community Integrations

In addition to the official [`@astrojs/image`](/en/guides/integrations-guide/image/) integration, there are several third-party [community image integrations](https://astro.build/integrations/css+ui/?q=image) for optimizing and working with images in your Astro project.