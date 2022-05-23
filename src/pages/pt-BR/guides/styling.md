---
layout: ~/layouts/MainLayout.astro
title: Estilo e CSS
description: Aprenda como estilizar componentes com Astro.
i18nReady: true
setup: |
  import Since from '../../../components/Since.astro';
---


Astro foi desenvolvido pensando em tornar a estilização e a escrita de CSS fácil. Escreva seu próprio CSS diretamente em componentes astro ou importe sua biblioteca CSS favorita como [Tailwind][tailwind]. Além disso, linguagens otimizadas de estilo com [Sass][sass] e [Less][less] são também suportadas.

## Estilo em Astro

Aplicar um estilo em um componente astro é tão fácil quanto adicionar uma tag `<style>` no seu componente ou em uma página template. E quando você coloca uma tag `<style>` dentro de um componente astro, Astro vai detectar o CSS e manipular os estilos para você, automaticamente.

```astro
<style>
    h1 { color: red; }
</style>
```

### Estilos com escopo

Nas regras de `<style>` em Astro são automaticamente aplicadas **um escopo por padrão**. Estilos com escopo são compilados nos bastidores para somente aplicar no HTML escrito dentro do mesmo componente onde a regra CSS foi definida. O CSS que você escreve dentro de um componente é automaticamente empacotado dentro desse componente.

```diff
<style>
-  h1 { color: red; }
+  h1.astro-HHNQFKH6 { color: red; }
-  .text { color: blue; }
+  .text.astro-HHNQFKH6 { color: blue; }
</style>
```

Estilos com escopo não conflitam e não irão impactar o restante do seu site. Em Astro, não é um problema selecionar seletores de baixa especificidade com `h1{}` ou `p{}` porque eles serão compilados com escopos no resultado final. 

Estilos com escopo também não aplicarão para outros componentes astro contidos dentro de seu template.  Se você precisa estilizar um componente filho, considere envolver esse componente em uma `<div>` ( ou em outro elemento ) que você pode então aplicar um estilo.

#### Estilos globais

Ao mesmo tempo que nós recomendamos estilos com escopo para a maioria dos componentes, você pode eventualmente ter uma razão válida para escrever CSS global. Você pode remover CSS com escopo aplicando o atributo `is:global` na `<style>` tag.

```html
<style is:global>
  /* Sem escopo, entregue como está para o navegador.
     Aplica para todas as tags <h1> do seu site. */
  h1 { color: red; }
</style>
```

Você pode também mesclar regras CSS globais e com escopo juntas na mesma `<style>` tag usando o seletor `:global()`. Isto tornar-se um padrão poderoso para aplicação de estilos CSS para filhos de seus componentes.

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

Isto é uma ótima forma de estilizar coisas como posts de blogs, ou documentos alimentados por conteúdos de um CMS onde o conteúdo fica fora do Astro. Contudo, seja cuidadoso: os componentes cuja aparência muda de acordo com a condição de que ele tem um certo parente torna-o difícil para testar.

Estilos com escopo são recomendados para serem usados sempre que possível. E estilos globais, quando necessários.

### Variáveis no CSS

<Since v="0.21.0" />

Em Astro, a `<style>` pode referenciar quaisquer variáveis disponíveis na página. Ademais, você pode também passar variáveis CSS diretamente do front matter do seu componente usando a diretiva `define:vars`.

```astro
---
const foregroundColor = "rgb(221 243 228)";
const backgroundColor = "rgb(24 121 78)";
---
<style define:vars={{ foregroundColor, backgroundColor }}>
  h1 {
    background-color: var(--backgroundColor);
    color: var(--foregroundColor);
  }
</style>
<h1>Olá</h1>
```

📚 Veja nossa [página da referência](/pt-BR/reference/directives-reference/#definevars) de diretivas para saber mais sobre `define:vars`.

## Estilos externos

Há duas formas para incluir folhas de estilos globais e externas: um importe ESM para arquivos dentro da fonte de seu projeto, e com um link URL absoluto para arquivos em seu diretório `public/` ou disponíveis fora de seu projeto.

📚 Leia mais sobre usando [assets estáticos](/pt-BR/guides/imports/) localizados no diretório `public/` ou `src/`.

### Importe uma folha de estilo

Você pode importar folhas de estilos no front matter do seu componente astro usando a sintaxe de importe ESM. CSS imports funcionam como [qualquer outro ESM import em um componente astro](/pt-BR/core-concepts/astro-components/#script-do-componente), que deve ser referenciado **relativo para o componente** e obrigatoriamente deve ser escrito no **início** de seu componente script junto com outros imports.

```astro
---
// Astro irá empacotar e otimizar este CSS para você automaticamente
// Isto também funciona para arquivos pré-processados como .scss, .styl, etc.
import '../styles/utils.css';
---
<html><!-- Sua página aqui --></html>
```

CSS `import` por meio de ESM são suportados dentro de qualquer arquivo JavaScript, incluindo componentes JSX como React e Preact. Isto pode ser útil para escrever estilos granular e por componente para seus componentes React.

### Inclua uma folha de estilo externa

Você pode também usar o elemento `<link>` para incluir uma folha de estilo na página. Isto deve ser um caminho de URL absoluto para um arquivo CSS localizado no seu diretório `/public`, ou uma URL para um website externo. Note que valores relativos de href para o elemento `<link>` não são suportados.


```html
<head>
  <!-- Local: /public/styles/global.css -->
  <link rel="stylesheet" href="/styles/global.css" />
  <!-- Externo  -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.24.1/themes/prism-tomorrow.css">
</head>
```

Como esta abordagem usa o diretório `public/`, ela pula o processamento normal do CSS, o empacotamento e outras otimizações feitas por Astro. Sendo assim, se você precisa dessas funcionalidades, use o método de [importação de uma folha de estilo](#importe-uma-folha-de-estilo) ensinado acima.


## Integrações CSS

Astro vem com suporte para adicionar bibliotecas, ferramentas, e frameworks CSS populares para seu projeto como [Tailwind][tailwind] e mais!

📚 Veja [o guia de integrações](/pt-BR/guides/integrations-guide/) para instruções sobre instalação, importação, e configuração destas integrações.


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

> Você pode também usar todos os pré-processadores CSS listados acima dentro de frameworks JS também! Tenha certeza de seguir os padrões que cada framework recomenda:

- **React** / **Preact**: `import Styles from './styles.module.scss'`;
- **Vue**: `<style lang="scss">`
- **Svelte**: `<style lang="scss">`

## PostCSS

Astro vem com PostCSS incluído como parte de [Vite](https://vitejs.dev/guide/features.html#postcss). E para configurar PostCSS para seu projeto, crie um arquivo `postcss.config.js` na raiz de seu projeto. Você pode importar plugins usando `require()`.

```js
// ./postcss.config.js

module.exports = {
  plugins: [
    require('postcss-preset-env'),
    require('autoprefixer'),
  ],
};
```


---


## Bibliotecas e frameworks

### 📘 React / Preact

Arquivos `.jsx` suporta tanto CSS global quanto CSS módulos. E para habilitar o segundo, use a extensão `.module.css` (ou `.module.scss` / `.module.sass` se você está usando Sass). 

```js
import './global.css'; // inclui CSS global
import Styles from './styles.module.css'; // Use módulos CSS (deve obrigatoriamente terminar em `.module.css`, `.module.scss`, ou `.module.sass`!)
```

### 📗 Vue

Em Astro, Vue suporta os mesmos métodos como `vue-loader` suporta.

- [vue-loader - CSS com escopo][vue-scoped]
- [vue-loader - Módulos CSS][vue-css-modules]

### 📕 Svelte

Em Astro, Svelte também funciona como esperado: [Documentação de estilos do Svelte][svelte-style].

## Avançado

> ⚠️AVISO⚠️: 
> Tenha cuidado quando contornando o empacotamento de CSS interno do Astro! Estilos não serão automaticamente incluídos no resultado final, sendo assim, é de sua responsabilidade certificar que o arquivo referenciado está adequadamente incluído no resultado final.

### `?raw` CSS imports

Para casos de uso avançado, CSS pode ser lido diretamente do disco sem ser empacotado ou otimizado por Astro. Isto pode ser útil quando você precisa de um controle completo sobre um pedaço de código CSS, e necessita contornar a manipulação de CSS automática do Astro.

Isto não é recomendável para a maioria dos usuários.

```astro
---
// Exemplo avançado! Não recomendável para a maioria dos usuários.
import rawStylesCSS from '../styles/main.css?raw';
---
<style is:inline set:html={rawStylesCSS}></style>
```

Veja a [documentação do Vite](https://vitejs.dev/guide/assets.html#importing-asset-as-url) para detalhes completos.

### `?url` CSS imports

Para casos de uso avançado, você pode importar uma referência URL direta para um arquivo CSS dentro de seu projeto no diretório `src/`. Isto pode ser útil quando você necessita controle completo sobre como um arquivo é incluído na página. Entretanto, isto vai prevenir a otimização desse arquivo CSS com o resto de sua página CSS.

Isto não é recomendável para a maioria dos usuários. Em vez disso, coloque os arquivos CSS dentro de `public/` para conseguir uma referência URL consistente. 

> ⚠️AVISO⚠️:  
> Importando um arquivo CSS menor com `?url` talvez retorne o conteúdo dos arquivos CSS encodado em base64 como uma URL de dados, mas somente em seu build final. Assim sendo, você pode escrever seu código com suporte para URLs encodadas  (`data:text/css;base64,...`) ou configurar a opção  [`vite.build.assetsInlineLimit`](https://vitejs.dev/config/#build-assetsinlinelimit) para `0` para desabilitar esta funcionalidade.

```astro
---
// Exemplo avançado! Não recomendável para a maioria dos usuários.
import stylesUrl from '../styles/main.css?url';
---
<link rel="preload" href={stylesUrl} as="style">
<link rel="stylesheet" href={stylesUrl}>
```

Veja a [documentação do Vite](https://vitejs.dev/guide/assets.html#importing-asset-as-url) para detalhes completos.





[less]: https://lesscss.org/
[sass]: https://sass-lang.com/
[stylus]: https://stylus-lang.com/
[svelte-style]: https://svelte.dev/docs#style
[tailwind]: https://github.com/withastro/astro/tree/main/packages/integrations/tailwind
[vite-preprocessors]: https://vitejs.dev/guide/features.html#css-pre-processors
[vue-css-modules]: https://vue-loader.vuejs.org/guide/css-modules.html
[vue-scoped]: https://vue-loader.vuejs.org/guide/scoped-css.html