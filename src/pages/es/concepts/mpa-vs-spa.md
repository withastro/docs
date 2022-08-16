---
layout: ~/layouts/MainLayout.astro
title: MPAs versus SPAs
description: "Comprender los beneficios de elegir entre la arquitectura de la aplicación de varias páginas (MPA Multi Page App) y la aplicación de una sola página (SPA Single Page App) es clave para comprender qué hace que Astro sea diferente de otros frameworks web Remix."
i18nReady: true
---

Comprender los beneficios de elegir entre la arquitectura de la aplicación de varias páginas (MPA Multi Page App) y la aplicación de una sola página (SPA Single Page App) es clave para comprender qué hace que Astro sea diferente de otros frameworks web como Next.js y Remix.

## Terminología

**Una Aplicación de múltiples páginas (MPA)** es un sitio web que consta de varias páginas HTML, en su mayoría renderizadas en un servidor. Cuando navegas a una nueva página, su navegador solicita una nueva página de HTML del servidor. **Astro es un framework MPA.** Los frameworks MPA tradicionales también incluyen Ruby on Rails, Python Django, PHP Laravel, Wordpress y creadores de sitios estáticos como Eleventy o Hugo.

**Una aplicación de página única (SPA)** es un sitio web que consta de una sola aplicación de JavaScript que se carga en el navegador del usuario y luego muestra HTML localmente. Los SPA **también** pueden generar HTML en el servidor, pero los SPA son únicos en su capacidad de ejecutar tu sitio web como una aplicación de JavaScript dentro del navegador, para renderizar modificaciones en el HTML a medida que navegas. Next.js, Nuxt, SvelteKit, Remix, Gatsby y Create React App son todos ejemplos de frameworks SPA.

## Astro versus otros MPAs

Astro es un framework MPA. Sin embargo, Astro también es único comparado con otros frameworks MPA. Su principal diferencia es que utiliza JavaScript como lenguaje de servidor y tiempo de ejecución. Los frameworks MPA tradicionales harían que escribiera un idioma diferente en el servidor (Ruby, PHP, etc.) y JavaScript en el navegador. En Astro, siempre estás escribiendo JavaScript, HTML y CSS. De esa forma, puedes renderizar sus componentes de interfaz de usuario (como React y Svelte) tanto en el servidor como en el cliente.

El resultado es una experiencia de desarrollador que se parece mucho a Next.js y otros marcos web modernos, pero con características de rendimiento de una arquitectura de sitio MPA más tradicional.

## MPAs versus SPAs

Hay tres diferencias principales a tener en cuenta al comparar las AMP con las SPA:

#### Renderizado del lado del Servidor (MPA) versus renderizado del lado del cliente (SPA)

En las MPA, la mayor parte del HTML de su página se renderiza en el servidor. En los SPA, la mayor parte del HTML se renderiza localmente mediante la ejecución de JavaScript en el navegador. Esto tiene un impacto dramático en el comportamiento del sitio, el _performance_ y el SEO.

Renderizar tu HTML en el navegador puede sonar como la opción más rápida en lugar de solicitarlo desde un servidor remoto. Sin embargo, el opuesto es lo verdadero. Una SPA tendrá un rendimiento consistentemente más lento en la carga de la primera página en comparación con una MPA, a menos que se utilice el rendidado del lado del servidor. Esto se debe a que una SPA necesita descargar, analizar y ejecutar una aplicación de JavaScript completa en el navegador solo para mostrar el más mínimo HTML en la página. Entonces, es probable que tu SPA necesite obtener datos remotos de todos modos, introduciendo aún más tiempo de espera antes de que su página termine de cargarse.

La mayoría de los frameworks SPA intentarán mitigar este problema de _performance_ agregando un renderizado básico en el lado del servidor en la carga de la primera página. Esta es una mejora, pero introduce una nueva complejidad debido al hecho de que tu sitio web ahora puede mostrarse de múltiples maneras y en múltiples entornos (servidor, navegador). Esto también introduce un nuevo problema de "uncanny valley" ("valle inquietante") en el que tu sitio aparece cargado (HTML) pero no interactivo ya que la lógica de JavaScript de la aplicación aún se está cargando en segundo plano.

Los MPA procesan todo el HTML en un servidor remoto y, a menudo, no requieren mucho JavaScript (si es que lo necesitan) para ejecutarse. Esto brinda a las MPA una primera experiencia de carga mucho más rápida que las SPA, lo cual es esencial para los sitios web centrados en el contenido. Pero esto viene con una compensación: la navegación futura de la página no puede beneficiarse del renderizado local, por lo que las experiencias de usuario de larga duración no se beneficiarán tanto después de la carga de la primera página.

#### Enrutamiento del lado del Servidor (MPA) versus enrutamiento del lado del cliente (SPA)

¿Dónde vive el enrutador de su sitio web? En un MPA, cada solicitud al servidor decide con qué HTML responder, por lo que la lógica de enrutamiento vive en el servidor. En un SPA, su enrutador se ejecuta localmente en el navegador y secuestra cualquier navegación para mostrar la nueva página sin tocar un servidor.

Esta es una compensación similar a la descrita anteriormente: las MPA ofrecen una primera experiencia de carga más rápida, mientras que las SPA pueden ofrecer una segunda o tercera carga de página más rápida una vez que la aplicación JavaScript está completamente cargada en el navegador.

Los SPA también pueden ofrecer transiciones más potentes en la navegación de la página porque controlan mucho el renderizado de la página. Para igualar este soporte, las MPA aprovechan herramientas como [Turbo](https://turbo.hotwired.dev/) de Hotwire que imitan el enrutamiento del cliente al controlar también la navegación en el navegador. El HTML todavía se representa en el servidor, pero Turbo ahora puede mostrar una transición perfecta entre páginas similar al enrutamiento del cliente en un SPA.

#### Gestión del estado en el lado del servidor (MPA) frente a gestión del estado en el lado del cliente (SPA)

Las SPA son la arquitectura superior para los sitios web que se ocupan de la gestión de estado compleja de varias páginas (piense en Gmail). Esto se debe a que una SPA ejecuta todo el sitio web como una sola aplicación de JavaScript, lo que permite que la aplicación mantenga el estado y la memoria en varias páginas. Las experiencias interactivas basadas en datos, como las bandejas de entrada y los paneles de administración, funcionan bien como SPA porque el sitio web en sí es intrínsecamente "igual a una aplicación".

## ¿Son mejores las SPA que las MPA?

Al comparar las MPAs con las SPAs, no hay una opción "mejor" or "peor". Todo se reduce a ventajas y desventajas.

**Astro prioriza el _performance_ y la simplicidad de las MPA porque tiene más sentido para nuestro caso de uso de sitios web centrados en el contenido.** Los sitios web más interactivos y con más gestión de estado pueden beneficiarse más de la arquitectura similar a una aplicación que brindan las SPA a expensas de rendimiento de primera carga.

:::note[Accessibility]
Las MPA utilizan el elemento estándar `<a>` para la navegación. Esto proporciona funciones de accesibilidad importantes, como la gestión de estados de enfoque y el anuncio de cambios de ruta de forma predeterminada.
:::

## Estudios de Casos Prácticos

A continuación mostramos todas las comparaciones públicas de Astro que conocemos:

- [Astro versus SPA (Next.js)](https://twitter.com/t3dotgg/status/1437195415439360003) - 94% menos JavaScript
- [Astro versus SPA (Next.js)](https://twitter.com/jlengstorf/status/1442707241627385860?lang=en) - Carga un 34% más rápida
- [Astro versus SPA (Remix, SvelteKit)](https://www.youtube.com/watch?v=2ZEMb_H-LYE&t=8163s) - "Ese [puntaje de Lighthouse] es increíble."
- [Astro versus Qwik](https://www.youtube.com/watch?v=2ZEMb_H-LYE&t=8504s) - TTI 43% más rápido 

Si conoce una migración pública o un punto de referencia y no lo ve aquí, crea un PR para agregarlo.

## Más Recursos

Si desea obtener más información, Surma (Google) y Jake Archibald (Google) grabaron una excelente discusión muy animada [sobre este mismo tema](https://www.youtube.com/watch?v=ivLhf3hq7eM).
