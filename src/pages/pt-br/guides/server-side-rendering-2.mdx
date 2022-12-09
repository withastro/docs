---
layout: ~/layouts/MainLayout.astro
title: Renderização no lado do Servidor
i18nReady: true
---

**Renderização no lado do Servidor**, também conhecido como SSR, pode ser habilitado no Astro. Quando você habilita o SSR você pode:
- Implementar sessões para um estado de login no seu app.
- Renderizar dados de uma API chamada dinamicamente com `fetch`.
- Fazer deploy do seu site em uma hospedagem utilizando um **adaptador**. 

## Habilitando o SSR em seu Projeto

Para começar, habilite as funcionalidades de SSR no modo de desenvolvimento com a opção `output: server` da configuração:

```js ins={5}
// astro.config.mjs
import { defineConfig } from 'astro/config';
export default defineConfig({
  output: 'server'
});
```

Quando for a hora de fazer deploy de um projeto SSR, você também vai precisar adicionar um adaptador. Isso porque SSR precisa de um _runtime_ do servidor: o ambiente que executa o seu código no lado do servidor. Cada adaptador permite que o Astro retorne um script que executa seu projeto em um runtime específico.

Instalar um adaptador dá ao Astro acesso à API correspondente, e permite que Astro retorne um script que executa o seu projeto em qualquer tipo de servidor.

Estes são os adaptadores disponíveis hoje, com mais por vir no futuro:

- [Cloudflare](/pt-br/guides/integrations-guide/cloudflare/)
- [Deno](/pt-br/guides/integrations-guide/deno/)
- [Netlify](/pt-br/guides/integrations-guide/netlify/)
- [Node.js](/pt-br/guides/integrations-guide/node/)
- [Vercel](/pt-br/guides/integrations-guide/vercel/)

Você pode adicionar qualquer um dos adaptadores oficiais com o comando `astro add`. Ele irá instalar o adaptador e fazer as mudanças apropriadas em seu arquivo `astro.config.mjs` em uma só etapa. Por exemplo, para instalar o adaptador para Netlify, execute:

```bash
npx astro add netlify
```

Você também pode adicionar um adaptador manualmente instalando o pacote e atualizando `astro.config.mjs` sozinho. (Veja os links acima para instruções específicadas de cada adaptador para completar as etapas necessárias para habilitar SSR.) Utilizando `meu-adaptador` como um exemplo, as instruções vão se parecer com isso:

1. Instale o adaptador nas depedências do seu projetado utilizando seu gerenciador de pacotes preferido. Se você está utilizando npm ou não tem certeza, execute isto no terminal:

   ```bash
      npm install @astrojs/meu-adaptador
    ```

1. [Adicione o adaptador](/pt-br/reference/configuration-reference/) no import e default export do seu arquivo `astro.config.mjs`

    ```js ins={3,6-7}
    // astro.config.mjs
    import { defineConfig } from 'astro/config';
    import meuAdaptador from '@astrojs/meu-adaptador';

    export default defineConfig({
      output: 'server',
      adapter: meuAdaptador(),
    });
    ```

## Funcionalidades

O Astro continuará sendo um gerador de sites estáticos por padrão. Porém, quando você habilita um adaptador de renderização no lado do servidor, **todas as rotas no seu diretório pages se torna uma rota renderizada no servidor** e algumas novas funcionalidades são disponibilizadas a você.

### `Astro.request.headers`

Os cabeçalhos de uma requisição estão disponíveis em `Astro.request.headers`. Ele é um objeto [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers), parecido com um Map, onde você pode pegar cabeçalhos como o cookie.

```astro title="src/pages/index.astro" {2}
---
const cookie = Astro.request.headers.get('cookie');
// ...
---
<html>
  <!-- Página aqui... -->
</html>
```

:::caution
As funcionalidades abaixo estão disponíveis apenas em páginas. (Você não pode usá-las dentro de componentes, incluindo componentes de layout)

Isso é por que essas funcionalidades modificam os [Response headers](https://developer.mozilla.org/en-US/docs/Glossary/Response_header), que não podem ser modificados após serem enviados ao navegador. No modo SSR, Astro utiliza streaming de HTML para enviar cada componente ao navegador enquanto são renderizados. Isso permite que o usuário veja o HTML o mais rápido o possível, mas também significa que no momento em que o Astro executar o código de seu componente, ele já terá enviado os Response headers.
:::

### `Astro.redirect`

Na global `Astro`, este método permite que você redirecione para outra página. Você talvez faça isso após checar se o usuário está logado obtendo sua sessão de um cookie.

```astro title="src/pages/conta.astro" {8}
---
import { isLogado } from '../utils';

const cookie = Astro.request.headers.get('cookie');

// Se o usuário não estiver logado, ele é então redirecionado para a página de login
if (!isLogado(cookie)) {
  return Astro.redirect('/login');
}
---
<html>
  <!-- Página aqui... -->
</html>
```

### `Response`

Você também consegue retornar uma [Response](https://developer.mozilla.org/pt-BR/docs/Web/API/Response) de qualquer página. Você talvez faça isso para retornar um 404 em uma página dinâmica após verificar um id em um banco de dados.

```astro title="src/pages/[id].astro" {8-11}
---
import { getProduto } from '../api';

const produto = await getProduto(Astro.params.id);

// O produto não foi encontrado
if (!produto) {
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

## Rotas de API

Uma [rota de API](https://medium.com/@rajat_m/what-are-restful-routes-and-how-to-use-them-929129ae7bf6) é um arquivo `.js` ou `.ts` no diretório `/src/pages` que recebe um [Request](https://developer.mozilla.org/pt-BR/docs/Web/API/Request) e retorna uma [Response](https://developer.mozilla.org/pt-BR/docs/Web/API/Response). Uma poderosa funcionalidade do SSR, rotas de API são capazes de executar código de forma segura no lado do servidor.

### SSR e Rotas

No Astro, essas rotas se tornam em rotas renderizadas no servidor, te permitindo utilizar funcionalidades que eram previamente indisponíveis no lado do cliente ou necessitavam de chamadas explícitas a um servidor backend e código extra no cliente para renderizar os resultados.

No exemplo abaixo, uma rota de API é utilizada para pegar um produto de um banco de dados, sem precisar gerar uma página para cada uma das opções.

```js title="src/pages/[id].js"
import { getProduto } from '../db';

export async function get({ params }) {
  const { id } = params;
  const produto = await getProduto(id);

  if (!produto) {
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

Neste exemplo, código HTML válido pode ser retornado para renderizar toda a página ou parte de seu conteúdo.

Além de buscar conteúdo e renderização no servidor, rotas de API podem ser utilizadas como endpoints de uma API Rest para executar funções como autenticações, acesso a bancos de dados, e verificações sem expor dados sensíveis para o cliente.

Nesse exemplo abaixo, uma rota de API é usada para verificar o reCaptcha v3 do Google sem expor a chave secreta aos clientes.

```astro title="src/pages/index.astro"
<html>
  <head>
    <script src="https://www.google.com/recaptcha/api.js"></script>
  </head>
  
  <body>
    <button class="g-recaptcha" 
      data-sitekey="PUBLIC_SITE_KEY" 
      data-callback="onSubmit" 
      data-action="submit"> Clique aqui para verificar o desafio captcha! </button>

    <script is:inline>
      function onSubmit(token) {
        fetch("/recaptcha", {
          method: "POST",
          body: JSON.stringify({ recaptcha: token })
        })
        .then((resposta) => resposta.json())
        .then((gResposta) => {
          if (gResposta.success) {
            // Verificação do captcha foi um sucesso
          } else {
            // Verificação do captcha falhou
          }
        })
      }
    </script>
  </body>
</html>
```

Na rota de API você pode seguramente definir valores secretos, ou ler suas variáveis de ambiente secretas.

```js title="src/pages/recaptcha.js"
import fetch from 'node-fetch';

export async function post({ request }) {
  const dados = await request.json();

  const recaptchaURL = 'https://www.google.com/recaptcha/api/siteverify';
  const corpoRequisicao = {
    secret: "CHAVE_SECRETA_DO_SEU_SITE",   // Isto pode ser uma variável de ambiente
    response: dados.recaptcha          // O token passado para o cliente
  };

  const resposta = await fetch(recaptchaURL, {
    method: "POST",
    body: JSON.stringify(corpoRequisicao)
  });

  const dadosResposta = await resposta.json();

  return new Response(JSON.stringify(dadosResposta), { status: 200 });
}
```

### Redirecionamentos

Já que `Astro.redirect` não está disponível em Rotas de API, você pode utilizar [`Response.redirect`](https://developer.mozilla.org/en-US/docs/Web/API/Response/redirect).

```js title="src/pages/links/[id].js" {14}
import { getUrlLink } from '../db';
export async function get({ params }) {
  const { id } = params;
  const link = await getUrlLink(id);
  if (!link) {
    return new Response(null, {
      status: 404,
      statusText: 'Não encontrado'
    });
  }
  return Response.redirect(link, 307);
}
```

`Response.redirect` requer que você passe uma URL inteira. Para redirecionamentos locais, você pode utilizar `request.url` como base com o [construtor `URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) para construir uma URL absoluta:

```js title="src/pages/redirecionamentos.js"
export async function get({ request }) {
  const url = new URL('/home', request.url);
  return Response.redirect(url, 307);
}
