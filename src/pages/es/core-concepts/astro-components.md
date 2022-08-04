---
layout: ~/layouts/MainLayout.astro
title: Componentes
description: Una introducción a la sintaxis de los componentes .astro.
---

**Los componentes de Astro** son los bloques fundamentales para cualquier proyecto de Astro. Están compuestos únicamente por HTML y no poseen ejecución del lado del cliente.

La sintaxis del componente de Astro es un superconjunto de HTML. La sintaxis se [diseñó para que resulte familiar para cualquier persona con experiencia en HTML o JSX](/es/comparing-astro-vs-other-tools/#astro-vs-jsx), además es compatible con componentes y expresiones de Javascript. Puedes identificar los componentes Astro por su extensión: `.astro`.

Los componentes de Astro son extremadamente flexibles. Un componente de Astro puede contener **UI reutilizable**, tal como encabezados o una tarjeta de perfil. También puede contener un fragmento pequeño de HTML, o una colección de etiquetas `<meta>` para facilitar nuestro trabajo con el SEO. Los componentes de Astro también pueden contener una plantilla de página.

Lo más importante acerca de los componentes de Astro es que **se renderizan a HTML durante la compilación final**. Aún si posees código Javascript dentro de tus componentes, este código solo se ejecuta al compilar tu projecto, siendo removido de la página final que se envía al usuario. El resultado es un sitio web más rápido y sin rastros de Javascript.


## Vista general de un componente

Un componente de Astro se compone de dos partes principales: el **script del componente** y el **maquetado del componente**. Cada parte cumple una función diferente, pero juntas proveen un marco de trabajo que es fácil de utilizar y lo suficientemente expresivo para manejar cualquier cosa que desees construir.

```astro
---
// Script del componente (JavaScript)
---
<!-- Maquetado del componente (HTML + Expresiones JS) -->
```

Puedes utilizar componentes dentro de otros componentes para construir una UI más avanzada y compleja. Por ejemplo, el componente `Button` puede ser utilizado para crear un componente `ButtonGroup` de la siguiente manera:

```astro
---
// Ejemplo: ButtonGroup.astro
import Button from './Button.astro';
---
<div>
  <Button title="Boton 1" />
  <Button title="Boton 2" />
  <Button title="Boton 3" />
</div>
```


### Script del componente

Astro utiliza una valla de código (`---`) para identificar el script del componente Astro. Si has escrito Markdown anteriormente deberías estar familiarizado con un concepto similar llamado *frontmatter*. El script del componente de Astro fue inspirado por este concepto.

Puedes utilizar el script del componente para escribir cualquier código de Javascript que necesites para renderizar tu maquetado. Esto puede incluir:

- Importar otros componentes Astro
- Importar componentes de otros frameworks, por ejemplo React
- Importar data, tal como un archivo JSON
- Consultar contenido de una API o base de datos
- Crear variables que luego puedes referenciar en tu maquetado


```astro
---
// Nota: La importación debe realizarse en la parte superior del archivo.
import UnComponenteAstro from '../components/UnComponenteAstro.astro';
import UnComponenteReact from '../components/UnComponenteReact.jsx';
import algunosDatos from '../data/pokemon.json';

// Acceder a props recibidas, por ejemplo `<X title="Hola Mundo" />`
const {title} = Astro.props;
// Consultar datos externos, de una API privada o base de datos
const data = await fetch('API_URL_SECRETA/users').then(r => r.json());
---
<!-- ¡Tu maquetado va aquí! -->
```

La valla de código está diseñada para garantizar que el código Javascript que escribes adentro se encuentre "encapsulado". Este código no va a filtrarse a tu aplicación de frontend, o caer en las manos del usuario. Puedes escribir código que sea costoso o sensible (como una llamada a tu base de datos privada) sin preocuparte por que estos datos sensibles lleguen al navegador del usuario.

:::tip
Puedes utilizar Typescript en el script de tu componente!
:::

### Maquetado del componente

Debajo del script del componente vive el maquetado. El maquetado del componente define el HTML que va a generar tu componente.

Si escribes solo HTML en esta sección, tu componente va a renderizar este HTML en cualquier página Astro donde sea importado y utilizado.

Sin embargo, la sintaxis del maquetado del componente de Astro también soporta **expresiones de JavaScript**, **componentes importados** y [**directivas especiales de Astro**](/es/reference/directives-reference/). Los datos y valores definidos (en la compilación final de la página) en el script del componente pueden ser utilizados en el maquetado del componente para producir HTML creado dinámicamente.

```astro
---
// El script de tu componente va aquí!
import ReactPokemonComponent from '../components/ReactPokemonComponent.jsx';
const misPokemonesFavoritos = [/* ... */];
---
<!-- Soporta comentarios HTML! -->

<h1>Hola mundo!</h1>

<!-- Utiliza props y otras variables definidas en el script del componente: -->
<p>Mi pokemon favorito es: {Astro.props.title}</p>

<!-- Incluye otros componentes con la directiva de hidratación `client:`: -->
<ReactPokemonComponent client:visible />

<!-- Puedes mezclar HTML con expresiones de JavaScript, similar a JSX: -->
<ul>
  {misPokemonesFavoritos.map((data) => <li>{data.name}</li>)}
<ul>

<!-- Puedes utilizar una directiva de maquetado para inyectar un string HTML dentro de un elemento: -->
<p set:html={rawHTMLString} />
```

### Expresiones JSX

Puedes definir variables locales de JavaScript dentro del script del componente de Astro. ¡Luego puedes inyectar estas variables en el maquetado del componente usando expresiones JSX!

#### Variables

Las variables locales pueden ser agregadas al maquetado usando la sintaxis de llaves:

```astro
---
const nombre = "Astro";
---
<div>
  <h1>Hola {nombre}!</h1> <!-- <h1>Hola Astro!</h1> -->
</div>
```

#### Atributos dinámicos

Las variables locales pueden ser utilizadas entre llaves para pasar valores a atributos de componentes y elementos HTML:

```astro
---
const nombre = "Astro";
---
<h1 class={nombre}>Soporta expresiones en atributos</h1>

<MiComponente nombreDeAtributo={`MiNombreEs${nombre}`} />
```

#### HTML dinámico

Las variables locales pueden ser utilizadas en funciones parecidas a JSX para producir elementos HTML generados dinámicamente:

```astro
---
const items = ["Perro", "Gato", "Mono"];
---
<ul>
  {items.map((item) => (
    <li>{item}</li>
  ))}
</ul>
```

#### Fragmentos y elementos múltiples

A diferencia de JavaScript o JSX, un componente de Astro es capaz de renderizar múltiples elementos sin necesidad de envolver todo en un `<div>` o `<>`.

```astro
---
// Maquetado con múltiples elementos
---
<p>No es necesario envolver elementos en un solo elemento contenedor.</p>
<p>Astro es compatible con el uso de múltiples elementos en la raíz del maquetado</p>
```

Sin embargo, al utilizar las expresiones para crear elementos dinámicamente, debes envolver estos elementos dentro de un **Fragment** de la misma forma que lo harías utilizando JavaScript o JSX. Astro es compatible con el uso de `<Fragment> </Fragment>` o su abreviación `<> </>`.

```astro
---
const items = ["Perro", "Gato", "Mono"];
---
<ul>
  {items.map((item) => (
    <>
      <li>{item} Rojo</li>
      <li>{item} Azul</li>
      <li>{item} Verde</li>
    </>
  ))}
</ul>
```

Los Fragments también pueden ser útiles para evitar envolver componentes al usar las directivas [`set:*`](/es/reference/directives-reference/#sethtml), como en el siguiente ejemplo:

```astro
---
const htmlString = '<p>Contenido HTML sin procesar</p>';
---
<Fragment set:html={htmlString} />
```

### Props de componentes

Un componente de Astro puede definir y aceptar props. Estas props estarán disponibles para ser utilizadas en el renderizado del maquetado HTML y además estarán disponibles en el script del componente de manera global dentro del objeto `Astro.props`.

Aquí vemos un ejemplo de un componente que recibe una prop `saludo` y otra `nombre`. Puede verse que las props a recibir están desestructuradas del objeto global `Astro.props`.

```astro
---
// Ejemplo: GreetingHeadline.astro
// Utilización: <GreetingHeadline saludo="Qué tal" nombre="Amiga" />
const { saludo, nombre } = Astro.props
---
<h2>{saludo}, {nombre}!</h2>
```

También puedes definir tus props utilizando Typescript exportando una intefaz de tipo `Props`. Astro recolectará automáticamente cualquier interfaz de tipo `Props` y mostrará advertencias/errores en tu proyecto. A estas props también se le pueden definir valores por defecto cuando son desestructuradas de `Astro.props`.

```astro
---
// src/components/GreetingHeadline.astro
export interface Props {
  nombre: string;
  saludo?: string;
}

const { saludo = "Hola", nombre } = Astro.props as Props;
---
<h2>{saludo}, {nombre}!</h2>
```

Este componente, al importarlo y renderizarlo en otros componentes de Astro, sean plantillas de páginas o páginas, reciben estas props como atributos:

```astro
---
// src/components/GreetingCard.astro
import GreetingHeadline from './GreetingHeadline.astro';
const nombre = "Astro"
---
<h1>Carta de saludo</h1>
<GreetingHeadline saludo="Hi" nombre={nombre} />
<p>Espero que hayas tenido un día maravilloso!</p>
```

### Slots

El elemento `<slot />` es un espacio reservado para contenido HTML externo, permitiéndote inyectar (o ingresar en la "ranura") elementos hijos provenientes de otros archivos en el maquetado de tu componente.

Por defecto, todos los elementos hijos que le sean enviados a un componente serán renderizados en su `<slot />`.

:::note
Diferente a _props_, que son atributos enviados a un componente Astro y disponibles para utilizar con `Astro.props`, los _slots_ renderizan elementos HTML hijos donde se lo indique.
:::

```astro
---
// src/components/Wrapper.astro
import Header from './Header.astro';
import Logo from './Logo.astro';
import Footer from './Footer.astro';

const { titulo } = Astro.props
---
<div id="content-wrapper">
  <Header />
  <Logo />
  <h1>{titulo}</h1>
  <slot />  <!-- aquí van los hijos -->
  <Footer />
</div>
```

```astro
---
// src/pages/fred.astro
import Wrapper from '../components/Wrapper.astro';
---
<Wrapper titulo="Página de Fred">
  <h2>Todo sobre Fred</h2>
  <p>Aquí veremos cosas sobre Fred.</p>
</Wrapper>
```

Este patrón es la base de la plantilla de página de un componente de Astro: una página entera de contenido HTML puede ser "envuelta" con etiquetas `<Layout></Layout>` y enviadas al componente Layout para ser renderizada dentro de elementos comunes de la página.


#### Slots con nombre

Un componente de Astro también puede tener slots con nombre. Esto te permite compartir elementos HTML únicamente con el nombre correspondiente al slot.

```astro
---
// src/components/Wrapper.astro
import Header from './Header.astro';
import Logo from './Logo.astro';
import Footer from './Footer.astro';

const { titulo } = Astro.props
---
<div id="content-wrapper">
  <Header />
  <slot name="after-header"/>  <!--  hijos con el atributo `slot="after-header"` van aquí -->
  <Logo />
  <h1>{titulo}</h1>
  <slot />  <!--  hijos sin `slot`, o con el atributo `slot="default"` van aquí -->
  <Footer />
  <slot name="after-footer"/>  <!--  hijos con el atributo `slot="after-footer"` van aquí -->
</div>
```

```astro
---
// src/pages/fred.astro
import Wrapper from '../components/Wrapper.astro';
---
<Wrapper titulo="Página de Fred">
  <img src="https://my.photo/fred.jpg" slot="after-header">
  <h2>Todo sobre Fred</h2>
  <p>Aquí veremos cosas sobre Fred.</p>
  <p slot="after-footer">Copyright 2022</p>
</Wrapper>
```

Utiliza un atributo `slot="mi-slot"` en el elemento hijo que quieras enviar junto con su `<slot name="mi-slot" />` emparejado en tu componente.

:::tip
Los slots con nombre tambien se pueden pasar a [componentes de framework](/es/core-concepts/framework-components/) en archivos Astro.
:::

#### Contenido alternativo para slots

Los slots también pueden renderizar **contenido alternativo** en el caso que no reciban datos con `<slot />` para emparejar, sea slot con nombre o no.

```astro
---
// src/components/Wrapper.astro
import Header from './Header.astro';
import Logo from './Logo.astro';
import Footer from './Footer.astro';

const { titulo } = Astro.props
---
<div id="content-wrapper">
  <Header />
  <Logo />
  <h1>{titulo}</h1>
  <slot>
    <p>Este es mi contenido alternativo, si no hay ningún elemento pasado al slot</p>
  </slot>
  <Footer />
</div>
```

### Estilos CSS

Astro también soporta etiquetas de estilo CSS `<style>` dentro del maquetado del componente.

Pueden utilizarse para estilar los componentes y todas las reglas de estilo son encapsuladas en el componente para evitar conflictos de CSS en aplicaciones grandes.

```astro
---
// El script de tu componente va aquí!
---
<style>
  /* encapsulado en el componente, otros H1 en la página no estarán afectados */
  h1 { color: red }
</style>

<h1>Hola mundo!</h1>
```

:::caution
Los estilos definidos aquí serán aplicados únicamente en el maquetado del componente. **No** se verán afectados los componentes hijos ni cualquier otro componente importado por defecto.
:::

📚 Lea nuestra [guía de estilos](/es/guides/styling/) para más información en cómo aplicar estilos.

### Scripts del lado del cliente

Para enviar Javascript al cliente sin [utilizar componentes de framework](/es/core-concepts/framework-components/) (React, Svelte, Vue, Preact, SolidJS, AlpineJS, Lit) o [integraciones de Astro](https://astro.build/integrations/) (ej. astro-XElement), puedes utilizar una etiqueta `<script>` en el maquetado de tu componente y enviar JavaScript al navegador que será ejecutado en el ámbito global.

Por defecto, las etiquetas `<script>` son procesadas por Astro.

- Cualquier importación se empaquetará, lo que le permitirá importar archivos locales o módulos de Node.
- El script procesado se inyectará en el `<head>` de su página con [`type="module"`](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules) .
- Si su componente es usado varias veces en una página, la etiqueta del script solo se incluirá una vez.

:::caution
Actualmente no puede escribir TypeScript en scripts del lado del cliente, pero _puede_ importar un archivo TypeScript si prefiere escribir con esa sintaxis.
:::

```astro
<script>
  // Procesado! Comprimido! Funciona la importación de ESM, aun si son paquetes npm.
</script>

<script is:inline>
  // Será renderizado en el HTML tal cual sea escrito!
  // El importado de ESM relativos al archivo no serán resueltos.
</script>
```

Se pueden usar múltiples etiquetas `<script>` en el mismo archivo `.astro` usando cualquier combinación de los métodos anteriores.

:::note
Agregar `type="module"` o cualquier otro atributo a una etiqueta `<script>` deshabilitará el comportamiento de agrupación predeterminado de Astro, tratando la etiqueta como si tuviera una directiva `is:inline`.
:::

📚 Lea nuestra página de [referencias de directivas](/es/reference/directives-reference/#directivas-script--style) para más información acerca de las directivas disponibles para las etiquetas `<script>`.

#### Utilizando Scripts Externos

**Cuándo utilizarlo:** Si tu archivo JavaScript vive dentro de la carpeta `public/`.

Ten en cuenta que este enfoque saltea el procesamiento, compresión y optimización de JavaScript provista por Astro. (Para aprovechar todo esto debes utilizar el método `import` descripto en el siguiente item)

```astro
// Ruta URL absoluta
<script is:inline src="/algun-script-externo.js"></script>
```

#### Utilizando Scripts Hoisted

**Cuándo utilizarlo:** Si tu script externo vive dentro de `src/` _y_ soporta el tipo de módulos ESM.

Astro detecta los módulos Javascript importados del lado del cliente y luego comprime, optimiza y añade el JS a la página automáticamente.

```astro
// Importar módulo ESM
<script>
  import './algun-script-externo.js';
</script>
```


## Próximos Pasos

📚 Lee acerca de los [componentes internos de Astro](/es/reference/api-reference/#componentes-incorporados).

📚 Aprende acerca del uso de [componentes de framework de JavaScript](/es/core-concepts/framework-components/) en Astro.
