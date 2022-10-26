---
layout: ~/layouts/MainLayout.astro
title: Imágenes
description: Aprende cómo usar imágenes en Astro.
i18nReady: true
setup: |
  import Since from '../../../components/Since.astro';
---

¡Astro proporciona varias formas de usar imágenes en tu proyecto, tanto si están almacenadas localmente, enlazadas remotamente o almacenadas en un CMS o una CDN!

### En archivos `.astro`

Astro usa las etiquetas estándar de HTML `<img>` o `<img />` para mostrar imágenes en tus archivos `.astro`. Todos los atributos HTML para imágenes son compatibles.

```astro
---
// src/pages/index.astro
import rocket from '../images/rocket.svg';
---
<!-- Imagen remota en otro servidor -->
<img src="https://astro.build/assets/logo.png" width="25" alt="Astro">

<!-- Imagen local almacenada en public/assets/stars.png -->
<img src="/assets/stars.png" alt="Un cielo nocturno estrellado.">

<!-- Imagen local almacenada en src/images/rocket.svg -->
<img src={rocket} alt="Un cohete en el espacio."/>
```

### En archivos `.md`

Puedes usar la sintaxis estándar de Markdown `![]()` o las etiquetas estándar de HTML `<img>` en tus archivos `.md` para mostrar imágenes locales en tu carpeta `public/` o imágenes remotas en otro servidor.

```md
// src/pages/post-1.md

# Mi página Markdown

<!-- Imagen local almacenada en public/assets/stars.png -->
![Un cielo nocturno estrellado.](/assets/stars.png)
<img src="/assets/stars.png" alt="Un cielo nocturno estrellado.">

<!-- Imagen remota en otro servidor -->
![Astro](https://astro.build/assets/logo.png)
<img src="https://astro.build/assets/logo.png" width="25" alt="Astro">
```

### En archivos `.mdx`

Puedes usar la sintaxis estándar de Markdown `![]()` o las etiquetas JSX `<img />` en tus archivos `.mdx`. Al igual que los archivos Markdown, los archivos MDX pueden mostrar imágenes desde tu carpeta `public/` o un servidor remoto. También puedes importar y usar imágenes locales en tu carpeta `src/`, como componentes de Astro.

```mdx
// src/pages/post-1.mdx

import rocket from '../images/rocket.svg';

# Mi página MDX

// Imagen local almacenada en src/images/rocket.svg
<img src={rocket} alt="Un cohete en el espacio."/>

// Imagen local almacenada en public/assets/stars.png
![Un cielo nocturno estrellado.](/assets/stars.png)
<img src="/assets/stars.png" alt="Un cielo nocturno estrellado." />

// Imagen remota en otro servidor
![Astro](https://astro.build/assets/logo.png)
<img src="https://astro.build/assets/logo.png" width="25" alt="Astro" />
```

### En componentes de un framework de UI

Cuando agregues imágenes en un [componente de un framework de UI](/es/core-concepts/framework-components/) (ej. React, Svelte), usa la sintaxis de imágenes apropiada para ese framework en particular.

## Dónde almacenar imágenes

### `src/`

Tus imágenes almacenadas en `src/` pueden ser usadas por otros componentes importándolas desde una **ruta relativa** o un [alias de importación](/es/guides/aliases/) y usándolas como atributo `src` de la imagen.

```astro
---
// src/pages/index.astro

// Acceso a imágenes en `src/images/`
import logo from '../images/logo.png';
---
<img src={logo} width="40" alt="Astro" />
```

### `public/`

La [carpeta `public/`](/es/core-concepts/project-structure/#public) es para archivos y recursos que no necesitan ser procesados durante el proceso de construcción de Astro. Las imágenes almacenadas en esta carpeta serán copiadas sin cambios en el directorio de construcción. Estas no se importan en tu archivo `.astro`, y el atributo `src` de la imagen es **relativo a la carpeta public**.

```astro
---
// src/pages/index.astro

// Acceso a imágenes en `public/images/`
---
<img src="/images/logo.png" />
```

## Integración Image de Astro

:::caution
Cuando instales la integración `@astrojs/image`, los archivos `.astro` no podrán usar etiquetas estándar de HTML `<img>` para imágenes locales en la carpeta `src` de tu proyecto. Todas las imágenes locales deben usar los componentes de la integración en lugar de etiquetas estándar de HTML.

Consulta la [guía de la integración image](/es/guides/integrations-guide/image/) para más detalles sobre esta nueva característica experimental!
:::

La integración oficial de Astro, image, proporciona dos componentes Astro para renderizar imágenes optimizadas: `<Image />` y `<Picture />`.

Después de [instalar la integración](/es/guides/integrations-guide/image/#installation), puedes importar y usar estos dos componentes en cualquier lugar donde puedas usar componentes Astro, incluyendo archivos `.mdx`.

### `<Image />`

El [componente `<Image />`](/es/guides/integrations-guide/image/#image-) de Astro permite optimizar una imagen individual y especificar el ancho, el alto y/o la relación de aspecto. Puedes transformar tu imagen a un formato particular.

Este componente es útil para imágenes en las que quieres mantener un tamaño consistente en pantallas, o controlar la calidad de una imagen (ej. logos).

#### Imágenes locales

Las imágenes en la carpeta origen de tu proyecto pueden ser importadas en el frontmatter y pasadas directamente al atributo `src` del componente `<Image />`. `alt` es requerido, pero odas las demás propiedades son opcionales y se definirán por defecto con las propiedades originales del archivo de imágenes si no se proporcionan.

#### Imágenes remotas

Para usar una imagen remota, pasa una URL completa en el atributo `src` de `<Image />`. `<Image />` no inferirá las dimensiones de este archivo remoto. Debes proporcionar el `formato` para renderizar el width de la imagen, y debes proporcionar `width` y `height` o uno de los dos tamaños junto a `aspectRatio`. El atributo `alt` también es requerido.

#### Ejemplos

```astro
---
// src/pages/index.astro
import { Image } from '@astrojs/image/components';
import localImage from '../assets/logo.png';
const remoteImage = 'https://picsum.photos/id/957/300/200.jpg';
const localAlt = 'El Logo de Astro';
const remoteAlt = 'Una vista de un bosque durante el día';
---

<!-- Imagen local optimizada, manteniendo el ancho, alto y formato de imagen original -->
<Image src={localImage} alt={localAlt} />

<!-- height se recalculará para que coincida con la relación de aspecto original -->
<Image src={localImage} width={300} alt={localAlt} />

<!-- Para imágenes remotas, las dimensiones deseadas y el formato son requeridos -->
<Image src={remoteImage} width={300} aspectRatio="1:1" format="png" alt={remoteAlt} />

<!-- Ajustar a un ancho y alto específicos -->
<Image src={localImage} width={300} height={600} alt={localAlt}/>
<Image src={remoteImage} width={544} height={184} format="png" alt={remoteAlt}/>

<!-- Ajustar a una relación de aspecto específica y convertir a formato avif -->
<Image src={localImage} aspectRatio="16:9" format="avif" alt={localAlt}/>
<Image src={remoteImage} height={200} aspectRatio="16:9" format="avif" alt={remoteAlt}/>

<!-- Importaciones de imágenes locales pueden hacerse en línea -->
<Image src={import('../assets/logo.png')} alt={localAlt}/>
<!-- Si una imagen es alojada en el directorio `/public`, usa una ruta relativa a `/public` -->
<Image src="/penguin.jpg" width="300" aspectRatio={1} format="png" alt="A happy penguin"/>
```

### `<Picture /> `

El [componente `<Picture />`](/es/guides/integrations-guide/image/#picture-) de Astro puede ser usado para proporcionar imágenes adaptables en tu proyecto, incluyendo imágenes con diferentes tamaños, formatos y disposiciones. Puedes permitir que el navegador elija los tamaños de imágenes apropiados, resoluciones y tipos de archivo basados en factores como el tamaño de la pantalla y la conexión. O, puedes especificar reglas que el navegador debe seguir basadas en media queries.

Este componente es útil para optimizar lo que el usuario ve en diferentes tamaños de pantalla o para el art direction.

:::tip
Revisa la guía de MDN para más información sobre [imágenes adaptables y art direction](https://developer.mozilla.org/es/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
:::

Por defecto, el componente `<Picture />` incluirá los formatos `avif` y `webp` además del formato original de la imagen.

#### Imágenes locales

Las imágenes locales en la carpeta `src` de tu proyecto pueden ser importadas en el frontmatter y pasadas directamente al componente `<Picture />`. `src`, `widths`, `sizes`, y `alt` son propiedades requeridas.

#### Imágenes remotas

Además de `src`, `widths`, `sizes`, `alt`, y `aspectRatio` también es requerido para asegurar que la correcta `height` puede ser calculada en tiempo de compilación.

#### Ejemplos

```astro
---
import { Picture } from '@astrojs/image/components';
import localImage from '../assets/logo.png';
const remoteImage = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
---

<!-- Imagen local con múltiples tamaños y formatos -->
<Picture src={localImage} widths={[200, 400, 800]} sizes="(max-width: 800px) 100vw, 800px" formats={['avif', 'jpeg', 'png', 'webp']} alt="El logo de Astro" />

<!--Remote image (aspect ratio is required)-->
<Picture src={remoteImage} widths={[200, 400, 800]} aspectRatio="4:3" sizes="(max-width: 800px) 100vw, 800px" alt="El logo de Google" />

<!-- Imágenes en /public funcionan como imágenes remotas -->
<Picture src="/logo.png" widths={[200, 400, 800]} aspectRatio="4:3" sizes="(max-width: 800px) 100vw, 800px" alt="El logo de Google" />
<!-- Importaciones en linea están soportadas -->
<Picture src={import("../assets/logo.png")} widths={[200, 400, 800]} sizes="(max-width: 800px) 100vw, 800px" alt="El logo de Astro" />
```

### Uso en MDX

En archivos `.mdx`, `<Image />` y `<Picture />` pueden recibir el `src` de la imagen a través de importaciones y exportaciones.

```mdx
// src/pages/index.mdx

import { Image, Picture } from '@astrojs/image/components';
import rocket from '../assets/rocket.png';
export const galaxy = 'https://astro.build/assets/galaxy.jpg';

<Image src={import('../assets/logo.png')} alt="Astro"/>
<Image src={rocket} width={300} alt="Cohete acercándose a la luna."/>
<Picture src={rocket} widths={[200, 400, 800]} sizes="(max-width: 800px) 100vw, 800px" alt="Un cohete despegando." />
<Picture src={galaxy} widths={[200, 400, 800]} aspectRatio={16/9} sizes="(max-width: 800px) 100vw, 800px" alt="Espacio exterior." />
```

## Alt Text

No todos los usuarios pueden ver imágenes de la misma forma, así que la accesibilidad es una preocupación especialmente importe cuando se utilizan imágenes. Usa el atributo `alt` para proveer [texto alt descriptivo](https://www.w3.org/WAI/tutorials/images/) para las imágenes.

Este atributo es requerido para los componentes de integración de imagen `<Image />` y `<Picture />`. Estos componentes arrojarán un error si no se provee un texto alt.

Si la imagen es meramente decorativa (p.ej. no contribuye al entendimiento de la página), establece `alt=""` para que la imagen sea entendida adecuadamente e ignorada por los lectores de pantalla.


## Usar imágenes de un CMS o una CDN

Las CDNs de imágenes funcionan con Astro. Usa la URL como el atributo `src` de una imagen como lo haría al escribir HTML o JSX, o como el atributo `src` de una imagen remota con los componentes `<Image />` y `<Picture />`.

Alternativamente, si la CDN proporciona un SDK de Node.js, puedes usarlo en tu proyecto. Por ejemplo, el [SDK de Cloudinary](https://cloudinary.com/documentation/node_integration) puede generar la etiqueta `<img>` con el `src` adecuado para ti.

## Integraciones de la comunidad

Además de la integración oficial [`@astrojs/image`](/es/guides/integrations-guide/image/), existen varias [integraciones de imágenes de la comunidad](https://astro.build/integrations/css+ui/?q=image) para optimizar y trabajar con imágenes en tu proyecto.
