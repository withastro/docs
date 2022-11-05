---
title: Usa un CMS con Astro
description: Cómo usar un CMS para agregar contenido a Astro
layout: ~/layouts/MainLayout.astro
setup: |
  import CMSGuidesNav from '~/components/CMSGuidesNav.astro';
i18nReady: true
---

**Ready to connect a Headless CMS to your Astro project?** Follow one of our guides to integrate a CMS.
**¿Listo para conectar un Headless CMS a su proyecto Astro?** Siga una de nuestras guías para integrar un CMS.

## Guías de CMS

<CMSGuidesNav />

Tome en cuenta que muchas de estas páginas son **talones**: ¡Son colecciones de recursos esperando su contribución!

## ¿Por qué usar un CMS?

Un sistema de gestión de contenido le permite escribir contenido y administrar activos fuera de su proyecto Astro.

Esto desbloquea nuevas funciones para trabajar con contenido. La mayoría de los CMS te brindan un editor de contenido visual, la capacidad de especificar tipos de contenido estándar y una forma de colaborar con otros.

Un CMS puede ser útil para el contenido que sigue una estructura particular, a menudo te brinda una experiencia de panel de control y herramientas de edición WYSIWYG. Puedes usar un CMS para escribir publicaciones de blog usando el editor de texto enriquecido de un CMS en lugar de archivos Markdown. O puedes usar un CMS para mantener listados de productos para una tienda en línea, haciendo que ciertos campos sean obligatorios para evitar listados incompletos.

Tu proyecto Astro luego puede recuperar su contenido de su CMS y mostrarlo, donde y como quieras en tu sitio.


## ¿Qué CMSes funcionan bien con Astro?

Debido a que Astro se ocupa de la _presentación_ de tu contenido, tu vas querer elegir un CMS _headless_, como los de la lista anterior. Esto significa que el CMS le ayuda a escribir su contenido, pero no genera un sitio que lo muestre. En su lugar, recupera los datos de contenido y los usa en tu proyecto Astro.

Algunos CMSes headless, como Storyblok, proporcionan una [integración](/es/guides/integrations-guide/) de Astro que ayuda a recuperar el contenido específicamente para un sitio Astro. Otros proporcionan un SDK de JavaScript, una biblioteca que instala y usa para recuperar tu contenido remoto.

## ¿Puedo usar Astro sin un CMS?

¡Si! Astro proporciona formas integradas de [autorizar contenido](/es/guides/content/), incluido el soporte para páginas de Markdown.
