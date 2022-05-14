---
layout: ~/layouts/MainLayout.astro
title: Roteamento
description: Uma introdução a roteamento com Astro.
i18nReady: true
---

Astro utiliza **roteamento baseado em arquivos** para gerar suas URLs na construção com base no layout dos arquivos no diretório `src/pages` do seu projeto. Quando um arquivo é adicionado ao diretório `src/pages` do seu projeto, ele é automaticamente disponível como uma rota baseada no seu nome de arquivo.

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

> Não existe uma "configuração de roteamento" separada para se manter em um projeto Astro. Páginas estáticas são criadas colocando arquivos no diretório `/src/pages/`.

## Rotas dinâmicas

Um único componente de página Astro pode também especificar parâmetros dinâmicos de rota em seu nome de arquivo para gerar múltiplas rotas que cumprem certos critérios. Você pode criar várias páginas relacionadas de uma vez, como páginas de autores, ou uma página para cada categoria de um blog. Parâmetros nomeados te permitem especificar valores para níveis "nomeados" desses caminhos de rotas, e parâmetros rest permitem rotas mais flexíveis que "pegam-tudo".

> 💡 Até mesmo páginas e rotas dinamicamente criadas são geradas em tempo de construção.

Páginas Astro que criam rotas dinâmicas devem:

1. usar notação de `[colchetes]`~para identificar os parâmetros dinâmicos

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

📚 Aprenda mais sobre [`getStaticPaths()`](/pt-BR/reference/api-reference/#getstaticpaths).

Rotas podem ser geradas a partir de múltiplos parâmetros nomeados, a qualquer nível do caminho de arquivo:

- `pages/blog/[slug].astro` → (`/blog/ola-mundo`, `/blog/postagem-2`, etc.)
- `pages/[nomeusuario]/configuracoes.astro` → (`/fred/configuracoes`, `/drew/configuracoes`, etc.)
- `pages/[lingua]-[versao]/info.astro` → (`/en-v1/info`, `/fr-v2/info`, etc.)

#### O objeto `Astro.params`

Componentes Astro que geram rotas dinamicamente tem acesso ao objeto `Astro.params` para cada rota. Isso te permite utilizar as partes geradas de uma URL em seu script e template do componente.ate.

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

> Parâmetros rest são opcionais por padrão, então `pages/postagens/[...slug].astro` pode corresponder com `/postagens/` também.

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

### Ressalvas

Requisições de consulta para parâmetros não necessariamente irão corresponder com todas as rotas existentes no seu projeto.

Rotas estáticas sem parâmetros de caminho irão preceder todas as outras rotas e não irão corresponder com consultas para parâmetros de caminho dinâmicos. Semelhantemente, rotas de caminho nomeados irão preceder rotas pega-tudo, e não irão corresponder consultas para parâmetros de caminho pega-tudo. 

Considere o seguinte projeto:

```
└── pages/
│       ├── postagens/
│       │   ├── criar.astro
│       │   ├── [pid].astro
│       │   └── [...slug].astro

```

- `pages/postagens/criar.astro` - irá corresponder com `/postagens/criar`
- `pages/postagens/[pid].astro` - irá corresponder com `/postagens/1`, `/postagens/abc`, etc. Mas não com `/postagens/criar`
- `pages/postagens/[...slug].astro` - irã corresponder com `/postagens/1/2`, `/postagens/a/b/c`, etc. Mas não com `/postagens/criar`, `/postagens/1`, `/postagens/abc`

## Paginação

Astro suporta paginação automática para grandes coleções de dados que precisam ser dividos em múltiplas páginas. Astro irá automaticamente incluir metadados de paginação para coisas como URL da anterior/próxima página, número total de páginas e mais. 

```astro
---
// Exemplo: Usando paginate() em uma rota dinâmica
export async function getStaticPaths({ paginate }) {
  // Carrega seus dados:
  const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=150`);
  const resultado = await resposta.json();
  const todosOsPokemons = resultado.results;
  // Retorna uma coleção paginada de rotas:
  return paginate(todosOsPokemons, { pageSize: 10 });
}
// Os dados paginados são passados como prop para cada página.
const { page } = Astro.props;
---
<!-- ... -->
```

Paginação é útil quando você precisa gerar múltiplas páginas numeradas de um conjunto de dados maior:

- `/postagens/1` (Página 1: Mostra as postagens 1-10)
- `/postagens/2` (Página 2: Mostra as postagens 11-20)
- `/postagens/3` (Página 3: Mostra as postagens 21-30)


### A prop `page`

Quando você utiliza a função `paginate()`, cada página na coleção passará seus dados através da prop `page`. A prop `page` tem diversas propriedades úteis, mas a mais importante é `page.data`. Esta é o array contendo os pedaços de dados da página que você passou para a função `paginate()`.

```astro
---
// Exemplo: Usando a prop paginada `page`
export async function getStaticPaths() { /* ... */ }
const { page } = Astro.props;
---
<h1>Página {page.currentPage}</h1>
<ul>
  {page.data.map(item => <li>{item.titulo}</li>)}
</ul>
```


A prop `page` também inclui outros metadados úteis, como `page.url.next`, `page.url.prev`, `page.total`, e mais.

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
		/** url da página atuaç */
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
export function getStaticPaths({paginate}) {
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
