---
layout: ~/layouts/MainLayout.astro
setup: |
  import Badge from '~/components/Badge.astro';
title: Usando Integrações
i18nReady: true
---

**Integrações Astro** adicionam novas funcionalidades e comportamentos para o seu projeto com apenas algumas linhas de código. Você mesmo pode escrever uma integração customizada ou adicionar uma popular do [npm](https://www.npmjs.com/search?q=keywords%3Aastro-component&ranking=popularity). 

- Habilite React, Vue, Svelte, Solid e outros frameworks de UI populares.
- Integre ferramentas como Tailwind e Partytown com algumas linhas de código.
- Adicione novas funcionalidades ao seu projeto, como geração de sitemap automático.
- Escreva código customizado que é executado no processo de construção, no servidor de desenvolvimento e mais.

> Integrações ainda são novas e sua API ainda não foi finalizada. Apenas integrações oficiais Astro (aquelas publicadas em `@astrojs/` no npm) possuem suporte para proteger o usuário de mudanças incompatíveis com versões anteriores.

> **Para habilitar integrações de terceiros:** Execute Astro com a bandeira `--experimental-integrations` na interface de linha de comando.

## Tutorial: Adicionando React ao seu Projeto

Neste exemplo, nós iremos adicionar a integração `@astrojs/react` para adicionar suporte ao React no seu projeto Astro. O processo para adicionar qualquer outro framework (Preact, Vue, Svelte ou Solid.js) é praticamente idêntico e pode ser seguido com as mesmas etapas detalhadas abaixo.

<blockquote>
  <Badge variant="accent">Pronto para se aventurar?</Badge>
  
  Astro recentemente lançou o comando **experimental** `astro add` para automatizar esse processo! Ao invés das etapas abaixo, você pode executar `npx astro add react`. Só isso!
  
  Pule para [Instalação Automática de Integrações](/pt-BR/guides/integrations-guide/#instalação-automática-de-integrações) para mais detalhes.

</blockquote>

Primeiro, você precisa instalar tanto a integração quanto qualquer pacote relacionado que você pretende usar em seu projeto. Para React, isso significa instalar a integração `@astrojs/react` ***e*** os pacotes `react` + `react-dom`.

```bash
npm install --save-dev @astrojs/react
```

Assim que seus pacotes tiverem sido instalados, adicione duas novas linhas ao seu arquivo de configuração de projeto `astro.config.mjs`.

```diff
  // astro.config.mjs
  import { defineConfig } from 'astro/config';
+ import react from '@astrojs/react';

  export default defineConfig({
+   integrations: [react()],
  });
``` 

A primeira linha é a declaração de importação que importa a integração em seu arquivo de configuração. A segunda linha chama a função da integração (`react()`) e adiciona a integração para que o Astro saiba como utilizá-la.

Isso é tudo! Reinicie Astro e a nova integração deve funcionar imediatamente.

Se você se deparar com um erro na inicialização, certifique-se de que você:

- ✅ instalou os pacotes necessários com o npm
- ✅ importou a integração em seu arquivo `astro.config.mjs`
- ✅ chamou a sua integração como uma função (`[react()]`, e não `[react]`)
- ✅ removeu qualquer configuração `renderers:` descontinuada (pré v0.25) 

## Instalação Automática de Integrações

Astro recentemente lançou o **experimental** comando `astro add` para automatizar a instalação de integrações.

> Nós sempre iremos pedir por confirmação antes de atualizar quaisquer arquivos seus, mas não faz mal ter um backup controlado por versão para se previnir.

Ao invés da configuração manual detalhada acima, apenas rode `astro add [nome]` e nosso assistente automático de integrações irá atualizar seu arquivo de configuração e instalar quaisquer dependências necessárias.

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

## Lidando com Dependências de Integrações

Quando você estiver instalando uma integração Astro, se atente a qualquer aviso "missing peer dependencies" ("faltando dependências de pares") na etapa de instalação. Nem todos os gerenciadores de pacotes irão instalar dependências de pares por você automaticamente. Se você estiver no Node v16+ e utilizando npm, você não precisa se preocupar com esta seção.

Se você encontrar um erro parecido com `"Cannot find package 'react'"` (`Não foi possível encontrar o pacote 'react'`) quando você iniciar o Astro, isso significa que você precisa instalar aquele pacote no seu projeto. React, por exemplo, é uma dependência de pares da integração `@astrojs/react`. Isso significa que você deve instalar os pacotes oficiais `react` e `react-dom` juntos a sua integração. A integração vai então puxar estes pacotes automaticamente.

```diff
# Exemplo: Usando integrações e frameworks juntos
- npm install @astrojs/react
+ npm install @astrojs/react react react-dom
```

Se você errar esta etapa, não se preocupe, Astro irá te avisar durante a inicialização se quaisquer dependências de pares são necessárias mas não foram encontradas no seu projeto.

Organizar as suas próprias dependências de pares pode ser um pouco mais trabalhoso, mas também te deixa controlar exatamente quais versões dos pacotes você utilizada para coisas como React, Tailwind e mais. Isso te dá mais controle em seu projeto.

No futuro, um conveniente comando `astro add` será capaz de lidar com toda esta instalação para você e instalar as dependências de pares corretas para suas integrações automaticamente.

## Usando Integrações

Integrações Astro são sempre adicionadas através da propriedade `integrations` no seu arquivo `astro.config.mjs`.

> Quer saber mais sobre como utilizar ou configurar uma integração específica? Descubra como em nossa [biblioteca de integrações](https://astro.build/integrations) e siga o link até seu repositório no GitHub.

Há três formas comuns de importar uma integração em seu projeto Astro:
1. Instalando uma integração como um pacote npm.
2. Importando sua própria integração de um arquivo local dentro do seu projeto.
3. Escrevendo sua própria integração diretamente no seu arquivo de configuração.

```js
// astro.config.mjs
import {defineConfig} from 'astro/config';
import integracaoInstalada from '@astrojs/vue';
import integracaoLocal from './minha-integracao.js';

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

Veja a [API de Integrações](/pt-BR/reference/integrations-reference/) para aprender sobre todas as diferentes formas em que você pode escrever uma integração.

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
  // Exemplo: Pula a construção do sitemap no Windows
  process.platform !== 'win32' && sitemap()
]
```


## Criando sua Própria Integração

A API de Integrações do Astro foi inspirada pelo Rollup e Vite, e projetada para parecer familiar a qualquer um que já tenha escrito um plugin Rollup ou Vite anteriormente.

Veja a referência da [API de Integrações](/pt-BR/reference/integrations-reference/) para aprender o que integrações podem fazer e como escrever uma você mesmo.
