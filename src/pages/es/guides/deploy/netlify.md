---
title: Despliega tu proyecto de Astro en Netlify
description: Cómo desplegar tu proyecto de Astro usando Netlify.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---
[Netlify](https://netlify.com) ofrece servicios de alojamiento y servicios serverless para aplicaciones web y sitios estáticos. ¡Cualquier proyecto de Astro puede ser alojado en Netlify! 

Esta guía contiene instrucciones para hacer despliegues en Netlify a través de la interfaz web o la CLI de Netlify.

## Configuración del Proyecto

Tu proyecto de Astro puede ser desplegado en Netlify de tres maneras distintas: como un sitio estático, un sitio con renderizado en el servidor (SSR), o un (experimental) sitio renderizado en _edge computing_.

### Sitio Estático

Tu proyecto de Astro es un sitio estático por defecto. No necesitas ninguna configuración adicional para desplegar un sitio estático de Astro en Netlify. 

### Adaptador para SSR/Edge

Para habilitar SSR en tu proyecto de Astro y hacer un despliegue en Netlify:

1. Instala [el adaptador de Netlify](https://github.com/withastro/astro/tree/main/packages/integrations/netlify) en las dependencias de tu proyecto.

    ```bash
      npm install --save-dev @astrojs/netlify
    ```

2. Añade dos nuevas lineas a tu archivo de configuración del proyecto `astro.config.mjs`.

    ```diff
    import { defineConfig } from 'astro/config';
    + import netlify from '@astrojs/netlify/functions';

    export default defineConfig({
    +   output: 'server',
    +   adapter: netlify(),
    });
    ```
 
    En cambio, si deseas renderizar tu proyecto usando [las Edge Functions experimentales de Netlify](https://docs.netlify.com/netlify-labs/experimental-features/edge-functions/#app), cambia la importación de `netlify/functions` en la configuración de Astro para usar `netlify/edge-functions`.
      ```diff
      import { defineConfig } from 'astro/config';
      // change this line
      - import netlify from '@astrojs/netlify/functions';
      // to this line
      + import netlify from '@astrojs/netlify/edge-functions';

      export default defineConfig({
        output: 'server',
        adapter: netlify(),
      });
      ```

## Cómo desplegar

Puedes hacer despliegues en Netlify a través de la interfaz web o usando la CLI de Netlify (interfaz de línea de comandos). El proceso es el mismo para ambos sitios estáticos y sitios con SSR.

### Despliegue con la Interfaz Web

Si tu proyecto está alojado en GitHub, GitLab, BitBucket, o Azure DevOps, puedes usar la interfaz web de Netlify para desplegar tu proyecto de Astro.

1. Haz click en <kbd>Add a new site</kbd> en tu [Netlify dashboard](https://app.netlify.com/)

1. Selecciona <kbd>Import an existing project</kbd>

    Cuando importes tu proyecto de Astro desde tu proveedor de Git, Netlify debería detectarlo automáticamente y preconfigurar los ajustes correctos para ti.

2. Asegúrate de que los siguientes ajustes sean ingresados, luego presiona el botón <kbd>Deploy</kbd>:

    - **Build Command:** `astro build` o `npm run build`
    - **Publish directory:** `dist`

 Una vez desplegado, serás redirigido a la página de vista general. Ahí, puedes editar los detalles de tu sitio.

Cualquier cambio futuro al repositorio de tu proyecto provocará despliegues de vista previa y producción basados en tu configuración de despliegue.

#### Archivo `netlify.toml`

Opcionalmente, puedes crear el archivo `netlify.toml` en la raíz del repositorio de tu proyecto para configurar tu comando de build y el directorio a publicar, así como otros ajustes del sitio, incluyendo variables de entorno y redirecciones. Netlify leerá este archivo y configurará de manera automática tu despliegue.

Para configurar los ajustes por defecto, crea un archivo `netlify.toml` con la siguiente configuración:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

¿Usas [`pnpm` en Netlify?](https://answers.netlify.com/t/using-pnpm-and-pnpm-workspaces/2759) Utiliza los siguientes ajustes en su lugar:

```toml
[build.environment]
  NPM_FLAGS = "--version" # previene la instalación de npm en Netlify
[build]
  command = 'npx pnpm i --store=node_modules/.pnpm-store && npm run build'
  publish = 'dist'
```

📚 Más información en [“Deploying an existing Astro Git repository”](https://www.netlify.com/blog/how-to-deploy-astro/#deploy-an-existing-git-repository-to-netlify) en el blog de Netlify.


### Despliegue con CLI

También puedes crear un nuevo sitio en Netlify y vincularlo a tu repositorio de Git instalando y usando la [CLI de Netlify](https://cli.netlify.com/).


1. Instala la CLI de Netlify de manera global

    ```bash
    npm install --global netlify-cli
    ```

2. Ejecuta la CLI y sigue las instrucciones para iniciar sesión y autorizar a Netlify

3. Ejecuta `netlify init` y sigue las instrucciones

4. Confirma tu comando de build (`astro build`)

    La CLI detectará automáticamente la configuración de build (`astro build`) y el directorio a desplegar (`dist`), y ofrecerá generar automáticamente [un archivo `netlify.toml`](#archivo-netlifytoml) con esos ajustes. 

5. Genera tu sitio y despliega enviando tus cambios a Git

    La CLI añadirá una deploy key al repositorio, lo que significa que tu sitio será generado automáticamente en Netlify cada vez que envíes tus cambios con `git push`.

📚 Más detalles de Netlify en [Deploy an Astro site using the Netlify CLI](https://www.netlify.com/blog/how-to-deploy-astro/#link-your-astro-project-and-deploy-using-the-netlify-cli)

### Establece una Versión de Node.js

Si estás usando una [build image](https://docs.netlify.com/configure-builds/get-started/#build-image-selection) antigua (Xenial) en Netlify, asegúrate que tu versión de Node.js esté configurada. Astro requiere v14.15.0, v16.0.0, o mayor.

Puedes [especificar tu versión de Node.js en Netlify](https://docs.netlify.com/configure-builds/manage-dependencies/#node-js-and-javascript) usando:
- un archivo [`.nvmrc`](https://github.com/nvm-sh/nvm#nvmrc) en tu directorio raíz.
- una variable de entorno `NODE_VERSION` en los ajustes de tu sitio utilizando el dashboard de Netlify.

## Usando Netlify Functions

No se necesita configuración adicional para usar Netlify Functions con Astro. ¡Añade un directorio `netlify/functions` a la raíz de tu proyecto y sigue [la documentación de Netlify Functions](https://docs.netlify.com/functions/overview/) para comenzar!

## Ejemplos

- [How to deploy an Astro site](https://www.netlify.com/blog/how-to-deploy-astro/) — Netlify Blog
- [Deploy An Astro site with Forms, Serverless Functions, and Redirects](https://www.netlify.com/blog/deploy-an-astro-site-with-forms-serverless-functions-and-redirects/) — Netlify Blog
- [Deployment Walkthrough Video](https://youtu.be/GrSLYq6ZTes) — Netlify YouTube channel

<!-- 
#### OLD NETLIFY CONTENT FOR REFERENCE

## Server-Side Rendering (SSR) Deployment

With Netlify you can deploy from git, their web UI, or from the cli. Here we'll use the [Netlify CLI](https://docs.netlify.com/cli/get-started/) to deploy.

First build your site as normal:

```bash
npm run build
```

This creates `netlify/functions/` which contains your SSR code. Deploying your site will deploy this function which contains all of your Astro pages ready to be rendered.

```bash
netlify deploy
```

After the deploy is complete it should provide you a preview URL to see your site.

📚 Read more about [SSR in Astro](/en/guides/server-side-rendering/).


## Netlify

You can configure your deployment in two ways, via the [Netlify website UI](#netlify-website-ui) or with a local project `netlify.toml` file.

-->
