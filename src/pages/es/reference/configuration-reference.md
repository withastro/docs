---
layout: ~/layouts/MainLayout.astro
title: Referencia de configuración
i18nReady: true
setup: |
  import Since from '../../../components/Since.astro';
---

La siguiente referencia cubre todas las opciones de configuración compatibles en Astro. Para obtener más información sobre la configuración de Astro, lea nuestra guía sobre [configuración de Astro](/es/guides/configuración-de-astro/).

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // tus opciones de configuración aquí...
})
```

## Opciones de nivel superior

### root

<p>

**Tipo:** `string`<br>
**CLI:** `--root`<br>
**Por defecto:** `"."` (carpeta de trabajo actual)
</p>

Solo debes proporcionar esta opción si ejecutas los comandos CLI `astro` en una carpeta que no sea la carpeta raíz del proyecto. Por lo general, esta opción se proporciona a través de la CLI en lugar del [archivo de configuración de Astro](/es/guides/configuring-astro/#tipos-de-archivo-de-configuración-compatibles), ya que Astro necesita conocer la raíz de su proyecto antes de que pueda localizar su archivo de configuración.

Si proporciona una ruta relativa (p. ej., `--root: './my-project'`), Astro la resolverá en su directorio de trabajo actual.

#### Ejemplos

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

**Tipo:** `string`<br>
**Por defecto:** `"./src"`
</p>

Establece la carpeta desde el cual Astro leerá tu proyecto.

El valor puede ser una ruta absoluta del sistema de archivos o una ruta relativa a la raíz del proyecto.

```js
{
  srcDir: './www'
}
```

### publicDir

<p>

**Tipo:** `string`<br>
**Por defecto:** `"./public"`
</p>

Establece la carpeta para los activos estáticos. Los archivos en esta carpeta se sirven desde `/` durante el desarrollo y se copian en la carpeta de compilación durante la compilación. Estos archivos siempre se sirven o se copian tal cual, sin transformación ni empaquetamiento.

El valor puede ser una ruta absoluta del sistema de archivos o una ruta relativa a la raíz del proyecto.

```js
{
  publicDir: './my-custom-publicDir-directory'
}
```

### outDir

<p>

**Tipo:** `string`<br>
**Por defecto:** `"./dist"`
</p>

Establece la carpeta en la que `astro build` escribe la compilación final.

El valor puede ser una ruta absoluta del sistema de archivos o una ruta relativa a la raíz del proyecto.

```js
{
  outDir: './my-custom-build-directory'
}
```

### site

<p>

**Tipo:** `string`
</p>

La URL final donde se desplegará. Astro usa esta URL completa para generar su sitemap y URL canónicas en la compilación final. Se recomienda enfáticamente que establezca esta configuración para aprovechar al máximo Astro.

```js
{
  site: 'https://www.my-site.dev'
}
```

### base

<p>

**Tipo:** `string`
</p>

La ruta base en la que se desplegará. Astro coincidirá esta ruta durante el desarrollo para que tu experiencia de desarrollo coincida con el entorno de desarrollo lo más cercano posible. En el siguiente ejemplo, `astro dev` iniciará el servidor en `/docs`.

```js
{
  base: '/docs'
}
```

### trailingSlash

<p>

**Tipo:** `'always' | 'never' | 'ignore'`<br>
**Por defecto:** `'ignore'`
</p>

Establece el comportamiento de coincidencia de rutas del servidor de desarrollo. Elija entre las siguientes opciones:
   - `'always'`: solo coincide con las URL que incluyen una barra inclinada al final (por ejemplo: "/foo/")
   - `'never'`: nunca haga coincidir las URL que incluyen una barra inclinada al final (por ejemplo: "/foo")
   - `'ignore'`: coincide con las URL independientemente de si existe un "/" final

Utilice esta opción de configuración si tu host de producción tiene un manejo estricto de cómo funcionan o no las barras inclinadas finales.

También puedes configurar esto si prefieres ser más estricto, de modo que las URL con o sin barras diagonales finales no funcionen durante el desarrollo.

```js
{
  // Ejemplo: Requiere una barra inclinada final durante el desarrollo
  trailingSlash: 'always'
}
```

**Vea también:**
- buildOptions.pageUrlFormat

## Build Options

### build.format

<p>

**Tipo:** `('file' | 'directory')`<br>
**Por defecto:** `'directory'`
</p>

Controle el formato del archivo compilado de cada página.
  - Si es 'file', Astro generará un archivo HTML (por ejemplo: "/foo.html") para cada página.
  - Si es 'directory', Astro generará un directorio con un archivo `index.html` anidado (por ejemplo: "/foo/index.html") para cada página.

```js
{
  build: {
    // Ejemplo: Genere `page.html` en lugar de `page/index.html` durante la compilación.
    format: 'file'
  }
}
```

## Server Options

Personalice el servidor de desarrollo de Astro, utilizado tanto por `astro dev` como por `astro preview`.

```js
{
  server: { port: 1234, host: true}
}
```

Para establecer una configuración diferente basada en el comando ejecutar ("dev", "preview"), también se puedes pasar una función a esta opción de configuración.

```js
{
  // Ejemplo: use una función para personalizar según el comando
  server: (command) => ({ port: command === 'dev' ? 3000 : 4000 })
}
```

### server.host

<p>

**Tipo:** `string | boolean`<br>
**Por defecto:** `false`<br>
<Since v="0.24.0" />
</p>

Establezca en qué direcciones de IP el servidor debe escuchar (es decir, direcciones IP no locales).
- `false` - no exponer una dirección IP
- `true` - escuchar todas las direcciones, incluidas LAN y direcciones públicas
- `[dirección personalizada]` - exponer una dirección IP en `[dirección personalizada]` (por ejemplo, `192.168.0.1`)

### server.port

<p>

**Tipo:** `number`<br>
**Por defecto:** `3000`
</p>

Establezca en qué puerto debe escuchar el servidor.

Si el puerto dado ya está en uso, Astro probará automáticamente el siguiente puerto disponible.

```js
{
  server: { port: 8080 }
}
```

## Opciones de Markdown

### markdown.drafts

<p>

**Tipo:** `boolean`<br>
**Por defecto:** `false`
</p>

Controle si las páginas de borrador de Markdown deben incluirse en la compilación.

Una página de Markdown se considera un borrador si incluye `draft: true` en en frontmatter. Las páginas de borrador siempre se incluyen y son visibles durante el desarrollo (`astro dev`), pero de forma predeterminada no se incluirán en su compilación final.

```js
{
  markdown: {
    // Ejemplo: Incluya todos los borradores en su compilación final
    drafts: true,
  }
}
```

### markdown.mode

<p>

**Tipo:** `'md' | 'mdx'`<br>
**Por defecto:** `mdx`
</p>

Controle si el procesamiento de Markdown se realiza mediante MDX o no.

El procesamiento MDX te permite usar JSX dentro de sus archivos Markdown. Sin embargo, puede haber instancias en las que no desees este comportamiento y prefieras usar un procesador Markdown "vanilla". Este campo le permite controlar ese comportamiento.

```js
{
  markdown: {
    // Ejemplo: usar un procesador que no sea MDX para archivos Markdown
    mode: 'md',
  }
}
```

### markdown.shikiConfig

<p>

**Tipo:** `Partial<ShikiConfig>`
</p>

Opciones de configuración de Shiki. Consulte [la documentación de configuración de Markdown](/es/guides/markdown-content/#configuración-de-shiki) para conocer su uso.

### markdown.syntaxHighlight

<p>

**Tipo:** `'shiki' | 'prism' | false`<br>
**Por defecto:** `shiki`
</p>

Qué resaltador de sintaxis usar, si lo hay.
- `shiki` - usa el resaltador [Shiki](https://github.com/shikijs/shiki)
- `prism` - usa el resaltador [Prism](https://prismjs.com/)
- `false` - no aplicar resaltado de sintaxis.

```js
{
  markdown: {
    // Ejemplo: Cambia el resaltado de sintaxis a prism en Markdown
    syntaxHighlight: 'prism',
  }
}
```

### markdown.remarkPlugins

<p>

**Tipo:** `RemarkPlugins`
</p>

Pase un plugin de [Remark](https://github.com/remarkjs/remark) para personalizar la construcción del Markdown.

**Nota:** Habilitar `remarkPlugins` o `rehypePlugins` personalizados elimina el soporte integrado de Astro con [GitHub-flavored Markdown](https://github.github.com/gfm/) y [Smartypants](https://github.com/silvenon/remark-smartypants). Debes agregar explícitamente estos complementos a el archivo `astro.config.mjs`, si lo deseas.

```js
{
  markdown: {
    // Ejemplo: conjunto predeterminado de plugins de remark utilizados por Astro
    remarkPlugins: ['remark-gfm', 'remark-smartypants'],
  },
};
```

### markdown.rehypePlugins

<p>

**Tipo:** `RehypePlugins`
</p>

Pase un plugin de [Rehype](https://github.com/remarkjs/remark-rehype) para personalizar la construcción del Markdown.

**Nota:** Habilitar `remarkPlugins` o `rehypePlugins` personalizados elimina el soporte integrado de Astro con [GitHub-flavored Markdown](https://github.github.com/gfm/) y [Smartypants](https://github.com/silvenon/remark-smartypants). Debes agregar explícitamente estos complementos a el archivo `astro.config.mjs`, si lo deseas.

```js
{
  markdown: {
    // Ejemplo: conjunto predeterminado de plugins de rehype utilizados por Astro
    rehypePlugins: [],
  },
};
```

## Adaptador

Despliegue a tu servidor favorito, serverless o edge con adaptadores de compilación. Importe uno de nuestros adaptadores propios para [Netlify](/es/guides/deploy/netlify/#adapter-for-ssredge), [Vercel](/es/guides/deploy/vercel/#adapter-for-ssr) , y más para usar Astro SSR.

[Consulte nuestra guía de renderizado en el servidor](/es/guides/server-side-rendering/) para obtener más información sobre SSR, y [nuestras guías de implementación](/es/guides/deploy/) para obtener una lista completa de hosts.

```js
import netlify from '@astrojs/netlify/functions';
{
  // Ejemplo: Compilación para el despliegue serverless de Netlify
	 adapter: netlify(),
}
```

## Integrations

Extienda Astro con integraciones personalizadas. Las integraciones sirven para agregar soporte a framreworks (como Solid.js), nuevas funciones (sitemaps) y nuevas bibliotecas (como Partytown y Turbolinks).

Lea nuestra [guía de integraciones](/es/guides/integrations-guide/) para obtener ayuda para comenzar con integraciones de Astro.

```js
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
{
  // Ejemplo: Agrega compatibilidad con React + Tailwind a Astro
  integrations: [react(), tailwind()]
}
```

## Vite

Pase opciones de configuración adicionales a Vite. Útil cuando Astro no admite alguna configuración avanzada que pueda necesitar.

Vea la documentación completa del objeto de configuración `vite` en [vitejs.dev](https://vitejs.dev/config/).

#### Ejemplos

```js
{
  vite: {
    ssr: {
      // Ejemplo: obliga a un paquete roto a omitir el procesamiento de SSR, si es necesario
      external: ['broken-npm-package'],
    }
  }
}
```

```js
{
  vite: {
    // Ejemplo: agregue plugins de vite personalizados directamente a tu proyecto de Astro
    plugins: [myPlugin()],
  }
}
```
