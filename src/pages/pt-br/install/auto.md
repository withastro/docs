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

`create-astro` é a forma mais rápida de iniciar um novo projeto Astro do zero.

:::tip[Previews online]
Prefere tentar Astro no seu navegador? Visite [astro.new](https://astro.new/) para navegar por nossos templates iniciais e inicie um novo projeto Astro sem sair do seu navegador.
:::

## 1. Execute o Assistente de Instalação

Execute o seguinte comando no seu terminal para iniciar nosso conveniente assistente de instalação, `create-astro`.

```shell
# npm
npm create astro@latest

# yarn
yarn create astro

# pnpm
pnpm create astro@latest
```

O assistente `create-astro` irá te auxiliar em cada etapa da configuração do seu novo projeto Astro. Você pode executá-lo em qualquer lugar na sua máquina, então não há a necessidade de criar um novo diretório vazio para o seu projeto antes de começar. Se você ainda não tiver nenhum diretório vazio para o seu projeto, o assistente irá te ajudar a criar um para você automaticamente.

Se tudo der certo, você verá a mensagem "Ready for liftoff!" ("Pronto para decolagem", em português) seguida de "Next steps" ("Próximos passos", em português) recomendados. Navegue no diretório do seu novo projeto com o comando `cd` para começar a utilizar Astro.

Se você pulou a etapa `npm install` durante o assistente `create-astro`, certifique-se de instalar suas dependências antes de continuar.

## 2. Inicie Astro ✨

Astro vem com um servidor de desenvolvimento integrado que tem tudo o que você precisa para o desenvolvimento do projeto. O comando `astro dev` irá iniciar o servidor de desenvolvimento local para que você então possa ver o seu novo website em ação pela primeira vez.

Todos os templates iniciais vem com um script pré-configurado que irá executar `astro dev` para você. Use o seu gerenciador de pacotes favorito para executar esse comando e inicie o servidor de desenvolvimento do Astro.

```bash
# npm
npm run dev

# yarn
yarn run dev

# pnpm
pnpm run dev
```

Se tudo ocorrer bem, Astro deve estar servindo o seu projeto em [http://localhost:3000](http://localhost:3000)!

Astro irá observar as mudanças em arquivos no seu diretório `src/`, logo você não precisa reiniciar o servidor enquanto faz mudanças durante o desenvolvimento.

Se você não conseguir abrir o seu projeto no navegador, volte ao terminal onde você executou o comando `dev` e veja se algum erro ocorreu, ou se seu projeto está sendo servido em uma URL diferente da que foi indicada acima.

## Próximos Passos

Sucesso! Agora você está pronto para começar a construir com Astro! 🥳

Aqui estão alguns tópicos que recomendados explorar a seguir. Você pode os ler em qualquer ordem. Você pode até sair da nossa documentação por um tempinho e ir brincar com a base de código do seu novo projeto Astro, voltando aqui quando você encontrar algum problema ou ter uma dúvida.

📚 **Adicione um framework:** Aprenda como estender o Astro com dando suporte para React, Svelte, Tailwind e mais utilizando `npx astro add` em nosso [guia de Integrações](/pt-br/guides/integrations-guide/).

📚 **Faça deploy do seu site:** Aprenda como fazer build e deploy de um projeto Astro para a web em nosso [guia de Deploy](/pt-br/guides/deploy/).

📚 **Entenda sua base de código:** Aprenda mais sobre a estrutura de projetos do Astro em nosso [guia de Estrutura de Projetos](/pt-br/core-concepts/project-structure/).
