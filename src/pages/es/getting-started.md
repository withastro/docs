---
setup: |
    import Button from '../../components/Button.astro'
    import ContributorList from '../../components/ContributorList.astro'
    import PackageManagerTabs from '~/components/tabs/PackageManagerTabs.astro'
layout: ~/layouts/MainLayout.astro
title: Empezando
description: Introducción básica a Astro.
i18nReady: true
---

#### ¿Qué es Astro?

Astro es un **framework web con todo incluido** para crear páginas web **rápidas** y **centradas en el contenido**.

#### Características clave

- **Islas de componentes:** Una nueva arquitectura web para crear sitios web más rápidos.
- **Diseño de API que prioriza el servidor:** Elimina la costosa hidratación de los dispositivos de tus usuarios.
- **Cero JS, de forma predeterminada:** Sin sobrecarga del entorno de ejecución de JavaScript que lo ralentice.
- **Listo para Edge:** Despliegue en cualquier lugar, incluso en un entorno de ejecución global Edge como Deno o Cloudflare.
- **Personalizable:** Tailwind, MDX y más de 100 integraciones entre las que elegir.
- **UI-Agnóstico:** Compatible con React, Preact, Svelte, Vue, Solid, Lit y más.
Generador de sitios estáticos  🚀  Trae tu propio Framework  🚀  Utiliza menos JavaScript

<!-- - Cargado de componente **`client:visible`:** Si tu usuario nunca lo ve, nunca se carga. -->
<!-- - **Optimizaciones de imagen:** Nuestro propio componente `<Image />` -->
<!-- - **Compatibilidad con TypeScript** -->
<!-- - **Enrutamiento basado en archivos:** Cada archivo en el directorio de páginas se convierte en una ruta. -->

Consulta nuestro resumen detallado de [¿Por qué Astro?](/es/concepts/why-astro/) para obtener más información sobre qué hace a Astro especial. ✨

## ¡Prueba Astro en tu navegador!

Visita [astro.new](https://astro.new/) y elige entre una variedad de plantillas para comenzar. ¡Juega con una versión completa y funcional de Astro directamente en tu navegador!

O bien puedes **ejecutar nuestro proyecto básico instantáneamente** con tan sólo el click de un botón:

<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
    <Button href="https://astro.new/basics?on=stackblitz">¡Inicio rápido!</Button>
    <Button variant="outline" href="https://astro.new/">Ver todas las plantillas →</Button>
</div>

## Empieza tu primer proyecto

¡Crea un nuevo proyecto de Astro localmente con nuestro asistente de CLI `create-astro`!

<PackageManagerTabs>
  <Fragment slot="npm">
  ```shell
  # crear un nuevo proyecto con npm
  npm create astro@latest
  ```
  </Fragment>
  <Fragment slot="pnpm">
  ```shell
  # crear un nuevo proyecto con pnpm
  pnpm create astro@latest
  ```
  </Fragment>
  <Fragment slot="yarn">
  ```shell
  # crear un nuevo proyecto con yarn
  yarn create astro
  ```
  </Fragment>
</PackageManagerTabs>

Nuestra [guía de instalación](/es/install/auto/) tiene instrucciones paso a paso para instalar Astro utilizando tu gestor de paquetes favorito.

## Aprende Astro

¡Encuentra ejemplos de los patrones y conceptos clave de un proyecto de Astro!

📚 [Agrega tu primera página](/es/core-concepts/astro-pages/) a tu proyecto.

📚 Lee más sobre la [estructura del proyecto](/es/core-concepts/project-structure/) de Astro.

📚 Aprende sobre el [enrutamiento basado en archivos](/es/core-concepts/routing/) de Astro.

*... encuentra la documentación completa de la API en la pestaña **Referencia**.*

## Extiende Astro

🧰 Comienza tu próximo proyecto con una [plantilla prediseñada](https://astro.build/themes).

🧰 Personaliza tu proyecto con [plugins y componentes](https://astro.build/integrations/) oficiales y hechos por la comunidad.

🧰 Inspírate visitando nuestra [exhibición de proyectos](https://astro.build/showcase).

*... lea nuestra [guía de integraciones](/es/guides/integrations-guide/)*


## Únete a nuestra comunidad

Únete al [Discord de Astro](https://astro.build/chat) para compartir conocimiento y recibir ayuda de una comunidad activa y muy amigable!

💬 Di hola en nuestro canal `#introduce-yourself`!

💬 Pregunta lo que necesites a nuestro Support Squad en el canal `#support-threads`!

💬 Comparte lo que has hecho en nuestro canal `#showcase`!


## Aprende más

[Blog de Astro](https://astro.build/blog/)

[Changelog de Astro](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md)

[Guía para migrar a Astro](/es/migrate/)


## Contribuye

Estos docs fueron creados por toda esta gente maravillosa. [Únete a nosotros en GitHub!](https://github.com/withastro/docs)

<ContributorList githubRepo="withastro/docs" />
