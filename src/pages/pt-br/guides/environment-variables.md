---
layout: ~/layouts/MainLayout.astro
title: Usando variáveis de ambiente
description: Aprenda como utilizar variáveis de ambiente em um projeto Astro.
i18nReady: true
---

Astro utiliza Vite para suas variáveis de ambiente e o permite [utilizar qualquer um de seus métodos](https://vitejs.dev/guide/env-and-mode.html) para obter e definir variáveis de ambiente.

Note que enquanto _todas_ as variáveis de ambiente estão disponíveis em código no lado do servidor, apenas variáveis de ambiente com o prefixo `PUBLIC_` estão disponíveis em código no lado do cliente por segurança.

Veja o exemplo oficial de [variáveis de ambiente](https://github.com/withastro/astro/tree/main/examples/env-vars) para entender as melhores práticas.

```ini
SENHA_SECRETA=senha123
PUBLIC_TODOS=aqui
```

Nesse exemplo, `PUBLIC_TODOS` (acessível via `import.meta.env.PUBLIC_TODOS`) estará disponível no código do cliente e do servidor, enquanto `SENHA_SECRETA` (acessível via `import.meta.env.SENHA_SECRETA`) estará apenas no lado do servidor.

## Variáveis de ambiente padrões

Astro inclui algumas variáveis de ambiente por padrão:

- `import.meta.env.MODE` (`development` (desenvolvimento) | `production` (produção)): o modo no qual o seu site está sendo executado. Seu valor é `development` quando estiver executando `astro dev` e será `production` quando estiver executando `astro build`.
- `import.meta.env.BASE_URL` (`string`): a URL base na qual o seu site está sendo acessado. Isso é determinado pela [opção `base` da configuração](/pt-br/reference/configuration-reference/#base).
- `import.meta.env.PROD` (`boolean`): Se o seu site está sendo executado em produção.
- `import.meta.env.DEV` (`boolean`): Se o seu site está sendo executado em desenvolvimento (sempre o contrário de `import.meta.env.PROD`).
- `import.meta.env.SITE` (`string`): [A opção `site`](/pt-br/reference/configuration-reference/#site) especificada no `astro.config` do seu projeto.

## Definindo variáveis de ambiente

Variáveis de ambiente podem ser carregadas de arquivos `.env` no diretório do seu projeto.

Você também pode adicionar um modo (entre `production` ou `development`) ao nome do arquivo, como `.env.production` ou `env.development`, que faz com que a variável de ambiente apenas funcione nesse modo.

Simplesmente crie um arquivo `.env` no diretório do seu projeto e adicione algumas variáveis a ele.

```bash
# .env
# Isso só estará disponível enquando executado no servidor!
SENHA_BD="foobar"
# Isso estará disponível em todo lugar!
PUBLIC_POKEAPI="https://pokeapi.co/api/v2"
```

```ini
.env                # carregado em todos os casos
.env.local          # carregado em todos os casos, ignorado pelo git
.env.[modo]         # carregado apenas no modo especificado
.env.[modo].local   # carregado apenas no modo especificado, ignorado pelo git
```

## Obtendo variáveis de ambiente

Ao invés de utilizar `process.env` com o Vite, você pode utilizar `import.meta.env`, que usa a funcionalidade `import.meta` adicionado no ES2020.

:::tip[Não se preocupe com a compatibilidade dos navegadores!]
Vite substitui todas as menções de `import.meta.env` por valores estáticos.
:::

Por exemplo, utilize `import.meta.env.PUBLIC_POKEAPI` para obter a variável de ambiente `PUBLIC_POKEAPI`.

```js
// Quando import.meta.env.SSR === true
const dados = await db(import.meta.env.SENHA_BD);

// Quando import.meta.env.SSR === false
const dados = fetch(`${import.meta.env.PUBLIC_POKEAPI}/pokemon/squirtle`);
```

:::caution
Como o Vite estaticamente substitui `import.meta.env`, você não pode acessá-lo com chaves dinâmicas como `import.meta.env[chave]`.
:::


## IntelliSense para TypeScript

Por padrão, Astro fornece definições de tipo para `import.meta.env` em `astro/client.d.ts`. 

Embora você possa definir mais variáveis customizadas em arquivos `.env.[modo]`, você pode querer IntelliSense para TypeScript para variáveis de ambiente definidas por usuários que são prefixadas com `PUBLIC_`.

Para realizar isso, você pode criar um `env.d.ts` em `src/` e configurar `ImportMetaEnv` assim:

```ts
interface ImportMetaEnv {
  readonly SENHA_BD: string;
  readonly PUBLIC_POKEAPI: string;
  // mais variáveis de ambiente...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```
