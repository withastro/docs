---
layout: ~/layouts/MainLayout.astro
title: Componentes de framework
description: Aprenda a usar React, Svelte, etc en Astro
i18nReady: true
---

Crea tu página web en Astro sin sacrificar tus componentes de framework favoritos.

Astro es compatible con una variedad de frameworks populares, incluyendo [React](https://reactjs.org/), [Preact](https://preactjs.com/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/), [SolidJS](https://www.solidjs.com/), [AlpineJS](https://alpinejs.dev/) y [Lit](https://lit.dev/).

## Instalando integraciones

Astro incluye integraciones opcionales de React, Preact, Svelte, Vue, SolidJS y Lit. Una o varias de estas integraciones de Astro se pueden instalar y configurar en tu proyecto.

Para configurar Astro para usar estos frameworks, primero, instala la integración correspondiente y cualquier peer-dependencia asociada:

```bash
npm install --save-dev @astrojs/react react react-dom
```

Luego importe y agregue la función a su lista de integraciones en `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import preact from '@astrojs/preact';
import svelte from '@astrojs/svelte';
import vue from '@astrojs/vue';
import solid from '@astrojs/solid-js';
import lit from '@astrojs/lit';

export default defineConfig({
	integrations: [react(), preact(), svelte(), vue(), solid() , lit()],
});
```

⚙️ Consulte la [guía de integraciones](/es/guides/integrations-guide/) para obtener más informarción sobre la instalación y configuración de las integraciones de Astro.

⚙️ ¿Quieres ver un ejemplo del framework de tu elección? Visite [astro.new](https://astro.new/) y seleccione la plantilla de framework correspondiente.

## Usando componentes de framework

¡Use sus componentes de framework en sus páginas, plantillas y componentes de Astro como si fueran componentes de Astro! Todos sus componentes pueden vivir juntos en `/src/components`, o pueden organizarse de la forma que desee.

Para usar un componente de framework, impórtelo desde su ruta relativa (incluyendo la extensión de archivo) en el script su componente de Astro. Luego, use el componente junto con otros componentes, elementos HTML y expresiones similares a JSX en el maquetado del componente.

```astro
---
import MyReactComponent from '../components/MyReactComponent.jsx';
---
<html>
  <body>
    <h1>Use React components directly in Astro!</h1>
    <MyReactComponent />
  </body>
</html>
```

:::tip
Recuerde: ¡todas las importaciones deben vivir en la **parte superior** del script de su componente de Astro!
:::

De forma predeterminada, tus componentes de framework se renderizarán como HTML estático. Esto es útil para crear maquetados de componentes que no son interactivos y evita enviar código JavaScript innecesario al cliente.

## Hidratando componentes interactivos

Un componente de framework puede hacerse interactivo (hidratado) usando una de las directivas `client:*`. Este es un atributo del componente para definir cómo se debe **renderizar** e **hidratar** su componente.

Esta [directiva del cliente](/es/reference/directives-reference/#directivas-del-cliente) describe si su componente se debe renderizar o no al momento de la compilación, además de cuándo el navegador debe cargar el JavaScript del lado del cliente de su componente.

La mayoría de las directivas renderizarán el componente en el servidor al momento de la compilación. El JavaScript del componente se enviará al cliente de acuerdo a la directiva especificada. El componente se hidratará cuando su JavaScript haya terminado de importarse.

```astro
---
// Ejemplo: hidratando los componentes de framework en el navegador.
import InteractiveButton from '../components/InteractiveButton.jsx';
import InteractiveCounter from '../components/InteractiveCounter.jsx';
---
<!-- Este componente de JavaScript comenzará a importarse cuando se cargue la página-->
<InteractiveButton client:load />

<!-- El JavaScript de este componente no se enviará al cliente hasta que
el usuario se desplace hacia abajo y el componente sea visible en la página -->
<InteractiveCounter client:visible />
```

:::caution
Cualquier renderizador de JavaScript necesario para el componente de framework (por ejemplo, React, Svelte) se descargará con la página. Las directivas `client:*` solo dictan cuándo se importa el _componente de JavaScript_ y cuándo se hidrata el _componente_.
:::

### Directivas de hidratación disponibles

Hay varias directivas de hidratación disponibles para los componentes de framework: `client:load`, `client:idle`, `client:visible`, `client:media={QUERY}` y `client:only={FRAMEWORK}`.

📚 Consulte nuestra página de [referencia de directivas](/es/reference/directives-reference/#directivas-del-cliente) para obtener una descripción completa de las directivas de hidratación y sus usos.

## Mezclando frameworks

Puedes importar y renderizar componentes usando múltiples frameworks en el mismo componente de Astro.

```astro
---
// src/pages/MyAstroPage.astro
// Ejemplo: Mezclando múltiples componentes del framework en la misma página.
import MyReactComponent from '../components/MyReactComponent.jsx';
import MySvelteComponent from '../components/MySvelteComponent.svelte';
import MyVueComponent from '../components/MyVueComponent.vue';
---
<div>
  <MySvelteComponent />
  <MyReactComponent />
  <MyVueComponent />
</div>
```

:::caution
Solo los componentes de **Astro** (`.astro`) pueden contener componentes de múltiples frameworks.
:::

## Pasando Children a componentes de framework

Dentro de un componente de Astro, **puedes** pasar elementos secundarios a los componentes del framework. Cada framework tiene sus propios patrones sobre cómo hacer referencia a estos elementos secundarios: React, Preact y Solid usan una prop especial llamada `children`, mientras que Svelte y Vue usan el elemento `<slot />`.

```astro
---
// src/pages/MyAstroPage.astro
import MyReactSidebar from '../components/MyReactSidebar.jsx';
---
<MyReactSidebar>
  <p>Aquí hay una barra lateral con texto y un botón.</p>
</MyReactSidebar>
```

Además, puedes usar [slots con nombre](/es/core-concepts/astro-components/#slots-con-nombre) para agrupar hijos específicos.

Para React, Preact y Solid, estos slots se convertirán en una prop de nivel superior. Los slots con nombres que usen `kebab-case` se convertirán a `camelCase`.

```astro
---
// src/pages/MyAstroPage.astro
import MySidebar from '../components/MySidebar.jsx';
---
<MySidebar>
  <h2 slot="title">Menu</h2>
  <p>Aquí hay una barra lateral con texto y un botón.</p>
  <ul slot="social-links">
    <li><a href="https://twitter.com/astrodotbuild">Twitter</a></li>
    <li><a href="https://github.com/withastro">GitHub</a></li>
  </ul>
</MySidebar>
```

```jsx
// src/components/MySidebar.jsx
export default function MySidebar(props) {
  return (
    <aside>
      <header>{props.title}</header>
      <main>{props.children}</main>
      <footer>{props.socialLinks}</footer>
    </aside>
  )
}
```

Para Svelte y Vue, se pueden hacer referencia a estos slots mediante un elemento `<slot>` con el atributo `name`. Se conservarán los nombres de los slots que usen `kebab-case`.

```jsx
// src/components/MySidebar.svelte
<aside>
  <header><slot name="title" /></header>
  <main><slot /></main>
  <footer><slot name="social-links" /></footer>
</aside>
```

## Anidando componentes de framework

Dentro de un archivo Astro, los hijos de los componentes del framework también pueden ser componentes hidratados. Esto significa que puedes anidar recursivamente componentes de cualquiera de estos frameworks.

```astro
---
// src/pages/MyAstroPage.astro
import MyReactSidebar from '../components/MyReactSidebar.jsx';
import MyReactButton from '../components/MyReactButton.jsx';
import MySvelteButton from '../components/MySvelteButton.svelte';
---

<MyReactSidebar>
  <p>Aquí hay una barra lateral con texto y un botón.</p>
  <div slot="acciones">
    <MyReactButton client:idle />
    <MySvelteButton client:load />
  </div>

</MyReactSidebar>
```

:::caution
Recuerda: los propios archivos de los componentes de framework (por ejemplo, `.jsx`, `.svelte`) no pueden combinar varios frameworks.
:::

Esto te permite crear "aplicaciones" completas usando tu framework de JavaScript preferido y representarlas, a través de un componente principal, en una página de Astro.

:::note
Los componentes de Astro siempre se renderizan a HTML estático, incluso cuando incluyen componentes de framework que son hidratados. Esto significa que solo se pueden pasar props que no hacen ninguna renderización a HTML. Pasar los "render props" de React a los componentes del framework desde un componente de Astro no funcionará, porque los componentes de Astro no pueden proporcionar el renderizado que este patrón requiere. En su lugar, utiliza slots con nombre.
:::

## ¿Puedo hidratar los componentes de Astro?

Si intentas hidratar un componente Astro con un modificador `client:`, obtendrás un error.

Los [componentes de Astro](/es/core-concepts/astro-components/) son componentes de maquetado únicamente en HTML sin ninguna ejecución del lado del cliente. Pero puedes usar una etiqueta `<script>` en el maquetado del componente de Astro para enviar JavaScript al navegador que se ejecutará en un ámbito global.

📚 Obtenga más información sobre [`<scripts>` del lado del cliente en los componentes de Astro](/es/core-concepts/astro-components/#scripts-del-lado-del-cliente)

[mdn-io]: https://developer.mozilla.org/es/docs/Web/API/Intersection_Observer_API
[mdn-ric]: https://developer.mozilla.org/es/docs/Web/API/Window/requestIdleCallback
[mdn-mm]: https://developer.mozilla.org/es/docs/Web/API/Window/matchMedia
