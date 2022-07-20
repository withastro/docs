---
layout: ~/layouts/MainLayout.astro
title: Configurando Astro
description: Como configurar Astro em seu projeto.
i18nReady: true
---

Customize o funcionamento do Astro adicionando um arquivo `astro.config.mjs` em seu projeto. Este é um arquivo comum em projetos Astro e todos os templates oficiais o incluem por padrão.

📚 Leia a [referência de configuração da API](/pt-br/reference/configuration-reference/) do Astro para uma visão geral de todas as opções de configuração suportadas.

## O Arquivo de Configuração Astro

Um arquivo de configuração Astro válido exporta sua configuração com a exportação `default`, usando a função auxiliar `defineConfig`:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // suas opções de configuração aqui...
  // https://docs.astro.build/pt-br/reference/configuration-reference/
})
```

Usar `defineConfig()` é recomendado para dicas de tipagem automáticas, mas é opcional. Uma configuração mínima válida se pareceria com algo assim:

```js
// Exemplo: Configuração mínima, um arquivo vazio
export default {}
```

## Tipos de Arquivo de Configuração Suportados

Astro suporta outros formatos de arquivos para seu arquivo de configuração JavaScript: `astro.config.js`, `astro.config.mjs`, `astro.config.cjs` e `astro.config.ts`.

O arquivo de configuração TypeScript é gerenciado usando o [`tsm`](https://github.com/lukeed/tsm) e irá respeitar as opções definidas no `tsconfig` do seu projeto.

## Resolução do Arquivo de Configuração

Astro irá tentar buscar automaticamente um arquivo de configuração com o nome `astro.config.mjs` na raíz de seu projeto. Se nenhum arquivo for encontrado, as opções padrão do Astro serão utilizadas.

```bash
# Exemplo: Lê sua configuração em ./astro.config.mjs
astro build
```

Você pode passar o arquivo de configuração explicitamente usando a opção `--config` da interface de linha de comando. Esta opção sempre busca o arquivo relativo ao diretório no qual você está executando o comando `astro` em seu terminal.

```bash
# Exemplo: Lê suas opções de configuração neste arquivo
astro build --config minha-configuracao.js
```

## Intellisense da Configuração

Astro recomenda o uso da função auxiliar `defineConfig()` em seu arquivo de configuração. `defineConfig()` proporciona Intellisense automático em sua IDE. Editores como VSCode são capazes de ler as definições TypeScript do Astro e providencia dicas de tipagem JSDoc automáticas, mesmo que seu arquivo de configuração não esteja escrito em TypeScript.

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'

export default defineConfig({
  // Seu arquivo de configuração aqui...
  // https://docs.astro.build/pt-br/reference/configuration-reference/
})
```

Você também pode providenciar manualmente as definições de tipo para o VSCode, usando essa notação JSDoc:

```js
// astro.config.mjs
export default /** @type {import('astro').AstroUserConfig} */ ({
  // Seu arquivo de configuração aqui...
  // https://docs.astro.build/pt-br/reference/configuration-reference/
}
```

## Referenciando Arquivos Relativos

Se você providenciar um caminho relativo à opção `root` ou passar a opção `--root` da interface de linha de comando, Astro irá resolver os arquivos de acordo com o diretório que o comando `astro` estiver executando.

```js
export default defineConfig({
  // Resolve o caminho "./foo" em seu diretório atual.
  root: 'foo'
})
```

Astro irá resolver todos os outros arquivos e diretórios relativos à raiz do projeto definida:

```js
export default defineConfig({
  // Resolve o caminho "./foo" em seu diretório atual.
  root: 'foo',
  // Resolve o caminho "./foo/public" em seu diretório atual.
  publicDir: 'public',
})
```

Para referenciar um arquivo ou diretório relativo ao arquivo de configuração, use `import.meta.url` (a menos que você esteja em um arquivo common.js `astro.config.cjs`):

```js
export default defineConfig({
  // Resolve o caminho "./foo" relativo a este arquivo de configuração.
  root: new URL("./foo", import.meta.url),
  // Resolve o caminho "./public" relativo a este arquivo de configuração.
  publicDir: new URL("./public", import.meta.url),
})
```

## Customizando Nomes de Arquivos Finais

Para código que o Astro processa, como arquivos JavaScript e CSS importados, você pode customizar os nomes de arquivos finais utilizando [`entryFileNames`](https://rollupjs.org/guide/en/#outputentryfilenames), [`chunkFileNames`](https://rollupjs.org/guide/en/#outputchunkfilenames), e [`assetFileNames`](https://rollupjs.org/guide/en/#outputassetfilenames) na entrada `vite.build.rollupOptions` no seu arquivo `astro.config.*`.

```js
export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'entry.[hash].js',
          chunkFileNames: 'chunks/chunk.[hash].js',
          assetFileNames: 'assets/asset.[hash][extname]',
        },
      },
    },
  },
})
```

Isto pode ser útil caso você tenha scripts com nomes que podem ser afetados por bloqueadores de anúncios (ex. `ads.js` ou `google-tag-manager.js`).

## Referência de Configuração

📚 Leia a [referência de configuração da API](/pt-br/reference/configuration-reference/) do Astro para uma visão geral de todas as opções de configuração suportadas.
