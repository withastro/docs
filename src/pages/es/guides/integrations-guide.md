---
layout: ~/layouts/MainLayout.astro
setup: |
  import Badge from '~/components/Badge.astro';
title: Usando integraciones
i18nReady: true
---

Las **integraciones de Astro** agregan nuevas funcionalidades a su proyecto con solo unas pocas líneas de código. Escribe una integración personalizada o usa las integraciones más populares de [npm](https://www.npmjs.com/search?q=keywords%3Aastro-component&ranking=popularity).

- Desbloquee React, Vue, Svelte, Solid y otros frameworks populares.
- Integre herramientas como Tailwind y Partytown con unas pocas líneas de código.
- Agregue nuevas funcionalidades a su proyecto, como la generación automática de sitemaps.
- Escriba código personalizado que se conecte con el proceso de compilación, el entorno de desarrollo y más.

:::note[Estado experimental]
Solo las integraciones oficiales (publicadas con el prefijo `@astrojs/` en npm) son actualmente compatibles por defecto para proteger a los usuarios de cambios en la API.

**Para habilitar integraciones de terceros:** Ejecute Astro con la extensión `--experimental-integrations`, o incluya `experimental: {integrations: true}` en su archivo de configuración de Astro.
:::

## Tutorial: Agregue React a su proyecto

En este ejemplo, usaremos la integración `@astrojs/react` para hacer que React sea compatible con su proyecto de Astro. El proceso para agregar cualquier otro framework (Preact, Vue, Svelte o Solid.js) es idéntico y se pueden usar los mismos pasos que se describen a continuación.

:::tip[Método rápido]
¡Astro ofrece el comando `astro add` para automatizar este proceso para todas las integraciones oficiales! En lugar de seguir los siguientes pasos, puedes ejecutar `npx astro add react`. ¡Eso es todo!

Vaya a [configuración de integración automática](/es/guides/integrations-guide/#configuración-de-integración-automática) para obtener más detalles.
:::

Primero, deberá instalar tanto la integración como cualquier paquete relacionado al paquete que desee usar en su proyecto. Para React, eso significa instalar las integraciones `@astrojs/react` ***y*** los paquetes `react` + `react-dom`.

```bash
npm install --save-dev @astrojs/react
```

Una vez que se hayan instalado sus paquetes, agregue dos nuevas líneas a su archivo de configuración del proyecto `astro.config.mjs`.

```diff
  // astro.config.mjs
  import { defineConfig } from 'astro/config';
+ import react from '@astrojs/react';

  export default defineConfig({
+   integrations: [react()],
  });
```

La primera línea importa la integración a su archivo de configuración. La segunda línea llama a la función de integración (`react()`) y agrega la integración para que Astro sepa cómo usarla.

¡Eso es todo! Reinicie Astro y la nueva integración debería funcionar inmediatamente.

Si ve un error al iniciar el entorno de desarrollo, asegúrese de que usted:

- ✅ Instaló los paquetes requeridos con npm
- ✅ Importó la integración a su archivo `astro.config.mjs`
- ✅ Llamó a su integración como una función (`[react()]`, no `[react]`)
- ✅ Eliminó cualquier configuración obsoleta de `renderers:` (anterior a v0.25)

## Configuración de integración automática

Astro lanzó recientemente un comando **experimental** `astro add` para automatizar la configuración de integraciones.

:::caution
Siempre le pediremos confirmación antes de actualizar cualquiera de sus archivos, pero nunca está de más tener una copia de seguridad con control de versiones por si acaso.
:::

En lugar de la configuración manual descrita anteriormente, simplemente ejecute `astro add [name]` y nuestro asistente de integración automática actualizará su archivo de configuración e instalará las dependencias necesarias.

```shell
# Usando NPM
npx astro add react
# Usando Yarn
yarn astro add react
# Usando PNPM
pnpx astro add react
```

¡Incluso es posible configurar múltiples integraciones al mismo tiempo!

```shell
# Usando NPM
npx astro add react tailwind partytown
# Usando Yarn
yarn astro add react tailwind partytown
# Usando PNPM
pnpx astro add react tailwind partytown
```

## Manejando las dependencias de integraciones

Al instalar una integración de Astro en su proyecto, esté atento a las advertencias de "missing peer dependencies" que ve durante el proceso de instalación. No todos los gestores de paquetes instalarán automáticamente las peer-dependencies. Si está en Node v16+ y usa npm, no debería preocuparse por esta sección.

```diff
# Ejemplo: Instale las integraciones y frameworks juntos
- npm install @astrojs/react
+ npm install @astrojs/react react react-dom
```

Si omite este paso, no se preocupe, Astro le advertirá al iniciar su entorno de desarrollo si se requieren dependencias que no se encuentran en su proyecto.

Administrar sus propias peer-dependencies puede ser un poco más laborioso, pero también le permite controlar exactamente qué versiones de paquetes usa para cosas como React, Tailwind y más. Esto le da más control sobre su proyecto.

En el futuro, el comando `astro add` podrá manejar toda esta configuración por usted e instalar automáticamente las peer-dependencies correctas para sus integraciones.

## Usando integraciones

Las integraciones de Astro siempre se agregan a través de la propiedad `integrations` en su archivo `astro.config.mjs`.

:::tip[¿Necesita más información sobre una integración específica?]
Encuéntrelo en nuestro [directorio de integraciones](https://astro.build/integrations/) y siga el enlace a su repositorio en GitHub para obtener instrucciones más detalladas de uso y configuración.
:::

Hay tres formas comunes de importar una integración a su proyecto Astro:
1. Instalando el paquete npm de la integración.
2. Importando su propia integración desde un archivo local dentro de su proyecto.
3. Escribiendo su integración en línea, directamente en su archivo de configuración.

```js
// astro.config.mjs
import {defineConfig} from 'astro/config';
import installedIntegration from '@astrojs/vue';
import localIntegration from './my-integration.js';

export default defineConfig({
  integrations: [
    // 1. Importado desde un paquete npm instalado
    installedIntegration(),
    // 2. Importado desde un archivo JS local
    localIntegration(),
    // 3. Un objeto en línea
    {name: 'namespace:id', hooks: { /* ... */ }},
  ]
})
```

Consulte la referencia de [API de integración](/es/reference/integrations-reference/) para conocer las diferentes formas para escribir una integración.

### Opciones personalizadas

Las integraciones casi siempre se crean como factory function que devuelven el objeto de integración real. Esto le permite pasar argumentos y opciones a la factory function que personaliza la integración para su proyecto.

```js
integrations: [
  // Ejemplo: personaliza tu integración con argumentos de función
  sitemap({filter: true})
]
```

## Construyendo su propia integración

La API de integración de Astro está inspirada en Rollup y Vite, y está diseñada para sentirse familiar para cualquiera que haya escrito antes un plugin de Rollup o Vite.

Consulte la referencia [API de integración](/es/reference/integrations-reference/) para saber qué pueden hacer las integraciones y cómo escribir una usted mismo.
