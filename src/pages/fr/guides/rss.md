---
layout: ~/layouts/MainLayout.astro
title: Flux RSS
description: Une introduction aux flux RSS avec Astro.
---

Astro supporte la génération rapide et automatique de flux RSS pour tout blogs et autres contenus. Pour plus d'informations sur les flux RSS, voir [aboutfeeds.com](https://aboutfeeds.com/).

## Utilisation de `@astrojs/rss` (recommandé)

Le Package `@astrojs/rss` fournit des fonctions d'aide pour la génération de flux RSS en utilisant des ["API endpoints" (ou points d'arrêt API)](/fr/core-concepts/astro-pages/#pages-non-html). Cela permet de générer des fichiers statiques _et_ de générer des flux RSS à la demande lors de l'utilisation d'un [adaptateur SSR](/fr/guides/server-side-rendering/#activation-du-mode-ssr-dans-votre-projet).

Pour commencer, installez `@astrojs/rss` en utilisant votre gestionnaire de Package préféré :

```bash
# npm
npm i @astrojs/rss
# yarn
yarn add @astrojs/rss
# pnpm
pnpm i @astrojs/rss
```

Ensuite, assurez-vous que vous avez [configuré la valeur `site`](/fr/reference/configuration-reference/#site) dans le fichier `astro.config` de votre projet. Celle-ci sera utilisée pour générer les liens dans votre flux RSS [via la variable d'environnement `SITE`](/fr/guides/environment-variables/#default-environment-variables).

> **Note :** La variable d'environnement `SITE` n'existe que dans la dernière version bêta de Astro 1.0. Mettez à jour Astro (`astro@latest`), ou écrivez votre `site` manuellement si cela n'est pas possible (voir les exemples ci-dessous).

Maintenant que tout est prêt, générons notre premier flux RSS ! Créez un fichier `rss.xml.js` dans votre répertoire `src/pages/`. `rss.xml` sera l'URL de sortie, donc n'oubliez pas de le renommer si vous préférez.

Ensuite, importez l'Helper `rss` du Package `@astrojs/rss` et appelez-le avec les paramètres suivants :

```js
// Exemple: src/pages/rss.xml.js
import rss from '@astrojs/rss';
export const get = () => rss({
    // la valeur `<title>` de votre XML de sortie
    title: 'Buzz’s Blog',
    // la valeur `<description>` de votre XML de sortie
    description: 'A humble Astronaut’s guide to the stars',
    // l'URL de base pour les liens RSS <item>
    // SITE sera utilisé depuis votre valeur "site" du fichier astro.config de votre projet.
    site: import.meta.env.SITE,
    // la liste des `<item>`s dans votre XML de sortie
    // exemple simple : générer des items pour chaque fichier ".md" dans "/src/pages"
    // voir la section "Génération des items" pour les frontmatter requis et les cas avancés
    items: import.meta.glob('./**/*.md'),
    // (optionnel) injecter des valeurs XML personnalisés
    customData: `<language>en-us</language>`,
  });
```

### Génération des `items`

Les `items` acceptent soit :

1. [Un résultat de `import.meta.glob(...)`](#1-avec-un-résultat-importmetaglob) **(utilisez cette option pour les fichiers `.md` à l'interieur du répertoire `src/pages/`)**
2. [Une liste d'objets RSS](#2-avec-une-liste-dobjets-rss), chacun possédant un champ `link`, `title`, `pubDate`, et optionnellement un champ `description` et/ou `customData`.

#### 1. Avec un résultat `import.meta.glob`

Nous recommandons cette option comme un raccourci pratique pour les fichiers `.md` dans le répertoire `src/pages/`. Chaque article devrait comporter un champ `title`, `pubDate`, et un champ optionnel `description` et/ou `customData` dans son Frontmatter. Si cela n'est pas possible, ou si vous préférez générer ce Frontmatter en code, [voir l'option 2](#2-avec-une-liste-dobjets-rss).

Imaginons que vos articles soient stockés dans le répertoire `src/pages/blog/`. Vous pouvez générer un flux RSS comme suit :

```js
// Exemple: src/pages/rss.xml.js
import rss from '@astrojs/rss';
export const get = () => rss({
  title: 'Buzz’s Blog',
  description: 'A humble Astronaut’s guide to the stars',
  site: import.meta.env.SITE,
  items: import.meta.glob('./blog/**/*.md'),
});
```

Jetez un oeil à la [documentation de l'import glob de Vite](https://vitejs.dev/guide/features.html#glob-import) pour plus d'informations sur cette syntaxe d'import.

#### 2. Avec une liste d'objets RSS

Nous recommandons cette option pour les fichiers `.md` en dehors du répertoire `pages/`. C'est un cas courant lors de la génération de routes [via `getStaticPaths()`](/fr/reference/api-reference/#getstaticpaths).

Pour cet exemple, imaginons que vos articles `.md` soient stockés dans un répertoire `src/posts/`. Chaque article a un `title`, `pubDate`, et `slug` dans son Frontmatter, où `slug` correspond à l'URL de sortie sur votre site. Nous pouvons générer un flux RSS en utilisant [l'aide de Vite `import.meta.globEager`](https://vitejs.dev/guide/features.html#glob-import) comme suit :

```js
// Exemple: src/pages/rss.xml.js
import rss from '@astrojs/rss';
const postImportResult = import.meta.globEager('../posts/**/*.md');
const posts = Object.values(postImportResult);
export const get = () => rss({
  title: 'Buzz’s Blog',
  description: 'A humble Astronaut’s guide to the stars',
  site: import.meta.env.SITE,
  items: posts.map((post) => ({
    link: post.frontmatter.slug,
    title: post.frontmatter.title,
    pubDate: post.frontmatter.pubDate,
  }))
});
```

### Ajout d'une feuille de style

Vous pouvez styliser votre flux RSS pour une expérience utilisateur plus agréable lors de la visualisation du fichier dans votre navigateur.

Utilisez l'option `stylesheet` de la fonction `rss` pour spécifier un chemin absolu vers votre feuille de style.

```js
rss({
  // Exemple: Utilisez votre feuille de style depuis "public/rss/styles.xsl"
  stylesheet: '/rss/styles.xsl',
  // ...
});
```

Si vous n'avez pas de feuille de style RSS en tête, nous recommandons la [feuille de style par défaut Pretty Feed v3](https://github.com/genmon/aboutfeeds/blob/main/tools/pretty-feed-v3.xsl), que vous pouvez télécharger depuis GitHub et sauvegarder dans le répertoire `public/` de votre projet.

## Utilisation de `getStaticPaths()`

> **Note :** Cette méthode a été dépréciée, et sera supprimée avre la version officielle `v1.0.0`. Veuillez utiliser `@astrojs/rss` à la place.

Vous pouvez créer un flux RSS depuis n'importe quelle page Astro qui utilise une fonction `getStaticPaths()` pour le routage. Seules les routes dynamiques peuvent utiliser `getStaticPaths()` à l'heure actuelle (voir le [Routage](/fr/core-concepts/routing/)).

Créez un flux RSS en appelant la fonction `rss()` passée en argument à `getStaticPaths()`. Cela créera un fichier `rss.xml` dans votre Build final, en se basant sur les données que vous fournissez en utilisant le tableau `items`.

```js
// Example: /src/pages/posts/[...page].astro
// Placez cette fonction dans le script de votre composant Astro.
export async function getStaticPaths({rss}) {
  const allPosts = Astro.fetchContent('../post/*.md');
  const sortedPosts = allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  // Générer un flux RSS à partir de cette collection
  rss({
    // Le titre, la description et les métadonnées personnalisées du flux RSS.
    title: 'Don’s Blog',
    // Voir la section "Ajout d'une feuille de style" ci-dessous
    stylesheet: true,
    description: 'An example blog on Astro',
    customData: `<language>en-us</language>`,
    // La liste des éléments pour votre flux RSS, triés par ordre aphabétique.
    items: sortedPosts.map(item => ({
      title: item.title,
      description: item.description,
      link: item.url,
      pubDate: item.date,
    })),
    // Optionnel: Personnaliser l'emplacement du fichier.
    // Sinon, par défaut, il est nommé à cet emplacement "/rss.xml"
    dest: "/my/custom/feed.xml",
  });
  // Retourner vos chemins
  return [...];
}
```

Note: Les flux RSS ne seront **pas** générés durant le développement en utilisant cette méthode.

### Ajout d'une feuille de style

Quand vous utilisez la méthode `getStaticPaths` pour générer un flux RSS, nous allons optionnellement générer une feuille de style pour vous. Passez `stylesheet: true` comme une option pour importer la feuille de style XSL [Pretty Feed](https://github.com/genmon/aboutfeeds/blob/main/tools/pretty-feed-v3.xsl).

Si vous souhaitez utiliser une feuille de style XSL personnalisée, vous pouvez passer une chaîne de caractères comme `stylesheet: '/my-custom-stylesheet.xsl'`. Ce fichier doit être dans le répertoire `public/` (dans ce cas, `public/my-custom-stylesheet.xsl`).
