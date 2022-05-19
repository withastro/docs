---
layout: ~/layouts/MainLayout.astro
title: Referência de Diretivas de Template
i18nReady: true
---

**Diretivas de template** são um tipo especial de atributo HTML disponível dentro do template de qualquer componente Astro (arquivos `.astro`).

Diretivas de template são utilizadas para controlar o comportamento de um elemento ou componente de alguma forma. Uma diretiva de template pode habilitar alguma funcionalidade do compilador que facilitaria sua vida (como utilizar `class:list` ao invés de `class`). Ou então, uma diretiva pode dizer para o compilador do Astro fazer algo especial com aquele componente (como hidratá-lo com `client:load`).

Esta página descreve todas as diretivas de template disponíveis para você no Astro e como elas funcionam.

## Regras

Para uma diretiva de template ser válida, ela deve:

- Incluir um dois-pontos `:` em seu nome, utilizando o padrão `X:Y` (ex: `client:load`).
- Ser visível ao compilador (ex `X {...atributo}` não funcionaria se `atributo` contivesse uma diretiva).

Algumas diretivas de template, mas não todas, podem receber um valor customizado:
- `<X client:load />` (recebe nenhum valor)
- `<X class:list={['alguma-classe-css']} />` (recebe um array)

Uma diretiva de template nunca é inclusa diretamente no HTML final resultante de um componente.

## Diretivas Comuns
### `class:list`

`class:list={...}` recebe um array de valores de classes e as converte em uma string de classes. Isso é inspirado pela famosa biblioteca utilitária [clsx](https://github.com/lukeed/clsx) feita por @lukeed, mas inserida diretamente no próprio Astro.

`class:list` recebe um array de vários diferentes tipos de valores:
- `string`: Adicionadas ao elemento `class`
- `Object`: Todas as chaves com valor `truthy` são adicionadas ao elemento `class`
- `Array`: Inserido como uma string dos valores
- `Set`: Inserido como uma string dos valores

```astro
<!-- Isso -->
<span class:list={[ 'ola tchau', { ola: true, mundo: true }, new Set([ 'ola', 'amigo' ]) ]} />
<!-- Se torna -->
<span class="olá tchau mundo amigo"></span>
```

Valores duplicados são removidos automaticamente.

### `set:html`

`set:html={string}` injeta uma string HTML em um elemento, similar a se utilizar `el.innerHTML`.

**O valor não é automaticamente sanitizado pelo Astro!** Tenha certeza de que o valor inserido é seguro, ou que você o sanitizou manualmente antes de passá-lo ao template. Esquecer disto vai te deixar exposto a [ataques de Cross Site Scripting](https://owasp.org/www-community/attacks/xss/).

```astro
---
const stringHtmlBruta = "Olá <strong>Mundo</strong>"
---
<h1>{stringHtmlBruta}</h1>
  <!-- Resultado final: <h1>Olá &lt;strong&gt;Mundo&lt;/strong&gt;</h1> -->
<h1 set:html={stringHtmlBruta} />
  <!-- Resultado final: <h1>Olá <strong>Mundo</strong></h1> -->
```

Você também pode utilizar `set:html` em um `<Fragment>` para evitar adicionar um elemento wrapper desnecessário. Isso pode ser especialmente útil ao se buscar HTML de um CMS.

```astro
---
const conteudoCMS = await buscarHtmlCMS();
---
<Fragment set:html={conteudoCMS}>
```

### `set:text`

`set:text={string}` injeta uma string de texto em um elemento, similar a se utilizar `el.innerText`. Diferente de `set:html`, o valor `string` que é passado é automaticamente sanitizado pelo Astro.

Isso é equivalente a apenas passar uma variável em uma expressão de template diretamente (ex: `<div>{algumTexto}</div>`) e por isso, essa diretiva não é comumente utilizada.

## Diretivas de Cliente

Estas diretivas controlam como [componentes de Frameworks de UI](/pt-BR/core-concepts/framework-components/) são hidratados na página.

Por padrão, um componente de framework de UI não é hidratado no cliente, Se nenhuma diretiva `client:*` é providenciada, seu HTML é renderizado na página sem nenhum JavaScript.

### `client:load`

- **Prioridade:** Alta
- **Útil para:** Elementos de UI imediatamente visiveis que precisam ser interativos o mais rápido possível.

Carrega e hidrata o JavaScript do componente imediatamente ao carregar a página.

```astro
<BotaoComprar client:load />
```
### `client:idle`

- **Prioridade:** Média
- **Útil para:** Elementos de UI de baixa prioridade, que não precisam ser imediatamente interativos.

Carrega e hidrata o JavaScript do componente assim que a página termina seu carregamento inicial e o evento `requestIdleCallback` é disparado. Se você estiver em um navegador que não suporta [`requestIdleCallback`](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/requestIdleCallback), então o evento [load](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/load_event) é utilizado.

```astro
<BotaoMostraEEsconde client:idle />
```
### `client:visible`

- **Prioridade:** Baixa
- **Útil para:** Elementos de UI de baixa prioridade que ou estão mais para baixo ("fora da tela") ou que consomem muitos recursos e que você prefere que não sejam carregados a não ser que o usuário veja o elemento.

Carrega e hidrata o JavaScript do componente uma vez que o componente entrou na janela de exibição do usuário. Isto utiliza `IntersectionObserver` internamente para observar a visibilidade.

```astro
<CarrosselDeImagensPesado client:visible />
```

### `client:media`

- **Prioridade:** Baixa
- **Útil para:** Toggles de barras laterais ou outros elementos que podem ser visíveis apenas em certos tamanhos de tela.

`client:media={string}` carrega e hidrata o JavaScript do componente assim que uma certa media query de CSS é atingida.

Nota: Se o componente já está escondido e é mostrado por uma media query no seu CSS, então pode ser mais fácil apenas utilizar `client:visible` ao invés de passar a mesma media query para a diretiva.

```astro
<ToggleBarraLateral client:media="(max-width: 50em)" />
```
### `client:only`

`client:only={string}` **pula** renderização de HTML no servidor e renderiza apenas no cliente. É similar a `client:load` no sentido em que ele carrega, renderiza e hidrata o componente imediatamente na página.

**Você deve passar o framework correto do componente como valor!** Pois como o Astro não executa o componente durante a build / no servidor, Astro não sabe que framework seu componente utiliza a não ser que você o diga explicitamente.

```astro
<AlgumComponenteReact client:only="react" />
<AlgumComponentePreact client:only="preact" />
<AlgumComponenteSvelte client:only="svelte" />
<AlgumComponenteVue client:only="vue" />
<AlgumComponenteSolid client:only="solid-js" />
```

## Diretivas de Script e Estilização

Estas diretivas só podem ser utilizadas nas tags `<script>` e `<style>` do HTML, para controlar como o seu JavaScript e CSS no lado do cliente são utilizados pela página. 

### `is:global`

Por padrão, Astro automaticamente escopa as regras de CSS de `<style>` ao componente. Você pode remover esse comportamento com a diretiva `is:global`.

`is:global` faz com que o conteúdo de uma tag `<style>` seja aplicado globalmente na página quando o componente está incluso. Isso desabilita o sistema de escopo de CSS do Astro. É o equivalente a envolver todos os seus seletores numa tag `<style>` com `:global()`.

Você pode combinar `<style>` e `<style is:global>` no mesmo componente, para criar algumas regras de estilo globais enquanto ainda escopa a maioria do CSS do seu componente.

Veja a página [Estilização & CSS](/pt-BR/guides/styling/#global-styles) para mais detalhas em como estilos globais funcionam.

```astro
<style is:global>
  body a { color: red; }
</style>
```

### `is:inline`

Por padrão, Astro irá processar, otimizar e fazer o bundle de tags `<script>` e `<style>` que ele ver na página. Você pode remover esse comportamento com a diretiva `is:inline`.

`is:inline` diz ao Astro para deixar a tag `<script>` ou `<style>` como se fosse o HTML final resultante. Seus conteúdos não serão processados, otimizados ou passarão por bundle. Isso limita algumas funcionalidades do Astro, como importar pacotes npm ou utilizar uma linguagem que compila para CSS como Sass. 

A diretiva `is:inline` siugnifica que tags `<style>` ou `<script>`:
- Não passarão por bundle em um arquivo externo.
- Não serão desduplicadas - o elemento irá aparecer quantas vezes ele for renderizado.
- Não terá suas referências de `import`/`@import`/`url()` resolvidas relativamente ao arquivo `.astro`.
- Não serão pré-processadas, por exemplo o atributo `<style lang="sass">` vai continuar gerando CSS puro.
- Não serão renderizadas no HTML final resultante exatamente como foram escritas.
- Estilos serão globais e não escopados ao componente.

> ⚠️ A diretiva `is:inline` é implícita aonde qualquer outro atributo que não seja `src` é utilizado em uma tag `<script>` ou `<style>`.

```astro
<style is:inline>
  /* inline: importações relativas e de pacotes npm não são suportadas. */
  @import '/assets/algum-css-publico.css';
  span { color: green; }
</style>

<script is:inline>
  /* inline: importações relativas e de pacotes npm não são suportadas. */
  console.log('Eu sou assim tanto aqui quanto no HTML final resultante.');
</script>
```

📚 Veja como [scripts no lado do cliente](/pt-BR/core-concepts/astro-components/#scripts-no-lado-do-cliente) funcionam em componentes Astro.

### `define:vars`

`define:vars={...}` pode passar variáveis do frontmatter do seu componente no lado do servidor para o `<script>` ou `<style>` do cliente. Qualquer variável de frontmatter *serializável* é suportada, incluindo props passadas ao seu componente através de `Astro.props`.

```astro
---
const corPrimeiroPlano = "rgb(221 243 228)";
const corPlanoDeFundo = "rgb(24 121 78)";
const mensagem = "Astro é incrível!";
---
<style define:vars={{ corTexto: corPrimeiroPlano, corPlanoDeFundo }}>
  h1 {
    background-color: var(--corPlanoDeFundo);
    color: var(--corTexto);
  }
</style>

<script define:vars={{ mensagem }}>
  alert(mensagem);
</script>
```

>⚠️ Utilizar `define:vars` em uma tag `<script>` ou `<style>` implica na diretiva `is:inline`, o que significa que seus scripts ou estilos não passarão por bundle e serão inseridos diretamente no seu HTML. Veja a [seção dedicada](#isinline) a `is:inline` para mais detalhes.

## Diretivas Avançadas
### `is:raw`

`is:raw` instrui o compilador do Astro a tratar qualquer elemento-filho do elemento como texto. Isso significa que toda a sintaxe de template especial do Astro será ignorada dentro desse componente.

Utilizada internamente no componente `<Markdown />`.

Por exemplo, se você tivesse um componente Katex customizado que converte algum texto para HTML, usuários poderiam fazer isso:

```astro
---
import Katex from '../components/Katex.astro';
---
<Katex is:raw>SAlguma {sintaxe} conflitante aqui</Katex>
```
