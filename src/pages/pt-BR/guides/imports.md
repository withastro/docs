---
layout: ~/layouts/MainLayout.astro
title: Assets Estáticos
description: Aprenda como importar diferentes tipos de conteúdo com Astro.
i18nReady: true
---

Astro suporta a maioria dos assets estáticos com zero configurações necessárias. Você pode usar a declaração `import` em qualquer lugar do seu projeto JavaScript (incluindo o script  do "front matter" de seu componente Astro) e Astro irá incluir uma cópia otimizada do asset estático na construção final do seu projeto. `@import` também é suportado dentro de CSS e tags `<style>`.

## Tipos de Arquivos Suportados

Os tipos de arquivos abaixo são suportados por padrão pelo Astro:

- Componentes Astro (`.astro`)
- Markdown (`.md`)
- JavaScript (`.js`, `.mjs`)
- TypeScript (`.ts`, `.tsx`)
- Pacotes NPM
- JSON (`.json`)
- JSX (`.jsx`, `.tsx`)
- CSS (`.css`)
- Módulos CSS (`.module.css`)
- Imagens e Assets (`.svg`, `.jpg`, `.png`, etc.)

Se você não encontrou o tipo de asset que está procurando, veja a nossa [Biblioteca de Integrações](https://astro.build/integrations/). Você pode expandir o Astro para adicionar suporte a diferente tipos de arquivos, como componentes Svelte e Vue.

Este guia detalha como os diferentes tipos de assets são construídos pelo Astro e como importá-los corretamente.

Lembre-se que você pode colocar qualquer asset estático no [diretório `public/`](/pt-BR/core-concepts/project-structure/#public) do seu projeto e Astro irá copiá-los diretamente em sua construção final. Arquivos do diretório `public/` não são construídos ou empacotados por Astro, o que significa que qualquer tipo de arquivo é suportado. Você pode referenciar um arquivo do diretório `public/` por um caminho de URL diretamente em seus templates HTML.

## JavaScript

```js
import { getUsuario } from './usuario.js';
```

JavaScript pode ser importado usando a sintaxe normal de ESM `import` e `export`. Isto funciona como o esperado, baseado no comportamento padrão do Node.js e do Browser.

## TypeScript

```js
import { getUsuario } from './usuario.ts';
import type { TipoUsuario } from './usuario.ts';
```

Astro inclui suporte por padrão para [TypeScript](https://www.typescriptlang.org/). Você pode importar arquivos `.ts` e `.tsx` diretamente em seu projeto Astro e até escrever código TypeScript dentro de seu [componente Astro](/pt-BR/core-concepts/astro-components/#script-do-componente).

**Astro não realiza checagem de tipo**. A checagem de tipo deve ser feita fora do Astro, em sua IDE ou em scripts separados. A [Extensão Astro no VSCode](/pt-BR/editor-setup/) provê automaticamente dicas e erros de TypeScript em seus arquivos abertos.

📚 Leia mais sobre o [suporte de TypeScript no Astro](/pt-BR/guides/typescript/).

## JSX / TSX

```js
import { MeuComponente } from './MeuComponente.jsx';
```

Astro inclui suporte padrão para arquivos JSX (`*.jsx` e `*.tsx`) em seu projeto. A sintaxe JSX é automaticamente transpilada para JavaScript.

Apesar do Astro entender a sintaxe JSX por padrão, você deverá incluir a integração de framework UI adequada para renderizar componentes React, Preact e Solid. Confira o nosso guia [Usando Integrações](/pt-BR/guides/integrations-guide) para saber mais.

**Nota: Astro não dá suporte à JSX em arquivos `.js`/`.ts`**. JSX será manipulado apenas dentro de arquivos que terminam com as extensões `.jsx` ou `.tsx`.

## Pacotes NPM

```js
// Importa os pacotes npm React e React-DOM
import React from 'react';
import ReactDOM from 'react-dom';
```

Astro permite que você importe pacotes NPM diretamente no navegador. Mesmo se um pacote foi publicado usando um formato legado, Astro irá convertê-lo para ESM antes de serví-lo ao navegador.

## JSON

```js
// Carrega o objeto JSON pelo "export" padrão.
import json from './dados.json';
```

Astro dá suporte para a importação de arquivos JSON diretamente em sua aplicação. Arquivos importados retornam o objeto JSON completo no `import` padrão.

## CSS

```js
// Carrega e injeta o arquivo 'estilos.css' na página
import './estilos.css';
```

Astro suporta a importação de arquivos CSS diretamente em sua aplicação. Estilos importados não proveem nenhum "export", mas importar um arquivo CSS irá automaticamente adicionar seus estilos à página. Isto funciona para todos os arquivos CSS por padrão e pode suportar também pré-processadores como Sass e Less via plugins.

Se você prefere não escrever CSS, Astro também suporta todas as bibliotecas populares de CSS-in-JS (ex: styled-components) para estilização.

## CSS Modules

```jsx
// 1. Converte os nomes das classes de `./estilos.module.css` para valores únicos e escopados.
// 2. Retorna um objeto que mapeia os nomes das classes originais aos seus valores únicos e escopados.
import estilos from './estilo.module.css';
// Esse exemplo usa JSX, mas você pode usar Módulos CSS com qualquer framework.
return <div className={estilos.erro}>Sua Mensagem de Erro</div>;
```

Astro da o suporte para CSS Modules usando a convenção de nome `[nome].module.css`. Como qualquer arquivo CSS, importá-lo vai automaticamente aplicar os estilos à página. Entretando, CSS Modules exportam um objeto padão de estilo que mapeia os nomes originais das classes à seus identificadores únicos.

CSS Modules ajudam a reforçar o escopo e o isolamento do componente no frontend com os nomes de classes únicos gerados para sua folha de estilos.

## Outros Assets

```jsx
import referenciaImg from './imagem.png'; // img === '/src/imagem.png'
import referenciaSvg from './imagem.svg'; // svg === '/src/imagem.svg'
import referenciaTxt from './palavras.txt'; // txt === '/src/palavras.txt'

// Esse exemplo usa JSX, mas você pode importar as referências em qualquer framework.
<img src={referenciaImg} />;
```

Todos os outros assets que não foram explicitamente mencionados acima podem ser importados via `import` do ESM e irão retornar a URL de referência à construção final do asset. Isto pode ser útil para referenciar assets que não são JavaScript pela URL, como por exemplo, criar um elemento `img` com o atributo `src` apontando para aquela imagem.

Também pode ser útil colocar as imagens no diretório `public/` como explicado na [página de estrutura de projetos](/pt-BR/core-concepts/project-structure/).

## WASM

```js
// Carrega e inicializa o arquivo WASM requisitado
const wasm = await WebAssembly.instantiateStreaming(fetch('/exemplo.wasm'));
```

Astro suporta o carregamento de arquivos WASM (Web Assembly) diretamente na sua aplicação usando a API [`WebAssembly`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly) do navegador.


## Módulos Integrados do Node

Nós recomendamos aos usuários do Astro que evitem o uso de módulos integrados do Node.js (`fs`, `path` e etc) sempre que possível. Astro tem o objetivo de ser compatível com múltiplos motores JavaScript no futuro. Isto inclui o [Deno](https://deno.land/) e o [Cloudflare Workers](https://workers.cloudflare.com/) que não possuem suporte aos módulos integrados do Node como o `fs`.

Nossa missão é prover alternativas Astro para os módulos Node.js mais comuns. Entretanto, isto estas alternativas ainda não existem hoje. Então, se você _realmente_ precisa utilizar estes módulos, nós não queremos o impedir. Astro suporta os módulos Node.js usando o novo prefixo `node:` do Node. Se você precisa ler um arquivo, por exemplo, você pode fazer assim:

```astro
---
// Exemplo: importa o módulo "fs/promises" do Node.js
import fs from 'node:fs/promises';

const url = new URL('../../package.json', import.meta.url);
const json = await fs.readFile(url, 'utf-8');
const data = JSON.parse(json);
---

<span>Versão: {data.version}</span>
```
