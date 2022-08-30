---
# NOTE: This file is auto-generated from 'scripts/docgen.mjs'
# Do not make edits to it directly, they will be overwritten.

layout: ~/layouts/MainLayout.astro
title: Référence de configuration
i18nReady: true
setup: |
  import Since from '../../../components/Since.astro';
---

La référence suivante couvre toutes les options de configuration prises en charge dans Astro. Pour en savoir plus sur la configuration d'Astro, lisez notre guide sur la [configuration d'Astro](/fr/guides/configuring-astro/).

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // Vos options de configuration ici...
})
```
## Options de niveau supérieur

### racine

<p>

**Type:** `string`<br>
**CLI:** `--root`<br>
**Par défaut:** `"."` (répertoire de travail actuel)
</p>

Vous ne devez fournir cette option que si vous exécutez la commande CLI `astro` dans un répertoire autre que le répertoire racine du projet. Habituellement, cette option est fournie via le CLI au lieu du [fichier de configuration Astro](/fr/guides/configuring-astro/#supported-config-file-types), car Astro doit connaître la racine de votre projet avant de pouvoir localiser votre fichier de configuration.

Si vous fournissez un chemin relatif (ex: `--root: './my-project'`) Astro va le résoudre par rapport à votre répertoire de travail actuel.

#### Exemples

```js
{
  root: './my-project-directory'
}
```
```bash
$ astro build --root ./my-project-directory
```


### srcDir

<p>

**Type:** `string`<br>
**Par défaut:** `"./src"`
</p>

Définissez le répertoire à partir duquel Astro lira votre site.

La valeur peut être soit un chemin absolu du système de fichiers, soit un chemin relatif à la racine du projet.

```js
{
  srcDir: './www'
}
```


### publicDir

<p>

**Type:** `string`<br>
**Par défaut:** `"./public"`
</p>

Définissez le répertoire de vos ressources statiques. Les fichiers de ce répertoire sont servis à `/` pendant le développement et copiés dans votre répertoire de build pendant la phase de build. Ces fichiers sont toujours servis ou copiés tels quels, sans transformation ni regroupement.

La valeur peut être soit un chemin absolu du système de fichiers, soit un chemin relatif à la racine du projet.

```js
{
  publicDir: './my-custom-publicDir-directory'
}
```


### outDir

<p>

**Type:** `string`<br>
**Par défaut:** `"./dist"`
</p>

Définissez le répertoire dans lequel `astro build` écrit votre version finale.

La valeur peut être soit un chemin absolu du système de fichiers, soit un chemin relatif à la racine du projet.

```js
{
  outDir: './my-custom-build-directory'
}
```


### site

<p>

**Type:** `string`
</p>

Votre URL finale déployée. Astro utilise cette URL complète pour générer votre sitemap et vos URL canoniques dans votre version finale. Il est fortement recommandé de définir cette configuration pour tirer le meilleur parti d'Astro.

```js
{
  site: 'https://www.my-site.dev'
}
```


### base

<p>

**Type:** `string`
</p>

Le chemin de base vers lequel vous effectuez le déploiement. Astro correspondra à ce nom de chemin d'accès pendant le développement afin que votre expérience de développement corresponde la plus possible à votre environnement de build. Dans l'exemple c-dessous, `astro dev` démarrera votre serveur à `/docs`.

```js
{
  base: '/docs'
}
```


### trailingSlash

<p>

**Type:** `'always' | 'never' | 'ignore'`<br>
**Par défaut:** `'ignore'`
</p>

Définissez la route correspondante au comportement du serveur dev. Choisissez parmi les options suivantes :
  - `'always'` - Ne correspond qu'aux URL qui incluent un slash de fin (ex: "/foo/")
  - `'never'` - Ne correspond à aucune URL incluant un slash de fin (ex: "/foo")
  - `'ignore'` - Correspond aux URL qu'il existe ou non un "/" à la fin.

Utilisez cette option de configuration si votre hôte de production a une gestion stricte du fonctionnement ou du non-fonctionnement des slashs finaux.

Vous pouvez également le définir si vous préférez être vous-même plus strict, afin que les URL avec ou sans slash à la fin ne fonctionnent pas pendant le développement.

```js
{
  // Exemple: Exiger un slash final pendant le développement
  trailingSlash: 'always'
}
```
**Voir également :**
- buildOptions.format


### adapter

<p>

**Type:** `AstroIntegration`
</p>

Déployez-le sur votre serveur préféré, sans serveur ou hôte périphérique avec des adaptateurs de build. Importez l'un de nos adaptateurs pour [Netlify](/fr/guides/deploy/netlify/#adapter-for-ssredge), [Vercel](/fr/guides/deploy/vercel/#adapter-for-ssr), et plus encore pour activer Astro SSR.

[Voir notre guide de rendu côté serveur](/fr/guides/server-side-rendering/) pour en savoir plus sur le SSR, et [nos guides de déploiement](/fr/guides/deploy/) pour une liste complète d'hôtes.

```js
import netlify from '@astrojs/netlify/functions';
{
  // Exemple: Construire pour un déploiement sans serveur Netlify
	 adapter: netlify(),
}
```
**Voir également :**
- output


### output

<p>

**Type:** `'static' | 'server'`<br>
**Par défaut:** `'static'`
</p>

Spécifie la cible de sortie pour les builds.

- 'static' - Construire un site statique à déployer sur n’importe quel hôte statique.
- 'server' - Création d’une application à déployer sur un hôte prenant en charge le SSR (rendu côté serveur).

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static'
})
```
**Voir également :**
- adapter


## Options de build

### build.format

<p>

**Type:** `('file' | 'directory')`<br>
**Par défaut :** `'directory'`
</p>

Contrôlez le format de fichier de sortie de chaque page.
  - Si la valeur est 'file', Astro générera un fichier HTML (ex: "/foo.html") pour chaque page.
  - Si la valeur est 'directory', Astro générera un répertoire avec un fichier imbriqué `index.html` (ex: "/foo/index.html") pour chaque page.

```js
{
  build: {
    // Exemple: Générer `page.html` au lieu de `page/index.html` durant le build.
    format: 'file'
  }
}
```

#### Effets sur Astro.url
Le paramètre `build.format` contrôle ce à quoi `Astro.url` est défini pendant la compilation. Quand il est défini sur:
- `directory` - L'`Astro.url.pathname` inclura un slash pour imiter le comportement des dossiers; c.-à-d. `/foo/`.
- `file` - L'`Astro.url.pathname` inclura `.html`; c.-à-d. `/foo.html`.

Cela signifie que lorsque vous créez des URL relatives en utilisant `new URL('./relative', Astro.url)`, vous obtiendrez un comportement cohérent entre dev et build.


## Options de serveur

Personnalisez le serveur Astro dev, utilisé par `astro dev` et `astro preview`.

```js
{
  server: { port: 1234, host: true }
}
```

Pour définir une configuration différente basée sur la commande run ("dev", "preview") une fonction peut également être passée à cette option de configuration.

```js
{
  // Exemple: Utiliser la syntaxe de fonction pour personnaliser le serveur en fonction de la commande
  server: (command) => ({ port: command === 'dev' ? 3000 : 4000 })
}
```

### server.host

<p>

**Type:** `string | boolean`<br>
**Par défaut:** `false`<br>
<Since v="0.24.0" />
</p>

Définir les adresses IP réseau sur lesquelles le serveur doit écouter (c.-à-d. les adresses IP non locales).
- `false` - ne pas exposer sur une adresse IP réseau
- `true` - écouter toutes les adresses, y compris les adresses LAN et publiques
- `[custom-address]` - exposer sur une adresse IP réseau à `[custom-address]` (ex: `192.168.0.1`)


### server.port

<p>

**Type:** `number`<br>
**Par défaut:** `3000`
</p>

Définissez le port sur lequel le serveur doit écouter.

Si le port donné est déjà utilisé, Astro va automatiquement essayer le prochain port disponible.

```js
{
  server: { port: 8080 }
}
```


## Options de Markdown

### markdown.drafts

<p>

**Type:** `boolean`<br>
**Par défaut:** `false`
</p>

Contrôler si les pages de projet Markdown doivent être incluses dans la construction.

Une page Markdown est considérée comme un brouillon si elle inclut `draft: true` dans son avant-propos. Les brouillons de pages sont toujours inclus et visibles pendant le développement (`astro dev`) mais par défaut, ils ne seront pas inclus dans votre build final.

```js
{
  markdown: {
    // Exemple: Inclure tous les brouillons dans votre version finale
    drafts: true,
  }
}
```


### markdown.shikiConfig

<p>

**Type:** `Partial<ShikiConfig>`
</p>

Options de configuration Shiki. Voir [la documentation de configuration Markdown](/en/guides/markdown-content/#shiki-configuration) pour l'utilisation.


### markdown.syntaxHighlight

<p>

**Type:** `'shiki' | 'prism' | false`<br>
**Défaut:** `shiki`
</p>

Quel surligneur de syntaxe utiliser, le cas échéant.
- `shiki` - utiliser le surligneur [Shiki](https://github.com/shikijs/shiki)
- `prism` - utiliser le surligneur [Prism](https://prismjs.com/)
- `false` - ne pas appliquer la mise en évidence de la syntaxe.

```js
{
  markdown: {
    // Exemple: Passer à l’utilisation de prism pour la mise en évidence de la syntaxe dans Markdown
    syntaxHighlight: 'prism',
  }
}
```


### markdown.remarkPlugins

<p>

**Type:** `RemarkPlugins`
</p>

Passer un [plugin remark](https://github.com/remarkjs/remark) pour personnaliser la façon dont votre Markdown est construit. Vous pouvez importer et appliquer la fonction du plugin (recommandé), ou passer le nom du plugin comme une chaîne de caractère.

:::caution
Fournir une liste de plugins va **supprimer** nos plugins par défaut. Pour préserver ces valeurs par défaut, voir le drapeau `extendDefaultPlugins`.
:::

```js
{
  markdown: {
    remarkPlugins: [remarkToc]
  }
}
```


### markdown.rehypePlugins

<p>

**Type:** `RehypePlugins`
</p>

Pass [rehype plugins](https://github.com/remarkjs/remark-rehype) to customize how your Markdown's output HTML is processed. You can import and apply the plugin function (recommended), or pass the plugin name as a string.

:::caution
Providing a list of plugins will **remove** our default plugins. To preserve these defaults, see the `extendDefaultPlugins` flag.
:::

```js
import rehypeMinifyHtml from 'rehype-minify';
{
  markdown: {
    rehypePlugins: [rehypeMinifyHtml]
  }
}
```


### markdown.extendDefaultPlugins

<p>

**Type:** `boolean`<br>
**Default:** `false`
</p>

Astro applies the [GitHub-flavored Markdown](https://github.com/remarkjs/remark-gfm) and [Smartypants](https://github.com/silvenon/remark-smartypants) plugins by default. When adding your own remark or rehype plugins, you can preserve these defaults by setting the `extendDefaultPlugins` flag to `true`:

```js
{
  markdown: {
    extendDefaultPlugins: true,
		 remarkPlugins: [exampleRemarkPlugin],
    rehypePlugins: [exampleRehypePlugin],
  }
}
```


### markdown.remarkRehype

<p>

**Type:** `RemarkRehype`
</p>

Pass options to [remark-rehype](https://github.com/remarkjs/remark-rehype#api).

```js
{
  markdown: {
    // Example: Translate the footnotes text to another language, here are the default English values
    remarkRehype: { footnoteLabel: "Footnotes", footnoteBackLabel: "Back to content"},
  },
};
```


## Integrations

Extend Astro with custom integrations. Integrations are your one-stop-shop for adding framework support (like Solid.js), new features (like sitemaps), and new libraries (like Partytown and Turbolinks).

Read our [Integrations Guide](/en/guides/integrations-guide/) for help getting started with Astro Integrations.

```js
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
{
  // Example: Add React + Tailwind support to Astro
  integrations: [react(), tailwind()]
}
```

## Vite

Pass additional configuration options to Vite. Useful when Astro doesn't support some advanced configuration that you may need.

View the full `vite` configuration object documentation on [vitejs.dev](https://vitejs.dev/config/).

#### Examples

```js
{
  vite: {
    ssr: {
      // Example: Force a broken package to skip SSR processing, if needed
      external: ['broken-npm-package'],
    }
  }
}
```

```js
{
  vite: {
    // Example: Add custom vite plugins directly to your Astro project
    plugins: [myPlugin()],
  }
}
```

## Legacy Flags

To help some users migrate between versions of Astro, we occasionally introduce `legacy` flags.
These flags allow you to opt in to some deprecated or otherwise outdated behavior of Astro
in the latest version, so that you can continue to upgrade and take advantage of new Astro releases.

### legacy.astroFlavoredMarkdown

<p>

**Type:** `boolean`<br>
**Default:** `false`<br>
<Since v="1.0.0-rc.1" />
</p>

Enable Astro's pre-v1.0 support for components and JSX expressions in `.md` Markdown files.
In Astro `1.0.0-rc`, this original behavior was removed as the default, in favor of our new [MDX integration](/en/guides/integrations-guide/mdx/).

To enable this behavior, set `legacy.astroFlavoredMarkdown` to `true` in your [`astro.config.mjs` configuration file](/en/guides/configuring-astro/#the-astro-config-file).

```js
{
  legacy: {
    // Example: Add support for legacy Markdown features
    astroFlavoredMarkdown: true,
  },
}
```
