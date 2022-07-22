---
layout: ~/layouts/MainLayout.astro
title: Páginas
description: Uma introdução à páginas Astro
i18nReady: true
---

**Páginas** são um tipo especial de [componente Astro](/pt-br/core-concepts/astro-components/) que vive no sub-diretório  `src/pages/`. Elas são responsáveis por gerenciar o roteamento, carregamento de dados, e o layout de cada página HTML no seu website.

### Roteamento baseado em arquivos

Astro se beneficia de uma estratégia de roteamento chamada **roteamento baseado em arquivos**. Cada arquivo `.astro` em seu diretório `src/pages` se torna uma página ou endpoint no seu site com base no seu caminho de arquivo.

📚 Leia mais sobre [Roteamento no Astro](/pt-br/core-concepts/routing/).

### HTML da Página

Páginas Astro devem retornar uma completa página `<html>...</html>`, incluindo `<head>` e `<body>`. (`<!doctype html>` é opcional e será adicionado automaticamente.)

```astro
---
// Exemplo: src/pages/index.astro
---
<html>
  <head>
    <title>Minha página inicial</title>
  </head>
  <body>
    <h1>Bem-vindo ao meu website!</h1>
  </body>
</html>
```

### Aproveitando Layouts de Páginas

Para evitar repetir os mesmos elementos HTML em cada página, você pode mover elementos comuns como `<head>` e `<body>` em seus próprios [componentes de layout](/pt-br/core-concepts/layouts/). Você pode utilizar muitos ou poucos componentes de layout, esta é uma decisão que fica ao seu gosto.

```astro
---
// Exemplo: src/pages/index.astro
import LayoutDoMeuSite from '../layouts/LayoutDoMeuSite.astro';
---
<LayoutDoMeuSite>
  <p>Conteúdo da minha página, envolto em um layout!</p>
</LayoutDoMeuSite>
```

📚 Leia mais sobre [componentes de layout](/pt-br/core-concepts/layouts/) no Astro.


## Páginas Markdown

Astro também considera qualquer arquivo Markdown (`.md`) dentro de `/src/pages/` como páginas no seu website final. Estes são comumente usados em páginas cheias de texto, como em postagens de blog ou documentações.

Layouts de páginas são especialmente úteis em [arquivos Markdown](#páginas-markdown). Arquivos markdown podem utilizar a propriedade especial do front matter `layout` para especificar um [componente de layout](/pt-br/core-concepts/layouts/) que irá envolver o conteúdo do Markdown em uma página `<html>...</html>` completa.

```md
---
# Example: src/pages/pagina.md
layout: '../layouts/LayoutDoMeuSite.astro'
title: 'Minha página Markdown'
---
# Título

Esta é minha página, escrita em **Markdown.**
```

📚 Leia mais sobre [Markdown](/pt-br/guides/markdown-content/) no Astro.


## Páginas Não-HTML

Páginas Não-HTML, como `.json` ou `.xml`, ou até assets como imagens, podem ser construídas utilizando rotas de API comumente conhecidas como **Rotas de Arquivo**.

**Rotas de Arquivo** são arquivos de script que terminam com a extensão `.js` ou `.ts` e estão localizadas no diretório `src/pages`.

Nomes de arquivos embutidos e extensões são baseadas no nome do arquivo fonte, exemplo: `src/pages/data.json.ts` será construído de forma a se igualar a rota `/data.json` na sua build final.

Utilizando SSR (renderização no lado do servidor) a extensão não importa e pode ser omitida. Isto porque nenhum arquivo é gerado em tempo de build. No lugar, Astro gera um único arquivo de servidor.

```js
// Exemplo: src/pages/feitoCom.json.ts
// Saída: /feitoCom.json

// Rotas de arquivos exportam uma função get(), na qual é chamada para gerar o arquivo.
// Retorna um objeto com `body` para salvar os conteúdos do arquivo na sua build final.
export async function get() {
  return {
    body: JSON.stringify({
      name: 'Astro',
      url: 'https://astro.build/',
    }),
  };
}
```

Rotas de API recebem um objeto `APIContext` que contém [params](/pt-br/reference/api-reference/#params) e um [Request](https://developer.mozilla.org/pt-BR/docs/Web/API/Request):

```ts
import type { APIContext } from 'astro';

export async function get({ params, request }: APIContext) {
  return {
    body: JSON.stringify({
      path: new URL(request.url).pathname
    })
  };
}
```

Você também pode escrever as funções das suas rotas de API utilizando o tipo `APIRoute`. Isso resultará em melhores mensagens de erro quando a sua rota de API retornar o tipo errado:

```ts
import type { APIRoute } from 'astro';

export const get: APIRoute = ({ params, request }) => {
  return {
    body: JSON.stringify({
      path: new URL(request.url).pathname
    })
  };
};
```

## Página Customizada de Erro 404

Para uma página customizada de erro 404, você pode criar um arquivo `404.astro` ou `404.md` em `/src/pages`.

Isso irá construir uma página `404.html`. A maioria dos [serviços de deploy](/pt-br/guides/deploy/) irão a encontrar e utilizar.
