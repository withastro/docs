---
title: Installation d'Astro avec l'ILC automatique
description: Comment installer Astro avec NPM, PNPM, ou Yarn via l'outil de création create-astro inclus dans l'ILC.
layout: ~/layouts/MainLayout.astro
setup: import InstallGuideTabGroup from '~/components/TabGroup/InstallGuideTabGroup.astro';
---

Prêt à installer Astro ? Suivez notre guide d'installation automatique ou manuel pour commencer.

#### Prérequis

- **Node.js** - version `14.15.0`, `v16.0.0`, ou supérieure.
- **Éditeur de code** - Nous recommandons [VS Code](https://code.visualstudio.com/) avec notre [extension officielle Astro](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).
- **Console de terminal** - Astro est accessible via son interface par ligne de commande (ILC).

<InstallGuideTabGroup />

#### Installation

`create-astro` est le moyen le plus rapide et le plus simple de démarrer un nouveau projet Astro à partir de zéro.

## 1. Utiliser l'<abbr title="Interface par ligne de commande">ILC</abbr>

Lancez la commande suivante dans votre terminal pour démarrer notre assistant d'installation, `create-astro`. Vous serez guidé dans la création de votre premier projet Astro à l'intérieur du répertoire où vous l'avez lancé.

Pas besoin de créer un répertoire ! L'assistant d'installation créera automatiquement un répertoire pour vous.

```shell
# NPM
npm create astro@latest

# Yarn
yarn create astro

# PNPM
pnpm create astro@latest
```

En fonction de votre gestionnaire de Packages, vous pourriez recevoir une demande de confirmation pour installer `create-astro@latest`. Il vous sera par la suite demandé de choisir un dossier pour votre projet (ex: `./my-astro-site`) qui crééra un nouveau répertoire.

### Choisir un Template de Démarrage

Vous allez ensuite apercevoir une petite liste de Templates de démarrage dans laquelle choisir :

- `Just the basics`: Un excellent modèle de démarrage pour tous ceux qui veulent explorer Astro.
- `Blog`, `Documentation`, `Portfolio`: thèmes prédéfinis pour des cas d'utilisation spécifiques.
- `Completely empty`: Un modèle minimal qui ne contient que les éléments essentiels pour commencer.

Utilisez les flèches directionnelles (haut et bas) pour naviguer vers le Template que vous souhaitez installer, puis appuyez sur la touche entrée pour valider.

> 💡 Vous voulez jeter un oeil aux Templates dans votre navigateur avant de choisir ? Allez sur [astro.new](https://astro.new/)

## 2. Installer les Dépendances (Optionnel)

L'assiistant d'installation vous proposera d'exécuter la commande `install` pour vous, qui est optionnelle.

> ⚠️ Si vous ne le faites pas maintenant, vous devrez [installer les dépendances](/fr/install/auto/#2-installer-les-dépendances) après l'assistant d'installation, avant de commencer votre projet.

### Installer Une ou Plusieurs Intégrations Astro (Optionnel)

Il vous sera demandé à ce moment d'ajouter n'importe quelle [intégration de Framework UI](/fr/core-concepts/framework-components/) (React, Svelte, Vue, Solid, Preact, Lit) et d'ajouter ensuite d'autres intégrations officielles (tel que Tailwind, Partytown, Sitemap) en exécutant `astro add --yes`.

Pour sélectionner les intégrations Astro que vous souhaitez inclure dans votre projet, utilisez les flèches directionnelles (haut et bas) pour naviguer et la touche espace pour sélectionner ou désélectionner. Vous pouvez sélectionner plusieurs éléments à la fois, ou continuer sans sélectionner d'intégrations.

Quand vous êtes satisfait de votre sélection, appuyez sur la touche entrée pour valider.

> Ces intégrations, et toutes les [intégrations de la communauté Astro](https://astro.build/integrations/), peuvent également être ajoutées plus tard en suivant les instructions dans notre [guide d'intégrations](/fr/guides/integrations-guide/).

Après avoir sélectionné vos intégrations à ajouter, vous devriez voir le message suivant dans votre terminal pour vous affirmer que `create-astro` va appliquer les changements à votre fichier `astro.config.mjs` :

```bash
Astro will make the following changes to your config file:
# Peut se traduire par : "Astro va faire les changements suivants dans votre fichier de configuration :"
```

Ce message vous informe que vos intégrations ont été ajoutées avec succès à votre fichier de configuration. (Si ce n'est pas le cas, vous pouvez toujours les ajouter manuellement plus tard.)

### Initialiser un Dépot `.git` (Optionnel)

À cette dernière étape, vous pouvez choisir d'initialiser un dépot Git dans votre nouveau répertoire. C'est optionnel, mais utile si vous souhaitez utiliser l'outil [Git](https://git-scm.com/) pour votre projet.

### Étapes Suivantes

Quand l'assistant d'installation `create-astro` est terminé, vous devriez voir quelques instructions recommandées sur votre écran ("Next Steps") qui vont vous aider à compléter votre configuration et démarrer votre nouveau projet.

## 2. Installer les Dépendances

Si vous n'avez pas installé les dépendances de votre projet avec l'assistant d'installation, vous allez maintenant en faire avec votre gestionnaire de Package préféré :

```bash
# NPM
npm install

# Yarn
yarn

# PNPM
pnpm install
```

## 3. Lancer Astro ✨

Vous pouvez vous attendre à utiliser le serveur de développement intégré d'Astro pour la plupart de vos projets. C'est de cette manière que vous lancerez votre projet localement pendant le développement.

Pour commencer, utilisez votre gestionnaire de Packages pour lancer le script de démarrage par défaut :

```bash
# NPM
npm run dev

# Yarn
yarn start

# PNPM
pnpm run dev
```

Si tout se passe comme prévu, Astro devrait maintenant être en train de faire tourner votre projet à l'addresse [http://localhost:3000/](http://localhost:3000/) !

Astro va également suivre les modifications de fichiers dans le répertoire `src/`, vous n'aurez donc pas besoin de redémarrer le serveur à chaque fois que vous apporterez des modifications au cours du développement.

Si vous n'arrivez pas à ouvrir votre projet dans le navigateur, revenez au terminal où vous avez lancé le script `start` pour voir ce qui a mal tourné.

## 4. Déployer sur le Web

Il est temps de déployer votre projet sur la toile ! Lancez la commande `build` dans votre projet pour construire votre site web statique vers un nouveau répertoire nommé `dist/`.

```bash
# NPM
npm run build

# Yarn
yarn build

# PNPM
pnpm run build
```

Quand la commande se termine, vous devriez avoir un nouveau répertoire `dist/` dans votre projet que vous pouvez déployer directement sur votre hébergeur web favori.

Pour commencer à déployer votre site web gratuitement, allez jeter un oeil à notre fier partenaire d'hébergement, [Netlify](https://www.netlify.com/). Pour obtenir des instructions sur la mise en place d'un déploiement, lisez notre [guide de déploiement](/fr/guides/deploy/).

## Étapes Suivantes

Bravo ! Vous êtes maintenant prêt à développer avec Astro !

📚 En apprendre plus sur la structure de votre projet Astro dans notre [Guide de structure de projet](/fr/core-concepts/project-structure/).

📚 En apprendre plus sur la structure des composants d'Astro dans notre [Guide de structure des composants](/fr/core-concepts/astro-components/).

📚 En apprendre plus sur le routage par pages d'Astro dans notre [Guide de routage](/fr/core-concepts/astro-pages/).
