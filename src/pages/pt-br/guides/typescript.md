---
layout: ~/layouts/MainLayout.astro
title: TypeScript
description: Aprenda como utilizar o suporte integrado a TypeScript do Astro.
i18nReady: true
---

Astro vem com suporte integrado para [TypeScript](https://www.typescriptlang.org/). Você pode importar arquivos `.ts` e `.tsx` em seu projeto Astro, escrever código TypeScript dentro de seu [componente Astro](/pt-br/core-concepts/astro-components/#o-script-do-componente), e até mesmo utilizar um arquivo [`astro.config.ts`](/pt-br/guides/configuring-astro/#o-arquivo-de-configuração-astro) se você quiser.

O Astro em si não realiza checagem de tipo. A checagem de tipo deve ser realizada fora do Astro, seja pela sua IDE ou por um script separado. A [extensão para VSCode do Astro](/pt-br/editor-setup/) automaticamente providencia dicas e erros do TypeScript em seus arquivos abertos.


## Configuração

É **altamente recomendado** que você crie um arquivo `tsconfig.json` em seu projeto, para que ferramentas como Astro e o VSCode saibam como entender o seu projeto. Algumas funcionalidades (como importação de pacotes do npm) não são completamente suportadas no TypeScript sem um arquivo `tsconfig.json`. 

Algumas opções de configuração do TypeScript precisam de atenção especial no Astro. Abaixo está nosso arquivo `tsconfig.json` inicial recomendado, que você pode copiar e colar em seu próprio projeto. Cada [template em astro.new](https://astro.new/) inclui este arquivo `tsconfig.json` por padrão.

```json title="tsconfig.json"
// Exemplo: tsconfig.json inicial para projetos Astro
{
  "compilerOptions": {
    // Habilita top-level await e outras funcionalidades modernas do ESM.
    "target": "ESNext",
    "module": "ESNext",
    // Habilita a resolução de módulos estilo node para coisas como importações de pacotes do npm.
    "moduleResolution": "node",
    // Habilita a importação de arquivos JSON.
    "resolveJsonModule": true,
    // Habilita transpilação estrita para um resultado final melhor.
    "isolatedModules": true,
    // Astro irá diretamente executar seu código TypeScript, nenhuma transpilação é necessária.
    "noEmit": true
  }
}
```

Adicionalmente, nossos templates incluem um arquivo `env.d.ts` dentro do diretório `src` para providenciar [tipos de cliente do Vite](https://vitejs.dev/guide/features.html#client-types) para seu projeto:

```typescript title="env.d.ts"
/// <reference types="astro/client" />
```
Opcionalmente, você pode deletar esse arquivo e no lugar, adicionar [a opção `types`](https://www.typescriptlang.org/tsconfig#types) ao seu `tsconfig.json`:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "types": ["astro/client"]
  }
}
```

### Frameworks de UI

Se o seu projeto utiliza um [framework de UI](/pt-br/core-concepts/framework-components/), configurações adicionais dependendo do framework podem ser necessárias. Por favor veja a documentação do TypeScript do seu framework para mais informações. ([Vue](https://vuejs.org/guide/typescript/overview.html#using-vue-with-typescript), [React](https://reactjs.org/docs/static-type-checking.html), [Preact](https://preactjs.com/guide/v10/typescript), [Solid](https://www.solidjs.com/guides/typescript))

## Importações de Tipos

Utilize importações e exportações explícitas de tipos sempre que possível.

```js del={1} ins={2} ins="type"
import { AlgumTipo } from './script';
import type { AlgumTipo } from './script';
```

Dessa forma, você evita casos extremos onde o bundler do Astro pode tentar incorretamente fazer bundle do seus tipos importados como se fossem JavaScript.

No seu arquivo `.tsconfig`, você pode instruir o TypeScript a ajudá-lo com isso. A [opção `importsNotUsedAsValues`](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues) pode ser definida como `error`. Assim, o TypeScript irá checar suas importações e dizer quando `import type` deve ser utilizado.

```json ins={4}
// tsconfig.json
{
  "compilerOptions": {
    "importsNotUsedAsValues": "error",
  }
}
```

## Aliases de Importação

Astro suporta [aliases de importação](/pt-br/guides/aliases/) que você define na configuração `paths` do seu `tsconfig.json` e `jsconfig.json`. [Leia nosso guia](/pt-br/guides/aliases/) para aprender mais.

```astro title="src/pages/sobre/nate.astro" "@components" "@layouts"
---
import OlaMundo from '@components/OlaMundo.astro';
import Layout from '@layouts/Layout.astro';
---
```

```json title="tsconfig.json" {5-6}
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"]
    }
  }
}
```

## Props de Componentes

Astro suporta a tipagem das props dos seus componentes via TypeScript. Para habilitar, exporte uma interface TypeScript `Props` de seu componente Astro. A [extensão para VSCode do Astro](/pt-br/editor-setup/) irá automaticamente procurar pela exportação de `Props` e te dar suporte a TypeScript quando você utilizar aquele componente dentro de outro template. 

```astro title="src/components/OlaProps.astro" ins={2-5}
---
export interface Props {
  nome: string;
  saudacao?: string;
}
const { saudacao = 'Olá', nome } = Astro.props;
---
<h2>{saudacao}, {nome}!</h2>
```

### Tipos de atributos integrados

Astro providencia definições de tipo JSX para verificar se sua marcação está utilizando atributos HTML válidos. Você pode utilizar esses tipos para auxiliar na construção de props de componentes. Por exemplo, se você estivesse utilizando um componente `<Link>`, você poderia fazer o seguinte para espelhar os atributos HTML padrões na tipagem das props do seu componente.

```astro title="src/components/Link.astro" ins={2}
---
export type Props = astroHTML.JSX.AnchorHTMLAttributes;
const { href, ...attrs } = Astro.props;
---
<a {href} {...attrs}>
  <slot />
</a>
```

Também é possível estender as definições JSX padrões para adicionar atributos que não são padrões redeclarando o namespace `astroHTML.JSX` em um arquivo `d.ts`.

```ts
// src/atributos-customizados.d.ts
declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    'data-count'?: number;
    'data-label'?: string;
  }
}
```

:::note
`astroHTML` é injetado globalmente dentro de componentes `.astro`. Para utilizá-lo em arquivos TypeScript, utilize uma [diretiva de barra tripla](https://www.typescriptlang.org/pt/docs/handbook/triple-slash-directives.html):

```ts
/// <reference types="astro/astro-jsx" />

type MeusAtributos = astroHTML.JSX.ImgHTMLAttributes;
```
:::

## Checagem de Tipos

Para ver erros de tipagem no seu editor, por favor certifique-se de que você tem a [extensão Astro para VS Code](/pt-br/editor-setup/) instalada. Por favor note de que os comandos `astro start` e `astro build` irão transpilar o código com esbuild, porém você não irá executar nenhuma checagem de tipos. Para prevenir o seu código de fazer build quando conter erros de TypeScript, mude o seu script "build" no `package.json` para o seguinte:

```json title="package.json" del={2} ins={3} ins="astro check && tsc --noEmit && "
  "scripts": {
    "build": "astro build",
    "build": "astro check && tsc --noEmit && astro build",
  },
```

:::note
`astro check` apenas checa a tipagem em arquivos `.astro`, e `tsc --noEmit` apenas checa a tipagem em arquivos `.ts` e `.tsx`.
:::

📚 Leia mais sobre [a importação de arquivos `.ts`](/pt-br/guides/imports/#typescript) no Astro.
📚 Leia mais sobre [a configuração do TypeScript](https://www.typescriptlang.org/tsconfig/).

## Solução de Problemas

### Erros ao fazer a tipagem de múltiplos frameworks JSX ao mesmo tempo

Um problema pode ocorrer ao se utilizar múltiplos frameworks JSX no mesmo projeto, já que cada framework requer configurações diferentes, as vezes até conflitantes, dentro de `tsconfig.json`.

**Solução**: Defina a [opção `jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource) para `react` (padrão), `preact` ou `solid-js` dependendo do seu framework mais utilizado. Então, utilize um [comentário pragma](https://www.typescriptlang.org/docs/handbook/jsx.html#configuring-jsx) dentro de quaisuqer arquivos conflitantes de outro framwork.

Para a opção padrão de `jsxImportSource: react`, você usaria:

```jsx
// Para Preact
/** @jsxImportSource preact */
// Para Solid
/** @jsxImportSource solid-js */
```

### Componentes Vue são erroneamente tipados pelo pacote `@types/react` quando instalado

A definições de tipo do pacote `@types/react` são declarados globalmente e portanto podem ser erroneamente usados para checar os tipos de arquivos `.vue` quando estiver utilizando [Volar](https://github.com/johnsoncodehk/volar).

**Status**: Comportamento esperado.

**Solução**: Ainda não há nenhuma boa forma de resolver isso, porém, algumas soluções e mais discussão sobre podem ser encontrados nessa [discussion do GitHub](https://github.com/johnsoncodehk/volar/discussions/592).
