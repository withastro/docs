---
layout: ~/layouts/MainLayout.astro
title: Layouts
description: Uma introdução a layouts, um tipo de componente Astro que é compartilhado entre páginas para layouts comuns.
i18nReady: true
---

**Layouts** são um tipo especial de [componente Astro](/pt-br/core-concepts/astro-components/) úteis para criar templates de páginas reutilizáveis.

Um componente de layout é convencionalmente utilizado para providenciar a uma [página `.astro` ou `.md`](/pt-br/core-concepts/astro-pages/) um **invólucro** (tags `<html>`, `<head>` e `<body>`) como também um `<slot />` para especificar aonde o conteúdo da página deve ser injetado.

Layouts geralmente providenciam elementos `<head>` comuns assim como elementos comuns de UI para a página como cabeçalhos, barras de navegação e rodapés. 

Componentes de layout são comumente inseridos no diretório `src/layouts` do seu projeto.

## Layout de Exemplo

**`src/layouts/LayoutDoMeuSite.astro`**

```astro
---
---
<html>
  <head>
    <meta charset="utf-8">
    <title>Meu Maneiro Site Astro</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <nav>
      <a href="#">Início</a>
      <a href="#">Postagens</a>
      <a href="#">Contato</a>
    </nav>
    <article>
      <slot /> <!-- seu conteúdo é injetado aqui -->
    </article>
  </body>
</html>
```

**`src/pages/index.astro`**

```astro
---
import LayoutDoMeuSite from '../layouts/LayoutDoMeuSite.astro';
---
<LayoutDoMeuSite>
  <p>Conteúdo da minha página, envolto em um layout!</p>
</LayoutDoMeuSite>
```

📚 Aprenda mais sobre [slots](/pt-br/core-concepts/astro-components/#slots).

## Layouts Markdown

Layouts de páginas são especialmente úteis para [arquivos Markdown](/pt-br/guides/markdown-content/#páginas-markdown). Arquivos Markdown podem utilizar a propriedade especial `layout` do frontmatter para especificar qual componente `.astro` deve ser utilizado como o layout da página.

**`src/pages/postagens/postagem-1.md`**

```markdown
---
layout: ../layouts/LayoutPostagemBlog.astro
titulo: Postagem no Blog
descricao: Minha primeira postagem no blog!
---
Esta é uma postagem escrita em Markdown.
```

Quando um arquivo Markdown inclui um layout, ele passa a propriedade `content` para o arquivo do layout que inclui as propriedades do frontmatter e o HTML resultante final da página.

**`src/layout/LayoutPostagemBlog.astro`**

```astro
---
const {content} = Astro.props;
---
<html>
  <!-- ... -->
  <h1>{content.titulo}</h1>
  <h2>Autor da postagem: {content.autor}</h2>
  <slot />
  <!-- ... -->
</html>
```

📚 Leia mais sobre o suporte a Markdown do Astro em nosso [guia sobre Markdown](/pt-br/guides/markdown-content/).

## Aninhando Layouts

Componentes de layout não precisam conter uma página inteira de HTML. Você pode separar seus layouts em pequenos componentes e então, reutilizá-los para criar layouts ainda mais flexíveis e poderosos no seu projeto.

Por exemplo, um layout comum para postagens de blogs pode conter um título, data e autor. Um componente de layout `LayoutPostagemBlog.astro` pode adicionar essa UI para a página enquanto também providencia um layout maior, utilizado por todo o site, para lidar com o resto da sua página.

**`src/layout/LayoutPostagemBlog.astro`**

```astro
---
import LayoutBase from '../layouts/LayoutBase.astro'
const {content} = Astro.props;
---
<LayoutBase>
  <h1>{content.titulo}</h1>
  <h2>Autor da postagem: {content.autor}</h2>
  <slot />
</LayoutBase>
```
