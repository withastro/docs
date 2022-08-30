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

Use this configuration option if your production host has strict handling of how trailing slashes work or do not work.

You can also set this if you prefer to be more strict yourself, so that URLs with or without trailing slashes won't work during development.

```js
{
  // Example: Require a trailing slash during development
  trailingSlash: 'always'
}
```
**See Also:**
- buildOptions.pageUrlFormat


### adapter

<p>

**Type:** `AstroIntegration`
</p>

Deploy to your favorite server, serverless, or edge host with build adapters. Import one of our first-party adapters for [Netlify](/en/guides/deploy/netlify/#adapter-for-ssredge), [Vercel](/en/guides/deploy/vercel/#adapter-for-ssr), and more to engage Astro SSR.

[See our Server-side Rendering guide](/en/guides/server-side-rendering/) for more on SSR, and [our deployment guides](/en/guides/deploy/) for a complete list of hosts.

```js
import netlify from '@astrojs/netlify/functions';
{
  // Example: Build for Netlify serverless deployment
	 adapter: netlify(),
}
```
**See Also:**
- output


### output

<p>

**Type:** `'static' | 'server'`<br>
**Default:** `'static'`
</p>

Specifies the output target for builds.

- 'static' - Building a static site to be deploy to any static host.
- 'server' - Building an app to be deployed to a host supporting SSR (server-side rendering).

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static'
})
```
**See Also:**
- adapter


## Build Options

### build.format

<p>

**Type:** `('file' | 'directory')`<br>
**Default:** `'directory'`
</p>

Control the output file format of each page.
  - If 'file', Astro will generate an HTML file (ex: "/foo.html") for each page.
  - If 'directory', Astro will generate a directory with a nested `index.html` file (ex: "/foo/index.html") for each page.

```js
{
  build: {
    // Example: Generate `page.html` instead of `page/index.html` during build.
    format: 'file'
  }
}
```


## Server Options

Customize the Astro dev server, used by both `astro dev` and `astro preview`.

```js
{
  server: { port: 1234, host: true}
}
```

To set different configuration based on the command run ("dev", "preview") a function can also be passed to this configuration option.

```js
{
  // Example: Use the function syntax to customize based on command
  server: (command) => ({ port: command === 'dev' ? 3000 : 4000 })
}
```

### server.host

<p>

**Type:** `string | boolean`<br>
**Default:** `false`<br>
<Since v="0.24.0" />
</p>

Set which network IP addresses the server should listen on (i.e. non-localhost IPs).
- `false` - do not expose on a network IP address
- `true` - listen on all addresses, including LAN and public addresses
- `[custom-address]` - expose on a network IP address at `[custom-address]` (ex: `192.168.0.1`)


### server.port

<p>

**Type:** `number`<br>
**Default:** `3000`
</p>

Set which port the server should listen on.

If the given port is already in use, Astro will automatically try the next available port.

```js
{
  server: { port: 8080 }
}
```


## Markdown Options

### markdown.drafts

<p>

**Type:** `boolean`<br>
**Default:** `false`
</p>

Control whether Markdown draft pages should be included in the build.

A Markdown page is considered a draft if it includes `draft: true` in its frontmatter. Draft pages are always included & visible during development (`astro dev`) but by default they will not be included in your final build.

```js
{
  markdown: {
    // Example: Include all drafts in your final build
    drafts: true,
  }
}
```


### markdown.shikiConfig

<p>

**Type:** `Partial<ShikiConfig>`
</p>

Shiki configuration options. See [the Markdown configuration docs](/en/guides/markdown-content/#shiki-configuration) for usage.


### markdown.syntaxHighlight

<p>

**Type:** `'shiki' | 'prism' | false`<br>
**Default:** `shiki`
</p>

Which syntax highlighter to use, if any.
- `shiki` - use the [Shiki](https://github.com/shikijs/shiki) highlighter
- `prism` - use the [Prism](https://prismjs.com/) highlighter
- `false` - do not apply syntax highlighting.

```js
{
  markdown: {
    // Example: Switch to use prism for syntax highlighting in Markdown
    syntaxHighlight: 'prism',
  }
}
```


### markdown.remarkPlugins

<p>

**Type:** `RemarkPlugins`
</p>

Pass a custom [Remark](https://github.com/remarkjs/remark) plugin to customize how your Markdown is built.

**Note:** Enabling custom `remarkPlugins` or `rehypePlugins` removes Astro's built-in support for [GitHub-flavored Markdown](https://github.github.com/gfm/) support and [Smartypants](https://github.com/silvenon/remark-smartypants). You must explicitly add these plugins to your `astro.config.mjs` file, if desired.

```js
{
  markdown: {
    // Example: The default set of remark plugins used by Astro
    remarkPlugins: ['remark-gfm', 'remark-smartypants'],
  },
};
```


### markdown.rehypePlugins

<p>

**Type:** `RehypePlugins`
</p>

Pass a custom [Rehype](https://github.com/remarkjs/remark-rehype) plugin to customize how your Markdown is built.

**Note:** Enabling custom `remarkPlugins` or `rehypePlugins` removes Astro's built-in support for [GitHub-flavored Markdown](https://github.github.com/gfm/) support and [Smartypants](https://github.com/silvenon/remark-smartypants). You must explicitly add these plugins to your `astro.config.mjs` file, if desired.

```js
{
  markdown: {
    // Example: The default set of rehype plugins used by Astro
    rehypePlugins: [],
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


