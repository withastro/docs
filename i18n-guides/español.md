# Guía de traducción de la versión en español de Astro Docs

Esta guía está destinada a personas que deseen participar en la traducción al español de la documentación de Astro.

Su objetivo es ayudar a mantener una traducción homogénea en la documentación y el ecosistema de Astro (por ejemplo [Starlight](https://starlight.astro.build/)).

## 🧩 Participar en la traducción

No dudes en unirte al [servidor Discord oficial de Astro](https://astro.build/chat), y especialmente al hilo [`i18n-es`](https://discord.com/channels/830184174198718474/971729943786561556), para obtener ayuda, solicitar consejos y coordinarte con otros traductores.

## 📖 Glosario

El glosario permite establecer una lista de traducciones acordadas y de palabras que no requieren traducción por considerarse propias de Astro o ampliamente aceptadas.

> [!WARNING]
> Este glosario está vivo: no dudes en enriquecerlo cuando sea necesario.

### 🔄️ Palabras que no requieren traducción

Las palabras que se refieren a tecnologías no deben traducirse, ya sean lenguajes, bibliotecas o frameworks (p. ej. Markdown, TypeScript, React, Svelte, IntelliSense, etc.).

#### Conceptos de Astro

| Término | Condición | Explicaciones/Referencia (opcional) |
|---------|-----------|-------------------------------------|
| Fragment | Cuando se refiere a las etiquetas `<Fragment> </Fragment>` o `<> </>`. | La etiqueta no puede traducirse. |
| frontmatter | Siempre. | Puede considerarse como la cabecera del archivo (Astro o Markdown), delimitada por tres guiones (`---`). No parece estar traducida en otros lugares. |
| props | Cuando se refiere a las propiedades/atributos de un componente. | « props » es un término común en la Jamstack; para facilitar la migración, hemos elegido no traducirlo (ref. [discusión en Discord](https://discord.com/channels/830184174198718474/971729943786561556/1286078277810782289)). |
| slot | Cuando se usa como nombre y se refiere a la etiqueta `<slot/>`. | La etiqueta no puede traducirse. |

#### Otras palabras sin traducir

Existen otras palabras que no tienen una traducción oficial o cuyo término recomendado no genera consenso y se usa poco en otros lugares. En estos casos, es preferible mantener la palabra en inglés, que probablemente será más comprensible.

| Término | Definición | Explicaciones/Referencia (opcional) |
|---------|------------|-------------------------------------|
| framework | Se refiere a una infraestructura de software que permite el diseño de aplicaciones (p. ej.: `Angular`, `Vue`, `Svelte`, etc.). | Aunque « marco de trabajo » es la traducción oficial, rara vez se usa en otros lugares. |
| front-end | Se refiere a la interfaz de usuario de una aplicación. | Aunque « frontal » es una traducción posible, rara vez se usa en otros lugares. |
| back-end | Se refiere a la parte servidor de una aplicación. | Aunque « dorsal » es una traducción posible, rara vez se usa en otros lugares. |
| middleware | Designa un software que permite coordinar el funcionamiento de varios programas. | Aunque « software intermediario » e « intermediario » son las traducciones recomendadas, rara vez se usan en otros lugares. |
| hook | Designa un punto de anclaje que permite al usuario ejecutar código en un lugar específico del código fuente. | « gancho » no aporta suficiente significado y rara vez se traduce. Discusión previa: https://github.com/withastro/docs/pull/11593#discussion_r2074976678 |
| headless | Designa una arquitectura donde el front-end y el back-end se ofrecen por separado (p. ej. un CMS para gestionar contenidos y una aplicación Astro para mostrarlos). | No existe una traducción oficial y pensamos que « sin cabeza » no es suficientemente descriptivo. Discusión previa: https://github.com/withastro/docs/pull/11593#discussion_r2074967636 |
| glob / globbing | Designa una función o proceso que permite hacer coincidir patrones con nombres de directorio o archivo usando caracteres comodín (también conocido como « emparejamiento de patrones »). | No tenemos una traducción oficial para este término y usar « global » sería un error de traducción. Discusión previa: https://github.com/withastro/docs/pull/11795#discussion_r2112787624 |

### 🔤 Traducciones comunes

#### Conceptos y API de Astro

| Inglés | Español | Explicaciones/Referencia (opcional) |
|--------|---------|-------------------------------------|
| Astro Islands | Islands de Astro | Discusión previa: https://github.com/withastro/docs/pull/11593#discussion_r2074910929 |
| Content Collections | Colecciones de contenido | |
| Content Layer | Capa de contenido | |
| Fonts | Fuentes o Tipografías | |
| Island architecture | Arquitectura de islands | |
| Sessions | Sesiones | |

#### Lenguaje común

Algunas palabras tienen un equivalente en español que debe usarse de manera uniforme en las diferentes traducciones.

| Inglés | Español | Explicaciones/Referencia (opcional) |
|--------|---------|-------------------------------------|
| assets | recursos | |
| breaking changes | cambios que rompen compatibilidad / cambios no retrocompatibles | « cambios importantes » es aceptable para evitar repeticiones, siempre que se mantenga la noción de que algo puede « romper » en el título/texto. Discusión previa: https://github.com/withastro/docs/pull/11795#discussion_r2112817635 |
| build | Según el contexto: creación / construcción / compilación. En referencia a `astro build`, se preferirá el término compilación. | |
| bundle | группировка / bundle | |
| changelog | registro de cambios | |
| (the) CLI / (the) command line interface | (la) CLI / (la) interfaz de línea de comandos | |
| client-side | lado del cliente | |
| code fences (`---`) | delimitador de código | Discusión previa: https://github.com/withastro/docs/pull/11795#discussion_r2114303905 |
| deprecation | descatalogado | Discusión previa: https://github.com/withastro/docs/pull/11795#discussion_r2114666199 |
| docs | documentación | |
| endpoint | punto de conexión | |
| export | exportación | |
| feedback | comentarios | |
| flag | opción | |
| footer | pie de página | |
| header | cabecera | |
| heading | título | |
| import | importación | |
| inline | dentro de / en el cuerpo / integrado en | La traducción depende mucho del contexto; las propuestas anteriores son solo ejemplos posibles. Es preferible encontrar una alternativa a « en línea » en la mayoría de los casos. Discusión previa: https://github.com/withastro/docs/pull/11795#discussion_r2112802152 |
| issue | problema o, en referencia a la funcionalidad de GitHub, issue | [MDN](https://developer.mozilla.org/es/docs/MDN/Community/Issues) también usa « issue » para describir la funcionalidad de GitHub |
| layout | diseño / estructura | |
| live | en vivo / operativo | « live » generalmente se usa para diferenciar desarrollo/producción, por lo que « en directo » rara vez es la traducción correcta. Puede ser preferible omitir esta palabra si el contexto es claro. |
| on-demand rendering | renderizado bajo demanda | |
| overlay | superposición | |
| package | paquete | |
| pattern | patrón | |
| placeholder | marcador de posición | La traducción depende mucho del contexto; las propuestas anteriores son solo ejemplos posibles. Discusión previa: https://github.com/withastro/docs/pull/11593#discussion_r2071856903 |
| plugin | plugin / extensión | |
| preset | configuración predefinida | |
| prop | propiedad | |
| props | props o propiedades | En referencia a un componente, prefiera « props »; de lo contrario, use « propiedades » (ver [Conceptos de Astro](#conceptos-de-astro)) |
| output | salida | |
| re-render | volver a renderizar | |
| recipes | recetas | |
| renderer | motor de renderizado | |
| rendering | renderizado | |
| repository | repositorio | |
| routing | enrutamiento | |
| runtime | Según el contexto: motor de ejecución / entorno de ejecución / en tiempo de ejecución | |
| scope | alcance | |
| scoped | con alcance limitado | |
| server-side | lado del servidor | |
| template | plantilla | |
| to build | Según el contexto: crear / construir / compilar | |
| to bundle | agrupar | |
| to commit | confirmar | Esta es la traducción usada en la interfaz en español de VS Code. |
| to deprecate | depreciar | Discusión previa: https://github.com/withastro/docs/pull/11795#discussion_r2114666199 |
| to export | exportar | |
| to fetch | obtener | |
| to import | importar | |
| to prefetch | precargar | |
| to prerender | pre-renderizar | |
| to render | renderizar | |
| to slot | insertar | |
| to store | almacenar | |
| to style | aplicar estilos | |
| to support (algo) | admitir / ser compatible con | Discusión previa: https://github.com/withastro/docs/pull/11795#discussion_r2112812611 |
| to support (una persona) | asistir | Discusión previa: https://github.com/withastro/docs/pull/11795#discussion_r2112812611 |
| to type | escribir / escribir tipo | |
| to wrap | envolver | |
| type safe | seguridad de tipos | |
| UI | IU | |
| update | actualización | |
| upgrade | mejora | |
| view transitions | transiciones de vista | |

> [!NOTE]
> Estas traducciones son recomendaciones. A veces es aceptable usar otra traducción si es más adecuada al contexto o hace la lectura más fluida evitando repeticiones.

> [!TIP]
> A veces puede ser útil, para facilitar la búsqueda o comprensión de un concepto, proponer en algunos lugares, con mesura, dos versiones. Por ejemplo: `the component props` podría traducirse como `los props (o « propiedades ») del componente`.

## 📝 Consejos estilísticos

### Los títulos

Algunas guías de estilo en inglés recomiendan el uso de mayúsculas para cada palabra en un título. Estas reglas no aplican en español. Por lo tanto, se recomienda usar mayúscula solo al inicio del título, con excepción de los nombres propios y los componentes.

También es preferible usar el infinitivo en lugar del imperativo al traducir títulos.

### Las comillas

Aunque son difíciles de acceder en un teclado, es preferible usar comillas tipográficas españolas (`« texto »`) en lugar de comillas dobles (`"texto"`).

Memo Unicode:
* `«` : <kbd>U+00ab</kbd>
* `»` : <kbd>U+00bb</kbd>

### Código usado como palabra en una frase

En la versión inglesa, verás regularmente palabras entre acentos graves `` ` ``. Esta sintaxis no siempre tiene sentido en español, por lo que a veces es preferible reemplazar el código por una palabra en español y añadir la versión de código junto a ella.

**Por ejemplo:** ``The file `path`...`` debería traducirse como ``El path del archivo (`path`)...``.

### Enlaces

#### Internos

Todos los enlaces deben redirigir a la versión en español, así que recuerda reemplazar `/en/` por `/es/` incluso si la página de destino aún no está traducida. También debes pensar en traducir la parte después de `#`, cuando existe: corresponde al id generado para un título en la página. Puedes usar el servidor de desarrollo para verificar el id generado.

#### Externos

* El ancla (o texto) del enlace siempre se traduce.
* El enlace no cambia salvo que exista una versión en español. Por lo tanto, es preferible verificar el enlace al momento de la traducción.
* Si no existe una versión en español, puede ser útil añadir el idioma después del enlace (p. ej. `texto del enlace (Inglés)`) para informar al lector de que la página de destino está en otro idioma.

### Los ejemplos

Para que el ejemplo sea comprensible para los lectores con menor nivel de inglés, es importante traducir los comentarios. También puede ser interesante adaptar las rutas y los nombres de las variables si consideras que facilita la comprensión.

Cuando modifiques un ejemplo, recuerda verificar los argumentos pasados al bloque de código para también [actualizar el resaltado](https://expressive-code.com/key-features/text-markers/#usage-in-markdown--mdx) si es necesario.

## 📚 Recursos

* En caso de duda con una traducción, no dudes en consultar lo que se hace en otras documentaciones (MDN, React, Vue, etc.).
* [Fundeu](https://www.fundeu.es/): Permite consultar términos en español.
* [Universidad de Valencia - UVE](https://www.uv.es/pls/uvi/): Recurso para terminología española.