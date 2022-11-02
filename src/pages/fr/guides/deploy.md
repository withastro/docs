---
title: Déployer votre Site Astro
description: Comment déployer votre site Astro sur le web.
layout: ~/layouts/MainLayout.astro
setup: import DeployGuidesNav from '~/components/DeployGuidesNav.astro';
i18nReady: true
---
**Prêt à construire et déployer votre site Astro ?** Suivez un de nos guides sur différents services de déploiement, ou scrollez plus bas pour avoir des orientations générales sur comment déployer un site Astro.

<DeployGuidesNav />

## Options de déploiement rapide

Vous pouvez construire et déployer rapidement un site Astro vers de nombreux hébergeurs, via l'interface de leur site internet ou une CLI.

### Interface d'un hébergeur

Une façon rapide de déployer votre site internet est de connecter le repository Git (ex. GitHub, GitLab, Bitbucket) de votre projet Astro à un hébergeur, afin de profiter du déploiement continu en utilisant Git.

Ces hébergeurs détectent automatiquement les push sur le repository de votre projet Astro, build votre site et le déploient sur le web sur une URL personnalisée ou sur votre nom de domaine personnel. La plupart du temps, mettre en place le déploiement sur ces platformes suivra les étapes suivantes :

1. Ajoutez votre repository à un provider Git (ex. sur GitHub, GitLab, Bitbucket)

1. Choisissez un hébergeur qui supporte le *déploiement continu* (ex. [Netlify](/en/guides/deploy/netlify/) ou [Vercel](/en/guides/deploy/vercel/)) et importez votre repository Git en tant que nouveau projet / site.

    De nombreux hébergeurs vont reconnaitre votre projet en tant que site Astro, et devraient automatiquement appliquer la configuration appropriée pour construire et déployer votre site comme montré ci-dessous. (Dans le cas contraire, ces paramètres peuvent être modifiés.)

    :::note[Paramètres de déploiement]
    - **Commande de build:** `astro build` ou `npm run build`
    - **Dossier de publication:** `dist`
    :::

1. Cliquez sur "Déployer" et votre nouveau site internet sera créé avec une URL unique (ex. `new-astro-site.netlify.app`).


L'hébergeur va automatiquement inspecter votre branche main de votre repository, et dès que des changements seront détectés, va reconstruire et republier votre site. Ces paramètres peuvent typiquement être modifiés dans l'interface de votre hébergeur.

### déploiement via une CLI

Certains hébergeurs proposent leur propre interface de ligne de commande (CLI) que vous pouvez installer globalement sur votre machine en utilisant npm. Souvent, utiliser une CLI pour déployer ressemble à ceci :

1. Installez la CLI de votre hébergeur, par example :

    ```bash
    npm install --global netlify-cli
    ```

1. Executez la CLI et suivez les instructions de connexion, mise en place etc.

1. Construisez votre site et déployez-le sur votre hébergeur

    De nombreux hébergeurs vont reconnaitre votre projet en tant que site Astro, et devraient automatiquement appliquer la configuration appropriée pour construire et déployer votre site comme montré ci-dessous. (Dans le cas contraire, ces paramètres peuvent être modifiés.)

    :::note[Paramètres de déploiement]
    - **Commande de build:** `astro build` ou `npm run build`
    - **Dossier de publication:** `dist`
    :::


    D'autres hébergeurs vont vous demander de [construire votre site localement](#construire-votre-site-localement) et déployer en utilisant la CLI.

## Construire votre site localement

De nombreux hébergeurs comme Netlify ou Vercel vont construire votre site pour vous puis le publier. Mais, certains sites vous demanderont de construire localement puis d'exécuter une commande de déploiement.

Vous pouvez aussi vouloir construire votre site localement pour le prévisualiser, ou détecter des potentielles erreurs et avertissement dans votre propre environnement.

Exécutez la commande `npm run build` pour construire votre site Astro.

```bash
npm run build
```

Par défaut, le dossier de build sera placé à `dist/`. Ce dossier peut être changé en utilisant [l'option `outDir`](/fr/reference/configuration-reference/#outdir).

## Ajouter un Adapteur pour du SSR

:::note
Avant de déployer votre site Astro avec du [SSR (server-side rendering)](/fr/guides/server-side-rendering/) activé, vérifiez que vous avez :

- Installé [l'adapteur approprié](/fr/guides/server-side-rendering/#activation-du-mode-ssr-dans-votre-projet) en tant que dépendance de votre projet (que ça soit manuellement, ou en utilisant la commande de l'adapteur `astro add`, ex. `npx astro add netlify`).
- [Ajouté l'adapteur](/fr/reference/configuration-reference/#integrations) à votre fichier `astro.config.mjs` si vous installez manuellement. (La commande `astro add` fera cette étape automatiquement !)
:::

