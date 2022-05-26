---
layout: ~/layouts/MainLayout.astro
title: CSS et Stylisation
description: Apprenez à utiliser les composants de style avec Astro.
setup: |
  import Since from '../../../components/Since.astro';
---

Astro à été conçu pour rendre la création de style et l'écriture de CSS facile. Écrivez votre propre CSS directement dans un composant Astro ou importez une bibliothèque de style préférée comme [Tailwind][tailwind]. Les langages de style avancés comme [Sass][sass] et [Less][less] sont également supportés.

## Stylisation dans Astro

Styliser un composant Astro est aussi facile que d'ajouter une balise `<style>` à votre template de composant ou de page. Quand vous placez une balise `<style>` dans un composant Astro, Astro détectera le CSS et chargera vos styles pour vous, automatiquement.

```astro
<style>
  h1 { color: red; }
</style>
```

### Portée des styles

Les règles CSS `<style>` d'Astro sont automatiquement **portées au composant par défaut**. Ces styles sont compilés en arrière-plan pour ne s'appliquer qu'à l'HTML écrit à l'intérieur du même composant. Le CSS que vous écrivez dans un composant Astro est automatiquement encapsulé dans ce composant.

```diff
<style>
-  h1 { color: red; }
+  h1.astro-HHNQFKH6 { color: red; }
-  .text { color: blue; }
+  .text.astro-HHNQFKH6 { color: blue; }
</style>
```

Les styles portés ne se propagent pas et ne n'affectent pas le reste de votre site. Dans Astro, c'est quelque chose de courrant d'utiliser des sélecteurs de basse-précision comme `h1 {}` ou `p {}` car ils seront compilés avec des encapsulations dans la sortie finale.

Les styles portés ne s'appliquent pas à d'autres composants Astro contenus dans votre template. Si vous avez besoin de styliser un composant enfant, envisagez de placer ce composant dans une `<div>` (ou d'autres éléments) que vous pourrez ensuite customiser.

#### Styles globaux

Comme nous recommandons les styles portés pour la plupart des composants, vous pourriez éventuellement trouver une raison valide de écrire du CSS global, non porté. Vous pouvez désactiver l'encapsulation automatique de CSS avec l'attribut `<style is:global>`.

```html
<style is:global>
  /* Non porté, livré directement au navigateur.
     S'applique à tous les <h1> dans votre site. */
  h1 { color: red; }
</style>
```

Vous pouvez aussi mélanger les règles CSS globales et portées dans la même balise `<style>` en utilisant le sélecteur `:global()`. Cela devient un modèle puissant pour appliquer des styles CSS à des enfants de votre composant.

```astro
<style>
  /* Porté à ce composant seulement. */
  h1 { color: red; }
  /* Mixé : Applique seulement aux éléments enfants `h1` de ce composant. */
  article :global(h1) {
    color: blue;
  }
</style>
<h1>Titre</h1>
<article><slot /></article>
```

Ceci est une bonne façon de styliser des éléments comme des articles de blog, ou des documents avec un contenu CMS qui se trouve en dehors de Astro. Mais soyez prudent : les composants dont l'apparence varie selon si oui ou non ils ont un certain parent composant peut être difficile à débugger.

Les styles portés devraient être utilisés aussi souvent que possible. Les styles globaux devraient être utilisés uniquement lorsque nécessaire.

### Variables CSS

<Since v="0.21.0" />

La balise `<style>` d'Astro peut référencer n'importe quelle variable CSS disponible sur la page. Vous pouvez aussi passer des variables CSS directement depuis le *front-matter* de votre composant en utilisant la directive `define:vars`.

```astro
---
const foregroundColor = "rgb(221 243 228)";
const backgroundColor = "rgb(24 121 78)";
---
<style define:vars={{ foregroundColor, backgroundColor }}>
  h1 {
    background-color: var(--backgroundColor);
    color: var(--foregroundColor);
  }
</style>
<h1>Bonjour</h1>
```

📚 Allez voir notre [page de référence des directives](/fr/reference/directives-reference/#definevars) pour en savoir plus sur `define:vars`.

## Styles externes

Il y a deux façons de résoudre des feuilles de styles globales externes : un import ESM pour les fichiers situés dans le code source de votre projet, et un lien absolu pour les fichiers dans le répertoire `public/` ou hébergés en dehors de votre projet.

📚 En savoir plus sur l'utilisation des [ressources statiques](/fr/guides/imports/) situées dans `public/` ou `src/`.

### Importer une feuille de styles locale

> ⚠️ Vous auriez surement besoin de mettre à jour votre fichier `astro.config` lorsque vous importez des feuilles de styles depuis des Packages NPM. Voir la section ["Importer une feuille de styles depuis un Package npm"](#importer-une-feuille-de-styles-depuis-un-package-npm) ci-dessous.

Vous pouvez importer des feuilles de styles dans le *Frontmatter* de votre composant Astro en utilisant la syntaxe d'import ESM. Les imports CSS fonctionnent [comme tous les autres imports ESM dans un composant Astro](/fr/core-concepts/astro-components/#le-script-du-composant), devrait être référencés comme **relatifs au composant** et doivent être écrits en **haut** de votre Script de composant, comme toutes les autres importations de ce type.

```astro
---
// Astro va automatiquement fusionner et optimiser ce CSS pour vous
// Cela fonctionne aussi pour des fichiers préprocesseurs comme .scss, .styl, etc.
import '../styles/utils.css';
---
<html><!-- Votre page ici --></html>
```

Les imports CSS via ESM sont supportés dans n'importe quel fichier JavaScript, y compris dans les composants JSX comme React & Preact. Cela peut être utile pour écrire des styles granulaires, par composant, pour vos composants React.

### Importer une feuille de styles depuis un Package NPM

Vous pourriez avoir besoin de charger une feuille de styles depuis un Package NPM. C'est particulièrement utile pour ceux utilitaires tel que [Open Props](https://open-props.style/). Si votre Package **recommends utiliser une extension de fichier** (Comme `package-name/styles.css` au lieu de `package-name/styles`), cela devrait fonctionner comme une feuille de styles locale :

```astro
---
// Exemple: src/pages/random-page.astro
import 'package-name/styles.css';
---
<html><!-- Votre page juste ici --></html>
```

Si votre Package **_ne recommande pas_ d'utiliser une extension de fichier** (tel que `package-name/styles`), vous devrez d'abord mettre à jour votre fichier de configuration d'Astro !

Disons que vous importez un fichier CSS depuis `package-name` appelé `normalize` (et sans l'extension de fichier). Pour s'assurer que nous pouvons afficher votre page correctement, ajoutez `package-name` à [la liste `vite.ssr.noExternal`](https://vitejs.dev/config/#ssr-noexternal).

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
export default defineConfig({
  vite: {
    ssr: {
      noExternal: ['package-name'],
    }
  }
})
```

> **Note :** Cette option est [spécifique à Vite](https://vitejs.dev/config/#ssr-noexternal) et _n'a aucun rapport_ (ou dépendance) avec [le mode SSR d'Astro](/fr/guides/server-side-rendering/).

Maintenant, vous êtes libres d'importer `package-name/normalize`. Cela sera intégré et optimisé par Astro comme toutes les autres feuilles de styles locales.

```astro
---
// Exemple: src/pages/random-page.astro
import 'package-name/normalize';
---
<html><!-- Votre page juste ici --></html>
```

### Charger une feuille de styles statique via des balises "link"

Vous pouvez aussi utiliser l'élément `<link>` pour charger une feuille de styles sur la page. Cela devrait être un chemin absolu vers un fichier CSS situé dans le répertoire `/public`, ou une URL vers un site web externe. Les valeurs relative "href" sur les balises `<link>` ne sont pas supportées.

```html
<head>
  <!-- En local: /public/styles/global.css -->
  <link rel="stylesheet" href="/styles/global.css" />
  <!-- Externe  -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.24.1/themes/prism-tomorrow.css">
</head>
```

Parce que cette approche utilise le répertoire `public/`, il saute les transformations CSS, la fusion et l'optimisation que fournit Astro. Si vous avez besoin de ces transformations, utilisez la méthode d'[importation une feuille de styles](#importer-une-feuille-de-styles-locale) ci-dessus.

## Intégrations CSS

Astro fournit le support pour ajouter les bibliothèques CSS populaires, les outils et les frameworks de votre projet comme [Tailwind][tailwind] et plus encore !

📚 Consultez le [Guide d'intégrations](/fr/guides/integrations-guide/) pour les instructions d'installation, d'importation et de configuration de ces intégrations.

## Préprocesseurs CSS

Astro supporte les préprocesseurs CSS comme [Sass][sass], [Stylus][stylus], et [Less][less] via [Vite][vite-preprocessors].

### Sass

```bash
npm install -D sass
```

Utilisez `<style lang="scss">` ou `<style lang="sass">` dans les fichiers `.astro`.

### Stylus

```bash
npm install -D stylus
```

Utilisez `<style lang="styl">` ou `<style lang="stylus">` dans les fichiers `.astro`.

### Less

```bash
npm install -D less
```

Utilisez `<style lang="less">` dans les fichiers `.astro`.

> Vous pouvez aussi utiliser tous les préprocesseurs CSS ci-dessus aussi bien dans les frameworks JS que dans d'autres! Assurez-vous de suivre les patterns recommandés par chacun des frameworks :

- **React** / **Preact**: `import Styles from './styles.module.scss';`
- **Vue**: `<style lang="scss">`
- **Svelte**: `<style lang="scss">`

## PostCSS

Astro intégres PostCSS par défaut, de par avec [Vite](https://vitejs.dev/guide/features.html#postcss). Pour configurer PostCSS pour votre projet, créez un fichier `postcss.config.js` dans le répertoire racine de votre projet. Vous pouvez importer des plugins en utilisant `require()`.

```js
// ./postcss.config.js
module.exports = {
  plugins: [
    require('postcss-preset-env'),
    require('autoprefixer'),
  ],
};
```

---

## Frameworks et bibliothèques

### 📘 React / Preact

Les fichiers `.jsx` supportent aussi les CSS globaux et les modules CSS. Pour activer le dernier, utilisez l'extension `.module.css` (ou `.module.scss`/`scss` si vous utilisez Sass).

```js
import './global.css'; // inclus du CSS global
import Styles from './styles.module.css'; // Utilise les modules CSS (doit se terminer par `.module.css`, `.module.scss`, ou `.module.sass`!)
```

### 📗 Vue

Vue Astro supporte les mêmes méthodes que `vue-loader` :

- [vue-loader - CSS Portés][vue-scoped]
- [vue-loader - Modules CSS][vue-css-modules]

### 📕 Svelte

Svelte fonctionne aussi à la perfection dans Astro : [Documentation de Style sur Svelte][svelte-style].

## Avancé

> ⚠️ATTENTION⚠️ :
> Soyez vigilant lorsque vous ignorez la compression du CSS intégré à Astro. Les styles ne seront pas automatiquement inclus dans le code généré, et votre responsabilité de vous assurer que le fichier référencé est bien inclus dans la sortie finale.

### Importations CSS `?raw`

Pour certain cas spécifiques, il est possible d'importer directement du CSS depuis le disque sans qu'il soit compressé ou optimisé par Astro. Cela peut être utile lorsque vous avez besoin d'un contrôle total sur votre CSS, et que vous avez besoin d'ignorer le traitement automatique du CSS par Astro.

Ceci n'est pas recommandé pour la plupart des utilisateurs.

```astro
---
// Exemple avancé ! Non-recommandé pour la plupart des utilisateurs.
import rawStylesCSS from '../styles/main.css?raw';
---
<style is:inline set:html={rawStylesCSS}></style>
```

Voir la [documentation de Vite](https://vitejs.dev/guide/assets.html#importing-asset-as-url) pour plus de détails.

### Importations CSS `?url`

Dans certain cas spécifiques, vous pouvez importer une référence directe URL pour un fichier CSS dans le répertoire `src/` de votre projet. Cela peut être utile lorsque vous avez besoin d'un contrôle total sur la manière dont un fichier CSS est chargé sur la page. Cependant, cela empêchera la compression de ce fichier avec les autres styles sur page.

Ceci n'est pas recommandé pour la plupart des utilisateurs. À la place, mettez vos fichiers CSS dans le dossier `public/` pour obtenir une référence URL consistente.

> ⚠️ATTENTION⚠️ :
> Importer un fichier CSS minime avec `?url` peut renvoyer son contenus CSS encodés en base64 en temps qu'URL, mais uniquement en production. Vous devrez écrire votre code pour supporter les URL de données (`data:text/css;base64,...`) ou alors définir l'option [`vite.build.assetsInlineLimit`](https://vitejs.dev/config/#build-assetsinlinelimit) à `0` pour désactiver cette fonctionnalité.

```astro
---
// Exemple avancé ! Non-recommandé pour la plupart des utilisateurs.
import stylesUrl from '../styles/main.css?url';
---
<link rel="preload" href={stylesUrl} as="style">
<link rel="stylesheet" href={stylesUrl}>
```

Voir la [documentation de Vite](https://vitejs.dev/guide/assets.html#importing-asset-as-url) pour plus de détails.


[less]: https://lesscss.org/
[sass]: https://sass-lang.com/
[stylus]: https://stylus-lang.com/
[svelte-style]: https://svelte.dev/docs#component-format-style
[tailwind]: https://github.com/withastro/astro/tree/main/packages/integrations/tailwind
[vite-preprocessors]: https://vitejs.dev/guide/features.html#css-pre-processors
[vue-css-modules]: https://vue-loader.vuejs.org/guide/css-modules.html
[vue-scoped]: https://vue-loader.vuejs.org/guide/scoped-css.html
