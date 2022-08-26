---
layout: ~/layouts/MainLayout.astro
title: Markdown & MDX
description: Aprende a crear contenido usando Markdown o MDX en Astro
i18nReady: true
---

El [Markdown](https://daringfireball.net/projects/markdown/) se usa comúnmente para crear contenido con mucho texto, como artículos de blog y documentación. Astro incluye soporte integrado para archivos estándar de Markdown (`.md`).

Con la [integración @astrojs/mdx](/es/guides/integrations-guide/mdx/) instalada, Astro también soporta archivos [MDX](https://mdxjs.com/) (`.mdx`) los cuales poseen algunas características adicionales como soporte para expresiones JavaScript y componentes en un contenido Markdown.

¡Utiliza cualquiera de ambos (o ambos) para escribir tu contenido Markdown!

## Páginas de Markdown y MDX

Astro trata cualquier archivo `.md` o `.mdx` dentro de la carpeta `/src/pages` como una página. Al colocar un archivo en esta carpeta, o en cualquier subcarpeta, se creará automáticamente una ruta de página utilizando la ruta del archivo.

📚 Obtén más información sobre [enrutamiento basado en archivos](/es/core-concepts/routing/) en Astro.

### Ejemplo básico

Para empezar a utilizar Markdown en Astro, agrega un archivo `page-1.md` a tu proyecto en la carpeta `src/pages`. Luego copia y pega el siguiente código dentro del archivo y podrás ver el HTML renderizado en la vista previa en tu navegador. Comúnmente, esta página se encontraría en [http://localhost:3000/page-1](http://localhost:3000/page-1).



```markdown
---
# Ejemplo: src/pages/page-1.md
title: Hola mundo
---

# Hola!

Esta es tu primer página de Markdown. Probablemente no tenga mucho estilo, aunque
Markdown soporta **negrita** y _cursiva._

Para obtener más información sobre cómo agregar una plantilla a su página, lee la siguiente sección sobre **Plantillas de Markdown.**
```

### `layout` en el Frontmatter

Astro provee a las páginas de Markdown y MDX de una propiedad especial en el frontmatter para `layout` que define **la ruta relativa** a un [componente plantilla](/es/core-concepts/layouts/) de Astro. Este componente envolverá tu contenido Markdown, proporcionando una capa contenedora y cualquier otro elemento incluido en la plantilla de la página.

```markdown {3}
---
// src/pages/page.md
layout: ../layouts/BaseLayout.astro
title: "Astro v1 Launch!"
author: "Matthew Phillips"
date: "09 Aug 2022"
---
```

Una plantilla común para páginas de Markdown incluye:

1. La propiedad `frontmatter` para acceder al frontmatter y otra data de la página de Markdown o MDX. Puedes dirigirte a [Markdown Layout Props](#props-de-la-plantilla-de-markdown) para ver la lista de props disponibles.
2. Un [`<slot />`](/es/core-concepts/astro-components/#slots) predeterminado para indicar dónde debe mostrarse el contenido de la página de Markdown.

```astro /(?<!//.*){?frontmatter(?:\\.\w+)?}?/ "<slot />"
---
// src/layouts/BaseLayout.astro
// 1. La propiedad frontmatter le dará acceso al frontmatter y otra data.
const { frontmatter } = Astro.props;
---
<html>
  <head>
    <!-- Agregue aquí otros elementos de Head, como estilos y etiquetas meta. -->
    <title>{frontmatter.title}</title>
  </head>
  <body>
    <!-- Agregue aquí otros componentes de UI, como encabezados y pies de página -->
    <h1>{frontmatter.title} by {frontmatter.author}</h1>
    <!-- 2. El HTML renderizado se pasará al slot predeterminado. -->
    <slot />
    <p>Escrito en: {frontmatter.date}</p>
  </body>
</html>
```

### Props de la plantilla de Markdown

:::note
Los archivos Markdown y MDX no retornan objetos `Astro.props` idénticos. Puedes ver la guía de integración de MDX para ver [las propiedades MDX expuestas](/es/guides/integrations-guide/mdx/#exported-properties).
:::

Una plantilla Markdown tiene acceso, via `Astro.props`, a la siguiente información:

- **`frontmatter`** - Todo el frontmatter del documento Markdown o MDX.
  - **`frontmatter.file`** - La ruta absoluta de este archivo (por ejemplo, `/home/user/projects/.../file.md`).
  - **`frontmatter.url`** - Si es una página, la URL de la misma (por ejemplo, `/en/guides/markdown-content`).
- **`headings`** - Lista de encabezados (`h1 -> h6`) en el documento Markdown con su metadata asociada. Esta lista tiene la siguiente forma de datos: `{ depth: number; slug: string; text: string }[]`.
- **`rawContent()`** - Una función que devuelve el documento Markdown de forma raw.
- **`compiledContent()`** - Una función que devuelve el documento Markdown compilado a un string HTML.

Un artículo de blog de ejemplo podría pasar el siguiente objeto `Astro.props` a su plantilla:

```js
Astro.props = {
  frontmatter: {
    /** Frontmatter de un artículo de blog */
    title: "Astro actualización 0.18",
    date: "Martes, Julio 27 2021",
    author: "Matthew Phillips",
    description: "Astro 0.18 es nuestra mayor actualización desde el lanzamiento de Astro.",
    /** Valores generados */
    file: "/home/user/projects/.../file.md",
    url: "/en/guides/markdown-content/"
  },
  headings: [
    {
      "depth": 1,
      "text": "Astro actualización 0.18",
      "slug": "astro-018-release"
    },
    {
      "depth": 2,
      "text": "Hidratación parcial adaptativa",
      "slug": "responsive-partial-hydration"
    }
    /* ... */
  ],
  rawContent: () => "# Astro actualización 0.18\nHace poco más de un mes, la primera beta pública [...]",
  compiledContent: () => "<h1>Astro actualización 0.18</h1>\n<p>Hace poco más de un mes, la primera beta pública [...]</p>",
}
```

#### Ejemplo: Utilizando una plantilla para archivos `.md`, `.mdx` y `.astro`

Puedes escribir una plantilla de Astro para recibir el objeto `frontmatter` de archivos `.md` y `.mdx`, como así también cualquier otra prop pasada desde archivos `.astro`.

En el siguiente ejemplo, la plantilla mostrará el título de la página, ya sea desde un componente Astro pasando un atributo `title` o de una propiedad `title` del YAML de un frontmatter:

```astro /{?title}?/ /Astro.props[.a-z]*/
---
// src/components/MyLayout.astro
const { title } = Astro.props.frontmatter || Astro.props;
---
<html>
  <head></head>
  <body>
    <h1>{title}</h1>
    <slot />
  </body>
</html>
```

### IDs de título en Markdown

Astro agregará identificaciones generadas automáticamente a todos los títulos y subtítulos en los archivos Markdown usando [github-slugger](https://github.com/Flet/github-slugger). Pero, si se especifica una identificación personalizada, no será sobrescrita.

Estas identificaciones se agregarán _después_ de que se ejecuten todos los demás complementos, por lo que si tienes un complemento como `rehype-toc` que necesita identificaciones, deberás agregar tu propio plugin de slug (como `rehype-slug`).

### Borradores en Markdown

`draft: true` es un valor opcional que marcará una página o artículo individual `.md` como "borrador". De forma predeterminada, esta página se excluirá de la compilación final de su proyecto.

Las páginas de Markdown sin la propiedad `draft` o aquellas con `draft: false` no se verán afectadas y se incluirán en la compilación final.

```markdown {5}
---
# src/pages/post/blog-post.md
layout: ../../layouts/BaseLayout.astro
title: Mi artículo de blog
draft: true
---

Este es mi artículo de blog en progreso.

No se creará ninguna página para esta publicación.

Para crear y publicar esta publicación:

- actualiza el frontmatter a `draft: false` o
- elimina la propiedad `draft` por completo.
```

:::caution[Borradores y Astro.glob()]
Aunque `draft: true` evitará que se construya la página de tu proyecto, este archivo estará disponible para [`Astro.glob()`](/es/reference/api-reference/#astroglob) el cual devuelve **todos los archivos Markdown** en la ruta especificada.
:::

Para evitar que los borradores sean incluidos en un registro de artículos o en la lista de artículos más recientes, puedes filtrar los resultados devueltos por `Astro.glob()`.

```js
const posts = await Astro.glob('../pages/post/*.md');
const nonDraftPosts = posts.filter((post) => !post.frontmatter.draft);
```

⚙️ Para habilitar la creación de páginas de borrador:

Agrega `drafts: true` a `markdown` en `astro.config.mjs`

```js ins={4}
// astro.config.mjs
export default defineConfig({
  markdown: {
    drafts: true,
  },
});
```

:::tip
¡También puedes agregar la extensión `--drafts` al ejecutar `astro build` para incluir la creación de páginas borrador!
:::

### Variables y Componentes

:::caution[Deprecated]
Astro v1.0 **solamente admite Markdown estándar en archivos `.md`**. [Ya no admite componentes o JSX en las páginas de Markdown de forma predeterminada](/es/migrate/#deprecated-components-and-jsx-in-markdown) y es posible que se elimine en una versión futura.

Mientras tanto, la configuración de Astro admite una [legacy flag](/es/reference/configuration-reference/#legacyastroflavoredmarkdown) que reactivará estas funcionalidades en páginas de Markdown hasta que pueda migrar a MDX en Astro. La integración de MDX en Astro es el camino recomendado si deseas agregar más funcionalidades que las que provee el estándar de Markdown.
:::

Por favor instala la integración oficial [`@astrojs/mdx`](/es/guides/integrations-guide/mdx/) para poder usar:

- [variables y expresiones JSX en archivos MDX (`.mdx`)](/es/guides/integrations-guide/mdx/#variables).

- [componentes de Astro](/es/core-concepts/astro-components/) or [components de framework](/es/core-concepts/framework-components/) en archivos MDX (`.mdx`).

Consulta la guía de migración para obtener ayuda [con la conversión de tus archivos Astro `.md` a `.mdx`](/es/migrate/#converting-existing-md-files-to-mdx).

## Características de MDX

Astro incluye soporte completo para MDX mediante la integración oficial `@astrojs/mdx`. Consulta la [guía de integración de MDX](/es/guides/integrations-guide/mdx/) para más información sobre esta integración, la cual soporta las características deprecadas de la sección anterior y mejora tu Markdown.

### Usando Variables en MDX

Con la integración `@astrojs/mdx`, puedes utilizar [variables y expresiones JSX en archivos MDX (`.mdx`)](/es/guides/integrations-guide/mdx/#variables).


### Usando Componentes en MDX

Con la integración `@astrojs/mdx`, puedes usar tus componentes Astro o de framework en archivos MDX (`.mdx`) de la misma forma que los [usarías en cualquier otro componente de Astro](/es/core-concepts/framework-components/#usando-componentes-de-framework).

¡No olvides agregar una directiva `client:` si es necesario!


## Importando Markdown

¡Puedes importar archivos Markdown directamente en sus archivos Astro! Puedes importar una página específica con `import` o varias con `Astro.glob()`

```astro title="src/pages/index.astro" {3,6}
---
// Importa Markdown. ¡La importación dinámica usando import() también es compatible!
import * as greatPost from '../pages/post/great-post.md';

// Además, puedes importar varios archivos con Astro.glob
const posts = await Astro.glob('../pages/post/*.md');
---

Genial artículo: <a href={greatPost.url}>{greatPost.frontmatter.title}</a>

<ul>
  {posts.map(post => <li>{post.frontmatter.title}</li>)}
</ul>
```

Opcionalmente, puedes proporcionar un tipo para la variable `frontmatter` usando un genérico de TypeScript:

```astro title="src/pages/index.astro" ins={2-5} ins="<Frontmatter>"
---
interface Frontmatter {
  title: string;
  description?: string;
}
const posts = await Astro.glob<Frontmatter>('../pages/post/*.md');
---

<ul>
  {posts.map(post => <li>{post.frontmatter.title}</li>)}
  <!-- post.frontmatter.title será un `string`! -->
</ul>
```

### Propiedades exportadas

Cada archivo Markdown exporta las siguientes propiedades:

:::note[mdx]
Puedes ver las [propiedades exportadas para archivos MDX](/es/guides/integrations-guide/mdx/#exported-properties) al utilizar la integración MDX.
:::

#### `frontmatter`

Contiene cualquier dato especificado en el frontmatter YAML de este archivo.

#### `file`

La ruta absoluta de este archivo (por ejemplo, `/home/user/projects/.../file.md`).

#### `url`

Si es una página, contiene la URL de la página (por ejemplo, `/es/guides/markdown-content`).

#### `getHeadings()`

Una función asíncrona que devuelve los encabezados del archivo Markdown. La respuesta sigue este tipo:

```ts
{ depth: number; slug: string; text: string }[]
```

#### `rawContent()`

Una función que devuelve el contenido sin procesar del archivo Markdown (excluyendo el bloque frontmatter) como un string. Esto es útil cuando, por ejemplo, se calculan los "minutos leídos". Este ejemplo usa el popular paquete [reading-time](https://www.npmjs.com/package/reading-time):

:::tip
¡Si planeas utilizar `rawContent` para calcular valores como "tiempo de lectura", te sugerimos usar un complemento de remark o rehype para inyectar frontmatter! Puedes ver nuestro [ejemplo de cálculo de tiempo de lectura](#ejemplo-calcular-tiempo-de-lectura) para más información.
:::

#### `compiledContent()`

Una función que devuelve el documento compilado en HTML como string. ¡Nota que **esto no incluye layouts configuradas en tu frontmatter**! Solo se devuelve el documento como HTML.

:::caution
**[Para usuarios de `legacy.astroFlavoredMarkdown`](/es/reference/configuration-reference/#legacyastroflavoredmarkdown):** Esto no analiza `{expresiones jsx}` o `<Componentes />`. Solamente bloques estándar de Markdown como `##títulos` y `-listas` se compilarán a HTML.
:::

#### `Content`

Un componente que representa todo el contenido del archivo Markdown. Aquí hay un ejemplo:

```astro title="src/pages/content.astro" "Content"
---
import {Content as PromoBanner} from '../components/promoBanner.md';
---

<h2>Today's promo</h2>
<PromoBanner />
```

Cuando se usa `getStaticPaths` y `Astro.glob()` para generar páginas desde archivos Markdown, puedes pasar el componente `<Content/>` a través de las `props` de la página. Luego, puedes obtener el componente desde `Astro.props` y renderizarlo en tu plantilla.

```astro title="src/pages/[slug].astro" {9-11} "Content" "Astro.props.post"
---
export async function getStaticPaths() {
  const posts = await Astro.glob('../posts/**/*.md')

  return posts.map(post => ({
    params: {
      slug: post.frontmatter.slug
    },
    props: {
      post
    },
  }))
}

const { Content } = Astro.props.post
---
<article>
  <Content/>
</article>
```

## Configuración de Markdown

El soporte de Markdown en Astro está basado en [remark](https://remark.js.org/), una potente herramienta de análisis sintáctico y procesamiento con un ecosistema activo. Otros analizadores de Markdown como Pandoc y markdown-it no están actualmente soportados.

Puedes personalizar cómo remark analiza tu Markdown en `astro.config.mjs`. Consulta [la documentación de referencia](/es/reference/configuration-reference/#opciones-de-markdown) para más detalles de configuración o sigue nuestras guías a continuación sobre cómo agregar plugins de remark y personalizar el resaltado de sintaxis.

:::note[mdx]
Las siguientes instrucciones son para configurar Markdown estándar. Para configurar complementos de MDX y opciones de frontmatter, dirígete a la sección adecuada en la [guía de integración de MDX](/es/guides/integrations-guide/mdx/#configuration).
:::

### Plugins de Markdown

Astro es compatible con complementos externos como [remark](https://github.com/remarkjs/remark) y [rehype](https://github.com/rehypejs/rehype). Puedes proporcionar otros complementos en `astro.config.mjs`.

:::note
Habilitar `remarkPlugins` o `rehypePlugins` personalizados eliminará estos complementos integrados y deberás agregarlos explícitamente si lo deseas.

De forma predeterminada, Astro viene con [GitHub flavored markdown](https://github.com/remarkjs/remark-gfm) y [remark-smartypants](https://github.com/silvenon/remark-smartypants) habilitados.
:::

#### ¿Cómo agregar plugins de Markdown a Astro?

1. Instala la dependencia del paquete npm en tu proyecto.

2. Actualiza `remarkPlugins` o `rehypePlugins` dentro de las opciones `markdown`:

   ```js
   // astro.config.mjs
   export default {
     markdown: {
       remarkPlugins: [
         // Agrega el plugin de remark que desees habilitar para tu proyecto.
         // Si necesitas proporcionar opciones para el plugin, puedes usar un array y colocar las opciones en el segundo elemento.
         // ['remark-autolink-headings', { behavior: 'prepend'}],
       ],
       rehypePlugins: [
         // Agrega un plugin de rehype que desees habilitar para tu proyecto.
         // Si necesitas proporcionar opciones para el plugin, puedes usar un array y colocar las opciones en el segundo elemento.
         // 'rehype-slug',
         // ['rehype-autolink-headings', { behavior: 'prepend'}],
       ],
     },
   };
   ```

   Puedes proporcionar nombres de los plugins e importarlos:

    ```js ins={2,6}
   // astro.config.mjs
   import autolinkHeadings from 'remark-autolink-headings';

   export default {
     markdown: {
       remarkPlugins: [[autolinkHeadings, { behavior: 'prepend' }]],
     },
   };
   ```

### Inyectando frontmatter

Es probable que quieras agregar propiedades al frontmatter de tus archivos Markdown de manera programática. Puedes generar estas propiedades basándote en el contenido del archivo utilizando un [complemento de remark o rehype](#plugins-de-markdown).

Puedes agregar desde el argumento `file` de tu complemento a la propiedad `data.astro.frontmatter` de la siguiente manera:

```js title="example-remark-plugin.mjs"
export function exampleRemarkPlugin() {
  // Todos los complementos remark y rehype devuelven una función
  return function (tree, file) {
    file.data.astro.frontmatter.customProperty = 'Propiedad generada';
  }
}
```

Luego, al aplicar este complemento a tu configuración `markdown`:

```js title="astro.config.mjs" "import { exampleRemarkPlugin } from './example-remark-plugin.mjs';" "remarkPlugins: [exampleRemarkPlugin],"
import { exampleRemarkPlugin } from './example-remark-plugin.mjs';

export default {
  markdown: {
    remarkPlugins: [exampleRemarkPlugin],
  },
};

```

...¡cada archivo Markdown tendrá `customProperty` en su frontmatter! Esto está disponible al [importar markdown](#importando-markdown) y en [la propiedad `Astro.props.frontmatter` en tus plantillas](#páginas-de-markdown-y-mdx).

#### Ejemplo: calcular tiempo de lectura

Puedes usar un [complemento de remark](https://github.com/remarkjs/remark) para agregar tiempo de lectura a tu frontmatter. Sugerimos dos paquetes:
- [`reading-time`](https://www.npmjs.com/package/reading-time) para calcular los minutos de lectura
- [`mdast-util-to-string`](https://www.npmjs.com/package/mdast-util-to-string) para extraer el texto de tu markdown

```shell
npm i reading-time mdast-util-to-string
```

Podemos aplicar estos paquetes de la siguiente manera:

```js title="remark-reading-time.mjs"
import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

export function remarkReadingTime() {
	return function (tree, { data }) {
    const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);
    // readingTime.text nos dará los minutos de lectura en un string amigable,
    // por ejemplo, "3 min read"
		data.astro.frontmatter.minutesRead = readingTime.text;
	};
}
```

Una vez que aplicas este complemento en tu configuración:

```js title="astro.config.mjs" "import { remarkReadingTime } from './remark-reading-time.mjs';" "remarkPlugins: [remarkReadingTime],"
import { remarkReadingTime } from './remark-reading-time.mjs';

export default {
  markdown: {
    remarkPlugins: [remarkReadingTime],
  },
};

```

...todos los documentos de Markdown tendrán un `minutesRead` calculado. Puedes usar esto para incluir un banner "X min read" en una [plantilla de markdown](#páginas-de-markdown-y-mdx), por ejemplo:

```astro title="src/layouts/BlogLayout.astro" "const { minutesRead } = Astro.props.frontmatter;" "<p>{minutesRead}</p>"
---
const { minutesRead } = Astro.props.frontmatter;
---

<html>
  <head>...</head>
  <body>
    <p>{minutesRead}</p>
    <slot />
  </body>
</html>
```

### Resaltado de sintaxis

Astro viene con soporte integrado para [Shiki](https://shiki.matsu.io/) y [Prism](https://prismjs.com/). Esto proporciona un resaltado de sintaxis instantáneo para:

- todas las vallas de código (\`\`\`) usadas en los archivos markdown (`.md`).
- el contenido dentro del [componente `<Code />`](/es/reference/api-reference/#code-) (con la tecnología de Shiki), o el [componente `<Prism />`](/es/reference/api-reference/#prism-) (con la tecnología de Prism).

Shiki está habilitado de forma predeterminada, preconfigurado con el tema `github-dark`. La salida compilada se limitará a estilos en línea sin clases CSS externas, hojas de estilo o JS del lado del cliente.

Si optas por usar Prism, se aplicarán las clases CSS de Prism en su lugar. ¡Ten en cuenta que **necesitas aportar tu propia hoja de estilo CSS** para que aparezca el resaltado de sintaxis! Consulta la [sección de configuración de Prism](#configuración-de-prism) para obtener más detalles.

#### Escoja un resaltador de sintaxis

Shiki es nuestro resaltador de sintaxis predeterminado. Si deseas cambiar a `'prism'` o deshabilitar el resaltado de sintaxis por completo, puedes usar el objeto de configuración `markdown`:

```js ins={5}
// astro.config.mjs
export default {
  markdown: {
    // Puede ser 'shiki' (predeterminado), 'prism' o false para deshabilitar el resaltado
    syntaxHighlight: 'prism',
  },
};
```

#### Configuración de Shiki

Al usar Shiki, puedes configurar todas las opciones a través del objeto `shikiConfig` así:

```js
// astro.config.mjs
export default {
  markdown: {
    shikiConfig: {
      // Escoge entre los temas integrados de Shiki (o agrega los tuyos propios)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: 'dracula',
      // Agrega lenguajes de programación personalizados
      // Nota: Shiki tiene innumerables lenguajes de programación incorporados, ¡incluido .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Habilita word wrap para evitar el desplazamiento horizontal
      wrap: true,
    },
  },
};
```

También sugerimos [leer la documentación de Shiki sobre sus temas](https://github.com/shikijs/shiki/blob/main/docs/themes.md#loading-theme) para explorar la carga de un tema personalizado, alternar entre el modo claro y el oscuro, o estilar a través de variables de CSS.

#### Configuración de Prism

Cuando uses Prism, deberás agregar una hoja de estilos a tu proyecto para resaltar la sintaxis. Si recién empiezas y prefieres usar Prism en lugar de Shiki, te sugerimos:

1. [Configurar `syntaxHighlight: 'prism'`](#escoja-un-resaltador-de-sintaxis) desde la configuración de `@astrojs/markdown-remark`.
2. Escoger una hoja de estilo prediseñada de los [temas de Prism](https://github.com/PrismJS/prism-themes) disponibles.
3. Agregar esta hoja de estilo a la [carpeta `public/`](/es/core-concepts/project-structure/#public) de tu proyecto.
4. Cargar esta en el [`<head>` de su página](/es/core-concepts/astro-pages/#páginas-html) a través de una etiqueta `<link>`.

También puedes visitar la [lista de lenguajes de programación soportados por Prism](https://prismjs.com/#supported-languages) para conocer las opciones y su uso.
