---
layout: ~/layouts/MainLayout.astro
title: 别名
description: 对 Astro 别名的介绍。
---

**别名**可以用于创建简洁的导入。

别名有助于改善在项目中大量使用绝对或相对引用的体验。

```astro
---
// my-project/src/pages/about/company.astro

import Button from '../../components/controls/Button.astro';
import logoUrl from '../../assets/logo.png?url';
---
```

在这个示例中，开发者需要理解 `src/pages/about/company.astro`, `src/components/controls/Button.astro` 和 `src/assets/logo.png` 间的关系。如果移动了 `company.astro` 文件，那么这些导入也都需要更新。

你可以在 `tsconfig.json` 或 `jsconfig.json` 中添加导入别名。

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@assets/*": ["src/assets/*"]
    }
  }
}
```

完成后你就可以在项目中任意一处使用别名了：

```astro
---
// my-project/src/pages/about/company.astro

import Button from '@components/Button.astro';
import logoUrl from '@assets/logo.png';
---
```

[VSCode](https://code.visualstudio.com/docs/languages/jsconfig) 或其他编辑器会自动集成这些别名。
