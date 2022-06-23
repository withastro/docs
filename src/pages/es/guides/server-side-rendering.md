---
layout: ~/layouts/MainLayout.astro
title: Renderizado en el servidor
i18nReady: true
---

**Renderizado en el servidor**, también conocido como SSR (server side rendering), se puede habilitar en Astro. Cuando habilita SSR puedes:

- Implementar sesiones para iniciar sesión en su aplicación.
- Renderizar datos desde una llamada de API dinámicamente con `fetch`.
- Desplegar su sitio en un servidor usando un *adaptador*.

:::note
SSR es nuevo en Astro y se producirán cambios antes del lanzamiento estable de v1.0. Manténgase actualizado con los cambios de API aquí.
:::

## Habilitando SSR en su proyecto

Para habilitar SSR se necesita usar un adaptador. Esto se debe a que SSR requiere un servidor y un _entorno de ejecución_; el entorno que ejecuta su código en el servidor. Este entorno de ejecución proporciona una API que su código en el servidor puede usar.

La instalación de un adaptador le da a Astro acceso a la API correspondiente y le permite generar un script que ejecuta su proyecto en ese tipo de servidor.

Los siguientes adaptadores están disponibles hoy y habrán más en el futuro:

- [Cloudflare](https://github.com/withastro/astro/tree/main/packages/integrations/cloudflare)
- [Deno](https://github.com/withastro/astro/tree/main/packages/integrations/deno)
- [Netlify](https://github.com/withastro/astro/tree/main/packages/integrations/netlify)
- [Node.js](https://github.com/withastro/astro/tree/main/packages/integrations/node)
- [Vercel](https://github.com/withastro/astro/tree/main/packages/integrations/vercel)

Si no usas SSR, no necesitas un adaptador, incluso si planea desplegar en una de estas plataformas.

En este ejemplo, usaremos `@astrojs/netlify` para construir con Netlify. Primero instale el adaptador:

```bash
npm install --save-dev @astrojs/netlify
```

Una vez que se hayan instalado sus paquetes, agregue dos nuevas líneas a su archivo de configuración de Astro `astro.config.mjs`.

```diff
  // astro.config.mjs
  import { defineConfig } from 'astro/config';
+ import netlify from '@astrojs/netlify/functions';

  export default defineConfig({
+   adapter: netlify(),
  });
```

Con Netlify puedes desplegar tu proyecto desde git, la web o desde la  CLI. Aquí usaremos la [CLI de Netlify](https://docs.netlify.com/cli/get-started/) para desplegar.

Primero construye tu proyecto como de costumbre:

```bash
npm run build
```

Esto crea `netlify/functions/` que contiene su código SSR. Al desplegar su proyecto, se implementará esta función que contiene todas sus páginas de Astro listas para ser renderizadas.

```bash
netlify deploy
```

Una vez completado el despliegue, debería proporcionarle una URL de vista previa para ver su proyecto.

## Características

Astro seguirá siendo un generador de sitios estáticos de forma predeterminada, pero una vez que habilite un adaptador de renderizado en el servidor, algunas características nuevas estarán disponibles para usted.

### `Astro.request.headers`

Los encabezados de la solicitud están disponibles en `Astro.request.headers`. El objecto [headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers), es un objeto similar a un map donde puedes recuperar encabezados como la cookie.

```astro
---
const cookie = Astro.request.headers.get('cookie');
// ...
---
<html>
  <!-- Maquetado aquí... -->
</html>
```

### `Astro.redirect`

Este método te permite redirigir a otra página. Puedes hacer esto después de verificar si el usuario ha iniciado sesión obteniendo la sesión de una cookie.

```astro
---
import { isLoggedIn } from '../utils';

const cookie = Astro.request.headers.get('cookie');

// si el usuario no ha iniciado sesión, rediríjalo a la página de inicio de sesión.
if(!isLoggedIn(cookie)) {
  return Astro.redirect('/login');
}
---
<html>
  <!-- Maquetado aquí... -->
</html>
```

### `Response`

También puedes devolver una [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) desde cualquier página. Puedes hacer esto para devolver un 404 en una página dinámica luego de buscar y no encontrar la id en la base de datos.

__[id].astro__

```astro
---
import { getProduct } from '../api';

const product = await getProduct(Astro.params.id);

// Producto no encontrado
if(!product) {
  return new Response(null, {
    status: 404,
    statusText: 'Not found'
  });
}
---
<html>
  <!-- Maquetado aquí... -->
</html>
```

#### Rutas API

Una ruta API es un archivo `.js` o `.ts` dentro de la carpeta `src/pages/` que recibe una [Request](https://developer.mozilla.org/en-US/docs/Web/API/Solicitud) y devuelve una [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response).

__[id].js__
```js
import { getProduct } from '../db';

export async function get({ params }) {
  const { id } = params;
  const product = await getProduct(id);

  if(!product) {
    return new Response(null, {
      status: 404,
      statusText: 'Not found'
    });
  }

  return new Response(JSON.stringify(product), {
    status: 200
  });
}
```
