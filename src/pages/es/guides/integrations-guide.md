---
layout: ~/layouts/MainLayout.astro
title: Usando integraciones
i18nReady: true
setup: |
  import IntegrationsNav from '~/components/IntegrationsNav.astro';
---

Las **integraciones de Astro** agregan nuevas funcionalidades a su proyecto con solo unas pocas líneas de código. Escribe una integración personalizada o usa las integraciones más populares de [npm](https://www.npmjs.com/search?q=keywords%3Aastro-component&ranking=popularity).

Usando integraciones puedes...

- Desbloquear React, Vue, Svelte, Solid y otros frameworks populares.
- Integrar herramientas como Tailwind y Partytown con unas pocas líneas de código.
- Agregar nuevas funcionalidades a tu proyecto, como la generación automática de sitemaps.
- Escribir código personalizado que se conecte con el proceso de compilación, el entorno de desarrollo y más.

## Integraciones oficiales

<IntegrationsNav />

## Configuración de integración automática

Astro incluye un comando `astro add` para automatizar la configuración de integraciones.

:::caution
Siempre te pediremos confirmación antes de actualizar cualquiera de tus archivos, pero nunca está de más tener una copia de seguridad con control de versiones por si acaso.
:::

Puedes correr `astro add [nombre-de-integracion]` y nuestro asistente de integración automática actualizará tu archivo de configuración e instalará las dependencias necesarias.

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

:::note[Manejando Dependencias de Integraciones]
Si ves una advertencia con el texto `Cannot find package '[nombre-de-paquete]'` luego de intentar agregar una integración, probablemente tu gestor de paquetes no haya instalado las [peer dependencies](https://nodejs.org/en/blog/npm/peer-dependencies/). Para instalar los paquetes faltantes, ejecuta `npm install [nombre-de-paquete]` en la terminal.
:::

## Usando integraciones

Las integraciones de Astro siempre se agregan a través de la propiedad `integrations` en tu archivo `astro.config.mjs`.

Hay tres formas comunes de importar una integración a su proyecto Astro:
1. Instalando el paquete npm de la integración.
2. Importando tu propia integración desde un archivo local dentro de tu proyecto.
3. Escribiendo tu integración en línea, directamente en tu archivo de configuración.

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

Consulta la referencia de [API de integración](/es/reference/integrations-reference/) para conocer las diferentes formas para escribir una integración.

### Opciones personalizadas

Las integraciones casi siempre se crean como factory function que devuelven el objeto de integración real. Esto te permite pasar argumentos y opciones a la factory function que personaliza la integración para tu proyecto.

```js
integrations: [
  // Ejemplo: personaliza tu integración con argumentos de función
  sitemap({filter: true})
]
```

### Activar una Integración

Las integraciones _falsy_ (con valor falso) son ignoradas, de esta forma puedes activar o desactivar integraciones sin preocuparte por valores `undefined` o booleanos abandonados.

```js
integrations: [
  // Ejemplo: Saltear la generación de sitemap en Windows
  process.platform !== 'win32' && sitemap()
]
```

## Encontrar más integraciones

Puedes encontrar integraciones desarrolladas por la comunidad en el [Directorio de Integraciones de Astro](https://astro.build/integrations/). Puedes seguir los hipervínculos para averiguar cómo se utilizan y ver instrucciones de configuración.

:::note[Estado experimental]
**Para habilitar integraciones de terceros:** Ejecuta Astro con el flag `--experimental-integrations` en tu Terminal o puedes incluir `experimental: {integrations: true}` en tu archivo de configuración de Astro.

Las integraciones oficiales de Astro (publicadas con el prefijo `@astrojs/` en npm) son actualmente compatibles por defecto. No necesitas usar ninguna flag para poder utilizarlas.
:::


## Construyendo tu propia integración

La API de integración de Astro está inspirada en Rollup y Vite, y está diseñada para sentirse familiar para cualquiera que haya escrito antes un plugin de Rollup o Vite.

Consulta la referencia [API de integración](/es/reference/integrations-reference/) para saber qué pueden hacer las integraciones y cómo escribir una tú mismo.
