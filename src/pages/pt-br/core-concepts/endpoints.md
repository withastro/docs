---
layout: ~/layouts/MainLayout.astro
title: Endpoints
description: Aprenda a criar endpoints que podem processar todo tipo de dados
i18nReady: true
---

O Astro permite que você crie endpoints customizados para servir e processar todo tipo de dados. Isso pode ser usado para gerar imagens, gerar e expor um arquivo RSS ou usar como rotas de API para construir uma API completa para o seu site.

Em sites gerados de forma estática, seus endpoints customizados são chamados durante a fase de *build* para produzir arquivos estáticos. Já em sites usando o [modo SSR](/pt-br/guides/server-side-rendering/#habilitando-o-ssr-em-seu-projeto) seus endpoints customizados se tornarão endpoints reais executados a cada requisição.

Endpoints estáticos e SSR são definidos de maneira similar, mas os endpoints SSR suportam funcionalidades adicionais.

## Endpoints estáticos
Para criar um endpoint customizado, adicione um arquivo `.js` ou `.ts` no diretório `/pages`. A extensão do arquivo será removida durante o processo de build, portanto o nome do arquivo deve conter a extensão que você deseja que os dados usem, por exemplo `src/pages/data.json.ts` se tornará a rota `/data.json`.

Seus endpoints devem exportar uma função `get` (opcionalmente assíncrona) e ela recebe um objeto com duas propriedades (`param` e `request`) como seu único parâmetro. Retornando um objeto contendo a propriedade `body`. Assim o Astro chamará essa função durante o build e usará os conteúdos de `body` para gerar o arquivo.

```js title="src/pages/builtwith.json.ts"
// Se tornará: /builtwith.json
export async function get({params, request}) {
  return {
    body: JSON.stringify({
      name: 'Astro',
      url: 'https://astro.build/',
    }),
  };
}
```

O objeto retornado também pode conter a propriedade `encoding`. Ela deve ser uma string válida do tipo [`BufferEncoding`](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/bdd02508ddb5eebcf701fdb8ffd6e84eabf47885/types/node/buffer.d.ts#L169) aceita pelo método `fs.writeFile` do Node.js. Por exemplo, para gerar uma imagem no formato png retornamos:

```ts title="src/pages/builtwith.json.ts"
export async function get({ params, request }) => {
  const response = await fetch("https://astro.build/assets/press/full-logo-light.png");
  const buffer = Buffer.from(await response.arrayBuffer());

  return {
    body: buffer,
    encoding: 'binary',
  };
};
```

Também é possível adicionar validação de tipo à sua função com o tipo `APIRoute`:

```ts
import type { APIRoute } from 'astro';

export const get: APIRoute = async function get ({params, request}) {
  /* ... */
}
```


### Roteamento dinâmico e a propriedade `params`

Os endpoints suportam as mesmas funcionalidades que as [rotas dinâmicas](/pt-br/core-concepts/routing/#rotas-dinâmicas).

Para utilizá-las, nomeie sua rota utilizando a notação de `[colchetes]` e exporte uma função chamada [`getStaticPaths()`](/pt-br/reference/api-reference/#getstaticpaths). Assim será possível acessar o parâmetro utilizando a propriedade `params` recebida pela sua função `get`.

```ts title="src/pages/[id].json.ts"
import type { APIRoute } from 'astro';

const usernames = ["Sarah", "Chris", "Dan"]

export const get: APIRoute = ({ params, request }) => {
  const id = params.id;
  return {
    body: JSON.stringify({
      name: usernames[id]
    })
  }
};

export function getStaticPaths () {
    return [ 
        { params: { id: "0"} },
        { params: { id: "1"} },
        { params: { id: "2"} },
    ]
}
```

Dessa forma serão gerados três arquivos, `/api/1.json`, `/api/2.json` e `/api/3.json`.

O roteamento dinâmico com endpoints funciona da mesma forma que com as páginas com exceção da propriedade [props](/pt-br/reference/api-reference/#passagem-de-dados-com-props) que não é suportada pela função `get` não ser um componente.

### `request`
Todos os endpoints recebem uma propriedade `request`, porém no modo estático você só tem acesso a propriedade `request.url`, que conterá o URL completo para o endpoint atual e funcionará da mesma forma que o [Astro.url](/pt-br/reference/api-reference/#astrourl) funciona nas páginas. 

```ts title="src/pages/request-path.json.ts"
import type { APIRoute } from 'astro';

export const get: APIRoute = ({ params, request }) => {
  return {
    body: JSON.stringify({
      path: new URL(request.url).pathname
    })
  };
}
```

## Endpoints dinâmicos (rotas de API)
Os endpoints dinâmicos suportam todas as propriedades suportadas pelos endpoints estáticos, porém também podem ser usados no modo SSR e serão executados para cada requisição.

Isso permite que você tenha acesso a novas funcionalidades indisponíveis durante o build e permite que você crie rotas que esperam por requisições e executam código de forma segura no servidor.

:::note
Não se esqueça de [habilitar o modo SSR no seu projeto](/pt-br/guides/server-side-rendering/#habilitando-o-ssr-em-seu-projeto) antes de testar esses exemplos.
:::

Os endpoints dinâmicos tem acesso a propriedade `params` sem exportar uma função chamada `getStaticPaths` e podem retornar um objeto [`Response`](https://developer.mozilla.org/pt-BR/docs/Web/API/Response), permitindo que você defina [códigos de status](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status) e [cabeçalhos HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Headers).

```js title="src/pages/[id].json.js"
import { getProduct } from '../db';

export async function get({ params }) {
  const id = params.id;
  const product = await getProduct(id);

  if (!product) {
    return new Response(null, {
      status: 404,
      statusText: 'Não encontrado'
    });
  }

  return new Response(JSON.stringify(product), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
```

Esse código será executado para cada requisição que corresponda à rota. Por exemplo, se navegarmos para `/rick-astley.json`, `params.id` será `rick-astley`.

Assim, se `rick-astley` existir no banco de dados, o endpoint irá criar um objeto `Response` para responder com seu respectivo conteúdo e retornar um código de resposta de sucesso. Caso contrário, ele usará o objeto `Response` para responder com um erro `404`.

### HTTP methods
Além da função `get`, você pode exportar uma função com o nome de qualquer [método HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods). Assim, quando uma requisição for recebida, o Astro irá checar o método e chamar a função correspondente.

Também é possível exportar uma função `all` para corresponder a todos os métodos que já não tenham suas respectivas funções exportadas.

Se não houver um método correspondente exportado para uma requisição, ela será redirecionada para a sua [página de 404](/pt-br/core-concepts/astro-pages/#página-customizada-de-erro-404).

:::note
Como `delete` é um operador do JavaScript, ele é considerado uma palavra reservada. Para responder à requisições com esse método, exporte uma função chamada `del`.
:::

```ts title="src/pages/methods.json.ts"
import type { APIRoute } from 'astro';

export const get: APIRoute = ({ params, request }) => {
  return {
    body: JSON.stringify({
      message: "Método GET"
    })
  }
};

export const post: APIRoute = ({ request }) => {
  return {
    body: JSON.stringify({
      message: "Método POST!"
    })
  }
}

export const del: APIRoute = ({ request }) => {
  return {
    body: JSON.stringify({
      message: "Método DELETE!"
    })
  }
}

export const all: APIRoute = ({ request }) => {
  return {
    body: JSON.stringify({
      message: `Método ${request.method}!`
    })
  }
}
```

### `request`
No modo SSR, a propriedade `request` retorna um objeto [`Request`](https://developer.mozilla.org/pt-BR/docs/Web/API/Request) que se refere a requisição atual, isso permite que você aceite dados e cheque os cabeçalhos dela:

```ts title="src/pages/test-post.json.ts"
export const post: APIRoute = async ({ request }) => {
  if (request.headers.get("Content-Type") === "application/json") {
    const body = await request.json();
    const name = body.name;

    return new Response(JSON.stringify({
      message: `Seu nome é: ${name}`
    }), {
      status: 200
    })
  }
  return new Response(null, { status: 400 });
}
```

### Redirecionamentos
Como `Astro.redirect` não está disponível em rotas de API, você pode usar o método [`Response.redirect`](https://developer.mozilla.org/en-US/docs/Web/API/Response/redirect) para redirecionar:

```js title="src/pages/links/[id].js" {14}
import { getLinkUrl } from '../db';

export async function get({ params }) {
  const { id } = params;
  const link = await getLinkUrl(id);

  if (!link) {
    return new Response(null, {
      status: 404,
      statusText: 'Não encontrado'
    });
  }

  return Response.redirect(link, 307);
}
```

### Exemplo: Verificando um desafio captcha
Endpoints dinâmicos podem ser usados como uma API REST para desempenhar funções como autenticação, acesso ao banco de dados e validações sem expor dados sensíveis ao usuário.

No exemplo abaixo, uma rota de API é usada para verificar um desafio Google reCAPTCHA v3 sem expor os segredos dele aos usuários.

No servidor nós definimos uma função correspondente ao método POST que aceita dados do desafio e então verifica seu resultado com a API do reCAPTCHA. Aqui nós podemos ler as [variáveis de ambiente](/pt-br/guides/environment-variables/) de maneira segura.

```js title="src/pages/recaptcha.js"
export async function post({ request }) {
  const data = await request.json();

  const recaptchaURL = 'https://www.google.com/recaptcha/api/siteverify';
  const requestBody = {
    secret: "SUA_CHAVE_SECRETA",   // Isso pode ser uma variável de ambiente
    response: data.recaptcha       // O token recebido pela requisição
  };

  const response = await fetch(recaptchaURL, {
    method: "POST",
    body: JSON.stringify(requestBody)
  });

  const responseData = await response.json();

  return new Response(JSON.stringify(responseData), { status: 200 });
}
```

Então podemos acessar o endpoint utilizando `fetch` a partir de uma página do seu site:

```astro title="src/pages/index.astro"
<html>
  <head>
    <script src="https://www.google.com/recaptcha/api.js"></script>
  </head>

  <body>
    <button class="g-recaptcha" 
      data-sitekey="PUBLIC_SITE_KEY" 
      data-callback="onSubmit" 
      data-action="submit"
     >
       Clique aqui para verificar o desafio reCAPTCHA!
     </button>

    <script is:inline>
      function onSubmit(token) {
        fetch("/recaptcha", {
          method: "POST",
          body: JSON.stringify({ recaptcha: token })
        })
        .then((response) => response.json())
        .then((gResponse) => {
          if (gResponse.success) {
            // Checagem bem-sucedida, captcha válido
          } else {
            // Checagem malsucedida
          }
        })
      }
    </script>
  </body>
</html>
```