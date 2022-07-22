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

Você irá encontrar mais instruções nos links individuais dos adaptadores acima para completar os seguintes dois passos (usando `meu-adaptador` como um nome de exemplo) para habilitar o SSR.
1. Instale o adaptador nas dependências do seu projeto através do npm ou de seu gerenciador de pacotes preferido

   ```bash
      npm install --save-dev @astrojs/meu-adaptador
    ```

1. [Adicione o adaptador](/pt-br/reference/configuration-reference/) no import e default export do seu arquivo `astro.config.mjs`

    ```diff
    // astro.config.mjs
    import { defineConfig } from 'astro/config';
    + import meuAdaptador from '@astrojs/meu-adaptador';
    export default defineConfig({
    +   adapter: meuAdaptador(),
    });
    ```

## Funcionalidades

O Astro continuará sendo um gerador de sites estáticos por padrão. Porém, quando você habilita um adaptador de renderização no lado do servidor, **todas as rotas no seu diretório pages se torna uma rota renderizada no servidor** e algumas novas funcionalidades são disponibilizadas a você.

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

## Rotas de API

Uma [rota de API](https://medium.com/@rajat_m/what-are-restful-routes-and-how-to-use-them-929129ae7bf6) é um arquivo `.js` ou `.ts` no diretório `/src/pages` que recebe um [Request](https://developer.mozilla.org/pt-BR/docs/Web/API/Request) e retorna uma [Response](https://developer.mozilla.org/pt-BR/docs/Web/API/Response). Uma poderosa funcionalidade do SSR, rotas de API são capazes de executar código de forma segura no lado do servidor.

### SSR e Rotas

No Astro, essas rotas se tornam em rotas renderizadas no servidor, te permitindo utilizar funcionalidades que eram previamente indisponíveis no lado do cliente ou necessitavam de chamadas explícitas a um servidor backend e código extra no cliente para renderizar os resultados.

No exemplo abaixo, uma rota de API é utilizada para pegar um produto de um banco de dados, sem precisar gerar uma página para cada uma das opções.

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

Neste exemplo, código HTML válido pode ser retornado para renderizar toda a página ou parte de seu conteúdo.

Além de buscar conteúdo e renderização no servidor, rotas de API podem ser utilizadas como endpoints de uma API Rest para executar funções como autenticações, acesso a bancos de dados, e verificações sem expor dados sensíveis para o cliente.

Nesse exemplo abaixo, uma rota de API é usada para verificar o reCaptcha v3 do Google sem expor a chave secreta aos clientes.

__pages/index.astro__

```astro
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
      function onSubmit(token){
        fetch("/recaptcha",{
          method: "POST",
          body: JSON.stringify({recaptcha: token})
        })
        .then((resposta) => resposta.json())
        .then((gResposta) => {
          if(gResposta.success){
            // Verificação do captcha foi um sucesso
          } else{
            // Verificação do captcha falhou
          }
        })
      }
    </script>
  </body>
</html>
```

Na rota de API você pode seguramente definir valores secretos, ou ler suas variáveis de ambiente secretas.

__pages/recaptcha.js__

```js
import fetch from 'node-fetch';
export async function post({request}){
  const dados = request.json();
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
  return new Response(JSON.stringify(dadosResposta), {status: 200});
}
```
