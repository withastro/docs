---
layout: ~/layouts/MainLayout.astro
title: Atalhos
description: Uma introdução aos atalhos com Astro.
---

Um **alias** é uma maneira de criar atalhos para as suas importações.

Atalhos podem ajudar a melhorar a experiência de desenvolvimento em bases de código com muitos diretórios ou importações relativas.

```astro
---
// meu-projeto/src/pages/sobre/empresa.astro

import Botao from '../../components/controles/Botao.astro';
import logoUrl from '../../assets/logo.png?url';
---
```

Neste exemplo, um desenvolvedor precisaria entender a árvore de relação entre `src/pages/sobre/empresa.astro`, `src/components/controles/Botao.astro` e `src/assets/logo.png`. E então, se o arquivo `empresa.astro` for movido para outro diretório, estas importações precisariam ser atualizadas.


Você pode adicionar um atalho de importação em `tsconfig.json` ou `jsconfig.json`.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@assets/*": ["src/assets/*"],
      "@components/*": ["src/components/*"],
      "@assets/*": ["src/assets/*"]
    }
  }
}
```

Com esta alteração, você pode usar o atalho para importar seus arquivos em qualquer lugar do projeto:

```astro
---
// meu-projeto/src/pages/sobre/empresa.astro

import Botao from '@components/Botao.astro';
import logoUrl from '@assets/logo.png';
---
```

Estes atalhos são automaticamente integrados ao [VSCode](https://code.visualstudio.com/docs/languages/jsconfig) e a outros editores.
