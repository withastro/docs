---
layout: ~/layouts/MainLayout.astro
title: TypeScript
description: Aprenda a usar TypeScript incorporado en Astro.
i18nReady: true
---

Astro tiene compatibilidad integrada con [TypeScript](https://www.typescriptlang.org/). Puedes importar archivos `.ts` y `.tsx` en tu proyecto de Astro, e incluso escribir código TypeScript directamente dentro del [componente de Astro](/es/core-concepts/astro-components/#script-del-componente).

Astro no realiza ninguna verificación de tipos por sí mismo. La verificación de tipos debe realizarse fuera de Astro, ya sea por el IDE o mediante un script separado. La [extensión de Astro VSCode](/es/editor-setup/) proporciona automáticamente sugerencias y errores de TypeScript en tus archivos abiertos.

## Configuración

Se **recomienda encarecidamente** que cree un archivo `tsconfig.json` en su proyecto, para que las herramientas como Astro y VSCode sepan interpretar tu proyecto. Algunas funcionalidades (como las importaciones de paquetes npm) no son totalmente compatibles con TypeScript a menos que crees un archivo `tsconfig.json`.

Algunas opciones de configuración de TypeScript requieren atención especial en Astro. A continuación le recomendamos un archivo `tsconfig.json` básico, que puedes copiar y pegar en tu proyecto. Cada [plantilla en astro.new](https://astro.new/) incluye este archivo `tsconfig.json` por defecto.

```json
// Ejemplo: tsconfig.json básico para sus proyectos de Astro
{
  "compilerOptions": {
    // Habilita top-level await y otras funciones modernas de ESM.
    "target": "ESNext",
    "module": "ESNext",
    // Habilita la resolución de módulos al estilo de node, para cosas como importaciones de paquetes npm.
    "moduleResolution": "node",
    // Habilita las importaciones de JSON.
    "resolveJsonModule": true,
    // Habilita una transpilación más estricta para obtener mejores resultados.
    "isolatedModules": true,
    // Agrega definiciones de tipo para nuestro motor de ejecución Vite.
    "types": ["vite/client"],
    // Indica a TypeScript dónde guardar los archivos compilados
    "outDir": "./dist"
  }
}
```

## Importación de tipos

Use importaciones y exportaciones de tipos siempre que sea posible. Esto lo ayudará a evitar casos extremos en los que el empaquetador de Astro intente empaquetar incorrectamente sus tipos importados como si fueran JavaScript.

```diff
- import { SomeType } from './script';
+ import type { SomeType } from './script';
```

## Aliases de importación

Astro es compatible con [aliases de importación](/es/guides/aliases/) definidos en la configuración `tsconfig.json` o `jsconfig.json` usando `paths`. [Lea nuestra guía](/es/guides/aliases/) para saber más.

```ts
import HelloWorld from '@components/HelloWorld.astro';
import Layout from '@layouts/Layout.astro';
```

```json
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

Astro soporta escribir las props de los componentes de Astro en TypeScript. Para habilitarlo, exporte una interfaz TypeScript `Props` desde tu componente de Astro. La [extensión de Astro VSCode](/es/editor-setup/) buscará automáticamente la exportación de `Props` y le brindará el autocompletado adecuado de TS cuando use ese componente dentro de otra plantilla.

```astro
---
// Ejemplo: HelloWorld.astro
export interface Props {
  name: string;
  greeting?: string;
}
const { greeting = 'Hello', name } = Astro.props
---
<h2>{greeting}, {name}!</h2>
```

## Verificación de tipos

Para ver errores de tipos en tu editor, asegúrese de tener instalada la [extensión de Astro VS Code](/es/editor-setup/). Tenga en cuenta que los comandos `astro start` y `astro build` transpilarán el código con esbuild, pero no ejecutarán ninguna verificación de tipos. Para evitar que su código se compile si contiene errores de TypeScript, cambie su script de "compilación" en `package.json` a lo siguiente:

```diff
-    "build": "astro build",
+    "build": "astro check && tsc --noEmit && astro build",
```

:::note
`astro check` solo verifica los tipos dentro de los archivos `.astro`, y `tsc --noEmit` solo verifica los tipos dentro de los archivos `.ts` y `.tsx`.
:::

📚 Lea más sobre las [importaciones de archivos `.ts`](/es/guides/imports/#typescript) en Astro.

📚 Lea más sobre la [configuración de TypeScript](https://www.typescriptlang.org/tsconfig/).
