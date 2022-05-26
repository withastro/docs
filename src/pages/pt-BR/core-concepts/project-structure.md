---
layout: ~/layouts/MainLayout.astro
title: Estrutura de Projetos
description: Aprenda a estruturar um projeto com Astro.
i18nReady: true
---

Seu novo projeto Astro gerado a partir do assistente de linha de comando `create-astro` já vem com alguns arquivos e diretórios. Outros, você irá criar por si mesmo e adicionar a estrutura de arquivos já existentes do Astro.

Aqui está como um projeto Astro é organizado e alguns arquivos que você irá encontrar no seu novo projeto.


## Diretórios e Arquivos

Astro inclui uma estrutura de diretórios padronizados para o seu projeto. A raíz de qualquer projeto Astro deve incluir os seguintes diretórios e arquivos:

- `src/*` - O código-fonte do seu projeto (componentes, páginas, estilos, etc.)
- `public/*` - Seus arquivos sem código, assets não processados (fontes, ícones, etc.)
- `package.json` - Um manifesto do projeto.
- `astro.config.mjs` - Um arquivo de configuração do Astro. (opcional)

### Exemplo de Árvore do Projeto

Os diretórios de um projeto comum devem se aparecer com isto:

```
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   └-─ Button.jsx
│   ├── layouts/
│   │   └-─ PostLayout.astro
│   └── pages/
│   │   ├── posts/
│   │   │   ├── post1.md
│   │   │   ├── post2.md
│   │   │   └── post3.md
│   │   └── index.astro
│   └── styles/
│       └-─ global.css
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └-─ social-image.png
├── astro.config.mjs
└── package.json

```

### `src/`

A pasta src é onde a maioria do código-fonte do seu projeto está. Isso inclui:

- [Páginas](/pt-BR/core-concepts/astro-pages/)
- [Layouts](/pt-BR/core-concepts/layouts/)
- [Componentes Astro](/pt-BR/core-concepts/astro-components/)
- [Componentes Frontend (React, etc.)](/pt-BR/core-concepts/framework-components/)
- [Estilos (CSS, Sass)](/pt-BR/guides/styling/)
- [Markdown](/pt-BR/guides/markdown-content/)

Astro processa, otimiza e empacota os arquivos de `src/` para criar o website final que é entregue ao navegador. Diferente do estático diretório `public/`, os arquivos de `src/` são construídos e manipulados para você pelo Astro.

Alguns arquivos (como componentes Astro) nem sequer são enviados ao navegador como foram escritos, mas sim são renderizados como HTML estático. Outros arquivos (como CSS) são enviados ao navegador mas podem ser otimizados e empacotados com outros arquivos CSS para melhorar a performance.

### `src/components`

**Componentes** são pedaços reutilizáveis de código para suas páginas HTML. Eles podem ser [componentes Astro](/pt-BR/core-concepts/astro-components/) ou [componentes Frontend](/pt-BR/core-concepts/framework-components/) como React ou Vue. É comum agrupar e organizar todos os componentes do seu projeto nesta pasta.

Essa é uma prática comum em projetos Astro, porém não é obrigatória. Sinta-se livre para organizar seus componentes como desejar!

### `src/layouts`

[Layouts](/pt-BR/core-concepts/layouts/) são um tipo especial de componente que envolvem algum conteúdo como parte de uma página maior. São mais frequentemente utilizados por [páginas Astro](/pt-BR/core-concepts/astro-pages/) e [páginas Markdown](/pt-BR/guides/markdown-content/) para definir o layout dessas páginas.

Assim como o diretório `src/components`, é uma prática comum porém não obrigatória.

### `src/pages`

[Páginas](/pt-BR/core-concepts/astro-pages/) são um tipo especial de componente utilizado para criar novas páginas no seu site. Uma página pode ser um componente Astro ou um arquivo Markdown que representa o conteúdo de uma página do seu site.

> ⚠️  `src/pages` é um sub-diretório **obrigatório** em seu projeto Astro. Sem ele, seu site não terá páginas ou rotas!

### `src/styles`

É uma prática comum guardar seus arquivos CSS ou Sass no diretório `src/styles` porém não é obrigatório. Enquanto os seus estilos estiverem em algum lugar do diretório `src/` e forem importados corretamente, Astro irá manipular e otimizar esses arquivos.

### `public/`

O diretório `public/` é para arquivos e assets que não precisam ser processados durante o processo de build do Astro. Esses arquivos serão copiados para a pasta de build intocados.

Esse comportamento faz com que `public/` seja ideal para assets comuns como imagens e fontes, ou arquivos especiais como `robots.txt` e `manifest.webmanifest`.

Você pode colocar CSS e JavaScript no seu diretório `public/`, porém esteja atento que estes arquivos não serão empacotados ou otimizados na sua build final.

 💡 *Como uma regra geral, qualquer CSS ou JavaScript que você mesmo escrever deve estar no seu diretório `src/`.*

### `package.json`

Este é um arquivo utilizado por gerenciadores de pacotes de JavaScript para gerenciar suas dependências. Ele também define scripts que são comumente usados para rodar o Astro (ex: `npm start`, `npm run build`).

Caso precise de ajuda em como criar um novo arquivo `package.json` para o seu projeto, veja as instruções de [instalação manual](/pt-BR/install/manual/).

### `astro.config.mjs`

Este arquivo é gerado em todos os templates iniciais e inclui opções para configurar o seu projeto Astro. Nele você pode especificar quais integrações usar, opções de build, opções do servidor e mais.

Veja a [Referência de Configuração](/pt-BR/reference/configuration-reference/#article) para detalhas em como ajustar configurações.
