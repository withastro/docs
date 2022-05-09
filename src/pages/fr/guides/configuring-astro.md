---
layout: ~/layouts/MainLayout.astro
title: Configurer Astro
---

Personnalisez la façon dont Astro fonctionne en ajoutant un fichier `astro.config.mjs` dans votre projet. Ce fichier est commun dans les projets Astro, et tout les exemples officiels et thèmes en comportent un par défaut.

📚 Consultez la [référence d'API d'Astro](/fr/reference/configuration-reference/) pour une vue d'ensemble des options de configuration supportées.

## Le Fichier de Configuration d'Astro

Une configuration valide d'Astro exporte sa configuration en utilisant l'exportation `default`, en utilisant la fonction d'aide recommandée, `defineConfig` :

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // vos options de configuration ici...
  // https://docs.astro.build/fr/reference/configuration-reference/
})
```

Utiliser `defineConfig()` est recommandé pour automatiser les types dans votre éditeur de code, mais c'est aussi optionnel. Un fichier de configuration absolument minimal, valide, pourrait ressembler à ça :

```js
// Exemple : Fichier de configuration minimal, vide
export default {}
```

## Types de Fichier de Configuration Supportés

Astro supporte plusieurs formats de fichier pour le fichier de configuration JavaScript : `astro.config.mjs`, `astro.config.mjs`, `astro.config.cjs` et `astro.config.ts`.

TypeScript fichier de configuration chargement est géré en utilisant [`tsm`](https://github.com/lukeed/tsm) et respectera les options du fichier `tsconfig` de votre projet.

## Résolution du Fichier de Configuration

Astro va automatiquement essayer de chercher un fichier de configuration nommé `astro.config.mjs` à l'intérieur de la racine du projet. Si aucun fichier de configuration n'est trouvé à l'intérieur de la racine du projet, les options par défaut d'Astro seront utilisées.

```bash
# Exemple : Lit votre configuration à partir de ./astro.config.mjs
astro build
```

Vous pouvez définir un fichier de configuration à utiliser avec l'option `--config`. Cette commande cherchera toujours au chemin d'accès relatif par rapport au répertoire de travail actuel où vous avez exécuté la commande `astro`.

```bash
# Exemple : Lit votre configuration à partir de ce fichier
astro build --config my-config-file.js
```

## Autocomplétion de Configuration

Nous recommandons d'utiliser la fonction d'aide `defineConfig()` dans votre fichier de configuration. `defineConfig()` fournit une autocomplétion automatique dans votre éditeur de code. Les éditeurs comme VSCode sont capable de lire les définitions de type de TypeScript venant d'Astro et de fournir des astuces de type jsdoc, même si votre fichier de configuration n'est pas écrit en TypeScript.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // vos options de configuration ici...
  // https://docs.astro.build/fr/reference/configuration-reference/
})
```

Vous pouvez également fournir des définitions de type manuellement à VSCode, en utilisant cette notation JSDoc :

```js
// astro.config.mjs
 export default /** @type {import('astro').AstroUserConfig} */ ({
  // vos options de configuration ici...
  // https://docs.astro.build/fr/reference/configuration-reference/
}
```

## Référencement des Fichiers Relatifs

Si vous indiquez un chemin relatif à `root` ou à l'option `--root`, Astro va résoudre ce chemin par rapport au répertoire de travail actuel où vous avez exécuté la commande `astro`.

```js
export default defineConfig({
    // Cherches vers le répertoire "./foo" dans le répertoire de travail actuel
    root: 'foo'
})
```

Astro va chercher toutes les autres chaînes de caractères de fichiers et de répertoires par rapport à la racine du projet :

```js
export default defineConfig({
    // Se dirige vers le répertoire "./foo" dans le répertoire de travail actuel
    root: 'foo',
    // Se dirige vers le répertoire "./foo/public" dans le répertoire de travail actuel
    publicDir: 'public',
})
```

Pour référencer un fichier ou un répertoire relatif au fichier de configuration, utilisez `import.meta.url` (sauf si vous écrivez un fichier commonJS `astro.config.cjs`).

```js
export default defineConfig({
    // Se dirige vers le répertoire "./foo", relatif à ce fichier de configuration
    root: new URL("./foo", import.meta.url),
    // Se dirige vers le répertoire "./public", relatif à ce fichier de configuration
    publicDir: new URL("./public", import.meta.url),
})
```

## Référence de Configuration

📚 Lis la [référence d'API de configuration d'Astro](/fr/reference/configuration-reference/) pour une vue d'ensemble des options de configuration supportées.
