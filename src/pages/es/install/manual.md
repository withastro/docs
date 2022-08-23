---
title: Instala Astro manualmente
description: Cómo instalar Astro manualmente con NPM, PNPM, o Yarn.
layout: ~/layouts/MainLayout.astro
setup: import InstallGuideTabGroup from '~/components/TabGroup/InstallGuideTabGroup.astro';
i18nReady: true
---
¿Listo para instalar Astro? Sigue nuestra guía de instalación automática o manual para empezar.

#### Prerrequisitos

- **Node.js** - `14.18.0`, `v16.12.0`, o mayor.
- **Editor de código** - Recomendamos [VS Code](https://code.visualstudio.com/) con nuestra [extensión oficial](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).
- **Terminal** - Astro es usado a través de la interfaz de línea de comandos (CLI).

<InstallGuideTabGroup />

#### Instalación

Si prefieres no usar el asistente de instalación automático `create-astro`, puedes instalar y configurar Astro manualmente siguiendo las instrucciones a continuación:

## 1. Crea una carpeta donde guardar todos los archivos

Crea una carpeta vacía con el nombre de tu proyecto y navega hacia ella.

```bash
mkdir my-astro-project
cd my-astro-project
```

Ya en la carpeta, crea un archivo `package.json` para tu proyecto. Esto te ayudará a gestionar las dependencias del proyecto, incluyendo Astro. Si no estás familiarizado con este formato de archivo, ejecuta el siguiente comando para crear uno.

```bash
npm init --yes
```


## 2. Instala Astro

Primero, instala Astro dentro de tu proyecto.

```bash
npm install astro
```

A continuación, reemplaza los scripts creados por defecto en el `package.json` por los siguientes:

```json title="package.json" del={2} ins={3-6}
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
```

Los scripts serán usados más adelante en la guía para iniciar y ejecutar diferentes comandos en Astro.

## 3. Crea tu primer página

En tu editor de código, crea un nuevo archivo en el directorio `src/pages/index.astro`. Esta será la primera página de tu proyecto de Astro.

Copia y pega el siguiente fragmento de código (incluyendo `---` guiones) en tu nuevo archivo:

```astro title="src/pages/index.astro"
---
// ¡Bienvenido a Astro! Todo entre los guiones triples son los 
// "metadatos de su componente". Nunca corre en el navegador.
console.log('¡Esto corre en tu terminal y no en el navegador!');
---
<!-- El código de abajo es "la plantilla de su componente". Es solo HTML 
     con un poco de magia que te ayudará a crear la plantila del componente. -->
<html>
  <body>
    <h1>¡Hola Mundo!</h1>
  </body>
</html>
<style>
  h1 {
    color: orange;
  }
</style>
```

## 4. Crea tu primer archivo estático

Crea una carpeta `public` en la raíz de tu proyecto para almacenar todos los archivos estáticos. Astro incluirá estos archivos en la compilación final, así podrán ser seguramente referenciados desde tu código.

Crea un nuevo archivo en el directorio `public/robots.txt`. `robots.txt` es un archivo que informa a los robots de búsqueda como Google sobre cómo indexar tu página web.

Copia y pega el siguiente fragmento de código:

```diff title="public/robots.txt"
# Ejemplo: Permitir a todos los bots de búsqueda escanear e indexar el sitio web. 
# Sintaxis completa: https://developers.google.com/search/docs/advanced/robots/create-robots-txt
User-agent: *
Allow: /
```

## 5. Crea astro.config.mjs

Astro es configurado usando el archivo `astro.config.mjs`. Este archivo es opcional si no necesitas configurar Astro, pero recomendamos crear uno.

Crea un archivo `astro.config.mjs` en la raíz del proyecto. Copia y pega el siguiente código:

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({});
```

Si deseas incluir [componentes de frameworks](/es/core-concepts/framework-components/) como React, Svelte, etc; o usar otras herramientas de desarrollo como Tailwind o Partytown en tu proyecto, lee nuestra [guía de integraciones](/es/guides/integrations-guide/).

📚 Lee nuestra guía de [configuración de API](/es/reference/configuration-reference/) para más información.

## 6. Siguientes pasos

Si has seguido las instrucciones anteriores, el proyecto debe lucir así:

```
├── node_modules/
├── src/
│   └── pages/
│   │   └── index.astro
├── public/
│   ├── robots.txt
├── astro.config.mjs
├── package.json
└── package-lock.json (o: yarn.lock, pnpm-lock.yaml, etc.)
```

¡Felicidades, estás listo para empezar a usar Astro!

Si has seguido todo el proceso, puedes ir directamente a [Paso 2: Inicia Astro](/es/install/auto/#2-inicia-astro-) para continuar y aprender cómo ejecutar Astro por primera vez.
