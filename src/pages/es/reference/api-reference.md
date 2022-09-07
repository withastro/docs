---
setup: |
  import Since from '~/components/Since.astro';
  import Tabs from '../../../components/tabs/Tabs';
layout: ~/layouts/MainLayout.astro
title: Referencia de la API
i18nReady: true
---

## `Astro` global

El objeto global `Astro` está disponible en todos los contextos en los archivos `.astro`. Tiene las siguientes funciones:

### `Astro.glob()`

`Astro.glob()` es una forma de cargar archivos locales en la configuración de su página estática.

```astro
---
// ./src/components/my-component.astro
const posts = await Astro.glob('../pages/post/*.md'); // devuelve un array de artículos encontrados en ./src/pages/post/*.md
---

<div>
{posts.slice(0, 3).map((post) => (
  <article>
    <h1>{post.frontmatter.title}</h1>
    <p>{post.frontmatter.description}</p>
    <a href={post.frontmatter.url}>Read more</a>
  </article>
))}
</div>
```

`.glob()` solo toma un parámetro: la URL relativa de los archivos locales que te gustaría importar. Es asíncrono y devuelve un array con las exportaciones de los archivos coincidentes.

`.glob()` no puede tomar variables o strings que las interpolen, ya que no son analizables de manera estática. (Consulta la [guía de solución de problemas](/es/guides/troubleshooting/#valores-compatibles) para una solución alternativa.) Esto se debe a que `Astro.glob()` es un wrapper de la función [`import.meta.glob()`](https://vitejs.dev/guide/features.html#glob-import) de Vite.

:::note
También puedes utilizar `import.meta.glob()` directamente en tu proyecto de Astro. Es posible que quieras hacer esto cuando:
- Necesitas esta característica en un archivo que no sea `.astro`, como una ruta API. `Astro.glob()` solamente está disponible en archivos `.astro`, mientras que `import.meta.glob()` es accesible en todo el proyecto.
- No necesitas cargar cada archivo de inmediato. `import.meta.glob()` puede devolver funciones que importan el contenido del archivo, en vez de devolver el contenido en sí.
- Quieres acceder a la ruta de cada archivo. `import.meta.glob()` devuelve un map de la ruta del archivo a su contenido, mientras que `Astro.glob()` devuelve una lista de contenido.
- Quieres pasar múltiples patrones; por ejemplo, quieres añadir un "patrón negativo" que filtra ciertos archivos. `import.meta.glob()` opcionalmente puede tomar un array de strings globales en vez de un solo string.

Lee más en la [documentación de Vite](https://vitejs.dev/guide/features.html#glob-import).
:::
#### Archivos Markdown

Los archivos Markdown tienen la siguiente interfaz:

```ts
export interface MarkdownInstance<T extends Record<string, any>> {
  /* Cualquier dato especificado en el frontmatter de YAML del archivo */
	frontmatter: T;
  /* La ruta del archivo */
	file: string;
  /* La ruta en donde se renderizará este archivo */
	url: string | undefined;
  /* Componente de Astro que renderizará el contenido del archivo */
	Content: AstroComponent;
  /* Función que devuelve un array de elementos h1...h6 del archivo */
	getHeadings(): Promise<{ depth: number; slug: string; text: string }[]>;
}
```

Opcionalmente, puedes proporcionar un tipo para la variable de `frontmatter` usando un tipo genérico de TypeScript.

```astro
---
interface Frontmatter {
  title: string;
  description?: string;
}
const posts = await Astro.glob<Frontmatter>('../pages/post/*.md');
---

<ul>
  {posts.map(post => <li>{post.frontmatter.title}</li>)}
</ul>
```

### `Astro.props`

`Astro.props` es un objeto que contiene cualquier valor que haya sido pasado como [atributo de componente](/es/core-concepts/astro-components/#props-de-componentes). Los componentes de plantilla para archivos `.md` y `.mdx` reciben valores de frontmatter como props.

```astro {3}
---
// ./src/components/Heading.astro
const { title, date } = Astro.props;
---
<div>
    <h1>{title}</h1>
    <p>{date}</p>
</div>
```

```astro /title=".+"/ /date=".+"/
---
// ./src/pages/index.astro
import Heading from '../components/Heading.astro';
---
<Heading title="Mi Primer Artículo" date="09 Ago 2022" />
```

📚 Aprende acerca de cómo se manejan las props en las [Plantillas de Markdown y MDX](/es/guides/markdown-content/#layout-en-el-frontmatter).

📚 Aprende cómo añadir [definiciones de tipos de Typescript para tus props](/es/guides/typescript/#props-de-componentes).

#### Archivos Astro

Los archivos Astro tienen la siguiente interfaz:

```ts
export interface AstroInstance {
	default: AstroComponent;
}
```

#### Otros archivos

Otros archivos pueden tener varias interfaces diferentes, pero `Astro.glob()` acepta un genérico de TypeScript si sabes exactamente qué tipo contiene un archivo no reconocido.

```ts
---
interface CustomDataFile {
  default: Record<string, any>;
}
const data = await Astro.glob<CustomDataFile>('../data/**/*.js');
---
```

### `Astro.request`

`Astro.request` es un objeto [Request](https://developer.mozilla.org/es/docs/Web/API/Request) estándar. Se puede utilizar para obtener la `url`, `headers`, `method` e incluso el cuerpo de la solicitud.

```astro
<p>Recibí una solicitud {Astro.request.method} en "{Astro.request.url}".</p>
<p>Encabezados de solicitud recibidos:<code>{JSON.stringify(Object.fromEntries(Astro.request.headers))}</code>
```

Ver también: [`Astro.url`](#astrourl)

:::note
Con la opción por defecto `output: 'static'`, El objeto `Astro.request.url` no contiene parámetros de busqueda, tales como `?foo=bar`, ya que no es posible determinarlos por adelantado durante la compilación final de los archivos. Sin embargo en el modo `output: 'server'`, el objeto `Astro.request.url` contiene los parámetros de busqueda debido a que pueden ser determinados desde una petición al servidor.
:::

### `Astro.response`

`Astro.response` es un objeto [ResponseInit](https://developer.mozilla.org/es/docs/Web/API/Response/Response) estándar. Se utiliza para establecer el `status`, `statusText` y `headers` para la respuesta de una página.

```astro
---
if(condition) {
  Astro.response.status = 404;
  Astro.response.statusText = 'Not found';
}
---
```

O para establecer un header:

```astro
---
Astro.response.headers.set('Set-Cookie', 'a=b; Path=/;');
---
```

### `Astro.canonicalURL`

:::caution[Obsoleto]
Utiliza [`Astro.url`](#astrourl) para construir tu propia URL canónica.
:::

La [URL canónica][canonical] de la página actual.

### `Astro.url`

<Since v="1.0.0-rc" />

Un objeto [URL](https://developer.mozilla.org/es/docs/Web/API/URL) construido a partir del valor actual de la string URL `Astro.request.url`. Útil para interactuar con propiedades individuales de la URL de la solicitud, como la ruta o el origen.

Equivalente a hacer `new URL (Astro.request.url)`.

```astro
<h1>La URL actual es: {Astro.url}</h1>
<h1>El nombre de la ruta URL actual es: {Astro.url.pathname}</h1>
<h1>El origen de la URL actual es: {Astro.url.origin}</h1>
```

También puedes usar `Astro.url` para crear nuevas URL pasándola como argumento a [`new URL()`](https://developer.mozilla.org/es/docs/Web/API/URL/URL).

```astro
---
// Ejemplo: construye una URL canónica usando tu dominio de producción
const canonicalURL = nueva URL (Astro.url.pathname, Astro.site);
// Ejemplo: construye una URL para metaetiquetas SEO usando tu dominio actual
const socialImageURL = nueva URL('/images/preview.png', Astro.url);
---
<link rel="canonical" href={canonicalURL} />
<meta property="og:image" content={socialImageURL} />
```

### `Astro.clientAddress`

<Since v="1.0.0-rc" />

Especifica la [dirección IP](https://es.wikipedia.org/wiki/Direcci%C3%B3n_IP) de la solicitud. Esta propiedad solo está disponible cuando se compila para SSR (renderizado en el servidor) y no debe usarse para sitios estáticos.

```astro
---
const ip = Astro.clientAddress;
---

<div>Tu dirección IP es: <span class="address">{ ip }</span></div>
```

### `Astro.site`

`Astro.site` devuelve una `URL` generada desde `site` en su configuración de Astro. Si no está definido, devolverá una URL generada desde `localhost`.

### `Astro.generator`

<Since v="1.0.0" />

`Astro.generator` es una manera conveniente de agregar una etiqueta [`<meta name="generator">`](https://html.spec.whatwg.org/multipage/semantics.html#meta-generator) con tu versión actual de Astro. Responde al formato `"Astro v1.x.x"`.

```astro mark="Astro.generator"
<html>
  <head>
    <meta name="generator" content={Astro.generator} />
  </head>
  <body>
    <footer>
      <p>Built with <a href="https://astro.build">{Astro.generator}</a></p>
    </footer>
  </body>
</html>
```

### `Astro.slots`

`Astro.slots` contiene funciones de utilidad para modificar los hijos en slots de un componente Astro.

| Name           | Type                                              | Description                                        |
| :------------- | :------------------------------------------------ | :------------------------------------------------- |
| `has`          | `(name: string) => boolean`                       | Si existe contenido para el nombre del slot          |
| `render`       | `(name: string, args?: any[]) => Promise<string>` | Representa de forma asíncrona este slot y devuelve HTML   |

```astro
---
let html: string = '';
if (Astro.slots.has('default')) {
  html = await Astro.slots.render('default')
}
---
<Fragment set:html={html} />
```
<!-- Waiting for bug fix from Nate; reformat CAREFULLY when un-uncommenting out!


`Astro.slots.render` optionally accepts a second argument, an array of parameters that will be forwarded to any function children. This is extremely useful for custom utility components.

Given the following `Message.astro` component...

tick tick tick astro
---
let html: string = '';
if (Astro.slots.has('default')) {
  html = await Astro.slots.render('default', Astro.props.messages)
}
---
<Fragment set:html={html} />
```

You could pass a callback function that renders our the message:

tick tick tick astro
<div><Message messages={['Hello', 'world!']}>{(messages) => messages.join(' ')}</Message></div>
 renders as // make this a code comment again
<div>Hello world!</div>
```
-->

### `Astro.self`

`Astro.self` permite llamar recursivamente a los componentes de Astro. Este comportamiento te permite renderizar un componente de Astro desde dentro de sí mismo utilizando `<Astro.self>` en la plantilla del componente. Esto puede ser útil para iterar sobre grandes data stores y estructuras de datos anidadas.

```astro
---
// NestedList.astro
const { items } = Astro.props;
---
<ul class="nested-list">
  {items.map((item) => (
    <li>
      <!-- Si hay una estructura de datos anidada renderizamos `<Astro.self>` -->
      <!-- y podemos pasar props a través de la llamada recursiva -->
      {Array.isArray(item) ? (
        <Astro.self items={item} />
      ) : (
        item
      )}
    </li>
  ))}
</ul>
```

Este componente podría usarse así:

```astro
---
import NestedList from './NestedList.astro';
---
<NestedList items={['A', ['B', 'C'], 'D']} />
```

Y renderizaría este HTML:

```html
<ul class="nested-list">
  <li>A</li>
  <li>
    <ul class="nested-list">
      <li>B</li>
      <li>C</li>
    </ul>
  </li>
  <li>D</li>
</ul>
```

## `getStaticPaths()`

Si una página usa parámetros dinámicos en el nombre del archivo, ese componente necesitará exportar una función `getStaticPaths()`.

Esta función es necesaria porque Astro es un creador de sitios estáticos. Eso significa que todo su sitio se construye con anticipación. Si Astro no sabe generar una página en el momento de la creación, sus usuarios no la verán cuando visiten tu sitio.

```astro
---
export async function getStaticPaths() {
  return [
    { params: { /* requerido */ }, props: { /* opcional */ } },
    { params: { ... } },
    { params: { ... } },
    // ...
  ];
}
---
<!-- Tu maquetado HTML aquí. -->
```

La función `getStaticPaths()` debe devolver un array de objetos para determinar qué rutas serán pre-renderizadas por Astro.

:::caution
La función `getStaticPaths()` se ejecuta en su propio ámbito aislado una vez, antes de que se cargue cualquier página. Por lo tanto, no puede hacer referencia a nada desde el ámbito principal, aparte de las importaciones de archivos. El compilador le advertirá si incumple este requisito.
:::

### `params`

La key `params` de cada objeto devuelto le dice a Astro qué rutas construir. Los parámetros devueltos deben corresponder con los parámetros dinámicos y los parámetros comodín definidos en la ruta de archivo de su componente.

Los `params` están codificados en la URL, por lo que solo se admiten strings y números como valores. El valor de cada objeto `params` debe coincidir con los parámetros utilizados en el nombre de la página.

Por ejemplo, supongamos que tienes una página en `src/pages/posts/[id].astro`. Si exportas `getStaticPaths` desde esta página y devuelves lo siguiente para las rutas:

```astro
---
export async function getStaticPaths() {
  return [
    { params: { id: '1' } },
    { params: { id: '2' } },
    { params: { id:  3  } }  // Can be a number too!
  ];
}

const { id } = Astro.params;
---
<h1>{id}</h1>
```

Luego, Astro generará estáticamente `posts/1`, `posts/2` y `posts/3` en el momento de la compilación.

### Transferencia de datos con `props`

Para pasar datos adicionales a cada página generada, también puedes establecer un valor `props` en cada objeto de ruta devuelto. A diferencia de `params`, `props` no están codificados en la URL y, por lo tanto, no están limitados a solamente strings.

Por ejemplo, suponiendo que generas páginas basadas en datos obtenidos de una API remota. Puedes pasar el objeto de datos completo al componente de página dentro de `getStaticPaths`:

```astro
---
export async function getStaticPaths() {
  const data = await fetch('...').then(response => response.json());

  return data.map((post) => {
    return {
      params: { id: post.id },
      props: { post },
    };
  });
}

const { id } = Astro.params;
const { post } = Astro.props;
---
<h1>{id}: {post.name}</h1>
```

También puedes pasar un array regular, que puede ser útil al generar o agregar una lista conocida de rutas.

```astro
---
export async function getStaticPaths() {
  const posts = [
    {id: '1', category: "astro", title: "API Reference"},
    {id: '2', category: "react", title: "Creating a React Counter!"}
  ];
  return posts.map((post) => {
    return {
      params: { id: post.id },
      props: { post }
    };
  });
}
const {id} = Astro.params;
const {post} = Astro.props;
---
<body>
  <h1>{id}: {post.title}</h1>
  <h2>Categoría: {post.category}</h2>
</body>
```

Luego, Astro generará estáticamente `posts/1` y `posts/2` en el momento de la compilación usando el componente de página en `pages/posts/[id].astro`. La página puede hacer referencia a estos datos usando `Astro.props`:

### `paginate()`

La paginación es un caso de uso común para los sitios web que Astro admite de forma nativa a través de la función `paginate()`. `paginate()` generará automáticamente un array para devolver desde `getStaticPaths()` que creará una URL para cada página de la colección paginada. El número de página se pasará como un parámetro, y los datos de la página se pasarán como una prop `page`.

```js
export async function getStaticPaths({ paginate }) {
  // Carga tus datos con fetch(), Astro.glob(), etc.
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=150`);
  const result = await response.json();
  const allPokemon = result.results;

  // Devuelve una colección paginada de rutas para todas los artículos.
  return paginate(allPokemon, { pageSize: 10 });
}

// Si se configuró correctamente, La prop de la página ahora tiene todo lo que
// necesita para renderizar una página (vea la siguiente sección).
const { page } = Astro.props;
```

`paginate()` asume un nombre de archivo `[page].astro` o `[...page].astro`. El parámetro `page` se convierte en el número de página en la URL:

- `/posts/[page].astro` generaría las URL `/posts/1`, `/posts/2`, `/posts/3`, etc.
- `/posts/[...page].astro` generaría las URL `/posts`, `/posts/2`, `/posts/3`, etc.

#### La prop de paginación `page`

La paginación pasará una prop `page` a cada página renderizada que represente una sola página de datos en la colección paginada. Esto incluye los datos que ha paginado (`page.data`), así como los metadatos de la página (`page.url`, `page.start`, `page.end`, `page.total`, etc.) . Estos metadatos son útiles para cosas como un botón "Página siguiente" o un mensaje "Mostrando 1-10 de 100".

| Nombre             |         Tipo          | Descripción                                                                                                                       |
| :----------------- | :-------------------: | :-------------------------------------------------------------------------------------------------------------------------------- |
| `page.data`        |        `Array`        | Array de datos devueltos desde `data()` para la página actual.                                                                     |
| `page.start`       |       `number`        | Índice del primer elemento en la página actual, comenzando en `0` (por ejemplo, si `pageSize: 25`, sería `0` en la página 1, `25` en la página 2, etc.). |
| `page.end`         |       `number`        | Índice del último elemento de la página actual.                                                                                               |
| `page.size`        |       `number`        | Cantidad de artículos por página.                                                                   |
| `page.total`       |       `number`        | El número total de elementos en todas las páginas.                                                                                       |
| `page.currentPage` |       `number`        | El número de página actual, comenzando con `1`.                                                                                       |
| `page.lastPage`    |       `number`        | El número total de páginas.                                                                                                        |
| `page.url.current` |       `string`        | La URL de la página actual (útil para URL canónicas)                                                                       |
| `page.url.prev`    | `string \| undefined` | La URL de la página anterior (será `undefined` si está en la página 1).                                                              |
| `page.url.next`    | `string \| undefined` | La URL de la siguiente página (será `undefined` si no hay más páginas).                                                              |

## `import.meta`

Todos los módulos ESM incluyen una propiedad `import.meta`. Astro agrega `import.meta.env` a través de [Vite](https://vitejs.dev/guide/env-and-mode.html).

**`import.meta.env.SSR`** se puede usar para saber cuándo se renderiza en el servidor. A veces, es posible que desees una lógica diferente, por ejemplo, un componente que solo debe representarse en el cliente:

```jsx
import { h } from 'preact';

export default function () {
  return import.meta.env.SSR ? <div class="spinner"></div> : <FancyComponent />;
}
```

## Componentes incorporados

Astro incluye varios componentes incorporados para que los uses en tus proyectos. Todos los componentes incorporados están disponibles en archivos `.astro` a través de `import {} from 'astro/components';`.

### `<Markdown />`

El componente Markdown ya no está integrado en Astro. Descubre cómo [importar Markdown en tus archivos Astro](/es/guides/markdown-content/#importando-markdown) en nuestra página de Markdown.

### `<Code />`

```astro
---
import { Code } from 'astro/components';
---
<!-- Resaltado de sintaxis de algún código JavaScript. -->
<Code code={`const foo = 'bar';`} lang="js" />
<!-- Opcional: personaliza tu tema. -->
<Code code={`const foo = 'bar';`} lang="js" theme="dark-plus" />
<!-- Opcional: habilita css wrap -->
<Code code={`const foo = 'bar';`} lang="js" wrap />
```

Este componente proporciona resaltado de sintaxis para bloques de código en el momento de la compilación (no incluye JavaScript del lado del cliente). El componente funciona internamente con Shiki y es compatible con todos los [temas populares](https://github.com/shikijs/shiki/blob/main/docs/themes.md) y [lenguajes de programación](https://github.com/shikijs/shiki/blob/main/docs/languages.md). Además, puedes agregar temas y lenguajes de programación personalizados modificando `theme` y `lang` respectivamente.

### `<Prism />`

:::note[Instalación]

Para usar el componente resaltador `Prism`, primero **instala** el paquete `@astrojs/prism`:

<Tabs client:visible>
  <Fragment slot="tab.1.npm">npm</Fragment>
  <Fragment slot="tab.2.yarn">yarn</Fragment>
  <Fragment slot="tab.3.pnpm">pnpm</Fragment>
  <Fragment slot="panel.1.npm">
  ```shell
  npm i @astrojs/prism
  ```
  </Fragment>
  <Fragment slot="panel.2.yarn">
  ```shell
  yarn add @astrojs/prism
  ```
  </Fragment>
  <Fragment slot="panel.3.pnpm">
  ```shell
  pnpm i @astrojs/prism
  ```
  </Fragment>
</Tabs>
:::

```astro
---
import { Prism } from '@astrojs/prism';
---
<Prism lang="js" code={`const foo = 'bar';`} />
```

Este componente proporciona resaltado de sintaxis específico con el lenguaje de programación para bloques de código al aplicar las clases CSS de Prism. Ten en cuenta que **debes proporcionar una hoja de estilo Prism CSS** (o traer la tuya propia) para que aparezca el resaltado de sintaxis. Consulta la [sección de configuración de Prism](/es/guides/markdown-content/#configuración-de-prism) para obtener más detalles.

Consulta la [lista de idiomas admitidos por Prism](https://prismjs.com/#supported-languages) donde puedes encontrar el alias correspondiente de un idioma. ¡Y también puedes mostrar tus bloques de código Astro con `lang="astro"`!

### `<Debug />`

```astro
---
import { Debug } from 'astro/components';
const serverObject = {
  a: 0,
  b: "string",
  c: {
    nested: "object"
  }
}
---
<Debug {serverObject} />
```

Este componente proporciona una forma de inspeccionar valores en el lado del cliente, sin JavaScript.

[canonical]: https://en.wikipedia.org/wiki/Canonical_link_element
