---
layout: ~/layouts/MainLayout.astro
title: Pages
description: Une introduction au pages Astro
i18nReady: true
---

Les **pages** sont des fichiers qui se trouvent dans le sous-répertoire `src/pages/` de votre projet Astro. Ils sont responsables de la gestion du routage, du chargement des données et de la mise en page globale de chaque page de votre site Web.

## Fichiers de page pris en charge 

Astro prend en charge les types de fichiers suivants dans le répertoire `src/pages/` :
- [`.astro`](#pages-astro)
- [`.md`](#pages-markdownmdx)
- `.mdx` (avec l'[Intégration MDX installée](/fr/guides/integrations-guide/mdx/#installation))
- [`.html`](#pages-html)
- [`.js`/`.ts`] (comme [endpoints](/fr/core-concepts/endpoints/))

## Routage basé sur les fichiers

Astro utilise une stratégie de routage appelée **routage par fichier**. Chaque fichier de votre répertoire `src/pages/` devient un point d'accès sur votre site en fonction de son chemin d'accès.

Rédigez des éléments HTML standard [éléments `<a>`](https://developer.mozilla.org/fr/docs/Web/HTML/Element/a) dans votre modèle de composant pour créer des liens entre les pages.

📚 En savoir plus sur [Le routage en astro](/fr/core-concepts/routing/).

## Pages Astro

Les pages Astro utilisent l'extension de fichier `.astro` et prennent en charge les mêmes fonctionnalités que les [composants Astro](/fr/core-concepts/astro-components/).

```astro
---
// Example: src/pages/index.astro
---
<html lang="en">
  <head>
    <title>My Homepage</title>
  </head>
  <body>
    <h1>Welcome to my website!</h1>
  </body>
</html>
```

Pour éviter de répéter les mêmes éléments HTML sur chaque page, vous pouvez déplacer les éléments communs `<head>` et `<body>` dans vos propres [composants de mise en page](/fr/core-concepts/layouts/). Vous pouvez utiliser autant de composants de mise en page que vous le souhaitez.

```astro {3} /</?MySiteLayout>/
---
// Example: src/pages/index.astro
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>My page content, wrapped in a layout!</p>
</MySiteLayout>
```

📚 En savoir plus sur les [composants de mise en page](/fr/core-concepts/layouts/) dans Astro.

## Pages Markdown/MDX

Astro traite également tous les fichiers Markdown (`.md`) contenus dans `src/pages/` comme des pages de votre site Web final. Si vous avez [installé l'intégration MDX](/fr/guides/integrations-guide/mdx/#installation), les fichiers MDX (`.mdx`) sont traités de la même manière. Ces fichiers sont généralement utilisés pour les pages contenant beaucoup de texte, comme les articles de blog et la documentation.

Les mises en page sont particulièrement utiles pour les [fichiers Markdown](#pages-markdownmdx). Les fichiers Markdown peuvent utiliser la propriété frontale spéciale `layout` pour spécifier un [composant de mise en page](/fr/core-concepts/layouts/) qui enveloppera leur contenu Markdown dans un document page complet `<html>...</html>`.


```md {3}
---
# Exemple : src/pages/page.md
layout: '../layouts/MySiteLayout.astro'
title: 'Ma page Markdown'
---
# Titre

Voici ma page, écrite en **Markdown**.

```

📚 En savoir plus sur [Markdown](/fr/guides/markdown-content/) dans Astro.

## Pages HTML

Les fichiers portant l'extension `.html` peuvent être placés dans le répertoire `src/pages/` et utilisés directement comme pages sur votre site. Notez que certaines fonctionnalités clés d'Astro ne sont pas prises en charge dans les [Composants HTML](/fr/core-concepts/astro-components/#html-components).

## Page d'erreur 404 personnalisée

Pour une page d'erreur 404 personnalisée, vous pouvez créer un fichier `404.astro` ou `404.md` dans `/src/pages`.

Il sera construit en une page `404.html`. La plupart des [services de déploiement](/fr/guides/deploy/) le trouveront et l'utiliseront.