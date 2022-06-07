---
layout: ~/layouts/MainLayout.astro
title: Recursos estáticos
description: Aprende a importar diferentes tipos de contenido con Astro.
i18nReady: true
---

Astro es compatible con la mayoría de recursos estáticos sin necesidad de configuración. Puedes usar `import` en cualquier lugar de su proyecto JavaScript (incluido el script de frontmatter de Astro) y Astro incluirá una copia optimizada de ese recurso estático en su compilación final. `@import` también es compatible dentro de las etiquetas CSS y `<style>`.

## Tipos de archivos compatibles

Los siguientes tipos de archivos son compatibles de forma inmediata en Astro:

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

Si no ve el tipo de archivo que está buscando, consulte nuestra [biblioteca de integraciones](https://astro.build/integrations/). Puedes ampliar Astro para agregar compatibilidad para diferentes tipos de archivos, como componentes Svelte y Vue.

Esta guía detalla cómo Astro compila diferentes tipos de archivos y cómo importarlos correctamente.

Recuerda que también puedes colocar cualquier recurso estático en la carpeta [`public/`](/es/core-concepts/project-structure/#public) de su proyecto, y Astro los copiará directamente en la compilación final. Los archivos dentro de `public/` no son compilados ni agrupados por Astro, lo que significa que cualquier tipo de archivo es compatible. Puedes hacer referencia a un archivo en `public/` mediante una ruta URL directamente desde el HTML.

## JavaScript

```js
import { getUser } from './user.js';
```

Archivos JavaScript se pueden importar utilizando la sintaxis normal de `import` y `export` de ESM. Esto funciona como se espera, de acuerdo a Node.js y el comportamiento del navegador.

## TypeScript

```js
import { getUser } from './user.ts';
import type { UserType } from './user.ts';
```

Astro incluye compatibilidad con [TypeScript](https://www.typescriptlang.org/). Puedes importar archivos `.ts` y `.tsx` directamente a su proyecto de Astro, e incluso escribir código TypeScript directamente dentro de sus [componentes de Astro](/es/core-concepts/astro-components/#script-del-componente) .

**Astro no realiza ninguna verificación de tipos por sí mismo.** La verificación de tipos debe realizarse fuera de Astro, ya sea por su IDE o mediante un script separado. La [extensión de Astro VSCode](/es/editor-setup/) proporciona sugerencias y errores de TypeScript automáticamente en sus archivos abiertos.

📚 Lea más sobre la compatibilidad de [TypeScript en Astro.](/es/guides/typescript/)

## JSX / TSX

```js
import { MyComponent } from './MyComponent.jsx';
```

Astro es compatible con archivos JSX (`*.jsx` y `*.tsx`) en su proyecto. La sintaxis JSX se transpila automáticamente a JavaScript.

Si bien Astro entiende la sintaxis de JSX desde el primer momento, deberás incluir una integración de framework para renderizar correctamente frameworks como React, Preact y Solid. Consulte nuestra [guía de integraciones](/es/guides/integrations-guide/) para obtener más información.

**Nota: Astro no es compatible con JSX en archivos `.js`/`.ts`.** JSX solo se manejará dentro de archivos que terminen con las extensiones `.jsx` y `.tsx`.

## Paquetes NPM

```js
// Devuelve los paquetes NPM de React y React-DOM
import React from 'react';
import ReactDOM from 'react-dom';
```

Astro le permite importar paquetes npm directamente en el navegador. Incluso si un paquete se publicó con un formato antiguo, Astro lo convertirá a ESM antes de enviarlo al navegador.

## JSON

```js
// Carga el JSON a través de un import
import json from './data.json';
```

Astro es compatible con la importación de archivos JSON directamente a su aplicación. Los archivos importados devuelven el objeto JSON completo como una importación predeterminada.

## CSS

```js
// Carga e inyecta 'style.css' en la página
import './style.css';
```

Astro admite la importación de archivos CSS directamente a su aplicación. Los estilos importados no exponen exportaciones, pero importar uno agregará automáticamente esos estilos a la página. Esto funciona para todos los archivos CSS de forma predeterminada y es compatible con lenguajes de compilación a CSS como Sass & Less a través de plugins.

Si prefieres no escribir CSS, Astro también es compatible con todas las bibliotecas CSS-in-JS populares (como styled-components) para estilar su proyecto.

## CSS Modules

```jsx
// 1. Convierte las clases en './style.module.css' en valores únicos con 
//    alcance solo para este componente.
// 2. Devuelve un objeto que mapea los nombres de clase originales a sus 
//    valores finales, con alcance solo para este componente.
import styles from './style.module.css';

// Este ejemplo usa JSX, pero puedes usar módulos CSS con cualquier framework.
return <div className={styles.error}>Your Error Message</div>;
```

Astro es compatible con módulos CSS utilizando la convención `[nombre].module.css`. Como cualquier archivo CSS, importar uno aplicará automáticamente el CSS a la página. Sin embargo, los módulos CSS exportan un objeto `styles` especial que asigna sus nombres de clase originales a identificadores únicos.

Los módulos CSS lo ayudan a imponer el alcance y el aislamiento de los estilos en la interfaz con nombres de clase únicos generados para sus hojas de estilo.

## Other Assets

```jsx
import imgReference from './image.png'; // img === '/src/image.png'
import svgReference from './image.svg'; // svg === '/src/image.svg'
import txtReference from './words.txt'; // txt === '/src/words.txt'

// Este ejemplo usa JSX, pero puedes usar módulos CSS con cualquier framework.
<img src={imgReference} />;
```

Todos los demás archivos que no se mencionan explícitamente anteriormente se pueden importar a través de ESM `import` y devolverán una URL con referencia al archivo creado. Esto puede ser útil para hacer referencia a archivos que no son JS por URL, por ejemplo crear un elemento `img` con un atributo `src` que apunte a esa imagen.

También puede ser útil colocar imágenes en la carpeta `public/` como se explica en la página de [estructura de proyecto](/es/core-concepts/project-structure/#public).

## WASM

```js
// Carga e inicializa el archivo WASM solicitado
const wasm = await WebAssembly.instantiateStreaming(fetch('/example.wasm'));
```

Astro es compatible con la carga de archivos WASM directamente en su aplicación mediante la API [`WebAssembly`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly) del navegador.

## Paquetes integrados en Node

Recomendamos a los usuarios de Astro que eviten las funciones integradas de Node.js (`fs`, `path`, etc.) siempre que sea posible. Astro pretende ser compatible con múltiples motores de ejecución de JavaScript en el futuro. Esto incluye [Deno](https://deno.land/) y [Cloudflare Workers](https://workers.cloudflare.com/) que no son compatibles con los módulos integrados de Node como `fs`

Nuestro objetivo es proporcionar alternativas de Astro a los paquetes integrados comunes de Node.js. Sin embargo, tales alternativas no existen hoy en día. Entonces, si _realmente_ necesita usar estos módulos integrados, no queremos detenerlo. Astro es compatible con las funciones integradas de Node.js utilizando el prefijo `node:`. Si desea leer un archivo, por ejemplo, puede hacerlo así:

```astro
---
// Ejemplo: importar el "fs/promises" intergrado de Node.js

import fs from 'node:fs/promises';

const url = new URL('../../package.json', import.meta.url);
const json = await fs.readFile(url, 'utf-8');
const data = JSON.parse(json);
---

<span>Version: {data.version}</span>
```
