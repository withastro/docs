---
layout: ~/layouts/MainLayout.astro
title: Routage
description: Une introduction à l'utilisation du routage avec Astro.
---

Astro utilise un **routage basé sur les fichiers** pour générer les URLs de votre dossier de compilation en fonction des dossiers de votre projet `src/pages/`. Lorsqu'un fichier est ajouté au dossier `src/pages/` de votre projet, une route avec le même nom que ce fichier est alors disponible automatiquement.

## Routes Statiques

Les composants `.astro` et les fichiers Markdown (`.md`) dans le dossier `src/pages/` **deviennent des pages de votre site web**. Chaque composant (nommé _composant Page_) correspond à son chemin et nom dans le dossier `src/pages/`.

```bash
# Exemple: Routes statiques
src/pages/index.astro        -> monsite.com/
src/pages/about.astro        -> monsite.com/about
src/pages/about/index.astro  -> monsite.com/about
src/pages/about/me.astro     -> monsite.com/about/me
src/pages/posts/1.md         -> monsite.com/posts/1
```

:::tip
Il n'y a pas de "configuration de routage" à maintenir dans un projet Astro. Les pages statiques sont créées en plaçant des fichiers dans le dossier `/src/pages/`.
:::

## Routes Dynamiques

Un seul composant Page Astro peut également spécifier des paramètres de route dynamiques dans son nom de fichier pour générer plusieurs routes qui correspondent à un critère donné. Vous pouvez créer plusieurs pages liées en même temps, comme des pages d'auteurs ou une page pour chaque tags d'un article de blog. Les paramètres nommés permettent de spécifier des valeurs pour les niveaux "nommés" de ces chemins de route, et les paramètres d'URL permettent de plus en plus de chemins de route "attrape-tout".

:::note
Même les pages et routes créées dynamiquement sont générées à la compilation.
:::

Les pages Astro qui créent des routes dynamiques doivent :

1. utiliser la notation `[entre-crochets]` pour identifier les paramètres dynamiques

2. exporter une fonction `getStaticPaths()` pour spécifier précisément quels chemins seront pré-générés par Astro.


### Paramètres Nommés

Vous pouvez générer des routes avec un paramètre `[nommé]` en fournissant à votre fonction`getStaticPaths()` des valeurs comme :

```astro
---
// Exemple: src/pages/dogs/[dog].astro

export function getStaticPaths() {
  return [
    // Génère : /dogs/clifford
    {params: {dog: 'clifford'}},
    // Génère : /dogs/rover
    {params: {dog: 'rover'}},
    // Génère : /dogs/spot
    {params: {dog: 'spot'}},
  ];
}
---
```

📚 Apprenez-en plus sur [`getStaticPaths()`](/fr/reference/api-reference/#getstaticpaths).

Les routes peuvent être générées à partir de plusieurs paramètres nommés, à n'importe quel niveau du chemin du fichier :

- `pages/blog/[slug].astro` → (`/blog/hello-world`, `/blog/post-2`, etc.)
- `pages/[username]/settings.astro` → (`/fred/settings`, `/drew/settings`, etc.)
- `pages/[lang]-[version]/info.astro` → (`/en-v1/info`, `/fr-v2/info`, etc.)

#### L'Objet `Astro.params`

Les composants Astro qui génèrent des routes dynamiques ont accès à un objet `Astro.params` pour chaque route. Cela permet d'utiliser ces parties de l'URL générée dans votre Script et Template du composant.

```astro
---
// Exemple: src/pages/posts/[id].astro
const { id } = Astro.params;
---
<p>Article : { id }</p>


// L'objet Astro.params passé par la route `/post/abc`
{ "id": "abc" }
```

De multiples segments dynamiques de route peuvent être combinés pour fonctionner de la même manière.

```astro
---
// Exemple: src/pages/post/[id]/[comment].astro
const { id, comment } = Astro.params;
---

// L'objet Astro.params passé par la route `/post/abc/a-comment`
{ "id": "abc", "comment": "a-comment" }
```

### Paramètres REST

Si vous avez besoin de plus de flexibilité dans votre routage d'URL, vous pouvez utiliser un paramètre rest dans votre nom de fichier `.astro` comme un "attrape-tout" universel pour les chemins de n'importe quelle profondeur en ajoutant trois points (`...`) à l'intérieur de vos crochets.

Par exemple :

- `pages/post/[...slug].astro` → (`/post/a`, `/post/a/b`, `/post/a/b/c`, etc.)

Les paramètres correspondants seront passés en tant que paramètre de requête (`slug` dans cet exemple) au composant.

```json
// L'objet Astro.params passé pour la route `/post/a/b/c`
{ "slug": "a/b/c" }
```

:::tip
Les paramètres rest sont optionnels par défaut, donc `pages/post/[...slug].astro` peut aussi correspondre à `/post/`.
:::

#### Exemple : Paramètres REST

Dans un exemple réel, vous pouvez implémenter le visualiseur de fichiers de GitHub avec les paramètres nommés et rest suivants :

```
/[org]/[repo]/tree/[branch]/[...file]
```

Dans cet exemple, une requête pour `/withastro/astro/tree/main/docs/public/favicon.svg` résulterait avec les paramètres suivants, disponibles dans la page :

```js
{
	org: 'withastro',
	repo: 'astro',
	branch: 'main',
	file: 'docs/public/favicon.svg'
}
```

## Ordre de Priorité des Routes

Les requêtes pour les paramètres ne correspondent pas nécessairement à chaque route existante dans votre projet.

Les routes statiques sans paramètres de chemin ne prendront pas la priorité sur toutes les autres routes, et ne correspondent pas aux requêtes pour les paramètres de chemin dynamiques. De même, les chemin de routes nommées prennent la priorité sur les routes "attrape-tout", et ne correspondent pas aux requêtes pour les paramètres de chemin "attrape-tout".

Considérez le projet suivant :

```
└── pages/
│       ├── posts/
│       │   ├── create.astro
│       │   ├── [pid].astro
│       │   └── [...slug].astro

```

- `pages/post/create.astro` - Correspondra au chemin `/post/create`
- `pages/post/[pid].astro` - Correspondra au chemin `/post/1`, `/post/abc`, etc. Mais pas à `/post/create`
- `pages/post/[...slug].astro` - Correspondra au chemin `/post/1/2`, `/post/a/b/c`, etc. Mais pas à `/post/create`, `/post/1`, `/post/abc`

## Pagination

Astro supporte la pagination pour les grandes collections de données qui doivent être divisées en plusieurs pages. Astro va générer les propriétés les plus communes de pagination comme l'URL pour page précédente / suivante, le nombre total de pages, etc.

Les noms de routes paginées doivent utiliser la même syntaxe de `[crochets]` que les routes dynamiques. Par exemple, le nom de fichier `/astronauts/[page].astro` générera des routes pour `/astronauts/1`, `/astronauts/2`, etc, là où `[page]` est le numéro de pages générées.

Vous pouvez utiliser la fonction `paginate()` pour générer ces pages pour un tableau de valeurs comme suis :

```astro
---
// Exemple: /src/pages/astronauts/[page].astro
export async function getStaticPaths({ paginate }) {
  const astronautPages = [{
    astronaut: 'Neil Armstrong',
  }, {
    astronaut: 'Buzz Aldrin',
  }, {
    astronaut: 'Sally Ride',
  }, {
    astronaut: 'John Glenn',
  }, {
    astronaut: 'Jean-Loup Chrétien',
  }, {
    astronaut: 'Thomas Pesquet',
  }];
  // Génère des pages à partir de notre tableau d'astronautes, avec 2 par page
  return paginate(astronautPages, { pageSize: 2 });
}
// Toutes les données paginées sont passées dans la propriété "page"
const { page } = Astro.props;
---
<!-- Affiche le numéro de la page actuelle. Astro.params.page peut aussi être utilisé ! -->
<h1>Page {page.currentPage}</h1>
<ul>
  <!-- Fait la liste de notre tableau d'astronautes -->
  {page.data.map(({ astronaut }) => <li>{astronaut}</li>)}
</ul>
```

Ceci va générer les pages suivantes, avec deux éléments par page :

- `/astronauts/1` - Page 1: Affiche "Neil Armstrong" et "Buzz Aldrin"
- `/astronauts/2` - Page 2: Affiche "Sally Ride" et "John Glenn"
- `/astronauts/3` - Page 3: Affiche "Jean-Loup Chrétien" et "Thomas Pesquet"

### La Propriété `page`

Lorsque vous utilisez la fonction `paginate()`, chaque page transmet ses données via une propriété `page`. La propriété `page` a pas mal de propriétés utiles, mais voici les plus importantes :

- **`page.data`** - Tableau contenant portion de données de la page que vous avez passé dans la fonction `paginate()`
- **`page.url.next`** - Lien vers la page suivante dans la collection
- **`page.url.prev`** - Lien vers la page précédente dans la collection

```astro
---
// Exemple: /src/pages/astronauts/[page].astro
// Paginons la même liste d'objets { astronaut } que l'exemple précédent
export async function getStaticPaths({ paginate }) { /* ... */ }
const { page } = Astro.props;
---
<h1>Page {page.currentPage}</h1>
<ul>
  {page.data.map(({ astronaut }) => <li>{astronaut}</li>)}
</ul>
{page.url.prev ? <a href={page.url.prev}>Précédent</a> : null}
{page.url.next ? <a href={page.url.next}>Suivant</a> : null}
```

#### Référence Complète de l'API

```ts
interface Page<T = any> {
	/** Résultat */
	data: T[];
	/** Métadonnées */
	/** Nombre du premier élément de la page, à partir de 0 */
	start: number;
	/** Nombre du dernier élément de la page, à partir de 0 */
	end: number;
	/** Nombre total de résultats */
	total: number;
	/** Numéro de la page actuelle, à partir de 1 */
	currentPage: number;
	/** Nombre d'éléments par page (par défaut : 25) */
	size: number;
	/** Nombre de la dernière page */
	lastPage: number;
	url: {
		/** URL de la page actuelle */
		current: string;
		/** URL de la page précédente (si il y en a une) */
		prev: string | undefined;
		/** URL de la page suivante (si il y en a une) */
		next: string | undefined;
	};
}
```

## Pagination Imbriquée

Une utilisation plus avancée pour la pagination est la **pagination imbriquée**. Il s'agit du cas où la pagination est combinée avec d'autres paramètres de route dynamique. Vous pouvez utiliser la pagination imbriquée pour grouper votre collection paginée par une propriété ou un tag.

Par exemple, si vous voulez grouper vos articles en Markdown par tag, vous pouvez utiliser la pagination imbriquée en créant une page `/src/pages/[tag]/[page].astro` qui correspond aux URL suivantes :

- `/red/1` (tag=red)
- `/red/2` (tag=red)
- `/blue/1` (tag=blue)
- `/green/1` (tag=green)

La pagination imbriquée fonctionne en retournant une collection de résultats `paginate()` depuis `getStaticPaths()`, une pour chaque groupe.

Dans l'exemple suivant, nous allons implémenter la pagination imbriquée pour construire les URL listées ci-dessus :

```astro
---
// Exemple: /src/pages/[tag]/[page].astro
export function getStaticPaths({paginate}) {
  const allTags = ['red', 'blue', 'green'];
  const allPosts = await Astro.glob('../../posts/*.md');
  // Pour chaque tag, retourne un résultat paginate().
  // Assurez-vous que vous passez "{params: {tag}}" à la fonction "paginate()"
  // Assurez-vous qu'Astro connaît les tags du résultat
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
