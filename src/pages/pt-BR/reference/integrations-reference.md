---
layout: ~/layouts/MainLayout.astro
title: API de Integrações Astro
i18nReady: true
---

**Integrações Astro** adicionam novas funcionalidades e comportamentos ao seu projeto com apenas algumas linhas de código.

Esta página de referência é para qualquer um que esteja escrevendo sua própria integração. Para aprender como utilizar uma integração em seu projeto, veja o nosso guia, [Usando Integrações](/pt-BR/guides/integrations-guide/) no lugar.

## Exemplos

As integrações Astro oficiais podem ser utilizadas como referência enquanto você constrói suas próprias integrações.

- **Renderizadores:** [`lit`](https://github.com/withastro/astro/blob/main/packages/integrations/lit/src/index.ts), [`svelte`](https://github.com/withastro/astro/blob/main/packages/integrations/svelte/src/index.ts), [`react`](https://github.com/withastro/astro/blob/main/packages/integrations/react/src/index.ts), [`preact`](https://github.com/withastro/astro/blob/main/packages/integrations/preact/src/index.ts), [`vue`](https://github.com/withastro/astro/blob/main/packages/integrations/vue/src/index.ts), [`solid`](https://github.com/withastro/astro/blob/main/packages/integrations/solid/src/index.ts)
- **Bibliotecas:** [`tailwind`](https://github.com/withastro/astro/blob/main/packages/integrations/tailwind/src/index.ts), [`partytown`](https://github.com/withastro/astro/blob/main/packages/integrations/partytown/src/index.ts)
- **Funcionalidades:** [`sitemap`](https://github.com/withastro/astro/blob/main/packages/integrations/sitemap/src/index.ts)

## Referência Rápida da API

```ts
interface AstroIntegration {
    name: string;
    hooks: {
        'astro:config:setup'?: (options: {
            config: AstroConfig;
            command: 'dev' | 'build';
            updateConfig: (newConfig: Record<string, any>) => void;
            addRenderer: (renderer: AstroRenderer) => void;
            injectScript: (stage: InjectedScriptStage, content: string) => void;
            injectRoute: ({ pattern: string, entryPoint: string }) => void;
        }) => void;
        'astro:config:done'?: (options: { config: AstroConfig }) => void | Promise<void>;
        'astro:server:setup'?: (options: { server: vite.ViteDevServer }) => void | Promise<void>;
        'astro:server:start'?: (options: { address: AddressInfo }) => void | Promise<void>;
        'astro:server:done'?: () => void | Promise<void>;
        'astro:build:start'?: (options: { buildConfig: BuildConfig }) => void | Promise<void>;
        'astro:build:setup'?: (options: {
          vite: ViteConfigWithSSR;
          pages: Map<string, PageBuildData>;
          target: 'client' | 'server';
        }) => void | Promise<void>;
        'astro:build:ssr'?: (options: { manifest: SerializedSSRManifest }) => void | Promise<void>;
        'astro:build:done'?: (options: { pages: { pathname: string }[]; dir: URL; routes: RouteData[] }) => void | Promise<void>;
    };
}
```

## Hooks

### `astro:config:setup`

**Próximo hook:** [astro:config:done](#astroconfigdone)

**Quando:** Durante a inicialização, antes da configuração do [Vite](https://vitejs.dev/config/) ou [Astro](/pt-BR/reference/configuration-reference/) ser resolvida.
**Por que:** Para estender a configuração do projeto. Isso inclui atualizar a [configuração do Astro](/pt-BR/reference/configuration-reference/), aplicar [plugins Vite](https://vitejs.dev/guide/api-plugin.html), adicionar renderizadores de componentes, e injetar scripts na página.

```js
'astro:config:setup'?: (options: {
    config: AstroConfig;
    command: 'dev' | 'build';
    updateConfig: (newConfig: Record<string, any>) => void;
    addRenderer: (renderer: AstroRenderer) => void;
    injectScript: (stage: InjectedScriptStage, content: string) => void;
    injectRoute: ({ pattern: string, entryPoint: string }) => void;
}) => void;
```

#### Opção `config`

**Tipo:** `AstroConfig`

Uma cópia de somente leitura da [configuração Astro](/pt-BR/reference/configuration-reference/) suprida pelo usuário. Isto é resolvido _antes_ de qualquer outra integração ser executada. Se você precisa de uma cópia da configuração depois de todas as integrações completarem seus processos de atualização da configuração, [veja o hook `astro:config:done`](#astroconfigdone). 

#### Opção `command`

**Tipo:** `'dev' / 'build'`

- `dev` - Projeto é executado a partir de `astro dev` ou `astro preview`
- `build` - Projeto é executado a partir de `astro build`

#### Opção `updateConfig`

**Tipo:** `(newConfig: Record<string, any>) => void;`

Uma função de callback para atualizar a [configuração Astro](/pt-BR/reference/configuration-reference/) suprida pelo usuário. Qualquer configuração que você providenciar **será mesclada com a configuração do usuário + atualizações da configuração de outras integrações**, então você está livre para omitir as chaves!

Por exemplo, digamos que você precisa fornecer um plugin [Vite](https://vitejs.dev/) ao projeto do usuário:

```js
import bananaCSS from '@vitejs/official-banana-css-plugin';

export default {
  name: 'banana-css-integration',
  hooks: {
    'astro:config:setup': ({ updateConfig }) => {
      updateConfig({
        vite: {
          plugins: [bananaCSS()],
        }
      })
    }
  }
}
```

#### Opção `addRenderer`

**Tipo:** `(renderer:` [`AstroRenderer`](https://github.com/withastro/astro/blob/fdd607c5755034edf262e7b275732519328a33b2/packages/astro/src/%40types/astro.ts#L872-L883) `) => void;`
**Exemplos:** [`lit`](https://github.com/withastro/astro/blob/main/packages/integrations/lit/src/index.ts), [`svelte`](https://github.com/withastro/astro/blob/main/packages/integrations/svelte/src/index.ts), [`react`](https://github.com/withastro/astro/blob/main/packages/integrations/react/src/index.ts), [`preact`](https://github.com/withastro/astro/blob/main/packages/integrations/preact/src/index.ts), [`vue`](https://github.com/withastro/astro/blob/main/packages/integrations/vue/src/index.ts), [`solid`](https://github.com/withastro/astro/blob/main/packages/integrations/solid/src/index.ts)

Uma função de callback para adicionar um renderizador de um framework de componentes (ex. React, Vue, Svelte, etc). Você pode explorar os exemplos e definições de tipagem acima para opções mais avançadas, mas aqui estão as duas principais opções que você precisa estar ciente sobre:
- `clientEntrypoint` - caminho para um arquivo que é executado no cliente sempre que seu componente é utilizado. Esta é principalmente utilizado para renderizar ou hidratar seu componente com JS.
- `serverEntrypoint` - caminho para um arquivo que é executado durante requisições no lado do servidor ou builds estáticas sempre que seu componente é utilizado. Esta deve renderizar componentes para uma marcação estática, com hooks para hidratação aonde aplicável. [o callback `renderToString` do React](https://pt-br.reactjs.org/docs/react-dom-server.html#rendertostring) é um exemplo clássico.

#### Opção `injectRoute`
**Tipo:** `({ pattern: string, entryPoint: string }) => void;`

Uma função de callback para injetar rotas em um projeto Astro. Rotas injetadas podem ser [páginas `.astro`](/pt-BR/core-concepts/astro-pages/) ou [handlers de rotas `.js` e `.ts`](/pt-BR/core-concepts/astro-pages/#páginas-não-html).

`injectRoute` recebe um objeto com um `pattern` e um `entryPoint`. 

- `pattern` - aonde a rota deve ser inserida no navegador, por exemplo `/foo/bar`. Um `pattern` pode utilizar a sintaxe de caminho de arquivos do Astro para indicar rotas dinâmicas, por exemplo `/foo/[bar]` ou `/foo/[...bar]`. Note que uma extensão de arquivo **não** é necessária no `pattern`.
- `entryPoint` - apenas um especificador de módulo apontando para a página `.astro` ou handler de rota `.js`/`.ts` que manipula a rota indicada no `pattern`.

Exemplo de uso: 

```js
injectRoute({
  pattern: '/foo/[dinamico]',
  entryPoint: 'foo/pagina-dinamica.astro'
});
```

#### Opção `injectScript` 

**Tipo:** `(stage: InjectedScriptStage, content: string) => void;`

Uma função de callback para injetar uma string de conteúdo JavaScript em todas as páginas.

O **`stage`** indica como este script (o `content`) deve ser inserido. Alguns stages permitem inserir scripts sem modificação, enquanto outros permitem otimizações durante [a etapa de bundling do Vite](https://vitejs.dev/guide/build.html):

- `"head-inline"`: Injetado em uma tag script no `<head>` de cada página. **Não é** otimizado ou resolvido pelo Vite.
- `"before-hydration"`: Importado no lado do cliente, antes do script de hidratação ser executado. Otimizado e resolvido pelo Vite.
- `"page"`: Similar a `head-inline`, exceto que o script injetado é transformado por Vite e passa por bundle junto com quaisquer outras tags `<script>` definidas dentro de componentes Astro na página. O script será carregado com um `<script type="module">` no resultado final da página, otimizado e resolvido pelo Vite.
- `"page-ssr"`: Injetado no frontmatter de cada componente de página Astro. Esta não é comumente utilizada, porém pode ser útil para injetar um `import` de CSS em cada componente de página pelo seu frontmatter, otimizado e resolvido pelo Astro.

### `astro:config:done`

**Hook anterior:** [astro:config:setup](#astroconfigsetup)
**Próximo hook:** [astro:server:setup](#astroserversetup) quando estiver sendo executado no modo "dev" ou "preview", ou [astro:build:start](#astrobuildstart) durante builds em produção

**Quando:** Após a configuração do Astro ter sido resolvida e outras integrações tiverem executado seus hooks `astro:config:setup`.
**Por que:** Para obter a configuração final para uso em outros hooks.

```js
'astro:config:done'?: (options: { config: AstroConfig }) => void | Promise<void>;
```

#### Opção `config`

**Tipo:** `AstroConfig`

Uma cópia de somente leitura da [configuração Astro](/pt-BR/reference/configuration-reference/) suprida pelo usuário. Esta é resolvida _após_ outras integrações serem executadas.

### `astro:server:setup`

**Hook anterior:** [astro:config:done](#astroconfigdone)
**Próximo hook:** [astro:server:start](#astroserverstart)

**Quando:** Logo após o servidor do Vite ser criado no modo "dev" ou "preview", porém antes do evento `listen()` ser disparado. [Veja a API createServer do Vite](https://vitejs.dev/guide/api-javascript.html#createserver) para saber mais.
**Por que:** Para atualizar as configurações do servidor Vite e middleware.

```js
'astro:server:setup'?: (options: { server: vite.ViteDevServer }) => void | Promise<void>;
```

#### Opção `server`

**Tipo:** [`ViteDevServer`](https://vitejs.dev/guide/api-javascript.html#vitedevserver)

Uma instância mutável do servidor Vite usado no modo "dev" ou "preview". Por exemplo, esta é [utilizada pela nossa integração Partytown](https://github.com/withastro/astro/tree/main/packages/integrations/partytown) para injetar o servidor Partytown como um middleware:

```js
import

'astro:server:setup': ({ server }) => {
  server.middlewares.use(
    partytownServer(partytownLibDirectory, {
      mount: '/~partytown',
      ...
    })
  );
}
```

### `astro:server:start`

**Hook anterior:** [astro:server:setup](#astroserversetup)
**Próximo hook:** [astro:server:done](#astroserverdone)

**Quando:** Logo após o evento `listen()` do servidor ser disparado.
**Por que:** Para interceptar requisições de rede de um endereço específico. Se você pretende utilizar esse endereço para middleware, considere utilizar `astro:server:setup` no lugar.

```js
'astro:server:start'?: (options: { address: AddressInfo }) => void | Promise<void>;
```

#### Opção `address`

**Tipo:** [`AddressInfo`](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_net_d_._net_.addressinfo.html)

O endereço, família e número de porta suprido pelo [módulo Net do NodeJS](https://nodejs.org/api/net.html).

### `astro:server:done`

**Hook anterior:** [astro:server:start](#astroserverstart)

**Quando:** Logo após o servidor de desenvolvimento ser fechado.
**Por que:** Para executar quaisquer eventos de limpeza que você pode ativar durante os hooks `astro:server:setup` ou `astro:server:start`.

```js
'astro:server:done'?: () => void | Promise<void>;
```

### `astro:build:start`

**Hook anterior:** [astro:config:done](#astroconfigdone)
**Próximo hook:** [astro:build:setup](#astrobuildsetup)

**Quando:** Após o evento `astro:config:done`, porém antes da build para produção começar.
**Por que:** Para definir quaisquer objetos globais ou clientes necessários durante a build para produção. Esta também pode estender as opções de configuração de build na [API de adaptadores](/pt-BR/reference/adapter-reference/).

```js
'astro:build:start'?: (options: { buildConfig: BuildConfig }) => void | Promise<void>;
```

### `astro:build:setup`

**Hook anterior:** [astro:build:start](#astrobuildstart)
**Próximo hook:** [astro:build:ssr](#astrobuildssr)

**Quando:** Após o hook `astro:build:start`, executado imediatamente antes da build.
**Por que:** Nesse ponto, a configuração Vite para a build foi completamente construída, logo essa é sua última chance de modificá-la. Isto pode ser útil para por exemplo sobrescrever alguma configuração padrão. Se você não tiver certeza se deve utilizar este hook ou `astro:build:start`, então utilize `astro:build:start` no lugar.

```js
'astro:build:setup'?: (options: {
  vite: ViteConfigWithSSR;
  pages: Map<string, PageBuildData>;
  target: 'client' | 'server';
}) => void | Promise<void>;

```

### `astro:build:ssr`

**Hook anterior:** [astro:build:setup](#astrobuildsetup)

**Quando:** Após a build para produção (SSG ou SSR) tiver sido completada.
**Por que:** Para conseguir acesso ao manifesto de SSR, isso é útil quando se for criar builds SSR customizadas em plugins ou integrações.

```js
'astro:build:ssr'?: (options: { manifest: SerializedSSRManifest }) => void | Promise<void>;
```

### `astro:build:done`

**Hook anterior:** [astro:build:ssr](#astrobuildssr)

**Quando:** Após a build para produção (SSG ou SSR) tiver sido completada.
**Por que:** Para acessar rotas geradas e assets para extensão (ex. copiar conteúdo do diretório gerado `/assets`). Se você planeja transformar assets gerados, nós recomendados explorar a [API de Plugins Vite](https://vitejs.dev/guide/api-plugin.html) e [configurá-la via `astro:config:setup`](#opção-updateconfig) no lugar.

```js
'astro:build:done'?: (options: { pages: { pathname: string }[]; dir: URL; routes: RouteData[] }) => void | Promise<void>;
```

#### Opção `pages`

**Tipo:** `{ pathname: string }[]`

Um array de todas as rotas geradas. Isso atualmente inclui `pathname` sozinho, apesar de planejarmos incluir metadados no futuro. Nota: isso estará vazio quando estiver utilizando um adaptador de SSR!

#### Opção `dir`

**Tipo:** [`URL`](https://developer.mozilla.org/pt-BR/docs/Web/API/URL)

Um caminho de URL para o diretório final da build. Nós colocamos o caminho em um objeto de URL para facilitar parsing. Se você apenas quiser o caminho como uma string, tente `dir.pathname` 🙂

## Ordenação de Integrações

Todas as integrações são executadas na ordem em que são configuradas. Por exemplo, para o array `[react(), svelte()]` na `astro.config.*` de um usuário, `react` será executado antes de `svelte`.

Sua integração deve idealmente ser executável em qualquer ordem. Se isso não for possível nós recomendados documentar que sua integração precisar vir como primeira ou última no array de configuração `integrations` do seu usuário.

## Combinar integrações em presets

Uma integração também pode ser escrita como uma coleção de múltiplas, menores integrações. Nós chamamos estas coleções de **presets**. Ao invés de criar uma função de factory que retorna o objeto de uma única integração, um preset retorna um *array* de objetos de integração. Isso é útil para construir funcionalidades complexas a partir de múltiplas integrações.

```js
integrations: [
  // Exemplo: aonde presetExemplo() retorna: [integracaoUm, integracaoDois, ...etc]
  presetExemplo()
]
```
