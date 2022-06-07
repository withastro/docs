---
layout: ~/layouts/MainLayout.astro
title: Usando variables de entorno
description: Aprende a usar variables de entorno en un proyecto de Astro.
i18nReady: true
setup: |
  import ImportMetaEnv from '~/components/ImportMetaEnv.astro';
---

Astro usa Vite para las variables de entorno y le permite [usar cualquiera de sus métodos](https://vitejs.dev/guide/env-and-mode.html) para obtener y establecer variables de entorno.

Tenga en cuenta que _todas_ las variables de entorno estarán disponibles en el servidor, mientras que solo las variables de entorno con el prefijo `PUBLIC_` estarán disponibles en el cliente por motivos de seguridad.

Consulte el [ejemplo de variables de entorno](https://github.com/withastro/astro/tree/main/examples/env-vars) para aprender las prácticas recomendadas.

```ini
CLAVE_SECRETA=clave123
PUBLIC_VARIABLE=clave_pública
```
<p>
En este ejemplo, <code>PUBLIC_VARIABLE</code> (accesible mediante <ImportMetaEnv path=".PUBLIC_VARIABLE" />) estará disponible tanto en el  servidor como el cliente, mientras que <code>CLAVE_SECRETA</code> (accesible mediante <ImportMetaEnv path=".CLAVE_SECRETA" />) estará disponible solo en el servidor.
</p>

## Variables de entorno predeterminadas

Astro incluye algunas variables de entorno predeterminadas:
<ul>

<li> <ImportMetaEnv path=".MODE" /> (<code>development</code> | <code>production</code>): el modo en el que se ejecuta su proyecto. Esto es <code>development</code > al ejecutar <code>astro dev</code> y <code>production</code> al ejecutar <code>astro build</code>.</li>

<li> <ImportMetaEnv path=".BASE_URL" /> (<code>string</code>): la URL base desde la que se sirve su proyecto. Esto está determinado por la opción de configuración <a href="/en/reference/configuration-reference/#base"><code>base</code></a>.</li>

<li> <ImportMetaEnv path=".PROD" /> (<code>boolean</code>): es verdadero si su proyecto se está ejecutando en modo producción. </li>

<li> <ImportMetaEnv path=".DEV" /> (<code>booleano</code>): es verdadero si su proyecto se está ejecutando en modo desarrollo (siempre lo contrario a <ImportMetaEnv path=".PROD" />).</li>

<li><ImportMetaEnv path=".SITE" /> (<code>string</code>): <a href="/en/reference/configuration-reference/#site">la opción de configuración <code>site</code ></a> especificada en el <code>astro.config</code> de su proyecto.</li>
</ul>

## Configurando variables de entorno

Las variables de entorno se pueden cargar desde los archivos `.env` en la carpeta raíz de su proyecto.

También puedes adjuntar un modo (ya sea `production` or `development`) al nombre del archivo, como `.env.production` o `.env.development`, lo que hace que las variables de entorno solo tengan efecto en ese modo.

Simplemente cree un archivo `.env` en la carpeta raíz de su proyecto y agregue algunas variables.

```bash
# .env
# ¡Esto solo estará disponible en el servidor!
DB_PASSWORD="foobar"
# ¡Esto estará disponible en todas partes!
PUBLIC_POKEAPI="https://pokeapi.co/api/v2"
```

```ini
.env                # cargado en todos los casos
.env.local          # Cargado en todos los casos, ignorado por git
.env.[mode]         # solo se carga en el modo especificado
.env.[mode].local   # solo se carga en el modo especificado, ignorado por git
```

## Obteniendo variables de entorno

<p>

En lugar de usar `process.env`, Vite usa <ImportMetaEnv />, que usa la función `import.meta` agregada en ES2020.
</p>
<p>

Por ejemplo, use <ImportMetaEnv path=".PUBLIC_POKEAPI" /> para obtener la variable de entorno `PUBLIC_POKEAPI`.
</p>

```js
// Cuando import.meta.env.SSR === true
const data = await db(import.meta.env.DB_PASSWORD);

// Cuando import.meta.env.SSR === false
const data = fetch(`${import.meta.env.PUBLIC_POKEAPI}/pokemon/squirtle`);
```

_¡No se preocupe por la compatibilidad con el navegador! Vite reemplazará todas las menciones de <ImportMetaEnv /> con valores estáticos._

> ⚠️ADVERTENCIA⚠️:
> Debido a que Vite reemplaza estáticamente a <ImportMetaEnv />, no puedes acceder a él con claves dinámicas como <ImportMetaEnv path="[key]" />



## IntelliSense para TypeScript

<p>

De forma predeterminada, Vite proporciona una definición de tipos para <ImportMetaEnv /> en `vite/client.d.ts`.
</p>

Si bien puedes definir más variables de entorno personalizadas en los archivos `.env.[mode]`, es posible que desee obtener TypeScript IntelliSense para las variables de entorno definidas por el usuario que tienen el prefijo `PUBLIC_`.

Para lograr esto, puedes crear un archivo `env.d.ts` en `src/` y configurar `ImportMetaEnv` así:

```ts
interface ImportMetaEnv {
  readonly DB_PASSWORD: string;
  readonly PUBLIC_POKEAPI: string;
  // más variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```
