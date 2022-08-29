---
title: Déployez votre site Astro sur les Github Pages
description: Comment déployer votre site Astro sur le Web à l'aide des Github Pages.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

Vous pouvez utiliser les [GitHub Pages](https://pages.github.com/) pour héberger un site Astro directement depuis un dépôt sur [GitHub.com](https://github.com/).

## Comment déployer

Vous pouvez déployer un site Astro sur les GitHub Pages en utilisant une [GitHub Actions](https://github.com/features/actions) afin d'automatiser le build et le déploiement de votre site. Pour faire ça, votre code source doit être hébergé sur GitHub.

Astro maintient l'action officielle `withastro/action` pour déployer vos projets avec très peu de configuration. Suivez les instructions ci-dessous pour déployer votre site Astro sur les Github Pages, et lisez [le package README](https://github.com/withastro/action) si vous souhaitez plus d'informations.

1. Définissez les options [`site`](/fr/reference/configuration-reference/#site), et si besoin, [`base`](/fr/reference/configuration-reference/#base) dans `astro.config.mjs`.
    - `site` devrait être quelque chose comme `https://<YOUR_USERNAME>.github.io`
    - `base` doit être le nom de votre dépôt commençant par un slash, par exemple `/my-repo`.
    
    :::note
    Si votre dépôt s'appelle `<YOUR_USERNAME>.github.io`, vous ne devez pas inclure `base`.
    :::

2. Créez un nouveau fichier dans votre projet à `.github/workflows/deploy.yml` et collez-y le YAML ci-dessous.

    ```yaml
    name: Github Pages Astro CI

    on:
      # Déclenchez le workflow chaque fois que vous poussez vers la branche `main`
      # Vous utilisez un nom de branche différent ? Remplacez `main` par le nom de votre branche
      push:
        branches: [ main ]
      # Vous permet d'exécuter ce workflow manuellement à partir de l'onglet Actions sur GitHub.
      workflow_dispatch:
      
    # Autoriser cette tâche à cloner le dépôt et à créer un déploiement de page
    permissions:
      contents: read
      pages: write
      id-token: write

    jobs:
      build:
        runs-on: ubuntu-latest
        steps:
          - name: Checkout your dépôt using git
            uses: actions/checkout@v2          
          - name: Install, build, and upload your site
            uses: withastro/action@v0

      deploy:
        needs: build
        runs-on: ubuntu-latest
        environment:
          name: github-pages
          url: ${{ steps.deployment.outputs.page_url }}
        steps:
          - name: Deploy to GitHub Pages
            id: deployment
            uses: actions/deploy-pages@v1
    ```
    
    :::caution
   [L'action](https://github.com/withastro/action) officielle Astro recherche un fichier de verrouillage pour détecter votre gestionnaire de paquets préféré (`npm`, `yarn`, ou `pnpm`). Vous devez commit le fichier généré automatiquement par votre gestionnaire de packages `package-lock.json`, `yarn.lock`, ou `pnpm-lock.yaml` dans votre dépôt.
    :::

3. Faites un commit du nouveau fichier workflow et poussez-le sur Github.  

4. Sur GitHub, allez dans l'onglet **Paramètres** de votre dépôt et trouvez la section **Pages** des paramètres.  

5. Choisissez la branche `gh-pages` et le dossier `"/" (root)` comme **Source** de votre site et appuyez sur **Enregistrer**.  
  
Votre site devrait maintenant être publié ! Lorsque vous poussez des modifications dans le dépôt de votre projet Astro, le GitHub Action va automatiquement les déployer pour vous.

:::tip[configurer un domaine personnalisé]
Vous pouvez éventuellement configurer un domaine personnalisé en ajoutant le fichier suivant `./public/CNAME` à votre projet : 

```txt title="public/CNAME"
sub.mydomain.com
```

Cela déploiera votre site sur votre domaine personnalisé au lieu de `user.github.io`. N'oubliez pas de [configurer également le DNS pour votre fournisseur de domaine](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain).   
:::
