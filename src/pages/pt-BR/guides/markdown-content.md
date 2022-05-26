---
layout: ~/layouts/MainLayout.astro
title: Markdown
description: Como usar Markdown com Astro
i18nReady: true
---

Markdown é comumente usado para criar conteúdo com muito texto, como postagens de blog e documentação. Astro inclui suporte nativo para Markdown com alguns recursos adicionais, como suporte para expressões JavaScript e componentes Astro.

## Páginas Markdown

Astro trata qualquer arquivo `.md` dentro do diretório `/src/pages` como uma página. Colocar um arquivo nesse diretório ou em qualquer subdiretório criará, automaticamente, uma rota de página usando o nome do caminho do arquivo.

📚 Leia mais sobre o [roteamento baseado em arquivos](/pt-BR/core-concepts/routing/) do Astro.

### Exemplo Básico

A maneira mais fácil de começar a usar Markdown no Astro é criar uma rota de página inicial `src/pages/index.md` em seu projeto. Copie o template básico abaixo em seu projeto e visualize o HTML renderizado na rota da página inicial do seu projeto. Geralmente, em [http://localhost:3000](http://localhost:3000/).

```markdown
---
# Exemplo: src/pages/index.md
title: Olá, mundo!
---

# Olá!

Esta é sua primeira página em Markdown. Provavelmente, ela não tem muito estilo, embora o Markdown ofereça suporte para **negrito** e _itálico_.

Para saber mais sobre como adicionar um layout à sua página, leia a próxima seção, **Layouts no Markdown**.
```

### Layouts no Markdown

Páginas Markdown têm uma propriedade especial frontmatter para `layout` que define o caminho relativo para um [componente de layout](/pt-BR/core-concepts/layouts/) Astro. Este componente envolverá seu conteúdo Markdown, fornecendo uma casca de página e quaisquer outros elementos de template de página incluídos.

```markdown
---
layout: ../layouts/LayoutBase.astro
---
```

Um layout típico para páginas Markdown inclui:

1. a prop `content` para acessar os dados do frontmatter da página Markdown.
2. um [`<slot />`](/pt-BR/core-concepts/astro-components/#slots) padrão para indicar onde o conteúdo Markdown da página deve ser renderizado.

```astro
---
// src/layouts/BaseLayout.astro
// 1. A prop content dá acesso aos dados do frontmatter
const { content } = Astro.props;
---
<html>
  <head>
    <!-- Adicione outros elementos Head aqui, como estilos e meta tags. -->
    <title>{content.title}</title>
  </head>
  <body>
    <!-- Adicione outros componentes de UI aqui, como cabeçalhos e rodapés comuns. -->
    <h1>{content.title} por {content.author}</h1>
    <!-- 2. O HTML renderizado será passado para o slot default. -->
    <slot />
    <p>Escrito em: {content.date}</p>
  </body>
</html>
```

A prop `content` também contém uma propriedade `astro` com metadados adicionais sobre a página, como o objeto Markdown `source` completo e um objeto `headers`.

Um exemplo de objeto `content` de post de blog pode ser algo como:

```json
{
  /** Frontmatter from a blog post
  "title": "Lançamento do Astro 0.18",
  "date": "Terça-feira, 27 de julho de 2021",
  "author": "Matthew Phillips",
  "description": "Astro 0.18 é o nosso maior lançamento desde o lançamento do Astro.",
  "draft": false,
  "keywords": ["astro", "lancamento", "anuncio"]
  **/
  "astro": {
    "headers": [
      {
        "depth": 1,
        "text": "Lançamento do Astro 0.18",
        "slug": "lancamento-do-astro-018"
      },
      {
        "depth": 2,
        "text": "Hidratação parcial responsiva",
        "slug": "hidratacao-parcial-responsiva"
      }
      /* ... */
    ],
    "source": "# Lançamento do Astro 0.18\nPouco mais de um mês atrás, o primeiro beta público [...]"
  },
  "url": ""
}
```

> 💡 `astro` e` url` são as únicas propriedades garantidas fornecidas pelo Astro na prop `content`. O restante do objeto é definido por suas variáveis frontmatter.

### Frontmatter como Props

Qualquer componente Astro (não apenas layouts!) pode receber os valores definidos no seu frontMatter de Markdown como props. Você pode especificar vários tipos de dados usando o frontmatter de YAML e obter metainformações ainda mais ricas de cada post para usar em todo o seu site Astro.

Acesse esses valores em qualquer arquivo `.astro`, assim como você faria em um layout, conforme descrito acima.

### IDs de Cabeçalhos

Astro adicionará IDs autogerados a todos os títulos em arquivos Markdown automaticamente usando [github-slugger] (https://github.com/flet/github-slugger). Mas, se um ID personalizado for especificado, ele não será substituído.

Esses IDs serão adicionados _depois_ que todos os outros plugins são executados, então, se você tem um plugin como `rehype-toc`, que precisa de IDs, você deve adicionar seu próprio plugin de slug (como `rehype-slug`).

### Rascunhos Markdown

`draft: true` é um valor opcional de frontmatter que marcará uma página ou postagem `.md` individual como "não publicado". Por default, esta página será excluída do build do site.

Páginas Markdown sem a propriedade `draft` ou aquelas com `draft: false` não são afetadas e serão incluídas no build final.

```markdown
---
# src/pages/post/blog-post.md
layout: ../../layouts/BaseLayout.astro
title: Meu Post de Blog
draft: true
---

Este é o post que eu estou fazendo no meu blog.

Nenhuma página será buildada para este post.

Para fazer o build e publicar este post:

- atualize o frontmatter para `draft: false` ou
- remova a propriedade `draft` completamente.
```

> ⚠️ Apesar de `draft: true` impedir que uma página seja buildada no site naquela rota de página, `Astro.glob()` atualmente retorna **todos os seus arquivos Markdown**.

Para evitar que os dados de um rascunho de post (e.g. título, link, descrição) sejam incluídos em seu arquivo de post ou lista de postagens mais recentes, certifique-se de que sua função `Astro.glob()` também **filtre para excluir qualquer rascunho de posts**.

⚙️ Para habilitar build de páginas de rascunho:

Adicione `drafts: true` no `markdown` em `astro.config.mjs`

```js
// astro.config.mjs
export default defineConfig({
  markdown: {
    drafts: true,
  },
});
```

💡 Você também pode passar a flag `--drafts` ao executar `astro build` para buildar páginas de rascunho!

## Markdown Autoral

Além de oferecer suporte à sintaxe padrão de Markdown, Astro também estende o Markdown para tornar seu conteúdo ainda mais expressivo. Abaixo estão alguns recursos de Markdown que só existem no Astro.

### Usar Variáveis no Markdown

Variáveis frontmatter podem ser usadas diretamente em seu Markdown como propriedades do objeto `frontmatter`.

```markdown
---
author: Leon
age: 42
---

# Sobre o Autor

{frontmatter.author} tem {frontmatter.age} anos e mora em Toronto, Canada.
```

### Usar Componentes no Markdown

Você pode importar componentes no seu arquivo Markdown com `setup` e usá-los junto com seu conteúdo Markdown. O objeto `frontmatter` também está disponível para qualquer componente importado.

```markdown
---
layout: ../layouts/BaseLayout.astro
setup: |
  import Author from '../../components/Author.astro'
  import Biography from '../components/Biography.jsx'
author: Leon
---

<Author name={frontmatter.author}/>
<Biography client:visible>
  {frontmatter.author} mora em Toronto, Canada, e gosta de fotografia.
</Biography>
```

## Importar Markdown

Você pode importar arquivos Markdown diretamente em seus arquivos Astro! Você pode importar uma página específica com `import` ou várias com `Astro.glob()`.

```astro
---
// Importe markdown. import() dinâmico também é suportado!
import * as greatPost from '../pages/post/great-post.md';

// Você também pode importar múltiplos arquivos com Astro.glob
const posts = await Astro.glob('../pages/post/*.md');
---

Ótimo post: <a href={greatPost.url}>{greatPost.frontmatter.title}</a>

<ul>
  {posts.map(post => <li>{post.frontmatter.title}</li>)}
</ul>
```

Cada arquivo Markdown exporta as seguintes propriedades:

- `frontmatter`: Quaisquer dados especificados no frontmatter YAML deste arquivo.
- `file`: O caminho absoluto deste arquivo (e.g. `/home/user/projects/.../file.md`).
- `url`: Se é uma página, o URL da página (e.g. `/pt-BR/guides/markdown-content`).
- `getHeaders()`: Uma função assíncrona que retorna os cabeçalhos do arquivo Markdown. A resposta é desse tipo: `{ depth: number; slug: string; text: string }[]`.
- `Content`: Um componente que renderiza o conteúdo do arquivo Markdown. Eis um exemplo:

  ```astro
  ---
  import {Content as PromoBanner} from '../components/promoBanner.md';
  ---

  <h2>Promoção de hoje</h2>
  <PromoBanner />
  ```

Opcionalmente, você pode fornecer um tipo para a variável `frontmatter` usando um genérico TypeScript:

```astro
---
interface Frontmatter {
  title: string;
  description?: string;
}
const posts = await Astro.glob<Frontmatter>('../pages/post/*.md');
---

<ul>
  {posts.map(post => <li>{post.title}</li>)}
  <!-- post.title vai ser `string`! -->
</ul>
```

## Componente Markdown

> NOTA: O componente `<Markdown />` não funciona em SSR e pode ser removido antes da v1.0. Se possível, deve ser evitado. Para usar Markdown em seus templates, use um arquivo `.md` separado e então [`import` Markdown](/pt-BR/guides/markdown-content/#importar-markdown) no seu template como um componente.

Você pode importar o [componente Markdown nativo do Astro](/pt-BR/reference/api-reference/#markdown-) em seu script de componente e, em seguida, escrever qualquer Markdown que quiser entre as tags `<Markdown></Markdown>`.

````astro
---
import { Markdown } from 'astro/components';
import Layout from '../layouts/Layout.astro';

const expressions = 'Lorem ipsum';
---
<Layout>
  <Markdown>
    # Olá, mundo!

    **Tudo** suportado em um arquivo `.md` também é suportado aqui!

    Com _zero_ sobrecarga de tempo de execução.

    Além disso, o Astro suporta:
    - {expressões} Astro
    - Normalização automática de indentação
    - Escaping automático de expressões dentro de blocos de código

    ```js
      // Este conteúdo não é transformado!
      const object = { someOtherValue };
    ```

    - Suporte a componentes ricos, como em qualquer arquivo `.astro`!
    - Suporte a Markdown recursivo (os filhos do Componente também são processados como Markdown)
  </Markdown>
</Layout>
````

### Markdown Remoto

> NOTA: O componente `<Markdown />` não funciona em SSR e pode ser removido antes da v1.0. Se possível, deve ser evitado. Para usar Markdown em seus templates, use um arquivo `.md` separado e dê `import` no seu template como um componente. Leia esta [Discussão RFC](https://github.com/withastro/rfcs/discussions/179) para saber mais.

Se você tem Markdown em uma fonte remota, você pode passá-lo diretamente para o componente Markdown através do atributo `content`.

```astro
---
import { Markdown } from 'astro/components';

const content = await fetch('https://raw.githubusercontent.com/withastro/docs/main/README.md').then(res => res.text());
---
<Layout>
  <Markdown content={content} />
</Layout>
```

### Markdown Aninhado

> NOTA: O componente `<Markdown />` não funciona em SSR e pode ser removido antes da v1.0. Se possível, deve ser evitado. Para usar Markdown em seus templates, use um arquivo `.md` separado e dê `import` no seu template como um componente. Leia esta [Discussão RFC](https://github.com/withastro/rfcs/discussions/179) para saber mais.

Componentes `<Markdown />` podem ser aninhados.

```astro
---
import { Markdown } from 'astro/components';

const content = await fetch('https://raw.githubusercontent.com/withastro/docs/main/README.md').then(res => res.text());
---

<Layout>
  <Markdown>
    ## Exemplo de Markdown

    Aqui temos algum código __Markdown__. Também podemos renderizar conteúdo remoto dinamicamente.

    <Markdown content={content} />
  </Markdown>
</Layout>
```

⚠️ O uso do componente `Markdown` para renderizar Markdown remoto pode abrir brecha para um ataque [cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting). Se você estiver renderizando conteúdo não confiável, certifique-se de _sanitizar seu conteúdo **antes** de renderizá-lo_.

## Configurar Markdown

Você pode personalizar o parsing de Markdown modificando seu `astro.config.mjs`. [Aqui você pode ler a referência completa](/pt-BR/reference/configuration-reference/#markdown-options).

### Plugins Markdown

Astro dá suporte aos plugins terceirizados para Markdown [remark](https://github.com/remarkjs/remark) e [rehype](https://github.com/rehypejs/rehype). Você pode especificar seus plugins em `astro.config.mjs`.

> **Nota:** Por padrão, o Astro vem com [Markdown tipo GitHub](https://github.com/remarkjs/remark-gfm) e [remark-smartypants](https://github.com/silvenon/remark-smartypants) pré-habilitados. Ativar `remarkPlugins` ou `rehypePlugins` personalizados removerá esses plugins integrados e você precisará adicioná-los explicitamente, se desejar.

#### Como adicionar um plugin Markdown no Astro

1. Instale a dependência do pacote npm em seu projeto.

2. Atualize `remarkPlugins` ou `rehypePlugins` dentro das opções `markdown`:

   ```js
   // astro.config.mjs
   export default {
     markdown: {
       remarkPlugins: [
          // Adicione um plugin Remark que você deseja habilitar para seu projeto.
          // Se você precisar fornecer opções para o plugin, você pode usar um array e colocar as opções como o segundo item.
          // ['remark-autolink-headings', { behavior: 'prepend'}],
       ],
       rehypePlugins: [
          // Adicione um plugin Rehype que você deseja habilitar para seu projeto.
          // Se você precisar fornecer opções para o plugin, você pode usar um array e colocar as opções como o segundo item.
          // 'rehype-slug',
          // ['rehype-autolink-headings', { behavior: 'prepend'}],
       ],
     },
   };
   ```

    Você pode informar os nomes dos plugins, bem como importá-los:    

   ```js
   // astro.config.mjs
   import autolinkHeadings from 'remark-autolink-headings';

   export default {
     markdown: {
       remarkPlugins: [[autolinkHeadings, { behavior: 'prepend' }]],
     },
   };
   ```

### Syntax Highlighting

Astro vem com suporte nativo para [Shiki](https://shiki.matsu.io/) e [Prism](https://prismjs.com/). Isso fornece syntax highlighting imediato para:

- todas as code fences (\`\`\`) usadas em um arquivo markdown (`.md`) e o [componente `<Markdown />` nativo](#componente-markdown).
- conteúdo dentro do [componente `<Code />` nativo](/pt-BR/reference/api-reference/#code-) (oferecido por Shiki) ou o [componente `<Prism />`](/pt-BR/reference/api-reference/#prism-) (oferecido por Prism).

Shiki é ativado por padrão, pré-configurado com o tema `github-Dark`. A saída compilada será limitada a `style`s inline sem classes CSS de fora, folhas de estilo ou JS client-side.

Se você optar por usar Prism, aplicaremos as classes CSS do Prism. Observe que **você precisa colocar sua própria folha de estilo CSS** para o syntax highlighting funcionar! Veja a [seção de configuração do Prism](#configuração-prism) para mais detalhes.

#### Escolha um destacador de sintaxe

Shiki é o nosso destacador de sintaxe padrão. Se você quiser mudar para `'prism'` ou desativar completamente o destaque de sintaxe, você pode usar o objeto de configuração `markdown`:

```js
// astro.config.mjs
export default {
  markdown: {
    // Pode ser 'shiki' (padrão), 'prism' ou false para desabilitar o destacamento
    syntaxHighlight: 'prism',
  },
};
```

#### Configuração Shiki

Ao usar Shiki, você pode configurar todas as opções por meio do objeto `shikiConfig`, tal como:

```js
// astro.config.mjs
export default {
  markdown: {
    shikiConfig: {
      // Escolha os temas internos do Shiki (ou adicione o seu)
      // https://github.com/shikijs/shiki/blob/main/docs/themes.md
      theme: 'dracula',
      // Adicione idiomas personalizados
      // Nota: Shiki tem inúmeras linguagens nativas, incluindo .astro!
      // https://github.com/shikijs/shiki/blob/main/docs/languages.md
      langs: [],
      // Habilite quebra de linha para evitar rolagem horizontal
      wrap: true,
    },
  },
};
```

Também sugerimos [inspecionar a documentação de tema deles](https://github.com/shikijs/shiki/blob/main/docs/themes.md#loading-theme) para explorar o carregamento de tema personalizado, modo claro vs modo escuro ou estilizar via variáveis CSS.

#### Configuração Prism

Ao usar o Prism, você precisará adicionar uma folha de estilo ao seu projeto para destacamento de sintaxe. Se você acabou de começar e prefere usar Prism em vez de Shiki, sugerimos:

1. [Colocar `syntaxHighlight: 'prism'`](#escolha-um-destacador-de-sintaxe) na sua configuração `@astrojs/markdown-remark`.
2. Escolher uma folha de estilo predefinida entre os [Temas Prism](https://github.com/PrismJS/prism-themes) disponíveis.
3. Adicionar essa folha de estilo no [diretório `public/` do seu projeto](/pt-BR/core-concepts/project-structure/#public).
4. Carregá-la [no `<head>` de sua página](/pt-BR/core-concepts/astro-pages/#html-da-página) através de uma tag `<link>`.

Você também pode visitar a [lista de idiomas suportados pelo Prism](https://prismjs.com/#supported-languages) para ver opções e uso.
