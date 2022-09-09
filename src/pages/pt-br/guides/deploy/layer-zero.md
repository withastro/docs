---
title: Faça Deploy do seu Site Astro no Layer0
description: Como fazer o deploy do seu site Astro para web usando Layer0.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

Você pode fazer o deploy do seu projeto Astro no [Layer0](https://www.layer0.co/), uma plataforma edge e de distribuição de conteúdo (em Inglês, "content delivery network" ou CDN) para fazer deploys, proteger e acelerar websites e APIs.

:::tip
Confira [o guia Astro nos documentos Layer0](https://docs.layer0.co/guides/astro)!
:::

## Como fazer o Deploy

1. Adicione o Layer0

    ```bash
    # Primeiro, instale globalmente o Layer0 CLI:
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
              // armazenar o cache js, css, e imagens no browser por uma hora...
              maxAgeSeconds: 60 * 60,
            },
            edge: {
              // ... E no edge por um ano
              maxAgeSeconds: 60 * 60 * 24 * 365,
            },
          });
          serveStatic('dist/:path*/:file.:ext');
        }
      )
      .match('/:path*', ({ cache, serveStatic, setResponseHeader }) => {
        cache({
          // impedir que o navegador armazene o cache do html...
          browser: false,
          edge: {
            // ...armazenar o cache html no edge por um ano
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

3. Faça o Deploy para o Layer0

    Para fazer o deploy do seu site no Layer0, execute:

    ```bash
    # Cria um build em produção do seu astro site
    $ npm run build

    # Faça o Deploy do site no Layer0
    $ 0 deploy
    ```
