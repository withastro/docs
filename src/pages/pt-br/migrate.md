---
layout: ~/layouts/MainLayout.astro
title: Guia de Migração
description: Como migrar seu projeto para a versão mais recente do Astro.
i18nReady: true
---

Este guia vai te ajudar a migrar de versões mais antigas do Astro para a mais recente.

Leia o guia abaixo para os maiores destaques e instruções em como lidar com mudanças radicais (em inglês, "breaking changes").


## Beta do Astro 1.0

Em 4 de Abril, 2022, nós lançamos a Beta do Astro 1.0! 🎉 

**Nós não planejamos fazer mais mudanças radicais durante o período dessa beta até o lançamento oficial da v1.0.0 (planejado para o [fim de Julho, 2022](https://astro.build/blog/astro-1-release-update/)).**

Se qualquer mudança radical precisar se feita, nós iremos a apontá-la nesta seção.

## Migrando para a v1.0.0-beta.0

O lançamento `v1.0.0-beta.0` do Astro não teve nenhuma mudança radical.

Se você estiver vindo da v0.25 ou anterior, se certifique de que você leu e seguiu o [Guia de Migração da v0.26](#migrando-para-a-v026) abaixo, que conteve várias grandes mudanças radicais.

## Migrando para a v0.26
### Nova API de Configuração

Nossa API de Configuração foi reprojetada para resolver alguns pontos evidentes de confusão que foram se acumulando desde o ano passado. A maior parte da configuração foi apenas movida ou renomeada, o que esperamos ser só uma rápida atualização para a maioria dos usuários. Algumas opções foram mais refatoradas e podem necessitar outras mudanças adicionais:

- `.buildOptions.site` foi substituída por `.site` (o seu domínio de deploy) e a nova opção `.base` (o subcaminho do seu deploy).
- `.markdownOptions` foi substituída por `.markdown`, um objeto de configuração similar com algumas pequenas mudanças para simplificar a configuração de Markdown.
- `.sitemap` foi movida para a integração [@astrojs/sitemap](https://www.npmjs.com/package/@astrojs/sitemap).

Se você executar Astro com uma configuração desatualizada, você irá ver um aviso com instruções em como atualizar. Veja nossa atualizada [Referência de Configuração](/pt-br/reference/configuration-reference/) para mais informações em como atualizar.

Leia [RFC0019](https://github.com/withastro/rfcs/blob/main/proposals/0019-config-finalization.md) para um maior contexto sobre estas mudanças.

### Nova API de Markdown

Astro v0.26 lançou uma completamente nova API de Markdown para o seu conteúdo. Isso inclui três principais mudanças para o usuário:
- Agora você pode usar `import`/`import()` para conteúdo markdown utilizando uma importação ESM diretamente.
- A nova API `Astro.glob()`, para importações glob mais fáceis (especialmente para Markdown).
- **MUDANÇA RADICAL:** `Astro.fetchContent()` foi removido e substituído por `Astro.glob()`
- **MUDANÇA RADICAL:** Objetos Markdown tem uma nova interface atualizada.

```diff
// v0.25
- let todosPosts = Astro.fetchContent('./posts/*.md');
// v0.26+
+ let todosPosts = await Astro.glob('./posts/*.md');
```

Quando migrar, tome cuidado com a nova interface do objeto Markdown. Frontmatter, por exemplo, foi movido para a propriedade `.frontmatter`, então referências como `post.titulo` devem ser modificadas para `post.frontmatter.title`.

Isto deve resolver muitos dos problemas dos usuários de Markdown, incluindo algumas melhorias de performance para sites grandes.

Leia [RFC0017](https://github.com/withastro/rfcs/blob/main/proposals/0017-markdown-content-redesign.md) para um maior contexto sobre estas mudanças.

### Novo Comportamento Padrão de Script

Tags `<script>` em componentes Astro agora passam por build, bundle e são otimizadas por padrão. Isso completa uma mudança de longo prazo para fazer a nossa sintaxe de componentes Astro mais consistente, correspondendo ao comportamento padrão otimizado que nossas tags `<style>` tem hoje.

Isso inclui algumas mudanças para se estar atento sobre:

- **RADICAL:** `<script hoist>` é o novo comportamento padrão de `<script>`. O atributo `hoist` foi removido. Para utilizar o novo comportamento padrão, se certifique de que não há outros atributos na tag `<script>`. Por exemplo, remova `type="module"` se você o estava utilizando antes.
- Nova diretiva `<script is:inline>`, para reverter uma tag `<script>` ao comportamento padrão anterior (sem passar por build, bundle, sem ser modificada pelo Astro).
- Nova diretiva `<style is:inline>`, para deixar uma tag style inline no template da página (similar ao comportamento anterior de `<script>`).
- Nova diretiva `<style is:global>` para substituir `<style global>` em futuros lançamentos.


```diff
// v0.25
- <script hoist type="module">
// v0.26+
+ <script>
```

Veja como utilizar [scripts no lado do cliente](/pt-br/core-concepts/astro-components/#scripts-no-lado-do-cliente) no Astro para mais detalhes.

Leia [RFC0016](https://github.com/withastro/rfcs/blob/main/proposals/0016-style-script-defaults.md) para mais contexto sobre estas mudanças.

### API `Astro.request` Atualizada

`Astro.request` foi mudada de nosso objeto customizado para um objeto `Request` padrão. Isto é parte de nosso projeto para usar mais APIs padrões da web, especialmente aonde SSR é uma preocupação. 

Isso inclui algumas mudanças para se estar atento sobre:

- Muda `Astro.request` para se tornar um objeto [Request](https://developer.mozilla.org/pt-BR/docs/Web/API/Request).
- Move `Astro.request.params` para `Astro.params`.
- Move `Astro.request.canonicalURL` para `Astro.canonicalURL`.

Leia [RFC0018](https://github.com/withastro/rfcs/blob/main/proposals/0018-astro-request.md) para mais contexto sobre essas mudanças.


### Outras Mudanças

- Melhora a API de `Astro.slots` para suportar a passagem de argumentos para slots baseados em funções. Isto permite componentes utilitários mais ergonômicos que aceitam uma função de callback como um filho.
- Atualiza a formatação da interface de linha de comando, especialmente de relatório de erros.
- Atualiza `@astrojs/compiler`, corrigindo alguns bugs relacionadas a utilização de RegExp no frontmatter.

## Migrando para a v0.25

### Integrações Astro

A configuração `renderers` foi substituída por um novo e oficial, sistema de integrações! Isto permite algumas novas funcionalidades realmente animadoras para o Astro. Você pode ler nosso guia [Usando Integrações](/pt-br/guides/integrations-guide/) para mais detalhes em como utilizar esse novo sistema.

Integrações substituem nosso conceito original de `renderers`, vindo com algumas mudanças radicais e novos padrões para usuários existentes. Essas mudanças são abordadas abaixo.

#### Removido: Suporte Integrado para Frameworks

Anteriormente, React, Preact, Svelte e Vue eram todos inclusos no Astro por padrão. A partir da v0.25.0, Astro não virá mais com qualquer renderizador integrado. Se você não tinha uma entrada `renderers` já definida no seu projeto, você agora precisará instalar esses frameworks por si mesmo.

Leia nosso [guia passo-a-passo](/pt-br/guides/integrations-guide/) para aprender como adicionar uma nova integração Astro para o(s) framework(s) que você atualmente utiliza.

#### Descontinuado: Renderers

:::note
Leia esta seção se você já tiver "renderers" customizados definidos no seu arquivo de configuração.
:::

O novo sistema de integrações substitui o antigo sistema de `renderers`, incluindo os pacotes `@astrojs/renderer-*` publicados no npm. De agora em diante, `@astrojs/renderer-react` se torna `@astrojs/react`, `@astrojs/renderer-vue` se torna `@astrojs/vue`, e por aí vai.


**Para migrar:** atualize Astro para a `v0.25.0` e então execute `astro dev` ou `astro build` com o seu antigo arquivo de configuração contendo a desatualizada configuração `"renderers"`. Você irá imediatamente ver um aviso te dizendo as exatas modificações que você precisa fazer em seu arquivo `astro.config.mjs`, baseado na configuração atual. Você também pode atualizar seus pacotes por si mesmo, utilizando a tabela abaixo.

Para um passo-a-passo mais detalhado, veja nosso [guia passo-a-passo](/pt-br/guides/integrations-guide/) para aprender como substituir renderers existentes com uma nova integração de framework no Astro.

```diff
# Instale suas novas integrações e frameworks:
# (Leia o passo-a-passo completo: https://docs.astro.build/pt-br/guides/integrations-guide)
+ npm install @astrojs/lit lit
+ npm install @astrojs/react react react-dom
```
```diff
# Então, atualize seu arquivo `astro.config.mjs`:
# (Leia o passo-a-passo completo: https://docs.astro.build/pt-br/guides/integrations-guide)
+ import lit from '@astrojs/lit';
+ import react from '@astrojs/react';

export default {
-   renderers: ['@astrojs/renderer-lit', '@astrojs/renderer-react'],
+   integrations: [lit(), react()],
}
```


| Renderers descontinuados no npm | Integrações no npm para a v0.25+ |
| --------------------------- | -------------------------- |
| @astrojs/renderer-react     | @astrojs/react             |
| @astrojs/renderer-preact    | @astrojs/preact            |
| @astrojs/renderer-solid     | @astrojs/solid-js          |
| @astrojs/renderer-vue       | @astrojs/vue               |
| @astrojs/renderer-svelte    | @astrojs/svelte            |

#### Lidando com Dependências de Pares

:::note
Leia esta seção se: Você está no Node v14 **ou** se você utiliza algum gerenciador de pacotes que não seja o npm.
:::

Diferente dos antigos renderers, integrações não mais marcam os próprios frameworks ("react", "svelte", "vue", etc.) como dependências diretas da integração. No lugar, você deve agora instalar os pacotes dos seus frameworks *assim como* suas integrações.

```diff
# Exemplo: Instale integrações e frameworks juntos
- npm install @astrojs/react
+ npm install @astrojs/react react react-dom
```

Se você ver um aviso `"Cannot find package 'react'"` (ou similar) quando você inicia o Astro, isso significa que você precisa instalar tal pacote em seu projeto. Veja nossa [nota em dependências de pares](/pt-br/guides/troubleshooting/#cannot-find-package-x) no guia de solução de problemas para mais informações.

Se você estiver utilizando `npm` e Node v16+, então isso pode ser feito automaticamente para você pelo `npm`, desde a última versão do `npm` (v7+) ele instala dependências de pares assim automaticamente para você. Nesse caso, instalar um framework como "react" em seu projeto é opcional mas ainda uma etapa recomendada.

### Atualizado: Syntax Highlighting

Nós amamos encontrar padrões sensíveis que "apenas funcionam". Por conta disso, nós decidimos fazer [Shiki](https://github.com/shikijs/shiki) nosso novo sistema de syntax highlight. Ele vem pré-configurado com o tema `github-dark`, providenciando highlighting para seus blocos de código com nenhuma configuração ou classes CSS, folhas de estilo ou JS no lado do cliente. 

Verifique nossa nova [documentação de syntax highlighting](/pt-br/guides/markdown-content/#syntax-highlighting) para mais detalhes. **Se você prefere manter Prism como seu syntax highlighter**, [defina a opção `syntaxHighlight` para `'prism'`](/pt-br/guides/markdown-content/#configuração-do-prism) na configuração de Markdown do seu projeto.

#### O componente `<Prism />` tem um novo lar

Como parte de nossa missão de manter o núcleo do Astro o mais leve possível, nós movemos o componente integrado `Prism` de `astro/components` para o pacote `@astrojs/prism`. Agora você pode importar este componente de `@astrojs/prism` assim:


```astro
---
import { Prism } from '@astrojs/prism';
---
```

Já que o pacote `@astrojs/prism` ainda vem junto com o núcleo do `astro`, você não precisa instalar nada novo, nem adicionar Prism como uma integração! Porém, note que nós _planejamos_ extrair `@astrojs/prism` (e o syntax highlighting do Prism como um todo) para um pacote instalável e separado no futuro. veja a [referência da API do componente `<Prism />`](/pt-br/reference/api-reference/#prism-) para saber mais.

### Aprimoramento do Parser de CSS

Nosso parser de CSS interno foi atualizado, e agora vem com melhor suporte para sintaxe CSS avançada, como container queries. Isto deve ser na maior parte uma mudança invisível para a maioria dos usuários, mas esperamos que usuário mais avançados irão aproveitar o suporte a novas funcionalidades do CSS.

## Migrando para a v0.24

:::note
A nova estratégia de build é o padrão da v0.24. Se você tiver problemas, você pode continuar utilizando a antiga estratégia de build passando a flag `--legacy-build`. Por favor [abra uma issue](https://github.com/withastro/astro/issues/new/choose) para que possamos resolver problemas na nova estratégia de build.
:::

A v0.24 introduziu uma nova estratégia de *build estática* que modifica o comportamento de algumas funcionalidades. Em versões anteriores do Astro isso estava disponível como um comportamento que você poderia optar por utilizando a flag: `--experimental-static-build`.

Para migrar dessa transição, esteja ciente das seguintes mudanças que vão ser necessárias para mover para o novo motor de build. Você pode fazer essas mudanças na sua base de código a qualquer momento para que você esteja a frente do previsto.

### Descontinuado: `Astro.resolve()`

`Astro.resolve()` permite que você consiga URLs resolvidas para assets que você gostaria de referenciar no navegador. Isto era mais comumente utilizado dentro das tags `<link>` e `<img>` para carregar arquivos CSS e imagens quando necessário. Infelizmente, isso não vai mais funcionar por conta do Astro agora fazer build de assets em *tempo de build* ao invés de fazer em *tempo de renderização*. Você vai querer atualizar suas referências a assets para uma das opções seguras para o futuro a partir de agora:

#### Como Resolver Arquivos CSS

**1. Importação ESM (Recomendado)**

**Exemplo:** `import './estilo.css';`
**Quando utilizar isto:** Se o seu arquivo CSS está dentro do diretório `src/`, e você quiser funcionalidades de build e otimização automática de CSS.

Utilize uma importação ESM para adicionar algum CSS na página. Astro detecta essas importações de CSS e então faz build, otimiza e adicionar o CSS para a página automaticamente. Esta é a forma mais fácil de migrar de `Astro.resolve()` ao mesmo tempo que se mantém as etapas de build/bundle automáticas que o Astro providencia.

```astro
---
// Exemplo: Astro irá incluir e otimizar este CSS para você automaticamente
import './estilo.css';
---
<html><!-- Sua página aqui --></html>
```

Importar arquivos CSS devem funcionar em qualquer lugar em que importações ESM são suportadas, assim como em:
- Arquivos JavaScript
- Arquivos TypeScript
- Frontmatter de componentes Astro
- Componentes de frameworks como React, Svelte e outros

Quando um arquivo CSS é importado utilizando este método, qualquer declaração de `@import` também é resolvida e colocada inline no arquivo CSS importado. Todas as referências de `url()` também são resolvidas relativas ao arquivo fonte, e quaisquer assets referenciados de `url()` serão incluidos na build final.


**2. URL de Caminho Absoluto**

**Exemplo:** `<link href="/estilo.css">`
**Quando utilizar isto:** Se o seu arquivo CSS está dentro de `public/`, e você prefere criar o seu elemento HTML `link` por si mesmo.

Você pode referenciar qualquer arquivo dentro do diretório `public/` usando um URL de caminho absoluto no template do seu componente. Esta é uma boa opção se você quiser controlar a tag `<link>` na página por si mesmo. Porém, essa abordagem pula o processamento de CSS, o bundle e otimizações que são providenciadas pelo Astro quando você utiliza o método com `import` descrito acima.

Nós recomendados utilizar a abordagem com `import` no lugar da abordagem utilizando uma URL de caminho absoluto, já que providencia a melhor performance e funcionalidades do CSS por padrão.

#### Como Resolver Arquivos JavaScript


**1. URL de Caminho Absoluto**

**Exemplo:** `<script src="/algum-script-externo.js" />`
**Quando utilizar isto:** Se o seu arquivo JavaScript está dentro de `public/`.

Você pode refenciar qualquer arquivo dentro do diretório `public/` com uma URL de caminho absoluto nos templates de seus componentes Astro. Esta é uma boa opção por padrão para scripts externos, já que isto te permite controlar a tag `<script>` na página por si mesmo.

Note que esta abordagem pula o processamento, o bundle e otimizações de JavaScript que são providenciadas pelo Astro quando você utiliza o método com `import` descrito acima. Porém, isso pode ser preferível para quaisquer scripts externos que já foram publicados e minificados separadamente do Astro. Se o seu script foi baixado de uma fonte externa, então este método é provavelmente preferível.

**2. Importação ESM via `<script hoist>`**

**Exemplo:** `<script hoist>import './algum-script-externo.js';</script>`
**Quando utilizar isto:** Se o seu script externo está dentro de `src/` e ele suporta o tipo de módulo ESM.

Utilize uma importação ESM dentro de um elemento `<script hoist>` em seu template Astro, e então Astro irá incluir o arquivo JavaScript em sua build final. Astro detecta estas importações de JavaScript no lado do cliente e então faz build, otimiza e adicionar o JavaScript à página automaticamente. Esta é a forma mais fácil de migrar de `Astro.resolve()` enquanto se mantém as etapas de build/bundle automáticas que o Astro providencia.

```astro
<script hoist>
  import './algum-script-externo.js';
</script>
```

Note que o Astro irá fazer bundle deste script externo com o resto do seu JavaScript no lado do cliente, e irá carregá-lo no contexto de script `type="module"`. Alguns arquivos JavaScript mais antigos podem não ter sido escritos para o contexto `module`, nesse caso, eles podem precisar ser atualizados para utilizar este método.

#### Como Resolver Imagens e Outros Assets

**1. URL de Caminho Absoluto (Recomendado)**

**Exemplo:** `<img src="/pinguin.png">`
**Quando utilizar isto:** Se o seu asset está dentro de `public/`.

Se você colocar suas imagens dentro de `public/` você pode então referenciá-las de forma segura por uma URL de caminho diretamente nos templates de seus componentes. Esta é a forma mais simples de referenciar um asset que você pode utilizar hoje, e é recomendado para a maioria dos usuários que estão começando com Astro.

**2. Importação ESM**

**Exemplo:** `import urlImg from './pinguin.png'`
**Quando utilizar isto:** Se o seu asset está dentro do diretório `src/` e você quer funcionalidades de otimização automática como fazer hash de nomes de arquivos.

Isto funciona dentro de qualquer componente JavaScript ou Astro, e retorna a URL resolvida para a imagem final. Assim que você tiver resolvido a URL, você pode utilizá-la em qualquer lugar dentro do template do componente.

```astro
---
// Exemplo: Astro irá incluir esta imagem na sua build final
import urlImg from './pinguin.png';
---
<img src={urlImg} />
```

Similar a forma com que Astro lida com CSS, a importação ESM permite ao Astro realizar algumas simples otimizações de build para você automaticamente. Por exemplo, qualquer asset dentro de `src/` que é importado utilizando uma importação ESM (ex: `import urlImg from '/pinguin.png'`) terá seu nome de arquivo em hash automaticamente. Isto te permite fazer um cache mais agressivo do arquivo no servidor, melhorando a performance do usuário. No futuro, Astro pode adicionar mais otimizações como esta. 

**Dica:** Se você não gosta de importações ESM estáticas, Astro também suporta importações ESM dinâmicas. Nós apenas recomendados esta opção se você prefere esta sintaxe: `<img src={(await import('./pinguin.png')).default} />`.

### Descontinuado: Processamento Padrão de `<script>`

Anteriormente, todos os elementos `<script>` eram lidos a partir do HTML final resultante e eram processados + passsam por bundle automaticamente. Esse comportamento não é mais o padrão. A partir da v0.24, você deve optar pelo processamento do elemento `<script>` através do atributo `hoist`. O `type="module"` também é necessário para módulos hoisted. 

```astro
<script>
  // Será renderizado no HTML exatamente como escrito!
  // Importações ESM não serão resolvidas de forma relativa ao arquivo.
</script>
<script type="module" hoist>
  // Processado! Passou por bundle! Importações ESM funcionam, até mesmo em pacotes do npm.
</script>
```


## Migrando para a v0.23

### Erro Sass Não Encontrado

```
Preprocessor dependency "sass" not found. Did you install it?
```

Em nossa missão para reduzir o tamanho de npm install, nós movemos o [Sass](https://sass-lang.com/) como uma dependência opcional. Se você utiliza Sass em seu projeto, você vai querer se certificar de que executou `npm install sass --save-dev` para salvá-lo como uma dependência.

### Descontinuado: HTML não Escapado

No Astro v0.23+, conteúdo HTML não escapado em expressões não é mais possível.
Em lançamentos futuros, conteúdo em expressões terão strings escapadas para protegê-lo de injeção HTML não-intencional.

```diff
- <h1>{titulo}</h1> <!-- <h1>Olá <strong>Mundo</strong></h1> -->
+ <h1>{titulo}</h1> <!-- <h1>Olá &lt;strong&gt;Mundo&lt;/strong&gt;</h1> -->
```

Para continuar injetando HTML não-sanitizado, agora você pode utilizar `set:html`.

```diff
- <h1>{titulo}</h1>
+ <h1 set:html={titulo} />
```

Para evitar o uso de um elemento de invólucro, `set:html` pode ser utilizado com `<Fragment>`.

```diff
- <h1>{titulo}!</h1>
+ <h1><Fragment set:html={titulo}>!</h1>
```

Você também pode ser proteger de injeção não-intencional de HTML com `set:text`.

```astro
<h1 set:text={titulo} /> <!-- <h1>Olá &lt;strong&gt;Mundo&lt;/strong&gt;</h1> -->
```

## Migrando para a v0.21

### Vite

A partir da v0.21, Astro é construído com [Vite].
Por consequência, configurações escritas em `snowpack.config.mjs` devem ser movidas para `astro.config.mjs`.


```js
// @ts-check

/** @type {import('astro').AstroUserConfig} */
export default {
  renderers: [],
  vite: {
    plugins: [],
  },
};
```

Para aprender mais sobre como configurar o Vite, por favor visite seu [guia de configuração](https://vitejs.dev/config/).

#### Plugins Vite

Em Astro v0.21+, plugins Vite podem ser configurados em `astro.config.mjs`.

```js
import { imagetools } from 'vite-imagetools';

export default {
  vite: {
    plugins: [imagetools()],
  },
};
```

Para aprender mais sobre plugins Vite, por favor visite seu [guia de plugins](https://vitejs.dev/guide/using-plugins.html).

#### Mudanças do Vite para Renderers

Em Astro v0.21+, plugins agora devem utilizar `viteConfig()`.

```diff
// renderer-svelte/index.js
+ import { svelte } from '@sveltejs/vite-plugin-svelte';

export default {
  name: '@astrojs/renderer-svelte',
  client: './client.js',
  server: './server.js',
-  snowpackPlugin: '@snowpack/plugin-svelte',
-  snowpackPluginOptions: { compilerOptions: { hydratable: true } },
+  viteConfig() {
+    return {
+      optimizeDeps: {
+        include: ['@astrojs/renderer-svelte/client.js', 'svelte', 'svelte/internal'],
+        exclude: ['@astrojs/renderer-svelte/server.js'],
+      },
+      plugins: [
+        svelte({
+          emitCss: true,
+          compilerOptions: { hydratable: true },
+        }),
+      ],
+    };
+  },
}
```

Para aprender mais sobre plugins Vite, por favor visite seu [guia de plugins](https://vitejs.dev/guide/using-plugins.html).

:::note
Em lançamentos anteriores, esses plugins eram configurados com `snowpackPlugin` ou `snowpackPluginOptions`.
:::

### Atalhos

Em Astro v0.21+, atalhos de importação podem ser adicionados em `tsconfig.json` ou `jsconfig.json`.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["src/components/*"]
    }
  }
}
```

_Estes aliases são automaticamente integrados no [VSCode](https://code.visualstudio.com/docs/languages/jsconfig) e em outros editores._

### Extensões de Arquivos em Importações

Em Astro v0.21+, arquivos precisam ser referenciados com suas extensões, exatamente como estão no disco. Neste exemplo, `Div.tsx` precisaria ser referenciado como `Div.tsx`, não `Div.jsx`.

```diff
- import Div from './Div.jsx' // Astro v0.20
+ import Div from './Div.tsx' // Astro v0.21
```

Esta mesma mudança se aplica para arquivos que são compilados para CSS como `Div.scss`:

```diff
- <link rel="stylesheet" href={Astro.resolve('./Div.css')}>
+ <link rel="stylesheet" href={Astro.resolve('./Div.scss')}>
```

### Removido: Componentes no Frontmatter

Anteriormente, você poderia criar mini componentes Astro dentro do Frontmatter Astro, utilizando sintaxe JSX ao invés da sintaxe de componentes Astro. Isto sempre foi um tipo de hack, mas no novo compilador isto se tornou impossível de dar suporte. Nós esperamos reintroduzir esta funcionalidade em um lançamento futuro do Astro utilizando uma API diferente e independente do JSX. 

Para migrar para a v0.21+, por favor converta todos os componentes Astro JSX (qualquer componente Astro criado dentro do frontmatter de outro componente) como seus próprios componentes isolados.


### Mudanças na Estilização

#### Autoprefixer

Autoprefixer não é mais executado por padrão. Para habilitá-lo:

1. Instale a versão mais recente (`npm i autoprefixer`)
2. Crie um arquivo `postcss.config.cjs` na raiz do seu projeto com:
   ```js
   module.exports = {
     plugins: {
       autoprefixer: {},
     },
   };
   ```

#### Tailwind CSS

Certifique-se de que você tem PostCSS instalado. Isto era opcional em versões anteriores, mas é obrigatório agora:

1. Instale a versão mais recente do postcss (`npm i -D postcss`)
2. Crie um arquivo `postcss.config.cjs` na raiz do seu projeto com:
   ```js
   module.exports = {
     plugins: {
       tailwindcss: {},
     },
   };
   ```
  Para mais informações, leia a [documentação do Tailwind CSS](https://tailwindcss.com/docs/installation#add-tailwind-as-a-post-css-plugin).


### Problemas Conhecidos

#### Importações no Topo

No Astro v0.21+, um bug que foi introduzido faz com que seja obrigatório importações dentro de seus componentes estarem no topo do seu frontmatter.

```astro
---
import Componente from '../components/Componente.astro'
const aondeColocarMInhasImportacoes = "no topo!"
---
```


[vite]: https://vitejs.dev
