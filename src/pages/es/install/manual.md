---
title: Instala Astro manualmente
description: Cómo instalar Astro manualmente with NPM, PNPM, or Yarn.
layout: ~/layouts/MainLayout.astro
setup: import InstallGuideTabGroup from '~/components/TabGroup/InstallGuideTabGroup.astro';
i18nReady: true
---

¿Listo para instalar Astro? Sigue nuestra guía de instalación automática o
manual para empezar.

#### Prerequisitos

- **Node.js** - `14.15.0`, `v16.0.0`, o mayor.
- **Editor de código** - Recomendamos [VS Code](https://code.visualstudio.com/)
  con nuestra
  [extensión official](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).
- **Terminal** - Astro es usado a través de la interfaz de línea de comandos
  (CLI).

<InstallGuideTabGroup />

#### Instalación

Si prefiere no usar el asistente de instalación automático `create-astro`, puede
instalar y configurar Astro manualmente siguiendo las instrucciones a
continuación:

## 1. Crea una carpeta donde guardar todos los archivos

Crea una carpeta vacía con el nombre de tu proyecto y navege a ella.

```bash
mkdir my-astro-project
cd my-astro-project
```

Ya en la carpeta, cree un archivo `package.json` para tu proyecto. Esto lo
ayudará a gestionar las dependencias del proyecto, incluyendo Astro. Si no estás
familiarizado con este formato de archivo, ejecuta el siguiente comando para
crear uno.

```bash
npm init --yes
```

## 2. Instale Astro

Primero, instale Astro dentro de su proyecto.

```bash
npm install astro
```

A continuación, reemplaze los scripts creados por defecto en el `package.json`
por los siguientes:

```diff
  "scripts": \{
-    "test": "echo \"Error: no test specified\" && exit 1"
+    "dev": "astro dev",
+    "start": "astro dev",
+    "build": "astro build",
+    "preview": "astro preview"
  },
```

Los scripts serán usados más adelante en la guía para iniciar y ejecutar
diferentes comandos en Astro.

## 3. Cree su primera página

En su editor de código, cree un nuevo archivo en el directorio
`src/pages/index.astro`. Esta será la primera página de su proyecto de Astro.

Copie y pegue el siguiente fragmento de código (incluyendo `---` guiones) en su
nuevo archivo:

```astro
---
// Welcome to Astro! Everything between these triple-dash code fences
// is your "component front matter". It never runs in the browser.
console.log('This runs in your terminal, not the browser!');
---
<!-- Below is your "component template." It's just HTML, but with
     some magic sprinkled in to help you build great templates. -->
<html>
  <body>
    <h1>Hello, World!</h1>
  </body>
</html>
<style>
  h1 {
    color: orange;
  }
</style>
```

## 4. Cree su primer archivo estático

Crea una carpeta `public` en la raíz de tu proyecto para almacenar todos los
archivos estáticos. Asto incluirá estos archivos en tu compilación final, así
podrán ser seguramente referenciados desde tu código.

Crea un nuevo archivo en el directorio `public/robots.txt`. `robots.txt` es un
archivo que informa a los robots de búsqueda como Google cómo indexar su página
web.

Copie y pegue el siguiente fragmento de código:

```
# Example: Allow all bots to scan and index your site. 
# Full syntax: https://developers.google.com/search/docs/advanced/robots/create-robots-txt
User-agent: *
Allow: /
```

## 5. Cree astro.config.mjs

Astro es configurado usando el archivo `astro.config.mjs`. Este archivo es
opcional si no necesita configurar Astro, pero recomendamos crear uno.

Crea un archivo `astro.config.mjs` en la raíz de tu proyecto. Copie y pegue el
siguiente código:

```
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({});
```

Si desea incluir
[componentes de interfaces de usuario](/es/core-concepts/framework-components/)
como React, Svelte, etc; o usar otras herramientas de desarrollo como Tailwind o
Partytown en tu proyecto, lea nuestra
[guía de integraciones](/es/guides/integrations-guide).

📚 Lea nuestra guía de
[configuración de API](/es/reference/configuration-reference/) para más
información.

## 6. Siguientes pasos

Si seguiste las instrucciones anteriores, tu proyecto debe lucir así:

```
├── node_modules/
├── src/
│   └── pages/
│   │   └── index.astro
├── public/
│   ├── robots.txt
├── astro.config.mjs
├── package.json
└── package-lock.json (or: yarn.lock, pnpm-lock.yaml, etc.)
```

¡Felicidades, estás listo para empezar a usar Astro!

Si seguiste todo el proceso, puedes saltar directamente a
[Paso 3: Arranque Astro](/es/install/auto#3-arranque-astro-) para continuar y
aprender cómo ejecutar Astro por primera vez.
