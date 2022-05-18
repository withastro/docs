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
// src/pages/dogs/[dog].astro

export function getStaticPaths() {
  return [
    // Generates: /dogs/clifford
    {params: {dog: 'clifford'}},
    // Generates: /dogs/rover
    {params: {dog: 'rover'}},
    // Generates: /dogs/spot
    {params: {dog: 'spot'}},
  ];
}
---
```

📚 Lea más sobre [`getStaticPaths()`](/es/reference/api-reference/#getstaticpaths).

Las rutas se pueden ser generadas a partir de varios parámetros nombrados, en cualquier nivel de la ruta del archivo:

- `pages/blog/[slug].astro` → (`/blog/hello-world`, `/blog/post-2`, etc.)
- `pages/[username]/settings.astro` → (`/fred/settings`, `/drew/settings`, etc.)
- `pages/[lang]-[version]/info.astro` → (`/en-v1/info`, `/fr-v2/info`, etc.)

#### El objeto `Astro.params`

Los componentes de Astro que generan rutas dinámicamente tienen acceso al objeto `Astro.params` para cada ruta. Esto le permite usar las variables de la URL en su script y maquetado.

```astro
---
// Ejemplo: src/pages/posts/[id].astro
const { id } = Astro.params;
---
<p>Post: { id }</p>

// Objecto Astro.params para la siguiente ruta `/post/abc`
{ "id": "abc" }
```

Se pueden combinar varios segmentos de las rutas dinámicas para que funcionen de la misma manera.

```astro
---
// Ejemplo: src/pages/post/[id]/[comment].astro
const { id, comment } = Astro.params;
---

// Objecto Astro.params para la siguiente ruta `/post/abc/a-comment`
{ "id": "abc", "comment": "a-comment" }
```

### Parámetros comodín

Si necesitas más flexibilidad en el enrutamiento de la URL, puedes usar un parámetro comodín en el nombre de archivo `.astro` que servira como ruta universal para rutas de archivos de cualquier profundidad. Para crear una ruta comodín agrega tres puntos (`...`) dentro de los corchetes junto con el nombre de la variable.

Por ejemplo:

- `pages/post/[...slug].astro` → (`/post/a`, `/post/a/b`, `/post/a/b/c`, etc.)

Los parámetros coincidentes se pasarán como un variable (`slug` en el ejemplo) a la página.

```json
// Objecto Astro.params para la siguiente ruta `/post/a/b/c`
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

### Advertencias

Las solicitudes de consulta de parámetros no siempre coincidirán con todas las rutas existentes en su proyecto.

Las rutas estáticas sin parámetros tendrán prioridad sobre todas las demás rutas, y no coincidirán con las consultas de parámetros de ruta dinámicas. De manera similar, las rutas nombradas tienen prioridad sobre las rutas comodín.

Considere el siguiente proyecto:

```
└── pages/
│       ├── posts/
│       │   ├── create.astro
│       │   ├── [pid].astro
│       │   └── [...slug].astro

```

- `pages/post/create.astro` - Coincidirá con `/post/create`
- `pages/post/[pid].astro` - Coincidirá con `/post/1`, `/post/abc`, etc. Pero no con `/post/create`
- `pages/post/[...slug].astro` - Coincidirá con `/post/1/2`, `/post/a/b/c`, etc. Pero no con `/post/create`, `/post/1`, `/post/abc`

## Paginación

Astro mantiene la paginación automática integrada para grandes colecciones de datos que deben dividirse en varias páginas. Astro incluirá automáticamente metadatos de paginación para cosas como la URL de la página anterior/siguiente, el número total de páginas y más.

```astro
---
// Ejemplo: Usando paginate() en una ruta dinámica
export async function getStaticPaths({ paginate }) {
  // Carga tus datos:
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=150`);
  const result = await response.json();
  const allPokemon = result.results;
  // Devuelve una colección paginada de rutas:
  return paginate(allPokemon, { pageSize: 10 });
}
// Los datos paginados se pasan como prop a cada página.
const { page } = Astro.props;
---
<!-- ... -->
```

La paginación es útil cuando se necesita generar varias páginas enumeradas a partir de un conjunto de datos más amplios:

- `/posts/1` (Página 1: Muestra los artículos del 1-10)
- `/posts/2` (Página 2: Muestra los artículos del 11-20)
- `/posts/3` (Página 3: Muestra los artículos del 21-30)

### La prop `page` 

Cuando usas la función `paginate()`, a cada página de la colección se le pasarán sus datos a través de una prop `page`. La prop `page` tiene varias propiedades útiles, pero la más importante es `page.data`. Esta es el array que contiene la porción de datos de la página que pasaste a la función `paginate()`.

```astro
---
// Ejemplo: Usando la prop `page` de la paginación
export async function getStaticPaths() { /* ... */ }
const { page } = Astro.props;
---
<h1>Page {page.currentPage}</h1>
<ul>
  {page.data.map(item => <li>{item.title}</li>)}
</ul>
```

La propiedad `page` también incluye otros metadatos útiles, como `page.url.next`, `page.url.prev`, `page.total` y más.

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
