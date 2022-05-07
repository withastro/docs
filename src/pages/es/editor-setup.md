---
layout: ~/layouts/MainLayout.astro
setup: |
  import Badge from '~/components/Badge.astro';
title: Configuración del editor de código
description: Configure su editor de código para desarrollar con Astro.
i18nReady: true
---

Personalice su editor de código para mejorar la experiencia de desarrollo en
Astro y desbloquear nuevas funcionalidades.

## VS Code

[VS Code](https://code.visualstudio.com) es un editor de código popular para
desarrolladores web, desarrolado por Microsoft. El motor de VS Code también
funciona en los editores de código en el navegador como
[GitHub Codespaces](https://github.com/features/codespaces) y
[Gitpod](https://gitpod.io).

Astro funciona en cualquier editor de código, pero recomendamos usar VS Code
para sus proyectos de Astro. Nosotros mantenemos la
[extensión oficial de Astro para VS Code](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)
que desbloquea nuevas funcionalidades y mejora la experiencia de desarrollo para
sus proyectos.

- Resaltado de sintaxis para archivos `.astro`.
- Información de tipos de TypeScript para archivos `.astro`.
- [Intellisense de VS Code](https://code.visualstudio.com/docs/editor/intellisense)
  para autocompletado, sugerencias y más.

Para empezar, instala la
[extensión de Astro para VS Code](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)
hoy.

> ⚙️ Aprenda cómo [configurar TypeScript](/en/guides/typescript/) en su proyecto
> de Astro.

## Otros editores de código

Nuestra increíble comunidad mantiene extensiones para otros editores de código
incluyendo:

- [Extensión de VS Code para Open VSX](https://open-vsx.org/extension/astro-build/astro-vscode)
  <span style="margin: 0.25em;"><Badge variant="accent">Official</Badge></span> -
  La extensión official de VS Code, está disponible en el registro the Open VSX
  para otras plataformas como [VSCodium](https://vscodium.com/).
- [Extensión de Nova](https://extensions.panic.com/extensions/sciencefidelity/sciencefidelity.astro/)<span style="margin: 0.25em;"><Badge variant="neutral">Community</Badge></span> -
  Resaltado de sintaxis, IntelliSense y autocompletado para Astro.

## Editores de código del navegador

Además de editores de código locales, Astro también funciona en editores de
código del navegador incluyendo:

- [StackBlitz](https://stackblitz.com) y [CodeSandbox](https://codesandbox.io) -
  editores de código online del navegador, con resaltado de sintaxis
  incorporado, y soporte para archivos `.astro`. ¡No necesita instalación o configuración!
- [GitHub.dev](https://github.dev) - le permite instalar la extensión de Astro
  para VS Code como una extensión web, que le permite acceder a las
  funcionalidades de la extensión oficial. Actualmente, sólo soporta el
  resaltado de sintaxis.
- [Gitpod](https://gitpod.io) - es un entorno de desarrollo en la nube en la que puede
  instalar la extensión de VS Code oficial desde Open VSX.
