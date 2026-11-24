# Guía de traducción de la versión en español de Astro Docs

Esta guía está pensada para quienes colaboran en la traducción al español de la documentación de Astro.

Su objetivo es mantener una traducción homogénea dentro de Astro Docs y del resto del ecosistema de Astro (por ejemplo, [Starlight](https://starlight.astro.build/)).

## 🧩 Participar en la traducción

Únete al [servidor oficial de Discord de Astro](https://astro.build/chat) y, en particular, al hilo [`#i18n-es`](https://discord.com/channels/830184174198718474/971767750496227328) para resolver dudas, pedir opinión y coordinarte con otras personas que traducen.

Antes de empezar una página, comprueba que no tenga ya un pull request abierto. Para el proceso general, consulta las guías de contribución:

- [Cómo traducir la documentación de Astro](https://contribute.docs.astro.build/guides/i18n/)
- [Cómo revisar pull requests de traducción](https://contribute.docs.astro.build/reviewers/reviewing-translations/)

## 🎯 Principios de la traducción

- **Conserva la intención y el tono del original.** La documentación de Astro es cercana y amigable. Adapta las frases para que mantengan ese tono en español, sin añadir ni omitir información.
- **Prioriza la claridad sobre la literalidad.** Evita los calcos del inglés cuando suenen artificiales. Si una traducción literal dificulta la comprensión, reformula la frase.
- **Mantén la paridad con el original.** Conserva la misma estructura: número de líneas, encabezados, listas, bloques de código y componentes. Así las revisiones y las actualizaciones posteriores son más sencillas.
- **Apóyate en usos ya establecidos.** Antes de traducir un término, comprueba cómo se ha traducido en otras páginas de Astro Docs y en documentación técnica de referencia en español (MDN, Vue, React). Si dos términos conviven, usa el que ya predomina en la página o en el repositorio.
- **Trata a Astro como una marca.** Escribe «proyecto de Astro» o «proyecto Astro» según suene más natural, pero no traduzcas ni modifiques el nombre.
- **Dirígete a la persona lectora de tú.** Usa la segunda persona del singular («puedes», «necesitas», «tu proyecto»). No uses «usted», «ustedes» ni «vosotros».

## 📖 Glosario

El glosario recoge las traducciones acordadas y los términos que se mantienen en inglés.

> [!WARNING]
> Este glosario es un documento vivo. Añade o corrige entradas cuando una discusión de revisión llegue a un acuerdo.

### 🔄️ Términos que no se traducen

Los nombres de tecnologías, lenguajes, bibliotecas y frameworks no se traducen (p. ej., Markdown, TypeScript, React, Svelte). Tampoco se traducen los nombres de API, componentes, propiedades y comandos (p. ej., `getStaticPaths()`, `<Fragment>`, `astro build`).

#### Conceptos de Astro y de desarrollo web

| Término | Condición | Justificación |
| ------- | --------- | ------------- |
| frontmatter | Siempre. | Es el término habitual en todo el ecosistema y no existe un equivalente establecido. |
| props | Al hacer referencia a las propiedades de un componente. | Es el término común en el ecosistema de JavaScript. |
| slot | Como sustantivo y al hacer referencia al elemento `<slot />` o al atributo `slot`. | Es el nombre de un elemento y de un atributo, y no se puede traducir. |
| layout | Al hacer referencia a los layouts de Astro. | Es el término de uso predominante en la documentación. |
| endpoint | Siempre. | Es el término de uso predominante en la documentación. |
| slug | Siempre. | Es el nombre de una propiedad y un término habitual del desarrollo web. |
| middleware | Siempre. | No existe una traducción de uso extendido. |
| hook | Siempre. | «Gancho» no aporta suficiente significado y casi no se usa. |
| framework | Siempre. | «Marco de trabajo» casi no se usa en la documentación técnica. |
| headless | Al hablar de arquitecturas que separan el contenido de su presentación (p. ej., un CMS headless). | No existe una traducción establecida. |
| runtime | Al hacer referencia a un entorno de ejecución concreto (p. ej., el runtime de Node.js). | Es el término de uso predominante. En otros contextos, usa «tiempo de ejecución». |
| serverless | Siempre. | Es el término de uso predominante. |

### 🔤 Traducciones habituales

#### Conceptos y API de Astro

| Inglés | Español | Observaciones |
| ------ | ------- | ------------- |
| Astro islands | islas de Astro | |
| Island architecture | arquitectura de islas | |
| Server islands | islas de servidor | |
| Content collections | colecciones de contenido | En minúscula dentro de una frase. |
| Content Layer | capa de contenido | |
| On-demand rendering | renderizado bajo demanda | |
| to prerender / prerendered | prerenderizar / prerenderizado | Es la forma de uso predominante. |
| Server-side rendering (SSR) | renderizado en el servidor (SSR) | |
| Client-side | en el cliente | |
| Hydration | hidratación | |
| View transitions | transiciones de vista | |
| Routing | enrutamiento | |
| Adapter | adaptador | |
| Integration | integración | |
| Starter template | plantilla de inicio | Con «oficial»: «plantilla oficial de inicio». |
| Environment variables | variables de entorno | |

#### Vocabulario técnico general

| Inglés | Español | Observaciones |
| ------ | ------- | ------------- |
| build (proceso) | compilación | En el comando se mantiene `astro build`. |
| to build | compilar | |
| assets | recursos | Se mantiene `assets` cuando es el nombre de una carpeta o de una API (p. ej., `src/assets/`). |
| bundling | empaquetado | |
| package | paquete | |
| to deploy / deployment | desplegar / despliegue | |
| hosting | alojamiento | |
| default | predeterminado | «Por defecto» es válido, sobre todo en la ficha de una propiedad (**por defecto:**). |
| deprecated | obsoleto | |
| removed | eliminado | |
| breaking changes | cambios importantes / cambios incompatibles | Conserva la idea de que algo puede dejar de funcionar. |
| to fetch (datos) | obtener | Se mantiene `fetch()` cuando es la API. |
| website | sitio web | |
| browser | navegador | |
| repository | repositorio | |
| file | archivo | |
| icon | icono | |
| template | plantilla | |

> [!NOTE]
> Estas traducciones son recomendaciones. Si el contexto lo justifica, puedes elegir otra, siempre que la página siga siendo coherente.

## 📝 Consejos de estilo y ortotipografía

### Títulos y mayúsculas

El inglés suele escribir los títulos con mayúscula inicial en cada palabra (Title Case). En español se escribe con mayúscula solo la primera palabra, además de los nombres propios y los nombres de componentes o de API.

| Inglés | Español |
| ------ | ------- |
| Setting up the credentials | Configuración de las credenciales |
| Fetching data | Obtención de datos |

Excepción acordada en revisión: los títulos de sección de recursos se escriben con mayúscula para parecerse a la versión en inglés:

- `## Recursos Oficiales` (Official Resources)
- `## Recursos de la Comunidad` (Community Resources)

Los títulos del inglés en gerundio («Fetching data») admiten en español tanto el gerundio («Obteniendo datos») como el sustantivo («Obtención de datos»). Usa la misma forma en todos los títulos de una página.

### Abreviaturas

Traduce `e.g.` como `p. ej.,` (con un espacio entre `p.` y `ej.`, y seguido de coma). Traduce `i.e.` como `es decir,`.

### Comillas

En el repositorio se usan las comillas dobles rectas (`"texto"`) y no las comillas angulares (`«texto»`). Para mantener la coherencia, usa comillas dobles rectas en el texto traducido. Esta norma puede revisarse si la comunidad llega a otro acuerdo.

### Código usado como palabra dentro de una frase

Cuando el inglés usa una palabra de código dentro de una frase, conserva la versión en código solo si hace referencia a la API. Si no, usa la palabra en español y, si ayuda a la comprensión, añade el código entre paréntesis.

### Enlaces

#### Internos

- Reemplaza `/en/` por `/es/` en todos los enlaces, aunque la página de destino todavía no esté traducida.
- Traduce los identificadores de ancla (la parte posterior a `#`) cuando la página de destino ya esté traducida. Comprueba el identificador generado con el servidor de desarrollo.
- Si traduces una página a la que otras páginas ya enlazan, actualiza esos enlaces en el mismo pull request cuando la integración continua avise de que están rotos.
- En Starlight, los archivos traducidos están dentro de una carpeta de idioma (`es/`). Las rutas relativas de las importaciones necesitan un nivel más (`../../../components/...`) que en el archivo en inglés. No copies la ruta del original sin comprobarla.

#### Externos

- Traduce siempre el texto del enlace.
- Mantén la URL, salvo que exista una versión en español de la página (p. ej., [MDN](https://developer.mozilla.org/es/)). Comprueba el enlace cuando lo traduzcas.
- Si la página de destino solo existe en inglés y el contexto no lo deja claro, puedes indicarlo tras el enlace (p. ej., `texto del enlace (en inglés)`).

#### Tarjetas de enlace (`<LinkCard>`)

Traduce el título y la descripción para que sean coherentes entre sí. No traduzcas los nombres propios de repositorios, paquetes o proyectos.

### Código y ejemplos

- Traduce los comentarios de los ejemplos para que se entiendan sin dominar el inglés.
- Puedes adaptar el contenido visible de los ejemplos (textos, nombres de archivos de ejemplo) si facilita la comprensión. No modifiques palabras clave, nombres de API ni nombres de propiedades.
- Si modificas el número de líneas de un ejemplo, actualiza las directivas de resaltado (`ins={...}`, `del={...}`, `{3-13}`) para que sigan apuntando a las líneas correctas. Consulta la [documentación de Expressive Code](https://expressive-code.com/key-features/text-markers/#usage-in-markdown--mdx).
- Mantén los nombres de la interfaz de los productos de terceros tal como aparecen en el producto (p. ej., «Settings» > «Models»). Si la interfaz del producto está disponible en español, usa esa traducción.

### Imágenes

Mantén la URL de la imagen y escribe el texto alternativo (`alt`) en español, describiendo el contenido para quienes usan lectores de pantalla.

### Avisos (`:::note`, `:::tip`, `:::caution`)

Conserva el tipo de aviso y traduce el título entre corchetes. Para `:::caution[Deprecated]`, usa `:::caution[Obsoleto]`.

## 📚 Recursos

- [Diccionario panhispánico de dudas (RAE)](https://www.rae.es/dpd/)
- [Diccionario de la lengua española (RAE)](https://dle.rae.es/)
- [FundéuRAE](https://www.fundeu.es/)
- [MDN Web Docs en español](https://developer.mozilla.org/es/)
- [Documentación de Vue en español](https://es.vuejs.org/)
- [Documentación de React en español](https://es.react.dev/)
- En caso de duda, consulta cómo se ha resuelto en otras páginas de Astro Docs en español.
