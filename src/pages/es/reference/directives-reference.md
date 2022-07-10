---
layout: ~/layouts/MainLayout.astro
title: Referencia de directivas de maquetado
i18nReady: true
---

**Las directivas de maquetado** son un tipo especial de atributo HTML disponible dentro de cualquier maquetado del componente de Astro (archivos `.astro`).

Las directivas de maquetado se utilizan para controlar el comportamiento de un elemento o componente de alguna manera. Una directiva de maquetado podría habilitar alguna característica del compilador que te haga la vida más fácil (como usar `class: list` en lugar de `class`). O bien, una directiva podría decirle al compilador de Astro que haga algo especial con ese componente (como hidratar con `client:load`).

Esta página describe todas las directivas de maquetado disponibles en Astro y cómo funcionan.

## Rules

Para que una directiva de maquetado sea válida, debes:

- Incluir dos puntos `:` en su nombre, usando la forma `X:Y` (ej: `client:load`).
- Ser visible para el compilador (ej: `<X {...attr}>` no funcionaría si `attr` contuviera una directiva).

Algunas directivas de plantilla, pero no todas, pueden tomar un valor personalizado:
- `<X client:load />` (no toma valor)
- `<X class:list={['some-css-class']} />` (toma una matriz)

Una directiva de maquetado nunca se incluye directamente en el HTML del compilado final de un componente.

## Directivas comunes

### `class:list`

`class:list={...}` toma un array de clases y los convierte en un string. Esto está inspirado en la popular biblioteca auxiliar [clsx](https://github.com/lukeed/clsx) de @lukeed, pero integrado directamente en Astro.

`class:list` toma un array de varios tipos de valores posibles diferentes:
- `string`: Agregado al elemento `class`
- `Objeto`: Todas las keys verdaderas se agregan al elemento `class`
- `Array`: aplanado
- `Set`: aplanado

```astro
<!-- Esto -->
<span class:list={[ 'hello goodbye', { hello: true, world: true }, new Set([ 'hello', 'friend' ]) ]} />
<!-- Se convierte en -->
<span class="hello goodbye world friend"></span>
```

Los valores duplicados se eliminan automáticamente.

### `set:html`

`set:html={string}` inyecta un string de HTML en un elemento, similar a la opción `el.innerHTML`.

**¡Astro no verifica automáticamente del valor!** Asegúrese de que confía en el valor o de haberlo verificado manualmente antes de pasarlo al maquetado. Olvidar hacer esto lo expondrá a ataques de [Cross Site Scripting (XSS)](https://owasp.org/www-community/attacks/xss/)

```astro
---
const rawHTMLString = "Hello <strong>World</strong>"
---
<h1>{rawHTMLString}</h1>
  <!-- Resultado: <h1>Hello &lt;strong&gt;World&lt;/strong&gt;</h1> -->
<h1 set:html={rawHTMLString} />
  <!-- Resultado: <h1>Hello <strong>World</strong></h1> -->
```

También puedes usar `set:html` en un `<Fragment>` para evitar agregar un elemento contenedor innecesario. Esto puede ser especialmente útil al obtener HTML de un CMS.

```astro
---
const cmsContent = await fetchHTMLFromMyCMS();
---
<Fragment set:html={cmsContent}>
```

### `set:text`

`set:text={string}` inyecta un string de texto en un elemento, similar a `el.innerText`. A diferencia de `set:html`, Astro verifica automáticamente al valor `string` que se pasa.

Esto es equivalente a simplemente pasar una variable a una expresión de maquetado directamente (por ejemplo: `<div>{someText}</div>`) y, por lo tanto, esta directiva no se usa comúnmente.

## Directivas del cliente

Estas directivas controlan cómo se hidratan los [componentes de framework](/es/core-concepts/framework-components/) en la página.

De forma predeterminada, un componente de framework no está hidratado en el cliente. Si no se proporciona la directiva `client:*`, su HTML se representa en la página sin JavaScript.

### `client:load`

- **Prioridad:** Alta
- **Útil para:** Elementos de la UI inmediatamente visibles que deben ser interactivos lo antes posible.

Cargue e hidrate el JavaScript del componente inmediatamente al cargar la página.

```astro
<BuyButton client:load />
```

### `client:idle`

- **Prioridad:** Media
- **Útil para:** Elementos de UI de menor prioridad que no necesitan ser interactivos inmediatamente.

Cargue e hidrate el componente JavaScript una vez que la página haya terminado con su carga inicial y se haya activado el evento `requestIdleCallback`. Si está en un navegador que no es compatible con [`requestIdleCallback`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback), entonces se usará el evento [`load`](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event).

```astro
<ShowHideButton client:idle />
```

### `client:visible`

- **Prioridad:** Baja
- **Útil para:** Elementos de la interfaz de usuario de baja prioridad que se encuentran en la parte inferior de la página ("que no son visibles al usuario") o que requieren tantos recursos para cargar que preferiría no cargarlos en absoluto si el usuario nunca vio el elemento.

Cargue e hidrate el JavaScript del componente una vez que el componente haya ingresado al viewport del usuario. Esto utiliza un `IntersectionObserver` internamente para realizar un seguimiento de la visibilidad.

```astro
<HeavyImageCarousel client:visible />
```

### `client:media`

- **Prioridad:** Baja
- **Útil para:** Toggle de barra laterales u otros elementos que solo pueden verse en ciertos tamaños de pantalla.

`client:media={string}` carga e hidrata el componente JavaScript una vez que se cumple una determinada consulta de medios CSS.

:::note
Si el componente ya está oculto y se muestra mediante media queries de CSS, entonces puede ser más fácil simplemente usar `client:visible` y no pasar la misma media query a la directiva.
:::

```astro
<SidebarToggle client:media="(max-width: 50em)" />
```

### `client:only`

`client:only={string}` **salta** la renderización del servidor HTML y solo se renderiza en el cliente. Actúa de manera similar a `client:load` en el sentido de que carga, procesa e hidrata el componente inmediatamente al cargar la página.

**¡Debes pasar el framework correcto al componente!** Debido a que Astro no ejecuta el componente durante su compilación/en el servidor, Astro no sabe qué framework usa el componente a menos que se lo indique explícitamente.

```astro
<SomeReactComponent client:only="react" />
<SomePreactComponent client:only="preact" />
<SomeSvelteComponent client:only="svelte" />
<SomeVueComponent client:only="vue" />
<SomeSolidComponent client:only="solid-js" />
```

## Directivas Script & Style

Estas directivas solo se pueden usar en etiquetas HTML `<script>` y `<style>`, para controlar cómo se manejan el JavaScript y CSS del lado del cliente en la página.

### `is:global`

De forma predeterminada, Astro aplica automáticamente las reglas CSS `<style>` localmente al componente. Puedes optar por no participar con este comportamiento con la directiva `is:global`.

`is:global` hace que el contenido de una etiqueta `<style>` se aplique globalmente en la página cuando el componente es incluido. Esto deshabilita el alcance local de CSS de Astro. Esto es equivalente a envolver todos los selectores dentro de una etiqueta `<style>` con `:global()`.

Puedes combinar `<style>` y `<style is:global>` juntos en el mismo componente, para crear algunas reglas de estilo globales mientras sigue mantienes la mayor parte del CSS con un alcance local dentro del componente de Astro.

📚 Consulte la página [Estilos & CSS](/es/guides/styling/#global-styles) para obtener más detalles sobre cómo funcionan los estilos globales.

```astro
<style is:global>
  body a { color: red; }
</style>
```

### `is:inline`

De forma predeterminada, Astro procesará, optimizará y empaquetará cualquier etiqueta `<script>` y `<style>` que vea en la página. Puedes optar por no participar con este comportamiento con la directiva `is:inline`.

`is:inline` le dice a Astro que deje la etiqueta `<script>` o `<style>` como está en el HTML final. Los contenidos no serán procesados, optimizados o agrupados. Esto limita algunas características de Astro, como importar un paquete npm o usar un lenguaje de compilación a CSS como Sass.

La directiva `is:inline` significa que las etiquetas `<style>` y `<script>`:

- No se empaquetará como un archivo externo.
- No se deduplicará: el elemento aparecerá tantas veces como se represente.
- No se resolverán sus referencias `import`/`@import`/`url()` en relación con el archivo `.astro`.
- Será preprocesado, por ejemplo, un atributo `<style lang="sass">` aún generará CSS.
- Se rederizará en el HTML final exactamente donde se creó.
- Los estilos serán globales y no tendrán alcance local en el componente.

:::caution
La directiva `is:inline` está implícita cada vez que se usa cualquier atributo que no sea `src` en una etiqueta `<script>` o `<style>`.
:::

```astro
<style is:inline>
  /* inline: Las importaciones de paquetes relativos y npm no son compatibles. */
  @import '/assets/some-public-styles.css';
  span { color: green; }
</style>

<script is:inline>
  /* inline: Las importaciones de paquetes relativos y npm no son compatibles. */
  console.log('I am inlined right here in the final output HTML.');
</script>
```

📚 Vea cómo funcionan los [scripts del lado del cliente](/es/core-concepts/astro-components/#scripts-del-lado-del-cliente) en los componentes de Astro.

### `define:vars`

`define:vars={...}` pueden pasar variables del servidor desde el frontmatter del componente al cliente `<script>` o `<style>`. Cualquier variable de frontmatter *serializable* es compatible, incluyendo los props pasados al componente a través de `Astro.props`.

```astro
---
const foregroundColor = "rgb(221 243 228)";
const backgroundColor = "rgb(24 121 78)";
const message = "Astro is awesome!";
---
<style define:vars={{ textColor: foregroundColor, backgroundColor }}>
  h1 {
    background-color: var(--backgroundColor);
    color: var(--textColor);
  }
</style>

<script define:vars={{ message }}>
  alert(message);
</script>
```

:::caution
El uso de `define:vars` en una etiqueta `<script>` o `<style>` implica la directiva [`is:inline`](#isinline), lo que significa que los scripts o estilos no se empaquetarán y serán incluidos en línea directamente en el HTML.
:::

## Directivas avanzadas

### `is:raw`

`is:raw` indica al compilador de Astro que trate a cualquier children de ese elemento como texto. Esto significa que todas las sintaxis especiales de maquetado de Astro se ignorará dentro de este componente.

Usado internamente por el componente `<Markdown />`.

Por ejemplo, si tuvieras un componente Katex personalizado que convierte texto a HTML, podrías hacer que los usuarios hicieran esto:

```astro
---
import Katex from '../components/Katex.astro';
---
<Katex is:raw>Algunas {sintaxis} conflictivas aquí</Katex>
```
