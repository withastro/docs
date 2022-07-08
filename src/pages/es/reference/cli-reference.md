---
layout: ~/layouts/MainLayout.astro
title: Referencia del CLI
i18nReady: true
---

## Comandos

### `astro dev`

Ejecuta el servidor `dev` de Astro. Inicia un servidor HTTP que responde a las solicitudes de rutas o páginas que se especifican dentro de la carpeta `src/pages` (a menos que se anule la opción `pages` establecida en la [configuración](/en/reference/configuration-reference/) del proyecto ).

**Opciones**

#### `--port`

Especifica en qué puerto se ejecuta el servidor. El valor predeterminado es `3000`.

#### `--host [dirección de host opcional]`

Establece qué direcciones IP de red debe escuchar el servidor de desarrollo (es decir, direcciones IP que no son de localhost).
- `--host` - escucha todas las direcciones, incluidas LAN y direcciones públicas
- `--host [dirección personalizada]` - expone la dirección IP especificada en `[dirección personalizada]`

### `astro build`

Construye tu sitio para producción.

### `astro preview`

Inicia un servidor local para servir tus archivos estáticos compilados de la carpeta `dist/`. Útil para obtener una vista previa de su sitio web usando archivos de la compilación final, antes de desplegarla.

Este comando está destinado solo para pruebas locales y no está diseñado para ejecutarse en producción. Para obtener ayuda con el despliegue a producción, consulte nuestra guía sobre [implementación de un sitio web de Astro](/es/guides/deploy/).

### `astro check`

Ejecuta diagnósticos (como verificación de tipos dentro de archivos `.astro`) en tu proyecto y reporta errores a la consola. Si se encuentran errores, el proceso finalizará con el código **1**.

Este comando está diseñado para usarse CI workflows.

:::note
Este comando solo verifica los tipos dentro de los archivos `.astro`.
:::

📚 Lee más sobre la [compatibilidad con TypeScript en Astro](/es/guides/typescript/).

### `astro add`

Agrega una integración a tu configuración.

### `astro docs`

Inicia el sitio web de la documentación de Astro directamente desde la terminal.

### `astro telemetry`

Establece la configuración de telemetría para el usuario actual. La telemetría son datos anónimos que proporcionan información sobre qué features se utilizan con más frecuencia.

La telemetría se puede desactivar con este comando:

```shell
astro telemetry disable
```

La telemetría se puede volver a habilitar con:

```shell
astro telemetry enable
```

El comando `clear` restablece los datos de telemetría:

```shell
astro telemetry clear
```

:::tip[¿Quieres deshabilitar la telemetría en entornos CI?]
Asegúrese de agregar el comando `astro telemetry disabled` a tus scripts de CI.
:::

## Opciones globales

### `--config path`

Especifica la ruta al archivo de configuración. El valor predeterminado es `astro.config.mjs`. Use esta opción cuando usas un nombre diferente en el archivo de configuración o si tienes tu archivo de configuración en otra carpeta.

```shell
astro --config config/astro.config.mjs dev
```

### `--root path`

Especifica la ruta a la raíz del proyecto. Si no se especifica, se asume que la carpeta de trabajo actual es la raíz.

La raíz se utiliza para encontrar el archivo de configuración de Astro.

```shell
astro --root myRootFolder/myProjectFolder dev
```

### `--reload`

Borra el caché (las dependencias se crean dentro de las aplicaciones de Astro).

### `--verbose`

Habilita el registro detallado, que es útil al debugear un problema.

### `--silent`

Habilita el registro silencioso, que es útil cuando no deseas ver los registros de Astro.

### `--version`

Imprime el número de versión de Astro

### `--drafts`

Incluye páginas borrador de Markdown en la compilación final.

### `--help`

Imprime un mensaje de ayuda.
