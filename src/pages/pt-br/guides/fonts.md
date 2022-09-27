---
title: Usando fontes personalizadas
description: Buscando adicionar algumas tipografias personalizadas a um site Astro? Use o Google Fonts com Fontsource ou adicione uma fonte de sua escolha. 
i18nReady: true
layout: ~/layouts/MainLayout.astro
setup: |
    import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro';
---

O Astro suporta todas as estratégias mais comuns para adicionar fontes personalizadas ao projeto de seu site. Este guia lhe mostrará duas opções diferentes para incluir fontes da web em seu projeto.

## Usando um arquivo de fonte local

Se você quiser adicionar arquivos de fontes ao seu projeto, recomendamos adicioná-los ao seu [`public/` directory](/pt-br/core-concepts/project-structure/#public). Em seu CSS você pode então registrar as fontes com uma declaração[`@font-face` ](https://developer.mozilla.org/pt-BR/docs/Web/CSS/@font-face) e usar a propriedade `font-family` para estilizar seu site.

### Exemplo

Imaginemos que você tenha um arquivo de fonte 'DistantGalaxy.woff'.

1. Adicione seu arquivo de fontes ao `public/fonts/`.

2. Adicione uma declaração `@font-face` ao seu CSS. Isto pode ser em um arquivo global `.css` que você importa ou em um bloco `<style>` no layout ou componente onde você deseja utilizar esta fonte.

    ```css
    /* Registre nossa família de fontes personalizadas e indique ao navegador onde encontrá-la. */
    @font-face {
      font-family: 'DistantGalaxy';
      src: url('/fonts/DistantGalaxy.woff') format('woff');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    ```

    :::note
    Não incluímos 'public' na URL de origem das fontes porque todos os arquivos em 'public' são adicionados ao diretório raiz do seu site.
    :::

3. Utilize a declaração `font-family` da declaração `@font-face` para estilizar elementos em seu componente ou layout. Nesse exemplo, o título `<h1>` terá a fonte personalizada aplicada, enquanto que o parágrafo `<p>` não terá.

    ```astro {10-12}
    ---
    // src/pages/example.astro
    ---

    <h1>Em uma galáxia distante, muito distante...</h1>

    <p>Fontes personalizadas tornam meus cabeçalhos muito mais legais!</p>

    <style>
    h1 {
      font-family: 'DistantGalaxy', sans-serif;
    }
    </style>
    ```

## Usando Fontsource

O projeto [Fontsource](https://fontsource.org/) simplifica o uso das fontes do Google e outras fontes de código aberto. Ele fornece módulos npm que você pode instalar para as fontes que você deseja utilizar.

1. Encontre a fonte que você quer usar no [Catálogo de fontes](https://fontsource.org/fonts). Para este exemplo, vamos usar a fonte [Twinkle Star](https://fontsource.org/fonts/twinkle-star).

2. Instale o pacote para a sua fonte escolhida.

    <PackageManagerTabs>
      <Fragment slot="npm">
      ```shell
      npm i @fontsource/twinkle-star
      ```
      </Fragment>
      <Fragment slot="pnpm">
      ```shell
      pnpm i @fontsource/twinkle-star
      ```
      </Fragment>
      <Fragment slot="yarn">
      ```shell
      yarn add @fontsource/twinkle-star
      ```
      </Fragment>
    </PackageManagerTabs>

    :::tip
    Você encontrará o nome correto do pacote na seção "Instalação rápida (Quick Installation)" de cada página de fontes no site da Fontsource. Ele começará com `@fontsource/` seguido do nome da fonte.
    :::

3. Importe o pacote de fontes no layout ou componente onde você deseja usar a fonte. Geralmente, você vai querer fazer isso em um componente de layout comum para garantir que a fonte esteja disponível em todo o seu site.

    A importação do pacote acrescentará automaticamente as regras `@font-face` necessárias para a configuração da fonte.

    ```astro
    ---
    // src/layouts/BaseLayout.astro
    import '@fontsource/twinkle-star';
    ---
    ```

4. Use a `font-family` como mostrado na página de fontes do Fontsource. Isto funcionará em qualquer lugar onde você possa escrever CSS em seu projeto Astro.

    ```css
    h1 {
      font-family: "Twinkle Star", cursive;
    }
    ```

## Materiais extras

### Adicione fontes com Tailwind

Se você estiver usando a [integração Tailwind](/pt-br/guides/integrations-guide/tailwind/), você pode adicionar uma declaração `@font-face` para uma fonte local ou usar usar a estratégia de `import` da Fontsource para registrar sua fonte. Então, siga [os documentos do Tailwind sobre como adicionar famílias de fontes personalizadas](https://tailwindcss.com/docs/font-family#using-custom-values).

### Aprenda como funcionam as fontes na web

[O guia de fontes web da MDN](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Web_fonts) introduz o tópico.

### Gerando CSS para sua fonte

[Gerador de Fonte Squirrel's Webfont](https://www.fontsquirrel.com/tools/webfont-generator) pode ajudar a preparar seus arquivos de fontes para você.
