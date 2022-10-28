---
layout: ~/layouts/MainLayout.astro
title: Enrutamiento
description: Introducción al enrutamiento en Astro.
i18nReady: true
---

Astro utiliza **enrutamiento basado en archivos** para generar las URLs finales según el contenido de la carpeta `src/pages/`. Cuando se agrega un archivo a la carpeta `src/pages`, este estará disponible automáticamente como una ruta basada en el nombre del archivo.

## Rutas estáticas

Los componentes de Astro (`.astro`) y los archivos Markdown (`.md`) en la carpeta `src/pages` **se convierten automáticamente en páginas de su proyecto**. La ruta de cada página corresponde a la ruta y el nombre del archivo dentro del directorio `src/pages`.

```diff
# Ejemplo: Rutas estáticas
src/pages/index.astro        -> mysite.com/
src/pages/about.astro        -> mysite.com/about
src/pages/about/index.astro  -> mysite.com/about
src/pages/about/me.astro     -> mysite.com/about/me
src/pages/posts/1.md         -> mysite.com/posts/1
```

:::tip
¡No hay una "configuración de enrutamiento" separada para mantener en un proyecto Astro! Cuando se agrega un archivo al directorio `/src/pages`, se crea automáticamente una nueva ruta. En compilaciones estáticas, puedes personalizar el formato de salida del archivo usando la opción de configuración [`build.format`](/es/reference/configuration-reference/#buildformat)
:::

## Navegando entre páginas

Astro utiliza estándar de HTML [`<a>`](https://developer.mozilla.org/es/docs/Web/HTML/Element/a) para navegar entre rutas. No se proporciona ningún componente `<Link>` específico en Astro.

```astro title="src/pages/index.astro"
<p>Leer más <a href="/about/">sobre Astro!</a></p>
```

## Rutas dinámicas

Un archivo de página Astro puede especificar parámetros de ruta dinámicos en su nombre para generar páginas emparejadas. Por ejemplo, puedes crear un archivo `authors/[author].astro` que generará una página por cada autor en tu blog. `author` se convierte en un _parámetro_ al que puedes acceder dentro de la página.

En el modo de generación estático por defecto de Astro, estas páginas serán generadas en tiempo de compilación, así que deberías definir previamente la lista de `author`s para ese archivo. En modo SSR, se generará una página bajo petición para cada ruta que coincida.

### Modo Estático (SSG)

Debido a que todas las rutas deben definirse en tiempo de compilación, una ruta dinámica debe exportar una función `getStaticPaths()` que devuelva un array de objetos con una propiedad `params`. Cada uno de estos objetos generará su ruta correspondiente.

`[dogs].astro` define el parámetro dinámico `dog` en su nombre de archivo, así que los objetos devueltos por `getStaticPaths()` deben incluir `dog` en sus `params`. De esta manera la página puede acceder a este parámetro por medio de `Astro.params`.

```astro title="src/pages/dogs/[dog].astro"
---
export function getStaticPaths() {
  return [
    {params: {dog: 'clifford'}},
    {params: {dog: 'rover'}},
    {params: {dog: 'spot'}},
  ];
}

const { dog } = Astro.params;
---
<div>¡Buen chico, {dog}!</div>
```

Esto generará tres páginas: `/dogs/clifford`, `/dogs/rover` y `/dogs/spot`, cada una mostrando el nombre de perro correspondiente.

El nombre de archivo puede incluir múltiples parámetros, los cuales deben estar todos incluidos en los objetos `params` de `getStaticPaths()`:

```astro title="src/pages/[lang]-[version]/info.astro"
---
export function getStaticPaths () {
 return [
    {params: {lang: 'en', version: 'v1'}},
    {params: {lang: 'fr', version: 'v2'}},
  ];
}

const { lang, version } = Astro.params;
---
...
```

Esto generará `/en-v1/info` y `/fr-v2/info`.

Los parámetros pueden incluirse en distintas partes del path, entonces podríamos usar `src/pages/[lang]/[version]/info.astro` con la misma `getStaticPaths` para generar `/en/v1/info` y `/fr/v2/info`.

📚 Lee más sobre [`getStaticPaths()`](/es/reference/api-reference/#getstaticpaths).

### Parámetros Rest

Si necesitas más flexibilidad en el enrutamiento de la URL, puedes usar un parámetro rest (`[...param]`) en el nombre de archivo `.astro` para emparejar rutas de archivos de cualquier profundidad:

```astro title="src/pages/sequences/[...path].astro"
---
export function getStaticPaths() {
  return [
    {params: {path: 'uno/dos/tres'}},
    {params: {path: 'cuatro'}},
    {params: {path: undefined }}
  ]
}

const { path } = Astro.params;
---
...
```

Esto generará `/sequences/uno/dos/tres`, `/sequences/cuatro` y `/sequences`. (Definir el parámetro restante como `undefined` permite emparejar con la página del nivel más alto.)

Los parámetros rest pueden usarse con otros parámetros con nombre. Por ejemplo, podríamos representar el visor de archivos de GitHub con una ruta dinámica así:

```
/[org]/[repo]/tree/[branch]/[...file]
```

En este ejemplo, una solicitud a `/withastro/astro/tree/main/docs/public/favicon.svg` daría como resultado los siguientes parámetros con nombre:

```js
{
	org: 'withastro',
	repo: 'astro',
	branch: 'main',
	file: 'docs/public/favicon.svg'
}
```

#### Ejemplo: Páginas dinámicas en múltiples niveles

Aquí, usamos un parámetro rest (`[...slug]`) y la característica [`props`](/es/reference/api-reference/#transferencia-de-datos-con-props) de `getStaticPaths()` para generar páginas para _slugs_ de diversa profundidad.

```astro title="src/pages/[...slug].astro"
---
export async function getStaticPaths() {
  const pages = [
    {
      slug: undefined,
      title: "Tienda de Astro",
      text: "¡Te damos la bienvenida a la tienda de Astro!",
    },
    {
      slug: "products",
      title: "Productos de Astro",
      text: "Tenemos muchos productos para ti",
    },
    {
      slug: "products/astro-handbook",
      title: "El libro definitivo de Astro",
      text: "Si quieres aprender sobre Astro, debes leer este libro.",
    },
  ];
  return pages.map(({ slug, title, text }) => {
    return {
      params: { slug },
      props: { title, text },
    };
  });
}
const { title, text } = Astro.props;
---
<html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <h1>{title}</h1>
    <p>{text}</p>
  </body>
</html>
```

### Modo Servidor (SSR)
En el [modo SSR](/es/guides/server-side-rendering/), las rutas dinámicas se definen de la misma manera: incluyendo `[param]` o `[...path]` en corchetes a los nombres de tus archivos para emparejar con strings o paths arbitrarios. Pero, como esas rutas no se compilan con anticipación, la página va a servirse con cualquier ruta que coincida. Como estas no son rutas "estáticas", no debemos usar `getStaticPaths`.

```astro title="src/pages/resources/[resource]/[id].astro"
---
const { resource, id } = Astro.params;
---
<h1>{resource}: {id}<h1>
```
Esta página será servida para cualquier valor de `resource` y `id`: `resources/users/1`, `resources/colors/blue`, etc.

#### Modificando el ejemplo `[...slug]` para SSR

Debido a que las páginas SSR no pueden usar `getStaticPaths`, no pueden recibir props. Aquí modificamos nuestro [ejemplo anterior](#ejemplo-páginas-dinámicas-en-múltiples-niveles) para que funcione en SSR buscando el valor del parámetro `slug` en un objeto. Si la ruta está en la raíz ("/"), el parámetro slug va a ser `undefined`. Si el valor no existe en el objeto, redirigiremos a una página 404.

```astro title="src/pages/[...slug].astro"
---
const pages = {
   undefined: {
    title: "Tienda de Astro",
    text: "¡Te damos la bienvenida a la tienda de Astro!",
   },
  "products": {
    title: "Productos de Astro",
    text: "Tenemos muchos productos para ti",
  },
  "products/astro-handbook": {
    title: "El libro definitivo de Astro",
    text: "Si quieres aprender sobre Astro, debes leer este libro.",
  },
}

const { slug } = Astro.params;
const page = pages[slug];
if (!page) return Astro.redirect("/404");
const { title, text } = page;
---
<html>
<head>
  <title>{title}</title>
</head>
<body>
  <h1>{title}</h1>
  <p>{text}</p>
</body>
</html>
```


### Orden de prioridad de rutas

Es posible que varias rutas coincidan con la misma ruta URL. Por ejemplo, cada una de estas rutas coincidiría con `/posts/create`:

```
└── pages/
│       ├── posts/
│       │   ├── create.astro
│       │   ├── [pid].astro
│       │   └── [...slug].astro

```

Astro necesita saber qué ruta debe usarse para construir la página. Para ello, los ordena de acuerdo con las siguientes reglas:

- Las rutas estáticas sin parámetros de ruta tendrán prioridad sobre todas las demás rutas
- Las rutas dinámicas que usan parámetros nombrados tienen prioridad sobre los parámetros rest
- Los parámetros rest tienen la prioridad más baja
- Los empates se resuelven alfabéticamente

Dado el ejemplo anterior, aquí hay algunos ejemplos de cómo las reglas harán coincidir una URL solicitada con la ruta utilizada al compilar el HTML:

- `pages/posts/create.astro` - Construirá `/posts/create`
- `pages/posts/[pid].astro` - Construirá `/posts/1`, `/posts/abc`, etc. Pero no `/posts/create`
- `pages/posts/[...slug].astro` - Construirá `/posts/1/2`, `/posts/a/b/c`, etc. Pero no `/posts/create`, ` /mensajes/1`, `/mensajes/abc`

## Paginación

Astro mantiene la paginación automática integrada para grandes colecciones de datos que deben dividirse en varias páginas. Astro incluirá automáticamente metadatos de paginación como la URL de la página anterior/siguiente, el número total de páginas y más.

Los nombres de rutas paginadas deben usar la misma sintaxis `[corchete]` que una ruta dinámica estándar. Por ejemplo, el nombre de archivo `/astronautas/[page].astro` generará rutas para `/astronautas/1`, `/astronautas/2`, etc., donde `[page]` es el número de página generado.

Puedes usar la función `paginate()` para generar estas páginas para un array de valores como este:

```astro /{ (paginate) }/ /paginate\\(.*\\)/ /(?<=const.*)(page)/ /page\\.[a-zA-Z]+/
---
// Ejemplo: src/pages/astronauts/[page].astro
export async function getStaticPaths({ paginate }) {
  const astronautPages = [{
    astronaut: 'Neil Armstrong',
  }, {
    astronaut: 'Buzz Aldrin',
  }, {
    astronaut: 'Sally Ride',
  }, {
    astronaut: 'John Glenn',
  }];
  // Genera páginas para nuestro array de astronautas, con 2 elementos por página
  return paginate(astronautPages, { pageSize: 2 });
}
// Todos los datos paginados se pasan en la prop "page"
const { page } = Astro.props;
---

<!--Muestra el número de página actual. ¡También puedes utilizar Astro.params.page!-->
<h1>Página {page.currentPage}</h1>
<ul>
  <!--Enumera el array con información sobre astronautas-->
  {page.data.map(({ astronaut }) => <li>{astronaut}</li>)}
</ul>
```

Esto genera las siguientes páginas, con 2 elementos por página:
- `/astronauts/1` - Página 1: muestra "Neil Armstrong" y "Buzz Aldrin"
- `/astronauts/2` - Página 2: Muestra "Sally Ride" y "John Glenn"

### La prop `page`

Cuando usas la función `paginate()`, a cada página se le pasarán los datos a través de una prop `page`. La prop `page` tiene muchas propiedades útiles, pero estas son las más destacadas:
- **page.data** - array que contiene la porción de datos de página que introdujo a la función `paginate()`
- **page.url.next** - enlace a la página siguiente del mismo conjunto de datos
- **page.url.prev** - enlace a la página anterior del mismo conjunto de datos

```astro /(?<=const.*)(page)/ /page\\.[a-zA-Z]+(?:\\.(?:prev|next))?/
---
// Ejemplo: src/pages/astronauts/[page].astro
// Paginar la misma lista de objetos { astronaut } como en el ejemplo anterior
export async function getStaticPaths({ paginate }) { /* ... */ }
const { page } = Astro.props;
---
<h1>Página {page.currentPage}</h1>
<ul>
  {page.data.map(({ astronaut }) => <li>{astronaut}</li>)}
</ul>
{page.url.prev ? <a href={page.url.prev}>Anterior</a> : null}
{page.url.next ? <a href={page.url.next}>Siguiente</a> : null}
```

#### Referencia completa de la API

```ts
interface Page<T = any> {
	/** resultado */
	data: T[];
	/** metadatos */
	/** el recuento del primer elemento de la página, a partir de 0 */
	start: number;
	/** el recuento del último elemento de la página, a partir de 0 */
	end: number;
	/** el número total de resultados */
	total: number;
	/** el número de la página actual, a partir de 1 */
	currentPage: number;
	/** el número de elementos por página (predeterminado: 25) */
	size: number;
	/** el número de la última página */
	lastPage: number;
	url: {
		/** la url de la página actual */
		current: string;
		/** la url de la página anterior (si hay alguna) */
		prev: string | undefined;
		/** la url de la página siguiente (si hay alguna) */
		next: string | undefined;
	};
}
```

### Paginación anidada

Un caso de uso más avanzado de la paginación es la **paginación anidada.** Aquí es cuando la paginación se combina con otros parámetros de rutas dinámicas. Puedes usar la paginación anidada para agrupar la colección paginada por alguna propiedad o etiqueta.

Por ejemplo, si prefieres agrupar las publicaciones de Markdown paginadas por alguna etiqueta, usarás la paginación anidada creando una página `/src/pages/[tag]/[page].astro` que coincida con las siguientes URL:

- `/red/1` (tag=red)
- `/red/2` (tag=red)
- `/blue/1` (tag=blue)
- `/green/1` (tag=green)

La paginación anidada funciona devolviendo un array de resultados `paginate()` de `getStaticPaths()`, uno para cada grupo.

En el siguiente ejemplo, implementaremos la paginación anidada para crear las URL enumeradas anteriormente:

```astro /(?:[(]|=== )(tag)/ "params: { tag }" /const [{ ]*(page|params)/
---
// Ejemplo: src/pages/[tag]/[page].astro
export async function getStaticPaths({paginate}) {
  const allTags = ['red', 'blue', 'green'];
  const allPosts = await Astro.glob('../../posts/*.md');
  // Para cada etiqueta, devuelve un resultado de paginate().
  // Asegúrate de pasar `{params: {tag}}` a `paginate()`
  // Así Astro sabrá qué agrupación de etiquetas usar.
  return allTags.map((tag) => {
    const filteredPosts = allPosts.filter((post) => post.frontmatter.tag === tag);
    return paginate(filteredPosts, {
      params: { tag },
      pageSize: 10
    });
  });
}
const { page } = Astro.props;
const params = Astro.params;
```


## Excluyendo páginas

Puedes excluir páginas, o incluso directorios completos de ser generados añadiendo el prefijo (`_`).

Esto te permite crear páginas privadas, y también incluir otros tipos de archivos como *tests*, utilidades y componentes junto con las páginas a donde pertenecen, evitando generar archivos `.html` en el directorio `dist/`.

En este ejemplo, solo `src/pages/index.astro` y `src/pages/posts/post1.md` serán generados como rutas y archivos `.html`.

```md mark="post1.md" mark="index.astro"
src/
└── pages/
   ├── _directorio-oculto/
   │   ├── page1.md
   │   └── page2.md
   ├── _pagina-oculta.astro
   ├── index.astro
   └── posts/
       ├── _UnComponente.astro
       ├── _utils.js
       └── post1.md
```