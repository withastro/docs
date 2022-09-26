---
title: Faça Deploy do seu Site Astro na Layer0
description: Como fazer o deploy do seu site Astro para web usando Layer0.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

Você pode fazer o deploy do seu projeto Astro na [Layer0](https://www.layer0.co/), uma plataforma edge e de distribuição de conteúdo (em Inglês, "content delivery network" ou CDN) para fazer deploy, proteger e acelerar websites e APIs.

:::tip
Confira [o guia para Astro na documentação da Layer0](https://docs.layer0.co/guides/astro)!
:::

## Como fazer o Deploy

1. Adicione Layer0

    ```bash
    # Primeiro, instale globalmente a CLI da Layer0:
    $ npm i -g @layer0/cli

    # Depois, adicione Layer0 ao seu site Astro:
    $ 0 init
    ```

2. Atualize seu Layer0 Router

    Cole o seguinte código em routes.ts:

    ```js
    // routes.ts
    import { Router } from '@layer0/core';

    export default new Router()
      .get(
        '/:path*/:file.:ext(js|css|png|ico|jpg|gif|svg)',
        ({ cache, serveStatic }) => {
          cache({
            browser: {
              // faz cache do js, css e imagens no navegador por uma hora...
              maxAgeSeconds: 60 * 60,
            },
            edge: {
              // ... E na edge por um ano
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
          });
          serveStatic('dist/:path*/:file.:ext');
        }
      )
      .match('/:path*', ({ cache, serveStatic, setResponseHeader }) => {
        cache({
          // impede que o navegador faça cache do html...
          browser: false,
          edge: {
            // ...faz cache do html na edge por um ano
            maxAgeSeconds: 60 * 60 * 24 * 365,
          },
        });
        setResponseHeader('content-type', 'text/html; charset=UTF-8');
        serveStatic('dist/:path*');
      });
    ```

    Você pode remover o backend de origem de `layer0.config.js`:

    ```js
    module.exports = {};
    ```

3. Faça o deploy para a Layer0

    Para fazer o deploy do seu site na Layer0, execute:

    ```bash
    # Cria um build em produção do seu site astro
    $ npm run build

    # Faz o deploy do site na Layer0
    $ 0 deploy
    ```
