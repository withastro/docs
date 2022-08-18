---
layout: ~/layouts/MainLayout.astro
title: Astro Islands 
description: "Astro Islands (Islas Astro aka Islas de componentes) se basan en un patrón de arquitectura web promovido por Astro. La idea de “arquitectura de islas” fue acuñada por primera vez por la arquitecta de interfaz de Etsy, Katie Sylor-Miller, en 2019 y fue ampliada por el creador de Preact, Jason Miller."
i18nReady: true
setup: |
  import IslandsDiagram from '~/components/IslandsDiagram.astro';
---

**Astro Islands** (Islas Astro aka Islas de componentes) se basan en un patrón de arquitectura web promovido por Astro. La idea de “arquitectura de islas” fue acuñada por primera vez por la arquitecta de interfaz de Etsy [Katie Sylor-Miller](https://twitter.com/ksylor) en 2019, y se amplió en [esta publicación](https://jasonformat.com/islands-architecture/) por el creador de Preact, Jason Miller.

## ¿Qué es una Astro Island?

El término "Astro Island" se refiere a un componente de UI interactivo en una página HTML predominantemente estática. Pueden existir varias islas en una página, y una isla siempre se renderiza en forma aislada. Piensa en ellos como islas en un mar de HTML estático y no interactivo.

<IslandsDiagram>
    <Fragment slot="headerApp">Header (encabezado como isla interactiva)</Fragment>
    <Fragment slot="sidebarApp">Sidebar (barra lateral de HTML estático)</Fragment>
    <Fragment slot="main">
        Contenidos estáticos como texto, imágenes, etc.
    </Fragment>
    <Fragment slot="carouselApp">Carrusel o Slider de imágenes (isla interactiva)</Fragment>
    <Fragment slot="footer">Footer (pie de página de HTML estático)</Fragment>
    <Fragment slot="source">Fuente: [Islands Architecture: Jason Miller](https://jasonformat.com/islands-architecture/)</Fragment>
</IslandsDiagram>

En Astro puedes utilizar cualquier framework de componentes de UI (React, Svelte, Vue, etc.) para renderizar islas interactivas en el navegador. Puedes "mix and match" (mezclar y combinar) diferentes frameworks en una misma página, o simplemente elegir tu favorito.

La técnica en la que se basa este patrón de arquitectura se conoce como hidratación **parcial** o **selectiva**. Astro aprovecha esta técnica para hidratar las islas automáticamente.

## ¿Cómo funcionan las islas en Astro?

**Astro genera todos los sitios web por defecto con cero JavaScript del lado del cliente.** Usa componentes de frontend UI construidos con [React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/), o [Lit](https://lit.dev/) y Astro automáticamente los renderizará en HTML, y luego les quitará todo el JavaScript. Esto mantiene los sitios rápidos por defecto.

```astro title="src/pages/index.astro"
---
// Ejemplo: Usa un componente estático React en la página, sin JavaScript.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- 100% HTML, cero JavaScript cargado en la página! -->
<MyReactComponent />
```

Pero a veces, se requiere JavaScript del lado del cliente para crear una UI interactiva. En lugar de obligar a toda la página a convertirse en una aplicación de JavaScript similar a SPA (aplicación de una sola página en base de Javascript que se ejecuta en el navegador), Astro te pide crear una isla, un Astro Island.

```astro title="src/pages/index.astro" ins="client:load"
---
// Ejemplo: Usa un componente dinámico React en la página.
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<!-- Este componente is ahora interactivo en la página! 
     El resto de tu sitio web se queda estático con cero JS. -->
<MyReactComponent client:load />
```

Con Astro Islands, la gran mayoría de tu sitio sigue siendo HTML y CSS puro y ligero. En el ejemplo anterior, acaba de agregar una sola **isla de interactividad** aislada sin cambiar también el resto de la página.

## ¿Cuáles son los beneficios de las Islas?

El beneficio más obvio de construir con Astro Islands es el rendimiento: la mayor parte de tu sitio web se convierte a HTML rápido y estático, y el JavaScript solo se carga para los componentes individuales que lo necesitan. JavaScript es uno de los activos más lentos que puede cargar byte por byte, por lo que cada byte cuenta.

Otro beneficio es la carga paralela. En la ilustración de ejemplo anterior, la isla de "carrusel de imágenes" de baja prioridad no necesita bloquear la isla de "encabezado" de alta prioridad. Los dos se cargan en paralelo y se hidratan de forma aislada, lo que significa que el encabezado se vuelve interactivo de inmediato sin tener que esperar al carrusel más pesado en la parte inferior de la página.

Aún mejor, puedes decirle a Astro exactamente cómo y cuándo renderizar cada componente. Si cargar ese carrusel de imágenes es realmente costoso, puedes adjuntar una [client directive](/es/reference/directives-reference/#client-directives) (directiva de cliente) especial que le dice a Astro que solo cargue el carrusel en el momento en que sea visible en la página. Si el usuario nunca lo ve, nunca se carga.

En Astro, depende de ti como desarrollador decirle explícitamente a Astro cuáles componentes de la página deben ejecutarse también en el navegador. Astro solo hidratará exactamente lo que se necesita en la página y dejará el resto de su sitio como HTML estático.

**Astro Islands son el secreto de la ciencia de rendimiento rápido por defecto propio de Astro**
