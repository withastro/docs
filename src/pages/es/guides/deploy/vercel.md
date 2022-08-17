---
title: Despliega tu proyecto de Astro en Vercel

description: Cómo desplegar tu sitio de Astro en la web en Vercel.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

Puedes usar [Vercel](http://vercel.com/) para desplegar tu proyecto de Astro a su red global edge sin configuración adicional.


Esta guía incluye instrucciones para hacer despliegues en Vercel a través de su interfaz web o la línea de comandos de Vercel (CLI).

## Configuración del Proyecto

Tu proyecto de Astro puede ser desplegado en Vercel como un sitio estático, o como un sitio con renderizado en el servidor (SSR).


### Sitio Estático

Tu proyecto de Astro es un sitio estático por defecto. No necesitas ninguna configuración adicional para desplegar un sitio estático de Astro en Vercel. 

### Adaptador para SSR

Para habilitar SSR en tu proyecto de Astro y desplegar en Vercel:

1. Instala [el adaptador de Vercel](https://github.com/withastro/astro/tree/main/packages/integrations/vercel) en las dependencias de tu proyecto.

    ```bash
      npm install --save-dev @astrojs/vercel
    ```

1. Añade dos líneas nuevas a tu archivo de configuración del proyecto `astro.config.mjs`.

    ```diff
    // astro.config.mjs
    import { defineConfig } from 'astro/config';
    + import vercel from '@astrojs/vercel/serverless';

    export default defineConfig({
    +   output: 'server',
    +   adapter: vercel(),
    });
    ```

## Cómo Desplegar

Puedes desplegar en Vercel a través de la interfaz web o utilizando la interfaz de línea de comandos de Vercel (CLI). El proceso es el mismo para sitios de Astro estáticos y SSR.

### Despliegue con Interfaz Web

1. Envía tu código a un repositorio en remoto de Git (GitHub, GitLab, BitBucket).

2. [Importa tu proyecto](https://vercel.com/new) en Vercel.
3. Vercel detectará automáticamente Astro y establecerá la configuración necesaria.
4. ¡Tu aplicación está desplegada! (p. ej. [astro.vercel.app](https://astro.vercel.app/))


Una vez que tu proyecto ha sido importado y desplegado, todos los envíos subsecuentes en las ramas de git generaran [Preview Deployments](https://vercel.com/docs/concepts/deployments/environments#preview), y todos los cambios hechos a la rama de producción (comúnmente “main”) resultaran en [Production Deployments](https://vercel.com/docs/concepts/deployments/environments#production).


📚 Aprende más sobre la [integración de Git](https://vercel.com/docs/concepts/git) de Vercel.


### Despliegue a través del CLI

1. Instala la [interfaz de línea de comandos de Vercel](https://vercel.com/cli) y ejecuta `vercel` para desplegar.

    ```bash
    npm i -g vercel
    vercel
    ```

2. Vercel detectará automáticamente Astro y establecerá la configuración necesaria.
3. Cuando pregunte `Want to override the settings? [y/N]`, selecciona `N`.
4. Tu aplicación está desplegada! (p. ej. [astro.vercel.app](https://astro.vercel.app/))
