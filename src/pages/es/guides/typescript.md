---
layout: ~/layouts/MainLayout.astro
title: TypeScript
description: Aprende a usar TypeScript incorporado en Astro.
i18nReady: true
---

Astro tiene compatibilidad integrada con [TypeScript](https://www.typescriptlang.org/). Puedes importar archivos `.ts` y `.tsx` en tu proyecto de Astro, e incluso escribir código TypeScript directamente dentro del [componente de Astro](/es/core-concepts/astro-components/#script-de-un-componente).

Astro no realiza ninguna verificación de tipos por sí mismo. La verificación de tipos debe realizarse fuera de Astro, ya sea por el IDE o mediante un script separado. La [extensión de Astro VSCode](/es/editor-setup/) proporciona automáticamente sugerencias y errores de TypeScript en tus archivos abiertos.

## Configuración

Los *starter projects* de Astro incluyen un archivo `tsconfig.json` en tu proyecto. Incluso si no escribes código TypeScript, este archivo es importante para que herramientas como Astro y VS Code sepan cómo interpretar tu proyecto. Algunas características (como importaciones de paquetes npm) no están totalmente soportadas en el editor sin un archivo `tsconfig.json`. Si instalas Astro manualmente, asegúrate de crear este archivo por ti mismo.

Tres plantillas extensibles del archivo `tsconfig.json` están incluidas con Astro: `base`, `strict` y `strictest`. La plantilla `base` habilita el soporte para características modernas de JavaScript y también es usada como base para las otras plantillas. Recomendamos usar las plantillas `strict` o `strictest` si planeas escribir TypeScript en tu proyecto. Puedes ver y comparar las tres plantillas en [astro/tsconfigs/](https://github.com/withastro/astro/blob/main/packages/astro/tsconfigs/).

Para heredar una de las plantillas, usa [la opción `extends`](https://www.typescriptlang.org/tsconfig#extends):

```json title="tsconfg.json"
{
  "extends": "astro/tsconfig/base"
}
```

Adicionalmente, nuestras plantillas incluyen un archivo `env.d.ts` dentro de la carpeta `src` para proveer [tipos del cliente de Vite](https://vitejs.dev/guide/features.html#client-types) en tu proyecto:

```typescript title="env.d.ts"
/// <reference types="astro/client" />
```
Opcionalmente, puedes eliminar este archivo y en su lugar añadir la [configuración `types`](https://www.typescriptlang.org/tsconfig#types) en tu `tsconfig.json`:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "types": ["astro/client"]
  }
}
```

### Componentes de Frameworks

Si tu proyecto utiliza [componentes de otros framework](/es/core-concepts/framework-components/), es posible que se necesiten configuraciones adicionales dependiendo el framework utilizado. Por favor revisa la documentación de Typescript de tu framework para más información. ([Vue](https://vuejs.org/guide/typescript/overview.html#using-vue-with-typescript), [React](https://reactjs.org/docs/static-type-checking.html), [Preact](https://preactjs.com/guide/v10/typescript), [Solid](https://www.solidjs.com/guides/typescript))

## Importación de tipos

Usa importaciones y exportaciones explícitas de tipos siempre que sea posible.

```js del={1} ins={2} ins="type"
import { SomeType } from './script';
import type { SomeType } from './script';
```
Esto te ayudará a evitar casos extremos en los que el empaquetador de Astro intente empaquetar incorrectamente sus tipos importados como si fueran JavaScript.

En tu archivo `.tsconfig`, puedes indicarle a Typescript para que te ayude con esto. La [configuración `importsNotUsedAsValues`](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues) puede establecerse a `error`. Si lo haces, Typescript va a chequear tus importaciones e indicarte cuándo debes utilizar `import type`.

```json title="tsconfig.json" ins={3}
// tsconfig.json
{
  "compilerOptions": {
    "importsNotUsedAsValues": "error",
  }
}
```

## Aliases de importación

Astro es compatible con [aliases de importación](/es/guides/aliases/) definidos en la configuración `tsconfig.json` o `jsconfig.json` usando `paths`. [Lee nuestra guía](/es/guides/aliases/) para saber más.


```astro title="src/pages/about/nate.astro" "@components" "@layouts"
---
import HelloWorld from '@components/HelloWorld.astro';
import Layout from '@layouts/Layout.astro';
---
```

```json title="tsconfig.json" {5-6}
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"]
    }
  }
}
```

## Props de componentes

Astro soporta escribir las props de los componentes de Astro en TypeScript. Para habilitarlo, exporta una interfaz TypeScript `Props` desde tu componente de Astro. La [extensión de Astro VSCode](/es/editor-setup/) buscará automáticamente la exportación de `Props` y te brindará el autocompletado adecuado de TS cuando uses ese componente dentro de otra plantilla.

```astro title="src/components/HelloProps.astro" ins={2-5}
---
export interface Props {
  name: string;
  greeting?: string;
}
const { greeting = 'Hello', name } = Astro.props;
---
<h2>{greeting}, {name}!</h2>
```

### Tipos en atributos incorporados

Astro provee definiciones de tipos en JSX para verificar si estás utilizando atributos HTML válidos en tu código. Puedes usar estos tipos para construir props de componentes. Por ejemplo, si estás creando un componente `<Link>`, puedes hacer lo siguiente para emular los atributos HTML por defecto en los tipos de props del componente.

```astro title="src/components/Link.astro" ins={2}
---
export type Props = astroHTML.JSX.AnchorHTMLAttributes;
const { href, ...attrs } = Astro.props;
---
<a {href} {...attrs}>
  <slot />
</a>
```

También es posible extender las definiciones de JSX por defecto para agregar atributos no estándar, redeclarando el namespace `astroHTML.JSX` en un archivo `.d.ts`.

```ts
// src/custom-attributes.d.ts

declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    'data-count'?: number;
    'data-label'?: string;
  }
}
```

:::note
`astroHTML` es inyectado de manera global en los componentes `.astro`. Para usarlo en archivos de TypeScript, utiliza una [directiva de triple barra](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html):

```ts
/// <reference types="astro/astro-jsx" />

type MyAttributes = astroHTML.JSX.ImgHTMLAttributes;
```
:::

## Verificación de tipos

Para ver errores de tipos en tu editor, asegúrate de tener instalada la [extensión de Astro VS Code](/es/editor-setup/). Ten en cuenta que los comandos `astro start` y `astro build` transpilarán el código con esbuild, pero no ejecutarán ninguna verificación de tipos. Para evitar que tu código se compile si contiene errores de TypeScript, cambia tu script de "compilación" en `package.json` a lo siguiente:

```json title="package.json" del={2} ins={3} ins="astro check && tsc --noEmit && "
  "scripts": {
    "build": "astro build",
    "build": "astro check && tsc --noEmit && astro build",
  },
```

:::note
`astro check` solo verifica los tipos dentro de los archivos `.astro`, y `tsc --noEmit` solo verifica los tipos dentro de los archivos `.ts` y `.tsx`. Para chequeo de tipos dentro de archivos de Svelte y Vue, puedes usar los paquetes [`svelte-check`](https://www.npmjs.com/package/svelte-check) y [`vue-tsc`](https://www.npmjs.com/package/vue-tsc) respectivamente.
:::

📚 Lee más sobre las [importaciones de archivos `.ts`](/es/guides/imports/#typescript) en Astro.
📚 Lee más sobre la [configuración de TypeScript](https://www.typescriptlang.org/tsconfig/).

## Solución de problemas

### Errores usando múltiples frameworks JSX a la vez

Puedes tener errores al utilizar múltiples frameworks JSX en el mismo proyecto, ya que cada framework requiere diferentes, y algunas veces, conflictivas configuraciones dentro del archivo `tsconfig.json.`

**Solución**: Establece la [configuración `jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource) a `react` (por defecto), `preact` o `solid-js` dependiendo cuál sea el framework más utilizado. Luego, usa un [comentario pragma](https://www.typescriptlang.org/docs/handbook/jsx.html#configuring-jsx) dentro de cada archivo conflictivo de un framework distinto al establecido anteriormente.

Para la configuración por defecto `jsxImportSource: react`, deberías hacer lo siguiente:

```jsx
// Para Preact
/** @jsxImportSource preact */

// Para Solid
/** @jsxImportSource solid-js */
```

### Componentes de Vue son erróneamente tipados al instalar el paquete `@types/react`

Las definiciones de tipos del paquete `@types/react` son declaradas de forma global y por lo tanto son usadas para chequear tipos en los archivos `.vue` al usar [Volar](https://github.com/johnsoncodehk/volar).

**Estado**: Comportamiento esperado.

**Solución**: Aún no hay una forma confiable de solucionar este error, sin embargo, algunas soluciones y discusiones pueden encontrarse en [esta discusión en GitHub](https://github.com/johnsoncodehk/volar/discussions/592).
