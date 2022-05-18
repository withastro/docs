---
title: Instale Astro com a Interface de Linha de Comando Automática
description: Como instalar Astro com NPM, PNPM ou YARN com a ferramenta create-astro.
layout: ~/layouts/MainLayout.astro
setup: import InstallGuideTabGroup from '~/components/TabGroup/InstallGuideTabGroup.astro';
i18nReady: true
---

Pronto para instalar Astro? Siga os guias de configuração automático ou manual.

#### Pré-requisitos

- **Node.js** - `14.15.0`, `v16.0.0`, ou superior.
- **Editor de Texto** - Recomendamos o [VS Code](https://code.visualstudio.com/) com a nossa [extensão oficial Astro](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).
- **Terminal** - Astro é acessado através da sua Interface de Linha de Comando.

<InstallGuideTabGroup />

#### Instalação

`create-astro` é a forma mais fácil e rápida de configurar um novo projeto Astro do zero.

## 1. Execute a Interface de Linha de Comando

Execute o seguinte comando em seu terminal para iniciar o nosso conveniente assistente de instalação, `create-astro`. Isso irá guiá-lo na criação do seu primeiro projeto Astro.

Não há necessidade de criar um novo diretório antes! O assistente de instalação irá criar uma nova pasta para você.

```shell
# npm
npm create astro@latest

# yarn
yarn create astro

# pnpm
pnpm create astro@latest
```

Dependendo do seu gerenciador de pacotes, você talvez precisará confirmar que quer instalar a ferramenta `create-astro@latest`. Você deverá especificar o pasta do projeto (exemplo: `./my-astro-site`) onde será criado um novo diretório.

### Escolha um Template Inicial
Você verá, então, uma pequena lista de templates iniciais para escolher:
- `Just the basics`: Um ótimo template inicial para quem busca explorar Astro.
- `Blog`, `Documentation`, `Portfolio`: Temas pré-configurados para casos de uso específicos.
- `Completely empty`: Um template contendo apenas o mínimo para iniciar.

Use as teclas direcionais (cima e baixo) para navegar para o template que deseja instalar, então pressione *enter* para selecionar.

> 💡 Quer conhecer os temas antes de escolher? Visite: [astro.new](https://astro.new/)

### Instale as dependências (opcional)
O assistente de instalação irá se oferecer para executar o comando `install` neste momento para você, etapa opcional.

> ⚠️ Se você não deseja fazê-lo neste momento, será necessário [instalar as dependências](#2-instale-as-dependências) após o assistente finalizar e antes de iniciar o seu projeto.

### Instale qualquer Integração Oficial Astro (opcional)
Você terá nesse momento a opção de adicionar qualquer [framework de UI adicional](/pt-BR/core-concepts/framework-components) (React, Svelte, Vue, Solid, Preact, Lit) e também qualquer Integração Oficial Astro (Tailwind, Partytown, Sitemap) ao executar `astro add --yes`.

Para selecionar a integração Astro que você deseja incluir em seu projeto, use a teclas direcionais (cima e baixo) para navegar e a barra de espaço para modificar a seleção das opções. Você pode selecionar múltiplos itens de uma vez, ou pode continuar sem selecionar nenhuma integração.

Quando estiver satisfeito com a sua seleção, pressione enter para continuar.

> Estas integrações e qualquer outra [integração da comunidade Astro](https://astro.build/integrations) podem ser adicionadas posteriormente seguindo as instruções em nosso [guia de integrações](/pt-BR/guides/integrations-guide).

Após selecionar as integrações, você deverá ver uma mensagem no terminal notificando-o das mudanças que a ferramenta `create-astro` irá aplicar no arquivo `astro.config.mjs` do seu projeto:

```bash
Astro will make the following changes to your config file:
```

Esse mensagem irá mostrar qual das integrações escolhidas foram corretamente adicionadas à configuração do seu projeto. (Caso contrário, você pode adicioná-las manualmente depois.)

### Inicialize um respositório .git (opcional)

Nesta etapa final, você pode escolher inicializar um respositório git em seu novo diretório. Isto é opcional, mas é útil se você deseja usar a ferramenta [Git](https://git-scm.com/) em seu projeto.

### Próximos passos

Quando o assistente de instalação `create-astro` finalizar, você deverá ver recomendações na sua tela que irão ajudar a completar a configuração e iniciar o seu projeto.

## 2. Instale as dependências

Se você não instalou as dependencias do seu projeto usando a ferramenta `create-astro`, será necessário fazê-lo com o seu gerenciador de pacotes preferido:

```bash
# npm
npm install

# yarn
yarn

# pnpm
pnpm install

```

## 3. Inicie Astro ✨

Você pode utilizar o servidor de desenvolvimento integrado ao Astro para a maior parte do desenvolvimento do seu projeto. É desta forma que você executará o seu projeto localmente durante o desenvolvimento.

Para iniciar, use o seu gerenciador de pacotes para executar o comando `start` pré-configurado:

```bash
# npm
npm start

# yarn
yarn start

# pnpm
pnpm start
```

Se tudo ocorrer bem, Astro deverá servir o seu projeto em [http://localhost:3000](http://localhost:3000)!

Astro irá observar as mudanças que ocorrerem em seu diretório `src/` e então irá atualizar o servidor local conforme as mudanças aconteçam durante o desenvolvimento.

Se você não conseguir abrir o seu projeto no navegador, volte ao terminal e execute o comando `start` novamente para ver o que houve de errado.

## 4. Deploy na web

É hora de fazer o deploy do seu projeto na web! Execute o comando `build` em seu projeto para construir o site estático em um novo diretório `dist/`.

```bash
# npm
npm run build

# yarn
yarn build

# pnpm
pnpm run build
```

Quando o comando finalizar, você deverá ter uma nova pasta `dist/` em seu projeto que poderá ser hospedada em seu serviço de hospedagem favorito.

Para iniciar a hospedagem gratuita do seu site, conheça o nosso parceiro de hospedagem [Netlify](https://www.netlify.com/). Para instruções de deploy no serviço de hospedagem que preferir, leia o nosso detalhado [guia de deploy](/pt-BR/guides/deploy).

## Próximos Passos

Sucesso! Agora você está pronto para começar a desenvolver!

📚 Aprenda mais sobre a estrutura de projetos Astro em nosso [Guia de Estrutura de Projeto](/pt-BR/core-concepts/project-structure).

📚 Aprenda mais sobre a sintaxe de componentes Astro em nosso [Guia de Componentes Astro](/pt-BR/core-concepts/astro-components).

📚 Aprenda mais sobre rotas baseadas em arquivos Astro em nosso [Guia de Rotas](/pt-BR/core-concepts/astro-pages).
