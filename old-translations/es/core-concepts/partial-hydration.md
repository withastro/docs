---
layout: ~/layouts/MainLayout.astro
title: Hidratación parcial en Astro
description: Aprenda cómo funciona la hidratación parcial utilizando "Arquitectura de islas" en Astro.
setup: |
  import IslandsDiagram from '~/components/IslandsDiagram.astro';
i18nReady: true
---

**Astro por defecto genera todas las páginas web sin JavaScript del lado del cliente.** Use componentes de interfaz de usuario como [React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/) o [Lit](https://lit.dev/), Astro lo renderizará automáticamente a HTML en la compilación final y eliminará todo el JavaScript. Esto mantiene cada página más rápida por defecto.

```astro
---
// Ejemplo: Use un componente React estático en la página, sin JavaScript.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- 100% HTML, Cero JavaScript! -->
<MyReactComponent />
```

A veces, se requiere JavaScript del lado del cliente para crear interfaz de usuario interactivas. Cuando necesites una interfaz de usuario interactiva en la página, Astro no lo obliga a usar 100% JavaScript en toda la página. En cambio, Astro usa una técnica llamada **hidratación parcial** que le permite hidratar componentes individuales en la página. De esta manera, solo se envía el JavaScript absolutamente esencial para ejecutar su página.

```astro
---
// Ejemplo: Use un componente React dinámico en la página.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- ¡Este componente ahora es interactivo en la página! 
     El resto de su sitio web sigue siendo el mismo. -->
<MyReactComponent client:load />
```

La gran mayoría de su página web sigue siendo HTML y CSS, puro y ligero, junto con **islas de interactividad** aisladas.

## Hidratación parcial

Hay muchos casos en los que necesita un componente de interfaz de usuario interactivo para ejecutar en el navegador:

- Un carrusel de imágenes
- Una barra de búsqueda y autocompletado
- Un botón de abrir/cerrar de la barra lateral móvil
- Un botón "Comprar ahora"

En Astro, depende de usted como desarrollador optar explícitamente por cualquier componente en la página que deba ejecutarse en el navegador. Astro hidratará exactamente lo que se necesita en la página y dejará el resto de su sitio como HTML estático. Esta técnica se conoce como **hidratación parcial**.

**La hidratación parcial es el secreto del alto rendimiento por defecto de Astro.**

## Arquitectura de Islas

La **arquitectura de islas** es la idea de usar hidratación parcial para construir páginas web interactivas. La arquitectura de islas es una alternativa al proceso común de construir una página web desde un paquete de JavaScript del lado del cliente que se envía al usuario.

> La idea general de una "arquitectura de islas" es muy simple: renderiza las páginas HTML en el servidor e inyecta marcadores de posición o ranuras alrededor de regiones altamente dinámicas.
> <br/> -- [Arquitectura de Islas: Jason Miller](https://jasonformat.com/islands-architecture/)

Además de los beneficios de rendimiento obvios al enviar menos JavaScript al navegador, hay dos beneficios clave para la arquitectura de islas:

- **Los componentes se cargan individualmente.** Un componente liviano (como un botón de barra lateral) se cargará y renderizará rápidamente sin ser bloqueado por los componentes más pesados ​​de la página.
- **Los componentes se procesan de forma aislada.** Cada parte de la página es una unidad aislada y un problema de rendimiento en una unidad no afectará directamente a las demás.

<IslandsDiagram>
    <Fragment slot="headerApp">Encabezado "app"</Fragment>
    <Fragment slot="sidebarApp">Barra lateral "app"</Fragment>
    <Fragment slot="main">
        Contenido HTML generado en el servidor como texto, imágenes, etc.
    </Fragment>
    <Fragment slot="carouselApp">Carrusel de imágenes "app"</Fragment>
    <Fragment slot="advertisement">Anuncios<br/>(generado en el servidor)</Fragment>
    <Fragment slot="footer">Pie de página (generado en el servidor HTML)</Fragment>
</IslandsDiagram>

_Fuente: [Arquitectura de Islas: Jason Miller](https://jasonformat.com/islands-architecture/)_
