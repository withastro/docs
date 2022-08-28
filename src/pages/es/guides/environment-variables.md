---
layout: ~/layouts/MainLayout.astro
title: Usando variables de entorno
description: Aprende a usar variables de entorno en un proyecto de Astro.
i18nReady: true
---

Astro usa Vite para las variables de entorno y te permite [usar cualquiera de sus métodos](https://vitejs.dev/guide/env-and-mode.html) para obtener y establecer variables de entorno.

Ten en cuenta que _todas_ las variables de entorno estarán disponibles en el servidor, mientras que solo las variables de entorno con el prefijo `PUBLIC_` estarán disponibles en el cliente por motivos de seguridad.

Consulta el [ejemplo de variables de entorno](https://github.com/withastro/astro/tree/main/examples/env-vars) oficial para aprender las prácticas recomendadas.

```ini title=".env"
SECRET_PASSWORD=password123
PUBLIC_ANYBODY=there
```

En este ejemplo, `PUBLIC_ANYBODY` (accesible mediante `import.meta.env.PUBLIC_ANYBODY`) estará disponible tanto en el servidor como el cliente, mientras que `SECRET_PASSWORD` (accesible mediante `import.meta.env.SECRET_PASSWORD`) estará disponible solo en el servidor.

## Variables de entorno predeterminadas

Astro incluye algunas variables de entorno predeterminadas:

- `import.meta.env.MODE` (`development` | `production`): el modo en el que se ejecuta tu proyecto. Esto es `development` al ejecutar `astro dev` y `production` al ejecutar `astro build`.
- `import.meta.env.BASE_URL` (`string`): la URL base desde la que se sirve tu proyecto. Esto está determinado por la opción de configuración [`base`](/es/reference/configuration-reference/#base).
- `import.meta.env.PROD` (`boolean`): es verdadero si tu proyecto se está ejecutando en modo producción.
- `import.meta.env.DEV` (`boolean`): es verdadero si tu proyecto se está ejecutando en modo desarrollo (siempre lo contrario a `import.meta.env.PROD`).
- `import.meta.env.SITE` (`string`): [la opción de configuración `site`](/es/reference/configuration-reference/#site) especificada en el archivo `astro.config` de tu proyecto.

## Configurando variables de entorno

Las variables de entorno se pueden cargar desde los archivos `.env` en la carpeta raíz de su proyecto.

También puedes adjuntar un modo (ya sea `production` o `development`) al nombre del archivo, como `.env.production` o `.env.development`, lo que hace que las variables de entorno solo tengan efecto en ese modo.

Simplemente crea un archivo `.env` en la carpeta raíz de su proyecto y agrega algunas variables.

```ini title=".env"
# ¡Esto solo estará disponible cuando se ejecute en el servidor!
DB_PASSWORD="foobar"
# ¡Estará disponible en todas partes!
PUBLIC_POKEAPI="https://pokeapi.co/api/v2"
```

```yaml
# Nombres de archivo admitidos:
.env                # cargado en todos los casos
.env.local          # cargado en todos los casos, ignorado por git
.env.[mode]         # solo se carga en el modo especificado
.env.[mode].local   # solo se carga en el modo especificado, ignorado por git
```

## Obteniendo variables de entorno

En lugar de usar `process.env`, Vite usa `import.meta.env`, que usa la función `import.meta` agregada en ES2020.

:::tip[¡No te preocupes por la compatibilidad con el navegador!]
Vite reemplazará todas las menciones de `import.meta.env` con valores estáticos.
:::

Por ejemplo, usa `import.meta.env.PUBLIC_POKEAPI` para obtener la variable de entorno `PUBLIC_POKEAPI`.

```js /(?<!//.*)import.meta.env.[A-Z_]+/
// Cuando import.meta.env.SSR === true
const data = await db(import.meta.env.DB_PASSWORD);

// Cuando import.meta.env.SSR === false
const data = fetch(`${import.meta.env.PUBLIC_POKEAPI}/pokemon/squirtle`);
```

:::caution
Debido a que Vite estáticamente reemplaza `import.meta.env`, no puedes acceder a él con claves dinámicas como `import.meta.env[key]`.
:::

## IntelliSense para TypeScript

De forma predeterminada, Vite proporciona una definición de tipos para `import.meta.env` en `vite/client.d.ts`.

Si bien puedes definir más variables de entorno personalizadas en los archivos `.env.[mode]`, es posible que desees obtener TypeScript IntelliSense para las variables de entorno definidas por el usuario que tienen el prefijo `PUBLIC_`.

Para lograr esto, puedes crear un archivo `env.d.ts` en `src/` y configurar `ImportMetaEnv` así:

```ts title="src/env.d.ts"
interface ImportMetaEnv {
  readonly DB_PASSWORD: string;
  readonly PUBLIC_POKEAPI: string;
  // más variables de entorno...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```
