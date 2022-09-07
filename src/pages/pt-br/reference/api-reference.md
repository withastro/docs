---
layout: ~/layouts/MainLayout.astro
title: Referência da API
i18nReady: true
---

## Global `Astro`

A global `Astro` está disponível em todos os contextos em arquivos `.astro`. Ela tem as seguintes funções:

### `Astro.glob()`

`Astro.glob()` é uma forma de carregar vários arquivos locais em seu site estático.

```astro
---
// ./src/components/meu-componente.astro
const postagens = await Astro.glob('../pages/postagens/*.md'); // retorna um array de postagens que estão em ./src/pages/postagens/*.md
---

<div>
{postagens.slice(0, 3).map((postagem) => (
  <article>
    <h1>{postagem.frontmatter.titulo}</h1>
    <p>{postagem.frontmatter.descricao}</p>
    <a href={postagem.frontmatter.url}>Leia mais</a>
  </article>
))}
</div>
```

`.glob()` recebe apenas um parâmetro: uma URL relativa dos arquivos locais que você gostaria de importar. Ela é assíncrona e retorna um array das exportações dos arquivos correspondentes.

#### Arquivos Markdown

Arquivos Markdown tem a seguinte interface:

```ts
export interface MarkdownInstance<T extends Record<string, any>> {
  /* Quaisquer dados especificados no frontmatter YAML deste arquivo */
	frontmatter: T;
  /* O caminho do arquivo deste arquivo */
	file: string;
  /* O caminho renderizado deste arquivo */
	url: string | undefined;
  /* Componente Astro que renderiza os conteúdos deste arquivo */
	Content: AstroComponent;
  /* Função que retorna um array de elementos h1...h6 deste arquivo */
	getHeaders(): Promise<{ depth: number; slug: string; text: string }[]>;
}
```
  
Você pode opcionalmente oferecer um tipo para a variável `frontmatter` utilizando um generic do TypeScript.

```astro
---
interface Frontmatter {
  titulo: string;
  descricao?: string;
}
const postagens = await Astro.glob<Frontmatter>('../pages/postagens/*.md');
---

<ul>
  {postagens.map(postagem => <li>{postagem.titulo}</li>)}
</ul>
```

#### Arquivos Astro

Arquivos Astro tem a seguinte interface:

```ts
export interface AstroInstance {
	default: AstroComponent;
}
```

#### Outros Arquivos

Outros arquivos podem ter várias diferentes interfaces, mas `Astro.glob()` aceita um generic do TypeScript se você souber exatamente o que o tipo de um arquivo desconhecido contém.

```ts
---
interface DadosCustomizadosArquivo {
  default: Record<string, any>;
}
const dados = await Astro.glob<DadosCustomizadosArquivo>('../dados/**/*.js');
---
```

### `Astro.request`

`Astro.request` é um objeto [Request](https://developer.mozilla.org/pt-BR/docs/Web/API/Request) padrão. Ele pode ser utilizado para obter a `url`, `headers`, `method` e até mesmo o body de uma requisição. Utilize `new URL(Astro.request.url)` para obter um objeto URL.

```astro
---
const url = new URL(Astro.request.url);
---
<h1>Origem {url.origin}</h1>
```

### `Astro.response`

`Astro.response` é um objeto [ResponseInit](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#init) padrão. Ele pode ser utilizado para definir o `status`, `statusText` e `headers` para a resposta de uma página.

```astro
---
if(condicao) {
  Astro.response.status = 404;
  Astro.response.statusText = 'Não encontrado';
}
---
```

Ou para definir um header:

```astro
---
Astro.response.headers.set('Set-Cookie', 'a=b; Path=/;');
---
```

### `Astro.canonicalURL`

A [URL canônica][canonical] da página atual. Se a opção `site` estiver definida, a origem do site será a origem dessa URL.

Você também pode utilizar `canonicalURL` para adquirir o `pathname` da página atual.

```astro
---
const caminho = Astro.canonicalURL.pathname;
---

<h1>Bem-vindo a {caminho}</h1>
```

### `Astro.site`

`Astro.site` retorna a `URL` feita a partir do `site` na sua configuração do Astro. Se for `undefined`, isso irá retornar uma URL gerada a partir de `localhost`.


### `Astro.slots`

`Astro.slots` contém funções utilitárias para modificar os filhos em slots de um componente Astro.


| Nome           | Tipo                                              | Descrição                                        |
| :------------- | :------------------------------------------------ | :------------------------------------------------- |
| `has`          | `(name: string) => boolean`                       | Se o conteúdo para o slot com esse nome existe          |
| `render`       | `(name: string, args?: any[]) => Promise<string>` | Renderiza esse slot de forma assíncrona e retorna HTML   |

```astro
---
let html: string = '';
if (Astro.slots.has('default')) {
  html = await Astro.slots.render('default')
}
---
<Fragment set:html={html} />
```
<!-- Esperando a correção de um bug pelo Nate; reformate CUIDADOSAMENTE quando for remover os comentários!

`Astro.slots.render` opcionalmente aceita um segundo argumento, um array de parâmetros que serão passados para os filhos de qualquer função. Isso é extremamente útil para componentes de utilidade customizados.

Dado o seguinte componente `Mensagem.astro`...

tick tick tick astro
---
let html: string = '';
if (Astro.slots.has('default')) {
  html = await Astro.slots.render('default', Astro.props.messages)
}
---
<Fragment set:html={html} />
```

Você pode passar uma função de callback que renderiza a mensagem:

tick tick tick astro
<div><Mensagem mensagens={['Olá', 'mundo!']}>{(mensagens) => mensagens.join(' ')}</Mensagem></div>
é renderizado como // faça isso um comentário de código novamente
<div>Olá mundo!</div>
```
-->

### `Astro.self`

`Astro.self` permite que componentes Astro sejam recursivamente invocados. Este comportamento te permite renderizar um componente Astro em si mesmo utilizando `<Astro.self>` no template do componente. Isto pode ser útil para iterar sobre grandes coleções e estruturas de dados aninhadas. 

```astro
---
// ListaAninhada.astro
const { itens } = Astro.props;
---
<ul class="lista-aninhada">
{itens.map((item) => (
    <li>
      <!-- Se houver uma estrutura de dados aninhada nós renderizamos `<Astro.self>` -->
      <!-- e podemos passar props através de uma invocação recursiva -->
      {Array.isArray(item) ? (
        <Astro.self items={item} />
      ) : (
        item
      )}
    </li>
  ))}
</ul>
```

Este componente pode ser utilizado assim:

```astro
---
import ListaAninhada from './ListaAninhada.astro';
---
<ListaAninhada itens={['A', ['B', 'C'], 'D']} />
```

E renderizaria HTML assim:

```html
<ul class="lista-aninhada">
  <li>A</li>
  <li>
    <ul class="lista-aninhada">
      <li>B</li>
      <li>C</li>
    </ul>
  </li>
  <li>D</li>
</ul>
```

## `getStaticPaths()`

Se uma página utiliza parâmetros dinâmicos em seu nome de arquivo, tal componente precisará exportar uma função `getStaticPaths()`.

Esta função é necessária pois Astro é um gerador de sites estáticos. Isso significa que o seu site inteiro é construído previamente. Se Astro não sabe como gerar uma página em tempo de build, seus usuários não o irão ver quando visitarem o seu site.

```astro
---
export async function getStaticPaths() {
  return [
    { params: { /* obrigatório */ }, props: { /* opcional */ } },
    { params: { ... } },
    { params: { ... } },
    // ...
  ];
}
---
<!-- O seu template HTML aqui. -->
```

A função `getStaticPaths()` deve retornar um array de objetos para determinar quais caminhos serão pré-renderizados pelo Astro.

:::caution
A função `getStaticPaths()` é executada em seu próprio escopo isolado unicamente, antes de qualquer página carregar. Portanto você não pode referenciar nada de seu escopo parente além de importações de arquivos. O compilador irá te avisar se você quebrar esse requisito.
:::

### `params`

A chave `params` de todos os objetos retornados diz ao Astro quais rotas construir. Os parâmetros retornados devem ser mapeados de volta para os parâmetros dinâmicos e rest definidos no caminho de arquivo do seu componente.

`params` são codificados na URL, então apenas strings e números são suportados como valores. O valor para cada objeto `params` deve corresponder aos parâmetros utilizados no nome da página.

Por exemplo, suponha que você tem uma página em `src/pages/postagens/[id].astro`. Se você exportar `getStaticPaths` dessa página e retornar os seguintes caminhos:

```astro
---
export async function getStaticPaths() {
  return [
    { params: { id: '1' } },
    { params: { id: '2' } },
    { params: { id:  3 } } // Pode ser um número também!
  ];
}

const { id } = Astro.params;
---
<h1>{id}</h1>
```

Então Astro irá estaticamente gerar `postagens/1,`, `postagens/2`, e `postagens/3` em tempo de build.

### Passagem de Dados com `props`

Para passar dados adicionais para cada página gerada, você também pode definir um valor a `props` para cada objeto de caminho retornado. Diferente de `params`, `props` não são codificadas na URL, então não estão limitadas a apenas strings.

Por exemplo, supomos que você gera páginas baseando-se em dados buscados a partir de uma API remota. Você pode passar o objeto inteiro dos dados para o componente da página dentro de `getStaticPaths`:

```astro
---
export async function getStaticPaths() {
  const dados = await fetch('...').then(resposta => resposta.json());

  return dados.map((postagem) => {
    return {
      params: { id: postagem.id },
      props: { postagem },
    };
  });
}

const { id } = Astro.params;
const { postagem } = Astro.props;
---
<h1>{id}: {postagem.nome}</h1>
```

Você também pode passar um array normal, que pode ser útil quando for gerar ou esboçar uma lista conhecida de rotas.

```astro
---
export async function getStaticPaths() {
  const postagens = [
    {id: '1', categoria: "astro", titulo: "Referência da API"},
    {id: '2', categoria: "react", titulo: "Criando um contador com React!"}
  ];
  return postagens.map((postagem) => {
    return {
      params: { id: postagem.id },
      props: { postagem }
    };
  });
}
const {id} = Astro.params;
const {postagem} = Astro.props;
---
<body>
  <h1>{id}: {postagem.titulo}</h1>
  <h2>Categoria: {postagem.categoria}</h2>
</body>
```

Então Astro irá estaticamente gerar `postagens/1` e `postagens/2` em tempo de build utilizando o componente da página em `pages/postagens/[id].astro`. A página pode referenciar esses dados utilizando `Astro.props`:

### `paginate()`

Paginação é um caso de uso comum para websites que Astro nativamente suporta através da função `paginate()`. `paginate()` irá automaticamente gerar o array para retornar de `getStaticPaths()` que cria uma URL para cada página da coleção paginada. O número da página será passado como um parâmetro, e os dados da página serão passados como a prop `page`.

```js
export async function getStaticPaths({ paginate }) {
  // Carregue seus dados com fetch(), Astro.glob(), etc.
  const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=150`);
  const resultado = await resposta.json();
  const todosPokemons = resultado.results;

  // Retorna a coleção paginada de caminhos para todas as postagens
  return paginate(todosPokemons, { pageSize: 10 });/*-
}

// Se configurado propriamente, a prop page agora tem tudo
// o que você precisa para renderizar uma única página (veja a próxima seção)
const { page } = Astro.props;
```
`paginate()` assume um nome de arquivo `[page].astro` ou `[...page].astro`. O parâmetro `page` se torna o número da página em sua URL:

- `/postagens/[page].astro` geraria as URLs `/postagens/1`, `/postagens/2`, `/postagens/3`, etc.
- `/postagens/[...page].astro` geraria as URLs `/postagens`, `/postagens/2`, `/postagens/3`, etc.

#### A prop `page` da paginação

A paginação irá passar a prop `page` para cada página renderizada que representa uma única página de dados na coleção paginada. Isso inclui dados que você paginou (`page.data`) assim como metadados para a página (`page.url`, `page.start`, `page.end`, `page.total`, etc). Estes metadados são úteis para coisas como um botão de "Próxima Página" ou uma mensagem "Mostrando 1-10 de 100".

| Name               |         Type          | Descrição                                                                                                                       |
| :----------------- | :-------------------: | :-------------------------------------------------------------------------------------------------------------------------------- |
| `page.data`        |        `Array`        | Array dos dados retornados de `data()` para a página atual.                                                                        |
| `page.start`       |       `number`        | Índice do primeiro item na página atual, começando em `0` (e.x. se `pageSize: 25`, isso seria `0` na página 1, `25` na página 2, etc.). |
| `page.end`         |       `number`        | Índice do último item na página atual.                                                                                               |
| `page.size`        |       `number`        | Quantos itens há por página.                                                                                                          |
| `page.total`       |       `number`        | O número total de itens em todas as páginas.                                                                                       |
| `page.currentPage` |       `number`        | O número da página atual, começando por `1`.                                                                                       |
| `page.lastPage`    |       `number`        | O número total de páginas.                                                                                                        |
| `page.url.current` |       `string`        | URL da página atual (útil para URLs canônicas)                                                                       |
| `page.url.prev`    | `string \| undefined` | URL da página anterior (será `undefined` se estiver na página 1).                                                              |
| `page.url.next`    | `string \| undefined` | URL da próxima página (será `undefined` se não houverem mais páginas).                                                              |

### `rss()`

Feeds RSS são outro comum caso de uso que Astro suporta nativamente. Invoque a função `rss( )` para  gerar um feed `/rss.xml` em seu projeto utilizando os mesmos dados que você carregou para a página. A localização desse arquivo pode ser customizado (veja abaixo).

```js
// Exemplo: /src/pages/postagens/[...page].astro
// Coloque esta função dentro do script do seu componente Astro.
export async function getStaticPaths({rss}) {
  const todasPostagens = Astro.glob('../postagens/*.md');
  const postagensOrdenadas = todasPostagens.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  // Gera um feed RSS a partir dessa coleção
  rss({
    // O título, descrição e metadados customizados do feed RSS.
    title: 'Blog do Don',
    description: 'Um blog de exemplo no Astro',
    customData: `<language>pt-BR</language>`,
    // A lista de itens do seu feed RSS, ordenados.
    items: postagensOrdenadas.map(item => ({
      title: item.frontmatter.titulo,
      description: item.frontmatter.descricao,
      link: item.url,
      pubDate: item.frontmatter.dataPub,
    })),
    // Opcional: Customize aonde o arquivo será escrito.
    // Por padrão, "/rss.xml"
    dest: "/meu/customizado/feed.xml",
  });

  // Retorna uma coleção paginada dos caminhos de todos as postagens
  return [ ... ];
}
```

```ts
// A completa definição da tipagem do argumento da função rss():
interface RSSArgument {
  /** (obrigatório) Título do feed RSS */
  title: string;
  /** (obrigatório) Descrição do feed RSS */
  description: string;
  /** Especifica metadados arbitrários no início da tag <xml> */
  xmlns?: Record<string, string>;
  /** Especifica dados customizados no início do arquivo */
  customData?: string;
  /**
   * Especifica aonde o arquivo RSS xml deve ser escrito.
   * Relativo ao diretório final da build. Exemplo: '/foo/bar.xml'
   * Por padrão, '/rss.xml'.
   */
  dest?: string;
  /** Dados de retorno de cada item */
  items: {
    /** (obrigatório) Título do item */
    title: string;
    /** (obrigatório) Link para o item */
    link: string;
    /** Data de publicação do item */
    pubDate?: Date;
    /** Descrição do item */
    description?: string;
    /** Anexe outros dados XML a esse item */
    customData?: string;
  }[];
}
```

## `import.meta`

Todos os módulos ESM incluem a propriedade `import.meta`. Astro adiciona `import.meta.env` através do [Vite](https://vitejs.dev/guide/env-and-mode.html).

**`import.meta.env.SSR`** pode ser utilizado para saber quando se está sendo renderizado no servidor. As vezes você pode querer uma lógica diferente, por exemplo, para um componente que deve ser apenas renderizado no cliente:

```jsx
import { h } from 'preact';

export default function () {
  return import.meta.env.SSR ? <div class="spinner"></div> : <ComponenteComplexo />;
}
```
## Componentes Integrados

Astro inclui vários componentes integrados para você utilizar em seus projetos. Todos os componentes integrados estão disponíveis em arquivos `.astro` via `import {} from 'astro/components';`.

### `<Markdown />`

:::caution[Descontinuado]
O componente `<Markdown />` não funciona em SSR e será movido para seu próprio pacote antes da v1.0. Ele deve ser evitado se possível. Considere [importar conteúdo Markdown](/pt-br/guides/markdown-content/#importando-markdown) no lugar.
:::

```astro
---
import { Markdown } from 'astro/components';
---
<Markdown>
  # Sintaxe do Markdown agora é suportada! **Yay!**
</Markdown>
```

Veja nosso [Guia de Markdown](/pt-br/guides/markdown-content/) para mais informações.

### `<Code />`

```astro
---
import { Code } from 'astro/components';
---
<!-- Adicione syntax highlight de algum código JavaScript. -->
<Code code={`const foo = 'bar';`} lang="js" />
<!-- Opcional: customize seu tema. -->
<Code code={`const foo = 'bar';`} lang="js" theme="dark-plus" />
<!-- Opcional: Habilite quebra de texto. -->
<Code code={`const foo = 'bar';`} lang="js" wrap />
```

Este componente providencia syntax highlighting para blocos de código em tempo de build (sem JavaScript no lado do cliente). O componente é viabilizado internamente por Shiki e suporta todos os [temas](https://github.com/shikijs/shiki/blob/main/docs/themes.md) e [linguagens](https://github.com/shikijs/shiki/blob/main/docs/languages.md) populares. Além disso, você pode adicionar temas e linguagens customizadas as passando para `theme` e `lang` respectivamente.

### `<Prism />`

```astro
---
import { Prism } from '@astrojs/prism';
---
<Prism lang="js" code={`const foo = 'bar';`} />
```

:::caution[Descontinuado]
**`@astrojs/prism`** será extraído para um pacote instalável separado no futuro.
:::

Este componente providencia syntax highlighting de linguagens específicas para blocos de código aplicando as classes CSS do Prism. Note que **você precisa providenciar uma folha de estilos CSS do Prism** (ou utilizar sua própria) para aparecer o syntax highlighting! Veja a [seção de configuração do Prism](/pt-br/guides/markdown-content/#configuração-do-prism) para mais detalhes.

Veja a [lista de linguagens suportadas pelo Prism](https://prismjs.com/#supported-languages) aonde você pode ver o alias correspondente de uma linguagem. E, você também pode mostrar seus blocos de código Astro com `lang="astro"`!

### `<Debug />`

```astro
---
import { Debug } from 'astro/components';
const objetoDoServidor = {
  a: 0,
  b: "string",
  c: {
    aninhado: "objeto"
  }
}
---
<Debug {objetoDoServidor} />
```

Este componente providencia uma forma de inspecionar valores no lado do cliente, sem utilizar JavaScript.

[canonical]: https://en.wikipedia.org/wiki/Canonical_link_element
