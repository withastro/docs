---
layout: ~/layouts/MainLayout.astro
title: Estilos & CSS
description: Aprenda a estilar componentes de Astro.
i18nReady: true
setup: |
  import Since from '../../../components/Since.astro';
---

Astro fue diseñado para que estilar y escribir CSS sea pan comido. Escribe tu propio CSS directamente dentro de un componente de Astro o importa tu biblioteca de CSS favorita como [Tailwind][tailwind]. También es compatible con lenguajes de estilo avanzados como [Sass][sass] y [Less][less].

## Estilando en Astro

Estilar un componente de Astro es tan fácil como agregar una etiqueta `<style>` a tu componente o plantilla de página. Cuando colocas una etiqueta `<style>` dentro de un componente de Astro, Astro detectará el CSS e incluirá tus estilos automáticamente.

```astro
<style>
  h1 { color: red; }
</style>
```

### Estilos locales

Las reglas de CSS en Astro `<style>` tienen **un alcance local de forma predeterminada**. Los estilos con alcance local se compilan para que solo se apliquen al HTML escrito dentro de ese mismo componente. El CSS escrito dentro de un componente de Astro se encapsula automáticamente dentro del mismo.

```diff
<style>
-  h1 { color: red; }
+  h1.astro-HHNQFKH6 { color: red; }
-  .text { color: blue; }
+  .text.astro-HHNQFKH6 { color: blue; }
</style>
```

Los estilos locales no se filtran y no afectarán al resto de tu sitio web. En Astro, está bien usar selectores de baja especificidad como `h1 {}` o `p {}` porque se compilarán con alcance local en el resultado final.

Los estilos locales tampoco se aplicarán a otros componentes de Astro contenidos dentro del maquetado. Si necesitas estilar un componente hijo, considera envolver ese componente en un `<div>` (u otro elemento) que luego puedas estilar.

#### Estilos globales

Si bien recomendamos estilos locales para la mayoría de los componentes, eventualmente puedes encontrar una razón válida para escribir CSS global. Puedes desactivar el CSS con alcance local predeterminado con el atributo `<style is:global>`.

```html
<style is:global>
  /* Global, entregada tal como está al navegador.
     Se aplica a todas las etiquetas <h1> de su sitio web. */
  h1 { color: red; }
</style>
```

También puedes mezclar reglas de CSS globales y locales en la misma etiqueta `<style>` usando el selector `:global()`. Esto se convierte en un patrón poderoso para aplicar estilos CSS a los elementos hijos de tu componente.

```astro
<style>
  /* Con alcance solo a este componente */
  h1 { color: red; }
  /* Mixta: se aplica solo a los elementos `h1` hijos. */
  article :global(h1) {
    color: blue;
  }
</style>
<h1>Title</h1>
<article><slot /></article>
```

Esta es una excelente manera de estilar cosas como artículos de blog o documentos con contenido basado en CMS donde el contenido vive fuera de Astro. Pero tenga cuidado: los problemas relacionados a componentes cuyo estilo depende del componente padre pueden volverse difíciles de solucionar.

Los estilos locales deben usarse con la mayor frecuencia posible. Los estilos globales deben usarse solo cuando sea necesario.

### Variables de CSS

<Since v="0.21.0" />

La etiqueta `<style>` de Astro puede hacer referencia a cualquier variable CSS disponible en la página. También puede pasar variables CSS directamente desde el frontmatter de su componente usando la directiva `define:vars`.

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
<h1>Hola</h1>
```

📚 Consulta nuestra página de [referencia de directivas](/es/reference/directives-reference/#definevars) para obtener más información sobre `define:vars`.

## Estilos externos

Hay dos formas de resolver hojas de estilo globales externas: la primera es usando una importación ESM para archivos ubicados dentro de `src/`, y la segunda es usando la URL absoluta para archivos ubicados en la carpeta `public/`, o alojados fuera de su proyecto.

📚 Lea más sobre el uso de [archivos estáticos](/es/guides/imports/) ubicados en `public/` o `src/`.

### Importando una hoja de estilo local

:::caution[¿Usando un paquete npm?]
Es posible que deba actualizar el archivo `astro.config` al importar CSS desde paquetes npm. Consulte la sección ["importando hojas de estilo desde un paquete npm"](#importando-una-hoja-de-estilos-desde-un-paquete-npm) a continuación.
:::

Puedes importar hojas de estilo en el script de tu componente de Astro utilizando la sintaxis de importación ESM. Las importaciones de CSS funcionan como [cualquier otra importación ESM en un componente de Astro](/es/core-concepts/astro-components/#script-del-componente), deben referenciarse usando **la ruta relativa al componente** y deben estar escritos en la **parte superior** del script de su componente, con cualquier otra importación.

```astro
---
// Astro empaquetará y optimizará este CSS automáticamente
// Esto también funciona para archivos de pre-procesadores como .scss, .styl, etc.
import '../styles/utils.css';
---
<html><!-- Tu página aquí --></html>
```

La "importación" de CSS a través de ESM es compatible con cualquier archivo JavaScript, incluidos los componentes JSX como React y Preact. Esto puede ser útil para escribir estilos granulares por componente para tus componentes de React.

### Importando una hoja de estilos desde un paquete npm

Es posible que también necesites cargar hojas de estilos desde un paquete npm externo. Esto es especialmente común para utilidades como [Open Props](https://open-props.style/). Si tu paquete **recomienda usar una extensión de archivo** (es decir, `package-name/styles.css` en lugar de `package-name/styles`), esto debería funcionar como cualquier hoja de estilo local:

```astro
---
// src/pages/random-page.astro
import 'package-name/styles.css';
---
<html><!-- Tu página aquí --></html>
```

Si tu paquete **_no_ sugiere usar una extensión de archivo** (es decir, `package-name/styles`), ¡primero deberás actualizar tu configuración de Astro!

Digamos que estás importando un archivo CSS desde `package-name` llamado `normalize` (con la extensión de archivo omitida). Para asegurarnos de que podamos pre-renderizar tu página correctamente, agregue `package-name` a [al array `vite.ssr.noExternal`] (https://vitejs.dev/config/#ssr-noexternal):

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

:::note
Esta es una [configuración específica de Vite](https://vitejs.dev/config/#ssr-noexternal) que _no_ se relaciona con (ni requiere) [Astro SSR](/es/guides/server-side-rendering/ ).
:::

Ahora, puedes importar `package-name/normalize`. Esto será incluido y optimizado por Astro como cualquier otra hoja de estilos local.

```astro
---
// src/pages/random-page.astro
import 'package-name/normalize';
---
<html><!-- Tu página aquí --></html>
```

### Cargue una hoja de estilos a través de etiquetas de "link"

También puedes usar la etiqueta `<link>` para cargar una hoja de estilos en la página. Esta deberá ser una ruta URL absoluta a un archivo CSS ubicado en la carpeta `/public`, o una URL a un sitio web externo. Los valores href relativos en `<link>` no son compatibles.

```html
<head>
  <!-- Local: /public/styles/global.css -->
  <link rel="stylesheet" href="/styles/global.css" />
  <!-- Externo  -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.24.1/themes/prism-tomorrow.css">
</head>
```

Debido a que este método utiliza la carpeta `public/`, este se salta el procesamiento, la agrupación y las optimizaciones de CSS que proporciona Astro. Si necesitas estas transformaciones, utilice el método anterior [importando una hoja de estilo local](#importando-una-hoja-de-estilo-local).

## Integraciones CSS

¡Astro viene con soporte para agregar bibliotecas, herramientas y frameworks de CSS populares a tu proyecto como [Tailwind][tailwind] y más!

📚 Consulte la [guía de integraciones](/es/guides/integrations-guide/) para obtener instrucciones sobre cómo instalar, importar y configurar estas integraciones.

## Preprocesadores CSS

Astro es compatible con preprocesadores de CSS como [Sass][sass], [Stylus][stylus] y [Less][less] usando [Vite][vite-preprocessors].

### Sass

 ```
 npm install -D sass
 ```

Use  `<style lang="scss">` o `<style lang="sass">` en los archivos `.astro`.

### Stylus

```
npm install -D stylus
```

Use  `<style lang="styl">` o `<style lang="stylus">` en los archivos `.astro`.

### Less

```
npm install -D less
```

Use  `<style lang="less">` en los archivos `.astro`.

### En componentes de framework

¡También puedes usar todos los pre-procesadores de CSS anteriores dentro de los frameworks de JS! Asegúrese de seguir los patrones que recomienda cada framework:

- **React** / **Preact**: `import Styles from './styles.module.scss'`;
- **Vue**: `<style lang="scss">`
- **Svelte**: `<style lang="scss">`

## PostCSS

Astro viene con PostCSS incluido como parte de [Vite](https://vitejs.dev/guide/features.html#postcss). Para configurar PostCSS para tu proyecto, crea un archivo `postcss.config.js` en la raíz del proyecto. Puede importar complementos usando `require()` después de instalarlos (por ejemplo, `npm i autoprefixer`).

```js
// ./postcss.config.js

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano'),
  ],
};
```


---

## Frameworks y librerías

### 📘 React / Preact

Los archivos `.jsx` son compatibles con los módulos CSS y CSS globales. Para habilitar este último, use la extensión `.module.css` (o `.module.scss`/`.module.sass` si usa Sass).

```js
import './global.css'; // incluye CSS global
import Styles from './styles.module.css'; // Utilice módulos CSS (debe terminar en `.module.css`, `.module.scss` o `.module.sass`!)
```

### 📗 Vue

Vue en Astro es compatible con los mismos métodos que `vue-loader`:

- [vue-loader - Scoped CSS][vue-scoped]
- [vue-loader - CSS Modules][vue-css-modules]

### 📕 Svelte

Svelte en Astro también funciona exactamente como se esperaba: [Svelte Styling Docs][svelte-style].

## Advanced

:::caution
¡Tenga cuidado al omitir el empaquetado de CSS incorporado de Astro! Los estilos no se incluirán automáticamente en la compilación final y es tu responsabilidad asegurarte de que el archivo al que se hace referencia se incluya correctamente en la página final.
:::

### `?raw` Importaciones de CSS

Para casos avanzados, el CSS se puede leer directamente desde el disco sin que Astro lo empaquete ni lo optimice. Esto puede ser útil cuando necesita un control completo sobre algún fragmento de CSS y necesitas omitir el procesamiento automático de CSS de Astro.

Esto no es recomendable para la mayoría de los usuarios.

```astro
---
// ¡Ejemplo avanzado! No recomendado para la mayoría de los usuarios.
import rawStylesCSS from '../styles/main.css?raw';
---
<style is:inline set:html={rawStylesCSS}></style>
```

Consulte la [documentación de Vite](https://vitejs.dev/guide/assets.html#importing-asset-as-url) para obtener más detalles.

### `?url` Importaciones de CSS

Para casos de uso avanzado, puedes importar una URL de referencia directa a un archivo CSS dentro de la carpeta `src/` de tu proyecto. Esto puede ser útil cuando necesitas un control completo sobre cómo se carga del CSS en la página. Sin embargo, esto evitará la optimización del CSS con el resto de la página.

Esto no es recomendable para la mayoría de los usuarios. En su lugar, coloque los archivos CSS dentro de `public/` para obtener una ruta de URL.

:::caution
Importar un archivo CSS más pequeño con `?url` puede devolver el contenido codificado en base64 como una URL de datos en la compilación final. Escriba su código para que sea compatible con datos codificados (`data:text/css;base64,...`) o configure [`vite.build.assetsInlineLimit`](https://vitejs.dev/config/#build-assetsinlinelimit) la opción de configuración a `0` para deshabilitar esta característica.
:::

```astro
---
// ¡Ejemplo avanzado! No recomendado para la mayoría de los usuarios.
import stylesUrl from '../styles/main.css?url';
---
<link rel="preload" href={stylesUrl} as="style">
<link rel="stylesheet" href={stylesUrl}>
```

Consulte la [documentación de Vite](https://vitejs.dev/guide/assets.html#importing-asset-as-url) para obtener más detalles.

[less]: https://lesscss.org/
[sass]: https://sass-lang.com/
[stylus]: https://stylus-lang.com/
[svelte-style]: https://svelte.dev/docs#component-format-style
[tailwind]: https://github.com/withastro/astro/tree/main/packages/integrations/tailwind
[vite-preprocessors]: https://vitejs.dev/guide/features.html#css-pre-processors
[vue-css-modules]: https://vue-loader.vuejs.org/guide/css-modules.html
[vue-scoped]: https://vue-loader.vuejs.org/guide/scoped-css.html
