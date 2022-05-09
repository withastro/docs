---
layout: ~/layouts/MainLayout.astro
title: Hidratação Parcial no Astro
description: Aprenda como a hidratação parcial funciona usando a "Arquitetura em Ilhas" no Astro.
i18nReady: true
---

**Astro gera todo website com zero JavaScript no lado do cliente, por padrão.** Use qualquer componente de UI frontend que você queira ([React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/) e [Lit](https://lit.dev/)) e o Astro irá automaticamente renderizá-lo como HTML em tempo de build e remover todo o JavaScript. Isso faz todos os sites rápidos por padrão.


```astro
---
// Exemplo: Use um componente React estático na página, sem JavaScript.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- 100% HTML, Zero JavaScript! -->
<MyReactComponent />
```

Porém as vezes, JavaScript no lado do cliente é necessário para criar interfaces de usuário interativas. Quando você se ver precisando de UI interativa na página, Astro não te força a utilizar JavaScript em 100% da página. Em vez disso, Astro utiliza uma técnica chamada **hidratação parcial** que te deixa hidratar componentes individualmente na página. Dessa forma, você envia apenas o JavaScript absolutamente necessário que você precisa para carregar a página.


```astro
---
// Exemplo: Use um componente React dinâmico na página.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- Este componente agora é interativo na página! 
     O resto do seu website continua o mesmo. -->
<MyReactComponent client:load />
```

A maioria do seu site continua como puro e leve HTML e CSS, com isoladas **ilhas de interatividade**.

## Hidratação Parcial

Há vários casos onde você precisa de um componente de UI interativo que rode no navegador:

- Um carrossel de imagens
- Uma barra de pesquisa com autocompletação
- Um botão para abrir/fechar uma barra lateral em dispositivos móveis
- Um botão de "Compre Agora"

No Astro, cabe a você como desenvolvedor escolher explicitamente quais componentes na página precisam rodar no navegador. Astro irá apenas hidratar exatamente o que é necessário na página e deixar o resto do seu site como HTML estático. Esta técnica é conhecida como **hidratação parcial**.

**Hidratação parcial é o segredo da história de rapidez por padrão do Astro.**

## Arquitetura em Ilhas

**Arquitetura em ilhas** é a ideia de utilizar hidratação parcial para se construir websites inteiros. A arquitetura em ilhas é uma alternativa ao comum processo de build do seu website em um pacote de JavaScript no lado do cliente que precisa ser entregue ao usuário.

> A ideia geral de uma arquitetura em "ilhas" é ridiculamente simples: renderize páginas HTML no servidor, e injete placeholders ou slots em áreas altamente dinâmicas. <br/> -- [Arquitetura em Ilhas: Jason Miller](https://jasonformat.com/islands-architecture/)

Apesar dos óbvios benefícios de performance de se enviar menos JavaScript para o navegador, há dois benefícios-chave para a arquitetura em ilhas:

- **Componentes são carregados individualmente.** Um leve componente (como o toggle de uma barra lateral) será carregado e renderizado rapidamente sem ser bloqueado pelos componentes mais pesados na página.
- **Componentes são renderizados isoladamente.** Cada parte da página é uma unidade isolada, e um problema de performance em uma unidade não irá diretamente afetar as outras.

![diagram](https://res.cloudinary.com/wedding-website/image/upload/v1596766231/islands-architecture-1.png)
