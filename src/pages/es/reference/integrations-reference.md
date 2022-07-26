---
layout: ~/layouts/MainLayout.astro
title: APIs de integraciones de Astro
i18nReady: true
---

Las **integraciones de Astro** agrega nuevas funcionalidades y comportamientos para tu proyecto con unas pocas líneas de código.

Esta página de referencia es para cualquiera que escriba una integración. Para aprender a usar una integración en su proyecto, consulte nuestra guía de [uso de integraciones](/es/guides/integrations-guide/).

## Ejemplos

Las integraciones oficiales de Astro pueden actuar como referencia para ti a medida que avanzas para crear tus propias integraciones.

- **Renderizadores:** [`lit`](https://github.com/withastro/astro/blob/main/packages/integrations/lit/src/index.ts), [`svelte`](https://github.com/withastro/astro/blob/main/packages/integrations/svelte/src/index.ts), [`react`](https://github.com/withastro/astro/blob/main/packages/integrations/react/src/index.ts), [`preact`](https://github.com/withastro/astro/blob/main/packages/integrations/preact/src/index.ts), [`vue`](https://github.com/withastro/astro/blob/main/packages/integrations/vue/src/index.ts), [`solid`](https://github.com/withastro/astro/blob/main/packages/integrations/solid/src/index.ts)
- **Librerías:** [`tailwind`](https://github.com/withastro/astro/blob/main/packages/integrations/tailwind/src/index.ts), [`partytown`](https://github.com/withastro/astro/blob/main/packages/integrations/partytown/src/index.ts)
- **Funcionalidades:** [`sitemap`](https://github.com/withastro/astro/blob/main/packages/integrations/sitemap/src/index.ts)

## Referencia rápida del API

```ts
interface AstroIntegration {
    name: string;
    hooks: {
        'astro:config:setup'?: (options: {
            config: AstroConfig;
            command: 'dev' | 'build';
            updateConfig: (newConfig: Record<string, any>) => void;
            addRenderer: (renderer: AstroRenderer) => void;
            injectScript: (stage: InjectedScriptStage, content: string) => void;
            injectRoute: ({ pattern: string, entryPoint: string }) => void;
        }) => void;
        'astro:config:done'?: (options: { config: AstroConfig }) => void | Promise<void>;
        'astro:server:setup'?: (options: { server: vite.ViteDevServer }) => void | Promise<void>;
        'astro:server:start'?: (options: { address: AddressInfo }) => void | Promise<void>;
        'astro:server:done'?: () => void | Promise<void>;
        'astro:build:start'?: (options: { buildConfig: BuildConfig }) => void | Promise<void>;
        'astro:build:setup'?: (options: {
          vite: ViteConfigWithSSR;
          pages: Map<string, PageBuildData>;
          target: 'client' | 'server';
        }) => void | Promise<void>;
        'astro:build:ssr'?: (options: { manifest: SerializedSSRManifest }) => void | Promise<void>;
        'astro:build:done'?: (options: { pages: { pathname: string }[]; dir: URL; routes: RouteData[] }) => void | Promise<void>;
    };
}
```

## Hooks

### `astro:config:setup`

**Siguiente hook:** [`astro:config:done`](#astroconfigdone)

**Cuando:** En la inicialización, antes de que [Vite](https://vitejs.dev/config/) o [Astro config](/es/reference/configuration-reference/) se hayan resuelto.

**Por qué:** Para ampliar la configuración del proyecto. Esto incluye actualizar [Astro config](/es/reference/configuration-reference/), aplicar [plugins de Vite](https://vitejs.dev/guide/api-plugin.html), agregar renderizadores de componentes e inyectar scripts en la página.

```js
'astro:config:setup'?: (options: {
    config: AstroConfig;
    command: 'dev' | 'build';
    updateConfig: (newConfig: Record<string, any>) => void;
    addRenderer: (renderer: AstroRenderer) => void;
    injectScript: (stage: InjectedScriptStage, content: string) => void;
    injectRoute: ({ pattern: string, entryPoint: string }) => void;
}) => void;
```

#### Opción `config`

**Tipo:** `AstroConfig`

Una copia de solo lectura de la [Astro config](/es/reference/configuration-reference/) proporcionada por el usuario . Esto se resuelve _antes_ de que se haya ejecutado cualquier otra integración. Si necesitas una copia de la configuración después de que todas las integraciones hayan completado sus actualizaciones de configuración, [vea el enlace `astro:config:done`](#astroconfigdone).

#### Opción `command`

**Tipo:** `'dev' / 'build'`

- `dev` - El proyecto se ejecuta con `astro dev` o `astro preview`
- `build` - El proyecto se ejecuta con `astro build`

#### Opción `updateConfig`

**Tipo:** `(newConfig: Record<string, any>) => void;`

Una función callback para actualizar la [Astro config](/es/reference/configuration-reference/) proporcionada por el usuario. Cualquier configuración que proporcione **se fusionará con la configuración de usuario + otras actualizaciones de configuración de integración,** ¡así que puede omitir claves!

Por ejemplo, supongamos que necesitas proporcionar un plugin de [Vite](https://vitejs.dev/) al proyecto del usuario:

```js
import bananaCSS from '@vitejs/official-banana-css-plugin';

export default {
  name: 'banana-css-integration',
  hooks: {
    'astro:config:setup': ({ updateConfig }) => {
      updateConfig({
        vite: {
          plugins: [bananaCSS()],
        }
      })
    }
  }
}
```

#### Opción `addRenderer`

**Tipo:** `(renderer:` [`AstroRenderer`](https://github.com/withastro/astro/blob/fdd607c5755034edf262e7b275732519328a33b2/packages/astro/src/%40types/astro.ts#L872-L883) `) => void;`
**Ejemplos:** [`lit`](https://github.com/withastro/astro/blob/main/packages/integrations/lit/src/index.ts), [`svelte`](https://github.com/withastro/astro/blob/main/packages/integrations/svelte/src/index.ts), [`react`](https://github.com/withastro/astro/blob/main/packages/integrations/react/src/index.ts), [`preact`](https://github.com/withastro/astro/blob/main/packages/integrations/preact/src/index.ts), [`vue`](https://github.com/withastro/astro/blob/main/packages/integrations/vue/src/index.ts), [`solid`](https://github.com/withastro/astro/blob/main/packages/integrations/solid/src/index.ts)

Una función callback para agregar un renderizador de framework (como React, Vue, Svelte, etc.). Puedes explorar los ejemplos y definiciones anteriores para obtener opciones más avanzadas, pero las 2 opciones principales que debes tener en cuenta son:

- `clientEntrypoint` - ruta a un archivo que se ejecuta en el cliente cada vez que se usa el componente. Esto es principalmente para renderizar o hidratar su componente con JS.
- `serverEntrypoint`: ruta a un archivo que ejecutará las solicitudes en el servidor o compilaciones estáticas cada vez que se usa el componente. Estos deben renderizar componentes a un marcado estático, con hooks para la hidratarlos cuando corresponda. [`renderToString` de React](https://reactjs.org/docs/react-dom-server.html#rendertostring) es un ejemplo clásico.

#### Opción `injectRoute`

**Tipo:** `({ pattern: string, entryPoint: string }) => void;`

Una función callback para inyectar rutas a un proyecto de Astro. Las rutas inyectadas pueden ser [páginas `.astro`](/es/core-concepts/astro-pages/) o [handlers de ruta `.js` y `.ts`](/es/core-concepts/astro-pages/#páginas-no-html).

`injectRoute` toma un objeto con un `pattern` y un `entryPoint`.

- `pattern` - es la ruta en el navegador, por ejemplo `/foo/bar`. Un `pattern` puede usar la sintaxis de ruta de archivo de Astro para indicar rutas dinámicas, por ejemplo `/foo/[bar]` o `/foo/[...bar]`. Tenga en cuenta que **no** se necesita una extensión de archivo en el `patrón`.
- `entryPoint`: un especificador de módulo simple que apunta hacia la página `.astro` o el controlador de ruta `.js`/`.ts` que maneja la ruta indicada en el `pattern`.

Ejemplo de uso:

```js
injectRoute({
  pattern: '/foo/[dynamic]',
  entryPoint: 'foo/dynamic-page.astro'
});
```

#### Opción `injectScript`

**Tipo:** `(stage: InjectedScriptStage, content: string) => void;`

Una función de callback para inyectar una cadena de contenido de JavaScript en cada página.

El **`stage`** indica cómo debe insertarse este script (el `contenido`). Algunas etapas permiten insertar scripts sin modificaciones, mientras que otras permiten la optimización durante [el paso de enpaquetamiento de Vite](https://vitejs.dev/guide/build.html):

- `"head-inline"`: Inyectado en una etiqueta de script en el `<head>` de cada página. **No** optimizado o resuelto por Vite.
- `"before-hydration"`: importado del lado del cliente, antes de que se ejecute el script de hidratación. Optimizado y resuelto por Vite.
- `"page"`: Similar a `head-inline`, excepto que Vite maneja el fragmento inyectado y lo incluye con cualquier otra etiqueta `<script>` definida dentro de los componentes de Astro en la página. El script se cargará con `<script type="module">` en la salida de la página final, optimizada y resuelta por Vite.
- `"page-ssr"`: importado como un módulo separado en el frontmatter de cada componente de página de Astro. Debido a que esta etapa importa el script, `Astro` global no está disponible y el script solo se ejecutará una vez cuando la `importación` se evalúe por primera vez.

    El uso principal de la etapa `page-ssr` es inyectar una `importación` de CSS en cada página para que Vite la optimice y la resuelva:
     ```js
     injectScript('page-ssr', 'importar "global-styles.css";');
     ```

### `astro:config:done`

**Hook anterior:** [`astro:config:setup`](#astroconfigsetup)

**Siguiente hook:** [`astro:server:setup`](#astroserversetup) cuando se ejecuta en modo "dev" o "vista previa", y [astro:build:start](#astrobuildstart) durante las compilaciones de producción

**Cuándo:** Después que la configuración de Astro se haya resuelto y otras integraciones hayan ejecutado sus hooks `astro:config:setup`.

**Por qué:** Para recuperar la configuración final para el uso en otros hooks.

```js
'astro:config:done'?: (options: { config: AstroConfig }) => void | Promise<void>;
```

#### `config` option

**Tipo:** `AstroConfig`

Una copia de solo lectura de [Astro config](/es/reference/configuration-reference/) proporcionada por el usuario. Esto se resuelve _después_ de que se hayan ejecutado otras integraciones.

### `astro:server:setup`

**Hook anterior:** [`astro:config:done`](#astroconfigdone)

**Siguiente hook:** [`astro:server:start`](#astroserverstart)

**Cuándo:** Justo después de que se crea el servidor Vite en modo "dev" o "vista previa", pero antes de que se dispare el evento `listen()`. [Consulte la API createServer de Vite](https://vitejs.dev/guide/api-javascript.html#createserver) para obtener más información.

**Por qué:** Para actualizar las opciones del servidor de Vite y el middleware.

```js
'astro:server:setup'?: (options: { server: vite.ViteDevServer }) => void | Promise<void>;
```

#### Opción `server`

**Tipo:** [`ViteDevServer`](https://vitejs.dev/guide/api-javascript.html#vitedevserver)

Una instancia mutable del servidor de Vite utilizada en modo "dev" y "vista previa". Por ejemplo, esto es [utilizado por nuestra integración Partytown](https://github.com/withastro/astro/tree/main/packages/integrations/partytown) para inyectar el servidor Partytown como middleware:

```js
import

'astro:server:setup': ({ server }) => {
  server.middlewares.use(
    partytownServer(partytownLibDirectory, {
      mount: '/~partytown',
      ...
    })
  );
}
```

### `astro:server:start`

**Hook anterior:** [`astro:server:setup`](#astroserversetup)

**Siguiente hook:** [`astro:servidor:hecho`](#astroserverdone)

**Cuándo:** Justo después de que se haya activado el evento `listen()` del servidor.

**Por qué:** Para interceptar solicitudes de red en la dirección especificada. Si tiene la intención de usar esta dirección para el middleware, considere usar `astro:server:setup` en su lugar.

```js
'astro:server:start'?: (options: { address: AddressInfo }) => void | Promise<void>;
```

#### Opción `address`

**Tipo:** [`AddressInfo`](https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules__types_node_net_d_._net_.addressinfo.html)

La dirección, la familia y el número de puerto proporcionados por el [módulo NodeJS Net](https://nodejs.org/api/net.html).

### `astro:server:done`

**Hook anterior:** [`astro:server:start`](#astroserverstart)

**Cuándo:** Justo después de que se cierre el servidor de desarrollo.

**Por qué:** Para ejecutar cualquier evento de limpieza, ejecutados durante los hooks `astro:server:setup` o `astro:server:start`.

```js
'astro:server:done'?: () => void | Promise<void>;
```

### `astro:build:start`

**Hook anterior:** [`astro:config:done`](#astroconfigdone)

**Siguiente hook:** [`astro:build:setup`](#astrobuildsetup)

**Cuándo:** Después del evento `astro:config:done`, pero antes de que comience la compilación de producción.

**Por qué:** Para configurar cualquier objeto global o cliente necesario durante la compilación a producción. Esto también puede ampliar las opciones de configuración de compilación de la [API del adaptador](/es/reference/adapter-reference/).

```js
'astro:build:start'?: (options: { buildConfig: BuildConfig }) => void | Promise<void>;
```

### `astro:build:setup`

**Hook anterior:** [`astro:build:start`](#astrobuildstart)

**Siguiente hook:** [`astro:build:ssr`](#astrobuildssr)

**Cuando:** Después del hook `astro:build:start`, se ejecuta inmediatamente antes de la compilación.

**Por qué:** En este punto, la configuración de Vite para la compilación se ha construido por completo, esta es su última oportunidad para modificarla. Esto puede ser útil, por ejemplo, para sobrescribir algunos valores predeterminados. Si no está seguro de si debe usar este hook o `astro:build:start`, use `astro:build:start` en su lugar.

```js
'astro:build:setup'?: (options: {
  vite: ViteConfigWithSSR;
  pages: Map<string, PageBuildData>;
  target: 'client' | 'server';
}) => void | Promise<void>;

```

### `astro:build:ssr`

**Hook anterior:** [`astro:build:setup`](#astrobuildsetup)

**Cuándo:** después que se completa la compilación de producción (SSG o SSR).

**Por qué:** Para obtener acceso al manifiesto de SSR, esto es útil al crear compilaciones de SSR personalizadas en plugins o integraciones.

```js
'astro:build:ssr'?: (options: { manifest: SerializedSSRManifest }) => void | Promise<void>;
```

### `astro:build:done`

**Hook anterior:** [`astro:build:ssr`](#astrobuildssr)

**Cuándo:** después de que se haya completado la compilación a producción (SSG o SSR).

**Por qué:** Para acceder a rutas y activos generados para extensión (p. ej., copiar contenido en la carpeta `/assets` generado). Si planeas transformar los activos generados, le recomendamos explorar la [API de plugin de Vite](https://vitejs.dev/guide/api-plugin.html) y [la configuración a través de `astro:config:setup`](#opción-updateconfig) en su lugar.

```js
'astro:build:done'?: (options: { dir: URL; routes: RouteData[] }) => void | Promise<void>;
```

#### Opción `dir`

**Tipo:** [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL)

La ruta URL a la carpeta de compilación. Tenga en cuenta que si necesitas una ruta absoluta válida como string, debes usar la utilidad [`fileURLToPath`](https://nodejs.org/api/url.html#urlfileurltopathurl) integrada de Node.

```js
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export default function myIntegration() {
  return {
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const metadata = await getIntegrationMetadata();
        // Use fileURLToPath para obtener una ruta absoluta multiplataforma válida como string
        const outFile = fileURLToPath(new URL('./my-integration.json', dir));
        await fs.writeFile(outFile, JSON.stringify(metadata));
      }
    }
  }
}
```

#### Opción `routes`

**Tipo:** [`RouteData[]`](https://github.com/withastro/astro/blob/main/packages/astro/src/%40types/astro.ts#L973)

Una lista de todas las rutas generadas junto con sus metadatos asociados. **¡Estará vacío cuando use un adaptador SSR!**

Puedes hacer referencia al tipo `RouteData` completo a continuación, pero las propiedades más comunes son:

- `component` - la ruta del archivo de entrada relativa a la raíz del proyecto
- `pathname` - la URL del archivo de salida (indefinido para rutas que usan parámetros `[dynamic]` y `[...spread]`)

**Referencia de tipo `RouteData`**

```ts
interface RouteData {
  /** Si una ruta es una página HTML o un endpoint no HTML */
  type: 'page' | 'endpoint';
  /** URL del componente */
  component: string;
  /**
    * URL donde se servirá esta ruta
    * nota: estará undefined para las rutas [dinámicas] y [...propagadas]
   */
  pathname?: string;
  /** 
    * regex utilizada para hacer coincidir una URL de entrada con una ruta solicitada
    * ex. "[fruit]/about.astro" generará el patrón: /^\/([^/]+?)\/about\/?$/
    * donde patrón.test("banana/about") es "true"
   */
  pattern: RegExp;
  /**
    * Parámetros de rutas dinámicas y propagadas
    * ex. "/pages/[lang]/[..slug].astro" generará los parámetros ['lang', '...slug']
   */
  params: string[];
  /**
   * Similar al campo "params", pero con más metadatos asociados
    * ex. "/pages/[lang]/index.astro" generará los segmentos
    * [[ { content: 'lang', dynamic: true, spread: false } ]]
   */
  segments: { content: string; dynamic: boolean; spread: boolean; }[][];
  /** 
    * Función para renderizar un componente en un lugar a partir de un conjunto de inputs.
    * Esto es típicamente para uso interno, ¡así que uselo con precaución!
   */
  generate: (data?: any) => string;
}
```

## Permitir la instalación con `astro add`

Una vez que [publiques tu integración en npm](https://docs.npmjs.com/cli/v8/commands/npm-publish), ejecutar `astro add example` instalará tu paquete con cualquier peer-dependencia especificada en tu `package .json`. Esto también aplicará tu integración al `astro.config` del usuario así:

```diff
// astro.config.mjs
import { defineConfig } from 'astro/config';
+ import example from 'example';

export default defineConfig({
+  integrations: [example()],
})
```

:::caution
Esto supone que la definición de la integración es 1) una exportación `predeterminada` y 2) una función. ¡Asegúrese de que esto sea cierto antes de agregar la palabra clave `astro-integration`!
:::

## Orden de integración

Todas las integraciones se ejecutan en el orden en que están configuradas. Por ejemplo, para el array `[react(), svelte()]` en `astro.config.*` de un usuario, `react` se ejecutará antes que `svelte`.

Idealmente, la integración debería ejecutarse en cualquier orden. Si esto no es posible, recomendamos documentar que su integración debe ser la primera o la última en el array de configuración de "integraciones" del usuario.

```js
integrations: [
  // Ejemplo: donde ejemploPreset() devuelve: [integraciónUno, integraciónDos, ...etc]
  examplePreset()
]
```
