---
layout: ~/layouts/MainLayout.astro
title: Componentes
description: Una introducción a la sintaxis de los componentes .astro.
---

**Los componentes Astro** son los bloques fundamentales de cualquier proyecto hecho con Astro. Son componentes de maquetado compuestos únicamente por HTML y sin ejecución del lado del cliente.

La sintaxis de los componentes Astro es un superconjunto de HTML. La sintaxis fue [diseñada para que gente experimentada con HTML o JSX se sienta familiarizado](/es/comparing-astro-vs-other-tools/#astro-vs-jsx), y añade soporte para incluir componentes y expresiones de Javascript. Puedes identificar los componentes Astro por su extensión: `.astro`.

Los componentes Astro son extremadamente flexibles. Muchas veces, un componente Astro puede contener **UI reutilizable en la página**, como puede ser un header o una profile card. Otras veces, un componente Astro puede contener un snippet pequeño de HTML, como puede ser una colección de etiquetas `<meta>` para facilitar nuestro trabajo con el SEO. Los componentes Astro también pueden contener el layout entero de una página.

Lo más importante acerca de los componentes Astro es que **se renderizan a HTML durante el build**. Aun si corres código Javascript dentro de tus componentes, este código va a correr ahead-of-time, siendo quitado de la página final que envías al usuario. El resultado es un sitio web más rápido, sin rastros de Javascript agregado por defecto.


## Vista general de un Componente

Un componente Astro se compone de dos partes principales: el **Script del Componente** y la **Plantilla del Componente**. Cada parte cumple una función diferente, pero juntas proveen un marco de trabajo que pretende ser fácil de utilizar y lo suficientemente expresivo para manejar cualquier cosa que desees construir.

```astro
---
// Script del Componente (JavaScript)
---
<!-- Plantilla del Componente (HTML + Expresiones JS) -->
```

Puedes utilizar componentes dentro de otros componentes para construir una UI más avanzada y compleja. Por ejemplo, un componente `Button` puede ser utilizado para crear un componente `ButtonGroup` de la siguiente manera:

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


### Script del Componente

Astro utiliza una valla de código (`---`) para identificar el script del componente Astro. Si ya has escrito Markdown antes deberías estar familiarizado con un concepto similar llamado *frontmatter*. La parte del script del componente de Astro fue inspirada por este concepto.

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
<!-- Tu maquetado va aquí! -->
```

La valla de código está diseñada para garantizar que el código Javascript que escribes adentro se encuentre "encapsulado". No va a filtrarse a tu aplicación de frontend, o caer en manos del usuario. Puede escribir código que sea costoso o sensible (como una llamada a tu base de datos privada) sin preocuparte por que estos datos sensibles lleguen al navegador del usuario.

>💡 *Puedes utilizar Typescript en el script de tu componente!*

### Maquetado del Componente

Debajo del script del componente vive el maquetado. El maquetado del componente define el HTML que va a generar tu componente.

Si escribes HTML plano en esta sección, tu componente va a renderizar este HTML en cualquier página Astro donde sea importado y utilizado.

Sin embargo, la sintaxis del maquetado del componente Astro también soporta **expresiones de Javascript**, **componentes importados** y [**directivas especiales de astro**](/es/reference/directives-reference/). Los datos y valores definidos (en tiempo de build de la página) en el script del componente pueden ser utilizados en el maquetado del componente para producir HTML creado dinámicamente.

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

<!-- Puedes utilizar una directiva de maquetado para inyectar un string HTML sin escapar dentro de un elemento: -->
<p set:html={rawHTMLString} />
```

### Expresiones JSX Dinámicas

Los componentes Astro pueden definir variables locales dentro del script del componente. Cualquiera de estas variables van a estar disponibles para ser utilizadas en el maquetado HTML del componente de manera automática.

#### Valores Dinámicos

Las variables locales pueden ser utilizadas entre llaves, en este caso su valor va a ser utilizado en el HTML generado:

```astro
---
const nombre = "Astro";
---
<div>
  <h1>Hola {nombre}!</h1>
</div>
```

#### Atributos Dinámicos

Las variables locales pueden ser utilizadas entre llaves para pasar valores a atributos de componentes y elementos HTML:

```astro
---
const nombre = "Astro";
---
<h1 class={nombre}>Soporta expresiones en atributos</h1>

<MiComponente nombreDeAtributo={`MiNombreEs${nombre}`} />
```

#### HTML Dinámico

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

#### Fragmentos y Elementos Múltiples

Recuerda: el maquetado de un componente Astro es capaz de renderizar múltiples elementos sin la necesidad de englobar todo en un `<div>` o `<>` padre.

Sin embargo, al utilizar las expresiones parecidas a JSX para crear elementos dinámicamente, debes englobar estos elementos dentro de un **Fragment** de la misma forma que lo harías utilizando JavaScript o JSX. Astro ofrece las alternativas `<Fragment> </Fragment>` ó `<> </>`.

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


### Props de Componentes

Un componente Astro puede definir y aceptar props. Estas props estarán disponibles para ser utilizadas en el renderizado del maquetado HTML y además estarán disponibles en el script del componente de manera global dentro del objeto `Astro.props`.

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

Este componente, al importarlo y renderizarlo en otros componentes Astro, sean layouts o páginas, puede recibir estas props como atributos:

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

> 💡 Diferente a _props_, que son atributos enviados a un componente Astro y disponibles para utilizar con `Astro.props`, los _slots_ renderizan elementos HTML hijos donde se lo indique.


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

Este patrón es la base del layout de un componente Astro: una página entera de contenido HTML puede ser "envuelta" con etiquetas `<Layout></Layout>` y enviadas al componente Layout para ser renderizada dentro de elementos comunes de la página.


#### Slots con nombre

Un componente Astro puede tener también slots con nombre. Esto le permite compartir elementos HTML únicamente con el nombre correspondiente al slot.

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

> ⚠️ Esto funciona únicamente cuando se envían slots a otros componentes Astro. Aprende más sobre incluir otros [componentes de interfaces de usuario](/es/core-concepts/framework-components/) en archivos Astro.


#### Contenido Alternativo para Slots

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
    <p>This is my fallback content, if there is no child passed into slot</p>
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

> ⚠️ Los estilos definidos aquí serán aplicados únicamente en el maquetado del componente. **No** se verán afectados los componentes hijos ni cualquier otro componente importado por defecto.

📚 Lea nuestra [Guía de estilos](/es/guides/styling/) para más información en cómo aplicar estilos.

### Scripts del lado del Cliente

Para enviar Javascript al cliente sin [utilizar frameworks de componentes](/es/core-concepts/framework-components/) (React, Svelte, Vue, Preact, SolidJS, AlpineJS, Lit) o [integraciones de Astro](https://astro.build/integrations/) (ej. astro-XElement), puedes utilizar una etiqueta `<script>` en el maquetado de tu componente y enviar JavaScript al navegador que será ejecutado en el ámbito global.

```astro
<script>
  // Procesado! Comprimido! Funciona la importación de ESM, aun si son paquetes npm.
</script>

<script is:inline>
  // Será renderizado en el HTML tal cual sea escrito!
  // El importado de ESM relativos al archivo no serán resueltos.
</script>
```

📚 Lea nuestra página con [referencias de directivas](/es/reference/directives-reference/#script--style-directives) para más información acerca de las directivas disponibles para las etiquetas `<script>`.

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

📚 Lee acerca de [componentes Astro internos](/es/reference/api-reference/#built-in-components).

📚 Aprende acerca del uso de [componentes de frameworks de JavaScript](/es/core-concepts/framework-components/) en su proyecto Astro.
