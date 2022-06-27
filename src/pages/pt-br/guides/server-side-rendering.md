---
layout: ~/layouts/MainLayout.astro
title: Renderização no lado do Servidor
i18nReady: true
---

**Renderização no lado do Servidor**, também conhecido como SSR, pode ser habilitado no Astro. Quando você habilita o SSR você pode:
- Implementar sessões para um estado de login no seu app.
- Renderizar dados de uma API chamada dinamicamente com `fetch`.
- Fazer deploy do seu site em uma hospedagem utilizando um **adaptador**. 

:::note
SSR é novo no Astro e mudanças irão ocorrer antes do lançamento estável da v1.0. Por favor mantenha-se atualizado sobre as mudanças na API aqui.
:::


## Habilitando o SSR em seu Projeto

Para habilitar o SSR você precisa de um adaptador. Isso porque SSR precisa de um _runtime_ do servidor: o ambiente que executa o seu código no lado do servidor. Esse runtime providencia uma API que o seu código no lado do servidor pode utilizar. 

Instalar um adaptador dá ao Astro acesso à API correspondente, e permite que Astro retorne um script que executa o seu projeto em qualquer tipo de servidor.

Estes são os adaptadores disponíveis hoje, com mais por vir no futuro:

- [Cloudflare](https://github.com/withastro/astro/tree/main/packages/integrations/cloudflare)
- [Deno](https://github.com/withastro/astro/tree/main/packages/integrations/deno)
- [Netlify](https://github.com/withastro/astro/tree/main/packages/integrations/netlify)
- [Node.js](https://github.com/withastro/astro/tree/main/packages/integrations/node)
- [Vercel](https://github.com/withastro/astro/tree/main/packages/integrations/vercel)

Se você não estiver utilizando SSR, você não precisa de um adaptador, mesmo se você planeja fazer deploy para uma destas plataformas.

Neste exemplo iremos utilizar `@astrojs/netlify` para fazer build para Netlify. Primeiro, instale o adaptador:

```bash
npm install --save-dev @astrojs/netlify
```

Assim que os pacotes forem instalados, adicione duas novas linhas ao arquivo de configuração `astro.config.mjs` do seu projeto.

```diff
  // astro.config.mjs
  import { defineConfig } from 'astro/config';
+ import netlify from '@astrojs/netlify/functions';

  export default defineConfig({
+   adapter: netlify(),
  });
``` 

Com a Netlify você pode fazer deploy pelo git, por sua interface web, ou pela interface de linha de comando (CLI). Aqui iremos utilizar a [Netlify CLI](https://docs.netlify.com/cli/get-started/) para fazer o deploy.

Primeiro, faça build do seu site como você faria normalmente:

```bash
npm run build
```

Isso irá criar `netlify/functions/` que contém o seu código de SSR. Fazer deploy do seu site também fará o deploy dessa função que contém todas as suas páginas Astro prontas para serem renderizadas.

```bash
netlify deploy
```

Assim que o deploy estiver completo, você receberá uma URL de demonstração do seu site.

## Funcionalidades

O Astro irá continuar como um gerador de sites estáticos por padrão, mas assim que você habilita um adaptador de renderização no lado do servidor, algumas novas funcionalidades são disponibilizadas a você.

### `Astro.request.headers`

Os cabeçalhos de uma requisição estão disponíveis em `Astro.request.headers`. Ele é um objeto [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers), parecido com um Map, onde você pode pegar cabeçalhos como o cookie.

```astro
---
const cookie = Astro.request.headers.get('cookie');
// ...
---
<html>
  <!-- Página aqui... -->
</html>
```

### `Astro.redirect`

Na global `Astro`, este método permite que você redirecione para outra página. Você talvez faça isso após checar se o usuário está logado obtendo sua sessão de um cookie.

```astro
---
import { isLogado } from '../utils';

const cookie = Astro.request.headers.get('cookie');

// Se o usuário não estiver logado, ele é então redirecionado para a página de login.
if(!isLogado(cookie)) {
  return Astro.redirect('/login');
}
---
<html>
  <!-- Página aqui... -->
</html>
```

### `Response`

Você também consegue retornar uma [Response](https://developer.mozilla.org/pt-BR/docs/Web/API/Response) de qualquer página. Você talvez faça isso para retornar um 404 em uma página dinâmica após verificar um id em um banco de dados.

__[id].astro__

```astro
---
import { getProduto } from '../api';

const produto = await getProduto(Astro.params.id);

// O produto não foi encontrado
if(!produto) {
  return new Response(null, {
    status: 404,
    statusText: 'Não encontrado'
  });
}
---
<html>
  <!-- Página aqui... -->
</html>
```

#### Rotas de API

Uma rota de API é um arquivo `.js` ou `.ts` no diretório `/src/pages` que recebe um [Request](https://developer.mozilla.org/pt-BR/docs/Web/API/Request) e retorna uma [Response](https://developer.mozilla.org/pt-BR/docs/Web/API/Response).

__[id].js__
```js
import { getProduto } from '../db';

export async function get({ params }) {
  const { id } = params;
  const produto = await getProduto(id);

  if(!produto) {
    return new Response(null, {
      status: 404,
      statusText: 'Não encontrado'
    });
  }

  return new Response(JSON.stringify(produto), {
    status: 200
  });
}
```
