---
layout: ~/layouts/MainLayout.astro
title: Componentes de Frameworks
description: Aprenda como utilizar React, Svelte, etc.
i18nReady: true
---
Construa seu website Astro sem sacrificar o seu framework de componentes favorito.

Astro suporta uma variedade de frameworks populares incluindo [React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/) e [Lit](https://lit.dev/). 

## Instalando Integrações

Astro vem com integrações opcionais para React, Preact, Svelte, Vue, SolidJS e Lit. Uma ou mais destas integrações podem ser instaladas e configuradas no seu projeto.

Para configurar Astro para utilizar estes frameworks, primeiro, instale sua integração e quaisquer dependências associadas:

```bash
npm install --save-dev @astrojs/react react react-dom
```

Então importe e adicione a função a sua lista de integrações em `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import preact from '@astrojs/preact';
import svelte from '@astrojs/svelte';
import vue from '@astrojs/vue';
import solid from '@astrojs/solid-js';
import lit from '@astrojs/lit';

export default defineConfig({
	integrations: [react(), preact(),svelte(), vue(), solid() , lit()],
});
```

⚙️ Veja o [Guia de Integrações](/pt-BR/guides/integrations-guide/) para mais detalhes em como instalar e configurar integrações Astro.

⚙️ Quer ver um exemplo do framework de sua escolha? Visite [astro.new](https://astro.new) e selecione um dos templates de frameworks.

## Usando Componentes de Frameworks

Utilize os componentes de frameworks JavaScript em suas páginas, layouts e componentes Astro assim como você utilizaria componentes Astro! Todos os seus componentes podem estar juntos em `/src/components`, ou podem ser organizados da forma que você preferir.

Para usar um componente de framework, importe-o de seu caminho relativo no script do componente Astro. Então, use o componente ao lado de outros componentes, como elementos HTML e expressões estilo JSX no template do componente.

```astro
---
import MeuComponenteReact from '../components/MeuComponenteReact';
import MeuComponenteSvelte from '../components/MeuComponenteSvelte.svelte';
---
<html>
  <body>
    <h1>Use componentes React e Svelte diretamente no Astro!</h1>
    <MeuComponenteReact />
    <MeuComponenteSvelte />
  </body>
</html>
```

:::tip
Lembre-se: todas as importações devem estar no **topo** do script do seu componente Astro!
:::

Por padrão, seus componentes de frameworks serão renderizados como HTML estático. Isso é útil para fazer o template de componentes que não são interativos e evita mandar qualquer JavaScript desnecessário ao cliente.

## Hidratando Componentes Interativos

Um componente de framework pode ser tornar interativo (hidratado) utilizando uma das diretivas `client:*`. Isso é um atributo de componente que define como seu componente deve ser **renderizado** e **hidratado**.

Uma [diretiva de cliente](/pt-BR/reference/directives-reference/#diretivas-de-cliente) descreve se o seu componente deve ou não ser renderizado no momento de build e quando o JavaScript do seu componente deve ser carregado pelo navegador, no lado do cliente.

A maioria das diretivas irá renderizar o componente no servidor no momento de build. O JavaScript do componente será enviado ao cliente de acordo com a diretiva especificada. O componente será hidratado quando o seu JS terminar de ser importado.

```astro
---
// Exemplo: hidratando componentes de frameworks no navegador.
import BotaoInterativo from '../components/BotaoInterativo';
import ContadorInterativo from '../components/ContadorInterativo';
---
<!-- O JS desse componente começará a ser importado quando a página carregar -->
<BotaoInterativo client:load />

<!-- O JS desse componente não será enviado ao cliente até que o usuário role a tela até o componente estar visível na página -->
<ContadorInterativo client:visible />
```

:::caution
Qualquer JS de renderização necessário para o componente de framework (e.x. React, Svelte) é baixado com a página. As diretivas `client:*` apenas ditam quando o _JS do componente_ é importado e quando o _componente_ é hidratado.
::: 

### Diretivas de Hidratação Disponível

Há diversas diretivas de hidratação disponíveis para componentes de frameworks de UI: `client:load`, `client:idle`, `client:visible`, `client:media={QUERY}` e `client:only={FRAMEWORK}`.

📚 Veja nossa página de [referência de diretivas](/pt-BR/reference/directives-reference/#diretivas-de-cliente) para uma descrição completa destas diretivas de hidratação e seus usos.

## Misturando Frameworks

Você pode importar e renderizar componentes de múltiplos frameworks em um mesmo componente Astro.

```astro
---
// src/pages/MinhaPaginaAstro.astro
// Exemplo: Misturando múltiplos componentes de frameworks na mesma página.
import MeuComponenteReact from '../components/MeuComponenteReact';
import MeuComponenteSvelte from '../components/MeuComponenteSvelte.svelte';
import MeuComponenteVue from '../components/MeuComponenteVue.vue';
---
<div>
  <MeuComponenteSvelte />
  <MeuComponenteReact />
  <MeuComponenteVue />
</div>
```

:::caution
Apenas componentes **Astro** (`.astro`) podem conter componentes de múltiplos frameworks.
:::

## Aninhando Componentes de Frameworks

Dentro de um componente Astro, você também pode aninhar componentes de múltiplos frameworks.

```astro
---
// src/pages/MinhaPaginaAstro.astro
import MinhaBarraLateralReact from '../components/MinhaBarraLateralReact';
import MeuBotaoSvelte from '../components/MeuBotaoSvelte.svelte';
---
<MinhaBarraLateralReact>
  <p>Aqui está uma barra lateral com algum texto e um botão.</p>
  <MeuBotaoSvelte client:load />
</MinhaBarraLateralReact>
```

:::caution
Lembre-se: os próprios arquivos dos componentes de frameworks (e.x. `.jsx`, `.svelte`) não podem misturar múltiplos frameworks.
:::

Isso te permite construir "aplicativos" inteiros com seu framework JavaScript favorito e o renderizar, via um componente parente, em uma página Astro. Esse é um padrão conveniente que te permite com que componentes relacionados compartilhem seu estado e contexto.

Cada framework tem seus padrões para aninhamento: por exemplo, `children` props e [render props](https://pt-br.reactjs.org/docs/render-props.html) para React e Solid; `<slot />` com ou sem nomes para Svelte e Vue.


:::note
Componentes Astro sempre são renderizados como HTML estático, até mesmo quando incluem componentes de frameworks que são hidratados. Isso significa que você só pode passar props que não renderizam nenhum HTML. Passar "render props" do React ou slots nomeados para componentes de frameworks a partir de um componente Astro não irá funcionar, pois componentes Astro não podem providenciar o comportamento em runtime do cliente que esses padrões precisam.}
:::

## Posso Hidratar Componentes Astro?

Se você tentar hidratar um componente Astro com um modificador `client:`, você receberá um erro.

[Componentes Astro](/pt-BR/core-concepts/astro-components/) são componentes de template de apenas HTML que não possuem runtime no lado do cliente. Porém, você pode usar uma tag `<script>` no template do seu componente Astro para enviar JavaScript ao navegador que é executado no escopo global.

📚 Aprenda mais sobre [`<scripts>` no lado do cliente em componentes Astro](/pt-BR/core-concepts/astro-components/#scripts-no-lado-do-cliente).


[mdn-io]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
[mdn-ric]: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
[mdn-mm]: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia


