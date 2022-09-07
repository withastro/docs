---
layout: ~/layouts/MainLayout.astro
title: RSS
description: Uma introdução a RSS em Astro
i18nReady: true
---

Astro suporta geração rápida e automática de feeds RSS para blogs e outros websites orientados a conteúdo. Para mais informações sobre feeds RSS como um todo, veja [aboutfeeds.com](https://aboutfeeds.com/).

## Configurando `@astrojs/rss`

O pacote `@astrojs/rss` fornece utilitários para a geração de feeds RSS utilizando [endpoints de API](/pt-br/core-concepts/astro-pages/#páginas-não-html). Isso permite builds estáticas *e* geração sob demanda quando você estiver utilizando um [adaptador de SSR](/pt-br/guides/server-side-rendering/#habilitando-o-ssr-em-seu-projeto).

Primeiro, instale `@astrojs/rss` utilizando seu gerenciador de pacotes favorito:

```bash
# npm
npm i @astrojs/rss
# yarn
yarn add @astrojs/rss
# pnpm
pnpm i @astrojs/rss
```

Então, garanta de que você [configurou `site`](/pt-br/reference/configuration-reference/#site) no `astro.config` do seu projeto. Você utilizará essa opção para gerar os links do seu feed RSS [a partir da variável de ambiente `SITE`](/pt-br/guides/environment-variables/#variáveis-de-ambiente-padrões).

:::note[Requer a v1]
A variável de ambiente `SITE` apenas existe na recente versão Astro 1.0 beta. Atualize para a versão mais recente do Astro (`astro@latest`), ou escreva seu `site` manualmente se isso não for possível (veja exemplos abaixo).
:::

Agora, vamos gerar nosso primeiro feed RSS! Crie um arquivo `rss.xml.js` no seu diretório `src/pages/`. `rss.xml` vai ser a URL final, então sinta-se livre para renomeá-lo se preferir.

Em seguida, importe o utilitário `rss` do pacote `@astrojs/rss` e o invoque com os seguintes parâmetros:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

export const get = () => rss({
    // campo `<title>` no xml final
    title: 'Blog do Buzz',
    // campo `<description>` no xml final
    description: 'O guia de um humilde Astronauta para as estrelas',
    // URL base para links <item> do RSS
    // SITE irá utilizar o "site" do astro.config do seu projeto.
    site: import.meta.env.SITE,
    // lista de `<item>`s no xml final
    // exemplo simples: gerar itens para cada arquivo md em /src/pages
    // veja a seção "Gerando Items" para saber o frontmatter necessário e casos de uso mais avançados
    items: import.meta.glob('./**/*.md'),
    // (opcional) injete xml customizado
    customData: `<language>pt-BR</language>`,
  });
```

## Gerando `items`

O campo `items` aceita uma dessas opções:
1. [Um resultado de `import.meta.glob(...)`](#1-resultado-de-importmetaglob) **(apenas use isso para arquivos `.md` dentro do diretório `src/pages/`!)**
2. [Uma lista de objetos de feed RSS](#2-lista-de-objetos-de-feed-rss), cada um com `link`, `title`, `pubDate`, e os campos opcionais `description` e `customData`.

### 1. Resultado de `import.meta.glob`

Nós recomendados essa opção como um atalho conveniente para arquivos `.md` em `src/pages/`. Cada postagem deve ter `title`, `pubData` e opcionalmente os campos `description` e `customData` em seu frontmatter. Se isso não for possível, ou você preferir gerar esse frontmatter por código, [veja a opção 2](#2-lista-de-objetos-de-feed-rss).

Digamos que as postagens do seu blog estão armanezadas no diretório `src/pages/blog`. Você pode gerar um feed RSS assim:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

export const get = () => rss({
    title: 'Blog do Buzz',
    description: 'O guia de um humilde Astronauta para as estrelas',
    site: import.meta.env.SITE,
    items: import.meta.glob('./blog/**/*.md'),
  });
```

Veja a [documentação da importação por glob do Vite](https://vitejs.dev/guide/features.html#glob-import) para mais detalhes nessa sintaxe de importação.

### 2. Lista de objetos de feed RSS

Nós recomendamos essa opção para arquivos `.md` fora do diretório `pages`. Isso é comum quando estiver gerando rotas [via `getStaticPaths`](/pt-br/reference/api-reference/#getstaticpaths).

Por exemplo, digamos que suas postagens `.md` estão armazenadas no diretório `src/postagens/`. Cada post tem `title`, `pubDate` e `slug` em seu frontmatter, aonde `slug` corresponde a URL final do seu site. Nós podemos gerar um feed RSS utilizando [o helper do Vite `import.meta.glob`](https://vitejs.dev/guide/features.html#glob-import) assim:

```js
// src/pages/rss.xml.js
import rss from '@astrojs/rss';

const resultadoImportacaoPostagens = import.meta.glob('../postagens/**/*.md', { eager: true });
const postagens = Object.values(resultadoImportacaoPostagens);

export const get = () => rss({
    title: 'Blog do Buzz',
    description: 'O guia de um humilde Astronauta para as estrelas',
    site: import.meta.env.SITE,
    items: postagens.map((postagem) => ({
      link: postagem.url,
      title: postagem.frontmatter.title,
      pubDate: postagem.frontmatter.pubDate,
    }))
  });
```

## Adicionando uma folha de estilos

Você pode estilizar seu feed RSS para tornar a experiência do usuário mais agradável quando estiver visualizando o arquivo em seu navegador.

Utilize a opção `stylesheet` da função `rss` para especificar um caminho absoluto para sua folha de estilos.

```js
rss({
  // ex. utiliza sua folha de estilos de "public/rss/styles.xsl"
  stylesheet: '/rss/styles.xsl',
  // ...
});
```

Se você não tem uma folha de estilos RSS em mente, nós recomendamos [a folha de estilos padrão do Pretty Feed v3](https://github.com/genmon/aboutfeeds/blob/main/tools/pretty-feed-v3.xsl), que você pode baixar do GitHub e salvar no diretório `public/` do seu projeto.
