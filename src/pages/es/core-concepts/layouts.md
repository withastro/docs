---
layout: ~/layouts/MainLayout.astro
title: Plantillas
description: Introducción a plantillas, un tipo de componente Astro que se comparte entre páginas con plantillas comunes.
i18nReady: true
---

**Las plantillas** son un tipo especial de [componente de Astro](/es/core-concepts/astro-components/) útiles para crear plantillas de página reutilizables.

Un componente plantilla se usa en una [página `.astro` o `.md`](/es/core-concepts/astro-pages/) para proporcionar **un envoltorio** (`<html>`, ` etiquetas <head>` y `<body>`) y un `<slot />` que especifica en qué parte de la página se debe inyectar el contenido.

Las plantillas a menudo proporcionan elementos `<head>` y  UI comunes para la página, como encabezados, barras de navegación y pies de página.

Los componentes de plantilla se colocan comúnmente en la carpeta `src/layouts` en su proyecto.

## Plantilla de ejemplo

**`src/layouts/MySiteLayout.astro`**

```astro
---
---
<html>
  <head>
    <meta charset="utf-8">
    <title>Mi website de Astro</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <nav>
      <a href="#">Home</a>
      <a href="#">Posts</a>
      <a href="#">Contact</a>
    </nav>
    <article>
      <slot /> <!-- su contenido es inyectado aquí -->
    </article>
  </body>
</html>
```

**`src/pages/index.astro`**

```astro
---
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>¡El contenido de mi página, envuelto en una plantilla!</p>
</MySiteLayout>
```

📚 Obtenga más información sobre [slots](/es/core-concepts/astro-components/#slots).

## Plantillas de Markdown

Las plantillas de página son especialmente útiles para [archivos de Markdown](/es/guides/markdown-content/#páginas-de-markdown). Los archivos de Markdown pueden usar la propiedad de frontmatter `layout` para especificar qué componente `.astro` usar como plantilla de página. 

**`src/pages/posts/post-1.md`**

```markdown
---
layout: ../layouts/BlogPostLayout.astro
title: Artículo de blog
description: ¡Mi primer artículo de blog!
---
Este artículo fue escrito en Markdown.
```
Cuando un archivo de Markdown incluye una plantilla, se le pasa una propiedad de `content` al componente `.astro` que incluye las propiedades de frontmatter y el HTML final de la página.

**`src/layouts/BlogPostLayout.astro`**

```astro
---
const {content} = Astro.props;
---
<html>
   <!-- ... -->
  <h1>{content.title}</h1>
  <h2>Autor del artículo: {content.author}</h2>
  <slot />
   <!-- ... -->
</html>
```

📚 Obténga más información sobre la compatibilidad de Astro con Markdown en nuestra [guía de Markdown](/es/guides/markdown-content/).

## Plantillas anidadas

Los componentes de plantilla no necesitan contener una página completa de HTML. Puedes dividir tus plantillas en componentes más pequeños y luego reutilizar estos componentes para crear plantillas aún más flexibles y potentes en tu proyecto.

Por ejemplo, una plantilla común para artículos de blog suele contener un título, fecha y autor. El componente de plantilla `BlogPostLayout.astro` puede agregar esta UI, también puedes utilizar una plantilla más grande para todo el sitio web que maneje el resto de la página.

**`src/layouts/BlogPostLayout.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
const {content} = Astro.props;
---
<BaseLayout>
  <h1>{content.title}</h1>
  <h2>Autor del artículo: {content.author}</h2>
  <slot />
</BaseLayout>
```
