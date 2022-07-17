---
layout: ~/layouts/MainLayout.astro
title: Solución de problemas
description: ¿Necesitas ayuda? ¿Estás atascado? Nosotros te ayudamos.
i18nReady: true
---

Astro provee muchas herramientas diferentes para ayudar a solucionar y debuggear los problemas en tu código.

## Mensajes de error comunes

Aquí veremos algunos mensajes de error comunes con los que te puedes llegar a cruzar en la terminal, su significado y qué hacer para solucionarlos.

### Transform failed with X error

Este mensaje suele aparecer debido a una limitación actual en Astro en la cual se requiere que las importaciones y exportaciones se encuentren en la parte superior de tu archivo `.astro`.

**Solución**: Escribir tus importaciones y exportaciones en la parte superior del script de tu componente.

**Estado**: Limitación vigente; se está trabajando en un fix.

**¿No estás seguro que este sea tu problema?**  
¡Puedes ver si alguien ya ha reportado [este error](https://github.com/withastro/astro/issues?q=is%3Aissue+is%3Aopen+Transform+failed+with+*+error)!

### Cannot use import statement outside a module

En componentes de Astro, las tags `<script>` son elevadas (hoisted) y cargadas como [módulos JS](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Modules) por defecto. Si has incluido la [directiva `is:inline`](/es/reference/directives-reference/#isinline) o cualquier otro atributo en tu tag, este comportamiento por defecto es removido.

**Solución**: Si has añadido atributos a tu tag `script`, también debes agregar el atributo `type="module"` para poder usar declaraciones de importación.

**Estado**: Comportamiento esperado de Astro.

**¿No estás seguro que este sea tu problema?**  
¡Puedes ver si alguien ya ha reportado [este error](https://github.com/withastro/astro/issues?q=is%3Aissue+is%3Aopen+Cannot+use+import+statement)!

### Unable to render component

Esto indica que hay un error en un componente que hayas intentado importar y usar en el maquetado de Astro.

#### Causa común

Esto puede ser causado al intentar acceder al objeto `window` o `document` en el servidor. Por defecto, Astro va a a renderizar tu componente de manera [isomórfica](https://en.wikipedia.org/wiki/Isomorphic_JavaScript), lo que significa que esto va a suceder en el servidor, donde la API del navegador no está disponible. Puedes desactivar este paso de pre-renderizado usando [la directiva `client:only`](/es/reference/directives-reference/#clientonly).

**Solución**: Intenta acceder a esos objetos luego del renderizado (ej.: [`useEffect()`](https://es.reactjs.org/docs/hooks-reference.html#useeffect) en React o [`onMounted()`](https://vuejs.org/api/composition-api-lifecycle.html#onmounted) en Vue y [`onMount()`](https://svelte.dev/docs#run-time-svelte-onmount) en Svelte).

**Estado**: Comportamiento esperado de Astro.

#### ¿Ninguna de esas?

**Solución**: Lee la documentación para [componentes de Astro](/es/core-concepts/astro-components/) o [componentes de framework](/es/core-concepts/framework-components/). Considera abrir una plantilla de inicio de Astro desde [astro.new](https://astro.new) para intentar solucionar el problema de tu componente en una reproducción mínima.

**¿No estás seguro que este sea tu problema?**  
¡Puedes ver si alguien ya ha reportado [este error](https://github.com/withastro/astro/issues?q=is%3Aissue+is%3Aopen+Unable+to+render+Component)!


### Expected a default export

Este error puede ser lanzado cuando intentas importar o renderizar un componente inválido, o uno que no funciona de manera correcta. (Este mensaje particular ocurre por la forma en que funciona la importación de componentes de UI en Astro.)

**Solución**: Intenta buscar errores en los componentes que estás intentando importar y renderizar, y asegúrate que esté funcionando correctamente. Considera abrir una plantilla de inicio de Astro desde [astro.new](https://astro.new) para intentar solucionar el problema de tu componente en una reproducción mínima.

**Estado**: Comportamiento esperado de Astro.

## Gotchas comunes

### Mi componente no se renderiza

Primero, chequea que has **importado el componente** en el [script del componente `.astro`](/es/core-concepts/astro-components/#script-del-componente) o en el [frontmatter de `.md`](/es/guides/markdown-content/#usando-componentes-en-markdown).

Luego chequea la declaración de importación:

- Estás realizando la importación desde el lugar correcto? (Chequea la ruta de importación.)

- Tu importación posee el mismo nombre que el del componente? (Chequea el nombre de tu componente y que [cumpla con la sintaxis de componentes `.astro`](/es/comparing-astro-vs-other-tools/#astro-vs-jsx).)

- Has incluido la extensión en la importación? (Chequea que el archivo del cual importas contiene una extensión, ej.: `.astro`, `.md`, `.jsx`, `.vue`.)

### Mi componente no es interactivo

Si tu componente se renderiza (ver arriba) pero no responde a la interacción del usuario, entonces puede que hayas olvidado utilizar una [directiva `client:*`](/es/reference/directives-reference/#directivas-del-cliente) para hidratar tu componente.

Por defecto, un [componente de framework no es hidratado en el cliente](/es/core-concepts/framework-components/#hidratando-componentes-interactivos). Si no se provee una directiva `client:*`, su HTML es renderizado en la página sin JavaScript.

:::tip
Los [componentes de Astro](/es/core-concepts/astro-components/) son componentes de maquetado compuestos únicamente por HTML y sin ejecución del lado del cliente. Pero puedes utilizar una etiqueta `<script>` en el maquetado de tu componente y enviar JavaScript al navegador que será ejecutado en el ámbito global.
:::

### Cannot find package 'X'

Lee la [guía de integraciones de Astro](/es/guides/integrations-guide/) para instrucciones acerca de agregar renderers de frameworks, herramientas de CSS y otros paquetes en Astro.

Puede que necesites instalar peer-dependencies para usar algunas integraciones. Si ves la advertencia “missing peer dependencies”, puedes seguir las instrucciones para [manejar dependencias](/es/guides/integrations-guide/#manejando-las-dependencias-de-integraciones).

### `Astro.glob()` - no matches found

Cuando utilizas `Astro.glob()` para importar archivos, asegúrate de usar la sintaxis correcta de glob para que coincida con los archivos que necesitas utilizar.

#### Rutas de archivos

Por ejemplo, usa `../components/**/*.js` en `src/pages/index.astro` para importar ambos archivos:
- `src/components/MiComponente.js`
- `src/components/includes/MiOtroComponente.js`

#### Valores compatibles

`Astro.glob()` no es compatible con variables dinámicas ni interpolación de cadenas de texto.

Esto no es un bug en Astro. Esto se debe a una limitación de la [función helper `import.meta.glob()` de Vite](https://vitejs.dev/guide/features.html#glob-import) la cual solamente soporta cadenas de texto estáticas.

Una solución alternativa es importar un grupo de archivos que incluya todos los archivos que necesitemos utilizando `Astro.glob()` y luego filtrarlos:

```astro
---
// src/components/destacado.astro
const { postSlug } = Astro.props
const rutaAMiArticuloDestacado = `src/pages/blog/${postSlug}.md`

const articulos = await Astro.glob('../pages/blog/*.md');
const miArticuloDestacado = articulos.find(articulo => articulo.file.includes(rutaAMiArticuloDestacado));
---

<p>
    ¡Mira mi artículo favorito, <a href={miArticuloDestacado.url}>{miArticuloDestacado.frontmatter.title}</a>!
</p>
```

### Utilizando Astro con Yarn 2+ (Berry)

Yarn 2+, también conocido como Berry, utiliza una técnica llamada [Plug'n'Play (PnP)](https://yarnpkg.com/features/pnp) para guardar y manipular módulos de Node, lo cual puede [causar problemas](https://github.com/withastro/astro/issues/3450) al inicializar un proyecto nuevo de Astro utilizando `create-astro` o al trabajar con Astro. Una solución alternativa es configurar la [propiedad `nodeLinker`](https://yarnpkg.com/configuration/yarnrc#nodeLinker) en `yarnrc.yml` con el valor `node-modules`:

```yaml
nodeLinker: "node-modules"
```

## Consejos y trucos

### Debugging usando `console.log()`

Usar `console.log()` es un método simple pero muy popular para debuggear tu código de Astro. Donde declares tu `console.log` determinará dónde se imprimirá lo que quieras debuggear.

#### Frontmatter

Utilizar `console.log()` en el frontmatter de Astro siempre se imprimirá en la **terminal** donde esté corriendo el servidor de Astro. Esto es porque Astro corre en el servidor, y nunca en el navegador.

```astro
---
const sum = (a, b) => a + b;

// Ejemplo: Imprime "4" en la línea de comandos.
console.log(sum(2, 2));
---
```

#### Scripts de JS

El código que es escrito o importado dentro de una etiqueta `<script>` de Astro es ejecutado en el navegador. Cualquier `console.log()` u otros mecanismos de debug que usemos ahí van a ser impresos en la consola de tu navegador.

### Debuggeando componentes de framework

Los [componentes de framework](/es/core-concepts/framework-components/) (como React y Svelte) son únicos: se renderizan del lado del servidor por defecto, lo que significa que la salida del `console.log()` va a ser visible en la terminal. Sin embargo, también pueden ser hidratados en el navegador, lo que puede causar que tus logs de debug también sean visibles en el navegador.

Esto puede ser útil para debuggear diferencias entre los datos de salida de SSR y los componentes hidratados en el navegador.

### Componente `<Debug />` de Astro

Para ayudarte a debuggear tus componentes de Astro, Astro provee un componente [`<Debug />`](/es/reference/api-reference/#debug-) incorporado que renderiza cualquier valor directo en el maquetado HTML del componente. Esto es útil para debuggear rápidamente en el navegador mismo sin estar alternando entre la terminal y la consola del navegador.

```astro
---
import { Debug } from 'astro/components';
const sum = (a, b) => a + b;
---

<!-- Ejemplo: Imprime {respuesta: 6} en el navegador. -->
<Debug respuesta={sum(2, 4)} />
```

El componente Debug soporta una gran variedad de opciones de sintaxis para un debug más flexible y conciso:

```astro
---
import { Debug } from 'astro/components';
const sum = (a, b) => a + b;
const respuesta = sum(2, 4);
---
<!-- Ejemplo: Los tres casos son equivalentes. -->
<Debug respuesta={sum(2, 4)} />
<Debug {{respuesta: sum(2, 4)}} />
<Debug {respuesta} />
```

## ¿Necesitas más ayuda?

Ven a conversar con nosotros en [Discord](https://astro.build/chat) y explícanos tu problema en el canal `#support-threads`. ¡Estaremos felices de ayudarte!

Visita los [Issues abiertos en Astro](https://github.com/withastro/astro/issues/) para ver si encuentras un problema conocido o para crear un reporte de bug.

También puedes visitar las [Discusiones de RFC](https://github.com/withastro/rfcs/discussions/) para ver si has alcanzado una limitación conocida de Astro, y para chequear si existen propuestas relacionadas con tu caso de uso.
