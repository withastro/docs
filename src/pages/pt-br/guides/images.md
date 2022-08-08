---
layout: ~/layouts/MainLayout.astro
title: Imagens
description: Aprenda como utilizar imagens no Astro.
i18nReady: true
setup: |
  import Since from '../../../components/Since.astro';
---
Astro providencia diversas formas de você utilizar imagens em seu site, estejam elas armazenadas localmente dentro do seu projeto, vinculadas de uma fonte remota ou armazenadas em um CMS ou CDN!

### Em arquivos `.astro`

Astro utiliza elementos `<img>` ou `<img />` padrões do HTML para mostrar imagens em seus arquivos `.astro`. Todos os atributos de imagens HTML são suportados.

```astro
---
// src/pages/index.astro
import foguete from '../imagens/foguete.svg';
---
<!-- Imagem remota em outro servidor -->
<img src="https://astro.build/assets/logo.png" width="25" alt="Astro">

<!-- Imagem local armazenada em public/assets/estrelas.png -->
<img src="/assets/estrelas.png" alt="O céu de uma noite estrelada.">

<!-- Imagem local armazenada em src/imagens/foguete.svg -->
<img src={foguete} alt="Um foguete no espaço."/>
```

### Em arquivos `.md`

Você pode utilizar a sintaxe `![]()` padrão do Markdown ou tags `<img>` padrão do HTML em seus arquivos `.md` para imagens localizadas no seu diretório `public/` ou imagens remotas em outro servidor.

```md
// src/pages/postagem-1.md

# Minha Página Markdown

<!-- Imagem local armazenada em public/assets/estrelas.png -->
![O céu de uma noite estrelada.](/assets/estrelas.png)
<img src="/assets/estrelas.png" alt="O céu de uma noite estrelada.">

<!-- Imagem remota em outro servidor -->
![Astro](https://astro.build/assets/logo.png)
<img src="https://astro.build/assets/logo.png" width="25" alt="Astro">
```

### Em arquivos `.mdx`

Você pode utilizar a sintaxe `![]()` padrão do Markdown ou tags `<img />` do JSX em seus arquivos `.mdx`. Assim como em arquivos Markdown, arquivos MDX podem mostrar imagens do seu diretório `public/` ou servidores remotos. Eles podem também importar e usar imagens localizadas no diretório `src` do seu projeto, assim como componentes Astro.

```mdx
// src/pages/postagem-1.md

import foguete from '../imagens/foguete.svg';

# Minha Página MDX

// Imagem local armazenada em src/imagens/foguete.svg
<img src={foguete} alt="Um foguete no espaço."/>

// Imagem local armazenada em public/assets/estrelas.png
![O céu de uma noite estrelada.](/assets/estrelas.png)
<img src="/assets/estrelas.png" alt="O céu de uma noite estrelada." />

// Imagem remota em outro servidor
![Astro](https://astro.build/assets/logo.png)
<img src="https://astro.build/assets/logo.png" width="25" alt="Astro" />
```

### Em Componentes de Frameworks de UI

Ao adicionar imagens em um [componente de framework de UI](/pt-br/core-concepts/framework-components/) (e.x React, Svelte), utilize a sintaxe de imagem apropriada para aquele particular framework do componente.

## Aonde armazenar imagens

### `src/`
Suas imagens armazenadas em  `src/` podem ser utilizadas por outros componentes os importando de um **caminho de arquivo relativo** ou [atalho de importação](/pt-br/guides/aliases/) e então utilizando a importação como o atributo `src` da imagem. 


```astro
---
// src/pages/index.astro

// Acesse imagens em `src/imagens/`
import logo from '../imagens/logo.png';
---
<img src={logo} width="40" alt="Astro" />
```

### `public/`

O [diretório `public/`](/pt-br/core-concepts/project-structure/#public) é para arquivos e assets que não precisam ser processados durante o processo de build do Astro. Imagens armazenadas nele serão copiadas no diretório da build intocadas. Estas não são importadas em seu arquivo `.astro`, e o atributo `src` da sua imagem é **relativo ao diretório public**.

```astro
---
// src/pages/index.astro

// Acesse imagens in `public/imagens/`
---
<img src="/imagens/logo.png" />
```

## Integração de Imagens do Astro

:::caution
Após você instalar a integração `@astrojs/image`, arquivos `.astro` não serão mais capazes de usar tags `<img>` padrão do HTML para imagens localizadas na `src` do seu projeto. Todas as imagens locais devem usar os componentes da integração no lugar.

Veja o [guia da integração image](/pt-br/guides/integrations-guide/image/) para mais detalhes sobre essa nova e experimental funcionalidade!
:::

A integração de imagens oficial do Astro providencia dois componentes Astro diferentes para renderizar imagens otimizadas: `<Image />` e `<Picture />`.

Após [instalar a integração](/pt-br/guides/integrations-guide/image/#installation), você pode importar e utilizar esses dois componentes aonde você quiser no seus componentes Astro, incluindo arquivos `.mdx`!

:::note
Os componentes `<Image />` e `<Picture />` do Astro não podem ser utilizadas com imagens no seu diretório `public/`. Use HTML padrão ou a sintaxe de imagens do Markdown no lugar.
:::

### `<Image />`

O [componente `<Image />`](/pt-br/guides/integrations-guide/image/#image-) do Astro te permite otimizar uma imagem e especificar a largura, altura, e/ou a proporção da tela. Você pode até mesmo transformar sua imagem para um formato de saída específico, que pode ser utilizado para evitar checagens do tipo de arquivo de imagens remotas.

Este componente é útil para imagens que você quer manter com um tamanho consistente entre telas ou minuciosamente controlar a qualidade da imagem (e.x. logos).

#### Imagens Locais

Arquivos de imagem no diretório fonte do seu projeto podem ser importados no frontmatter e passados diretamente para o atributo `src` do componente `<Image />`. Todas as outras propriedades são opcionais e serão definidas como as propriedades padrões da imagem se não providenciadas.

#### Imagens Remotas

Imagens remotas precisam de uma URL completa como a `src` da imagem. Você também precisa providenciar `width` e `height` ou uma das dimensões mais o obrigatório atributo `aspectRatio` para o componente `<Image />`.

#### Exemplos

```astro
---
// src/pages/index.astro
import { Image } from '@astrojs/image/components';
import imagemLocal from '../assets/local.png';
const urlImagem = 'https://astro.build/assets/logo.png';
---

// imagem local otimizada, mantendo a largura, altura e formato da imagem
<Image src={imagemLocal} />

// altura será recalculada para se igualar a original (local apenas) ou proporção de tela especificada
<Image src={imagemLocal} width={300} />
<Image src={urlImagem} width={300} aspectRatio={16/9} />

// cortando para uma largura e altura específica
<Image src={localImage} width={300} height={600} />
<Image src={urlImagem} width={544} height={184} />

// cortando para uma proporção de tela específica e convertendo para o formato avif
<Image src={localImage} aspectRatio="16:9" format="avif" />
<Image src={urlImagem} height={200} aspectRatio="16:9" format="avif" />

// importações de imagem local também podem ser feitas diretamente em linha
<Image src={import('../assets/local.png')} />
```

### `<Picture /> `

O [componente `<Picture />`](/pt-br/guides/integrations-guide/image/#picture-) do Astro pode ser utilizada para providenciar imagens responsivas no seu site, incluindo múltiplos tamanhos de imagem, formatos e layouts. Você pode deixar o navegador do usuário escolher o tamanho, resolução e tipo de arquivo apropriados para a imagem baseado em fatores como o tamanho da tela e a banda larga. Ou, você pode especificar regras que o navegador deve obedecer baseado em media queries. 

Este componente é útil para otimizar o que o seu usuário vê em vários tamanhos de tela ou para direção de arte.

:::tip
Veja o guia da MDN para mais informações sobre [imagens responsivas e direção de arte](https://developer.mozilla.org/pt-BR/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images#dire%C3%A7%C3%A3o_de_arte).
:::

Por padrão, o componente `<Picture />` irá incluir os formatos `avif` e `webp` em adição ao formato original da imagem.

#### Imagens Locais

Arquivos de imagens locais no diretório `src` do seu projeto podem ser importados no frontmatter e passados diretamente para o componente `<Picture />`. `src`, `widths` e `sizes` são propriedades obrigatórias.

#### Imagens Remotas

Em adição a `src`, `widths` e  `sizes`, `aspectRatio` também é obrigatório para garantir que a `height` correta possa ser calculada em tempo de build.

#### Exemplos

```astro
---
import { Picture } from '@astrojs/image/components';
import imagemLocal from '../assets/imagemLocal.png';
const urlImagem = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
---

// Imagem local com múltiplos tamanhos e formatos
<Picture src={imagemLocal} widths={[200, 400, 800]} sizes="(max-width: 800px) 100vw, 800px" formats=['avif', 'jpeg', 'png', 'webp'] alt="Minha imagem local" />

// Imagem remota (proporção de tela é obrigatória)
<Picture src={urlImagem} widths={[200, 400, 800]} aspectRatio="4:3" sizes="(max-width: 800px) 100vw, 800px" alt="Minha imagem remota" />

// Importações em linha são suportadas
<Picture src={import("../assets/imagemLocal.png")} widths={[200, 400, 800]} sizes="(max-width: 800px) 100vw, 800px" alt="Minha imagem local" />
```

### Utilizando em MDX

Em arquivos `.mdx`, `<Image />` e `<Picture />` podem receber a `src` da sua imagem através de importações e exportações.

```mdx
// src/pages/index.mdx

import { Image, Picture } from '@astrojs/image/components';
import foguete from '../assets/foguete.png';
export const galaxia = 'https://astro.build/assets/galaxia.jpg';

<Image src={import('../assets/logo.png')} alt="Astro"/>
<Image src={foguete} width={300} alt="Espaçonave se aproximando da lua.">
<Picture src={foguete} widths=[{200, 400, 800}] sizes="(max-width: 800px) 100vw, 800px" alt="Um foguete decolando." />
<Picture src={galaxia} widths=[{200, 400, 800}] aspectRatio={16/9} sizes="(max-width: 800px) 100vw, 800px" alt="Espaço sideral." />
```

## Utilizando Imagens de um CMS ou CDN

CDNS de imagens funcionam com Astro. Utilize sua URL como o atributo `src` da imagem como você faria ao escrever HTML ou JSX ou como o atributo `src` de uma imagem remota com os componentes `<Image />` e `<Picture />`.

Alternativamente, se o CDN providencia um SDK Node.js, você pode utilizá-lo no seu projeto. Por exemplo, o [SDK da Cloudinary](https://cloudinary.com/documentation/node_integration) podem gerar a tag `<img>` com a `src` apropriada para você.

## Integrações da Comunidade

Em adição a integração oficial [`@astrojs/image`](/en/guides/integrations-guide/image/), tem várias [integrações de imagens da comunidade](https://astro.build/integrations/css+ui/?q=image) feitas por terceiros para otimizar e trabalhar com imagens em seu projeto Astro.
