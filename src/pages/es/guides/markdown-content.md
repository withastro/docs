---
layout: ~/layouts/MainLayout.astro
title: Markdown
description: Usando Markdown en Astro
i18nReady: true
---

El contenido de markdown se usa comúnmente para crear contenido con mucho texto, como artículos de blog y documentación. Astro incluye soporte integrado para markdown con algunas características adicionales como soporte para expresiones JavaScript y componentes de Astro.

## Páginas de markdown

Astro trata cualquier archivo `.md` dentro de la carpeta `/src/pages` como una página. Al colocar un archivo en esta carpeta, o en cualquier subcarpeta, se creará automáticamente una ruta de página utilizando la ruta del archivo.

📚 Obtenga más información sobre [enrutamiento basado en archivos](/es/core-concepts/routing/) en Astro.

### Ejemplo básico

La forma más fácil de comenzar a usar markdown en Astro es crear una ruta de la página de inicio `src/pages/index.md` en su proyecto. Copie el codigo básico a continuación en su proyecto y luego vea el HTML renderizado en la página de inicio de su proyecto. Por lo general, se encuentra en [http://localhost:3000/](http://localhost:3000/).

```markdown
---
# Example: src/pages/index.md
title: Hola mundo
---

# Hola!

Esta es su primera página de markdown. Probablemente no tenga mucho estilo, aunque
markdown soporta **negrita** y _cursiva._

Para obtener más información sobre cómo agregar una plantilla a su página, 
lea la siguiente sección sobre **Plantillas de Markdown**
```

### Plantillas de markdown

Las páginas de markdown tienen una propiedad frontmatter especial para `layout` que define **la ruta relativa** a un [componente plantilla](/es/core-concepts/layouts/) de Astro. Este componente envolverá su contenido markdown, proporcionando una capa común que incluirá cualquier otro elemento plantilla que desee agregar.

```markdown
---
layout: ../layouts/BaseLayout.astro
---
```

Un diseño típico de las páginas de markdown incluyen:

1. la propiedad `content` para acceder a los metadatos de la página de markdown.
2. un [`<slot />`](/es/core-concepts/astro-components/#slots) predeterminado para indicar dónde debe mostrarse el contenido markdown de la página.

```astro
---
// src/layouts/BaseLayout.astro
// 1. La propiedad content le dará acceso a los datos de frontmatter.
const { content } = Astro.props;
---
<html>
  <head>
    <!-- Agregue elementos de Head aquí, como estilos y etiquetas meta. -->
    <title>{content.title}</title>
  </head>
  <body>
    <!-- Agregue aquí otros componentes de UI, como encabezados y pies de página -->
    <h1>{content.title} by {content.author}</h1>
    <!-- 2. El HTML renderizado se pasará al slot. -->
    <slot />
    <p>Escrito en: {content.date}</p>
  </body>
</html>
```

La propiedad `content` también contiene una propiedad `astro` con metadatos adicionales sobre la página, como  el texto markdown fuente y un objeto `headers`.

Un ejemplo del objeto `content` de un artículo de blog podría verse así:

```json
{
  /** Frontmatter de un artículo de blog
  "title": "Astro actualización 0.18",
  "date": "Martes, Julio 27 2021",
  "author": "Matthew Phillips",
  "description": "Astro 0.18 es nuestra mayor actualización desde el lanzamiento de Astro.",
  "draft": false,
  "keywords": ["astro", "actualización", "anuncio"]
  **/
  "astro": {
    "headers": [
      {
        "depth": 1,
        "text": "Astro actualización 0.18",
        "slug": "astro-018-release"
      },
      {
        "depth": 2,
        "text": "Hidratación parcial sensibilizada",
        "slug": "responsive-partial-hydration"
      }
      /* ... */
    ],
    "source": "# Astro actualizacion 0.18\nHace poco más de un mes, la primera beta pública [...]"
  },
  "url": ""
}
```

> 💡 `astro` y `url` son las únicas propiedades garantizadas proporcionadas por Astro en la propiedad `content`. El resto del objeto está definido por sus variables de frontmatter.

### Frontmatter como props

Cualquier componente de Astro (¡no solo las plantillas!) pueden recibir valores definidos en el frontmatter del markdown como props. También puedes especificar varios tipos de datos usando YAML en el frontmatter y capturar metadatos de cada publicación de blog para usar en su proyecto de Astro.

Acceda a estos valores en cualquier archivo `.astro` como lo haría en un componente plantilla, como se describe anteriormente.

### IDs de título

Astro agregará identificaciones generadas automáticamente a todos los títulos y subtítulos en los archivos markdown usando [github-slugger](https://github.com/Flet/github-slugger). Pero, si se especifica una identificación personalizada, no será sobreescrita.

Estas identificaciones se agregarán _después_ de que se ejecuten todos los demás complementos, por lo que si tiene un complemento como `rehype-toc` que necesita identificaciones, deberá agregar su propio plugin de slug (como `rehype-slug`).

### Borradores en markdown

`draft: true` es un valor opcional que marcará una página o artículo individual `.md` como "borrador". De forma predeterminada, esta página se excluirá de la compilación final de su proyecto.

Las páginas de markdown sin la propiedad `draft` o aquellas con `draft: false` no se verán afectadas y se incluirán en la compilación final.

```markdown
---
# src/pages/post/blog-post.md
layout: ../../layouts/BaseLayout.astro
title: Mi artículo de blog
draft: true
---

Esta es mi artículo de blog en progreso.

No se creará ninguna página para esta publicación.

Para crear y publicar esta publicación:

- actualice el frontmatter a `draft: false` o
- elimina la propiedad `draft` por completo.
```

> ⚠️ Aunque `draft: true` evitará que se construya la página de su proyecto, este archivo estará disponible para `Astro.glob()` el cual devuelve **todos los archivos markdown** en la ruta especificada.

Para excluir los datos (p. ej., título, enlace, descripción) de un artículo borrador para que no se incluyan en la lista de artículos más recientes, asegúrese que la función `Astro.glob()` **filtre cualquier borrador de la lista de artículos**.

⚙️ Para habilitar la creación de páginas de borrador:

Agregue `drafts: true` a `markdown` en `astro.config.mjs`

```js
// astro.config.mjs
export default defineConfig({
  markdown: {
    drafts: true,
  },
});
```

💡 ¡También puedes agregar la extensión `--drafts` al ejecutar `astro build` para incluir la creación de páginas borrador!

## Autoría de markdown

Además de admitir la sintaxis estándar de markdown, Astro también amplía markdown para que su contenido sea aún más expresivo. A continuación se muestran algunas características de markdown que solo existen en Astro.

### Usando de variables en markdown

Las variables de frontmatter se pueden usar directamente en su markdown como propiedades del objeto `frontmatter`.

```markdown
---
author: Leon
age: 42
---

# Acerca del author

{frontmatter.author} tiene {frontmatter.age} y vive en Toronto, Canada.
```

### Usando componentes en markdown

Puedes importar componentes a su archivo markdown con `setup` y usarlos junto con su contenido markdown. El objeto `frontmatter` también está disponible para cualquier componente importado.

```markdown
---
layout: ../layouts/BaseLayout.astro
setup: |
  import Author from '../../components/Author.astro'
  import Biography from '../components/Biography.jsx'
author: Leon
---

<Author name={frontmatter.author}/>
<Biography client:visible>
  {frontmatter.author} vive en Toronto, Cánada y disfruta de la fotografía.
</Biography>
```

## Importando markdown

¡Puedes importar archivos markdown directamente en sus archivos Astro! Puedes importar una página específica con `import` o varias con `Astro.glob()`

```astro
---
// Importe markdown. ¡La importación dinámica() también es compatible!
import * as greatPost from '../pages/post/great-post.md';

// Además, puede importar varios archivos con Astro.glob
const posts = await Astro.glob('../pages/post/*.md');
---

Genial artículo: <a href={greatPost.url}>{greatPost.frontmatter.title}</a>

<ul>
  {posts.map(post => <li>{post.frontmatter.title}</li>)}
</ul>
```

Cada archivo markdown exporta las siguientes propiedades:

- `frontmatter`: cualquier dato especificado en el frontmatter YAML de este archivo.
- `file`: La ruta absoluta de este archivo (por ejemplo, `/home/user/projects/.../file.md`).
- `url`: si es una página, URL de la página (por ejemplo, `/es/guides/markdown-content`).
- `getHeaders()`: una función asíncrona que devuelve los títulos del archivo markdown. La respuesta sigue este tipo: `{ depth: number; slug: string; text: string }[]`.
- `Content`: un componente que representa el contenido del archivo markdown. Aquí hay un ejemplo:

```astro
---
import {Content as PromoBanner} from '../components/promoBanner.md';
---

<h2>Today's promo</h2>
<PromoBanner />
```

Opcionalmente, puedes proporcionar un tipo para la variable `frontmatter` usando un genérico de TypeScript:

```astro
---
interface Frontmatter {
  title: string;
  description?: string;
}
const posts = await Astro.glob<Frontmatter>('../pages/post/*.md');
---

<ul>
  {posts.map(post => <li>{post.title}</li>)}
  <!-- post.title será un `string`! -->
</ul>
```

## Componente Markdown

> NOTA: El componente `<Markdown />` no funciona en SSR y puede eliminarse antes de v1.0. Debe evitarse si es posible. Para usar Markdown en sus plantillas, use un archivo `.md` separado y luego [`import` Markdown](/es/guides/markdown-content/#importando-markdown) en su plantilla como componente.

Puede importar el [componente markdown](/es/reference/api-reference/#markdown-) de Astro en el script de su componente y escribir cualquier markdown que desee entre las etiquetas `<Markdown></Markdown>`.

````astro
---
import { Markdown } from 'astro/components';
import Layout from '../layouts/Layout.astro';

const expressions = 'Lorem ipsum';
---
<Layout>
  <Markdown>
    # ¡Hola Mundo!

    **Todo** soportado en un archivo `.md` también es compatible aquí.

    No hay ninguna sobrecarga de tiempo de ejecución.

    Además, Astro admite:
    - {Expresiones de Astro expresiones}
    - Normalización automática de indentación
    - Escape automático de expresiones dentro de bloques de código.

    ```js
      // ¡Este contenido no se transformará!
      const object = { someOtherValue };
    ```

    - Compatibilidad con componentes de UI como cualquier archivo `.astro`.
    - Compatibilidad con markdown recursivo (los componentes secundarios también se procesan como Markdown)
  </Markdown>
</Layout>
````

### Markdown remoto

> NOTA: El componente `<Markdown />` no funciona en SSR y puede eliminarse antes de v1.0. Debe evitarse si es posible. Para usar markdown en sus plantillas, use un archivo '.md' separado y luego 'impórtelo' a su plantilla como un componente. Lea esta [discusión de RFC](https://github.com/withastro/rfcs/discussions/179) para obtener más información.

Si tiene Markdown en una fuente remota, puede pasarlo directamente al componente Markdown a través del atributo `content`.

```astro
---
import { Markdown } from 'astro/components';

const content = await fetch('https://raw.githubusercontent.com/withastro/docs/main/README.md').then(res => res.text());
---
<Layout>
  <Markdown content={content} />
</Layout>
```

### Markdown anidado

> NOTA: El componente `<Markdown />` no funciona en SSR y puede eliminarse antes de v1.0. Debe evitarse si es posible. Para usar Markdown en sus plantillas, use un archivo '.md' separado y luego 'impórtelo' a su plantilla como un componente. Lea esta [discusión de RFC](https://github.com/withastro/rfcs/discussions/179) para obtener más información.

Los componentes `<Markdown />` pueden ser anidados.

```astro
---
import { Markdown } from 'astro/components';

const content = await fetch('https://raw.githubusercontent.com/withastro/docs/main/README.md').then(res => res.text());
---

<Layout>
  <Markdown>
    ## Ejemplo markdown 

    Aquí tenemos algo de código __Markdown__. También podemos renderizar dinámicamente contenido remoto.

    <Markdown content={content} />
  </Markdown>
</Layout>
```

>⚠️ El uso del componente `Markdown` para renderizar Markdown remoto puede exponerlo a un ataque [cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting). Si está renderizando contenido que no es de confianza, asegúrese de _desinfectar su contenido **antes** de renderizarlo_.

## Configuración de Markdown

Puedes personalizar el parseo de Markdown modificando el archivo `astro.config.mjs`. [Lea aquí la referencia completa](/es/reference/configuration-reference/#markdown-options). 
<!-- hasta aca -->
### Markdown Plugins

Astro es compatible con plugins externos como [remark](https://github.com/remarkjs/remark) y [rehype](https://github.com/rehypejs/rehype). Puedes proporcionar los plugins en `astro.config.mjs`.

> **Nota:** De forma predeterminada, Astro viene con [GitHub flavored markdown](https://github.com/remarkjs/remark-gfm) y [remark-smartypants](https://github.com/silvenon/remark-smartypants) por defecto. Habilitar `remarkPlugins` o `rehypePlugins` personalizados eliminará estos complementos integrados y deberá agregarlos explícitamente si lo desea.

#### ¿Cómo agregar Markdown plugins a Astro?

1. Instale la dependencia del paquete npm en su proyecto.

2. Actualice `remarkPlugins` o `rehypePlugins` dentro de las opciones `markdown`:

   ```js
   // astro.config.mjs
   export default {
     markdown: {
       remarkPlugins: [
         // Agregue el plugin de remark que desee habilitar para su proyecto.
         // Si necesita proporcionar opciones para el plugin, puede usar un array y colocar las opciones en el segundo elemento.
         // ['remark-autolink-headings', { behavior: 'prepend'}],
       ],
       rehypePlugins: [
         // Agregue un plugin de rehype que desee habilitar para su proyecto.
         // Si necesita proporcionar opciones para el plugin, puede usar un array y colocar las opciones en el segundo elemento.
         // 'rehype-slug',
         // ['rehype-autolink-headings', { behavior: 'prepend'}],
       ],
     },
   };
   ```

   Puede proporcionar nombres de los plugins e importarlos:

   ```js
   // astro.config.mjs
   import autolinkHeadings from 'remark-autolink-headings';

   export default {
     markdown: {
       remarkPlugins: [[autolinkHeadings, { behavior: 'prepend' }]],
     },
   };
   ```

### Resaltado de sintaxis

Astro viene con soporte integrado para [Shiki](https://shiki.matsu.io/) y [Prism](https://prismjs.com/). Esto proporciona un resaltado de sintaxis instantáneo para:

- todas las vallas de codigo (\`\`\`) usadas en los archivos markdown (`.md`) y el [componente `<Markdown />`](#componente-markdown).
- el contenido dentro del [componente `<Code />`](/es/reference/api-reference/#code-) (con la tecnología de Shiki), o el [componente `<Prism />`](/es/reference/api-reference/#prism-) impulsado por Prism.

Shiki está habilitado de forma predeterminada, preconfigurado con el tema `github-dark`. La salida compilada se limitará a estilos en línea sin clases CSS extrañas, hojas de estilo o JS del lado del cliente.

Si opta por usar Prism, aplicaremos las clases CSS de Prism en su lugar. ¡Tenga en cuenta que **necesita traer su propia hoja de estilo CSS** para que aparezca el resaltado de sintaxis! Consulte la [sección de configuración del Prism](#configuración-de-prism) para obtener más detalles.

#### Escoja un resaltador de sintaxis

Shiki es nuestro resaltador de sintaxis predeterminado. Si desea cambiar a `'prism'` o deshabilitar el resaltado de sintaxis por completo, puede usar el objeto de configuración `markdown`:

```js
// astro.config.mjs
export default {
  markdown: {
    // Puede ser 'shiki' (predeterminado), 'prism' o false para deshabilitar el resaltado
    syntaxHighlight: 'prism',
  },
};
```

#### Configuración de Shiki

Al usar Shiki, configurará todas las opciones a través del objeto `shikiConfig` así:

```js
// astro.config.mjs
export default {
  markdown: {
    shikiConfig: {
      // Escoja entre los temas integrados de Shiki (o agregue los suyos propios)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: 'dracula',
      // Agregar lenguajes de programación personalizados
      // Nota: Shiki tiene innumerables lenguajes de programación incorporados, ¡incluido .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Habilite word wrap para evitar el desplazamiento horizontal
      wrap: true,
    },
  },
};
```

También sugerimos [leer la documentación de su tema](https://github.com/shikijs/shiki/blob/main/docs/themes.md#loading-theme) para explorar la carga de un tema personalizado, alternar entre el modo claro y el oscuro, o estilar a través de variables de CSS.

#### Configuración de Prism

Cuando use Prism, deberá agregar una hoja de estilos a su proyecto para resaltar la sintaxis. Si recién empieza y prefiere usar Prism en lugar de Shiki, le sugerimos:
<!-- todo -->
1. [Configurar `syntaxHighlight: 'prism'`](#escoja-un-resaltador-de-sintaxis) desde su configuración `@astrojs/markdown-remark`.
2. Escoger una hoja de estilo prediseñada de los [temas de Prism](https://github.com/PrismJS/prism-themes) disponibles.
3. Agregar esta hoja de estilo a la [carpeta `public/`](/es/core-concepts/project-structure/#public) de su proyecto.
4. Cargar esto en el [`<head>` de su página](/es/core-concepts/astro-pages/#páginas-html) a través de una etiqueta `<link>`.

También puedes visitar la [lista de lenguajes de programación admitidos por Prism](https://prismjs.com/#supported-languages) para conocer las opciones y el uso.
