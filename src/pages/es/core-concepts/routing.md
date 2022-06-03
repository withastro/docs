---
layout: ~/layouts/MainLayout.astro
title: Enrutamiento
description: Introducción al enrutamiento en Astro.
i18nReady: true
---

Astro utiliza **enrutamiento basado en archivos** para generar las URLs finales según el contenido de la carpeta `src/pages/`. Cuando se agrega un archivo a la carpeta `src/pages`, este estará disponible automáticamente como una ruta basada en el nombre del archivo.

## Rutas estáticas

Los componentes de Astro (`.astro`) y los archivos Markdown (`.md`) en la carpeta `src/pages` **se convierten automáticamente en páginas de su proyecto**. La ruta de cada página corresponde a la ruta y el nombre del archivo dentro del directorio `src/pages`.

```bash
# Ejemplo: Rutas estáticas
src/pages/index.astro        -> mysite.com/
src/pages/about.astro        -> mysite.com/about
src/pages/about/index.astro  -> mysite.com/about
src/pages/about/me.astro     -> mysite.com/about/me
src/pages/posts/1.md         -> mysite.com/posts/1
```

> 💡 Las páginas estáticas se crean automáticamente al colocar archivos en la carpeta `/src/pages/` sin ninguna configuración adicional .

## Rutas dinámicas

Un componente de página Astro también puede especificar parámetros de ruta dinámicos con el nombre del archivo que serviran para generar múltiples rutas que coincidan con un criterio dado. Puedes crear varias páginas relacionadas a la vez, como páginas de autor o una página para cada etiqueta de blog. Los parámetros nombrados también le permiten especificar valores variables para los differentes niveles de rutas y los parámetros comodín permiten crear rutas más flexibles.

> 💡 Las páginas creadas dinámicamente y las rutas se generan en la compilación final.

Las páginas Astro que crean rutas dinámicas deben:

1. usar notación en `[corchete]` para identificar los parámetros dinámicos

2. exportar una función `getStaticPaths()` para especificar exactamente qué rutas serán pre-renderizadas por Astro.

### Parámetros nombrados

Puedes generar rutas con un parámetro `[nombrado]` proporcionando a la función `getStaticPaths()` los valores que va a utilizar de la siguiente manera:

```astro
---
// src/pages/perros/[perro].astro

export function getStaticPaths() {
  return [
    // Genera: /perros/clifford
    {params: {perro: 'clifford'}},
    // Genera: /perros/rover
    {params: {perro: 'rover'}},
    // Genera: /perros/spot
    {params: {perro: 'spot'}},
  ];
}
---
```

📚 Lea más sobre [`getStaticPaths()`](/es/reference/api-reference/#getstaticpaths).

Las rutas pueden ser generadas a partir de uno o varios parámetros nombrados, en cualquier nivel de la ruta del archivo:

- `pages/blog/[slug].astro` → (`/blog/hello-world`, `/blog/post-2`, etc.)
- `pages/[username]/settings.astro` → (`/fred/settings`, `/drew/settings`, etc.)
- `pages/[lang]-[version]/info.astro` → (`/en-v1/info`, `/fr-v2/info`, etc.)

#### El objeto `Astro.params`

Los componentes de Astro que generan rutas dinámicamente tienen acceso al objeto `Astro.params` para cada ruta. Esto le permite usar las variables de la URL dentro del script y maquetado.

```astro
---
// Ejemplo: src/pages/posts/[id].astro
const { id } = Astro.params;
---
<p>Post: { id }</p>

// Objeto Astro.params para la siguiente ruta `/post/abc`
{ "id": "abc" }
```

Se pueden combinar varios segmentos de las rutas dinámicas para que funcionen de la misma manera.

```astro
---
// Ejemplo: src/pages/post/[id]/[comment].astro
const { id, comment } = Astro.params;
---

// Objeto Astro.params para la siguiente ruta `/post/abc/a-comment`
{ "id": "abc", "comment": "a-comment" }
```

### Parámetros comodín

Si necesitas más flexibilidad en el enrutamiento de la URL, puedes usar un parámetro comodín en el nombre de archivo `.astro` que servira como ruta universal para rutas de archivos de cualquier profundidad. Para crear una ruta comodín agrega tres puntos (`...`) dentro de los corchetes junto con el nombre de la variable.

Por ejemplo:

- `pages/post/[...slug].astro` → (`/post/a`, `/post/a/b`, `/post/a/b/c`, etc.)

Los parámetros coincidentes se pasarán como un variable (`slug` en el ejemplo) a la página.

```json
// Objeto Astro.params para la siguiente ruta `/post/a/b/c`
{ "slug": "a/b/c" }
```

> Los parámetros comodín son opcionales por defecto, por lo que `pages/post/[...slug].astro` también podría coincidir con `/post/`.

#### Ejemplo: parámetros comodín

Como un ejemplo real, puedes implementar el visor de archivos de GitHub con los siguientes parámetros nombrados y un comodín:

```
/[org]/[repo]/tree/[branch]/[...file]
```

En este ejemplo, una solicitud a `/withastro/astro/tree/main/docs/public/favicon.svg` daría como resultado los siguientes parámetros:

```js
{
	org: 'withastro',
	repo: 'astro',
	branch: 'main',
	file: 'docs/public/favicon.svg'
}
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
- Las rutas dinámicas que usan parámetros nombrados tienen prioridad sobre los parámetros comodín
- Los parámetros comodín tienen la prioridad más baja.
- Los empates se resuelven alfabéticamente

Dado el ejemplo anterior, aquí hay algunos ejemplos de cómo las reglas harán coincidir una URL solicitada con la ruta utilizada al compilar el HTML:

- `pages/posts/create.astro` - Construirá `/posts/create`
- `pages/posts/[pid].astro` - Construirá `/posts/1`, `/posts/abc`, etc. Pero no `/posts/create`
- `pages/posts/[...slug].astro` - Construirá `/posts/1/2`, `/posts/a/b/c`, etc. Pero no `/posts/create`, ` /mensajes/1`, `/mensajes/abc`
## Paginación

Astro mantiene la paginación automática integrada para grandes colecciones de datos que deben dividirse en varias páginas. Astro incluirá automáticamente metadatos de paginación como la URL de la página anterior/siguiente, el número total de páginas y más.

Los nombres de rutas paginadas deben usar la misma sintaxis `[corchete]` que una ruta dinámica estándar. Por ejemplo, el nombre de archivo `/astronautas/[page].astro` generará rutas para `/astronautas/1`, `/astronautas/2`, etc., donde `[page]` es el número de página generado.

Puedes usar la función `paginate()` para generar estas páginas para un array de valores como este:

```astro
---
// Ejemplo: /src/pages/astronauts/[page].astro
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
<h1>Page {page.currentPage}</h1>
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

```astro
---
// Ejemplo: /src/pages/astronauts/[page].astro
// Paginar la misma lista de objetos { astronaut } como en el ejemplo anterior
export async function getStaticPaths({ paginate }) { /* ... */ }
const { page } = Astro.props;
---
<h1>Page {page.currentPage}</h1>
<ul>
  {page.data.map(({ astronaut }) => <li>{astronaut}</li>)}
</ul>
{page.url.prev ? <a href={page.url.prev}>Previous</a> : null}
{page.url.next ? <a href={page.url.next}>Next</a> : null}
```

#### Referencia API completa

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

## Paginación anidada

Un caso de uso más avanzado de la paginación es la **paginación anidada.** Aquí es cuando la paginación se combina con otros parámetros de rutas dinámicas. Puedes usar la paginación anidada para agrupar la colección paginada por alguna propiedad o etiqueta.

Por ejemplo, si prefieres agrupar las publicaciones de Markdown paginadas por alguna etiqueta, usarás la paginación anidada creando una página `/src/pages/[tag]/[page].astro` que coincida con las siguientes URL:

- `/red/1` (tag=red)
- `/red/2` (tag=red)
- `/blue/1` (tag=blue)
- `/green/1` (tag=green)

La paginación anidada funciona devolviendo un array de resultados `paginate()` de `getStaticPaths()`, uno para cada grupo.

En el siguiente ejemplo, implementaremos la paginación anidada para crear las URL enumeradas anteriormente:

```astro
---
// Ejemplo: /src/pages/[tag]/[page].astro
export function getStaticPaths({paginate}) {
  const allTags = ['red', 'blue', 'green'];
  const allPosts = await Astro.glob('../../posts/*.md');
  // Para cada etiqueta, devuelve un resultado de paginate().
  // Asegúrate de pasar `{params: {tag}}` a `paginate()`
  // Asi Astro sabrá qué agrupación de etiquetas usar.
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
