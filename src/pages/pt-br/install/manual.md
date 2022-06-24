---
title: Instale Astro manualmente
description: Como instalar Astro manualmente com NPM, PNPM ou Yarn.
layout: ~/layouts/MainLayout.astro
setup: import InstallGuideTabGroup from '~/components/TabGroup/InstallGuideTabGroup.astro';
i18nReady: true
---

Pronto para instalar Astro? Siga os guias de configuração automático ou manual.

#### Pré-requisitos

- **Node.js** - `14.15.0`, `v16.0.0`, ou superior.
- **Editor de Texto** - Recomendamos o [VS Code](https://code.visualstudio.com/) com a nossa [extensão oficial Astro](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).
- **Terminal** - Astro é acessado através da sua Interface de Linha de Comando.

<InstallGuideTabGroup />

#### Instalação

Se você não deseja usar a nossa interface de linha de comando `create-astro`, você pode configurar o seu projeto manualmente seguindo o guia abaixo.

## 1. Crie o seu diretório

Crie um diretório vazio com o mesmo nome do seu projeto e navegue até ele:

```bash
mkdir meu-projeto-astro
cd meu-projeto-astro
```

Uma vez que estiver em seu novo diretório, crie o arquivo `package.json` do seu projeto. É através dele que você irá gerenciar as dependências do seu projeto, incluindo Astro. Se você não está familiarizado com este formato de arquivo, execute o seguinte comando para criá-lo:

```bash
npm init --yes
```

## 2. Instale Astro

Primeiramente, instale as dependências do Astro em seu projeto:

```bash
npm install astro
```

Com a instalação concluída, substitua o script padrão em seu `package.json` com os seguintes comandos:

```diff
  "scripts": \{
-    "test": "echo \"Error: no test specified\" && exit 1"
+    "dev": "astro dev",
+    "start": "astro dev",
+    "build": "astro build",
+    "preview": "astro preview"
  },
```

Você irá usar estes scripts mais a frente no guia para iniciar Astro e executar seus diferentes comandos.

## 3. Crie sua primeira página

Em seu editor de texto, crie um novo arquivo em seu diretório `src/pages/index.astro`. Essa será a sua primeira página Astro do projeto.

Para este guia, copie e cole o seguinte trecho de código (incluindo os traços `---`) em seu novo arquivo:

```astro
---
// Bem vindo ao Astro! Tudo entre estes traços triplos é o
// "front matter" do componente. Este código nunca executa no navegador.
console.log('Este código executa em seu terminal, não em seu navegador!');
---
<!-- Abaixo está o "template" do seu componente. É apenas HTML, mas
     com certa mágica para te ajudar a construir ótimos templates. -->
<html>
  <body>
    <h1>Olá, Mundo!</h1>
  </body>
</html>
<style>
  h1 {
    color: orange;
  }
</style>
```

## 4. Crie seu primeiro asset estático

Você também irá precisar criar um diretório `public/` para guardar seus assets estáticos. Astro irá sempre incluir estes assets na construção final do seu projeto, você pode referenciá-los com segurança dentro de seus componentes.

Em seu editor de texto, crie um novo arquivo em seu diretório `public/robots.txt`. `robots.txt` é um arquivo simples que é incluído na maiorias dos sites para dizer aos robôs de busca, como o Google, como tratar o seu site.

Para este guia, copie e cole o seguinte trecho de código em seu novo arquivo:

```
# Exemplo: Permite que todos os robôs possam escanear e indexar seu site.
# Sintaxe completa: https://developers.google.com/search/docs/advanced/robots/create-robots-txt
User-agent: *
Allow: /
```

## 5. Crie o arquivo `astro.config.mjs`

Astro é configurado usando o arquivo `astro.config.mjs`. Este arquivo é opcional se você não precisa configurar Astro, mas você pode querer criá-lo agora.

Crie o arquivo `astro.config.mjs` na raiz do seu projeto e então copie e cole o seguinte trecho de código nele:

```js
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({});
```

Se você deseja incluir [componentes de frameworks de UI](/pt-br/core-concepts/framework-components/) como React, Svelte e etc. ou usar ferramentas como Tailwind ou Partytown em seu projeto, aqui é onde você irá [importar e configurar manualmente as integrações](/pt-br/guides/integrations-guide/).

📚 Leia a [referência de configuração da API](/pt-br/reference/configuration-reference/) Astro para mais informações.

## 6. Próximos passos

Se você seguir os passos acima, o diretório do seu projeto deve se parecer com a seguinte estrutura:

```
├── node_modules/
├── src/
│   └── pages/
│   │   └── index.astro
├── public/
│   ├── robots.txt
├── astro.config.mjs
├── package.json
└── package-lock.json (or: yarn.lock, pnpm-lock.yaml, etc.)
```

Parabéns! Você está pronto para usar Astro!

Se você seguiu este guia por completo, você pode pular diretamente para o [Passo 3: Inicie Astro](/pt-br/install/auto/#3-inicie-astro-) para aprender como executar Astro pela primeira vez.
