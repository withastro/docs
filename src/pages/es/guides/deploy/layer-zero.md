---
title: Despliega tu proyecto de Astro en Layer0
description: Cómo desplegar tu proyecto de Astro usando Layer0.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

Puedes desplegar tu proyecto de Astro en [Layer0](https://www.layer0.co/), una plataforma edge y CDN para desplegar, proteger y acelerar sitios web y APIs.

:::tip
¡Revisa [la guía de Astro en la documentación de Layer0](https://docs.layer0.co/guides/astro)!
:::

## Cómo desplegar

1. Añade Layer0

    ```bash
    # Primero, instala de forma global la CLI de Layer0:
    $ npm install -g @layer0/cli

    # Después, añade Layer0 a tu proyecto de Astro:
    $ 0 init
    ```

2. Actualiza tu Layer0 Router

    Pega el siguiente código dentro de `routes.ts`:

    ```js
    // routes.ts
    import { Router } from '@layer0/core';

    export default new Router()
      .get(
        '/:path*/:file.:ext(js|css|png|ico|jpg|gif|svg)',
        ({ cache, serveStatic }) => {
          cache({
            browser: {
              // cachea js, css, e imágenes en el navegador por una hora...
              maxAgeSeconds: 60 * 60,
            },
            edge: {
              // ... y en edge por un año
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
          });
          serveStatic('dist/:path*/:file.:ext');
        }
      )
      .match('/:path*', ({ cache, serveStatic, setResponseHeader }) => {
        cache({
          // previene el navegador de cachear el html...
          browser: false,
          edge: {
            // ...cachea el html en edge por un año
            maxAgeSeconds: 60 * 60 * 24 * 365,
          },
        });
        setResponseHeader('content-type', 'text/html; charset=UTF-8');
        serveStatic('dist/:path*');
      });
    ```

    Puedes remover el backend de origen de `layer0.config.js`:

    ```js
    module.exports = {};
    ```

3. Despliega en Layer0

    Para desplegar tu proyecto en Layer0, ejecuta:

    ```bash
    # Crea un build de producción de tu proyecto
    $ npm run build

    # Despliégalo en Layer0
    $ 0 deploy
    ```
