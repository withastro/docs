---
layout: ~/layouts/MainLayout.astro
title: Usando variables de entorno
description: Aprende a usar variables de entorno en un proyecto de Astro.
i18nReady: true
---

Astro usa Vite para las variables de entorno y le permite [usar cualquiera de sus métodos](https://vitejs.dev/guide/env-and-mode.html) para obtener y establecer variables de entorno.

Tenga en cuenta que _todas_ las variables de entorno estarán disponibles en el servidor, mientras que solo las variables de entorno con el prefijo `PUBLIC_` estarán disponibles en el cliente por motivos de seguridad.

Consulte el [ejemplo de variables de entorno](https://github.com/withastro/astro/tree/main/examples/env-vars) para aprender las prácticas recomendadas.

```ini
CLAVE_SECRETA=clave123
PUBLIC_VARIABLE=clave_pública
```
<p>
En este ejemplo, `PUBLIC_VARIABLE` (accesible mediante `import.meta.env.PUBLIC_VARIABLE`) estará disponible tanto en el servidor como el cliente, mientras que `CLAVE_SECRETA` (accesible mediante `import.meta.env.CLAVE_SECRETA`) estará disponible solo en el servidor.
</p>

## Variables de entorno predeterminadas

Astro incluye algunas variables de entorno predeterminadas:
<ul>

<li> `import.meta.env.MODE` (`development` | `production`): el modo en el que se ejecuta su proyecto. Esto es `development</code > al ejecutar <code>astro dev` y `production` al ejecutar `astro build`.</li>

<li> `import.meta.env.BASE_URL` (`string`): la URL base desde la que se sirve su proyecto. Esto está determinado por la opción de configuración <a href="/es/reference/configuration-reference/#base">`base`</a>.</li>

<li> `import.meta.env.PROD` (`boolean`): es verdadero si su proyecto se está ejecutando en modo producción. </li>

<li> `import.meta.env.DEV` (`boolean`): es verdadero si su proyecto se está ejecutando en modo desarrollo (siempre lo contrario a `import.meta.env.PROD`).</li>

<li>`import.meta.env.SITE` (`string`): <a href="/es/reference/configuration-reference/#site">la opción de configuración `site`</a> especificada en el `astro.config` de su proyecto.</li>
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
.env.local          # cargado en todos los casos, ignorado por git
.env.[mode]         # solo se carga en el modo especificado
.env.[mode].local   # solo se carga en el modo especificado, ignorado por git
```

## Obteniendo variables de entorno

<p>
En lugar de usar `process.env`, Vite usa `import.meta.env`, que usa la función `import.meta` agregada en ES2020.
</p>

:::tip[¡No se preocupe por la compatibilidad con el navegador!]
Vite reemplazará todas las menciones de `import.meta.env` con valores estáticos.
:::

<p>
Por ejemplo, use `import.meta.env.PUBLIC_POKEAPI` para obtener la variable de entorno `PUBLIC_POKEAPI`.
</p>

```js
// Cuando import.meta.env.SSR === true
const data = await db(import.meta.env.DB_PASSWORD);

// Cuando import.meta.env.SSR === false
const data = fetch(`${import.meta.env.PUBLIC_POKEAPI}/pokemon/squirtle`);
```

:::caution
Debido a que Vite reemplaza estáticamente a `import.meta.env`, no puedes acceder a él con claves dinámicas como `import.meta.env[key]`.
:::

## IntelliSense para TypeScript

<p>

De forma predeterminada, Vite proporciona una definición de tipos para `import.meta.env` en `vite/client.d.ts`.
</p>

Si bien puedes definir más variables de entorno personalizadas en los archivos `.env.[mode]`, es posible que desees obtener TypeScript IntelliSense para las variables de entorno definidas por el usuario que tienen el prefijo `PUBLIC_`.

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
