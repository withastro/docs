---
layout: ~/layouts/MainLayout.astro
title: Estlização e CSS
description: Aprenda como estilizar componentes com Astro.
i18nReady: true
setup: |
  import Since from '../../../components/Since.astro';
---


Astro foi desenvolvido pensando em tornar a estilização e a escrita de CSS fácil. Escreva seu próprio CSS diretamente em componentes Astro ou importe sua biblioteca CSS favorita como [Tailwind][tailwind]. Além disso, linguagens avançadas de estilização com [Sass][sass] e [Less][less] também são suportadas.

## Estilização em Astro

Estilizar um componente Astro é tão fácil quanto adicionar uma tag `<style>` no seu componente ou template de página. E quando você coloca uma tag `<style>` dentro de um componente Astro, Astro vai detectar o CSS e manipular os estilos para você automaticamente.

```astro
<style>
    h1 { color: red; }
</style>
```

### Estilos com Escopo

As regras de CSS em `<style>` no Astro são automaticamente adicionadas a **um escopo por padrão**. Estilos com escopo são compilados nos bastidores para serem somente aplicados no HTML escrito dentro do mesmo componente onde a regra CSS foi definida. O CSS que você escreve dentro de um componente é automaticamente encapsulado dentro desse componente.

```diff
<style>
-  h1 { color: red; }
+  h1.astro-HHNQFKH6 { color: red; }
-  .text { color: blue; }
+  .text.astro-HHNQFKH6 { color: blue; }
</style>
```

Estilos com escopo não conflitam e não irão impactar o restante do seu site. Em Astro, não é um problema utilizar seletores de baixa especificidade como `h1{}` ou `p{}` pois eles serão compilados com escopos no resultado final. 

Estilos com escopo também não serão aplicados em outros componentes astro contidos dentro de seu template.  Se você precisa estilizar um componente filho, considere envolver esse componente em uma `<div>` ( ou em outro elemento ) para que você possa então estilizá-lo.

#### Estilos Globais

Ao mesmo tempo que nós recomendamos estilos com escopo para a maioria dos componentes, você pode eventualmente ter uma razão válida para escrever CSS global. Você pode optar por remover CSS com escopo automático adicionando o atributo `is:global` na tag `<style>`.

```html
<style is:global>
  /* Sem escopo, entregue como está para o navegador.
     Aplica para todas as tags <h1> do seu site. */
  h1 { color: red; }
</style>
```

Você pode também mesclar regras CSS globais e com escopo juntas na mesma tag `<style>` usando o seletor `:global()`. Isto se tornar um padrão poderoso para aplicação de estilos CSS em filhos de seu componente.

```astro
<style>
  /* Em escopo somente para este componente. */
  h1 { color: red; }
  /* Mesclado: Aplica somente para elementos filhos (`h1`). */
  article :global(h1) {
    color: blue;
  }
</style>
<h1>Título</h1>
<article><slot /></article>
```

Isto é uma ótima forma de estilizar coisas como postagens em blogs ou documentos alimentados por conteúdos de um CMS, onde o conteúdo fica fora do Astro. Contudo, seja cuidadoso: os componentes cuja aparência muda de acordo com a condição de que ele tem um certo parente, torna mais difícil solucionar problemas futuros que o envolvam.

Estilos com escopo são recomendados para serem usados sempre que possível. E estilos globais, quando necessários.

### Variáveis no CSS

<Since v="0.21.0" />

Em Astro, `<style>` pode referenciar quaisquer variáveis disponíveis na página. Ademais, você pode também passar variáveis CSS diretamente do front matter do seu componente usando a diretiva `define:vars`.

```astro
---
const corPrimeiroPlano = "rgb(221 243 228)";
const corPlanoFundo = "rgb(24 121 78)";
---
<style define:vars={{ corPrimeiroPlano, corPlanoFundo }}>
  h1 {
    background-color: var(--corPlanoFundo);
    color: var(--corPrimeiroPlano);
  }
</style>
<h1>Olá</h1>
```

📚 Veja nossa [página de referência de diretivas](/pt-br/reference/directives-reference/#definevars) para saber mais sobre `define:vars`.

## Estilos Externos

Há duas formas para incluir folhas de estilos globais e externas: uma importação ESM para arquivos dentro de seu projeto, e com um link URL absoluto para arquivos em seu diretório `public/` ou disponíveis fora de seu projeto.

📚 Leia mais sobre como utilizar [assets estáticos](/pt-br/guides/imports/) localizados no diretório `public/` ou `src/`.

### Importe uma Folha de Estilos Local


:::caution[Utilizando um pacote do npm?]
Você talvez precise atualizar o seu astro.config quando estiver importando CSS de pacotes do npm. Veja a [seção de importação de uma folha de estilos de um pacote do npm](#importe-uma-folha-de-estilos-de-um-pacote-do-npm) abaixo.
:::

Você pode importar folhas de estilos no front matter do seu componente Astro usando a sintaxe de importação ESM. Importação de CSS funcionam como [qualquer outra importação ESM em um componente Astro](/pt-br/core-concepts/astro-components/#o-script-do-componente), que deve ser referenciada **relativo para o componente** e obrigatoriamente deve ser escrito no **início** do script do seu componente junto com outras importações.

```astro
---
// Astro irá fazer bundle e otimizar este CSS para você automaticamente
// Isto também funciona para arquivos pré-processados como .scss, .styl, etc.
import '../estilos/utils.css';
---
<html><!-- Sua página aqui --></html>
```

`import` de CSS por meio de ESM é suportado dentro de qualquer arquivo JavaScript, incluindo componentes JSX como React e Preact. Isto pode ser útil para escrever estilos por componente de forma granular para seus componentes React.

### Importe uma Folha de Estilos de um Pacote do NPM

Você talvez precise incluir uma folha de estilos de um pacote externo. Isso é especialmente comum para utilitários como [Open Props](https://open-props.style/). Se seu pacote **recomenda usar uma extensão de arquivo** (ex.: `nome-do-pacote/estilos.css` ao invés de `nome-do-pacote/estilos`), isso deve funcionar como qualquer importação de uma folha de estilos local.

```astro
---
// src/pages/página-qualquer.astro
import 'nome-do-pacote/estilos.css';
---
<html><!-- Sua página aqui --></html>
```
Se seu pacote **não recomenda usar uma extensão de arquivo** (ex.: `nome-do-pacote/estilos`), antes, você vai precisar atualizar sua configuração Astro!

Digamos que você está importando um arquivo CSS de um `nome-do-pacote` chamado `normalize` (com a extensão omitida). Para garantir que nós podemos pré-renderizar sua página corretamente, adicione `nome-do-pacote` para [o array vite.ssr.noExternal](https://vitejs.dev/config/#ssr-noexternal): 

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    ssr: {
      noExternal: ['nome-do-pacote'],
    }
  }
})
```

:::note
Isso é uma configuração [específica do Vite](https://vitejs.dev/config/#ssr-noexternal) que não tem relação com (ou necessita de) [SSR do Astro](/pt-br/guides/server-side-rendering/).
:::

Agora, você está livre para importar `nome-do-pacote/normalize`. Isto passará por bundle e será otimizado pelo Astro como qualquer outra folha de estilos local.

```astro
---
// src/pages/página-qualquer.astro
import 'nome-do-pacote/normalize';
---
<html><!-- Sua página aqui --></html>
```

### Inclua uma Folha de Estilos Estática via "link" tags

Você pode também usar o elemento `<link>` para incluir uma folha de estilos na página. Isto deve ser um caminho de URL absoluto para um arquivo CSS localizado no seu diretório `/public`, ou uma URL para um website externo. Note que valores relativos de href para o elemento `<link>` não são suportados.


```html
<head>
  <!-- Local: /public/estilos/global.css -->
  <link rel="stylesheet" href="/estilos/global.css" />
  <!-- Externo  -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.24.1/themes/prism-tomorrow.css">
</head>
```

Como esta abordagem usa o diretório `public/`, ela pula o processamento normal do CSS, o processo de bundle e outras otimizações feitas por Astro. Sendo assim, se você precisa desses recursos, use o método de [importe uma folha de estilos](#importe-uma-folha-de-estilos-local) ensinado acima.


## Integrações CSS

Astro vem com suporte para adicionar bibliotecas, ferramentas, e frameworks CSS populares para seu projeto como [Tailwind][tailwind] e mais!

📚 Veja o [Guia de Integrações](/pt-br/guides/integrations-guide/) para instruções sobre instalação, importação, e configuração destas integrações.


## Pré-processadores CSS

Astro suporta pré-processadores tais como [Sass][sass], [Stylus][stylus], e [Less][less] através de [Vite][vite-preprocessors].

### Sass

```
npm install -D sass
```
Use `<style lang="scss">` ou `<style lang="sass">` em arquivos `.astro`

### Stylus

```
npm install -D stylus
```
Use `<style lang="styl">` ou `<style lang="stylus">` em arquivos `.astro`

### Less

```
npm install -D less
```
Use `<style lang="less">` em arquivos `.astro`.

### Em componentes de frameworks

Você pode também usar todos os pré-processadores CSS listados acima dentro de frameworks JS também! Tenha certeza de seguir os padrões que cada framework recomenda:

- **React** / **Preact**: `import Estilos from './estilos.module.scss'`;
- **Vue**: `<style lang="scss">`
- **Svelte**: `<style lang="scss">`

## PostCSS

Astro vem com PostCSS incluído como parte de [Vite](https://vitejs.dev/guide/features.html#postcss). E para configurar PostCSS para seu projeto, crie um arquivo `postcss.config.js` na raiz de seu projeto. Você pode importar plugins usando `require()` após os instalar (por exemplo `npm i autoprefixer`).

```js
// ./postcss.config.js

module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano'),
  ],
};
```


---


## Bibliotecas e Frameworks

### 📘 React / Preact

Arquivos `.jsx` suporta tanto CSS global quanto Módulos CSS. E para habilitar o segundo, use a extensão `.module.css` (ou `.module.scss` / `.module.sass` se você estiver usando Sass). 

```js
import './global.css'; // inclui CSS global
import Estilos from './estilos.module.css'; // Utiliza Módulos CSS (deve obrigatoriamente terminar em `.module.css`, `.module.scss`, ou `.module.sass`!)
```

### 📗 Vue

Em Astro, Vue suporta os mesmos métodos que `vue-loader` suporta:

- [vue-loader - CSS com escopo][vue-scoped]
- [vue-loader - Módulos CSS][vue-css-modules]

### 📕 Svelte

Em Astro, Svelte também funciona como esperado: [Documentação de estilização no Svelte][svelte-style].

## Avançado

:::caution
Tenha cuidado quando contornar o bundle de CSS interno do Astro! Estilos não serão mais automaticamente incluídos no resultado final, sendo assim, é de sua responsabilidade certificar-se de que o arquivo referenciado está adequadamente incluído no resultado final.
:::

### Importação de CSS com `?raw`

Para casos de uso avançado, CSS pode ser lido diretamente do disco sem passar por bundle ou ser otimizado por Astro. Isto pode ser útil quando você precisa de um controle completo sobre um pedaço de código CSS, e necessita contornar a manipulação de CSS automática do Astro.

Isto não é recomendável para a maioria dos usuários.

```astro
---
// Exemplo avançado! Não recomendável para a maioria dos usuários.
import estilosCSSBruto from '../estilos/principal.css?raw';
---
<style is:inline set:html={estilosCSSBruto}></style>
```

Veja a [documentação do Vite](https://vitejs.dev/guide/assets.html#importing-asset-as-url) para detalhes completos.

### Importação de CSS com `?url`

Para casos de uso avançado, você pode importar uma referência URL direta para um arquivo CSS dentro de seu projeto no diretório `src/`. Isto pode ser útil quando você necessita de controle completo sobre como um arquivo é incluído na página. Entretanto, isto vai prevenir a otimização desse arquivo CSS com o resto do CSS da sua página.

Isto não é recomendável para a maioria dos usuários. Em vez disso, coloque os arquivos CSS dentro de `public/` para conseguir uma referência URL consistente. 

:::caution
Importar um arquivo CSS menor com `?url` talvez retorne o conteúdo dos arquivos CSS codificado em base64 como uma URL de dados, mas somente em sua build final. Sendo assim, você pode escrever seu código com suporte para URLs codificadas  (`data:text/css;base64,...`) ou configurar a opção  [`vite.build.assetsInlineLimit`](https://vitejs.dev/config/#build-assetsinlinelimit) para `0` para desabilitar esta funcionalidade.
:::

```astro
---
// Exemplo avançado! Não recomendável para a maioria dos usuários.
import urlEstilos from '../estilos/principal.css?url';
---
<link rel="preload" href={urlEstilos} as="style">
<link rel="stylesheet" href={urlEstilos}>
```

Veja a [documentação do Vite](https://vitejs.dev/guide/assets.html#importing-asset-as-url) para detalhes completos.





[less]: https://lesscss.org/
[sass]: https://sass-lang.com/
[stylus]: https://stylus-lang.com/
[svelte-style]: https://svelte.dev/docs#component-format-style
[tailwind]: https://github.com/withastro/astro/tree/main/packages/integrations/tailwind
[vite-preprocessors]: https://vitejs.dev/guide/features.html#css-pre-processors
[vue-css-modules]: https://vue-loader.vuejs.org/guide/css-modules.html
[vue-scoped]: https://vue-loader.vuejs.org/guide/scoped-css.html
