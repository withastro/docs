---
layout: ~/layouts/MainLayout.astro
title: Recursos estáticos
description: Aprende a importar diferentes tipos de contenido con Astro.
i18nReady: true
---

Astro es compatible con la mayoría de recursos estáticos sin necesidad de configuración. Puedes usar `import` en cualquier lugar de tu proyecto (incluido el script de frontmatter de Astro) y Astro incluirá una copia optimizada de ese recurso estático en la compilación final. `@import` también es compatible dentro del CSS y `<style>`.

## Tipos de archivos compatibles

Los siguientes tipos de archivos son compatibles por defecto en Astro:

- Componentes de Astro (`.astro`)
- Markdown (`.md`)
- JavaScript (`.js`, `.mjs`)
- TypeScript (`.ts`, `.tsx`)
- Paquetes NPM
- JSON (`.json`)
- JSX (`.jsx`, `.tsx`)
- CSS (`.css`)
- Módulos CSS (`.module.css`)
- Imágenes & otros archivos (`.svg`, `.jpg`, `.png`, etc.)

Si la lista no incluye el tipo de archivo que estás buscando, consulta nuestra [biblioteca de integraciones](https://astro.build/integrations/). Puedes ampliar Astro para agregar compatibilidad con diferentes tipos de archivo, como componentes de Svelte y Vue.

Esta guía detalla cómo Astro compila diferentes tipos de archivo y cómo importarlos correctamente.

Recuerda que también puedes colocar cualquier recurso estático en la carpeta [`public/`](/es/core-concepts/project-structure/#public) de tu proyecto, y Astro los copiará directamente en la compilación final. Los archivos dentro de `public/` no son compilados ni empaquetados por Astro, lo que significa que cualquier tipo de archivo es compatible. Puedes hacer referencia a un archivo de la carpeta `public/` directamente desde el HTML mediante una dirección URL.

## JavaScript

```js
import { getUser } from './user.js';
```

Archivos JavaScript se pueden importar utilizando la sintaxis normal de `import` y `export` de ESM. Esto funciona como se espera, basado en el comportamiento de Node.js y del navegador.

## TypeScript

```js
import { getUser } from './user.ts';
import type { UserType } from './user.ts';
```

Astro incluye compatibilidad con [TypeScript](https://www.typescriptlang.org/). Puedes importar archivos `.ts` y `.tsx` directamente a su proyecto de Astro, e incluso escribir código TypeScript directamente dentro de sus [componentes de Astro](/es/core-concepts/astro-components/#script-del-componente) .

**Astro no realiza ninguna verificación de tipos por sí mismo.** La verificación de tipos debe realizarse al margen Astro, ya sea mediante el IDE o un script separado. La [extensión de Astro para VSCode](/es/editor-setup/) proporciona sugerencias y errores de TypeScript automáticamente en tus archivos abiertos.

📚 Lea más sobre la compatibilidad de [TypeScript en Astro.](/es/guides/typescript/)

## JSX / TSX

```js
import { MyComponent } from './MyComponent.jsx';
```

Astro es compatible con archivos JSX (`*.jsx` y `*.tsx`). La sintaxis JSX se transpila automáticamente a JavaScript.

Si bien Astro entiende la sintaxis de JSX por defecto, deberás incluir una integración de framework para renderizar correctamente frameworks como React, Preact y Solid. Consulta nuestra [guía de integraciones](/es/guides/integrations-guide/) para obtener más información.

:::note
**Astro no soporta código JSX en archivos `.js`/`.ts`.** JSX solo es compatible dentro de los archivos que terminen con las extensiones `.jsx` y `.tsx`.
:::

## Paquetes NPM

```js
// Importa los paquetes NPM de React y React-DOM
import React from 'react';
import ReactDOM from 'react-dom';
```

Astro te permite importar paquetes npm directamente en el navegador. Incluso si un paquete se publicó con un formato antiguo, Astro lo convertirá a ESM antes de enviarlo al navegador.

## JSON

```js
// Importa el objeto JSON mediante el export por defecto
import json from './data.json';
```

Astro puede importar archivos JSON directamente a su aplicación. Los archivos importados devuelven el objeto JSON completo mediante una importación por defecto.

## CSS

```js
// Importa e inyecta 'style.css' en la página
import './style.css';
```

Astro es compatible con la importación de CSS directamente en su aplicación. Los estilos importados no exponen exportaciones, pero importar uno agregará automáticamente esos estilos a la página. Esto funciona para todos los archivos CSS de forma predeterminada y es compatible con lenguajes de compilación a CSS como Sass & Less a través de plugins.

Si prefieres no escribir CSS, Astro también es compatible con todas las librerías CSS-in-JS populares (como styled-components) para aplicar estilos a su proyecto.

## CSS Modules

```jsx
// 1. Convierte las clases de './style.module.css' en valores únicos con 
//    alcance solo para este componente.
// 2. Devuelve un objeto que mapea los nombres de clase originales a sus 
//    valores finales, con alcance solo para este componente.
import styles from './style.module.css';

// Este ejemplo usa JSX, pero puedes usar módulos CSS con cualquier framework.
return <div className={styles.error}>Tu mensaje de error</div>;
```

Astro es compatible con módulos CSS utilizando la nomenclatura `[nombre].module.css`. Como cualquier archivo CSS, al importar el archivo se aplicará automáticamente los estilos a la página. Sin embargo, los módulos CSS exportan un objeto `styles` que mapea los nombres de clase originales con los identificadores únicos generados.

CSS Modules te ayuda a limitar el alcance de los estilos y aislarlos de otros mediante nombres de clase únicos que son generados para tus hojas de estilo.

## Otros recursos

```jsx
import imgReference from './image.png'; // img === '/src/image.png'
import svgReference from './image.svg'; // svg === '/src/image.svg'
import txtReference from './words.txt'; // txt === '/src/words.txt'

// Este ejemplo utiliza JSX, pero puedes usar módulos CSS con cualquier framework.
<img src={imgReference} />;
```

Todos los archivos que no se mencionan explícitamente en el ejemplo anterior, se pueden importar a través de ESM `import` y devolverán una URL con referencia al archivo creado. Esto puede ser útil para hacer referencia por URL a archivos que no son JS, como crear un elemento img con el atributo src que apunte a esa imagen.

También puede ser útil colocar imágenes en la carpeta `public/` como se explica en la página de [estructura de proyecto](/es/core-concepts/project-structure/#public).

## WASM

```js
// Importa e inicializa el archivo WASM solicitado
const wasm = await WebAssembly.instantiateStreaming(fetch('/example.wasm'));
```

Astro es compatible con la carga de archivos WASM directamente en tu aplicación mediante la API [`WebAssembly`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly) del navegador.

## Módulos integrados de Node

Recomendamos a los usuarios de Astro que eviten usar los módulos integrados de Node.js (`fs`, `path`, etc.) siempre que sea posible. Astro pretende ser compatible con múltiples motores de ejecución de JavaScript en el futuro. Esto incluye [Deno](https://deno.land/) y [Cloudflare Workers](https://workers.cloudflare.com/) que no son compatibles con los módulos integrados de Node como `fs`.

El objetivo de Astro es proporcionar alternativas a los módulos integrados comunes de Node.js. Sin embargo, estas alternativas aún no existen. Si _realmente_ necesitas utilizar estos módulos, no queremos detenerlo. Astro es compatible con los módulos integrados de Node.js utilizando el nuevo prefijo `node:`. Si por ejemplo quieres leer un archivo, puedes hacerlo así:

```astro
---
// Ejemplo: importa el módulo "fs/promises" de Node.js

import fs from 'node:fs/promises';

const url = new URL('../../package.json', import.meta.url);
const json = await fs.readFile(url, 'utf-8');
const data = JSON.parse(json);
---

<span>Version: {data.version}</span>
```
