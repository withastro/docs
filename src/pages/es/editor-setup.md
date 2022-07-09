---
layout: ~/layouts/MainLayout.astro
setup: |
  import Badge from '~/components/Badge.astro';
title: Configuración del editor de código
description: Configure su editor de código para desarrollar con Astro.
i18nReady: true
---

Personaliza tu editor de código para mejorar tu experiencia de desarrollo con Astro y desbloquear nuevas funcionalidades.

## VS Code

[VS Code](https://code.visualstudio.com/) es un editor de código popular para desarrolladores web, desarrolado por Microsoft. El motor de VS Code también funciona en los editores de código en el navegador como [GitHub Codespaces](https://github.com/features/codespaces) y [Gitpod](https://gitpod.io/).

Astro funciona en cualquier editor de código. Sin embargo, recomendamos usar VS Code para tus proyectos de Astro. Nosotros mantenemos la [extensión oficial de Astro para VS Code](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode) que desbloquea nuevas funcionalidades y mejora la experiencia de desarrollo para sus proyectos.

- Resaltado de sintaxis para archivos `.astro`.
- Información de tipos de TypeScript para archivos `.astro`.
- [Intellisense de VS Code](https://code.visualstudio.com/docs/editor/intellisense) para autocompletado, sugerencias y más.

Para empezar, instala la [extensión de Astro para VS Code](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).

📚 Aprenda cómo [configurar TypeScript](/es/guides/typescript/) en tu proyecto de Astro.

## Otros editores de código

Nuestra increíble comunidad mantiene extensiones para otros editores de código incluyendo:

- [Extensión de VS Code para Open VSX](https://open-vsx.org/extension/astro-build/astro-vscode)<span style="margin: 0.25em;"><Badge variant="accent">Official</Badge></span> - La extensión official de VS Code, está disponible en el registro the Open VSX para otras plataformas como [VSCodium](https://vscodium.com/).
- [Extensión de Nova](https://extensions.panic.com/extensions/sciencefidelity/sciencefidelity.astro/)<span style="margin: 0.25em;"><Badge variant="neutral">Community</Badge></span> - Resaltado de sintaxis, IntelliSense y autocompletado para Astro.

## Editores de código del navegador

Además de editores de código locales, Astro también funciona en editores de código en el navegador incluyendo:

- [StackBlitz](https://stackblitz.com/) y [CodeSandbox](https://codesandbox.io) - editores de código online del navegador, con resaltado de sintaxis incorporado, y soporte para archivos `.astro`. ¡No necesita instalación o configuración!
- [GitHub.dev](https://github.dev/) - te permite instalar la extensión de Astro para VS Code como una extensión web, que le permite acceder a las funcionalidades de la extensión oficial. Actualmente, sólo soporta el resaltado de sintaxis.
- [Gitpod](https://gitpod.io/) - es un entorno de desarrollo en la nube en la que puedes instalar la extensión de VS Code oficial desde Open VSX.

## Otras herramientas

### ESLint

[ESLint](https://eslint.org/) es un linter popular para JavaScript y JSX. Para activar la compatibilidad con Astro, puedes instalar [un plugin mantenido por la comunidad](https://github.com/ota-meshi/eslint-plugin-astro).

Consulte [la guía del usuario del proyecto](https://ota-meshi.github.io/eslint-plugin-astro/user-guide/) para obtener más información sobre cómo instalar y configurar ESLint para su proyecto.

### Prettier

[Prettier](https://prettier.io/) es un formateador popular para JavaScript, HTML, CSS y más. Para agregar compatibilidad para formatear archivos `.astro`, use [el plugin oficial de Astro Prettier](https://github.com/withastro/prettier-plugin-astro).

Para comenzar, primero instale Prettier y el plugin:

```shell
npm install --save-dev prettier prettier-plugin-astro
```

Prettier detectará automáticamente el plugin y lo usará para procesar los archivos `.astro` cuando lo ejecute:

```shell
prettier --write .
```

Consulte el [README del plugin de Prettier](https://github.com/withastro/prettier-plugin-astro/blob/main/README.md) para obtener más información sobre sus opciones, cómo configurar Prettier dentro de VS Code y más.

:::caution[Uso con pnpm]
Debido a problemas dentro de Prettier, el complemento no se detectará automáticamente al usar [pnpm](https://pnpm.io/). Para que encuentre el plugin, se debe agregar el siguiente parámetro al ejecutar Prettier:

```shell
prettier --write --plugin-search-dir=. .
```

También se requieren configuraciones adicionales cuando se usa Prettier dentro de VS Code. Consulte el README del plugin para obtener más información.
:::
