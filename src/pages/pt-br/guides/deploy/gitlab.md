---
title: Faço o deploy do seu site Astro no GitLab Pages
description: Como fazer o deploy do seu site Astro para a web no GitLab Pages.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

Você pode usar o [GitLab Pages](https://pages.gitlab.io/) para hospedar um site Astro para seu projeto, grupo ou conta de usuário do [GitLab](https://about.gitlab.com/).

:::tip[Precisa de um exemplo?]
Veja [o exemplo oficial do Astro de um projeto no GitLab Pages](https://gitlab.com/pages/astro)!
:::

## Como fazer o deploy

1. Defina a opção de `site` em `astro.config.mjs`.
2. Defina `outDir:public` em `astro.config.mjs`. Essa opção instrue o Astro a construir a build estática do site em um diretório chamado `public`, que é o local exigido pelo GitLab Pages para os arquivos que são expostos.

Se você está usando o [diretório `public/`](/pt-br/core-concepts/project-structure/#public) como fonte de arquivos estáticos para seu projeto Astro, renomeie o diretório e defina `publicDir` com o novo nome em `astro.config.mjs`.

O exemplo abaixo mostra as configurações corretas do `astro.config.mjs` quando o diretório `public/` foi renomeado para `static/`:

   ```js
   import { defineConfig } from 'astro/config';

   export default defineConfig({
     sitemap: true,
     site: 'https://astro.build/',
     outDir: 'public',
     publicDir: 'static',
   });
   ```

3. Crie um novo arquivo chamado `.gitlab-ci.yml` na raiz do seu projeto com o conteúdo abaixo. Dessa forma será realizado uma nova build e o deploy sempre que houver mudanças no conteúdo:

   ```yaml
   # A imagem docker que será utilizada para a build do seu app
   image: node:14

   pages:
     cache:
       paths:
         - node_modules/
     script:
       # Especifique aqui os comandos necessários para a build do app
       - npm install
       - npm run build

     artifacts:
       paths:
         # O diretório que possui os arquivos da build
         # Precisa ser chamado de "public"
         - public

     only:
       # Começa uma nova build e um novo deploy somente quando
       # houver mudanças nas branchs abaixo
       - main
   ```
