---
layout: ~/layouts/MainLayout.astro
title: Usando Integrações
i18nReady: true
setup: |
  import IntegrationsNav from '~/components/IntegrationsNav.astro';
---

**Integrações Astro** adicionam novas funcionalidades e comportamentos para o seu projeto com apenas algumas linhas de código. Você mesmo pode escrever uma integração customizada, usar uma integração oficial, ou usar integrações feitas pela comunidade.

Integrações podem...

- Habilitar React, Vue, Svelte, Solid e outros frameworks de UI populares.
- Integrar ferramentas como Tailwind e Partytown com algumas linhas de código.
- Adicionar novas funcionalidades ao seu projeto, como geração de sitemap automático.
- Escrever código customizado que é executado no processo de build, no servidor de desenvolvimento e mais.

## Integrações Oficiais

<IntegrationsNav />

## Instalação Automática de Integrações

Astro inclui o comando comando `astro add` para automatizar a instalação de integrações.

:::caution
Nós sempre iremos pedir por confirmação antes de atualizar quaisquer arquivos seus, mas não faz mal ter um backup controlado por versão para se prevenir.
:::

Execute `astro add [nome-da-integração]` e nosso assistente automático de integrações irá atualizar seu arquivo de configuração e instalar quaisquer dependências necessárias.

```shell
# Usando NPM
npx astro add react
# Usando Yarn
yarn astro add react
# Usando PNPM
pnpx astro add react
```

É até mesmo possível configurar múltiplas integrações ao mesmo tempo!

```shell
# Usando NPM
npx astro add react tailwind partytown
# Usando Yarn
yarn astro add react tailwind partytown
# Usando PNPM
pnpx astro add react tailwind partytown
```

:::note[Lidando com Dependências de Integrações]
Se você encontrar quaisquer avisos como `Cannot find package '[nome-do-pacote]'` após adicionar uma integração, seu gerenciador de pacotes pode não ter instalado as [dependências de pares](https://nodejs.org/en/blog/npm/peer-dependencies/) para você. Para instalar esses pacotes faltando, execute `npm install [nome-do-pacote]`.
:::

## Usando Integrações

Integrações Astro são sempre adicionadas através da propriedade `integrations` no seu arquivo `astro.config.mjs`.

Há três formas comuns de importar uma integração em seu projeto Astro:
1. Instalando uma integração como um pacote npm.
2. Importando sua própria integração de um arquivo local dentro do seu projeto.
3. Escrevendo sua própria integração diretamente no seu arquivo de configuração.

```js
// astro.config.mjs
import {defineConfig} from 'astro/config';
import integracaoInstalada from '@astrojs/vue';
import integracaoLocal from './minha-integracao';

export default defineConfig({
  integrations: [
    // 1. Importado de um pacote npm
    integracaoInstalada(), 
    // 2. Importado de um arquivo JS local
    integracaoLocal(),
    // 3. Um objeto inserido diretamente
    {name: 'namespace:id', hooks: { /* ... */ }},
  ]
})
```

Veja a [API de Integrações](/pt-br/reference/integrations-reference/) para aprender sobre todas as diferentes formas em que você pode escrever uma integração.

### Opções Customizadas

Integrações são quase sempre escritas como funções de fábrica que retornam um objeto da integração. Isso te permite passar argumentos e opções para a função de fábrica que customiza a integração do seu projeto.

```js
integrations: [
  // Exemplo: Customize sua integração com os argumentos da função
  sitemap({filter: true})
]
```

### Ligando/Desligando uma Integração

Integrações com valores `falsy` são ignoradas, então você pode alternar integrações entre ligado e desligado sem se preocupar com `undefined` e valores booleanos deixados para trás.

```js
integrations: [
  // Exemplo: Pula a build do sitemap no Windows
  process.platform !== 'win32' && sitemap()
]
```

## Encontrando Mais Integrações

Você pode encontrar várias integrações desenvolvidas pela comunidade no [Diretório de Integrações Astro](https://astro.build/integrations/). Siga seus links para instruções mais detalhadas de utilização e configuração.

:::note[Estado experimental]
**Para habilitar integrações de terceiros:** Execute Astro com a flag `--experimental-integrations` da interface de linha de comando, ou inclua `experimental: { integrations: true }` no seu arquivo de configuração Astro.

Integrações oficiais do Astro (aquelas publicadas em `@astrojs/` no npm) são suportadas por padrão. Você não precisa da flag experimental para as utilizar.
:::

## Criando sua Própria Integração

A API de Integrações do Astro foi inspirada pelo Rollup e Vite, e projetada para parecer familiar a qualquer um que já tenha escrito um plugin Rollup ou Vite anteriormente.

Veja a referência da [API de Integrações](/pt-br/reference/integrations-reference/) para aprender o que integrações podem fazer e como escrever uma você mesmo.
