---
layout: ~/layouts/MainLayout.astro
title: Structure du Projet
description: Apprends à structurer un projet avec Astro.
---

Votre tout nouveau projet Astro généré à partir de l'assistant de création `create-astro` possède déjà quelques fichiers et dossiers. En ce qui concerne les autres fichiers, vous pourrez les créer vous-même et les ajouter à la structure de fichiers d'Astro.

Voila comment un projet Astro est organisé, et quelques fichiers que vous trouverez dans votre nouveau projet.

## Répertoires et fichiers

Astro promouvoie une façon d'organiser de dossier pour votre projet. Chaque projet Astro doit inclure les répertoires et fichiers suivants :

- `src/*` - Le code source de votre projet (composants, pages, styles, etc...)
- `public/*` - Tout ce qui n'est pas du code et/ou fichiers qui n'ont pas a être traités (polices d'écritures, icones, etc...)
- `package.json` - Le manifeste de votre projet.
- `astro.config.mjs` - Un fichier de configuration d'Astro (optionel).

### Exemple de structure de projet

Un projet Astro assez commun peut ressembler à ça :

```
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   └-─ Button.jsx
│   ├── layouts/
│   │   └-─ PostLayout.astro
│   └── pages/
│   │   ├── posts/
│   │   │   ├── post1.md
│   │   │   ├── post2.md
│   │   │   └── post3.md
│   │   └── index.astro
│   └── styles/
│       └-─ global.css
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └-─ social-image.png
├── astro.config.mjs
└── package.json

```

### `src/`

Le dossier `src/` est où se trouve le code source de votre projet. Il comprend en général :

- [Des composants Pages](/fr/core-concepts/astro-pages/)
- [Des composants Layouts](/fr/core-concepts/layouts/)
- [Des composants Astro](/fr/core-concepts/astro-components/)
- [Des composants Frontend (React, etc...)](/fr/core-concepts/framework-components/)
- [Des fichiers de style (CSS, Sass)](/fr/guides/styling/)
- [Du Markdown](/fr/guides/markdown-content/)

Astro traite, optimise et regroupe les fichiers `src/` pour créer le site web final qui est délivré au navigateur. Contrairement au répertoire statique `public/`, les fichiers `src/` sont traités et assemblés pour vous par Astro.

Quelques fichiers (comme les composants Astro) ne sont pas envoyés au navigateur tels quels, mais plutôt en temps qu'HTML statique. D'autres fichiers (comme CSS) sont envoyés au navigateur, mais peuvent être optimisés ou regroupés avec d'autres fichiers CSS pour améliorer les performances.

### `src/components`

**Les composants** sont généralement du code réutilisables pour vos pages HTML. Ils peuvent être des [composants Astro](/fr/core-concepts/astro-components/), ou des [composants Frontend](/fr/core-concepts/framework-components/) comme React ou Vue. Il est commun de grouper et d'organiser tous les composants de votre projet dans ce dossier.

C'est une convention commune dans les projets Astro, mais elle n'est pas obligatoire. Organisez vos composants comme vous le voulez, si vous le souhaitez !

### `src/layouts`

[Les composants Layouts](/fr/core-concepts/layouts/) sont des types de composants particuliers qui s'appliquent à des pages. Ils sont généralement utilisés par les [Pages Astro](/fr/core-concepts/astro-pages/) et les [Pages Markdown](/fr/guides/markdown-content/) pour définir leur mise en page.

Comme `src/components`, organisez vos composants Layouts comme vous le souhaitez, ils ne sont pas obligatoires.

### `src/pages`

[Les composants Pages](/fr/core-concepts/astro-pages/) sont des types de composants particuliers utilisés pour créer de nouvelles pages. Une Page peut être un composant Astro (`.astro`) ou un fichier Markdown (`.md`) qui représente une page de contenu pour votre site.

> ⚠️ `src/pages` est un dossier **obligatoire** dans votre projet Astro. Sans ça, votre site n'aurait aucune page ni route !

### `src/styles`

C'est une convention commune de stocker vos fichiers CSS ou Sass dans le dossier `src/styles`, mais c'est pas obligatoire. Du moment que vos fichiers de style sont quelque part dans le dossier `src/`, Astro va les gérer et les optimiser.

### `public/`

Le dossier `public/` est là pour les fichiers et les ressources qui n'ont pas besoin d'être traités durant le processus de compilation d'Astro. Ces fichiers seront copiés dans le dossier de compilation sans modification.

Ce comportement permet que le dossier `public/` soit un endroit idéal pour les ressources communes comme des images, polices d'écriture, ou bien même des fichiers spéciaux comme `robots.txt` et `manifest.webmanifest`.

Vous pouvez placer des fichiers CSS et JavaScript dans le dossier `public/`, mais gardez à l'esprit que ces fichiers ne seront pas regroupés et/ou optimisés dans votre build final.

> 💡 *En règle générale, tout CSS ou JavaScript que vous ajoutez devrait être mis dans le dossier `src/`*

### `package.json`

C'est un fichier utilisé par les gestionnaires de paquets JavaScript pour gérer vos dépendances. Il définit également les scripts qui sont utilisés pour exécuter Astro (ex: `npm start`, `npm run build`).

Pour plus d'informations en ce qui concerne la création d'un nouveau fichier `package.json` pour votre projet, consultez les instructions de [configuration manuelle](/fr/install/manual/).

### `astro.config.mjs`

Ce fichier est généré dans chaque modèle de démarrage et contient des options de configuration pour votre projet Astro. Ici, vous pouvez spécifier les intégrations à utiliser, les options de compilation, les options du serveur, et plus encore.

Allez voir la [documentation de configuration](/fr/reference/configuration-reference/) pour plus d'informations sur les options de configuration.
