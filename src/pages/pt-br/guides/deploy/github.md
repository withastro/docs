---
title: Faça o deploy do seu site Astro no Github Pages
description: Como fazer o deploy do seu site Astro para a web no Github Pages.
layout: ~/layouts/DeployGuideLayout.astro
i18nReady: true
---

Você pode usar o [GitHub Pages](https://pages.github.com/) para hospedar o seu site Astro diretamente do seu repositório no [GitHub.com](https://github.com/).

## Como fazer o deploy

Você pode fazer o deploy através de [GitHub Actions](https://github.com/features/actions) para automaticamente gerar o build e fazer o deploy do seu site. Para isso, o seu código fonte precisa estar hospedado no Github.

O Astro mantém oficialmente o `withastro/action` para fazer o deploy do seu projeto com pouquíssima configuração. Siga as instruções abaixo para realizar o deploy do seu site Astro no Github Pages, e leia o [README do pacote](https://github.com/withastro/action) se você precisa de mais informações.

1. Defina as opções de [`site`](/pt-br/reference/configuration-reference/#site) e, se necessário, [`base`](/pt-br/reference/configuration-reference/#base) em `astro.config.mjs`.

   ```js title="astro.config.mjs" ins={4-5}
   import { defineConfig } from 'astro/config';

   export default defineConfig({
     site: 'https://astronaut.github.io',
     base: '/meu-repositorio',
   });
   ```

   - `site` deve ser `https://<SEU_NOME_DE_USUARIO>.github.io` ou `https://meu-dominio-personalizado.com`
   - `base` deve ser o nome do seu repositório após uma barra para frente, por exemplo `/meu-repositorio`. Isso para que o Astro posso entender que a raiz do seu site está em `/meu-repositorio`, em vez do padrão `/`.

   :::note
   Não defina o parâmetro `base` se:

   - Seu repositório for chamado `<SEU_NOME_DE_USUARIO>.github.io`.
   - Você está usando um domínio personalizado. 
   :::

   :::caution
   Se você não tinha determinado um valor de `base` anteriormente, e só está configurando esse valor para fazer o deploy pelo Github, você deve atualizar os links das páginas internas para incluir `base`.

   ```astro
   <a href="/meu-repositorio/sobre">Sobre</a>
   ```
   :::

2. Crie um novo arquivo no seu projeto em `.github/workflows/deploy.yml` e cole o YAML abaixo.

   ```yaml title="deploy.yml"
   name: Github Pages Astro CI

   on:
     # Ativa o workflow toda vez que você fizer um push para a branch `main`
     # Usando um nome de branch diferente? Modifique `main` para o nome da sua branch
     push:
       branches: [main]
     # Permite que esse workflow rode manualmente da aba de Ações no Github.
     workflow_dispatch:

   # Allow this job to clone the repo and create a page deployment
   permissions:
     contents: read
     pages: write
     id-token: write

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout your repository using git
           uses: actions/checkout@v2
         - name: Install, build, and upload your site
           uses: withastro/action@v0

     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v1
   ```

   :::caution
   A [action](https://github.com/withastro/action) oficial do Astro escaneia por lockfile para detectar o seu gerenciador de pacotes favorito (`npm`, `yarn`, or `pnpm`). Você deve realizar o commit do `package-lock.json`, `yarn.lock`, ou `pnpm-lock.yaml` criado automaticamente pelo seu pacote favorito, no seu repositório.
   :::

3. No GitHub,vá para a aba de **Settings** e encontre a sessão de **Pages**.

4. Escolha **GitHub Actions** como o **Source** do seu site e aperte **Save**.

5. Faça o commit de um novo arquivo de workflow e faça um push para o Github.

O seu site já deve estar publicado! Quando você fizer um push com suas mudanças para o seu repositório do projeto Astro, as Github Actions vão automaticamente fazer o deploy para você.

:::tip[determinar um domínio personalizado]
Você pode opcionalmente determinar um domínio personalizado adicionando, no arquivo `./public/CNAME` do seu projeto, o seguinte:

```txt title="public/CNAME"
meu.subdominio.com
```

Isso vai realizar o deploy do seu site no seu domínio personalizado ao invés de `usuario.github.io`. Não se esqueça de [configurar o DNS no seu provedor de domínios](https://docs.github.com/pt/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain).  
:::
