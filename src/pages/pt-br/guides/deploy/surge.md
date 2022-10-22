---
title: Faça o deploy do seu site Astro no Surge
description: Como fazer o deploy do seu site Astro usando surge.sh
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

Você pode fazer o deploy do seu projeto Astro para o [Surge](https://surge.sh/) uma plataforma de single-command designada para desenvolvedores front-end.

## Como fazer o deploy

1. Instale [a Surge CLI](https://www.npmjs.com/package/surge) globalmente pelo Terminal, se ainda não tiver instalado.

    ```shell
    npm install -g surge
    ```

2. Build seu site Astro a partir do diretório raiz do seu projeto.

    ```shell
    npm run build
    ```

3. Faça o deploy para o Surge usando a CLI.

    ```shell
    surge dist
    ```

    Você pode usar um [domínio customizado](http://surge.sh/help/adding-a-custom-domain) quando fizer o deploy executando `surge dist yourdomain.com`.
