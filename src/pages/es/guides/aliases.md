---
layout: ~/layouts/MainLayout.astro
title: Aliases
description: Introducción a los alias en Astro.
i18nReady: true
---

Un **alias** es una forma de crear atajos para sus importaciones.

Los alias ayudan a mejorar la experiencia de desarrollo en repositorios con muchas carpetas o importaciones relativas.

```astro
---
// my-project/src/pages/about/company.astro

import Button from '../../components/controls/Button.astro';
import logoUrl from '../../assets/logo.png?url';
---
```

En este ejemplo, un desarrollador necesitaría comprender la relación de archivos entre `src/pages/about/company.astro`, `src/components/controls/Button.astro` y `src/assets/logo.png`. Y luego, si se moviera el archivo `company.astro`, estas importaciones también tendrían que actualizarse.

Puedes agregar alias de importación desde `tsconfig.json` o `jsconfig.json`.

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"]
    }
  }
}
```

Con este cambio, ahora puedes importar usando los alias desde cualquier parte de su proyecto:

```astro
---
// my-project/src/pages/about/company.astro

import Button from '@components/Button';
import logoUrl from '@assets/logo.png';
---
```

Estos alias también se integran automáticamente a [VSCode](https://code.visualstudio.com/docs/languages/jsconfig) y otros editores.
