---
layout: ~/layouts/MainLayout.astro
title: Solução de Problemas
description: Precisa de ajuda? Travado em algo? Temos o que você precisa.
i18nReady: true
---

Astro providencia várias ferramentas diferentes para te ajudar a solucionar problemas e depurar o seu código.

## Mensagens de Erro Comuns

Aqui estão algumas mensagens de erro comuns que você pode encontrar no terminal, o que elas significam e o que fazer sobre elas.

### Transform failed with X error

Esta mensagem geralmente aparece por conta de uma limitação atual no Astro que te obriga a colocar suas declarações de importação e exportação no topo de seu arquivo `.astro`.

**Solução**: Escreva suas importações e exportações no topo do script do seu componente.

**Status**: Limitação atual; correção está sendo trabalhada.

💡 Não tem certeza se este é o seu problema? Verifique nossas issues e veja se mais alguém reportou [esse problema](https://github.com/withastro/astro/issues?q=is%3Aissue+is%3Aopen+Transform+failed+with+*+error)!

### Cannot use import statement outside a module

Em componentes Astro, tags `<script>` são movidas para o topo do escopo (hoisted) e carregadas como [módulos JS](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Modules) por padrão. Se você incluiu a [diretiva `is:inline`](/pt-BR/reference/directives-reference/#isinline) ou qualquer outro atributo em sua tag, esse comportamento padrão é removido.

**Solução**: Se você adicionou qualquer atributo a sua tag `<script>`, você também deve adicionar o atributo `type="module"` para ser capaz de usar declarações de importação.

**Status**: Comportamento esperado do Astro, como pretendido.

💡 Não tem certeza se este é o seu problema? Verifique nossas issues e veja se mais alguém reportou [esse problema](https://github.com/withastro/astro/issues?q=is%3Aissue+is%3Aopen+Cannot+use+import+statement)!

### Unable to render component

Isto indica um erro em um componente que você importou e está utilizando no seu template Astro.

#### Causa comum

Isto pode ser causado por tentar acessar o objeto `window` ou `document` em tempo de renderização. Por padrão, Astro irá renderizar seu componente [isomorficamente](https://en.wikipedia.org/wiki/Isomorphic_JavaScript), o que significa que ele será executado no servidor, onde o runtime do navegador não está disponível. Você pode desabilitar essa etapa de pré-renderização utilizando [a diretiva `client:only`](/pt-BR/reference/directives-reference/#clientonly).

**Solução**: Tente acessar esses objetos após a renderização (ex: [`useEffect()`](https://reactjs.org/docs/hooks-reference.html#useeffect) no React ou [`onMounted()`](https://vuejs.org/api/composition-api-lifecycle.html#onmounted) no Vue e [`onMount()`](https://svelte.dev/docs#run-time-svelte-onmount) no Svelte).

**Status**: Comportamento esperado do Astro, como pretendido.

#### Não é isso?

**Solução**: Verifique a documentação apropriada do seu componente [Astro](/pt-BR/core-concepts/astro-components/) ou a do seu [framework de UI](/pt-BR/core-concepts/framework-components/). Considere abrir um dos templates iniciais do Astro em [astro.new](https://astro.new) e tente solucionar o problema do seu componente em um projeto Astro mínimo.

💡 Não tem certeza se este é o seu problema? Verifique nossas issues e veja se mais alguém reportou [esse problema](https://github.com/withastro/astro/issues?q=is%3Aissue+is%3Aopen+Unable+to+render+Component)!


### Expected a default export

Este erro pode ser lançado ao tentar importar ou renderizar um componente inválido, ou um que não está funcionando corretamente. (Esta mensagem em particular ocorre por causa da forma em que importar um componente de UI funciona no Astro.)

**Solução**: Tente procurar erros em quaisquer componentes que você está importando e renderizando, e certifique-se que estão funcionando corretamente. Considere abrir um dos templates iniciais do Astro em [astro.new](https://astro.new) e tente solucionar o problema do seu componente em um projeto Astro mínimo.

**Status**: Comportamento esperado do Astro, como pretendido.

## Pegadinhas comuns

### Meu componente não está sendo renderizado

Primeiro, certifique-se de que você **importou o componente** no [script do seu componente `.astro`](/pt-BR/core-concepts/astro-components/#o-script-do-componente) ou no [frontmatter do `.md`](/pt-BR/guides/markdown-content/#usando-componentes-no-markdown).

Então verifique sua declaração de importação:

- Estaria a sua importação vinculada ao lugar errado? (Verifique o caminho da importação.)

- Sua importação tem o mesmo nome que o componente importado? (Verifique o nome do seu componente e se ele [segue a sintaxe do `.astro`](/pt-BR/comparing-astro-vs-other-tools/#astro-vs-jsx).)

- Você incluiu a extensão na importação? (Verifique se seu arquivo importado contém uma extensão. e.x. `.astro`, `.md`, `.jsx`, `.vue`)

### Meu componente não é interativo

Se o seu componente está sendo renderizado (veja acima) mas não está respondendo a interação do usuário, então você pode está esquecendo de uma [diretiva `client:*`](/pt-BR/reference/directives-reference/#diretivas-de-cliente) para hidratar seu componente.

Por padrão, um [componente de framework de UI não é hidratado no cliente](/pt-BR/core-concepts/framework-components/#hidratando-componentes-interativos). Se nenhuma diretiva `client:*` é providenciada, seu HTML é renderizado na página sem JavaScript.

Nota: [componentes Astro](/pt-BR/core-concepts/astro-components/) são componentes de templating de apenas HTML sem nenhum runtime no lado do cliente. Porém, você pode utilizar uma tag `<script>` no template do seu componente Astro para enviar JavaScript ao navegador para que seja executado no escopo global.

### Cannot find package 'X'

Veja o [guia de integrações do Astro](/pt-BR/guides/integrations-guide/) para instruções em como adicionar renderers de frameworks, ferramentas de CSS e outros pacotes no Astro.

Você talvez precisa instalar dependências de pares para algumas integrações. Se você ver o aviso "missing peer dependencies", você pode seguir as instruções em como [lidar com dependências](/pt-BR/guides/integrations-guide/#lidando-com-dependências-de-integrações). 

### `Astro.glob()` - no matches found

Quando estiver utilizando `Astro.glob` para importar arquivos, certifique-se de que você utilizou a sintaxe de glob correta que irá encontrar todos os arquivos que você precisa.

#### Caminhos de arquivo

Por exemplo, utilize `../components/**/*.js` em `src/pages/index.astro` para importar ambos os arquivos a seguir:
- `src/components/MeuComponente.js`
- `src/components/inclui/MeuOutroComponente.js`

#### Valores Suportados

 `Astro.glob()` não suporta variáveis dinâmicas e interpolação de strings.
 
Isto não é um bug no Astro. Isso acontece por conta de uma limitação na [função `import.meta.glob()` do Vite](https://vitejs.dev/guide/features.html#glob-import) que apenas suporta string literals estáticas.

Uma solução comum é no lugar importar um largo conjunto de arquivos que inclui todos os arquivos que você precisa utilizando `Astro.glob()` e então os filtrar:

```astro
---
// src/components/destaque.astro
const { slugPostagem } = Astro.props
const caminhoParaPostagemDestacada = `src/pages/blog/${slugPostagem}.md`

const postagens = await Astro.glob('../pages/blog/*.md');
const minhaPostagemDestacada = postagens.find(post => post.file.includes(caminhoParaPostagemDestacada));
---

<p>
    Dê uma olhada na minha postagem favorita, <a href={minhaPostagemDestacada.url}>{minhaPostagemDestacada.frontmatter.titulo}</a>!
</p>
```

### Utilizando Astro com Yarn 2+ (Berry)

Yarn 2+, também conhecido como Berry, utiliza uma técnica chamada [Plug'n'Play (PnP)](https://yarnpkg.com/features/pnp) para armazenar e gerenciar módulos Node e que pode [causar problemas](https://github.com/withastro/astro/issues/3450) durante a inicialização de um novo projeto Astro utilizando `create-astro` ou enquanto você trabalha com Astro. Uma solução para este problema é definir a [propriedade `nodeLinker`](https://yarnpkg.com/configuration/yarnrc#nodeLinker) em `yarnrc.yml` para `node-modules`:

```yaml
nodeLinker: "node-modules"
```

## Dicas e truques

### Depurando com `console.log()`

`console.log()` é um simples porém popular método de depurar seu código Astro. Aonde você escrever sua declaração `console.log` irá determinar onde sua saída da depuração é mostrada.

#### Frontmatter

Uma declaração `console.log()` no frontmatter do Astro irá sempre sair no **terminal** executando a interface de linha de comando do Astro. Isto acontece pois Astro é executado no servidor, e nunca no navegador.

```astro
---
const soma = (a, b) => a + b;

// Exemplo: Mostra "4" no terminal da interface de linha de comando
console.log(soma(2, 2));
---
```

#### Scripts JS

Código que é escrito ou importado dentro de uma tag `<script>` do Astro é executada no navegador. Quaisquer declarações `console.log()` ou outras saídas de depuração serão mostradas no console do seu navegador.

### Depurando componentes de frameworks

[Componentes de frameworks](/pt-BR/core-concepts/framework-components/) (como React e Svelte) são únicos: Eles são renderizados no lado do servidor por padrão, ou seja, a saída da depuração do `console.log()` estará visível no terminal. Porém, eles também podem ser hidratados no navegador, o que pode fazer com que seus logs de depuração também apareçam no navegador.

Isto pode ser útil para depurar as diferenças entre a saída de SSR e os componentes hidratados no navegador.

### Componente `<Debug />` do Astro

Para te ajudar a depurar seus componentes Astro, Astro providencia um componente de [`<Debug />`](/pt-BR/reference/api-reference/#debug-) integrado que renderizar qualquer valor diretamente no template HTML do seu componente. Isto é útil para depuração rápida no navegador sem ter que dar voltas entre o seu terminal e o seu navegador.

```astro
---
import { Debug } from 'astro/components';
const soma = (a, b) => a + b;
---

<!-- Exemplo: Mostra {answer: 6} no navegador -->
<Debug answer={soma(2, 4)} />
```

O componente Debug suporta uma variadade de opções de sintaxe para uma depuração ainda mais flexível e concisa:

```astro
---
import { Debug } from 'astro/components';
const soma = (a, b) => a + b;
const answer = soma(2, 4);
---
<!-- Exemplo: Todos os três exemplo são equivalentes. -->
<Debug answer={soma(2, 4)} />
<Debug {{answer: soma(2, 4)}} />
<Debug {answer} />
```

## Precisa de mais?

Venha e fale conosco no [Discord](https://astro.build/chat) e explique seu problema no canal `#support-threads`. Nós estamos sempre felizes em ajudar!

Visite os atuais [issues abertos no Astro](https://github.com/withastro/astro/issues/) para ver se você está enfrentando um problema conhecido ou para reportar um bug.

Você também pode visitar as [Discussões de RFC](https://github.com/withastro/rfcs/discussions/) para ver se você encontrou uma limitação conhecida do Astro, e verifique para ver se existem propostas atuais relacionadas ao seu caso de uso.
