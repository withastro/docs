---
layout: ~/layouts/MainLayout.astro
title: Roteamento
description: Uma introdução a roteamento com Astro.
i18nReady: true
---

Astro utiliza **roteamento baseado em arquivos** para gerar as URLs da sua build com base no layout dos arquivos no diretório `src/pages` do seu projeto. Quando um arquivo é adicionado ao diretório `src/pages` do seu projeto, ele é automaticamente disponibilizado como uma rota baseada no seu nome de arquivo.

## Rotas estáticas

Componentes Astro (`.astro`) e arquivos Markdown (`.md`) no diretório `src/pages` **automaticamente se tornam páginas no seu website**. A rota de cada página corresponde ao seu caminho e nome no diretório `src/pages`.

```bash
# Exemplo: Rotas estáticas
src/pages/index.astro        -> meusite.com/
src/pages/sobre.astro        -> meusite.com/sobre
src/pages/sobre/index.astro  -> meusite.com/sobre
src/pages/sobre/mim.astro     -> meusite.com/sobre/mim
src/pages/postagens/1.md         -> meusite.com/postagens/1
```

:::tip
Não existe uma "configuração de roteamento" separada para se manter em um projeto Astro! Quando você adiciona um arquivo no diretório `/src/pages/`, uma nova rota é criada automaticamente para você. Em builds estáticas, você pode customizar o formato de saída do arquivo utilizando a opção [`build.format`](/pt-br/reference/configuration-reference/#buildformat) da configuração. 
:::

## Rotas dinâmicas

Um único componente de página Astro pode também especificar parâmetros dinâmicos de rota em seu nome de arquivo para gerar múltiplas rotas que cumprem certos critérios. Você pode criar várias páginas relacionadas de uma vez, como páginas de autores, ou uma página para cada categoria de um blog. Parâmetros nomeados te permitem especificar valores para níveis "nomeados" desses caminhos de rotas, e parâmetros rest permitem rotas mais flexíveis que "pegam-tudo".

:::note
Até mesmo páginas e rotas dinamicamente criadas são geradas em tempo de build.
:::

Páginas Astro que criam rotas dinâmicas devem:

1. usar a notação de `[colchetes]` para identificar os parâmetros dinâmicos

2. exportar uma função `getStaticPaths()` para especificar exatamente quais caminhos serão pré-renderizados pelo Astro.

### Parâmetros Nomeados

Você pode gerar rotas com um parâmetro `[nomeado]` providenciando a sua função `getStaticPaths()` os valores para utilizá-la assim:

```astro
---
// src/pages/cachorros/[cachorro].astro

export function getStaticPaths() {
  return [
    // Gera: /cachorros/clifford
    {params: {cachorro: 'clifford'}},
    // Gera: /cachorros/rover
    {params: {cachorro: 'rover'}},
    // Gera: /cachorros/spot
    {params: {cachorro: 'spot'}},
  ];
}
---
```

📚 Aprenda mais sobre [`getStaticPaths()`](/pt-br/reference/api-reference/#getstaticpaths).

Rotas podem ser geradas a partir de múltiplos parâmetros nomeados, a qualquer nível do caminho de arquivo:

- `pages/blog/[slug].astro` → (`/blog/ola-mundo`, `/blog/postagem-2`, etc.)
- `pages/[nomeusuario]/configuracoes.astro` → (`/fred/configuracoes`, `/drew/configuracoes`, etc.)
- `pages/[lingua]-[versao]/info.astro` → (`/en-v1/info`, `/fr-v2/info`, etc.)

#### O objeto `Astro.params`

Componentes Astro que geram rotas dinamicamente tem acesso ao objeto `Astro.params` para cada rota. Isso te permite utilizar as partes geradas de uma URL em seu script e template do componente.

```astro
---
// Exemplo: src/pages/postagens/[id].astro
const { id } = Astro.params;
---
<p>Postagem: { id }</p>


// Objeto Astro.params passado para a rota `/postagens/abc`
{ "id": "abc" }
```

Múltiplos segmentos dinâmicos de rota podem ser combinados para trabalharem da mesma forma.

```astro
---
// Exemplo: src/pages/postagens/[id]/[comentario].astro
const { id, comentario } = Astro.params;
---

// Objeto Astro.params passado para a rota `/postagens/abc/um-comentario`
{ "id": "abc", "comentario": "um-comentario" }
```

### Parâmetros Rest

Se você precisa de mais flexibilidade no roteamento de sua URL, você pode utilizar um parâmetro rest no nome do seu arquivo `.astro` como um pega-tudo universal para caminhos de arquivos de qualquer profundidade adicionando três pontos (`...`) dentro de seus colchetes.

Por exemplo:

- `pages/postagens/[...slug].astro` → (`/postagens/a`, `/postagens/a/b`, `/postagens/a/b/c`, etc.)

Parâmetros correspondentes serão passados como um parâmetro de consulta (`slug` nesse exemplo) para a página.

```json
// Objeto Astro.params passado para a rota `/postagens/a/b/c`
{ "slug": "a/b/c" }
```

:::tip
Parâmetros rest são opcionais por padrão, então `pages/postagens/[...slug].astro` pode corresponder com `/postagens/` também.
:::

#### Exemplo: Parâmetros rest

Como um exemplo do mundo real, você pode implementar o visualizador de arquivos do GitHub com os seguintes parâmetros nomeados e rest:

```
/[org]/[repo]/tree/[branch]/[...arquivo]
```

Nesse exemplo, uma requisição a `/withastro/astro/tree/main/docs/public/favicon.svg` iria resultar nos seguintes parâmetros sendo disponibilizados em sua página:

```js
{
	org: 'withastro',
	repo: 'astro',
	branch: 'main',
	arquivo: 'docs/public/favicon.svg'
}
```

## Ordem de Prioridade de Rotas

É possível que múltiplas rotas correspondam ao mesmo caminho de URL. Por exemplo, cada uma destas rotas iria corresponder a `postagens/criar`:

```
└── pages/
│       ├── postagens/
│       │   ├── criar.astro
│       │   ├── [pid].astro
│       │   └── [...slug].astro

```

Astro precisa saber qual rota deve ser utilizada para construir a página. Para fazer isso, Astro as ordena de acordo com as seguintes regras:

- Rotas estáticas sem parâmetros de caminho terão precedência sobre todas as outras rotas
- Rotas dinâmicas utilizando parâmetros nomeados terão precedência sobre parâmetros rest
- Parâmetros rest terão a menor prioridade
- Empates são resolvidos alfabeticamente

Com base no exemplo acima, aqui estão alguns exemplos de como as regras irão corresponder a URL requisitada para a rota utilizada para construir o HTML:

- `pages/postagens/criar.astro` - irá construir `/postagens/criar`
- `pages/postagens/[pid].astro` - irá construir `/postagens/1`, `/postagens/abc`, etc. Mas não `/postagens/criar`
- `pages/postagens/[...slug].astro` - irã construir `/postagens/1/2`, `/postagens/a/b/c`, etc. Mas não `/postagens/criar`, `/postagens/1`, `/postagens/abc`

## Paginação

Astro suporta paginação de forma integrada para grandes coleções de dados que precisam ser dividos em múltiplas páginas. Astro irá gerar propriedades comuns de paginação, como URLs de anterior/próxima página, número total de páginas, e mais.

Nomes de rotas paginadas devem utilizar a mesma sintaxe em `[colchetes]` de rotas dinâmicas comuns. Por exemplo, o nome de arquivo `/astronautas/[pagina].astro` irá gerar rotas para `/astronautas/1`, `/astronautas/2`, etc, onde `[pagina]` é o número gerado da página.

Você pode utilizar a função `paginate()` para gerar estas páginas a partir um array de valores como abaixo:

```astro
---
// Exemplo: /src/pages/astronautas/[pagina].astro
export async function getStaticPaths({ paginate }) {
  const paginasAstronautas = [{
    astronauta: 'Neil Armstrong',
  }, {
    astronauta: 'Buzz Aldrin',
  }, {
    astronauta: 'Sally Ride',
  }, {
    astronauta: 'John Glenn',
  }];
  // Gera páginas a partir de nosso array de astronautas, com 2 por página
  return paginate(paginasAstronautas, { pageSize: 2 });
}
// Todos os dados paginados são passados para a prop "page".
const { page } = Astro.props;
---

<!--Mostra o número da página atual. Astro.params.page também pode ser utilizado!-->
<h1>Página {page.currentPage}</h1>
<ul>
  <!--Lista o array de informações sobre astronautas-->
  {page.data.map(({ astronauta }) => <li>{astronauta}</li>)}
</ul>
```
Isso gera as seguintes páginas, com 2 itens por página:
- `/astronautas/1` - Página 1: Mostra "Neil Armstrong" e "Buzz Aldrin"
- `/astronautas/2` - Página 2: Mostra "Sally Ride" e "John Glenn"

### A prop `page`

Quando você utiliza a função `paginate()`, cada página na coleção passará seus dados através da prop `page`. A prop `page` tem diversas propriedades úteis, mas a mais importante é `page.data`. Esse é o array contendo os pedaços de dados da página que você passou para a função `paginate()`.

Quando você utiliza a função `paginate()`, cada página terá seus dados passados através da prop `page`. A prop `page` tem diversas propriedades úteis, mas aqui estão as mais importantes:
- **page.data** - array contendo um pedaço dos dados da página que você passou para a função `paginate()`
- **page.url.next** - link para a próxima página no conjunto
- **page.url.prev** - link para a página anterior no conjunto

```astro
---
// Exemplo: /src/pages/astronautas/[pagina].astro
// Faz a paginação da mesma lista de objetos de { astronauta } do exemplo anterior
export async function getStaticPaths({ paginate }) { /* ... */ }
const { page } = Astro.props;
---
<h1>Página {page.currentPage}</h1>
<ul>
  {page.data.map(({ astronauta }) => <li>{astronauta}</li>)}
</ul>
{page.url.prev ? <a href={page.url.prev}>Anterior</a> : null}
{page.url.next ? <a href={page.url.next}>Próximo</a> : null}
```


### Referência completa da API

```ts
interface Page<T = any> {
	/** resultado */
	data: T[];
	/** metadados */
	/** A contagem do primeiro item na página, começando por 0 */
	start: number;
	/** A contagem do último item na página, começando por 0 */
	end: number;
	/** número total de resultados */
	total: number;
	/** número da página atual, começando por 1 */
	currentPage: number;
	/** número de itens por página (padrão: 25) */
	size: number;
	/** número da última página */
	lastPage: number;
	url: {
		/** url da página atual*/
		current: string;
		/** url da página anterior (se existir) */
		prev: string | undefined;
		/** url da próxima página (se existir) */
		next: string | undefined;
	};
}
```

## Paginação Aninhada

Um caso de uso mais avançado para página é a **paginação aninhada**. Isso é quando a paginação é combinada com outros parâmetros dinâmicos de rota. Você pode usar paginação aninhada para agrupar suas coleções paginadas por alguma propriedade ou etiqueta.

Por exemplo, se você quiser agrupar suas postagens em Markdown por alguma etiqueta, você pode usar a paginação aninhada criando uma página `/src/pages/[etiqueta]/[pagina].astro` que iria corresponder com as seguintes URLs:

- `/vermelho/1` (etiqueta=vermelho)
- `/vermelho/2` (etiqueta=vermelho)
- `/azul/1` (etiqueta=azul)
- `/verde/1` (etiqueta=verde)

Paginação aninhada funciona retornando um array de resultados do `paginate()` a partir do `getStaticPaths()`, sendo uma para cada agrupamento.

No exemplo abaixo, nós iremos implementar a paginação aninhada para construir as URLs listados acima:

```astro
---
// Exemplo: /src/pages/[etiqueta]/[pagina].astro
export async function getStaticPaths({paginate}) {
  const todasEtiquetas = ['vermelho', 'azul', 'verde'];
  const todasPostagens = await Astro.glob('../../postagens/*.md');
  // Para cada etiqueta, retorna um resultado de paginate().
  // Se certifique de que você passou `{params: {etiqueta}}` ao `paginate()`
  // para que o Astro saiba qual agrupamento de etiqueta o resultado é para.
  return todasEtiquetas.map((etiqueta) => {
    const postagensFiltradas = todasPostagens.filter((postagem) => postagem.frontmatter.etiqueta === etiqueta);
    return paginate(postagensFiltradas, {
      params: { etiqueta },
      pageSize: 10
    });
  });
}
const { page } = Astro.props;
const params = Astro.params;
```
