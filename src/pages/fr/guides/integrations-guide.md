---
layout: ~/layouts/MainLayout.astro
setup: |
  import Badge from '~/components/Badge.astro';
title: Utiliser les Intégrations
---

Les **intégrations Astro** ajoutent de nouvelles fonctionnalités et comportements à votre projet avec seulement quelques lignes de code. Vous pouvez écrire une intégration personnalisée, ou récupérer des intégrations populaires depuis [npm](https://www.npmjs.com/search?q=keywords%3Aastro-component&ranking=popularity).

- Débloque l'utilisation de React, Vue, Svelte, Solid.js et d'autres Frameworks UI populaires.
- Intégre des outils comme Tailwind, Turbolinks, et Partytown avec quelques lignes de code.
- Ajoute de nouvelles fonctionnalités à votre projet, comme la génération automatique du sitemap.
- Écrivez du code personnalisé qui s'intégre dans le processus de construction, le serveur de développement et plus encore.

> Les intégrations sont toujours en cours de développement, et l'API n'a pas encore été finalisée. Seules les intégrations officielles (celles publiées sur `@astrojs/` sur npm) sont actuellement prises en charge pour protéger les utilisateurs des changements brusques.
>
> **Pour activer les intégrations tierces :** Exécutez Astro avec la commande CLI `--experimental-integrations`.

## Tutoriel : Ajouter React à votre projet

Dans cet exemple, nous allons installer l'intégration `@astrojs/react` pour ajouter le support React à votre projet Astro. Le processus pour ajouter un autre Framework (Preact, Vue, Svelte ou Solid.js) est presque identique et peut être suivi en utilisant les mêmes étapes que ci-dessous.

<blockquote>
  <Badge variant="accent">Sentez-vous l'appel de l'aventure ?</Badge>

  Astro a récemment lancé une commande **expérimentale** `astro add` pour automatiser ce processus ! Au lieu des étapes ci-dessous, vous pouvez exécuter `npx astro add react`. C'est tout !

  Passez à [Configuration d'intégration automatique](#configuration-dintégration-automatique) pour plus de détails.
</blockquote>

Premièrement, vous devez installer l'intégration et les packages liés que vous attendez d'utiliser dans votre projet. Pour React, cela signifie installer l'intégration `@astrojs/react` ***et*** les packages `react` + `react-dom`.

```bash
npm install --save-dev @astrojs/react
```

Une fois que vos packages ont été installés, ajoutez deux lignes au fichier de configuration de votre projet `astro.config.mjs`.

```diff
  // astro.config.mjs
  import { defineConfig } from 'astro/config';
+ import react from '@astrojs/react';

  export default defineConfig({
+   integrations: [react()],
  });
```

La première ligne est l'importation l'intégration dans votre fichier de configuration. La deuxième ligne appelle la fonction d'intégration (`react()`) et ajoute l'intégration pour que Astro sache qu'il doit l'utiliser.

C'est tout ! Redémarrez Astro, et la nouvelle intégration devrait prendre effet immédiatement.

Si vous voyez une erreur au démarrage, assurez-vous que vous avez :

- ✅ ajouté les packages requis avec npm
- ✅ importé l'intégration dans votre fichier `astro.config.mjs`
- ✅ appelé votre intégration comme une fonction (`[react()]`, pas `[react]`)
- ✅ supprimé toute configuration obsolète `renderers:` (avant la version 0.25)

## Configuration d'intégration automatique

Astro a récemment lancé une commande **expérimentale** `astro add` pour automatiser la configuration des intégrations.

> Nous allons toujours demander une confirmation avant de mettre à jour tous vos fichiers, mais il n'est jamais trop prudent de faire un backup de version juste pour être sûr.

À la place de la configuration manuelle décrite ci-dessus, exécutez simplement `astro add [name]` et notre assistant d'intégration automatique mettra à jour votre fichier de configuration et installera toutes les dépendances nécessaires.

```shell
# Utilisant NPM
npx astro add react
# Utilisant Yarn
yarn astro add react
# Utilisant PNPM
pnpx astro add react
```

Il est aussi possible de configurer plusieurs intégrations en même temps !

```shell
# Utilisant NPM
npx astro add react tailwind partytown
# Utilisant Yarn
yarn astro add react tailwind partytown
# Utilisant PNPM
pnpx astro add react tailwind partytown
```

## Gérer les dépendances d'intégration

Quand vous installez une intégration Astro dans votre projet, gardez une oeil sur les avertissements `"missing peer dependencies"` que vous voyez pendant l'installation. Tous les gestionnaires de paquets ne peuvent pas vous les installer automatiquement. Si vous êtes sur Node v16+ et utilisez npm, vous n'aurez pas besoin de vous inquiéter de cette section.

Si vous voyez un avertissement `"Cannot find package 'react'"` (ou similaire), cela signifie que vous devez installer ce package dans votre projet. React, par exemple, est une dépendance de la paquetage `@astrojs/react`. Cela signifie que vous devez installer les paquets officiels `react` et `react-dom` avec votre intégration. L'intégration va alors utiliser ces packages automatiquement.

```diff
# Exemple : Installer les intégrations et les Frameworks ensemble
- npm install @astrojs/react
+ npm install @astrojs/react react react-dom
```

Si vous manquez cette étape, ne vous inquiétez pas, Astro vous avertira au démarrage si des dépendances en commun manquent mais ne sont pas dans votre projet.

Gérer vos propres dépendances en commun peut être un peu plus de travail, mais il vous permet de contrôler précisément quelles versions de paquets vous utilisez pour les choses comme React, Tailwind, et plus encore. Cela vous donne plus de contrôle sur votre projet.

Dans le futur, une commande utilitaire `astro add` pourrait gérer tout ce processus pour vous, et installer les dépendances correspondantes pour vos intégrations automatiquement.

## Utiliser les intégrations

Les intégrations Astro sont toujours ajoutées à l'aide de la propriété `integrations` dans votre fichier `astro.config.mjs`.

> Vous voulez en savoir plus sur l'utilisation ou la configuration d'une intégration spécifique ? Consultez notre [répertoire des intégrations](https://astro.build/integrations/) et suivez le lien vers son dépôt sur GitHub.

Il existe trois façons d'importer une intégration dans votre projet Astro :

1. Installer une intégration de paquets npm.
2. Importer votre propre intégration à partir d'un fichier local dans votre projet.
3. Écrire votre intégration en ligne, directement dans votre fichier de configuration.

```js
// astro.config.mjs
import {defineConfig} from 'astro/config';
import installedIntegration from '@astrojs/vue';
import localIntegration from './my-integration.js';

export default defineConfig({
  integrations: [
    // 1. Importée à partir d'un paquet npm installé
    installedIntegration(),
    // 2. Importée à partir d'un fichier JS local
    localIntegration(),
    // 3. Un objet directement dans le fichier de configuration
    {name: 'namespace:id', hooks: { /* ... */ }},
  ]
})
```

Consultez l'[API d'intégration](/fr/reference/integrations-reference/) pour en savoir plus sur les différentes façons que vous pouvez écrire une intégration.

### Options personnalisées

Les intégrations sont presque toujours écrites en tant que fonctions de fabrique qui renvoient l'objet intégration. Cela vous permet de passer des arguments et des options à la fonction de fabrique qui personnalise l'intégration pour votre projet.

```js
integrations: [
  // Exemple : Personnalisez votre intégration avec des arguments de fonction
  sitemap({filter: true})
]
```

### Activer une intégration

Les intégrations `false` sont ignorées, donc vous pouvez activer et désactiver les intégrations sans vous inquiéter de valeurs booléennes ou `undefined` qui restent.

```js
integrations: [
  // Exemple : Ignorer la construction d'un sitemap sur Windows
  process.platform !== 'win32' && sitemap()
]
```

## Construire votre propre intégration

L'API d'intégration d'Astro est inspirée de Rollup et Vite, et est conçue pour ressembler à celles-ci et aider ceux qui sont familier avec cet environnement.

Consultez l'[API d'intégration](/fr/reference/integrations-reference/) pour savoir ce que peut faire une intégration et comment la créer vous-même.
